'use client'
import { model_descriptions, model_name, source_icons, source_rename } from '@/components/resources';
import useRWSearchParams from '@/components/rwsearchparams';
import Predictions from "@/components/term/Predictions";
import trpc from '@/lib/trpc/client';
import classNames from 'classnames';
import React from 'react';

export default function TermPredictions(props: { source: string, term: string, models: string[] }) {
  return (
    <div className="prose max-w-full border border-t-0 border-secondary rounded-b-lg p-4 flex flex-col gap-4">
      <div role="tablist" className="tabs tabs-lift tabs-xl">
        {props.models.map(model => <ModelTab key={model} model={model} source={props.source} term={props.term} />)}
      </div>
    </div>
  )
}

function ModelTab(props: { model: string, source: string, term: string }) {
  const [searchParams, setSearchParams] = useRWSearchParams()
  const termGenes = trpc.termGenes.useQuery({ model: props.model, source: props.source, term: props.term })
  return !!termGenes.data?.count && <>
    <input type="radio" name="model-tabs" role="tab" className="tab whitespace-nowrap" aria-label={model_name[props.model] ?? props.model}
      checked={searchParams.get('model') === props.model} onChange={evt => {setSearchParams(sp => { if (evt.currentTarget.checked) { sp.set('model', props.model) } })}}
    />
    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 prose max-w-none">
      <div className="prose max-w-full p-4 px-6">
        <h2 className="text-4xl mb-2">{model_name[props.model] ?? props.model} gene annotation predictions</h2>
        <p>
          The gene annotations below have been generated using {model_name[props.model] ?? props.model}, an auto-encoder-like deep machine learning model trained on {model_descriptions[props.model] ?? 'gene sets'}.
        </p>
        {searchParams.get('model') === props.model && <ModelPredictions model={props.model} source={props.source} term={props.term} count={termGenes.data.count} />}
      </div>
    </div>
  </>
}


function ModelPredictions(props: { model?: string, source: string, term: string, count: number }) {
  const source_icon = source_icons[props.source]
  return <div className={classNames("mx-4 p-4 flex flex-col")}>
    <div className="flex flex-row gap-2 align-center items-center">
      <div className="w-24 h-24 flex items-center">
        {typeof source_icon === 'string' ? <img src={source_icon} alt={(source_rename[props.source] ?? props.source).replaceAll('_', ' ')} /> : source_icon}
      </div>
      <h3 className="text-wrap">{(source_rename[props.source] ?? props.source).replaceAll('_', ' ')}</h3>
    </div>
    <Predictions model={props.model} source={props.source} term={props.term} count={props.count} />
  </div>
}
