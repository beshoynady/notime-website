import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

/**
 * The locale comes from the `[locale]` root param via `next/root-params`
 * (DECISIONS D13), not the deprecated `requestLocale` / `setRequestLocale`.
 * An explicit override (e.g. `getTranslations({ locale })`) wins.
 */
export default getRequestConfig(async ({ locale: override }) => {
  const candidate = override ?? (await rootLocale());
  const locale = hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // Fixed zone so output never depends on the build machine.
    timeZone: "Asia/Dubai",
  };
});
