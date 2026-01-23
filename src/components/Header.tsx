'use client'

import GeneInput from "@/components/gene/GeneInput"
import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import classNames from "classnames"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ gene?: string }>()
  const searchParams = useSearchParams()
  if (searchParams.get('embed') !== null) return null
  return (
    <header className="my-2 px-2 shadow bg-white z-1 h-23 items-center">
      <div className="navbar bg-base-100 gap-x-10 size-full flex flex-row">
        <Link className="flex flex-row gap-2 overflow-clip px-2 shrink-0" href="/">
          <img src="/resources/Logo.svg" alt="Logo" />
        </Link>
        <div className="grow">&nbsp;</div>
        <Link className={classNames("text-primary font-semibold", { 'border-b-2': pathname === '/about' })} href="/about">About</Link>
        <Link className={classNames("text-primary font-semibold", { 'border-b-2': pathname === '/augment' })} href="/augment" >Augment</Link>
        <Link className={classNames("text-primary font-semibold", { 'border-b-2': pathname === '/downloads' })} href="/downloads">Downloads</Link>
        <Link className={classNames("flex flex-row gap-4 border rounded-full p-4 text-primary font-semibold shrink-0")} href="/search"><img src="/resources/SearchIcon.svg" alt="" />Search&nbsp;</Link>
      </div>
    </header>
  )
}
