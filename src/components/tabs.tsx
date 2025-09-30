'use client'
import classNames from 'classnames'
import React from 'react'

const TabContext = React.createContext<{
  name: string,
  register: (props: { id: string, onChange: (id: string) => void }) => () => void,
}>({
  name: '',
  register: (props: { id: string, onChange: (id: string) => void }) => () => {},
})

export function TabContainer(props: React.PropsWithChildren<{ name: string, className: string }>) {
  const ref = React.useRef({} as Record<string, boolean>)
  return (
    <TabContext.Provider value={{
      name: props.name,
      register: (props: { id: string, onChange: (id: string) => void }) => {
        if (!(props.id in ref.current)) {
          if (Object.keys(ref.current).length === 0) {
            ref.current[props.id] = true
            props.onChange(props.id)
          }
        }
        return () => { delete ref.current[props.id] }
      },
    }}>
      <div role="tablist" className={classNames("tabs", props.className)}>
        {props.children}
      </div>
    </TabContext.Provider>
  )
}

export function Tab(props: { id: string, label: string, checked: boolean, onChange: (id: string) => void }) {
  const ctx = React.useContext(TabContext)
  React.useEffect(() => ctx.register(props), [props.id])
  return <input
    type="radio"
    role="tab"
    name={ctx.name}
    className="tab whitespace-nowrap"
    aria-label={props.label}
    checked={props.checked}
    onChange={evt => {if (evt.currentTarget.checked) { props.onChange(props.id) }}}
  />
}

export function TabContent(props: React.PropsWithChildren<{ className: string }>) {
  return <div role="tabpanel" className={classNames("tab-content", props.className)}>{props.children}</div>
}
