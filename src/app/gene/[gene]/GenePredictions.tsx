import trpc from '@/lib/trpc/server'
import Link from 'next/link';
import ModelPredictions from './ModelPredictions';
import React from 'react';

const icons = {
  rummagene: 'https://rummagene.com/images/rummagene_logo.png',
  rummageo: 'https://rummageo.com/images/rummageo_logo.png',
  rummage: <div className="flex flex-row gap-2">
    <a href="https://rummagene.com" target="_blank"><img className="max-w-32" src="https://rummagene.com/images/rummagene_logo.png" alt="Rummagene" /></a>
    <a href="https://rummageno.com" target="_blank"><img className="max-w-32" src="https://rummageo.com/images/rummageo_logo.png" alt="Rummageo" /></a>
  </div>,
} as Record<string, string | React.ReactNode>

const descriptions = {
  rummagene: <>gene sets from supplemental material of literature from <a href="https://rummagene.com" target='_blank'>Rummagene</a></>,
  rummageo: <>differentially expressed genes in GEO studies from <a href="https://rummageo.com" target='_blank'>Rummageo</a></>,
  rummage: <>gene sets from supplemental material of literature from <a href="https://rummagene.com" target='_blank'>Rummagene</a> and differentially expressed genes in GEO studies from <a href="https://rummageo.com" target='_blank'>Rummageo</a></>,
} as Record<string, React.ReactNode>

export default async function GenePredictions(props: { gene: string }) {
  const models = await trpc.models()
  return <>
    {models.map(({ model }) => 
      <div key={model} className="prose max-w-full border border-t-0 border-secondary rounded-b-lg p-4">
        <div className="flex flex-row">
          <div className="w-64 m-8 self-center place-self-center">
            {model in icons ?
              typeof icons[model] === 'string' ? <img src={icons[model]} alt={model} />
              : icons[model]
            : null}
          </div>
          <div className="flex flex-col">
            <h2>GSFM gene annotation predictions{models.length > 1 && <>&nbsp;({model})</>}</h2>
            <p>
              The gene annotations below have been generated using GSFM.
              GSFM is an auto-encoder-like deep machine learning model trained on {descriptions[model] ?? 'gene sets'}.
            </p>
          </div>
        </div>
        <ModelPredictions model={model} />
      </div>
    )}
  </>
}

