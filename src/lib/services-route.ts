import { routing } from "@/i18n/routing";

/**
 * `/<locale>/services/<slug>` with a slug that is not a category → the locale, else null.
 * Under Cache Components the category page's notFound() streams with a 200 (the shell is
 * prerendered), so the proxy answers unknown slugs before rendering (docs: loading.md,
 * "Status codes").
 */
export function unknownCategoryLocale(pathname: string, slugs: readonly string[]): string | null {
  const m = /^\/([^/]+)\/services\/([^/]+)\/?$/.exec(pathname);
  if (!m || !(routing.locales as readonly string[]).includes(m[1])) return null;
  return slugs.includes(m[2]) ? null : m[1];
}

/**
 * `/<locale>/lab…` that must answer 404 → the locale, else null: every lab path while the lab is
 * off (NEXT_PUBLIC_ENABLE_LAB), and any path that isn't one of its pages while it's on. Same
 * reason as above: the lab page's notFound() would stream with a 200.
 */
export function closedLabLocale(pathname: string, pages: readonly string[], enabled: boolean): string | null {
  const m = /^\/([^/]+)\/lab(?:\/(.*?))?\/?$/.exec(pathname);
  if (!m || !(routing.locales as readonly string[]).includes(m[1])) return null;
  return enabled && pages.includes(m[2] ?? "") ? null : m[1];
}
