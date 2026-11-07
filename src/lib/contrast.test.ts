import { describe, expect, it } from "vitest";
import { contrastRatio, wcagLevel } from "./contrast";

describe("contrastRatio (WCAG 2.x relative luminance)", () => {
  it("black on white is 21, and order does not matter", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#000")).toBeCloseTo(21, 5);
  });

  it("a colour on itself is 1", () => {
    expect(contrastRatio("#634731", "#634731")).toBe(1);
  });

  it("espresso on ivory is about 13.1 (the prototype's 13.6 was wrong)", () => {
    expect(contrastRatio("#2E2017", "#F5E9D3")).toBeGreaterThan(12.9);
    expect(contrastRatio("#2E2017", "#F5E9D3")).toBeLessThan(13.3);
  });

  it("rejects malformed hex", () => {
    expect(() => contrastRatio("2E2017", "#fff")).toThrow();
    expect(() => contrastRatio("#12345", "#fff")).toThrow();
  });
});

describe("wcagLevel (normal text)", () => {
  it("maps ratios to AAA / AA / fail", () => {
    expect(wcagLevel(7)).toBe("AAA");
    expect(wcagLevel(6.99)).toBe("AA");
    expect(wcagLevel(4.5)).toBe("AA");
    expect(wcagLevel(4.49)).toBe("fail");
  });
});
