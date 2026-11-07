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
  ar: ["/fonts/alexandria-arabic.v1.woff2", "/fonts/alexandria-latin.v1.woff2"],
};
