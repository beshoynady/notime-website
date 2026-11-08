/**
 * Hrefs for the category pages (D57). Locale-less: pass them to next-intl's `Link`, which adds
 * the locale. Pure, so the menus (server-built data) and the pages share one source.
 */
import type { CategorySlug, Service } from "./types";

export const SERVICES_INDEX_HREF = "/services";

export const categoryHref = (slug: CategorySlug) => `/services/${slug}`;

/** The service's section on its category page; the anchor utility (D53) lands it. */
export const serviceHref = (s: Pick<Service, "category" | "anchor">) => `${categoryHref(s.category)}#${s.anchor}`;

/** The category page's quote form, preset to this service (`?service=<anchor>`). */
export const quoteHref = (s: Pick<Service, "category" | "anchor">) =>
  `${categoryHref(s.category)}?service=${s.anchor}#quote`;
