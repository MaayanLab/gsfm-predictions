import React from "react"
import type { Metadata } from "next";
import TrpcProvider from '@/lib/trpc/provider'
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/analytics";
import { Schibsted_Grotesk, JetBrains_Mono } from 'next/font/google'
import classNames from "classnames";

const schibsted_grotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-schibsted-grotesk',
})
 
const jetbrains_mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: {
    template: 'GSFM | %s',
    default: 'GSFM'
  },
  description: "Predict gene function with Gene Set Foundation Model (GSFM)",
  keywords: [
    'big data',
    'bioinformatics',
    'cancer',
    'cell line',
    'data',
    'dataset',
    'diabetes',
    'disease',
    'drug discovery',
    'drug',
    'gene set library',
    'gene set',
    'gene',
    'genomics',
    'machine learning',
    'pharmacology',
    'phenotype',
    'protein',
    'proteomics',
    'RNA-seq',
    'RNAseq',
    'systems biology',
    'target discovery',
    'target',
    'therapeutics',
    'transcriptomics',
    'gene function',
    'predictions',
  ].join(', ')
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={classNames(schibsted_grotesk.variable, jetbrains_mono.variable)}>
      <body>
        <TrpcProvider>
          <div className="flex flex-col min-h-screen">
            <React.Suspense fallback={null}>
              <Header />
              {children}
              <Footer />
            </React.Suspense>
          </div>
        </TrpcProvider>
        <Analytics />
      </body>
    </html>
  );
}
