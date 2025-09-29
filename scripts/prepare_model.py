import torch
import pathlib
import numpy as np
from gsfm import GSFM, Vocab

for model in ['gsfm-rummagene', 'gsfm-rummage', 'gsfm-rummageo']:
  vocab = Vocab.from_pretrained(f"maayanlab/{model}")
  gsfm = GSFM.from_pretrained(f"maayanlab/{model}")

  input_sample = np.random.choice(
    vocab(vocab.vocab),
    size=(1,512)
  )
  pathlib.Path(f"data/model/{model}").mkdir(parents=True, exist_ok=True)
  gsfm.to_onnx(f"data/model/{model}/gsfm.onnx", torch.tensor(input_sample), export_params=True)
  vocab.save_txt(f"data/model/{model}/vocab.txt")
