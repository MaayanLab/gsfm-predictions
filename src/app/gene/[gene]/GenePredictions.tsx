'use client'
import Predictions from "@/components/gene/Predictions";
import { model_descriptions, model_name, source_icons, source_rename } from '@/components/resources';
import useRWSearchParams from '@/components/rwsearchparams';
import type { UnPromise } from '@/components/types';
import { useWaypoints, Waypoint } from '@/components/waypoint';
import trpc from '@/lib/trpc/client';
import type trpcT from '@/lib/trpc/server';
import classNames from 'classnames';
import React from 'react';

export default function GenePredictions(props: { gene: string, models: string[] }) {
  return (
    <div className="prose max-w-full border border-t-0 border-secondary rounded-b-lg p-4 flex flex-col gap-4">
      <div role="tablist" className="tabs tabs-lift tabs-xl">
        {props.models.map(model => <ModelTab key={model} model={model} gene={props.gene} />)}
      </div>
    </div>
  )
}

function ModelTab(props: { model: string, gene: string }) {
  const [searchParams, setSearchParams] = useRWSearchParams()
  const sources = trpc.sources.useQuery({ model: props.model, gene: props.gene })
  return !!sources.data?.length && <>
    <input type="radio" name="model-tabs" role="tab" className="tab whitespace-nowrap" aria-label={model_name[props.model] ?? props.model}
      checked={searchParams.get('model') === props.model} onChange={evt => {setSearchParams(sp => { if (evt.currentTarget.checked) { sp.set('model', props.model) } })}}
    />
    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 prose max-w-none">
      <div className="prose max-w-full p-4 px-6">
        <h2 className="text-4xl mb-2">{model_name[props.model] ?? props.model} gene annotation predictions</h2>
        <p>
          The gene annotations below have been generated using {model_name[props.model] ?? props.model}, an auto-encoder-like deep machine learning model trained on {model_descriptions[props.model] ?? 'gene sets'}.
        </p>
        {searchParams.get('model') === props.model && <ModelPredictions model={props.model} gene={props.gene} sources={sources.data} />}
      </div>
    </div>
  </>
}

function ModelPredictions(props: { model?: string, gene: string, sources: Exclude<UnPromise<ReturnType<typeof trpcT.sources>>, undefined> }) {
  const { scrollTo } = useWaypoints()
  return <>
    <div className="flex flex-row">
      <div className="hidden lg:block relative">
        <ul className="sticky top-0 menu p-4">
          {props.sources.map(({ source, count }) => 
            <li key={`${source}-${props.gene}`}>
              <a href={`#${props.model}-${source}`}>
                <div className="flex flex-row gap-2 align-center items-center" onClick={evt => {scrollTo(source)}}>
                  <div className="w-8 h-8 flex items-center">
                    {typeof source_icons[source] === 'string' ? <img src={source_icons[source]} alt={(source_rename[source] ?? source).replaceAll('_', ' ')} /> : source_icons[source]}
                  </div>
                  <div className="w-24">
                    {(source_rename[source] ?? source).replaceAll('_', ' ')}
                  </div>
                </div>
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="grow grid grid-cols-1 2xl:grid-cols-2">
        {props.sources.map(({ source, count }) => 
          <React.Fragment key={`${source}-${props.gene}`}>
            <div className={classNames("mx-4 p-4 flex flex-col")}>
              <Waypoint id={`${props.model}-${source}`}>
                <div className="flex flex-row gap-2 align-center items-center" onClick={evt => {scrollTo(`${props.model}-${source}`)}}>
                  <div className="w-24 h-24 flex items-center">
                    {typeof source_icons[source] === 'string' ? <img src={source_icons[source]} alt={(source_rename[source] ?? source).replaceAll('_', ' ')} /> : source_icons[source]}
                  </div>
                  <h3 className="text-wrap">{(source_rename[source] ?? source).replaceAll('_', ' ')}</h3>
                </div>
                <Predictions model={props.model} source={source} gene={props.gene} count={Number(count)} />
              </Waypoint>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  </>
}
