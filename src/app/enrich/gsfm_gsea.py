def enrich(*, model, input_gene_set: list[str], gene_set_library: str):
  import io
  import json
  import torch
  import numpy as np
  import pandas as pd
  import blitzgsea as blitz
  # load library
  library = {
    term: list(gene_set)
    for line in gene_set_library.split('\n')
    for line_split in (line.split('\t'),)
    if len(line_split) >= 3
    for term, _desc, *gene_set in (line_split,)
  }
  # load model
  from gsfm import GSFM, Vocab
  vocab = Vocab.from_pretrained(model)
  gsfm = GSFM.from_pretrained(model)
  gsfm.eval()
  # convert gene set into signature with GSFM
  token_ids = torch.tensor(vocab(input_gene_set))[None, :]
  logits = torch.squeeze(gsfm(token_ids))
  signature = pd.DataFrame(zip(vocab.vocab, logits.tolist()))
  # perform GSEA
  results = blitz.gsea(signature, library)
  return results[results['pval']<0.05].replace([
    np.inf, -np.inf, np.nan,
    float('inf'), float('-inf'), float('nan')
  ], None).reset_index().to_dict(orient='records')
