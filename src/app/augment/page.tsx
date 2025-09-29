'use client'

import React from "react"
import trpc from '@/lib/trpc/client'
import downloadBlob from "@/components/downloadBlob"
import DataTable from "@/components/DataTable"
import { model_name } from "@/components/resources"

const example = {
  gene_set: `TYROBP\nLILRB1\nSLC11A1\nTNFSF18\nFCER1G\nEIF2AK4\nMDK\nSEMA6D\nIFNA6\nIFNK\nIFNB1\nIFNA2\nIFNA14\nIFNA7\nIFNA1\nIFNE\nIFNA4\nIFNA5\nPLXNA1\nITGAL\nICAM1\nF2RL1\nTOX4\nCD74\nIFNA21\nIFNA8\nIFNW1\nIFNA16\nIFNA10\nIFNA17`,
  description: 'T Cell Activation Involved in Immune Response (GO:0002286)',
}

export default function AugmentPage() {
  const [geneSet, setGeneSet] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [model, setModel] = React.useState('gsfm-rummagene')
  const models = trpc.models.useQuery()
  const geneSetParsed = React.useMemo(() =>
    !geneSet ? [] : geneSet.split(/[\s\r?\n]+/g).filter(gene => !!gene)
  , [geneSet])
  const predictions = trpc.augment.useMutation()
  const downloadPredictions = React.useCallback(() => {
    if (!predictions.isSuccess) return
    downloadBlob([
      ['Gene', 'Score', 'Known'].join('\t'),
      ...Object.entries(predictions.data.predictions).map(([gene, score]) => [gene, `${score}`, predictions.variables.gene_set.includes(gene) ? 1 : 0].join('\t')),
    ].join('\n'), `${model}-predictions.tsv`, 'text/tab-separated-values;charset=utf-8')
  }, [predictions])
  return (
    <>
      <div className="prose text-justify">
        <p>Trained on millions of gene sets automatically extracted from literature and raw RNA-seq data, GSFM learns to recover held-out genes from gene sets. The resulting model exhibits state of the art performance on gene function prediction.</p>
        <p>Submit your set of known genes and get predictions for missing genes in the set.</p>
        <p>NOTE: The maximum gene set size is currently 512 genes.</p>
      </div>
      <div className="flex flex-row flex-wrap gap-4 justify-center">
        <fieldset className="fieldset w-80">
          <legend className="fieldset-legend text-lg">Augment Gene Set</legend>
          <textarea
            className="input h-72 whitespace-pre"
            value={geneSet}
            onChange={evt => {setGeneSet(evt.currentTarget.value)}}
            placeholder={`Gene\nSymbols\nLine\nBy\nLine\n...`}
          />
          <input
            className="input"
            value={description}
            onChange={evt => {setDescription(evt.currentTarget.value)}}
            placeholder="Gene set description"
          />
          <select
            className="select"
            value={model}
            onChange={evt => {setModel(evt.currentTarget.value)}}
          >
            {models.isLoading && <option key="" value="">Loading...</option>}
            {models.data && models.data.map(({ model }) => <option key={model} value={model}>{model_name[model] ?? model}</option>)}
          </select>
          <button className="btn" onClick={evt => {setGeneSet(example.gene_set); setDescription(example.description)}}>Example</button>
          <button className="btn btn-primary" onClick={evt => predictions.mutate({ model, gene_set: geneSetParsed, description })} disabled={!(geneSetParsed.length <= 512)}>Submit</button>
          <button className="btn btn-success" disabled={!predictions.isSuccess} onClick={downloadPredictions}>Download Results</button>
        </fieldset>
        <fieldset className="fieldset min-w-72">
          <legend className="fieldset-legend text-lg">Results</legend>
            {predictions.isPending && <div className="flex-auto">Loading...</div>}
            {predictions.isError && <div className="alert alert-error">{predictions.error.message}</div>}
            {predictions.isSuccess &&
              <DataTable
                columns={{
                  gene: {th: <>Gene</>, td: (gene: string) => gene},
                  score: {th: <>Score</>, td: (score: number) => score.toPrecision(3)},
                  known: {th: <>Known</>, td: (known: number) => known},
                }}
                defaultOrderBy={'score desc'}
                data={Object.entries(predictions.data.predictions).map(([gene, score]) => ({
                  gene,
                  score,
                  known: predictions.variables.gene_set.includes(gene) ? 1 : 0
                }))}
              />}
          </fieldset>
      </div>
    </>
  )
}
