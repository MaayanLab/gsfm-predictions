'use client'

import GeneInput from "@/components/gene/GeneInput"
import { useParams, useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter()
  const params = useParams<{ gene: string }>()
  return (
    <header className="my-2 px-2">
      <div className="navbar bg-base-100">
        <a className="btn btn-ghost text-xl" href="/">Gene Set Foundation Model (GSFM)</a>
        <div className="flex-grow">&nbsp;</div>
        {params.gene && <GeneInput
          value={params.gene}
          onChange={value => {
            router.push(`/gene/${encodeURIComponent(value)}`)
          }}
        />}
      </div>
    </header>
  )
}
