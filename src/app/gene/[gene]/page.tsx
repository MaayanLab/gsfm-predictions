'use client'
import trpc from '@/lib/trpc/client'
import { useParams } from 'next/navigation';
import React from 'react';
import Predictions from "@/components/gene/Predictions"
import Link from 'next/link';
import { useWaypoints, Waypoint, Waypoints } from '@/components/waypoint';
import classNames from 'classnames';

const icons: Record<string, string> = {
  LINCS_L1000_Chem_Pert_Consensus_Sigs: 'https://cfde-drc.s3.amazonaws.com/assets/img/LINCS-logo.png',
  LINCS_L1000_CRISPR_KO_Consensus_Sigs: 'https://cfde-drc.s3.amazonaws.com/assets/img/LINCS-logo.png',
  LINCS_L1000_Consensus_Median_Signatures: 'https://cfde-drc.s3.amazonaws.com/assets/img/LINCS-logo.png',
  ARCHS4_IDG_Coexp: 'https://data.cfde.cloud/img/IDG.png',
  GlyGen_Glycosylated_Proteins_2022: 'https://cfde-drc.s3.amazonaws.com/assets/img/glygen.png',
  GTEx_Aging_Signatures_2021: 'https://data.cfde.cloud/img/GTEx.png',
  GTEx_Tissues_V8_2023: 'https://data.cfde.cloud/img/GTEx.png',
  IDG_Drug_Targets_2022: 'https://data.cfde.cloud/img/IDG.png',
  MoTrPAC_Endurance_Trained_Rats_2023: 'https://data.cfde.cloud/img/MoTrPAC.png',
}

function AllPredictions() {
  const params = useParams<{ gene: string }>()
  const geneParam = React.useMemo(() => params.gene ?? '', [params])
  const sources = trpc.sources.useQuery(geneParam, { enabled: !!geneParam })
  const { scrollTo } = useWaypoints()
  return sources.data?.map(({ source, count }) =>
    <React.Fragment key={`${source}-${geneParam}`}>
      <div className={classNames("mx-4 p-4 flex flex-col overflow-hidden")}>
        <Waypoint id={source}>
          <div className="flex-row gap-2 align-center items-center" onClick={evt => {scrollTo(source)}}>
            <div className="w-24 h-24 flex items-center">
              <img src={icons[source]} alt={source} />
            </div>
            <h3 className="text-wrap">{source.replaceAll('_', ' ')}</h3>
          </div>
          <Predictions source={source} gene={geneParam} count={Number(count)} />
        </Waypoint>
      </div>
    </React.Fragment>
  )
}

export default function Home() {
  const params = useParams<{ gene: string }>()
  const gene_info = trpc.gene_info.useQuery(params.gene)
  return (
    <Waypoints>
      <main className="container mx-auto flex flex-col gap-4 items-stretch flex-grow">
        <div className="prose max-w-full border p-4">
          <h1 className="mb-0">{params.gene}</h1>
          {gene_info.data && <>
            <h5 className="mt-0">{gene_info.data.name}</h5>
            <h3 className="mb-0">Description:</h3>
            <p>{gene_info.data.description ?? 'Coming soon!'}</p>
          </>}
        </div>
        <div className="prose max-w-full border p-4">
          <div className="flex flex-row">
            <img src={undefined} alt="GSFM" />
            <div className="flex flex-col">
              <h2>GSFM gene annotation predictions</h2>
              <p>The gene annotations below have been generated using GSFM. GSFM uses is an auto-encoder-like deep machine learning model trained on gene sets from supplemental material of literature. More information about the method can be found <Link href="/about">here</Link>.</p>
            </div>
          </div>
          <AllPredictions />
        </div>
      </main>
    </Waypoints>
  )
}
