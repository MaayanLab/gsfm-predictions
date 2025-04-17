'use client'

import React from "react"
import trpc from '@/lib/trpc/client'
import downloadBlob from "@/components/downloadBlob"
import DataTable from "@/components/DataTable"

const example = {
  gene_set: `TYROBP\nLILRB1\nSLC11A1\nTNFSF18\nFCER1G\nEIF2AK4\nMDK\nSEMA6D\nIFNA6\nIFNK\nIFNB1\nIFNA2\nIFNA14\nIFNA7\nIFNA1\nIFNE\nIFNA4\nIFNA5\nPLXNA1\nITGAL\nICAM1\nF2RL1\nTOX4\nCD74\nIFNA21\nIFNA8\nIFNW1\nIFNA16\nIFNA10\nIFNA17`,
  description: 'T Cell Activation Involved in Immune Response (GO:0002286)',
}

export default function AugmentPage() {
  const [geneSet, setGeneSet] = React.useState('')
  const [description, setDescription] = React.useState('')
  const geneSetParsed = React.useMemo(() =>
    !geneSet ? [] : geneSet.split(/[\s\r?\n]+/g).filter(gene => !!gene)
  , [geneSet])
  const predictions = trpc.augment.useMutation()
  const downloadPredictions = React.useCallback(() => {
    if (!predictions.isSuccess) return
    downloadBlob([
      ['Gene', 'Score', 'Known'].join('\t'),
      ...Object.entries(predictions.data.predictions).map(([gene, score]) => [gene, `${score}`, predictions.variables.gene_set.includes(gene) ? 1 : 0].join('\t')),
    ].join('\n'), 'predictions.tsv', 'text/tab-separated-values;charset=utf-8')
  }, [predictions])
  return (
    <>
      <div className="prose text-justify">
        <p>Trained on millions of gene sets automatically extracted from literature and raw RNA-seq data, GSFM learns to recover held-out genes from gene sets. The resulting model exhibits state of the art performance on gene function prediction.</p>
        <p>Submit your set of known genes and get predictions for missing genes in the set.</p>
        <p>NOTE: The maximum gene set size is currently 512 genes.</p>
      </div>
      <div className="flex flex-col gap-2">
        <fieldset className="fieldset w-80">
          <legend className="fieldset-legend text-lg">Augment Gene Set</legend>
          <textarea
            className="input h-48 whitespace-pre"
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
          <button className="btn" onClick={evt => {setGeneSet(example.gene_set); setDescription(example.description)}}>Example</button>
          <button className="btn btn-primary" onClick={evt => predictions.mutate({ gene_set: geneSetParsed, description })} disabled={!(geneSetParsed.length <= 512)}>Submit</button>
          <button className="btn btn-success" disabled={!predictions.isSuccess} onClick={downloadPredictions}>Download Results</button>
        </fieldset>
        {predictions.isPending && <>Loading...</>}
        {predictions.isError && <div className="alert alert-error">{predictions.error.message}</div>}
        {predictions.isSuccess && <div>
          <fieldset className="fieldset w-80">
          <legend className="fieldset-legend text-lg">Results</legend>
            <DataTable
              columns={{
                gene: <>Gene</>,
                score: <>Score</>,
                known: <>Known</>,
              }}
              data={Object.entries(predictions.data.predictions).map(([gene, score]) => ({ gene, score: score.toPrecision(3), known: predictions.variables.gene_set.includes(gene) ? 1 : 0 }))}
            />
          </fieldset>
        </div>}
      </div>
    </>
  )
}
