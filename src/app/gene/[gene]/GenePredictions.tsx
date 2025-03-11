import trpc from '@/lib/trpc/server'
import Link from 'next/link';
import ModelPredictions from './ModelPredictions';
import React from 'react';

const icons = {
  rummagene: 'https://rummagene.com/images/rummagene_logo.png',
  rummageo: 'https://rummageo.com/images/rummageo_logo.png',
} as Record<string, string>

const descriptions = {
  rummagene: <>gene sets from supplemental material of literature from <a href="https://rummagene.com" target='_blank'>Rummagene</a></>,
  rummageo: <>differentially expressed genes in GEO studies from <a href="https://rummageo.com" target='_blank'>Rummageo</a></>,
} as Record<string, React.ReactNode>

export default async function GenePredictions(props: { gene: string }) {
  const models = await trpc.models()
  return <>
    {models.map(({ model }) => 
      <div key={model} className="prose max-w-full border border-t-0 border-secondary rounded-b-lg p-4">
        <div className="flex flex-row">
          <div className="w-64 m-8 self-center place-self-center">
            {model in icons ? <img src={icons[model]} alt={model} /> : null}
          </div>
          <div className="flex flex-col">
            <h2>GSFM gene annotation predictions ({model})</h2>
            <p>
              The gene annotations below have been generated using GSFM.
              GSFM is an auto-encoder-like deep machine learning model trained on {descriptions[model] ?? 'gene sets'}.
              More information about the method can be found <Link href="/about">here</Link>.
            </p>
          </div>
        </div>
        <ModelPredictions model={model} />
      </div>
    )}
  </>
}

