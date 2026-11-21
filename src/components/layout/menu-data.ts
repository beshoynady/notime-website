import { categoryHref, getCategories, getProducts, getServiceCount, productHref, productLockup, getServices, SERVICES_INDEX_HREF, serviceHref, type CategorySlug, type Locale } from "@/content";
import { productsCopy } from "@/content/software/page";
import { orderNumeral } from "@/lib/roman";

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

// Each product has its own page (F4), keyed by its id in the forms contract.
const PRODUCT_ID_BY_SLUG = Object.fromEntries(Object.entries(productsCopy.items).map(([id, item]) => [item.slug, id]));

export function getMenuData(locale: Locale): MenuData {
  return {
    categories: getCategories().map((c) => ({
      slug: c.slug,
      numeral: orderNumeral(c.order, locale),
      title: c.title[locale],
      summary: c.summary[locale],
      image: c.image,
      href: categoryHref(c.slug),
      services: getServices(c.slug).map((s) => ({ slug: s.slug, title: s.title[locale], href: serviceHref(s) })),
    })),
    products: getProducts().map((p) => ({ slug: p.slug, name: productLockup(p, locale), href: productHref(PRODUCT_ID_BY_SLUG[p.slug]) })),
    serviceCount: getServiceCount(),
    allServicesHref: SERVICES_INDEX_HREF,
  };
}
