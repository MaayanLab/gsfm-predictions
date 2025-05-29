'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import Predictions from "@/components/gene/Predictions"
import { useWaypoints, Waypoint } from '@/components/waypoint';
import trpc from '@/lib/trpc/client'
import classNames from 'classnames';

const icons: Record<string, string | React.ReactElement> = {
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
  ChEA_2022: <img className="p-2 bg-gray-400" src="https://maayanlab.cloud/chea3/assets/images/chea3_logo.png" alt="ChEA 2022" />,
  KEA_2015: 'https://maayanlab.cloud/kea3/static/KEA3_logo_transparent.png',
  Human_Phenotype_Ontology: <img className="p-2 bg-gray-400" src="https://hpo.jax.org/assets/hpo-logo-white-no-words.png" alt="Human Phenotype Ontology" />,
  GWAS_Catalog_2023: 'https://www.ebi.ac.uk/gwas/images/GWAS_Catalog_circle_178x178.png',
  GO_Biological_Process_2023: 'https://geneontology.org/favicon.ico?1',
  KEGG_2021_Human: 'https://www.genome.jp/Fig/kegg128.gif',
  MGI_Mammalian_Phenotype_Level_4_2024: 'https://www.informatics.jax.org/webshare/images/mgi_logo.gif',
  OMIM_Disease: 'https://www.omim.org/static/omim/icons/OMIM_davinciman.001.png',
  HuBMAP_Azimuth: 'https://s3.amazonaws.com/maayan-kg/cfde-kg/assets/HuBMAP.png',
  'HuBMAP_ASCT+B': 'https://s3.amazonaws.com/maayan-kg/cfde-kg/assets/HuBMAP.png',
}

export default function AllPredictions(props: { model?: string }) {
  const params = useParams<{ gene: string }>()
  const geneParam = React.useMemo(() => params.gene ?? '', [params])
  const sources = trpc.sources.useQuery({ model: props.model, gene: geneParam }, { enabled: !!geneParam })
  const { scrollTo } = useWaypoints()
  return <>
    <div className="flex flex-row">
      <div className="hidden lg:block relative">
        <ul className="sticky top-0 menu p-4">
          {sources.data?.map(({ source, count }) => 
            <li key={`${source}-${geneParam}`}>
              <a href={`#${props.model}-${source}`}>
                <div className="flex flex-row gap-2 align-center items-center" onClick={evt => {scrollTo(source)}}>
                  <div className="w-8 h-8 flex items-center">
                    {typeof icons[source] === 'string' ? <img src={icons[source]} alt={source} /> : icons[source]}
                  </div>
                  <div className="w-24">
                    {source.replaceAll('_', ' ')}
                  </div>
                </div>
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="grow grid grid-cols-1 2xl:grid-cols-2">
        {sources.data?.map(({ source, count }) => 
          <React.Fragment key={`${source}-${geneParam}`}>
            <div className={classNames("mx-4 p-4 flex flex-col")}>
              <Waypoint id={`${props.model}-${source}`}>
                <div className="flex flex-row gap-2 align-center items-center" onClick={evt => {scrollTo(`${props.model}-${source}`)}}>
                  <div className="w-24 h-24 flex items-center">
                    {typeof icons[source] === 'string' ? <img src={icons[source]} alt={source} /> : icons[source]}
                  </div>
                  <h3 className="text-wrap">{source.replaceAll('_', ' ')}</h3>
                </div>
                <Predictions model={props.model} source={source} gene={geneParam} count={Number(count)} />
              </Waypoint>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  </>
}
