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
    <div className="shadow-lg p-4 w-96 flex flex-col overflow-hidden">
      <h3 className="text-xl text-wrap break-all">{props.source} ({props.count})</h3>
      <div className="overflow-auto flex-grow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Term</th>
              <th>Proba</th>
            </tr>
          </thead>
          <tbody>
            {predictions.isLoading && range(pageSize).map(p => <tr key={p} className="border border-gray-400 hover:bg-gray-400">
              <td className="w-full">Loading...</td>
              <td>&nbsp;</td>
            </tr>)}
            {predictions.data?.map(prediction =>
              <tr key={prediction.term} className={classNames("border border-gray-400 hover:bg-gray-400", { 'font-bold': prediction.known })}>
                <td className="w-full">{prediction.term}</td>
                <td>{prediction.proba.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-around">
        <button disabled={page <= 1} onClick={evt => {setPage(page => page - 1)}}>&lt;</button>
        {page}
        <button disabled={page*pageSize >= props.count} onClick={evt => {setPage(page => page + 1)}}>&gt;</button>
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
        <a href="/"><h1 className="text-4xl">Gene Set Foundation Model</h1></a>
      </header>
      <main className="mx-auto flex flex-col gap-4 items-center flex-grow">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row text-xl">
            <div className={classNames('border border-r-0', { 'border-red-400': !validGene })}>
              <input className="form-select p-2" type="text" value={gene} onChange={evt => {setGene(evt.currentTarget.value)}} list={geneAutocomplete.data ? "geneAutocomplete" : undefined} />
              <datalist id="geneAutocomplete">{geneAutocomplete.data?.map(suggestion => <option key={suggestion.gene}>{suggestion.gene}</option>)}</datalist>
            </div>
            <input
              className={classNames("border border-l-0 rounded-r-lg p-2 text-white bg-blue-900", { 'border-red-400': !validGene })}
              type="submit"
              disabled={!validGene}
              onClick={evt => {
                evt.preventDefault()
                router.push(`?q=${gene}`)
              }}
            ></input>
          </div>
          <button className="border rounded-lg self-start p-1" onClick={evt => {
            setGene('ACE2')
            router.push(`?q=ACE2`)
          }}>Example</button>
        </div>
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {sources.data?.map(({ source, count }) => <Predictions key={`${source}-${geneSearchParam}`} source={source} gene={geneSearchParam} count={Number(count)} />)}
        </div>
      </main>
      <footer className="bg-blue-900">
        <div className="h-32 container mx-auto flex flex-row flex-wrap justify-around items-center">
          <div className="flex flex-col">
            <a className="text-white" href="mailto:avi.maayan@mssm.edu">Contact Us</a>
            <a className="text-white" href="https://github.com/maayanlab/gsfm">Source Code</a>
          </div>
          <img className="w-48" src="https://rummagene.com/images/ismms_white.png" alt="icahn school of medicine at mount sinai center for bioinformatics" />
          <img className="w-48" src="https://rummagene.com/images/maayanlab_white.png" alt="ma'ayan lab" />
          <img className="w-48" src="https://rummagene.com/images/cc-by-nc-sa.png" alt="cc-by-4.0" />
        </div>
      </footer>
    </div>
  )
}
