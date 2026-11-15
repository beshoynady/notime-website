import { describe, expect, it } from "vitest";
import { OPENING_SHOTS, shotIndexAt } from "./interface-shots";

describe("Interface opening shots", () => {
  it("desktop runs the storyboard's 2.0 vh in four contiguous shots, one line each", () => {
    const d = OPENING_SHOTS.desktop;
    expect(d[0][0]).toBe(0);
    expect(d.at(-1)![1]).toBe(2.0);
    for (let i = 1; i < d.length; i++) expect(d[i][0]).toBe(d[i - 1][1]);
    expect(d.map((s) => s[2])).toEqual([0, 1, 2, 3]);
  });

  it("mobile is contiguous over the crossing (0–1) and skips the wireframe line", () => {
    const m = OPENING_SHOTS.mobile;
    expect(m[0][0]).toBe(0);
    expect(m.at(-1)![1]).toBe(1);
    for (let i = 1; i < m.length; i++) expect(m[i][0]).toBe(m[i - 1][1]);
    expect(m.map((s) => s[2])).not.toContain(1);
  });

  it("finds the shot in play, clamped at both ends", () => {
    const d = OPENING_SHOTS.desktop;
    expect(shotIndexAt(-1, d)).toBe(0);
    expect(shotIndexAt(0.44, d)).toBe(0);
    expect(shotIndexAt(0.45, d)).toBe(1);
    expect(shotIndexAt(1.6, d)).toBe(3);
    expect(shotIndexAt(9, d)).toBe(3);
  });
});
