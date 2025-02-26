'use client'
import trpc from '@/lib/trpc/client'
import classNames from 'classnames';
import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';

function range(n: number) {
  const L: number[] = []
  for (let i = 0; i < n; i++) L.push(i)
  return L
}

const icons = {
  LINCS_L1000_Chem_Pert_Consensus_Sigs: 'https://cfde-drc.s3.amazonaws.com/assets/img/LINCS-logo.png',
  LINCS_L1000_CRISPR_KO_Consensus_Sigs: 'https://cfde-drc.s3.amazonaws.com/assets/img/LINCS-logo.png',
  LINCS_L1000_Consensus_Median_Signatures: 'https://cfde-drc.s3.amazonaws.com/assets/img/LINCS-logo.png',
  ARCHS4_IDG_Coexp: 'https://data.cfde.cloud/img/IDG.png',
  GlyGen_Glycosylated_Proteins_2022: 'https://cfde-drc.s3.amazonaws.com/assets/img/glygen.png',
  GTEx_Aging_Signatures_2021: 'https://data.cfde.cloud/img/GTEx.png',
  GTEx_Tissues_V8_2023: 'https://data.cfde.cloud/img/GTEx.png',
  IDG_Drug_Targets_2022: 'https://data.cfde.cloud/img/IDG.png',
  MoTrPAC_Endurance_Trained_Rats_2023: 'https://data.cfde.cloud/img/MoTrPAC.png',
}

function Predictions(props: { source: string, gene: string, count: number }) {
  const pageSize = 8
  const [page, setPage] = React.useState(1)
  const predictions = trpc.predictions.useQuery({
    source: props.source,
    gene: props.gene,
    offset: (page-1)*pageSize,
    limit: pageSize,
  })
  return (
    <div className="border rounded-xl p-4 w-96 flex flex-col overflow-hidden">
      <div className="flex flex-row gap-2 align-center items-center">
        <div className="w-24 h-24 flex items-center">
          <img src={icons[props.source]} alt={props.source} />
        </div>
        <h3 className="text-wrap">{props.source.replaceAll('_', ' ')}</h3>
      </div>
      <div className="overflow-auto flex-grow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Term</th>
              <th>Proba</th>
            </tr>
          </thead>
          <tbody>
            {predictions.isLoading && range(pageSize).map(p => <tr key={p} className="hover:bg-base-200">
              <td className="w-full">Loading...</td>
              <td>&nbsp;</td>
            </tr>)}
            {predictions.data?.map(prediction =>
              <tr key={prediction.term} className={classNames("hover:bg-base-200", { 'font-bold': prediction.known })}>
                <td className="w-full">{prediction.term}</td>
                <td>{prediction.proba.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="join items-center justify-center">
        {page > 2 && <button className="join-item btn" onClick={evt => {setPage(page => 1)}}>1</button>}
        {page > 3 && <button className="join-item btn btn-disabled">...</button>}
        {page > 1 && <button className="join-item btn" onClick={evt => {setPage(page => page - 1)}}>{page - 1}</button>}
        <button className="join-item btn btn-active">{page}</button>
        {page*pageSize < props.count && <button className="join-item btn" onClick={evt => {setPage(page => page + 1)}}>{page + 1}</button>}
        {(page+2)*pageSize < props.count && <button className="join-item btn btn-disabled">...</button>}
        {(page+1)*pageSize < props.count && <button className="join-item btn" onClick={evt => {setPage(page => Math.ceil(props.count/pageSize))}}>{Math.ceil(props.count/pageSize)}</button>}
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const geneSearchParam = React.useMemo(() => searchParams.get('q') ?? '', [searchParams])
  const [gene,setGene] = React.useState('')
  const geneAutocomplete = trpc.gene_autocomplete.useQuery(gene, { enabled: gene.length > 0 })
  const validGene = React.useMemo(() => geneAutocomplete.data?.some(suggestion => suggestion.gene === gene), [geneAutocomplete.data, gene])
  const sources = trpc.sources.useQuery(geneSearchParam, { enabled: !!geneSearchParam })
  React.useEffect(() => {setGene(geneSearchParam)}, [geneSearchParam])
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <header className="m-2">
        <div className="navbar bg-base-100">
          <a className="btn btn-ghost text-xl" href="/">Gene Set Foundation Model</a>
        </div>
      </header>
      <main className="mx-auto flex flex-col gap-4 items-center flex-grow">
        <div className="flex flex-col gap-1">
          <div className={classNames('border join', { 'border-red-400': !validGene })}>
            <div className="join-item">
              <input className="input" type="text" value={gene} onChange={evt => {setGene(evt.currentTarget.value)}} list={geneAutocomplete.data ? "geneAutocomplete" : undefined} />
              <datalist id="geneAutocomplete">{geneAutocomplete.data?.map(suggestion => <option key={suggestion.gene}>{suggestion.gene}</option>)}</datalist>
            </div>
            <input
              className="btn join-item"
              type="submit"
              disabled={!validGene}
              onClick={evt => {
                evt.preventDefault()
                router.push(`?q=${gene}`)
              }}
            ></input>
            <button className="btn join-item" onClick={evt => {
              setGene('ACE2')
              router.push(`?q=ACE2`)
            }}>Example</button>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {sources.data?.map(({ source, count }) => <Predictions key={`${source}-${geneSearchParam}`} source={source} gene={geneSearchParam} count={Number(count)} />)}
        </div>
      </main>
      <footer className="footer bg-neutral text-neutral-content p-10">
        <nav className="place-self-center">
          <a className="link link-hover" href="mailto:avi.maayan@mssm.edu">Contact Us</a>
          <a className="link link-hover" href="https://github.com/maayanlab/gsfm" target='_blank'>Source Code</a>
        </nav>
        <nav className="place-self-center">
          <a href="https://icahn.mssm.edu/research/portal?tab=Labs" target='_blank'><img className="w-48" src="https://rummagene.com/images/ismms_white.png" alt="icahn school of medicine at mount sinai center for bioinformatics" /></a>
        </nav>
        <nav className="place-self-center">
          <a href="https://labs.icahn.mssm.edu/maayanlab/" target='_blank'><img className="w-48" src="https://rummagene.com/images/maayanlab_white.png" alt="ma'ayan lab" /></a>
        </nav>
        <nav className="place-self-center">
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target='_blank'><img className="w-48" src="https://rummagene.com/images/cc-by-nc-sa.png" alt="cc-by-4.0" /></a>
        </nav>
      </footer>
    </div>
  )
}
