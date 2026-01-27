'use client'
import Link from 'next/link'
import Content from './content.mdx'
import Banner from '@/components/Banner'
import Linkouts from '@/components/Linkouts'
import ButtonWithIcon from '@/components/ButtonWithIcon'

export default function About() {
  return (
    <>
      <div
        style={{
          position: 'relative',
          height:'450px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '0px',
            top: '-410px',
            height: '630px',
            width: '630px',
            backgroundImage: 'url("/resources/AboutHeroRight.svg")',
          }}
        />
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute',
            bottom: '-410px',
            height: '630px',
            width: '630px',
            backgroundImage: 'url("/resources/AboutHeroLeft.svg")',
          }}
        />
        <div className="flex flex-row p-36 gap-36 place-items-center align-center">
          <div className="prose prose-h1:text-primary prose-h1:font-normal prose-h1:text-6xl">
            <h1>Gene Set<br /><span className="underline text-[#006DFF]">Foundation Model</span></h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="prose prose-p:text-primary lg:w-92">
              <p>Advancing gene set functional analysis through open, data-driven science.</p>
            </div>
            <Link href="/search">
              <ButtonWithIcon
                className="btn btn-primary font-semibold"
                icon={<img src="/resources/RightArrowIcon.svg" alt="" />}
              >Explore predictions</ButtonWithIcon>
            </Link>
          </div>
        </div>
      </div>
      <div className="self-stretch bg-white p-8 flex flex-col gap-8 items-start">
        <div className="prose prose-h3:text-primary prose-p:text-primary">
          <h3>Who we are</h3>
          <p>GSFM (Gene Set Functional Models) is a research platform developed by the Ma’ayan Lab, focused on enabling scalable, reproducible, and interpretable gene set functional analysis.</p>
        </div>
        <div className="grid grid-flow-col gap-4 justify-around">
          <div className="relative flex justify-center items-center">
            <div className="absolute bottom-2 p-2 w-full text-center">
              <div className="bg-white m-2 prose text-primary">
                <h5 className="text-nowrap font-semibold">Avi Ma'ayan, PhD</h5>
                <h6 className="text-nowrap">Professor in Bioinformatics</h6>
              </div>
            </div>
            <img
              style={{ width: '100%', maxWidth: '350px', maxHeight: '350px', height: 'auto' }}
              alt="Avi Ma'ayan, PhD"
              src="/resources/author-avi-maayan.png"
            />
          </div>
          <div className="relative flex justify-center items-center">
            <div className="absolute bottom-2 p-2 w-full text-center">
              <div className="bg-white m-2 prose text-primary">
                <h5 className="text-nowrap font-semibold">Daniel J. B. Clarke, MS</h5>
                <h6 className="text-nowrap">Data Science Analyst</h6>
              </div>
            </div>
            <img
              style={{ width: '100%', maxWidth: '350px', maxHeight: '350px', height: 'auto' }}
              alt="Daniel J. B. Clarke, MS"
              src="/resources/author-daniel-clarke.png"
            />
          </div>
          <div className="relative flex justify-center items-center">
            <div className="absolute bottom-2 p-2 w-full text-center">
              <div className="bg-white m-2 prose text-primary">
                <h5 className="text-nowrap font-semibold">Giacomo B. Marino</h5>
                <h6 className="text-nowrap">Bioinformatician</h6>
              </div>
            </div>
            <img
              style={{ width: '100%', maxWidth: '350px', maxHeight: '350px', height: 'auto' }}
              alt="Giacomo B. Marino"
              src="/resources/author-giacomo-marino.png"
            />
          </div>
        </div>
      </div>
      <div className="self-stretch bg-white p-8">
        <div className="prose prose-h3:text-primary prose-p:text-primary">
          <h3>Model Performance and Validation</h3>
          <p>GSFM captures the complex and high-dimensional space of genes and gene sets across biological domains. It is a foundation model for gene and gene sets because it can be applied to other tasks besides gene function prediction.</p>
        </div>
        <img src="/fig-1-restyled.svg" alt="" />
      </div>
      <Linkouts
        title={<>Data Availability</>}
        links={[
          {
            href: "https://github.com/MaayanLab/gsfm",
            target: "_blank",
            label: <span>The foundation model training</span>,
          },
          {
            href: "https://huggingface.co/collections/maayanlab/gsfm-68d5a2ff093d93d3c005108e",
            target: "_blank",
            label: <span>Model weights</span>,
          },
          {
            href: "https://github.com/MaayanLab/gsfm-predictions",
            target: "_blank",
            label: <span>The source code for the website</span>,
          },
          {
            href: "/downloads",
            label: <span>Benchmark results</span>,
          },
        ]}
      />
      <Banner />
    </>
  )
}