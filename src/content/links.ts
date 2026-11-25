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

/** The Work index (v1 plan F1); filtered views live under it (`src/lib/work-filter.ts`). */
export const WORK_INDEX_HREF = "/work";

/** A case study. Slugs are stable and anonymous (work.ts), so they survive a switch to the named version. */
export const workHref = (slug: string) => `${WORK_INDEX_HREF}/${slug}`;

export const ABOUT_HREF = "/about";

/** The brief (F3, D102); `contactHref("apps")` presets the service. */
export const CONTACT_HREF = "/contact";
export const contactHref = (anchor?: string) => (anchor ? `${CONTACT_HREF}?service=${anchor}` : CONTACT_HREF);
/** The brief with a category hint (D126): that group first and, for Events, the event fields. */
export const contactCategoryHref = (slug: CategorySlug) => `${CONTACT_HREF}?category=${slug}`;

/** A product page (F4), by the product's id in the forms contract ("invitely", "smart-menu"). */
export const productHref = (id: string) => `/products/${id}`;

/** Labels for breadcrumbs (visible and JSON-LD). */
export const BREADCRUMB_LABELS = {
  home: { en: "Home", ar: "الرئيسية" },
  services: { en: "Services", ar: "الخدمات" },
  work: { en: "Work", ar: "أعمالنا" },
  about: { en: "About", ar: "من نحن" },
  contact: { en: "Contact", ar: "تواصلوا معنا" },
} as const;

/** The organization as JSON-LD names it: name and URL only, nothing unconfirmed. */
export const ORGANIZATION_NAME = "NO TIME Creative House";
