import React from 'react';
import { Waypoints } from '@/components/waypoint';
import TermInfo from './TermInfo';
import TermPredictions from './TermPredictions';
import { Metadata } from 'next';
import trpc from '@/lib/trpc/server'

export async function generateMetadata(props: { params: Promise<{ source: string, term: string }> }): Promise<Metadata> {
  const { source, term } = (await props.params)
  return {
    title: `${decodeURIComponent(source)}: ${decodeURIComponent(term)}`,
  }
}

export default async function Home({ params }: { params: Promise<{ source: string, term: string }> }) {
  const term = decodeURIComponent((await params).term)
  const source = decodeURIComponent((await params).source)
  const models = await trpc.models()
  return (
    <Waypoints>
      <TermInfo source={source} term={term} />
      <TermPredictions models={models.map(({ model }) => model)} source={source} term={term} />
    </Waypoints>
  )
}
