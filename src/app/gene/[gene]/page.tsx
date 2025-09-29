import React from 'react';
import trpc from '@/lib/trpc/server'
import { Waypoints } from '@/components/waypoint';
import GeneInfo from './GeneInfo';
import GenePredictions from './GenePredictions';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

const getGeneInfo = React.cache(async (gene: string) => trpc.gene_info(gene))

export async function generateMetadata(props: { params: Promise<{ gene: string }> }): Promise<Metadata> {
  const gene = decodeURIComponent((await props.params).gene)
  const gene_info = await getGeneInfo(gene)
  if (!gene_info) notFound()
  else if (gene_info.symbol !== gene) redirect(`/gene/${gene_info.symbol}`)
  return {
    title: `${gene}`,
  }
}

export default async function Home({ params }: { params: Promise<{ gene: string }> }) {
  const gene = decodeURIComponent((await params).gene)
  const gene_info = await getGeneInfo(gene)
  if (!gene_info) notFound()
  else if (gene_info.symbol !== gene) redirect(`/gene/${gene_info.symbol}`)
  return (
    <Waypoints>
      <GeneInfo gene_info={gene_info} />
      <GenePredictions gene={gene} />
    </Waypoints>
  )
}
