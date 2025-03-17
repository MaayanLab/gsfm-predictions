import type { Metadata } from "next";
import TrpcProvider from '@/lib/trpc/provider'
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto flex flex-col place-items-center items-center grow gap-4 my-4">
              {children}
            </main>
            <Footer />
          </div>
        </TrpcProvider>
      </body>
    </html>
  );
}
