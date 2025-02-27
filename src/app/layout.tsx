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
            {children}
            <Footer />
          </div>
        </TrpcProvider>
      </body>
    </html>
  );
}
