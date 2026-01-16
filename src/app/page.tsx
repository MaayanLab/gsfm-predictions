'use client'
import { useRouter } from 'next/navigation';
import React from 'react';
import GeneInput from '@/components/gene/GeneInput';
import backgroundSvg from '@/app/background.svg'
import Image from "next/image";

export default function Home() {
  const router = useRouter()
  return (
      <>
      <Image className="-mt-12 -mb-8 w-full" src={backgroundSvg} unoptimized alt="" />
      <main className="container mx-auto flex flex-col place-items-center items-center grow gap-4 my-4">
        <div className="flex flex-row gap-16 place-items-center align-center">
          <div className="prose">
            <h1 className="text-primary font-normal">
              <div className="link">AI-powered gene</div> function prediction & biological discovery
            </h1>
          </div>
          <div className="prose text-primary">
            Search your gene of interest to review GSFM&apos;s predictions across a variety of Common Fund Data Ecosystem (CFDE) gene set libraries & other public resources.
            <button>Start predicting</button>
          </div>
        </div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-lg">Search Gene Symbol</legend>
          <GeneInput
            large
            onChange={value => {
              router.push(`/gene/${encodeURIComponent(value)}`)
            }}
          />
        </fieldset>
        <img className="px-16 mr-24" src="/fig-1.svg" alt="GSFM Benchmark Results" />
        <div className="prose text-justify">
          <p><strong>Figure 1.</strong> Median area under the receiver operating characteristic curve (AUROC) across all terms in each benchmarking library. GSFM Rummagene is the model used for predictions on this site.</p>
        </div>
      </main>
    </>
  )
}
