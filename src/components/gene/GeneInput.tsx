'use client'

import React from 'react'
import trpc from '@/lib/trpc/client'
import classNames from 'classnames'

export default function GeneInput({ value, onChange }: { value?: string, onChange?: React.Dispatch<string>}) {
  const [gene, setGene] = React.useState('')
  const geneAutocomplete = trpc.gene_autocomplete.useQuery(gene, { enabled: gene.length > 0 })
  const validGene = React.useMemo(() => geneAutocomplete.data?.some(suggestion => suggestion.symbol === gene), [geneAutocomplete.data, gene])
  React.useEffect(() => {if (value) setGene(value)}, [value])
  return (
    <div className={classNames('border rounded-md join', { 'border-red-400': validGene === false })}>
      <div className="join-item">
        <label className="input w-48 border-none rounded-md rounded-r-none focus-within:rounded-md focus-within:rounded-r-none focus-within:-outline-offset-1">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
          <input
            type="search"
            value={gene}
            placeholder='e.g. ACE2, KLF4'
            onChange={evt => {setGene(evt.currentTarget.value)}}
            list={geneAutocomplete.data ? "geneAutocomplete" : undefined}
          />
          <datalist id="geneAutocomplete">{geneAutocomplete.data?.map(suggestion => <option key={suggestion.symbol}>{suggestion.symbol}</option>)}</datalist>
        </label>
      </div>
      <input
        className="btn join-item btn-primary"
        type="submit"
        disabled={!validGene}
        onClick={evt => {
          evt.preventDefault()
          if (onChange) onChange(gene)
        }}
      ></input>
      <button className="btn join-item" onClick={evt => {
        setGene('ACE2')
        if (onChange) onChange('ACE2')
      }}>Example</button>
    </div>
  )
}
