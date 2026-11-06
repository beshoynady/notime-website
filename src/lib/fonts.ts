import { Alexandria, Montserrat } from "next/font/google";

/**
 * Brand fonts. Both are variable fonts, so a single file per family covers
 * the weights in use (Montserrat 200–600 in use; Alexandria 200–700).
 */
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "optional", // preloaded + optional: no late swap, so no layout shift (D38)
  adjustFontFallback: true, // metric-matched local fallback: no layout shift on swap (D34)
});

export const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  // Brand guide: 300–700, plus 200 for the hero (Arabic title line 1, second beat). The
  // default "variable" weight loads the whole wght axis in one file (D35).
  weight: "variable",
  variable: "--font-alexandria",
  display: "optional", // preloaded + optional: no late swap, so no layout shift (D38)
  adjustFontFallback: true, // metric-matched local fallback: no layout shift on swap (D34)
});

export const fontVariables = `${montserrat.variable} ${alexandria.variable}`;
