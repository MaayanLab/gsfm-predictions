import React from 'react';
import { Waypoints } from '@/components/waypoint';
import GeneInfo from './GeneInfo';
import GenePredictions from './GenePredictions';

export default async function Home({ params }: { params: Promise<{ gene: string }> }) {
  const gene = (await params).gene
  return (
    <Waypoints>
      <GeneInfo gene={gene} />
      <GenePredictions gene={gene} />
    </Waypoints>
  )
}
