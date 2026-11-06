import { describe, expect, it } from "vitest";
import { canvasScale, particleCount, tickGeometry } from "./hero-math";

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

describe("particleCount", () => {
  it("clamps small viewports up to 70", () => expect(particleCount(390, 844)).toBe(70));
  it("scales with area", () => expect(particleCount(1440, 900)).toBe(152));
  it("clamps large viewports down to 170", () => expect(particleCount(2560, 1440)).toBe(170));
});

describe("canvasScale", () => {
  it("keeps a phone at its 1.5 DPR cap (inside the pixel budget)", () =>
    expect(canvasScale(412, 839, 2.625)).toBe(1.5));
  it("caps DPR at 1.5 below 900px wide", () => expect(canvasScale(600, 500, 3)).toBe(1.5));
  it("uses DPR 1 when it fits the budget", () => expect(canvasScale(800, 600, 1)).toBe(1));
  it("drops below 1 to fit a large window into ~0.9 MP", () => {
    expect(canvasScale(1440, 900, 1)).toBe(0.83);
    expect(canvasScale(1440, 900, 2)).toBe(0.83);
  });
  it("never goes below 0.5", () => expect(canvasScale(3840, 2160, 1)).toBe(0.5));
  it("treats a missing DPR as 1", () => expect(canvasScale(800, 600, 0)).toBe(1));
});
