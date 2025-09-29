'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import Predictions from "@/components/gene/Predictions"
import { useWaypoints, Waypoint } from '@/components/waypoint';
import trpc from '@/lib/trpc/client'
import classNames from 'classnames'
import { library_icons } from '@/components/resources'

export default function AllPredictions(props: { model?: string }) {
  const params = useParams<{ gene: string }>()
  const geneParam = React.useMemo(() => params.gene ?? '', [params])
  const sources = trpc.sources.useQuery({ model: props.model, gene: geneParam }, { enabled: !!geneParam })
  const { scrollTo } = useWaypoints()
  return <>
    <div className="flex flex-row">
      <div className="hidden lg:block relative">
        <ul className="sticky top-0 menu p-4">
          {sources.data?.map(({ source, count }) => 
            <li key={`${source}-${geneParam}`}>
              <a href={`#${props.model}-${source}`}>
                <div className="flex flex-row gap-2 align-center items-center" onClick={evt => {scrollTo(source)}}>
                  <div className="w-8 h-8 flex items-center">
                    {typeof library_icons[source] === 'string' ? <img src={library_icons[source]} alt={source} /> : library_icons[source]}
                  </div>
                  <div className="w-24">
                    {source.replaceAll('_', ' ')}
                  </div>
                </div>
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="grow grid grid-cols-1 2xl:grid-cols-2">
        {sources.data?.map(({ source, count }) => 
          <React.Fragment key={`${source}-${geneParam}`}>
            <div className={classNames("mx-4 p-4 flex flex-col")}>
              <Waypoint id={`${props.model}-${source}`}>
                <div className="flex flex-row gap-2 align-center items-center" onClick={evt => {scrollTo(`${props.model}-${source}`)}}>
                  <div className="w-24 h-24 flex items-center">
                    {typeof library_icons[source] === 'string' ? <img src={library_icons[source]} alt={source} /> : library_icons[source]}
                  </div>
                  <h3 className="text-wrap">{source.replaceAll('_', ' ')}</h3>
                </div>
                <Predictions model={props.model} source={source} gene={geneParam} count={Number(count)} />
              </Waypoint>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  </>
}
