'use client'
import Predictions from "@/components/gene/Predictions";
import { model_name, source_rename } from '@/components/resources';
import useRWSearchParams from '@/components/rwsearchparams';
import trpc from '@/lib/trpc/client';
import classNames from 'classnames';
import React from 'react';

export default function GenePredictions(props: { gene: string, models: string[] }) {
  const [searchParams, setSearchParams] = useRWSearchParams()
  const selectedModel = React.useMemo(() => searchParams.get('model') ?? props.models[0], [searchParams, props.models])
  const sources = trpc.sources.useQuery({ model: selectedModel, gene: props.gene })
  const selected = React.useMemo(() => {
    if (sources.data) {
      for (const source of sources.data) {
        if (source.source === searchParams.get('source')) {
          return source
        }
      }
      return sources.data[0]
    }
  }, [searchParams, sources])
  React.useEffect(() => {
    if (selectedModel !== searchParams.get('model') || selected?.source !== searchParams.get('source')) {
      setSearchParams(sp => {
        sp.set('model', selectedModel)
        if (selected?.source) sp.set('source', selected?.source)
      }, { scroll: false })
    }
  }, [selectedModel, searchParams])
  return (
    <div className="flex flex-row gap-4">
      <div className="border-[#013CC6] border rounded-2xl p-4 flex flex-col w-60 shrink-0">
        <h3 className="text-primary text-xl whitespace-nowrap font-mono font-medium">Table of contents</h3>
        <ul className="menu">
          {sources.data?.map(({ source, count }) => 
            <li key={`${source}-${props.gene}`}>
              <button
                className={classNames("border border-white hover:bg-[#DCEBFF] hover:border-primary", { "bg-[#DCEBFF]": selected?.source === source })}
                onClick={evt => {evt.preventDefault(); setSearchParams(sp => { sp.set('source', source) }, { scroll: false })}}
              >
                <div className="flex flex-row gap-2 align-center items-center">
                  {/* <div className="w-8 h-8 flex items-center">
                    {typeof source_icons[source] === 'string' ? <img src={source_icons[source]} alt={(source_rename[source] ?? source).replaceAll('_', ' ')} /> : source_icons[source]}
                  </div> */}
                  <div className={classNames("text-primary px-4", { "bg-[#DCEBFF]": selected?.source === source })}>
                    {(source_rename[source] ?? source).replaceAll('_', ' ')}
                  </div>
                </div>
              </button>
            </li>
          )}
        </ul>
      </div>
      <div className="prose max-w-full border-secondary flex flex-col gap-4 grow">
        <div className="flex flex-col items-stretch place-items-stretch">
          <div role="tablist" className="tabs tabs-lift tabs-xl min-w-max">
            {props.models.map(model => <button key={model}
                role="tab"
                className={classNames("tab", { 'tab-active': searchParams.get('model') === model })}
                onClick={evt => {evt.preventDefault(); setSearchParams(sp => { sp.set('model', model) }, { scroll: false })}}
              >
                {model_name[model] ?? model}
              </button>
            )}
          </div>
          <div className="tab-content block py-4">
            {selected && <Predictions model={selectedModel} source={selected.source} gene={props.gene} count={Number(selected.count)} />}
          </div>
        </div>
      </div>
    </div>
  )
}
