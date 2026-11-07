import { describe, expect, it } from "vitest";
import { grainOffset, noiseTile } from "./grain";

describe("noiseTile", () => {
  const tint: [number, number, number] = [234, 212, 171]; // champagne

  it("is an opaque RGBA tile of size x size", () => {
    const px = noiseTile(16, tint, 1);
    expect(px.length).toBe(16 * 16 * 4);
    for (let i = 3; i < px.length; i += 4) expect(px[i]).toBe(255);
  });

  it("scales the tint by one luminance per pixel, so the hue stays the tint's", () => {
    const px = noiseTile(16, tint, 1);
    for (let i = 0; i < px.length; i += 4) {
      const l = px[i] / 234;
      expect(px[i + 1]).toBeCloseTo(212 * l, -0.5);
      expect(px[i + 2]).toBeCloseTo(171 * l, -0.5);
    }
  });

  it("is deterministic per seed and differs between seeds", () => {
    expect(noiseTile(8, tint, 7)).toEqual(noiseTile(8, tint, 7));
    expect(noiseTile(8, tint, 7)).not.toEqual(noiseTile(8, tint, 8));
  });

  it("is noise, not a flat fill: mean near half the tint, wide spread", () => {
    const px = noiseTile(64, tint, 3);
    const reds = [];
    for (let i = 0; i < px.length; i += 4) reds.push(px[i]);
    const mean = reds.reduce((a, b) => a + b, 0) / reds.length;
    expect(mean).toBeGreaterThan(234 * 0.4);
    expect(mean).toBeLessThan(234 * 0.6);
    expect(Math.max(...reds) - Math.min(...reds)).toBeGreaterThan(200);
  });
});

describe("grainOffset", () => {
  it("holds one offset for a whole step (fps steps per second)", () => {
    expect(grainOffset(0, 12, 128)).toEqual(grainOffset(83, 12, 128)); // 1000/12 = 83.3 ms per step
    expect(grainOffset(84, 12, 128)).not.toEqual(grainOffset(83, 12, 128));
  });

  it("stays inside the tile, in whole pixels", () => {
    for (let t = 0; t < 5000; t += 37) {
      const { x, y } = grainOffset(t, 12, 128);
      expect(Number.isInteger(x) && Number.isInteger(y)).toBe(true);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(128);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThan(128);
    }
  });

  it("jumps around rather than drifting (consecutive steps are not neighbours)", () => {
    let far = 0;
    for (let s = 0; s < 50; s++) {
      const a = grainOffset((s * 1000) / 12, 12, 128);
      const b = grainOffset(((s + 1) * 1000) / 12, 12, 128);
      if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) > 8) far++;
    }
    expect(far).toBeGreaterThan(40);
  });
});
