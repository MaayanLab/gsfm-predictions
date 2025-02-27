import React from 'react';
import trpc from '@/lib/trpc/server'
import Link from 'next/link';
import { Waypoints } from '@/components/waypoint';
import AllPredictions from '@/components/gene/AllPredictions';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: { gene: string } }) {
  const gene_info = await trpc.gene_info(params.gene)
  if (!gene_info) notFound()
  return (
    <Waypoints>
      <main className="container mx-auto flex flex-col gap-4 items-stretch flex-grow">
        <div className="prose max-w-full border p-4">
          <h1 className="mb-0">{params.gene}</h1>
          <h5 className="mt-0">{gene_info.name}</h5>
          <h3 className="mb-0">Description:</h3>
          <p>{gene_info.description ?? 'Coming soon!'}</p>
        </div>
        <div className="prose max-w-full border p-4">
          <div className="flex flex-row">
            <img src={undefined} alt="GSFM" />
            <div className="flex flex-col">
              <h2>GSFM gene annotation predictions</h2>
              <p>The gene annotations below have been generated using GSFM. GSFM uses is an auto-encoder-like deep machine learning model trained on gene sets from supplemental material of literature. More information about the method can be found <Link href="/about">here</Link>.</p>
            </div>
          </div>
          <AllPredictions />
        </div>
      </main>
    </Waypoints>
  )
}
