export default function Banner() {
  return (
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
  )
}