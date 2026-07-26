import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "am"],
  defaultLocale: "en",

  // URLs will always contain /en or /am
  localePrefix: "always",
});

export type AppLocale =
  (typeof routing.locales)[number];