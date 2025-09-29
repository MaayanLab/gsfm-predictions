import React from 'react';
import { Waypoints } from '@/components/waypoint';
import TermPredictions from './TermPredictions';
import { Metadata } from 'next';
import trpc from '@/lib/trpc/server'

export async function generateMetadata(props: { params: Promise<{ library: string, term: string }> }): Promise<Metadata> {
  const { library, term } = (await props.params)
  return {
    title: `${decodeURIComponent(library)}: ${decodeURIComponent(term)}`,
  }
}

export default async function Home({ params }: { params: Promise<{ library: string, term: string }> }) {
  const { library, term } = (await params)
  const models = await trpc.models()
  return (
    <Waypoints>
      <TermPredictions models={models.map(({ model }) => model)} library={decodeURIComponent(library)} term={decodeURIComponent(term)} />
    </Waypoints>
  )
}
