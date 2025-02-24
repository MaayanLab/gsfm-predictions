'use client'
import trpc from '@/lib/trpc/client'
import React from 'react';

function Predictions(props: { source: string, gene: string, count: number }) {
  const pageSize = 10
  const [page, setPage] = React.useState(1)
  const predictions = trpc.predictions.useQuery({
    source: props.source,
    gene: props.gene,
    offset: (page-1)*pageSize,
    limit: pageSize,
  })
  return (
    <table>
      <thead>
        <tr>
          <th>Term</th>
          <th>Proba</th>
        </tr>
      </thead>
      <tbody>
        {predictions.isLoading && <tr><td colSpan={2}>Loading...</td></tr>}
        {predictions.data?.map(prediction => <tr key={prediction.term}><td>{prediction.term}</td><td>{prediction.proba}</td></tr>)}
      </tbody>
      <tfoot>
        <tr>
          <th><button disabled={page <= 1} onClick={evt => {setPage(page => page - 1)}}>&lt;</button></th>
          <th>{page}</th>
          <th><button disabled={page*pageSize > props.count} onClick={evt => {setPage(page => page + 1)}}>&gt;</button></th>
        </tr>
      </tfoot>
    </table>
  )
}

export default function Home() {
  const sources = trpc.sources.useQuery()
  const [gene,setGene] = React.useState('')
  const geneAutocomplete = trpc.gene_autocomplete.useQuery(gene, { enabled: gene.length > 0 })
  return (
    <>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <datalist id="geneAutocomplete">{geneAutocomplete.data?.map(suggestion => <option key={suggestion.gene}>{suggestion.gene}</option>)}</datalist>
        <input type="text" value={gene} onChange={evt => {setGene(evt.currentTarget.value)}} list={geneAutocomplete.data ? "geneAutocomplete" : undefined} />
        {sources.data?.map(({ source, count }) => <Predictions source={source} gene={gene} count={Number(count)} />)}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </>
  )
}
