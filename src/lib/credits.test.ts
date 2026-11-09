import { describe, expect, it } from "vitest";
import { creditFor, parseCredits, upsertCredit, type ImageCredit } from "./credits";

const HEAD = "filename,source,page_url,photographer";

describe("parseCredits (assets-inbox/credits.csv)", () => {
  it("reads one row per file, ignoring blank lines and a BOM", () => {
    const rows = parseCredits(`﻿${HEAD}\nhero-fallback-16x9.jpg,pexels,https://www.pexels.com/photo/stage-lights-123/,Jane Doe\n\nev-open-hall-9x16.png,chatgpt,,\n`);
    expect(rows).toEqual([
      { filename: "hero-fallback-16x9.jpg", source: "pexels", pageUrl: "https://www.pexels.com/photo/stage-lights-123/", photographer: "Jane Doe" },
      { filename: "ev-open-hall-9x16.png", source: "chatgpt", pageUrl: "", photographer: "" },
    ]);
  });

  it("handles quoted fields with commas", () => {
    const [r] = parseCredits(`${HEAD}\nev-majlis-dusk-16x9.jpg,unsplash,https://unsplash.com/photos/abc,"Doe, Jane"\n`);
    expect(r.photographer).toBe("Doe, Jane");
  });

  it("rejects an unknown source, a stock row without photographer or page, and a page on the wrong site", () => {
    expect(() => parseCredits(`${HEAD}\na-16x9.jpg,google,https://x.com,A\n`)).toThrow(/source/);
    expect(() => parseCredits(`${HEAD}\na-16x9.jpg,pexels,https://www.pexels.com/photo/1/,\n`)).toThrow(/photographer/);
    expect(() => parseCredits(`${HEAD}\na-16x9.jpg,unsplash,,A\n`)).toThrow(/page_url/);
    expect(() => parseCredits(`${HEAD}\na-16x9.jpg,unsplash,https://www.pexels.com/photo/1/,A\n`)).toThrow(/unsplash\.com/);
  });

  it("rejects a file listed twice and a wrong header", () => {
    expect(() => parseCredits(`${HEAD}\na-16x9.jpg,chatgpt,,\na-16x9.jpg,chatgpt,,\n`)).toThrow(/twice/);
    expect(() => parseCredits(`file,source\n`)).toThrow(/header/);
  });
});

describe("creditFor", () => {
  it("refuses a file with no row", () => {
    expect(() => creditFor("x-16x9.jpg", [])).toThrow(/no row in assets-inbox\/credits.csv/);
  });
});

describe("upsertCredit (src/content/credits.json)", () => {
  const a: ImageCredit = { file: "/images/stock/hero-fallback-16x9.webp", slot: "hero-fallback-16x9", source: "pexels", pageUrl: "https://www.pexels.com/photo/1/", photographer: "A", date: "2026-11-09", sha256: "aa" };
  it("adds a credit, and replaces the one for the same file", () => {
    const one = upsertCredit([], a);
    expect(one).toEqual([a]);
    const two = upsertCredit(one, { ...a, photographer: "B", sha256: "bb" });
    expect(two).toHaveLength(1);
    expect(two[0].photographer).toBe("B");
  });
  it("keeps the list sorted by file, so the page and the diff are stable", () => {
    const b = { ...a, file: "/images/scenes/events-hospitality/ev-majlis-dusk.webp", slot: "ev-majlis-dusk" };
    expect(upsertCredit([a], b).map((c) => c.slot)).toEqual(["ev-majlis-dusk", "hero-fallback-16x9"]);
  });
});
