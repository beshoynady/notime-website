import { describe, expect, it } from "vitest";
import { boxFaces, face, iso } from "./iso";

describe("isometric projection (stand-assembly)", () => {
  it("puts the origin at the origin and lifts z straight up", () => {
    expect(iso([0, 0, 0], 10)).toEqual([0, 0]);
    expect(iso([0, 0, 2], 10)).toEqual([0, -20]);
  });

  it("sends x down-right and y down-left by the same amount (30° axes)", () => {
    const [ax, ay] = iso([1, 0, 0], 10);
    const [bx, by] = iso([0, 1, 0], 10);
    expect(ax).toBeCloseTo(8.66, 2);
    expect(bx).toBeCloseTo(-8.66, 2);
    expect(ay).toBe(5);
    expect(by).toBe(5);
  });

  it("applies the origin offset and rounds polygon points to 0.1 px", () => {
    expect(face([[0, 0, 0], [1, 0, 0]], 10, [100, 50])).toBe("100,50 108.7,55");
  });

  it("gives a box three faces of four points each", () => {
    const f = boxFaces([0, 0, 0], [2, 1, 1], 10, [0, 0]);
    for (const k of ["top", "front", "side"] as const) expect(f[k].split(" ")).toHaveLength(4);
  });
});
