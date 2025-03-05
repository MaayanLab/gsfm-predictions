'use client'

import React from 'react';
import trpc from '@/lib/trpc/client'
import classNames from 'classnames';

function range(n: number) {
  const L: number[] = []
  for (let i = 0; i < n; i++) L.push(i)
  return L
}

export default function Predictions(props: { source: string, gene: string, count: number }) {
  const pageSize = 10
  const [page, setPage] = React.useState(1)
  const predictions = trpc.predictions.useQuery({
    source: props.source,
    gene: props.gene,
    offset: (page-1)*pageSize,
    limit: pageSize,
  })
  return (
    <>
      <div className="overflow-auto flex-grow">
        <table className="table table-xs w-full">
          <thead>
            <tr>
              <th>Term</th>
              <th>Proba</th>
              <th>Term ROC AUC</th>
            </tr>
          </thead>
          <tbody>
            {predictions.isLoading && range(pageSize).map(p => <tr key={p} className="hover:bg-base-200">
              <td className="w-full">Loading...</td>
              <td>&nbsp;</td>
            </tr>)}
            {predictions.data?.map(prediction =>
              <tr key={prediction.term} className={classNames("hover:bg-base-200", { 'font-bold': prediction.known, 'text-red-600': prediction.proba < 0.5 && prediction.known })}>
                <td className="w-full">{prediction.term}</td>
                <td className="text-right">{prediction.proba.toFixed(2)}</td>
                <td className="text-right">{prediction.roc_auc?.toFixed(2)}</td>
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
    </>
  )
}
