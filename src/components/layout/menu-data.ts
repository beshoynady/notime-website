import { getCategories, getProducts, getServiceCount, getServices, type CategorySlug, type Locale } from "@/content";
import { orderNumeral } from "@/lib/roman";
import { SERVICES_HREF } from "./nav-links";

/** Serializable, localized menu data built on the server and passed to the client menus. */
export interface MenuCategory {
  slug: CategorySlug;
  numeral: string;
  title: string;
  summary: string;
  image: string;
  href: string;
  services: { slug: string; title: string; href: string }[];
}
export interface MenuData {
  categories: MenuCategory[];
  products: { slug: string; name: string; href: string }[];
  serviceCount: number;
  allServicesHref: string;
}

// TODO: replace placeholder — category, service and product pages arrive in a later phase;
// until then every menu link points at the homepage services section.
const DIGITAL_ANCHOR = "/#digital";

export function getMenuData(locale: Locale): MenuData {
  return {
    categories: getCategories().map((c) => ({
      slug: c.slug,
      numeral: orderNumeral(c.order, locale),
      title: c.title[locale],
      summary: c.summary[locale],
      image: c.image,
      href: SERVICES_HREF,
      services: getServices(c.slug).map((s) => ({ slug: s.slug, title: s.title[locale], href: SERVICES_HREF })),
    })),
    products: getProducts().map((p) => ({ slug: p.slug, name: p.name[locale], href: DIGITAL_ANCHOR })),
    serviceCount: getServiceCount(),
    allServicesHref: SERVICES_HREF,
  };
}
