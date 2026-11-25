import { describe, expect, it } from "vitest";
import { reelFrames, reelProject } from "./showreel";

describe("showreel counter", () => {
  it("counts the projects the reel shows, not its photos", () => {
    const total = new Set(reelFrames.map((f) => f.src.split("/")[3])).size;
    expect(reelProject(0).total).toBe(total);
    expect(reelProject(0)).toEqual({ n: 1, total });
    expect(reelProject(reelFrames.length - 1)).toEqual({ n: total, total });
  });

  it("only rises through one loop (the frames are grouped by project)", () => {
    const ns = reelFrames.map((_, i) => reelProject(i).n);
    expect(ns).toEqual([...ns].sort((a, b) => a - b));
  });

  it("wraps an index past either end", () => {
    expect(reelProject(reelFrames.length)).toEqual(reelProject(0));
    expect(reelProject(-1)).toEqual(reelProject(reelFrames.length - 1));
  });
});
