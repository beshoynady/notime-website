import { describe, expect, it } from "vitest";
import { getCategories, getServices } from "@/content";
import { REF_PREFIX, allSectionRefs, categoryRef, reviewFlag, serviceRef } from "./review";

describe("reviewFlag (NEXT_PUBLIC_REVIEW_MODE)", () => {
  it("is on only for exactly '1'", () => {
    expect(reviewFlag("1")).toBe(true);
    for (const v of [undefined, "", "0", "true", "yes", " 1"]) expect(reviewFlag(v), String(v)).toBe(false);
  });
});

describe("section reference numbers (review mode)", () => {
  it("gives every category its own prefix", () => {
    const prefixes = getCategories().map((c) => REF_PREFIX[c.slug]);
    expect(prefixes.every(Boolean)).toBe(true);
    expect(new Set(prefixes).size).toBe(prefixes.length);
  });

  it("numbers a category's sections from stable data, not position: opening 01, services 01 + order, FAQ 10, quote 11", () => {
    const events = getCategories().find((c) => c.slug === "events-hospitality")!;
    expect(categoryRef(events.slug, "opening")).toBe("EV-01");
    expect(categoryRef(events.slug, "faq")).toBe("EV-10");
    expect(categoryRef(events.slug, "quote")).toBe("EV-11");
    const first = getServices(events.slug)[0];
    expect(serviceRef(first)).toBe(`EV-${String(first.order + 1).padStart(2, "0")}`);
  });

  it("is unique across the whole site and follows XX-NN", () => {
    const refs = allSectionRefs();
    expect(refs.length).toBeGreaterThan(40);
    for (const r of refs) expect(r).toMatch(/^(H|EV|SW|PG|MB|CP|WK|AB|PR|CT|LG|ER)-\d{2}$/);
    expect(new Set(refs).size).toBe(refs.length);
  });
});
