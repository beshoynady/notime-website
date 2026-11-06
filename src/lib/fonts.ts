import { Alexandria, Montserrat } from "next/font/google";

/**
 * Brand fonts. Both are variable fonts, so a single file per family covers
 * the weights in use (Montserrat 200–600, Alexandria 200–600).
 */
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-alexandria",
  display: "swap",
});

export const fontVariables = `${montserrat.variable} ${alexandria.variable}`;
