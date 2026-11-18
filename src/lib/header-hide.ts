import { parseCategoryParam } from "@/lib/forms/category-param";

/** Below this width the header hides on category pages (the chip bar's breakpoint). */
export const HEADER_AUTOHIDE_MEDIA = "(max-width: 899.98px)";

/** Scroll moves smaller than this keep the header's state (finger jitter, Lenis's easing tail). */
export const HEADER_HIDE_DELTA = 8;

/**
 * Whether the header should be hidden at scroll position `y`, given the last settled state: shown
 * near the top (`y < headerH`); else it hides on a move down of more than `delta` px, shows on a
 * move up of more than `delta` px, and keeps its state for anything smaller.
 */
export function nextHeaderHidden(prev: { y: number; hidden: boolean }, y: number, opts: { headerH: number; delta: number }): boolean {
  if (y < opts.headerH) return false;
  if (y - prev.y > opts.delta) return true;
  if (prev.y - y > opts.delta) return false;
  return prev.hidden;
}

/**
 * The pages whose header hides on scroll: the five category pages, Software included (owner's
 * change 2). `pathname` has no locale prefix, as next-intl's `usePathname` returns it.
 */
export function autohidesOn(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const match = /^\/services\/([^/]+)$/.exec(path);
  return !!match && parseCategoryParam(match[1]) !== "";
}
