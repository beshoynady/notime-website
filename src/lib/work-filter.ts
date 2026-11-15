/**
 * The Work index filter (v1 plan F1, D88): service category × market. Pure.
 *
 * The state lives in the path, not the query (`/work/filter/<category>/<market>`), so every
 * filtered view is a static page: the chips are plain links that work without JavaScript and can
 * be shared, and Cache Components never needs request-time `searchParams` (which would leave a
 * no-JS visitor on the Suspense fallback). Category slugs and market slugs never collide, so one
 * facet alone is unambiguous; with both, the category comes first.
 */
import type { CategorySlug } from "@/content/types";
import type { MarketKey } from "@/content/markets";

/** Readable market slugs for the URL ("uae" rather than the ISO code). */
export const MARKET_SLUGS: Record<MarketKey, string> = {
  ae: "uae",
  sa: "saudi-arabia",
  qa: "qatar",
  om: "oman",
  kw: "kuwait",
  eg: "egypt",
};

export interface WorkFilter {
  category?: CategorySlug;
  market?: MarketKey;
}

export interface Facetted {
  categories: readonly CategorySlug[];
  markets: readonly MarketKey[];
}

export const FILTER_BASE = "/work";

const marketBySlug = (slug: string) => (Object.entries(MARKET_SLUGS) as [MarketKey, string][]).find(([, s]) => s === slug)?.[0];

/**
 * Path segments after `/work/filter/` → the filter, or null when they don't name a known
 * category and/or market in the canonical order (the route then 404s).
 */
export function parseFacets(segments: readonly string[], categories: readonly CategorySlug[]): WorkFilter | null {
  const isCategory = (s: string): s is CategorySlug => (categories as readonly string[]).includes(s);
  if (segments.length === 1) {
    const [s] = segments;
    if (isCategory(s)) return { category: s };
    const market = marketBySlug(s);
    return market ? { market } : null;
  }
  if (segments.length === 2) {
    const [c, m] = segments;
    const market = marketBySlug(m);
    return isCategory(c) && market ? { category: c, market } : null;
  }
  return null;
}

/** The canonical path of a filter: `/work` with no facet. Locale-less (next-intl's Link adds it). */
export function filterHref(f: WorkFilter): string {
  const parts = [f.category, f.market && MARKET_SLUGS[f.market]].filter(Boolean);
  return parts.length ? `${FILTER_BASE}/filter/${parts.join("/")}` : FILTER_BASE;
}

/** Every filtered view, as path segments, for generateStaticParams (empty combinations included). */
export function allFacetSegments(categories: readonly CategorySlug[], markets: readonly MarketKey[]): string[][] {
  const out: string[][] = [];
  for (const c of categories) out.push([c]);
  for (const m of markets) out.push([MARKET_SLUGS[m]]);
  for (const c of categories) for (const m of markets) out.push([c, MARKET_SLUGS[m]]);
  return out;
}

export function matches(item: Facetted, f: WorkFilter): boolean {
  return (!f.category || item.categories.includes(f.category)) && (!f.market || item.markets.includes(f.market));
}

export function applyFilter<T extends Facetted>(items: readonly T[], f: WorkFilter): T[] {
  return items.filter((it) => matches(it, f));
}

export interface Chip<V> {
  /** undefined = "All". */
  value: V | undefined;
  href: string;
  /** Cases this chip would show, combined with the other facet's current value. */
  count: number;
  active: boolean;
}

/**
 * The chips for both facets. A value no case has at all is left out (fill or hide, D78: a chip
 * reading "0" would advertise work we don't have), so the rows grow as cases are added. Each row
 * starts with "All". Counts combine with the other facet, so a chip says what clicking it shows.
 */
export function facetChips(
  items: readonly Facetted[],
  f: WorkFilter,
  categories: readonly CategorySlug[],
  markets: readonly MarketKey[],
): { category: Chip<CategorySlug>[]; market: Chip<MarketKey>[] } {
  const count = (g: WorkFilter) => applyFilter(items, g).length;
  const category: Chip<CategorySlug>[] = [
    { value: undefined, href: filterHref({ market: f.market }), count: count({ market: f.market }), active: !f.category },
    ...categories
      .filter((c) => items.some((it) => it.categories.includes(c)))
      .map((c) => ({ value: c, href: filterHref({ category: c, market: f.market }), count: count({ category: c, market: f.market }), active: f.category === c })),
  ];
  const market: Chip<MarketKey>[] = [
    { value: undefined, href: filterHref({ category: f.category }), count: count({ category: f.category }), active: !f.market },
    ...markets
      .filter((m) => items.some((it) => it.markets.includes(m)))
      .map((m) => ({ value: m, href: filterHref({ category: f.category, market: m }), count: count({ category: f.category, market: m }), active: f.market === m })),
  ];
  return { category, market };
}
