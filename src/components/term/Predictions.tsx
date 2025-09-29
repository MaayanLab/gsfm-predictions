'use client'

import React from 'react';
import trpc from '@/lib/trpc/client'
import classNames from 'classnames';
import range from '@/components/range'

export default function Predictions(props: { model?: string, source: string, term: string, count: number }) {
  const pageSize = 10
  const [filter, setFilter] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [orderBy, setOrderBy] = React.useState<'proba desc' | 'proba asc' | 'zscore asc' | 'zscore desc' | 'known asc' | 'known desc' | 'auroc asc' | 'auroc desc' | 'uniqueness asc' | 'uniqueness desc' | undefined>('proba desc')
  const predictions = trpc.termPredictions.useQuery({
    model: props.model,
    source: props.source,
    term: props.term,
    orderBy: orderBy,
    filter: filter,
    offset: (page-1)*pageSize,
    limit: pageSize,
  }, {})
  return (
    <>
      <div className="grow overflow-auto">
        <table className="table table-xs md:table-md w-full">
          <thead>
            <tr>
              <th colSpan={6}>
                <div className="flex flex-row justify-end">
                  <label className="input input-bordered flex items-center gap-2">
                    <input type="text" className="grow" placeholder="Filter table" value={filter} onChange={evt => {setFilter(() => evt.target.value); setPage(1)}} />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70">
                      <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd" />
                    </svg>
                  </label>
                </div>
              </th>
            </tr>
            <tr>
              <th><div className="tooltip" data-tip="Gene set description">
                Gene
              </div></th>
              <th><div className="tooltip cursor-pointer" data-tip="Model assigned probability" onClick={evt => {setOrderBy(orderBy => orderBy === 'proba desc' ? 'proba asc' : 'proba desc'); setPage(1)}}>
                Score
                {orderBy === 'proba asc' ? <>&uarr;</>
                  : orderBy === 'proba desc' ? <>&darr;</>
                  : <span className="invisible">&darr;</span>}
              </div></th>
              <th><div className="tooltip cursor-pointer" data-tip="Model confidence in this gene compared to other genes for this term" onClick={evt => {setOrderBy(orderBy => orderBy === 'zscore desc' ? 'zscore asc' : 'zscore desc'); setPage(1)}}>
                ZScore
                {orderBy === 'zscore asc' ? <>&uarr;</>
                  : orderBy === 'zscore desc' ? <>&darr;</>
                  : <span className="invisible">&darr;</span>}
              </div></th>
              <th><div className="tooltip cursor-pointer" data-tip="Is this gene already known to be associated with this term (yes: 1 / no: 0)?" onClick={evt => {setOrderBy(orderBy => orderBy === 'known desc' ? 'known asc' : 'known desc'); setPage(1)}}>
                Known
                {orderBy === 'known asc' ? <>&uarr;</>
                  : orderBy === 'known desc' ? <>&darr;</>
                  : <span className="invisible">&darr;</span>}
              </div></th>
            </tr>
          </thead>
          <tbody>
            {predictions.isLoading && !predictions.isStale && range(pageSize).map(p => <tr key={p} className="hover:bg-base-200">
              <td className="w-full">Loading...</td>
              <td>&nbsp;</td>
            </tr>)}
            {predictions.data?.map(prediction =>
              <tr key={prediction.gene} className={classNames("hover:bg-base-200", { 'bg-blue-100': prediction.known })}>
                <td className="w-full"><a href={`/gene/${encodeURIComponent(prediction.gene)}${props.model ? `?model=${encodeURIComponent(props.model)}` : ''}`}>{prediction.gene}</a></td>
                <td className="text-right">{prediction.proba.toFixed(2)}</td>
                <td className="text-right">{prediction.zscore?.toFixed(2)}</td>
                <td className="text-right">{prediction.known ? 1 : 0}</td>
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
