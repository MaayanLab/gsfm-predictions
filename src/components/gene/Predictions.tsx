'use client'

import React from 'react';
import trpc from '@/lib/trpc/client'
import classNames from 'classnames';

function range(n: number) {
  const L: number[] = []
  for (let i = 0; i < n; i++) L.push(i)
  return L
}

export default function Predictions(props: { model?: string, source: string, gene: string, count: number }) {
  const pageSize = 10
  const [page, setPage] = React.useState(1)
  const predictions = trpc.predictions.useQuery({
    model: props.model,
    source: props.source,
    gene: props.gene,
    offset: (page-1)*pageSize,
    limit: pageSize,
  })
  return (
    <>
      <div className="grow">
        <table className="table table-xs w-full">
          <thead>
            <tr>
              <th><div className="tooltip" data-tip="Gene set description">
                Term
              </div></th>
              <th><div className="tooltip" data-tip="Model assigned probability">
                Score
              </div></th>
              <th><div className="tooltip" data-tip="Model confidence in this gene compared to other genes for this term">
                ZScore
              </div></th>
              <th><div className="tooltip" data-tip="Performance on recovering random slices of this gene set">
                Term AUROC
              </div></th>
              <th><div className="tooltip" data-tip="Genes with this term ranked in the top 10 predictions / Genes with this term predicted">
                Uniqueness
              </div></th>
            </tr>
          </thead>
          <tbody>
            {predictions.isLoading && range(pageSize).map(p => <tr key={p} className="hover:bg-base-200">
              <td className="w-full">Loading...</td>
              <td>&nbsp;</td>
            </tr>)}
            {predictions.data?.map(prediction =>
              <tr key={prediction.term} className={classNames("hover:bg-base-200", { 'font-bold': prediction.known, 'text-red-600': prediction.proba < 0.5 && prediction.known })}>
                <td className="w-full">{prediction.known ? '*' : ' '}{prediction.term}</td>
                <td className="text-right">{prediction.proba.toFixed(2)}</td>
                <td className="text-right">{prediction.zscore?.toFixed(2)}</td>
                <td className="text-right">{prediction.roc_auc?.toFixed(2)}</td>
                <td className="text-right whitespace-nowrap">{prediction.genes_with_term_in_top_10 && prediction.genes_with_term_predicted && <>{prediction.genes_with_term_in_top_10} / {prediction.genes_with_term_predicted}</>}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="join items-center justify-center">
        {page > 2 && <button className="join-item btn" onClick={evt => {setPage(page => 1)}}>1</button>}
        {page > 3 && <button className="join-item btn btn-disabled">...</button>}
        {page > 1 && <button className="join-item btn" onClick={evt => {setPage(page => page - 1)}}>{page - 1}</button>}
        <button className={classNames("btn btn-active", { 'rounded-lg': props.count <= pageSize, 'join-item': props.count > pageSize })}>{page}</button>
        {page*pageSize < props.count && <button className="join-item btn" onClick={evt => {setPage(page => page + 1)}}>{page + 1}</button>}
        {(page+2)*pageSize < props.count && <button className="join-item btn btn-disabled">...</button>}
        {(page+1)*pageSize < props.count && <button className="join-item btn" onClick={evt => {setPage(page => Math.ceil(props.count/pageSize))}}>{Math.ceil(props.count/pageSize)}</button>}
      </div>
    </>
  )
}
