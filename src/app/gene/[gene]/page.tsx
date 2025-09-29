import React from 'react';
import trpc from '@/lib/trpc/server'
import { Waypoints } from '@/components/waypoint';
import GeneInfo from './GeneInfo';
import GenePredictions from './GenePredictions';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

const getGeneInfo = React.cache(async (gene: string) => trpc.gene_info(gene))

export async function generateMetadata(props: { params: Promise<{ gene: string }>, searchParams: Promise<Record<string, string>> }): Promise<Metadata> {
  const gene = decodeURIComponent((await props.params).gene)
  const gene_info = await getGeneInfo(gene)
  const searchParams = new URLSearchParams(await props.searchParams)
  if (!gene_info) notFound()
  else if (gene_info.symbol !== gene) redirect(`/gene/${gene_info.symbol}?${searchParams.toString()}`)
  return {
    title: `${gene}`,
  }
}

export default async function Home(props: { params: Promise<{ gene: string }>, searchParams: Promise<Record<string, string>> }) {
  const gene = decodeURIComponent((await props.params).gene)
  const searchParams = new URLSearchParams(await props.searchParams)
  const gene_info = await getGeneInfo(gene)
  const models = await trpc.models()
  if (!gene_info) notFound()
  else if (gene_info.symbol !== gene) redirect(`/gene/${gene_info.symbol}?${searchParams.toString()}`)
  return (
    <Waypoints>
      <GeneInfo gene_info={gene_info} />
      <GenePredictions gene={gene} models={models.map(({ model }) => model)} />
    </Waypoints>
  )
}
