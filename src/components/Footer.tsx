'use client'
import { useSearchParams } from "next/navigation"

export default function Footer() {
  const searchParams = useSearchParams()
  if (searchParams.get('embed') !== null) return null
  return (
    <>
      <footer className="footer bg-primary text-primary-content p-10 flex justify-around">
        <nav className="place-self-center">
          <a className="link link-hover" href="mailto:avi.maayan@mssm.edu">Contact Us</a>
          <a className="link link-hover" href="https://github.com/maayanlab/gsfm-predictions" target='_blank'>Source Code</a>
        </nav>
        <nav className="place-self-center">
          <a href="https://icahn.mssm.edu/research/portal?tab=Labs" target='_blank'><img className="w-48" src="/ismms_white.png" alt="icahn school of medicine at mount sinai center for bioinformatics" /></a>
        </nav>
        <nav className="place-self-center">
          <a href="https://labs.icahn.mssm.edu/maayanlab/" target='_blank'><img className="w-48" src="/maayanlab_white.png" alt="ma'ayan lab" /></a>
        </nav>
        {/* <nav className="place-self-center">
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target='_blank'><img className="w-48" src="/cc-by-nc-sa.png" alt="cc-by-4.0" /></a>
        </nav> */}
        <nav className="place-self-center">
          <a className="flex flex-row items-center gap-4" href="https://info.cfde.cloud" target="_blank">
            <div className="bg-white rounded-full p-1 w-12">
              <img style={{ transform: 'translate(-2px, 0)' }} src="/drc.png" alt="CFDE DRC" />
            </div>
            <span className="prose text-lg text-white text-center">CFDE WORKBENCH</span>
          </a>
        </nav>
      </footer>
      <div className="alert bg-secondary prose prose-sm prose-p:m-0 max-w-full rounded-none flex flex-col">
        <p className="font-bold">Please acknowledge the Gene Set Foundation Model in your publications by citing the following reference:</p>
        <p>Clarke, D. J. B. et al. A Gene Set Foundation Model Pre-Trained on a Massive Collection of Diverse Gene Sets. Preprint on bioRxiv (2025). <a href="https://doi.org/10.1101/2025.05.30.657124" target="_blank">doi:10.1101/2025.05.30.657124</a></p>
      </div>
    </>
  )
}