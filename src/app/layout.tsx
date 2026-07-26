import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
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
  applicationName: "Abune",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/abune-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/abune-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/abune-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Abune",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#c69a39",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} min-h-screen bg-[#f5f7ff] font-sans text-foreground antialiased`}>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
