import type { Metadata } from "next";
import TrpcProvider from '@/lib/trpc/provider'
import "./globals.css";

export const metadata: Metadata = {
  title: "GSFM",
  description: "Gene Set Foundation Model",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TrpcProvider>
          <div className="flex flex-col min-h-screen w-screen">
            <header className="m-2">
              <div className="navbar bg-base-100">
                <a className="btn btn-ghost text-xl" href="/">Gene Set Foundation Model</a>
              </div>
            </header>
            {children}
            <footer className="footer bg-neutral text-neutral-content p-10">
              <nav className="place-self-center">
                <a className="link link-hover" href="mailto:avi.maayan@mssm.edu">Contact Us</a>
                <a className="link link-hover" href="https://github.com/maayanlab/gsfm" target='_blank'>Source Code</a>
              </nav>
              <nav className="place-self-center">
                <a href="https://icahn.mssm.edu/research/portal?tab=Labs" target='_blank'><img className="w-48" src="https://rummagene.com/images/ismms_white.png" alt="icahn school of medicine at mount sinai center for bioinformatics" /></a>
              </nav>
              <nav className="place-self-center">
                <a href="https://labs.icahn.mssm.edu/maayanlab/" target='_blank'><img className="w-48" src="https://rummagene.com/images/maayanlab_white.png" alt="ma'ayan lab" /></a>
              </nav>
              <nav className="place-self-center">
                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target='_blank'><img className="w-48" src="https://rummagene.com/images/cc-by-nc-sa.png" alt="cc-by-4.0" /></a>
              </nav>
            </footer>
          </div>
        </TrpcProvider>
      </body>
    </html>
  );
}
