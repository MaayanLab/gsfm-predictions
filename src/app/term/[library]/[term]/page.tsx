import React from 'react';
import { Waypoints } from '@/components/waypoint';
import TermPredictions from './TermPredictions';
import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ library: string, term: string }> }): Promise<Metadata> {
  const { library, term } = (await props.params)
  return {
    title: `${decodeURIComponent(library)}: ${decodeURIComponent(term)}`,
  }
}

export default async function Home({ params }: { params: Promise<{ library: string, term: string }> }) {
  const { library, term } = (await params)
  return (
    <Waypoints>
      <TermPredictions library={decodeURIComponent(library)} term={decodeURIComponent(term)} />
    </Waypoints>
  )
}
