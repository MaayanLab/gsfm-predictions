import React from 'react'

type MDComponentProps = {
  'root': { type: 'root', children: MDComponentChildren },
  't': { type: 't', text: string },
  'p': { type: 'p', children: MDComponentChildren },
  'b': { type: 'b', children: MDComponentChildren },
  'i': { type: 'i', children: MDComponentChildren },
  'a': { type: 'a', href: string, children: MDComponentChildren },
  'f': { type: 'f', ref: string },
  'fg': { type: 'fg', children: MDComponentChildren<'fg_f' | 'fg_fs'> },
  'fg_f': { type: 'fg_f', ref: string },
  'fg_fs': { type: 'fg_fs', start_ref: string, end_ref: string },
  'rg': { type: 'rg', children: MDComponentChildren<'r'> },
  'r': { type: 'r', ref: string, children: MDComponentChildren },
}
type MDComponentChildren<T extends keyof MDComponentProps = keyof MDComponentProps> = MDComponentProps[T][]

const MDComponents: {[K in keyof MDComponentProps]: (props: MDComponentProps[K]) => React.ReactNode} = {
  root(props) {
    return <MDRecurse {...props} />
  },
  p(props) {
    return <p><MDRecurse {...props} /></p>
  },
  f(props) {
    return <sup><a href={`#ref-${props.ref}`} className="no-underline">{props.ref}</a></sup>
  },
  fg(props) {
    return <sup>{props.children.map((child, i) => {
      return <React.Fragment key={i}>{i > 0 && ','}<MD {...child} /></React.Fragment>
    })}</sup>
  },
  fg_f(props) {
    return <a href={`#ref-${props.ref}`} className="no-underline">{props.ref}</a>
  },
  fg_fs(props) {
    return <><a href={`#ref-${props.start_ref}`} className="no-underline">{props.start_ref}</a>-<a href={`#ref-${props.end_ref}`} className="no-underline">{props.end_ref}</a></>
  },
  a(props) {
    return <a href={props.href} target="_blank"><MDRecurse {...props} /></a>
  },
  b(props) {
    return <b><MDRecurse {...props} /></b>
  },
  i(props) {
    return <i><MDRecurse {...props} /></i>
  },
  rg(props) {
    return (
      <details className="collapse" open={props.children.length < 5}>
        <summary className="collapse-title font-bold p-0">References (click to toggle)</summary>
        <div className="collapse-content p-0 flex flex-col text-sm"><MDRecurse {...props} /></div>
      </details>
    )
  },
  r(props) {
    return <div><a id={`ref-${props.ref}`} className="no-underline">[{props.ref}]</a> <MDRecurse {...props} /></div>
  },
  t(props) {
    return <>{props.text}</>
  },
}

function MD<T extends MDComponentProps[keyof MDComponentProps]>(props: T) {
  const Component = MDComponents[props.type] as ((props: T) => React.ReactElement) | undefined
  if (!Component) return null
  return <Component {...props} />
}

function MDRecurse(props: { children: MDComponentProps[keyof MDComponentProps][] }) {
  return props.children.map((child, i) => <MD key={i} {...child} />)
}

export default function MDT(props: { src: string }) {
  try {
    return <MD {...JSON.parse(props.src)} />
  } catch (e) {
    console.error(e)
    return props.src
  }
}
