import GeneInput from '@/components/gene/GeneInput';

export default function Search() {
  return (
      <>
      <div
        style={{
          height:'350px',
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
            right: '-340px',
            top: '6px',
            height: '305px',
            width: '760px',
            backgroundImage: 'url("/resources/Rectangle12.svg")',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-292px',
            top: '288px',
            height: '305px',
            width: '760px',
            overflow: 'hidden',
            backgroundImage: 'url("/resources/Rectangle13.svg")',
          }}
        />
        <h1
          className="text-primary text-6xl"
          style={{ position: 'absolute', width: '100%', top: '176px', textAlign: 'center' }}
        >
          Trained on millions<br />of <span className="underline text-[#006DFF]">gene sets</span>
        </h1>
      </div>
      <main className="flex flex-col place-items-center items-center grow bg-white">
        <div className="z-10 bg-secondary self-stretch flex flex-row overflow-hidden">
          <div className="flex flex-col items-start justify-between gap-4 my-4 mx-auto py-4 px-16">
            <span className="text-primary font-semibold text-xl">SEARCH GENE SYMBOL</span>
            <GeneInput />
          </div>
          <img className="hidden xl:block" src="/resources/Ellipse11.svg" alt="" />
        </div>
        <div className="self-stretch bg-white p-8 mx-auto flex flex-col items-center">
          <div className="prose prose-h3:text-primary prose-p:text-primary">
            <p>Submit a human gene symbol to the GSFM's model to receive predictions about the gene role across a variety of domains including Gene Ontology functions, disease associations, predicted knockout mouse phenotypes, regulation by transcription factors, and pathway membership.</p>
          </div>
          <img src="/fig-1-restyled.svg" alt="" />
        </div>
      </main>
    </>
  )
}