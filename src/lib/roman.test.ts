import { describe, expect, it } from "vitest";
import { orderNumeral, toRoman } from "./roman";

describe("toRoman", () => {
  it("converts the category numerals I–V", () => {
    expect([1, 2, 3, 4, 5].map(toRoman)).toEqual(["I", "II", "III", "IV", "V"]);
  });

  it("handles subtractive forms up to 39", () => {
    expect(toRoman(9)).toBe("IX");
    expect(toRoman(14)).toBe("XIV");
    expect(toRoman(39)).toBe("XXXIX");
  });

  it("rejects values outside 1..39 and non-integers", () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(40)).toThrow(RangeError);
    expect(() => toRoman(2.5)).toThrow(RangeError);
  });
});

describe("orderNumeral (D74, P4)", () => {
  it("English keeps the Roman numerals", () => {
    expect([1, 2, 3, 4, 5, 6].map((n) => orderNumeral(n, "en"))).toEqual(["I", "II", "III", "IV", "V", "VI"]);
  });

  it("Arabic uses two-digit Western numerals: Latin I and V read as the alef «ا» and ٧ there", () => {
    expect([1, 2, 3, 6].map((n) => orderNumeral(n, "ar"))).toEqual(["01", "02", "03", "06"]);
    expect(orderNumeral(12, "ar")).toBe("12");
  });

  it("never yields Arabic-Indic digits or Latin letters in Arabic", () => {
    for (let n = 1; n <= 39; n++) expect(orderNumeral(n, "ar")).toMatch(/^[0-9]{2}$/);
  });

  it("rejects the same values in both locales", () => {
    expect(() => orderNumeral(0, "ar")).toThrow(RangeError);
    expect(() => orderNumeral(40, "en")).toThrow(RangeError);
    expect(() => orderNumeral(1.5, "ar")).toThrow(RangeError);
  });
});
