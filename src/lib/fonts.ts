import type { AppLocale } from "@/i18n/routing";

/**
 * Brand font files to preload, per locale (D45). The @font-face rules are in
 * `src/app/fonts.css` (self-hosted, `display: swap`). Each locale preloads only its own
 * family: Montserrat on /en; Alexandria on /ar, both its Arabic file and its Latin file,
 * because the Arabic first screen sets Latin in Alexandria too (HUD, coordinates, timecode;
 * measured). Other files still load on demand where their characters appear (the «ع» of
 * the language toggle on /en), just not early.
 */
export const FONT_PRELOADS: Record<AppLocale, readonly string[]> = {
  en: ["/fonts/montserrat-latin.v1.woff2"],
  // Latin first (self-audit B02): while only the Arabic file has loaded, Chrome takes the ch unit
  // from it, and it has no «0», so ch falls to 0.5em (-30%) and every ch-sized headline and lead
  // narrows until the Latin file lands (measured on /ar/contact).
  ar: ["/fonts/alexandria-latin.v1.woff2", "/fonts/alexandria-arabic.v1.woff2"],
};
