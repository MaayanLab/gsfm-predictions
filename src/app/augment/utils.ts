import singleton from '@/lib/singleton';
import * as ort from 'onnxruntime-web';

export const base = 'https://s3.dev.maayanlab.cloud/gsfm'

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
type AsyncReturnType<T> = T extends (...args: any) => Promise<infer R> ? R : never

const max_gene_set_size = 512

export async function inferencGSFM(gene_set: string[]): Promise<{ predictions: any, inferenceTime: number }> {
  const geneVocab = await getGeneVocab()
  const geneSetTensor = await loadGSFMGeneSet(gene_set, geneVocab)
  const [logits, inferenceTime] = await runGSFMModel(geneSetTensor);
  const logitsMapped = logits.map((logit, i) => [geneVocab.index_to_token[i], logit] as const)
  logitsMapped.sort(([_a, aLogit], [_b, bLogit]) => bLogit - aLogit)
  const predictionsMappedSorted = logitsMapped.map(([gene, logit]) => [gene, sigmoid(logit)])
  return {
    predictions: Object.fromEntries(predictionsMappedSorted),
    inferenceTime,
  }
}

async function getGeneVocab() {
  return await singleton('geneVocab', async () => {
    const index_to_token = (await (await fetch(`${base}/vocab.txt`)).text()).split(/\r?\n/g)
    const token_to_index = Object.fromEntries(Object.entries(index_to_token).map(([index, token]) => [token, index]))
    return { index_to_token, token_to_index }
  })
}

async function loadGSFMGeneSet(gene_set: string[], gene_vocab: AsyncReturnType<typeof getGeneVocab>) {
  const gene_token_ids = new BigInt64Array(max_gene_set_size)
  for (let i = 0; i < Math.min(max_gene_set_size, gene_set.length); i++) {
    const gene = gene_set[i]
    if (gene in gene_vocab.token_to_index) {
      gene_token_ids[i] = BigInt(gene_vocab.token_to_index[gene])
    } else {
      gene_token_ids[i] = BigInt(gene_vocab.token_to_index['<unk>'])
    }
  }
  for (let i = gene_set.length; i < max_gene_set_size; i++) {
    gene_token_ids[i] = BigInt(gene_vocab.token_to_index['<pad>'])
  }
  return new ort.Tensor('int64', gene_token_ids, [1, max_gene_set_size])
}

async function runGSFMModel(preprocessedData: any): Promise<[number[], number]> {
  //https://onnxruntime.ai/docs/api/js/interfaces/InferenceSession.SessionOptions.html#graphOptimizationLevel
  const session = await singleton('gsfmSession', async () =>
    await ort.InferenceSession.create(
      `${base}/gsfm.onnx`,
      { executionProviders: ['webgl', 'wasm'], graphOptimizationLevel: 'all' }
    )
  );
  var [results, inferenceTime] =  await runInference(session, preprocessedData);
  return [results, inferenceTime];
}

async function runInference(session: ort.InferenceSession, preprocessedData: any): Promise<[any, number]> {
  const start = new Date();
  const output = (await session.run({
    [session.inputNames[0]]: preprocessedData,
  }))[session.outputNames[0]];
  const outputLogits = Array.prototype.slice.call(output.data);
  const end = new Date();
  const inferenceTime = (end.getTime() - start.getTime())/1000;
  return [outputLogits, inferenceTime];
}
