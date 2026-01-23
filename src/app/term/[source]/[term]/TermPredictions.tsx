'use client'
import { model_name } from '@/components/resources';
import useRWSearchParams from '@/components/rwsearchparams';
import { Tab, TabContainer, TabContent } from '@/components/tabs';
import Predictions from "@/components/term/Predictions";
import trpc from '@/lib/trpc/client';
import classNames from 'classnames';

export default function TermPredictions(props: { source: string, term: string, models: string[] }) {
  return (
    <div className="prose max-w-full border border-t-0 border-secondary rounded-b-lg p-4 flex flex-col gap-4">
      <TabContainer className="tabs-lift tabs-xl" name="model-term-tabs">
        {props.models.map(model => <ModelTab key={model} model={model} source={props.source} term={props.term} />)}
      </TabContainer>
    </div>
  )
}

function ModelTab(props: { model: string, source: string, term: string }) {
  const [searchParams, setSearchParams] = useRWSearchParams()
  const termGenes = trpc.termGenes.useQuery({ model: props.model, source: props.source, term: props.term })
  return !!termGenes.data?.count && <>
    <Tab
      id={props.model}
      label={model_name[props.model] ?? props.model}
      checked={searchParams.get('model') === props.model}
      onChange={() => {setSearchParams(sp => { sp.set('model', props.model) })}}
    />
    <TabContent className="bg-base-100 border-base-300 prose max-w-none">
      {searchParams.get('model') === props.model && <ModelPredictions model={props.model} source={props.source} term={props.term} count={termGenes.data.count} />}
    </TabContent>
  </>
}


function ModelPredictions(props: { model?: string, source: string, term: string, count: number }) {
  return <div className={classNames("mx-4 p-4 flex flex-col")}>
    <Predictions model={props.model} source={props.source} term={props.term} count={props.count} />
  </div>
}
