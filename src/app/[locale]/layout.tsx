import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  setRequestLocale,
} from "next-intl/server";
import type { ReactNode } from "react";

import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { routing } from "@/i18n/routing";

import "../globals.css";

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
      {
        url: "/icons/abune-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/abune-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/abune-192.png",
        sizes: "192x192",
        type: "image/png",
      },
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${nunito.variable} min-h-screen bg-[#f5f7ff] font-sans text-foreground antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ServiceWorkerRegister />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
