'use client'
import Link from "next/link"
import Image from 'next/image'
import { useSearchParams } from "next/navigation"

export default function Footer() {
  const searchParams = useSearchParams()
  if (searchParams.get('embed') !== null) return null
  return (
    <>
      <div className="bg-transparent text-secondary-content flex flex-col justify-around">
        <div className="flex flex-row justify-between border-y-1 border-[#6992C8] bg-secondary">
          <Link className="flex flex-row gap-2 overflow-clip p-8 shrink-0" href="/">
            <img style={{ width: '372.88px' }} src="/resources/Logo.svg" alt="" />
          </Link>
          <div className="p-8 prose text-secondary-content">
            The Ma’ayan Lab is a computational biology research group focused on data‑driven approaches to understanding gene regulation, signaling pathways, and disease mechanisms. The lab develops open tools and resources to accelerate biological discovery.
          </div>
        </div>
        <div className="flex flex-row gap-8 h-[233px] bg-secondary">
          <nav className="flex flex-col p-8 gap-4">
            <a className="font-semibold link link-hover" href="/about">About</a>
            <a className="font-semibold link link-hover" href="/augment">Augment</a>
            <a className="font-semibold link link-hover" href="https://labs.icahn.mssm.edu/maayanlab/" target="_blank">Research</a>
            <a className="font-semibold link link-hover" href="/downloads">Downloads</a>
          </nav>
          <nav className="flex flex-col p-8 gap-4">
            <a className="font-semibold link link-hover" href="mailto:avi.maayan@mssm.edu">Contact Us</a>
            <a className="font-semibold link link-hover" href="https://github.com/maayanlab/gsfm-predictions" target='_blank'>Source Code <img className="inline-block" src="/resources/LinkOutIcon.svg" alt="" /></a>
          </nav>
          <div className="grow">&nbsp;</div>
          <img className="shrink-0" src="/resources/Ellipse2.svg" alt="" />
        </div>
        <div className="py-6 px-8 border-[#6992C8] border-t-1 font-semibold bg-secondary text-sm">
          <a href="https://doi.org/10.1101/2025.05.30.657124" target="_blank">Clarke, D. J. B. et al. A Gene Set Foundation Model Pre-Trained on a Massive Collection of Diverse Gene Sets. Preprint on bioRxiv (2025). doi:10.1101/2025.05.30.657124</a>
        </div>
      </div>
    </>
  )
}
