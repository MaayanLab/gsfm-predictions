'use client'

import { source_rename } from '@/components/resources'
import React from 'react'

export default function TermInfo(props: { source: string, term: string }) {
  return (
    <div className="prose max-w-full border border-b-0 border-secondary rounded-t-lg p-4 flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="mb-0 text-6xl">{(source_rename[props.source] ?? props.source).replaceAll('_', ' ')}</h1>
        <h5 className="mt-0 text-2xl">{props.term}</h5>
      </div>
    </div>
  )
}