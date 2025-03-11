'use client'

import React from 'react'

export default function useHash() {
  const [hash, setHash] = React.useState('')
  React.useEffect(() => {
    const listener = () => {
      const hash = window.location.hash
      setHash(() => hash ? `#${hash.slice(1)}` : '')
    }
    window.addEventListener('hashchange', listener)
    listener()
    return () => {
      window.removeEventListener('hashchange', listener)
    }
  }, [])
  return [hash, (newhash: string, push: boolean = false) => {
    if (push) history.pushState(null, '', newhash ? `#${newhash.slice(1)}` : '')
    else history.replaceState(null, '', newhash ? `#${newhash.slice(1)}` : '')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }] as const
}
