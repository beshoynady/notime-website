import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { ABOUT_HREF, CONTACT_HREF, categoryHref, getCategories, productHref, SERVICES_INDEX_HREF, workHref, WORK_INDEX_HREF } from "@/content";
import { PRODUCT_IDS } from "@/content/product-pages";
import { workCards } from "@/content/work";
import { routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

/**
 * Public pages only, one entry per locale with hreflang alternates. The styleguide
 * (`/[locale]/styleguide`) is the client's approval page: noindex, and never listed here.
 * Add each new public page to PAGES. Service anchors (#conferences …) are sections of their
 * category page, not URLs of their own (D57). The Work filter views (/work/filter/…) are noindex
 * subsets of /work and stay out.
 */
const PAGES = [
  "",
  SERVICES_INDEX_HREF,
  ...getCategories().map((c) => categoryHref(c.slug)),
  WORK_INDEX_HREF,
  ...workCards().map((w) => workHref(w.slug)),
  ABOUT_HREF,
  ...PRODUCT_IDS.map(productHref),
  CONTACT_HREF,
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    routing.locales.map((locale) => {
      const { canonical, languages } = localeAlternates(locale, page);
      return {
        url: `${SITE_URL}${canonical}`,
        alternates: {
          languages: Object.fromEntries(Object.entries(languages).map(([l, path]) => [l, `${SITE_URL}${path}`])),
        },
      };
    }),
  );
}
