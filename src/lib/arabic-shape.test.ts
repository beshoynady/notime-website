import { describe, expect, it } from "vitest";
import { shapeArabic, visualArabicWord } from "./arabic-shape";

const cps = (s: string) => Array.from(s).map((c) => c.codePointAt(0)!.toString(16).toUpperCase());

describe("shapeArabic", () => {
  it("picks initial, medial and final forms for dual-joining letters", () => {
    expect(cps(shapeArabic("بب"))).toEqual(["FE91", "FE90"]);
    expect(cps(shapeArabic("ببب"))).toEqual(["FE91", "FE92", "FE90"]);
  });

  it("uses isolated forms too, so no base letter is left for satori to reorder", () => {
    expect(cps(shapeArabic("ب"))).toEqual(["FE8F"]);
    // د joins only to the right, so the ب after it stands alone.
    expect(cps(shapeArabic("دب"))).toEqual(["FEA9", "FE8F"]);
    expect(cps(shapeArabic("وا"))).toEqual(["FEED", "FE8D"]);
    expect(cps(shapeArabic("بء"))).toEqual(["FE8F", "FE80"]);
  });

  it("joins a right-joining letter to a dual-joining one before it", () => {
    expect(cps(shapeArabic("بد"))).toEqual(["FE91", "FEAA"]);
  });

  it("forms the lam-alef ligature, isolated and final", () => {
    expect(cps(shapeArabic("لا"))).toEqual(["FEFB"]);
    expect(cps(shapeArabic("سلام"))).toEqual(["FEB3", "FEFC", "FEE1"]);
    expect(cps(shapeArabic("الإنتاج"))).toEqual(["FE8D", "FEF9", "FEE7", "FE98", "FE8E", "FE9D"]);
  });

  it("drops marks without breaking the join", () => {
    expect(cps(shapeArabic("بّب"))).toEqual(["FE91", "FE90"]);
  });

  it("leaves spaces, punctuation and Latin text alone", () => {
    expect(shapeArabic("NO TIME · 2026")).toBe("NO TIME · 2026");
    expect(cps(shapeArabic("ب، ب"))).toEqual(["FE8F", "60C", "20", "FE8F"]);
  });
});

describe("visualArabicWord", () => {
  it("shapes the word and puts it in visual (left-to-right) order", () => {
    expect(cps(visualArabicWord("بب"))).toEqual(["FE90", "FE91"]);
    expect(cps(visualArabicWord("سلام"))).toEqual(["FEE1", "FEFC", "FEB3"]);
  });

  it("puts trailing punctuation at the visual start", () => {
    expect(cps(visualArabicWord("بب،"))).toEqual(["60C", "FE90", "FE91"]);
  });
});
