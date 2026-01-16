'use client'

import GeneInput from "@/components/gene/GeneInput"
import Image from "next/image"
import Link from "next/link"
import iconSvg from '@/app/icon.svg'
import searchIconSvg from '@/app/search-icon.svg'
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import classNames from "classnames"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ gene?: string }>()
  const searchParams = useSearchParams()
  if (searchParams.get('embed') !== null) return null
  return (
    <header className="my-2 px-2 shadow bg-white z-1">
      <div className="navbar bg-base-100 gap-x-10 justify-stretch flex flex-row">
        <Link className="flex flex-row gap-2" href="/">
          <Image src={iconSvg} alt="GSFM Logo" unoptimized />
        </Link>
        <div className="flex-none flex flex-row gap-2 my-2 place-items-center">
          {pathname !== '/' && <GeneInput
            value={params.gene ?? ''}
            onChange={value => {
              router.push(`/gene/${encodeURIComponent(value)}`)
            }}
          />}
        </div>
        <div className="flex-grow">&nbsp;</div>
        <Link className={classNames("text-primary font-semibold", { 'border-b-2': pathname === '/about' })} href="/about">About</Link>
        <Link className={classNames("text-primary font-semibold", { 'border-b-2': pathname === '/augment' })} href="/augment" >Augment</Link>
        <Link className={classNames("text-primary font-semibold", { 'border-b-2': pathname === '/downloads' })} href="/downloads">Downloads</Link>
        <Link className={classNames("flex flex-row gap-4 border rounded-full p-4 text-primary font-semibold", { 'border-b-2': pathname === '/' || pathname.startsWith('/gene/') })} href="/"><Image src={searchIconSvg} alt="" unoptimized />Search&nbsp;</Link>
      </div>
    </header>
  )
}
