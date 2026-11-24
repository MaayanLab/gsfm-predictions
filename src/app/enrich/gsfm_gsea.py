import json
import typing as t

def _event(**kwargs):
  return (json.dumps(kwargs)+'\n').encode()

def _parse_gmt(gmt: str) -> dict[str, list[str]]:
  library = {}
  for line in gmt.split('\n'):
    line_split = line.rstrip('\r').split('\t')
    if len(line_split) < 3: continue
    term, _desc, *gene_set = line_split
    library[term] = [gene for gene in (gene.strip() for gene in gene_set) if gene]
  return library

def _load_library(gene_set_library_name: t.Optional[str], gene_set_library: t.Optional[str]):
  import blitzgsea as blitz
  if gene_set_library is not None:
    return _parse_gmt(gene_set_library)
  return blitz.enrichr.get_library(gene_set_library_name)

def _load_model(model):
  from gsfm import GSFM, Vocab
  vocab = Vocab.from_pretrained(model)
  gsfm = GSFM.from_pretrained(model)
  gsfm.eval()
  return vocab, gsfm

def _enrich_one(vocab, gsfm, library, input_gene_set: list[str]):
  import torch
  import numpy as np
  import pandas as pd
  import blitzgsea as blitz
  # convert gene set into signature with GSFM
  if not any(gene in vocab.lookup for gene in input_gene_set):
    raise ValueError('None of the genes in the gene set are recognized by the model')
  with torch.no_grad():
    token_ids = torch.tensor(vocab(input_gene_set))[None, :]
    logits = torch.squeeze(gsfm(token_ids))
  signature = pd.DataFrame(zip(vocab.vocab, logits.tolist()), columns=['i','v'])
  signature = signature[~signature['i'].isin(['<pad>', '<unk>'])]
  # perform GSEA
  results = blitz.gsea(signature, library, signature_cache=True, shared_null=True)
  results = results[results['pval']<0.05].replace([
    np.inf, -np.inf, np.nan,
    float('inf'), float('-inf'), float('nan')
  ], None)
  # from https://github.com/MaayanLab/blitzgsea/blob/main/blitzgsea/plot.py
  sig = signature.sort_values('v', ascending=False).set_index('i')
  sig = sig[~sig.index.duplicated(keep='first')]
  sig_genes = sig.index.tolist()
  plots = []
  for term in results.index.tolist():
    gs = set(library[term])
    plots.append(f"{','.join([str(i) for i,g in enumerate(sig_genes) if g in gs])}/{sig.shape[0]}")
  results['plot'] = plots
  return results.reset_index().to_dict(orient='records')

def enrich(*, model, input_gene_set: list[str], gene_set_library_name: t.Optional[str] = None, gene_set_library: t.Optional[str] = None):
  yield _event(status='Loading python modules...')
  import torch, numpy, pandas, blitzgsea
  yield _event(status='Loading gene set library...')
  library = _load_library(gene_set_library_name, gene_set_library)
  yield _event(status='Loading GSFM model...')
  vocab, gsfm = _load_model(model)
  yield _event(status='Performing GSFM GSEA...')
  data = _enrich_one(vocab, gsfm, library, input_gene_set)
  yield _event(status='', data=data)

def enrich_library(*, model, input_gene_set_library: str, enrich_gene_set_library_name: t.Optional[str] = None, enrich_gene_set_library: t.Optional[str] = None):
  ''' Batch mode: enrich every gene set in `input_gene_set_library` against the enrichment library,
  loading the model and enrichment library only once. Emits one event per input gene set.
  '''
  yield _event(status='Loading python modules...')
  import torch, numpy, pandas, blitzgsea
  yield _event(status='Loading input gene sets...')
  input_library = _parse_gmt(input_gene_set_library)
  if not input_library: raise ValueError('Input gene set library contains no gene sets')
  yield _event(status='Loading gene set library...')
  library = _load_library(enrich_gene_set_library_name, enrich_gene_set_library)
  yield _event(status='Loading GSFM model...')
  vocab, gsfm = _load_model(model)
  n = len(input_library)
  for i, (input_term, input_gene_set) in enumerate(input_library.items()):
    yield _event(status=f"Performing GSFM GSEA ({i+1}/{n})...", progress=dict(current=i, total=n))
    try:
      data = _enrich_one(vocab, gsfm, library, input_gene_set)
      yield _event(input_term=input_term, data=data)
    except Exception as e:
      # one bad input gene set shouldn't fail the whole batch
      yield _event(input_term=input_term, error=str(e))
  yield _event(status='', progress=dict(current=n, total=n))
