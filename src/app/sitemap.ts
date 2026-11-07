import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Public pages only, one entry per locale with hreflang alternates. The styleguide
 * (`/[locale]/styleguide`) is the client's approval page: noindex, and never listed here.
 * Add each new public page to PAGES.
 */
const PAGES = [""] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${page}`,
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((l) => [l, `${siteUrl}/${l}${page}`]),
          ["x-default", `${siteUrl}/${routing.defaultLocale}${page}`],
        ]),
      },
    })),
  );
}
