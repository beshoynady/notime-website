import { describe, expect, it } from "vitest";
import type { CategorySlug } from "@/content/types";
import { markets, type MarketKey } from "@/content/markets";
import { workItems } from "@/content/work";
import { allFacetSegments, applyFilter, facetChips, filterHref, FILTERS_MIN_PROJECTS, parseFacets, showWorkFilters, type Facetted } from "./work-filter";

const CATS: CategorySlug[] = ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts", "software-digital"];
const MARKETS: MarketKey[] = markets.map((m) => m.key);

const items: (Facetted & { id: string })[] = [
  { id: "a", categories: ["software-digital", "marketing-brand"], markets: ["ae"] },
  { id: "b", categories: ["events-hospitality"], markets: ["ae", "sa"] },
  { id: "c", categories: ["events-hospitality", "marketing-brand"], markets: ["eg"] },
];

describe("work filter: URL state", () => {
  it("parses one facet of either kind, and both in the canonical order", () => {
    expect(parseFacets(["software-digital"], CATS)).toEqual({ category: "software-digital" });
    expect(parseFacets(["uae"], CATS)).toEqual({ market: "ae" });
    expect(parseFacets(["events-hospitality", "saudi-arabia"], CATS)).toEqual({ category: "events-hospitality", market: "sa" });
  });

  it("rejects unknown values, the reversed order and extra segments (the route 404s)", () => {
    expect(parseFacets(["nope"], CATS)).toBeNull();
    expect(parseFacets(["ae"], CATS)).toBeNull(); // the ISO code isn't the URL slug
    expect(parseFacets(["uae", "events-hospitality"], CATS)).toBeNull();
    expect(parseFacets(["events-hospitality", "uae", "x"], CATS)).toBeNull();
    expect(parseFacets([], CATS)).toBeNull();
  });

  it("round-trips every filtered view through its href", () => {
    const all = allFacetSegments(CATS, MARKETS);
    expect(all).toHaveLength(CATS.length + MARKETS.length + CATS.length * MARKETS.length);
    for (const seg of all) {
      const f = parseFacets(seg, CATS)!;
      expect(f, seg.join("/")).not.toBeNull();
      expect(filterHref(f)).toBe(`/work/filter/${seg.join("/")}`);
    }
    expect(filterHref({})).toBe("/work");
  });
});

describe("work filter: visible cases, counts, empty state", () => {
  it("shows the cases matching both facets", () => {
    expect(applyFilter(items, {}).map((i) => i.id)).toEqual(["a", "b", "c"]);
    expect(applyFilter(items, { category: "events-hospitality" }).map((i) => i.id)).toEqual(["b", "c"]);
    expect(applyFilter(items, { market: "ae" }).map((i) => i.id)).toEqual(["a", "b"]);
    expect(applyFilter(items, { category: "marketing-brand", market: "eg" }).map((i) => i.id)).toEqual(["c"]);
  });

  it("is empty for a combination no case has (the page shows the empty state)", () => {
    expect(applyFilter(items, { category: "software-digital", market: "sa" })).toEqual([]);
    expect(applyFilter(items, { category: "creative-production" })).toEqual([]);
  });

  it("leaves out chips no case has, starts each row with All, and counts with the other facet", () => {
    const { category, market } = facetChips(items, { market: "ae" }, CATS, MARKETS);
    expect(category.map((c) => c.value)).toEqual([undefined, "events-hospitality", "marketing-brand", "software-digital"]);
    expect(category.map((c) => c.count)).toEqual([2, 1, 1, 1]);
    expect(category[0]).toMatchObject({ active: true, href: "/work/filter/uae" });
    expect(category.find((c) => c.value === "software-digital")!.href).toBe("/work/filter/software-digital/uae");

    expect(market.map((m) => m.value)).toEqual([undefined, "ae", "sa", "eg"]);
    expect(market.map((m) => m.count)).toEqual([3, 2, 1, 1]);
    expect(market.find((m) => m.active)!.value).toBe("ae");
    expect(market[0].href).toBe("/work");
  });

  it("gives a zero count where the other facet rules a chip out", () => {
    const { market } = facetChips(items, { category: "software-digital" }, CATS, MARKETS);
    expect(market.find((m) => m.value === "sa")!.count).toBe(0);
  });

  it("runs on the real cases: every case has a market and a home category", () => {
    for (const w of workItems) {
      expect(w.markets.length, w.key).toBeGreaterThan(0);
      expect(w.categories.length, w.key).toBeGreaterThan(0);
    }
    expect(applyFilter(workItems, {})).toHaveLength(workItems.length);
  });
});

describe("work filter: when the bar shows (N08)", () => {
  it("shows from six projects", () => {
    expect(FILTERS_MIN_PROJECTS).toBe(6);
    expect(showWorkFilters(0)).toBe(false);
    expect(showWorkFilters(5)).toBe(false);
    expect(showWorkFilters(6)).toBe(true);
    expect(showWorkFilters(7)).toBe(true);
  });
});
