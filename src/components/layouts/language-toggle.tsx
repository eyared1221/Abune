"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";

import {
  usePathname,
  useRouter,
} from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppLocale = "en" | "am";

const languages: Array<{
  locale: AppLocale;
  label: string;
  fullName: string;
}> = [
  {
    locale: "en",
    label: "ENG",
    fullName: "English",
  },
  {
    locale: "am",
    label: "AMH",
    fullName: "Amharic",
  },
];

export function LanguageToggle() {
  const currentLocale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const changeLanguage = (nextLocale: AppLocale) => {
    if (nextLocale === currentLocale) {
      return;
    }

    startTransition(() => {
      router.replace(pathname, {
        locale: nextLocale,
      });
    });
  };

  return (
    <div
      aria-label="Choose language"
      className={cn(
        "inline-flex h-11 shrink-0 items-center rounded-full",
        "border border-[#e7d8bc] bg-[#faf5ec] p-1",
        "shadow-[0_5px_14px_rgba(62,72,96,0.06)]",
        isPending && "pointer-events-none opacity-60",
      )}
      role="group"
    >
      {languages.map((language) => {
        const isActive =
          currentLocale === language.locale;

        return (
          <button
            key={language.locale}
            aria-label={`Change language to ${language.fullName}`}
            aria-pressed={isActive}
            className={cn(
              "flex h-8 min-w-[48px] items-center justify-center",
              "rounded-full px-3 text-[11px] font-black",
              "tracking-[0.06em] transition-all duration-200",
              isActive
                ? [
                    "bg-[#d9b34b] text-[#173461]",
                    "shadow-[0_5px_12px_rgba(201,157,64,0.25)]",
                  ]
                : [
                    "text-[#77849d]",
                    "hover:bg-white hover:text-[#173461]",
                  ],
            )}
            disabled={isPending}
            onClick={() =>
              changeLanguage(language.locale)
            }
            type="button"
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}