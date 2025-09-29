'use client'
import React from 'react';
import ModelPredictions from './ModelPredictions';
import { model_descriptions, model_name } from '@/components/resources';
import useRWSearchParams from '@/components/rwsearchparams';

export default function TermPredictions(props: { library: string, term: string, models: string[] }) {
  const [searchParams, setSearchParams] = useRWSearchParams()
  React.useEffect(() => {
    if (searchParams.get('model') === null) setSearchParams(sp => sp.set('model', props.models[0]))
  }, [props.models, searchParams, setSearchParams])

  return (
    <div className="prose max-w-full border border-t-0 border-secondary rounded-b-lg p-4 flex flex-col gap-4">
      <div role="tablist" className="tabs tabs-lift tabs-xl">
        {props.models.map(model => <React.Fragment key={model}>
            <input type="radio" name="model-tabs" role="tab" className="tab whitespace-nowrap" aria-label={model_name[model] ?? model}
              checked={searchParams.get('model') === model} onChange={evt => {setSearchParams(sp => { if (evt.currentTarget.checked) { sp.set('model', model) } })}}
            />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 prose max-w-none">
              <div className="prose max-w-full p-4 px-6">
                <h2 className="text-4xl mb-2">{model_name[model] ?? model} gene annotation predictions</h2>
                <p>
                  The gene annotations below have been generated using {model_name[model] ?? model}, an auto-encoder-like deep machine learning model trained on {model_descriptions[model] ?? 'gene sets'}.
                </p>
                {searchParams.get('model') === model && <ModelPredictions model={model} />}
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
