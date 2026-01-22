import React from 'react';
import trpc from '@/lib/trpc/server'
import { Waypoints } from '@/components/waypoint';
import GeneInfo from './GeneInfo';
import GenePredictions from './GenePredictions';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import GeneInput from '@/components/gene/GeneInput';

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
      <>
      <div
        style={{
          height:'350px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '-43px',
            top: '52px',
            width: '151px',
            height: '251px',
            backgroundImage: 'url("/resources/Ellipse4.svg")',
            backgroundPosition: 'left top',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-340px',
            top: '6px',
            height: '305px',
            width: '760px',
            backgroundImage: 'url("/resources/Rectangle12.svg")',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-292px',
            top: '288px',
            height: '305px',
            width: '760px',
            overflow: 'hidden',
            backgroundImage: 'url("/resources/Rectangle13.svg")',
          }}
        />
        <h1
          className="text-primary text-6xl"
          style={{ position: 'absolute', width: '100%', top: '176px', textAlign: 'center' }}
        >
          Trained on millions<br />of <span className="underline text-[#006DFF]">gene sets</span>
        </h1>
      </div>
      <main className="flex flex-col place-items-center items-center grow bg-white">
        <div className="z-10 bg-secondary self-stretch flex flex-row overflow-hidden">
          <div className="flex flex-col items-start justify-between gap-4 my-4 mx-auto py-4 px-16">
            <span className="text-primary font-semibold text-xl">SEARCH GENE SYMBOL</span>
            <GeneInput value={gene} />
          </div>
          <img className="hidden xl:block" src="/resources/Ellipse11.svg" alt="" />
        </div>
        <div className="mx-18">
          <Waypoints>
            <GeneInfo gene_info={gene_info} />
            <GenePredictions gene={gene} models={models.map(({ model }) => model)} />
          </Waypoints>
        </div>
      </main>
    </>
  )
}
