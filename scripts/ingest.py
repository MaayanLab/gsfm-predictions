import os
import csv
import json
import pathlib
import psycopg2
import numpy as np
import pandas as pd
import pickle
import click
import multiprocessing as mp
from dotenv import load_dotenv; load_dotenv()
from tqdm.auto import tqdm
from df2pg import copy_from_records, copy_from_df

@click.group()
def cli(): pass

def generate_gene_records(preds: pathlib.Path):
  genes = set()
  for pred in tqdm((preds/'GWAS_Catalog_2025.gmt').rglob('preds.tsv')):
    with open(pred, 'r') as fr:
      reader = csv.reader(fr, delimiter='\t')
      _, *_terms = next(iter(reader))
      for gene, *_logits in tqdm(reader, desc=pred.stem):
        genes.add(gene)
  #
  if '<unk>' in genes: genes.remove('<unk>')
  if '<pad>' in genes: genes.remove('<pad>')
  with open('data/deepdive_gpt4o_markdown_descriptions.pkl', 'rb') as fr:
    deepdive_gpt4o_descriptions = pickle.load(fr)
  with open('data/deepdive_gemini_markdown_descriptions.pkl', 'rb') as fr:
    deepdive_gemini_descriptions = pickle.load(fr)
  ncbi = pd.read_csv('data/Homo_sapiens.gene_info.complete.tsv', sep='\t').groupby('Symbol').first().to_dict('index')
  for gene in genes:
    try: gene_info = ncbi[gene]
    except KeyError: gene_info = {}
    yield dict(
      symbol=gene,
      name=gene_info.get('description'),
      description=gene_info.get('summary'),
      deepdive_gpt4o_description=json.dumps(deepdive_gpt4o_descriptions.get(gene)),
      deepdive_gemini_description=json.dumps(deepdive_gemini_descriptions.get(gene)),
    )

@cli.command()
@click.option('--preds', required=True, type=click.Path(dir_okay=True, exists=True, path_type=pathlib.Path))
def genes(preds: pathlib.Path):
  con = psycopg2.connect(os.environ['DATABASE_URL'])
  copy_from_records(
    con=con,
    table='app.gene',
    records=generate_gene_records(preds),
    on=dict(conflict=('symbol',), update=True),
  )
  con.commit()

def generate_preds_for(base: pathlib.Path):
  df_perf = pd.read_csv(base/'eval.tsv', sep='\t').groupby(['name', 'library', 'term'])['roc_auc'].agg('median').reset_index().set_index('term')
  model = df_perf.iloc[0]['name'].partition('/')[-1]
  library = pathlib.Path(df_perf.iloc[0]['library'])
  df_perf.drop(['name', 'library'], inplace=True, axis=1)
  source = library.stem
  #
  df_logits = pd.read_csv(base/'preds.tsv', sep='\t', index_col=0).drop(['<unk>', '<pad>'])
  df_logits.rename_axis('gene', axis=0, inplace=True)
  df_logits.rename_axis('term', axis=1, inplace=True)
  df_odds = np.exp(df_logits)
  df_proba = df_odds / (1+df_odds)
  df_zscore = (df_logits - df_logits.mean(axis=0))/df_logits.std(axis=0)
  inclusion = (df_logits > 0) | (df_zscore > 1.645)
  df_rank = df_logits[inclusion].rank(ascending=False, axis=0, method='min')
  df_rank_T = df_logits[inclusion].rank(ascending=False, axis=1, method='min')
  perf_records = pd.concat({
    'roc_auc': df_perf['roc_auc'],
    'genes_with_term_predicted': (inclusion).sum(),
    'genes_with_term_in_top_10': (df_rank_T <= 10).sum(),
  }, axis=1).rename_axis('term').reset_index().dropna()
  del df_perf
  del df_rank_T
  pred_records = pd.concat([
    df_proba[inclusion].stack().rename('proba'),
    df_zscore[inclusion].stack().rename('zscore'),
    df_rank[inclusion].stack().rename('rank'),
  ], axis=1).reset_index().dropna()
  del df_proba
  del df_zscore
  del df_rank
  #
  gmt = {}
  with open(library, 'r') as fr:
    for line in fr:
      term, desc, *gene_set = line.rstrip('\r\n').split('\t')
      gmt[term] = set(filter(None, gene_set))
  pred_records['known'] = pred_records.apply(lambda row: int(row['gene'] in gmt[row['term']]), axis=1)
  perf_records['model'] = model
  perf_records['source'] = source
  pred_records['model'] = model
  pred_records['source'] = source
  return pred_records.dropna(), perf_records.dropna()

def generate_pred_perf_records(base):
  con = psycopg2.connect(os.environ['DATABASE_URL'])
  pred_records, perf_records = generate_preds_for(base)
  copy_from_df(
    con=con,
    table='app.prediction',
    df=pred_records,
    native=False,
    on=dict(conflict=('model', 'source', 'gene', 'term',), update=False),
  )
  copy_from_df(
    con=con,
    table='app.performance',
    df=perf_records,
    native=False,
    on=dict(conflict=('model', 'source', 'term',), update=False),
  )
  con.commit()

@cli.command()
@click.option('--preds', required=True, type=click.Path(dir_okay=True, exists=True, path_type=pathlib.Path))
def predictions(preds: pathlib.Path):
  with mp.Pool(processes=3) as p:
    for _ in tqdm(p.imap_unordered(
      generate_pred_perf_records,
      (f.parent for f in preds.rglob('preds.tsv'))
    )):
      pass


if __name__ == '__main__':
  cli()
