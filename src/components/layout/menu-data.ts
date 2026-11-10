import { categoryHref, getCategories, getProducts, getServiceCount, productLockup, getServices, SERVICES_INDEX_HREF, serviceHref, type CategorySlug, type Locale } from "@/content";
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

// The products live on the Software & Digital page; its products block (Task 4.3) gets an anchor then.
const PRODUCTS_HREF = categoryHref("software-digital");

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
    products: getProducts().map((p) => ({ slug: p.slug, name: productLockup(p, locale), href: PRODUCTS_HREF })),
    serviceCount: getServiceCount(),
    allServicesHref: SERVICES_INDEX_HREF,
  };
}
