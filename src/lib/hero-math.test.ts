import { describe, expect, it } from "vitest";
import { tickGeometry } from "./hero-math";

describe("tickGeometry", () => {
  it("draws the 12 o'clock tick as a major tick", () =>
    expect(tickGeometry(0)).toEqual({ x1: 300, y1: 16, x2: 300, y2: 38, major: true }));
  it("draws the 3 o'clock tick", () =>
    expect(tickGeometry(15)).toEqual({ x1: 584, y1: 300, x2: 562, y2: 300, major: true }));
  it("makes non-fifth ticks minor and shorter", () => {
    const t = tickGeometry(1);
    expect(t.major).toBe(false);
    expect(Math.hypot(t.x2 - 300, t.y2 - 300)).toBeCloseTo(274, 1);
    expect(Math.hypot(t.x1 - 300, t.y1 - 300)).toBeCloseTo(284, 1);
  });
  it("rounds to 2 decimals for stable markup", () => {
    const { x1 } = tickGeometry(7);
    expect(Math.round(x1 * 100) / 100).toBe(x1);
  });
});
