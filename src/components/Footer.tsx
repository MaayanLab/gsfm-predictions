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
        <div className="flex flex-row flex-wrap justify-between border-y border-[#6992C8] bg-secondary">
          <Link className="flex flex-row gap-2 overflow-clip p-8 shrink-0" href="/">
            <img className="w-xs" src="/resources/Logo.svg" alt="Gene Set Foundation Model" />
          </Link>
          <div className="p-8 prose max-w-full lg:max-w-prose text-secondary-content">
            The Ma'ayan Lab is a computational systems biology research laboratory focused on data‑driven approaches to understanding gene regulation, cell signaling pathways, systems pharmacology, and molecular mechanisms of disease. The lab develops open bioinformatics software tools and other computational resources to accelerate biological, target, and drug discoveries.
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-8 bg-secondary justify-between">
          <nav className="flex flex-col p-8 gap-4">
            <a className="font-semibold link link-hover text-nowrap" href="/about">About</a>
            <a className="font-semibold link link-hover text-nowrap" href="/augment">Augment</a>
            <a className="font-semibold link link-hover text-nowrap" href="https://labs.icahn.mssm.edu/maayanlab/" target="_blank">Research</a>
            <a className="font-semibold link link-hover text-nowrap" href="/downloads">Downloads</a>
          </nav>
          <nav className="flex flex-col p-8 gap-4">
            <a className="font-semibold link link-hover text-nowrap" href="mailto:avi.maayan@mssm.edu">Contact Us</a>
            <a className="font-semibold link link-hover text-nowrap" href="https://github.com/maayanlab/gsfm-predictions" target='_blank'>Source Code <img className="inline-block" src="/resources/LinkOutIcon.svg" alt="" /></a>
          </nav>
          <div>&nbsp;</div>
          <img className="shrink-0 hidden lg:block" src="/resources/Ellipse2.svg" alt="" />
        </div>
        <div className="py-6 px-8 border-[#6992C8] border-t font-semibold bg-secondary text-sm">
          <a href="https://doi.org/10.1101/2025.05.30.657124" target="_blank">Clarke, D. J. B. et al. A Gene Set Foundation Model Pre-Trained on a Massive Collection of Diverse Gene Sets. Preprint on bioRxiv (2025). doi:10.1101/2025.05.30.657124</a>
        </div>
      </div>
    </>
  )
}
