'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import Predictions from "@/components/gene/Predictions"
import { useWaypoints, Waypoint } from '@/components/waypoint';
import trpc from '@/lib/trpc/client'
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
  KOMP2_Mouse_Phenotypes_2022: 'https://data.cfde.cloud/img/KOMP2.svg',
}

export default function AllPredictions() {
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