import json
import typing as t

def enrich(*, model, input_gene_set: list[str], gene_set_library_name: t.Optional[str] = None, gene_set_library: t.Optional[str] = None):
  yield (json.dumps(dict(status='Starting...'))+'\n').encode()
  import torch
  import numpy as np
  import pandas as pd
  import blitzgsea as blitz
  # load library
  yield (json.dumps(dict(status='Loading gene set library...'))+'\n').encode()
  library = {
    term: list(gene_set)
    for line in gene_set_library.split('\n')
    for line_split in (line.split('\t'),)
    if len(line_split) >= 3
    for term, _desc, *gene_set in (line_split,)
  } if gene_set_library is not None else blitz.enrichr.get_library(gene_set_library_name)
  # load model
  yield (json.dumps(dict(status='Loading GSFM model...'))+'\n').encode()
  from gsfm import GSFM, Vocab
  vocab = Vocab.from_pretrained(model)
  gsfm = GSFM.from_pretrained(model)
  gsfm.eval()
  # convert gene set into signature with GSFM
  yield (json.dumps(dict(status='Generating GSFM signature...'))+'\n').encode()
  token_ids = torch.tensor(vocab(input_gene_set))[None, :]
  logits = torch.squeeze(gsfm(token_ids))
  signature = pd.DataFrame(zip(vocab.vocab, logits.tolist()))
  # perform GSEA
  yield (json.dumps(dict(status='Performing GSEA...'))+'\n').encode()
  results = blitz.gsea(signature, library, signature_cache=True, shared_null=True)
  yield (json.dumps(dict(status='', data=results[results['pval']<0.05].replace([
    np.inf, -np.inf, np.nan,
    float('inf'), float('-inf'), float('nan')
  ], None).reset_index().to_dict(orient='records')))+'\n').encode()
