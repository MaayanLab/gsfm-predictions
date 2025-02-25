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
          {children}
        </TrpcProvider>
      </body>
    </html>
  );
}
