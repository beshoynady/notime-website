import { describe, expect, it } from "vitest";
import { CURVE_BOX, curvePath, EASINGS, ease, type EasingId } from "./easing";

const ids = Object.keys(EASINGS) as EasingId[];

describe("motion-playground easings", () => {
  it("are the four of the spec, in order: Linear, Ease out, Spring, Expo (§6 II.9)", () => {
    expect(ids).toEqual(["linear", "ease-out", "spring", "expo"]);
  });

  it.each(ids)("%s starts at 0 and lands exactly on 1", (id) => {
    expect(ease(id, 0)).toBe(0);
    expect(ease(id, 1)).toBe(1);
  });

  it.each(ids)("%s clamps time outside 0–1", (id) => {
    expect(ease(id, -0.5)).toBe(0);
    expect(ease(id, 1.5)).toBe(1);
  });

  it("linear is the identity", () => {
    for (const t of [0.1, 0.25, 0.5, 0.9]) expect(ease("linear", t)).toBeCloseTo(t, 10);
  });

  it.each(["ease-out", "expo"] as const)("%s never goes back and never passes 1", (id) => {
    let prev = 0;
    for (let i = 1; i <= 100; i++) {
      const v = ease(id, i / 100);
      expect(v).toBeGreaterThanOrEqual(prev);
      expect(v).toBeLessThanOrEqual(1);
      prev = v;
    }
  });

  it("ease out and expo are ahead of linear (fast start), expo the most at the start", () => {
    expect(ease("ease-out", 0.25)).toBeGreaterThan(0.25);
    expect(ease("expo", 0.25)).toBeGreaterThan(ease("ease-out", 0.25));
  });

  it("spring overshoots 1, then settles back to it", () => {
    const samples = Array.from({ length: 101 }, (_, i) => ease("spring", i / 100));
    const peak = Math.max(...samples);
    expect(peak).toBeGreaterThan(1.1);
    expect(peak).toBeLessThan(1.35);
    expect(Math.abs(ease("spring", 0.95) - 1)).toBeLessThan(0.02);
  });
});

describe("curvePath", () => {
  it("draws from the bottom start corner to the top end corner of the box", () => {
    const d = curvePath("linear", 4);
    expect(d.startsWith(`M0 ${CURVE_BOX.size}`)).toBe(true);
    expect(d.endsWith(`L${CURVE_BOX.size} 0`)).toBe(true);
    expect(d.split("L")).toHaveLength(5); // M + 4 segments
  });

  it("goes above the box's top edge where the spring overshoots (into the headroom)", () => {
    const ys = curvePath("spring", 48)
      .split(/[ML]/)
      .filter(Boolean)
      .map((p) => Number(p.split(" ")[1]));
    expect(Math.min(...ys)).toBeLessThan(0);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(-CURVE_BOX.headroom);
  });
});
