'use client'
import classNames from 'classnames'
import React from 'react'

export default function DataTable<C extends object>(props: { columns: { [k in keyof C]: { th: React.ReactNode, td: (datum: C[k]) => React.ReactNode } }, data: { [k in keyof C]: C[k] }[], defaultOrderBy: `${string & keyof C} asc` | `${string & keyof C} desc` }) {
  const pageSize = 10
  const totalCount = props.data.length
  const [page, setPage] = React.useState(1)
  const [filter, setFilter] = React.useState('')
  const [orderBy, setOrderBy] = React.useState(props.defaultOrderBy)
  const view = React.useMemo(() => {
    let view = [...props.data]
    if (filter) {
      view = view.filter(record => Object.values(record).reduce((keep, value) => {
        if (!keep)
          return false
        else if (typeof value === 'string')
          return value.toLocaleLowerCase().includes(filter.toLowerCase())
        else
          return true
      }, true))
    }
    if (orderBy) {
      const [col, direction] = orderBy.split(' ') as [keyof C, 'asc' | 'desc']
      if (direction === 'asc') view.sort((a, b) => b[col] < a[col] ? 1 : b[col] > a[col] ? -1 : 0)
      else if (direction === 'desc') view.sort((a, b) => b[col] < a[col] ? -1 : b[col] > a[col] ? 1 : 0)
      else throw new Error(`Invalid direction ${direction}`)
    }
    return view.slice((page-1)*pageSize, page*pageSize)
  }, [props.data, page, filter, orderBy, pageSize])
  return (
    <div className="flex flex-col place-items-center gap-2">
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th colSpan={6}>
                <div className="flex flex-row justify-end">
                  <label className="input input-bordered flex items-center gap-2">
                    <input type="text" className="grow" placeholder="Filter table" value={filter} onChange={evt => {setFilter(() => evt.target.value); setPage(() => 1)}} />
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
              {Object.keys(props.columns).map((col) => {
                const column = props.columns[col as keyof C]
                return (
                  <th key={col}>
                    <div onClick={evt => {setOrderBy(orderBy => orderBy === `${col as string & keyof C} desc` ? `${col as string & keyof C} asc` : `${col as string & keyof C} desc`); setPage(() => 1)}}>
                      {column.th}
                      {orderBy === `${col} asc` ? <>&uarr;</>
                        : orderBy === `${col} desc` ? <>&darr;</>
                        : <span className="invisible">&darr;</span>}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {view.map((datum, i) => <tr key={i}>
              {Object.keys(props.columns).map((col, j) => {
                const column = props.columns[col as keyof C]
                return <td key={j}>{column.td(datum[col as keyof C])}</td>
              })}
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
