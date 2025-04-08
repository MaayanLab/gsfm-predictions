import React from 'react';
import trpc from '@/lib/trpc/server'
import { Waypoints } from '@/components/waypoint';
import GeneInfo from './GeneInfo';
import GenePredictions from './GenePredictions';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: Promise<{ gene: string }> }) {
  const gene = (await params).gene
  const gene_info = await trpc.gene_info(gene)
  if (!gene_info) notFound()
  return (
    <Waypoints>
      <GeneInfo gene_info={gene_info} />
      <GenePredictions gene={gene} />
    </Waypoints>
  )
}
