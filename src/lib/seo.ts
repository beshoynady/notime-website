import { routing, type AppLocale } from "@/i18n/routing";

/**
 * `metadata.alternates` for a locale-less path ("" for the locale root): the canonical is the
 * current locale's URL, and hreflang lists every locale plus x-default (the default locale).
 * Relative URLs; `metadataBase` (set in the locale layout) makes them absolute.
 */
export function localeAlternates(locale: AppLocale, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: Object.fromEntries([
      ...routing.locales.map((l) => [l, `/${l}${path}`]),
      ["x-default", `/${routing.defaultLocale}${path}`],
    ]) as Record<AppLocale | "x-default", string>,
  };
}
