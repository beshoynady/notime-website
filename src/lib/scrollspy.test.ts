import { describe, expect, it } from "vitest";
import { activeIndex } from "./scrollspy";

describe("activeIndex", () => {
  it("picks the last section whose top is at or above the line", () => {
    expect(activeIndex([0, 800, 1600], 700)).toBe(0);
    expect(activeIndex([0, 800, 1600], 800)).toBe(1);
    expect(activeIndex([0, 800, 1600], 99999)).toBe(2);
  });

  it("returns -1 above the first section and for no sections", () => {
    expect(activeIndex([100, 800], 50)).toBe(-1);
    expect(activeIndex([], 10)).toBe(-1);
  });
});
