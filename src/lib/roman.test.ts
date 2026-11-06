import { describe, expect, it } from "vitest";
import { toRoman } from "./roman";

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
