'use client'

import React from "react"
import trpc from '@/lib/trpc/client'
import downloadBlob from "@/components/downloadBlob"
import DataTable from "@/components/DataTable"
import { model_name } from "@/components/resources"
import ButtonWithIcon from "@/components/ButtonWithIcon"
import classNames from "classnames"

const gene_set_libraries = [
  "GO_Biological_Process_2025",
  "WikiPathway_2024_Human",
  "KEGG_2026",
  "MGI_Mammalian_Phenotype_Level_4_2024",
  "GWAS_Catalog_2025",
  "ChEA_2022",
]
const example = {
  gene_set: `TYROBP\nLILRB1\nSLC11A1\nTNFSF18\nFCER1G\nEIF2AK4\nMDK\nSEMA6D\nIFNA6\nIFNK\nIFNB1\nIFNA2\nIFNA14\nIFNA7\nIFNA1\nIFNE\nIFNA4\nIFNA5\nPLXNA1\nITGAL\nICAM1\nF2RL1\nTOX4\nCD74\nIFNA21\nIFNA8\nIFNW1\nIFNA16\nIFNA10\nIFNA17`,
  description: 'T Cell Activation Involved in Immune Response (GO:0002286)',
  gene_set_library_name: 'GO_Biological_Process_2025',
}

function Results(props: { model: string, description: string, gene_set_id: string, gene_set_library_id?: string, gene_set_library_name?: string }) {
  const [state, setState] = React.useState<{
    error?: string,
    status?: string | null,
    data?: {
        "Term": string;
        "es": number;
        "nes": number | null;
        "pval": number;
        "sidak": number;
        "geneset_size": number;
        "leading_edge": string;
        "plot": string;
    }[] | null,
  }>({})
  const results = trpc.enrich.useSubscription({
    model: props.model,
    gene_set_id: props.gene_set_id,
    gene_set_library_name: props.gene_set_library_name,
    gene_set_library_id: props.gene_set_library_id,
  }, {
    enabled: !!(props.gene_set_library_name || props.gene_set_library_id),
    onStarted: () => setState({ status: 'Submitting enrichment job...' }),
    onData: (newState) => setState(curState => ({
      error: newState.error ?? curState.error,
      status: newState.status ?? curState.status,
      data: newState.data ?? curState.data,
    })),
    onError: (error) => setState(curState => ({
      ...curState,
      error: error.message,
    })),
    onComplete: () => setState(({ status: _, ...curState }) => curState),
  })
  const downloadData = React.useCallback(() => {
    if (!state.data) return
    downloadBlob([
      ['term', 'es', 'nes', 'pval', 'geneset_size'].join('\t'),
      ...state.data.map((row) => [
        row.Term, row.es, row.nes, row.pval, row.geneset_size,
      ].join('\t')),
    ].join('\n'), `${props.model}-predictions.tsv`, 'text/tab-separated-values;charset=utf-8')
  }, [props.model, state.data])
  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="tabs tabs-lift tabs-xl">
        <button
          role="tab"
          className="tab cursor-auto"
        >
          Results
        </button>
        <div role="tabpanel" className="tab-content block p-0">
          <DataTable
            title={<>{props.description}</>}
            columns={{
              es: {th: <>ES</>, td: (cell: number) => cell.toPrecision(3)},
              pval: {th: <>PVal</>, td: (cell: number) => <span className="text-nowrap">{cell?.toPrecision(3)}</span>},
              geneset_size: {th: <>Gene Set</>, td: (cell: number, row) => <div className="tooltip" data-tip="Copy to clipboard"><button className="cursor-pointer active:font-bold text-left px-2 text-nowrap" onClick={evt => {navigator.clipboard.writeText(row.leading_edge.split(',').join('\n'))}}>{cell} genes</button></div>},
              nes: {th: <>NES</>, td: (cell: number | null) => cell?.toPrecision(3)},
              plot: {th: <>Plot</>, td: (cell: string, row) => {
                const [_0, plot, size] = /([\d,]*)\/(\d+)/.exec(cell) as RegExpExecArray
                const vlines = plot.split(',').map(pt => Number(pt)/Number(size))
                return (
                  <svg viewBox="0 0 16 3" className="w-32">
                    {vlines.map((x, i) =>
                      <line
                        key={i}
                        x1={x*16}
                        x2={x*16}
                        y1={0}
                        y2={3}
                        stroke={row.nes && row.nes < 0 ? 'blue' : 'red'}
                        strokeWidth={16/1000}
                      />)}
                  </svg>
                )
              }},
              Term: {th: <>SET</>, td: (cell: string, row) => <div className="tooltip w-full" data-tip="Copy to clipboard"><button className="cursor-pointer active:font-bold text-left px-2 w-full" onClick={evt => {navigator.clipboard.writeText(row.Term)}}>{cell}</button></div>},
            }}
            defaultOrderBy={'pval asc'}
            data={!!state.data ? state.data : []}
            isLoading={results.status !== 'idle'}
          />
          {(state.status || state.error) && <div className={classNames("alert rounded-t-none rounded-b-2xl flex flex-col", {'alert-error': state.error})}>
            {state.status && <>{state.status}</>}
            {state.error && <>Error: {state.error}</>}
          </div>}
        </div>
      </div>
      <ButtonWithIcon
        className={classNames("btn font-semibold", { 'btn-primary': !!state.data })}
        disabled={!state.data}
        onClick={downloadData}
        icon={<img src="/resources/DownloadIcon.svg" alt="" />}
      >Download result</ButtonWithIcon>
    </div>
  )

}

export default function EnrichPage() {
  const [geneSet, setGeneSet] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [geneSetLibraryName, setGeneSetLibraryName] = React.useState('GO_Biological_Process_2025')
  const [geneSetLibraryFile, setGeneSetLibraryFile] = React.useState<File | null>(null);
  const [model, setModel] = React.useState('gsfm-rummagene')
  const models = trpc.models.useQuery()
  const geneSetParsed = React.useMemo(() =>
    !geneSet ? [] : geneSet.split(/[\s\r?\n]+/g).filter(gene => !!gene)
  , [geneSet])
  const addList = trpc.addList.useMutation()
  const addLibrary = trpc.addLibrary.useMutation()
  const valid = React.useMemo(() => 
    geneSetParsed.length !== 0
    && (
      geneSetLibraryName !== ''
      || geneSetLibraryFile !== null
    ), [geneSetParsed, geneSetLibraryName, geneSetLibraryFile]
  )
  const [submitted, setSubmitted] = React.useState<React.ComponentProps<typeof Results>|null>(null)
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
        <div className="flex flex-row flex-wrap gap-8 self-stretch">
          <form className="flex-1 flex flex-col gap-8 items-stretch" onSubmit={evt => {
            evt.preventDefault()
            evt.stopPropagation()
            const gene_set = geneSet.split(/[\r\n]+/g)
            Promise.all([
              addList.mutateAsync({ gene_set }),
              (geneSetLibraryName === '' && geneSetLibraryFile !== null) ? addLibrary.mutateAsync(new FormData(evt.currentTarget)) : Promise.resolve(undefined),
            ] as const).then(([addListResult, addLibraryResult]) => {
              setSubmitted({
                model,
                description,
                gene_set_id: addListResult,
                gene_set_library_id: addLibraryResult,
                gene_set_library_name: geneSetLibraryName,
              })
            })
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
                  className="input h-72 w-full whitespace-pre border-none"
                  value={geneSet}
                  onChange={evt => {setGeneSet(evt.currentTarget.value)}}
                  placeholder={`Gene symbols line by line`}
                />
              </div>
            </div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-primary">Gene Set Description</legend>
              <input
                className="input w-full text-primary border-primary"
                value={description}
                onChange={evt => {setDescription(evt.currentTarget.value)}}
                placeholder="Gene set description"
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-primary">Gene Set Library</legend>
              <select
                className="select w-full text-primary border-primary"
                value={geneSetLibraryName}
                onChange={evt => {setGeneSetLibraryName(evt.currentTarget.value)}}
                name="gene_set_library_name"
              >
                {gene_set_libraries.map(gsl => <option key={gsl} value={gsl}>{gsl.replaceAll('_', ' ')}</option>)}
                <option value="" className="italic">Custom Upload</option>
              </select>
              {geneSetLibraryName === "" &&
                <input
                  type="file"
                  name="gene_set_library_file"
                  className="file-input text-primary"
                  onChange={evt => {
                    setGeneSetLibraryFile(evt.target.files?.item(0) ?? null)
                  }}
                />}
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-primary">Model Version</legend>
              <select
                className="select w-full text-primary border-primary"
                value={model}
                onChange={evt => {setModel(evt.currentTarget.value)}}
              >
                {models.isLoading && <option key="" value="">Loading...</option>}
                {models.data && models.data.map(({ model }) => <option key={model} value={model}>{model_name[model] ?? model}</option>)}
              </select>
            </fieldset>
            <div className="flex flex-row gap-2">
              <button
                type="button"
                className="btn bg-[#6992C8] text-white"
                onClick={evt => {
                  evt.preventDefault()
                  evt.stopPropagation()
                  setGeneSet(example.gene_set)
                  setGeneSetLibraryName(example.gene_set_library_name)
                  setDescription(example.description)
                }}>Example</button>
              <ButtonWithIcon
                className={classNames("btn font-semibold", { 'btn-primary': valid })}
                icon={<img src="/resources/RightArrowIcon.svg" alt="" />}
                type="submit"
                disabled={!valid}
              >Submit</ButtonWithIcon>
            </div>
          </form>
          {addList.isError && <div className="alert alert-error">{addList.error.message}</div>}
          {addLibrary.isError && <div className="alert alert-error">{addLibrary.error.message}</div>}
          {submitted && <div className="grow md:flex-3">
            <Results {...submitted} />
          </div>}
        </div>
      </div>
    </>
  )
}
