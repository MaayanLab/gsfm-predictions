import React from "react"
import type { Metadata } from "next";
import TrpcProvider from '@/lib/trpc/provider'
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/analytics";

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
    <html lang="en">
      <body>
        <TrpcProvider>
          <div className="flex flex-col min-h-screen">
            <React.Suspense fallback={null}>
              <Header />
              <main className="container mx-auto flex flex-col place-items-center items-center grow gap-4 my-4">
                {children}
              </main>
              <Footer />
            </React.Suspense>
          </div>
        </TrpcProvider>
        <Analytics />
      </body>
    </html>
  );
}
