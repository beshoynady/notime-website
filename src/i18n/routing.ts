import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];

export function isRtl(locale: AppLocale): boolean {
  return locale === "ar";
}

export function dirOf(locale: AppLocale): "rtl" | "ltr" {
  return isRtl(locale) ? "rtl" : "ltr";
}
