'use client'

import React from 'react';
import trpc from '@/lib/trpc/client'
import classNames from 'classnames';

function range(n: number) {
  const L: number[] = []
  for (let i = 0; i < n; i++) L.push(i)
  return L
}

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

export default function Predictions(props: { source: string, gene: string, count: number }) {
  const pageSize = 8
  const [page, setPage] = React.useState(1)
  const predictions = trpc.predictions.useQuery({
    source: props.source,
    gene: props.gene,
    offset: (page-1)*pageSize,
    limit: pageSize,
  })
  return (
    <div className="border rounded-xl p-4 w-96 flex flex-col overflow-hidden">
      <div className="flex flex-row gap-2 align-center items-center">
        <div className="w-24 h-24 flex items-center">
          <img src={icons[props.source]} alt={props.source} />
        </div>
        <h3 className="text-wrap">{props.source.replaceAll('_', ' ')}</h3>
      </div>
      <div className="overflow-auto flex-grow">
        <table className="table table-xs w-full">
          <thead>
            <tr>
              <th>Term</th>
              <th>Proba</th>
            </tr>
          </thead>
          <tbody>
            {predictions.isLoading && range(pageSize).map(p => <tr key={p} className="hover:bg-base-200">
              <td className="w-full">Loading...</td>
              <td>&nbsp;</td>
            </tr>)}
            {predictions.data?.map(prediction =>
              <tr key={prediction.term} className={classNames("hover:bg-base-200", { 'font-bold': prediction.known })}>
                <td className="w-full">{prediction.term}</td>
                <td>{prediction.proba.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="join items-center justify-center">
        {page > 2 && <button className="join-item btn" onClick={evt => {setPage(page => 1)}}>1</button>}
        {page > 3 && <button className="join-item btn btn-disabled">...</button>}
        {page > 1 && <button className="join-item btn" onClick={evt => {setPage(page => page - 1)}}>{page - 1}</button>}
        <button className="join-item btn btn-active">{page}</button>
        {page*pageSize < props.count && <button className="join-item btn" onClick={evt => {setPage(page => page + 1)}}>{page + 1}</button>}
        {(page+2)*pageSize < props.count && <button className="join-item btn btn-disabled">...</button>}
        {(page+1)*pageSize < props.count && <button className="join-item btn" onClick={evt => {setPage(page => Math.ceil(props.count/pageSize))}}>{Math.ceil(props.count/pageSize)}</button>}
      </div>
    </div>
  )
}
