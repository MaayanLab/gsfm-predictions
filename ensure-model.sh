#!/bin/sh

mkdir -p data/model/gsfm-rummagene
if [ ! -f data/model/gsfm-rummagene/vocab.txt ]; then curl -L https://s3.dev.maayanlab.cloud/gsfm/gsfm-rummagene/vocab.txt -o data/model/gsfm-rummagene/vocab.txt; fi
if [ ! -f data/model/gsfm-rummagene/gsfm.onnx ]; then curl -L https://s3.dev.maayanlab.cloud/gsfm/gsfm-rummagene/gsfm.onnx -o data/model/gsfm-rummagene/gsfm.onnx; fi
mkdir -p data/model/gsfm-rummageo
if [ ! -f data/model/gsfm-rummageo/vocab.txt ]; then curl -L https://s3.dev.maayanlab.cloud/gsfm/gsfm-rummageo/vocab.txt -o data/model/gsfm-rummageo/vocab.txt; fi
if [ ! -f data/model/gsfm-rummageo/gsfm.onnx ]; then curl -L https://s3.dev.maayanlab.cloud/gsfm/gsfm-rummageo/gsfm.onnx -o data/model/gsfm-rummageo/gsfm.onnx; fi
mkdir -p data/model/gsfm-rummage
if [ ! -f data/model/gsfm-rummage/vocab.txt ]; then curl -L https://s3.dev.maayanlab.cloud/gsfm/gsfm-rummage/vocab.txt -o data/model/gsfm-rummage/vocab.txt; fi
if [ ! -f data/model/gsfm-rummage/gsfm.onnx ]; then curl -L https://s3.dev.maayanlab.cloud/gsfm/gsfm-rummage/gsfm.onnx -o data/model/gsfm-rummage/gsfm.onnx; fi

MODEL_PATH=$(pwd)/data/model $@
