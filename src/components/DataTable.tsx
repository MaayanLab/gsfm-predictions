'use client'
import classNames from 'classnames'
import React from 'react'

export default function DataTable<C extends object>(props: { columns: { [k in keyof C]: React.ReactNode }, data: { [k in keyof C]: C[k] }[] }) {
  const pageSize = 10
  const totalCount = props.data.length
  const [page, setPage] = React.useState(1)
  const view = React.useMemo(() =>
    props.data.slice((page-1)*pageSize, page*pageSize)
  , [props.data, page, pageSize])
  return (
    <div className="flex flex-col place-items-center gap-2">
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              {Object.entries<React.ReactNode>(props.columns).map(([column, colRender]) => <th key={column}>{colRender}</th>)}
            </tr>
          </thead>
          <tbody>
            {view.map((datum, i) => <tr key={i}>
              {Object.keys(props.columns).map((col, j) => <td key={j}>{datum[col as keyof C] as React.ReactNode}</td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="place-self-center join items-center justify-center">
        {page > 2 && <button className="join-item btn" onClick={evt => {setPage(page => 1)}}>1</button>}
        {page > 3 && <button className="join-item btn btn-disabled">...</button>}
        {page > 1 && <button className="join-item btn" onClick={evt => {setPage(page => page - 1)}}>{page - 1}</button>}
        <button className={classNames("btn btn-active", { 'rounded-lg': totalCount <= pageSize, 'join-item': totalCount > pageSize })}>{page}</button>
        {page*pageSize < totalCount && <button className="join-item btn" onClick={evt => {setPage(page => page + 1)}}>{page + 1}</button>}
        {(page+2)*pageSize < totalCount && <button className="join-item btn btn-disabled">...</button>}
        {(page+1)*pageSize < totalCount && <button className="join-item btn" onClick={evt => {setPage(page => Math.ceil(totalCount/pageSize))}}>{Math.ceil(totalCount/pageSize)}</button>}
      </div>
    </div>
  )
}
