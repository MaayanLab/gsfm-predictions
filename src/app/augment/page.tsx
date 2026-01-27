'use client'

import React from "react"
import trpc from '@/lib/trpc/client'
import downloadBlob from "@/components/downloadBlob"
import DataTable from "@/components/DataTable"
import { model_name } from "@/components/resources"
import ButtonWithIcon from "@/components/ButtonWithIcon"

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
  }, [model, predictions])
  return (
    <>
      <div
        style={{
          position: 'relative',
          height:'450px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '0px',
            top: '-410px',
            height: '630px',
            width: '630px',
            backgroundImage: 'url("/resources/AboutHeroRight.svg")',
          }}
        />
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute',
            bottom: '-410px',
            height: '630px',
            width: '630px',
            backgroundImage: 'url("/resources/AboutHeroLeft.svg")',
          }}
        />
        <div className="flex flex-row p-36 gap-36 place-items-center align-center">
          <div className="prose prose-h1:text-primary prose-h1:font-normal prose-h1:text-6xl">
            <h1>GSFM<br /><span className="underline text-[#006DFF]">Augment</span></h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="prose prose-p:text-primary min-w-56">
              <p>Trained on millions of gene sets automatically extracted from PubMed Central (PMC) and raw RNA-seq data the Gene Expression Omnibus (GEO), GSFM learns to recover held-out genes from gene sets. The resulting model exhibits state-of-the-art performance in the task of gene function prediction.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch bg-white p-8 flex flex-col gap-12 items-start">
        <div className="prose prose-h1:font-semibold prose-h1:text-primary prose-h1:mb-3 prose-p:text-primary">
          <h1>Start augmenting your gene set</h1>
          <p>Submit your gene set to receive additional genes most relevant to the input gene set.</p>
        </div>
        <div className="flex flex-row gap-4 self-stretch">
          <div className="flex flex-col gap-8 items-stretch">
            <div role="tablist" className="tabs tabs-lift tabs-xl">
              <button
                role="tab"
                className="tab tab-active cursor-auto"
              >
                Augment Gene Set
              </button>
              <div role="tabpanel" className="tab-content block">
                {/* TODO: line indicator */}
                <textarea
                  className="input h-72 w-full whitespace-pre border-none"
                  value={geneSet}
                  onChange={evt => {setGeneSet(evt.currentTarget.value)}}
                  placeholder={`Gene symbols line by line`}
                />
              </div>
            </div>
            <input
              className="input w-full text-primary border-primary"
              value={description}
              onChange={evt => {setDescription(evt.currentTarget.value)}}
              placeholder="Gene set description"
            />
            <select
              className="select w-full text-primary border-primary"
              value={model}
              onChange={evt => {setModel(evt.currentTarget.value)}}
            >
              {models.isLoading && <option key="" value="">Loading...</option>}
              {models.data && models.data.map(({ model }) => <option key={model} value={model}>{model_name[model] ?? model}</option>)}
            </select>
            <div className="flex flex-row gap-2">
              <button className="btn bg-[#6992C8] text-white" onClick={evt => {setGeneSet(example.gene_set); setDescription(example.description)}}>Example</button>
              <ButtonWithIcon
                className="btn btn-primary font-semibold"
                icon={<img src="/resources/RightArrowIcon.svg" alt="" />}
                onClick={evt => predictions.mutate({ model, gene_set: geneSetParsed, description })} disabled={!(geneSetParsed.length <= 512)}
              >Submit</ButtonWithIcon>
            </div>
          </div>
          {predictions.status !== 'idle' && <div className="grow flex flex-col gap-4">
            <div role="tablist" className="tabs tabs-lift tabs-xl">
              <button
                role="tab"
                className="tab cursor-auto"
              >
                Results
              </button>
              <div role="tabpanel" className="tab-content block p-0">
                {predictions.isPending && <div className="flex-auto">Loading...</div>}
                {predictions.isError && <div className="alert alert-error">{predictions.error.message}</div>}
                {predictions.isSuccess &&
                  <DataTable
                    title={<>{description}</>}
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
              </div>
            </div>
            <ButtonWithIcon
              className="btn btn-primary font-semibold"
              disabled={!predictions.isSuccess}
              onClick={downloadPredictions}
              icon={<img src="/resources/DownloadIcon.svg" alt="" />}
            >Download result</ButtonWithIcon>
          </div>}
        </div>
      </div>
    </>
  )
}
