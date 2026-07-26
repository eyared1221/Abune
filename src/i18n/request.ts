import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = requestedLocale ?? routing.defaultLocale;

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  return {
    locale,
    messages: (
      await import(`../../messages/${locale}.json`)
    ).default,
  };
});
