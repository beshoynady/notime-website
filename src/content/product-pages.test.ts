import { describe, expect, it } from "vitest";
import { copyProblems } from "@/lib/copy-rules";
import { PRODUCTS } from "@/lib/forms/schemas";
import { media } from "./media";
import { PRODUCT_IDS, productPages } from "./product-pages";
import { workItems } from "./work";

describe("product pages (F4)", () => {
  it("has one page per product in the forms contract, each pointing to the other", () => {
    expect([...PRODUCT_IDS].sort()).toEqual([...PRODUCTS].sort());
    for (const id of PRODUCT_IDS) expect(productPages[productPages[id].other].other).toBe(id);
  });

  it("shows the problem over a registry photo: stock mood, decorative, one per product (Task 14)", () => {
    for (const p of Object.values(productPages)) {
      const m = media(p.photo);
      expect(m, p.id).toBeDefined();
      expect(m!.source, p.id).toBe("stock");
      expect(m!.alt, p.id).toBeNull();
    }
    expect(new Set(Object.values(productPages).map((p) => p.photo)).size).toBe(PRODUCT_IDS.length);
  });

  it("lists 4–6 features, written in both languages", () => {
    for (const p of Object.values(productPages)) {
      expect(p.features.length, p.id).toBeGreaterThanOrEqual(4);
      expect(p.features.length, p.id).toBeLessThanOrEqual(6);
      for (const f of p.features) for (const l of ["en", "ar"] as const) expect(f.title[l].trim() && f.line[l].trim(), p.id).toBeTruthy();
    }
  });

  it("follows the copy rules, as do the case stories", () => {
    const fields: [string, { en: string; ar: string }][] = [
      ...Object.values(productPages).flatMap((p) => [[`${p.id}.problemDetail`, p.problemDetail] as [string, { en: string; ar: string }], ...p.features.flatMap((f, i) => [[`${p.id}.f${i}.title`, f.title], [`${p.id}.f${i}.line`, f.line]] as [string, { en: string; ar: string }][])]),
      ...workItems.flatMap((w) => [
        [`${w.slug}.lead`, w.story.execution.lead] as [string, { en: string; ar: string }],
        ...w.story.execution.points.en.map((en, i) => [`${w.slug}.p${i}`, { en, ar: w.story.execution.points.ar[i] }] as [string, { en: string; ar: string }]),
        ...w.story.facts.map((f, i) => [`${w.slug}.fact${i}`, f.value] as [string, { en: string; ar: string }]),
      ]),
    ];
    expect(fields.flatMap(([k, t]) => [...copyProblems(k, t.en, "en"), ...copyProblems(k, t.ar, "ar")])).toEqual([]);
  });
});
