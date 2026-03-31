'use client'

import React from "react"
import trpc from '@/lib/trpc/client'
import downloadBlob from "@/components/downloadBlob"
import DataTable from "@/components/DataTable"
import { model_name } from "@/components/resources"
import ButtonWithIcon from "@/components/ButtonWithIcon"
import classNames from "classnames"

const example = {
  gene_set: `TYROBP\nLILRB1\nSLC11A1\nTNFSF18\nFCER1G\nEIF2AK4\nMDK\nSEMA6D\nIFNA6\nIFNK\nIFNB1\nIFNA2\nIFNA14\nIFNA7\nIFNA1\nIFNE\nIFNA4\nIFNA5\nPLXNA1\nITGAL\nICAM1\nF2RL1\nTOX4\nCD74\nIFNA21\nIFNA8\nIFNW1\nIFNA16\nIFNA10\nIFNA17`,
  description: 'T Cell Activation Involved in Immune Response (GO:0002286)',
}

export default function EnrichPage() {
  const [geneSet, setGeneSet] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const [model, setModel] = React.useState('gsfm-rummagene')
  const models = trpc.models.useQuery()
  const geneSetParsed = React.useMemo(() =>
    !geneSet ? [] : geneSet.split(/[\s\r?\n]+/g).filter(gene => !!gene)
  , [geneSet])
  const predictions = trpc.enrich.useMutation()
  const downloadPredictions = React.useCallback(() => {
    if (!predictions.isSuccess) return
    downloadBlob([
      ['term', 'es', 'nes', 'pval', 'geneset_size'].join('\t'),
      ...predictions.data.map((row) => [
        row.Term, row.es, row.nes, row.pval, row.geneset_size,
      ].join('\t')),
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
            <h1>GSFM<br />Gene Set <span className="underline text-[#006DFF]">Enrichment</span> Analysis</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="prose prose-p:text-primary min-w-56">
              <p>Trained on millions of gene sets automatically extracted from PubMed Central (PMC) and raw RNA-seq data the Gene Expression Omnibus (GEO), GSFM learns to recover held-out genes from gene sets. The resulting model can be repurposed for Enrichment analysis.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch bg-white p-8 flex flex-col gap-12 items-start">
        <div className="prose prose-h1:font-semibold prose-h1:text-primary prose-h1:mb-3 prose-p:text-primary">
          <h1>Enrich your gene set</h1>
          <p>Submit your gene set to receive enrichment analysis results. This works by using GSFM assigned gene membership probabilities for a GSEA-like weighted random walk.</p>
        </div>
        <div className="flex flex-row gap-4 self-stretch">
          <form className="flex flex-col gap-8 items-stretch" onSubmit={evt => {
            evt.preventDefault()
            evt.stopPropagation()
            predictions.mutate(new FormData(evt.currentTarget))
          }}>
            <div role="tablist" className="tabs tabs-lift tabs-xl">
              <button
                role="tab"
                className="tab tab-active cursor-auto"
              >
                Enrich Gene Set
              </button>
              <div role="tabpanel" className="tab-content block">
                <textarea
                  name="input_gene_set"
                  className="input h-72 w-full whitespace-pre border-none"
                  value={geneSet}
                  onChange={evt => {setGeneSet(evt.currentTarget.value)}}
                  placeholder={`Gene symbols line by line`}
                />
              </div>
            </div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-primary">Gene Set Library</legend>
              <input
                type="file"
                name="gene_set_library"
                className="file-input text-primary"
                onChange={evt => {
                  setSelectedFile(evt.target.files?.item(0) ?? null)
                }}
              />
            </fieldset>
            <input
              className="input w-full text-primary border-primary"
              name="description"
              value={description}
              onChange={evt => {setDescription(evt.currentTarget.value)}}
              placeholder="Gene set description"
            />
            <select
              className="select w-full text-primary border-primary"
              value={model}
              onChange={evt => {setModel(evt.currentTarget.value)}}
              name="model"
            >
              {models.isLoading && <option key="" value="">Loading...</option>}
              {models.data && models.data.map(({ model }) => <option key={model} value={model}>{model_name[model] ?? model}</option>)}
            </select>
            <div className="flex flex-row gap-2">
              <button
                type="button"
                className="btn bg-[#6992C8] text-white"
                onClick={evt => {
                  evt.preventDefault()
                  evt.stopPropagation()
                  setGeneSet(example.gene_set);
                  setDescription(example.description)
                }}>Example</button>
              <ButtonWithIcon
                className={classNames("btn font-semibold", { 'btn-primary': !(geneSetParsed.length === 0 || selectedFile === null) })}
                icon={<img src="/resources/RightArrowIcon.svg" alt="" />}
                type="submit"
                disabled={(geneSetParsed.length === 0 || selectedFile === null)}
              >Submit</ButtonWithIcon>
            </div>
          </form>
          {predictions.status !== 'idle' && <div className="grow flex flex-col gap-4">
            <div role="tablist" className="tabs tabs-lift tabs-xl">
              <button
                role="tab"
                className="tab cursor-auto"
              >
                Results
              </button>
              <div role="tabpanel" className="tab-content block p-0">
                {predictions.isError && <div className="alert alert-error">{predictions.error.message}</div>}
                {
                  <DataTable
                    title={<>{description}</>}
                    columns={{
                      Term: {th: <>Term</>, td: (cell: string, row) => <button className="tooltip cursor-pointer active:font-bold" onClick={evt => {navigator.clipboard.writeText(row.Term)}} data-tip="Copy to clipboard">{cell}</button>},
                      es: {th: <>ES</>, td: (cell: number) => cell.toPrecision(3)},
                      nes: {th: <>NES</>, td: (cell: number | null) => cell?.toPrecision(3)},
                      pval: {th: <>PVal</>, td: (cell: number) => cell?.toPrecision(3)},
                      geneset_size: {th: <>Gene Set</>, td: (cell: number, row) => <button className="tooltip cursor-pointer active:font-bold" onClick={evt => {navigator.clipboard.writeText(row.leading_edge.split(',').join('\n'))}} data-tip="Copy to clipboard">{cell} genes</button>},
                    }}
                    defaultOrderBy={'pval asc'}
                    data={predictions.data ? predictions.data : []}
                    isLoading={predictions.isPending}
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
