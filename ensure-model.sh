#!/bin/sh

mkdir -p model
if [ ! -f model/vocab.txt ]; then curl -L https://s3.dev.maayanlab.cloud/gsfm/vocab.txt -o model/vocab.txt; fi
if [ ! -f model/gsfm.onnx ]; then curl -L https://s3.dev.maayanlab.cloud/gsfm/gsfm.onnx -o model/gsfm.onnx; fi

MODEL_PATH=$(pwd)/model $@
