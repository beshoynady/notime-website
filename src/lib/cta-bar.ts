import { parseCategoryParam } from "@/lib/forms/category-param";

/** The page that keeps its own sticky bar (src/components/software/sticky-bar.tsx). */
const SOFTWARE_PATH = "/services/software-digital";

/**
 * What the shared mobile CTA bar (N04) links to on this page, or null where it doesn't render:
 * /contact (the form is the page) and Software (its own bar). `pathname` has no locale prefix,
 * as next-intl's `usePathname` returns it. A category page hints its category to the contact brief.
 */
export function ctaBarFor(pathname: string): { quoteHref: string } | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (path === "/contact" || path === SOFTWARE_PATH) return null;
  const match = /^\/services\/([^/]+)$/.exec(path);
  const category = match ? parseCategoryParam(match[1]) : "";
  return { quoteHref: category ? `/contact?category=${category}` : "/contact" };
}
