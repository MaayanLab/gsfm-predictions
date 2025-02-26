'use client'
import trpc from '@/lib/trpc/client'
import { useRouter, useParams } from 'next/navigation';
import React from 'react';
import GeneInput from './GeneInput';
import Predictions from './Predictions';


export default function Home() {
  const router = useRouter()
  const params = useParams<{ gene: string }>()
  const geneParam = React.useMemo(() => params.gene ?? '', [params])
  const sources = trpc.sources.useQuery(geneParam, { enabled: !!geneParam })
  return (
    <main className="container mx-auto flex flex-col gap-4 items-center flex-grow">
      <div className="flex flex-col gap-1">
        <GeneInput
          value={params.gene}
          onChange={value => {
            router.push(`/gene/${encodeURIComponent(value)}`)
          }}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-2 justify-center">
        {sources.data?.map(({ source, count }) => <Predictions key={`${source}-${geneParam}`} source={source} gene={geneParam} count={Number(count)} />)}
      </div>
    </main>
  )
}
