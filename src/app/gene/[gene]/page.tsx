import React from 'react';
import trpc from '@/lib/trpc/server'
import Link from 'next/link';
import iconSvg from '@/app/icon.svg'
import { Waypoints } from '@/components/waypoint';
import AllPredictions from '@/components/gene/AllPredictions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import GeneInfo from '@/components/gene/GeneInfo';

export default async function Home({ params }: { params: Promise<{ gene: string }> }) {
  const gene_info = await trpc.gene_info((await params).gene)
  if (!gene_info) notFound()
  const models = await trpc.models()
  return (
    <main className="container mx-auto flex flex-col gap-4 items-stretch grow">
      <Waypoints>
        <GeneInfo gene_info={gene_info} />
        {models.map(({ model }) => 
          <div key={model} className="prose max-w-full border border-t-0 border-secondary rounded-b-lg p-4">
            <div className="flex flex-row">
              <div className="w-32 m-8 self-center place-self-center">
                <Image unoptimized objectFit='contain' src={iconSvg} alt="GSFM" />
              </div>
              <div className="flex flex-col">
                <h2>GSFM gene annotation predictions ({model})</h2>
                <p>The gene annotations below have been generated using GSFM. GSFM uses is an auto-encoder-like deep machine learning model trained on gene sets from supplemental material of literature. More information about the method can be found <Link href="/about">here</Link>.</p>
              </div>
            </div>
            <AllPredictions model={model} />
          </div>
        )}
      </Waypoints>
    </main>
  )
}
