import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
      <>
      <div
        style={{
          height:'151px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '-43px',
            top: '52px',
            width: '151px',
            height: '251px',
            backgroundImage: 'url("/resources/Ellipse4.svg")',
            backgroundPosition: 'left top',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '116px',
            width: '100%',
            height: '85px',
            backgroundImage: 'url("/resources/Background.svg")',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'left top',
          }}
        />
      </div>
      <main className="flex flex-col place-items-center items-center grow bg-white">
        <div className="flex flex-row p-8 gap-16 place-items-center align-center">
          <div className="prose prose-h1:text-primary prose-h1:font-normal prose-h1:text-6xl">
            <h1><span className="underline text-[#006DFF]">AI-powered gene</span> function prediction & gene set augmentation</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="prose prose-p:text-primary">
              <p>Enter a human gene name to receive AI-powered predictions about the role of the gene across key contexts such as pathway membership, disease associations, GO biological processes, knockout mouse phenotypes, and more.</p>
            </div>
            <div>
              <Link href="/search" className="btn btn-primary font-semibold bg-[#006DFF] border-0 rounded-full">Explore predictions</Link>
              <Link href="/search" className="btn btn-primary font-semibold bg-[#006DFF] border-0 rounded-full"><img src="/resources/RightArrowIcon.svg" alt="" /></Link>
            </div>
          </div>
        </div>
        <div className="bg-secondary self-stretch flex flex-row">
          <div className="flex flex-col items-start gap-4 my-4 mx-auto">
            <div className="flex items-center gap-2">
              <img src="/resources/BulletIcon.svg" alt="" />
              <span className="text-primary font-semibold text-xl">WHAT IS GSFM?</span>
            </div>
            <div className="prose">
              <p className="text-primary">
                Gene Set Foundation Model (GSFM) is a pre‑trained Deep Learning model designed to learn the next expected gene by learning from a vast collection of gene sets. By capturing shared patterns within gene sets created from many sources, for example, disease associations, pathway membership, perturbation followed by expression experiments, and other omics datasets, GSFM discovers new biological contexts for single genes and gene sets without training task‑specific models.
              </p>
            </div>
          </div>
          <img className="hidden lg:block" src="/resources/Ellipse11.svg" alt="" />
        </div>
        <div className="bg-primary self-stretch flex flex-row text-primary-content p-8 justify-around">
          <nav className="place-self-center">
            <a href="https://icahn.mssm.edu/research/portal?tab=Labs" target='_blank'><img className="w-48" src="/ismms_white.png" alt="icahn school of medicine at mount sinai center for bioinformatics" /></a>
          </nav>
          <nav className="place-self-center">
            <a href="https://labs.icahn.mssm.edu/maayanlab/" target='_blank'><img className="w-48" src="/maayanlab_white.png" alt="ma'ayan lab" /></a>
          </nav>
          <nav className="place-self-center">
            <a className="flex flex-row items-center gap-4" href="https://info.cfde.cloud" target="_blank">
              <div className="bg-white rounded-full p-1 w-12">
                <img style={{ transform: 'translate(-2px, 0)' }} src="/drc.png" alt="CFDE DRC" />
              </div>
              <span className="prose text-lg text-white text-center">CFDE WORKBENCH</span>
            </a>
          </nav>
        </div>
        {/* <div className="self-stretch bg-white p-8">
          <div className="prose prose-h3:text-primary prose-p:text-primary">
            <h3>Key capabilities</h3>
          </div>
        </div>
        <div className="self-stretch bg-secondary p-8">
          <div className="prose prose-h3:text-primary prose-p:text-primary">
            <h3>How it Works</h3>
            <div>
              <button className="btn btn-primary font-semibold bg-[#006DFF] border-0 rounded-full">Start predicting</button>
              <button className="btn btn-primary font-semibold bg-[#006DFF] border-0 rounded-full"><img src="/resources/RightArrowIcon.svg" alt="" /></button>
            </div>
          </div>
        </div> */}
        <div className="self-stretch bg-white p-8">
          <div className="prose prose-h3:text-primary prose-p:text-primary">
            <h3>Model Performance and Validation</h3>
            <p>GSFM captures the complex and high-dimensional space of genes and gene sets across biological domains. It is a foundation model for gene and gene set because it can be applied to other tasks besides gene function prediction.</p>
          </div>
          <img src="/fig-1-restyled.svg" alt="" />
        </div>
        <div className="self-stretch bg-white p-8">
          <div className="prose prose-h3:text-primary prose-p:text-primary">
            <h3>Explore the Platform</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/search">
              <div className="border-1 border-[#6992C8] rounded-sm bg-[#F9FAFE] p-3">
                <div className="bg-[#DCEBFF] text-[#013CC6] rounded-full p-2 flex flex-row justify-between">
                  <span>Search for genes or biological terms</span><img className="inline-block" src="/resources/LinkOutIcon.svg" alt="" />
                </div>
              </div>
            </Link>
            <Link href="/augment">
              <div className="border-1 border-[#6992C8] rounded-sm bg-[#F9FAFE] p-3">
                <div className="bg-[#DCEBFF] text-[#013CC6] rounded-full p-2 flex flex-row gap-2 justify-between">
                  <span>Augment gene sets</span><img src="/resources/LinkOutIcon.svg" alt="" />
                </div>
              </div>
            </Link>
            <Link href="/about">
              <div className="border-1 border-[#6992C8] rounded-sm bg-[#F9FAFE] p-3">
                <div className="bg-[#DCEBFF] text-[#013CC6] rounded-full p-2 flex flex-row gap-2 justify-between">
                  <span>Visualize prediction scores</span><img src="/resources/LinkOutIcon.svg" alt="" />
                </div>
              </div>
            </Link>
            <Link href="/downloads">
              <div className="border-1 border-[#6992C8] rounded-sm bg-[#F9FAFE] p-3">
                <div className="bg-[#DCEBFF] text-[#013CC6] rounded-full p-2 flex flex-row gap-2 justify-between">
                  <span>Download results for further analysis</span><img src="/resources/LinkOutIcon.svg" alt="" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
