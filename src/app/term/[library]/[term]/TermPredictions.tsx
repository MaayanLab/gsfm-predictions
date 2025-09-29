import trpc from '@/lib/trpc/server'
import ModelPredictions from './ModelPredictions';
import React from 'react';
import { model_descriptions } from '@/components/resources';

export default async function TermPredictions(props: { library: string, term: string }) {
  const models = await trpc.models()
  return <>
    {models.map(({ model }) => 
      <div key={model} className="prose max-w-full border border-t-0 border-secondary rounded-b-lg p-4 px-6">
        <h2 className="text-4xl mb-2">GSFM gene annotation predictions{models.length > 1 && <>&nbsp;({model})</>}</h2>
        <p>
          The gene annotations below have been generated using GSFM, an auto-encoder-like deep machine learning model trained on {model_descriptions[model] ?? 'gene sets'}.
        </p>
        <ModelPredictions model={model} />
      </div>
    )}
  </>
}
