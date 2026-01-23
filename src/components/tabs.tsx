'use client'
import classNames from 'classnames'
import React from 'react'

const TabContext = React.createContext<{
  name: string,
}>({
  name: '',
})

export function TabContainer(props: React.PropsWithChildren<{ name: string, className: string }>) {
  const ref = React.useRef({} as Record<string, boolean>)
  return (
    <TabContext.Provider value={{
      name: props.name,
    }}>
      <div role="tablist" className={classNames("tabs", props.className)}>
        {props.children}
      </div>
    </TabContext.Provider>
  )
}

export function Tab(props: { id: string, className?: string, label: string, checked: boolean, onChange: (id: string) => void }) {
  const ctx = React.useContext(TabContext)
  return <input
    type="radio"
    role="tab"
    name={ctx.name}
    className={classNames("tab", props.className, {'tab-active': props.checked})}
    aria-label={props.label}
    checked={props.checked}
    onChange={evt => {if (evt.currentTarget.checked) { props.onChange(props.id) }}}
  />
}

export function TabContent(props: React.PropsWithChildren<{ className?: string }>) {
  return <div role="tabpanel" className={classNames("tab-content", props.className)}>{props.children}</div>
}
