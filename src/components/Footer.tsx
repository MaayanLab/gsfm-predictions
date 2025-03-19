export default function Footer() {
  return (
    <footer className="footer bg-primary text-primary-content p-10 flex justify-around">
      <nav className="place-self-center">
        <a className="link link-hover" href="mailto:avi.maayan@mssm.edu">Contact Us</a>
        <a className="link link-hover" href="https://github.com/maayanlab/gsfm-predictions" target='_blank'>Source Code</a>
      </nav>
      <nav className="place-self-center">
        <a href="https://icahn.mssm.edu/research/portal?tab=Labs" target='_blank'><img className="w-48" src="https://rummagene.com/images/ismms_white.png" alt="icahn school of medicine at mount sinai center for bioinformatics" /></a>
      </nav>
      <nav className="place-self-center">
        <a href="https://labs.icahn.mssm.edu/maayanlab/" target='_blank'><img className="w-48" src="https://rummagene.com/images/maayanlab_white.png" alt="ma'ayan lab" /></a>
      </nav>
      {/* <nav className="place-self-center">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target='_blank'><img className="w-48" src="https://rummagene.com/images/cc-by-nc-sa.png" alt="cc-by-4.0" /></a>
      </nav> */}
      <nav className="place-self-center">
        <a className="flex flex-row items-center gap-4" href="https://info.cfde.cloud" target="_blank">
          <div className="bg-white rounded-full p-1 w-12">
            <img style={{ transform: 'translate(-2px, 0)' }} src="https://info.cfde.cloud/img/favicon.png" alt="CFDE DRC" />
          </div>
          <span className="prose text-lg text-white text-center">CFDE WORKBENCH</span>
        </a>
      </nav>
    </footer>
  )
}