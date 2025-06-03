'use client'
import React from 'react'
import Script from "next/script"
import { usePathname } from 'next/navigation'

function GA({ id }) {
  const pathname = usePathname()
  React.useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', id);
  }, [id])
  React.useEffect(() => {
    if (typeof window.dataLayer === 'undefined') return
    function gtag(){window.dataLayer.push(arguments);}
    gtag({
      event: 'pageview',
      pageUrl: pathname,
    })
  }, [pathname])
  return <Script
    src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
    strategy="lazyOnload"
  />
}

export default function Analytics() {
  return (
    <>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GA id={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />}
    </>
  )
}
