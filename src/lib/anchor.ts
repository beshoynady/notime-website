/**
 * Pure helpers for in-page anchor scrolling (D53). The DOM side lives in
 * `components/providers/anchor-scroll.tsx`.
 */

const trimSlash = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);

/**
 * The fragment id when `href` points at an element of the current document (same origin,
 * path and query), else null. Another path, locale or query is a navigation, not an anchor.
 */
export function sameDocumentHash(href: string, current: string): string | null {
  let url: URL;
  let here: URL;
  try {
    here = new URL(current);
    url = new URL(href, here);
  } catch {
    return null;
  }
  if (url.hash.length < 2) return null;
  if (url.origin !== here.origin || url.search !== here.search) return null;
  if (trimSlash(url.pathname) !== trimSlash(here.pathname)) return null;
  try {
    return decodeURIComponent(url.hash.slice(1));
  } catch {
    return url.hash.slice(1);
  }
}

/** Scroll position that puts the target's top edge at the header's bottom edge. */
export function anchorScrollTop(m: { targetTop: number; scrollY: number; headerBottom: number; maxScroll: number }): number {
  const y = Math.round(m.targetTop + m.scrollY - m.headerBottom);
  return Math.min(Math.max(y, 0), Math.max(m.maxScroll, 0));
}
