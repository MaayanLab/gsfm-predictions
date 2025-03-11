'use client'

import GeneInput from "@/components/gene/GeneInput"
import Image from "next/image"
import Link from "next/link"
import iconSvg from '@/app/icon.svg'
import { useParams, usePathname, useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ gene?: string }>()
  return (
    <header className="my-2 px-2">
      <div className="navbar bg-base-100 gap-2">
        <div className="flex-1">
          <Link className="flex flex-row justify-start align-middle gap-2" href="/">
            <Image className="w-6" src={iconSvg} alt="GSFM Logo" unoptimized />
            <span className="font-bold text-xl lg:text-3xl xl:text-4xl text-primary">
              Gene Set Foundation Model (GSFM)
            </span>
          </Link>
        </div>
        <div className="flex-none">
          {pathname !== '/' && <GeneInput
            value={params.gene ?? ''}
            onChange={value => {
              router.push(`/gene/${encodeURIComponent(value)}`)
            }}
          />}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-sm">
              <li><a href="/downloads">Downloads</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
