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
