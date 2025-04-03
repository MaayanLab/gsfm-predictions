#!/bin/sh

mkdir -p model
if [ ! -f model/vocab.txt ]; then curl -LO https://s3.dev.maayanlab.cloud/gsfm/vocab.txt; fi
if [ ! -f model/gsfm.onnx ]; then curl -LO https://s3.dev.maayanlab.cloud/gsfm/gsfm.onnx; fi

MODEL_PATH=$(pwd)/model $@
