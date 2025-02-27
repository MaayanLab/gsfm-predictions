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
    <div className={classNames('border join', { 'border-red-400': !validGene })}>
      <div className="join-item">
        <input className="input" type="text" value={gene} onChange={evt => {setGene(evt.currentTarget.value)}} list={geneAutocomplete.data ? "geneAutocomplete" : undefined} />
        <datalist id="geneAutocomplete">{geneAutocomplete.data?.map(suggestion => <option key={suggestion.symbol}>{suggestion.symbol}</option>)}</datalist>
      </div>
      <input
        className="btn join-item"
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
