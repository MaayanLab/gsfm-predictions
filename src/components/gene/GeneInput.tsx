'use client'

import React from 'react'
import trpc from '@/lib/trpc/client'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'

export default function GeneInput({ large, value, onChange }: { large?: boolean, value?: string, onChange?: React.Dispatch<string>}) {
  const router = useRouter()
  const [gene, setGene] = React.useState('')
  const geneAutocomplete = trpc.gene_autocomplete.useQuery(gene, { enabled: gene.length > 0 })
  const validGene = React.useMemo(() => geneAutocomplete.data?.some(suggestion => suggestion.symbol === gene), [geneAutocomplete.data, gene])
  React.useEffect(() => {if (value) setGene(value)}, [value])
  return (
    <div className="flex flex-row gap-6">
      <label className={classNames("input bg-transparent border-transparent text-4xl text-primary rounded-full", { 'border-red-400': validGene === false })}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M41.9998 42L33.3198 33.32" stroke="#013CC6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 38C30.8366 38 38 30.8366 38 22C38 13.1634 30.8366 6 22 6C13.1634 6 6 13.1634 6 22C6 30.8366 13.1634 38 22 38Z" stroke="#013CC6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="search"
          value={gene}
          placeholder="e.g. ACE2, KLF4"
          onChange={evt => {setGene(evt.currentTarget.value)}}
          list={geneAutocomplete.data ? "geneAutocomplete" : undefined}
          required
        />
        <datalist id="geneAutocomplete">{geneAutocomplete.data?.map(suggestion => <option key={suggestion.symbol}>{suggestion.symbol}</option>)}</datalist>
      </label>
      <button
        className={classNames("btn btn-primary", { 'btn-xl': large })}
        type="submit"
        disabled={!validGene}
        onClick={evt => {
          evt.preventDefault()
          if (onChange !== undefined) onChange(gene)
          else router.push(`/gene/${encodeURIComponent(gene)}`)
        }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.0002 21L16.6602 16.66" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Search
      </button>
      <button className={classNames("text-[#013CC6] flex flex-row items-center", { 'btn-xl': large })}  onClick={evt => {
        setGene('ACE2')
        if (onChange) onChange('ACE2')
        else router.push(`/gene/${encodeURIComponent('ACE2')}`)
      }}>
        See example
        &nbsp;
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.89258 1L12.7851 6.89256L6.89258 12.7851" stroke="#013CC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.00002 6.89256H12.7851" stroke="#013CC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
