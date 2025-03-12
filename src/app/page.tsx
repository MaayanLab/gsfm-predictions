'use client'
import { useRouter } from 'next/navigation';
import React from 'react';
import GeneInput from '@/components/gene/GeneInput';

export default function Home() {
  const router = useRouter()
  return (
    <main className="container mx-auto flex flex-col place-items-center items-center grow gap-4 my-4">
      <div className="prose text-justify">
        <p>Trained on millions of gene sets automatically extracted from literature and raw RNA-seq data, GSFM learns to recover held-out genes from gene sets. The resulting model exhibits state of the art performance on gene function prediction.</p>
        <p>Search your gene of interest to review GSFM&apos;s predictions across a variety of Common Fund Data Ecosystem (CFDE) gene set libraries & other public resources.</p>
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
      <img className="px-16 mr-24" src="/benchmark.svg" alt="GSFM Benchmark Results" />
      <div className="prose text-justify">
        <p><strong>Figure 1.</strong> Median area under the receiver operating characteristic curve (AUROC) across all terms in each benchmarking library. Ge20[Rummagene] & Ge20[Rummageo] are the models used for predictions on this site, Fd1024e20[Rummagene|Rummageo] coming soon. PrismExp & Sim are the current state of the art methods used for gene function prediction on different underlying data sources.</p>
      </div>
    </main>
  )
}
