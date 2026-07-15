import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito_Sans } from "next/font/google";

import "./globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Abune",
  description:
    "Spiritual guidance platform for fathers and children.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} min-h-screen bg-[#f5f7ff] font-sans text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
