'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import Predictions from "@/components/term/Predictions"
import { useWaypoints, Waypoint } from '@/components/waypoint';
import trpc from '@/lib/trpc/client'
import classNames from 'classnames';
import { source_icons } from '@/components/resources';

export default function AllPredictions(props: { model?: string }) {
  const params = useParams<{ library: string, term: string }>()
  const { source, termParam } = React.useMemo(() => ({ source: decodeURIComponent(params.library ?? ''), termParam: decodeURIComponent(params.term ?? '') }), [params])
  const termGenes = trpc.termGenes.useQuery({ model: props.model, source, term: termParam }, { enabled: !!source && !!termParam })
  if (!termGenes.data?.count) return
  return <div className={classNames("mx-4 p-4 flex flex-col")}>
    <div className="flex flex-row gap-2 align-center items-center">
      <div className="w-24 h-24 flex items-center">
        {typeof source_icons[source] === 'string' ? <img src={source_icons[source]} alt={source} /> : source_icons[source]}
      </div>
      <h3 className="text-wrap">{source.replaceAll('_', ' ')}</h3>
    </div>
    <Predictions model={props.model} source={source} term={termParam} count={termGenes.data.count} />
  </div>
}
