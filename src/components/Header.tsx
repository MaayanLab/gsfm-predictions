'use client'

import GeneInput from "@/components/gene/GeneInput"
import Image from "next/image"
import Link from "next/link"
import iconSvg from '@/app/icon.svg'
import { useParams, usePathname, useRouter } from "next/navigation"
import classNames from "classnames"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ gene?: string }>()
  return (
    <header className="container mx-auto my-2 px-2">
      <div className="navbar bg-base-100 gap-2">
        <div className="flex-1">
          <Link className="flex flex-row justify-start align-middle items-center gap-2" href="/">
            <div className="shadow-md rounded-full w-12 h-12 p-1 flex">
              <Image src={iconSvg} alt="GSFM Logo" unoptimized />
            </div>
            <span className="font-bold text-xl lg:text-3xl xl:text-4xl text-primary">
              Gene Set Foundation Model (GSFM)
            </span>
          </Link>
        </div>
        <div className="flex-none flex flex-row gap-2 place-items-center">
          {pathname !== '/' && <GeneInput
            value={params.gene ?? ''}
            onChange={value => {
              router.push(`/gene/${encodeURIComponent(value)}`)
            }}
          />}
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-8">
        <Link className={classNames("text-primary font-bold", { 'border-b-2': pathname === '/' || pathname.startsWith('/gene/') })} href="/">SEARCH</Link>
        <Link className={classNames("text-primary font-bold", { 'border-b-2': pathname === '/augment' })} href="/augment" >AUGMENT</Link>
        <Link className={classNames("text-primary font-bold", { 'border-b-2': pathname === '/downloads' })} href="/downloads">DOWNLOADS</Link>
        <Link className={classNames("text-primary font-bold", { 'border-b-2': pathname === '/about' })} href="/about">ABOUT</Link>
      </div>
    </header>
  )
}
