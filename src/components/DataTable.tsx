'use client'
import classNames from 'classnames'
import React from 'react'

export default function DataTable<C extends object>(props: { title?: React.ReactElement, columns: { [k in keyof C]: { th: React.ReactNode, td: (datum: C[k]) => React.ReactNode } }, data: { [k in keyof C]: C[k] }[], defaultOrderBy: `${string & keyof C} asc` | `${string & keyof C} desc` }) {
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
    <div className="flex flex-col place-items-start gap-2 m-4">
      <div className="flex flex-row self-stretch justify-between items-center">
        <span className="text-primary">{props.title}</span>
        <label className={classNames("input input-bordered flex items-center rounded-full text-primary font-semibold not-focus-within:w-28")}>
          <img src="/resources/SearchIcon.svg" alt="" />
          <input type="text" className="grow not-focus:placeholder:text-primary" placeholder="Search" value={filter} onChange={evt => {setFilter(() => evt.target.value); setPage(1)}} />
        </label>
      </div>
      <table className="table table-sm text-primary">
        <thead className="bg-[#F9FAFE]">
          <tr>
            {Object.keys(props.columns).map((col) => {
              const column = props.columns[col as keyof C]
              return (
                <th key={col} className="text-primary text-center">
                  <button
                    className="cursor-pointer"
                    onClick={evt => {setOrderBy(orderBy => orderBy === `${col as string & keyof C} desc` ? `${col as string & keyof C} asc` : `${col as string & keyof C} desc`); setPage(() => 1)}}
                  >
                    {column.th}
                    {orderBy === `${col} asc` ? <>&uarr;</>
                      : orderBy === `${col} desc` ? <>&darr;</>
                      : <span className="invisible">&darr;</span>}
                  </button>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {view.map((datum, i) => <tr key={i}>
            {Object.keys(props.columns).map((col, j) => {
              const column = props.columns[col as keyof C]
              return <td key={j} className={classNames('text-center', {  'bg-[#DCEBFF]': i%2==0 })}>{column.td(datum[col as keyof C])}</td>
            })}
          </tr>)}
        </tbody>
      </table>
      <div className="join items-center justify-center gap-1">
        {page > 2 && <button className="join-item btn text-[#6992C8] bg-white border font-normal border-[#6992C8] rounded-lg" onClick={evt => {setPage(page => 1)}}>1</button>}
        {page > 3 && <button className="join-item btn text-[#6992C8] bg-white border font-normal border-[#6992C8] rounded-lg btn-disabled">...</button>}
        {page > 1 && <button className="join-item btn text-[#6992C8] bg-white border font-normal border-[#6992C8] rounded-lg" onClick={evt => {setPage(page => page - 1)}}>{page - 1}</button>}
        <button className={classNames("btn rounded-lg btn-active border border-[#6992C8] bg-[#DCEBFF] text-[#013CC6]", { 'rounded-lg': totalCount <= pageSize, 'join-item': totalCount > pageSize })}>{page}</button>
        {page*pageSize < totalCount && <button className="join-item btn text-[#6992C8] bg-white border font-normal border-[#6992C8] rounded-lg" onClick={evt => {setPage(page => page + 1)}}>{page + 1}</button>}
        {(page+2)*pageSize < totalCount && <button className="join-item btn text-[#6992C8] bg-white border font-normal border-[#6992C8] rounded-lg btn-disabled">...</button>}
        {(page+1)*pageSize < totalCount && <button className="join-item btn text-[#6992C8] bg-white border font-normal border-[#6992C8] rounded-lg" onClick={evt => {setPage(page => Math.ceil(totalCount/pageSize))}}>{Math.ceil(totalCount/pageSize)}</button>}
      </div>
    </div>
  )
}
