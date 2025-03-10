import trpc from '@/lib/trpc/server'
import Link from 'next/link';
import Image from 'next/image';
import ModelPredictions from './ModelPredictions';
import iconSvg from '@/app/icon.svg'

export default async function GenePredictions(props: { gene: string }) {
  const models = await trpc.models()
  return <>
    {models.map(({ model }) => 
      <div key={model} className="prose max-w-full border border-t-0 border-secondary rounded-b-lg p-4">
        <div className="flex flex-row">
          <div className="w-32 m-8 self-center place-self-center">
            <Image unoptimized objectFit='contain' src={iconSvg} alt="GSFM" />
          </div>
          <div className="flex flex-col">
            <h2>GSFM gene annotation predictions ({model})</h2>
            <p>The gene annotations below have been generated using GSFM. GSFM uses is an auto-encoder-like deep machine learning model trained on gene sets from supplemental material of literature. More information about the method can be found <Link href="/about">here</Link>.</p>
          </div>
        </div>
        <ModelPredictions model={model} />
      </div>
    )}
  </>
}

