import { describe, expect, it } from "vitest";
import { lineSpans, pinLength, stillState } from "@/lib/scene-math";
import { getScene } from ".";
import { STUDIO_OPENING as scene } from "./creative-production";

const layer = (id: string) => scene.layers.find((l) => l.id === id)!;
const lined = (v: "desktop" | "mobile") => scene.shots.filter((s) => s.copyKey && s[v]).map((s) => s.copyKey);

describe("the Studio opening (storyboard creative-production.md, Act 1)", () => {
  it("is the public opening of Creative Production (D83)", () => {
    expect(getScene("creative-production")).toBe(scene);
  });

  it("pins the full 2.0 vh on desktop and 1.2 vh on mobile", () => {
    expect(pinLength(scene.shots, "desktop")).toBe(2.0);
    expect(pinLength(scene.shots, "mobile")).toBe(1.2);
  });

  it("reads four lines on desktop and three on mobile, where the push-in is dropped", () => {
    expect(lined("desktop")).toEqual(["creative.s1", "creative.s2", "creative.s3", "creative.s4"]);
    expect(lined("mobile")).toEqual(["creative.s1", "creative.s2", "creative.s4"]);
  });

  it("cuts: each flash is two very short shots (≤ 0.03 vh each), and every line still holds its shot", () => {
    const cuts = scene.shots.filter((s) => s.id.startsWith("cut-"));
    for (const v of ["desktop", "mobile"] as const) {
      for (const s of cuts) if (s[v]) expect(s[v][1] - s[v][0], `${v} ${s.id}`).toBeLessThanOrEqual(0.03);
      for (const span of lineSpans(scene.shots, v)) expect(span.end - span.start, `${v} line ${span.shot}`).toBeGreaterThanOrEqual(0.3);
    }
  });

  it("the still is the developed frame in the open letterbox, with the last timecode only", () => {
    expect(stillState(layer("letterbox")).scale).toBeGreaterThan(2);
    expect(stillState(layer("develop")).opacity).toBe(0);
    expect(stillState(layer("key-light")).opacity).toBe(1);
    expect(["tc-0", "tc-1", "tc-2", "tc-3"].map((id) => stillState(layer(id)).opacity)).toEqual([0, 0, 0, 1]);
    for (const id of ["slate", "stick-open", "stick-shut", "frame-lines", "flash-1", "flash-2", "flash-3"]) expect(stillState(layer(id)).opacity, id).toBe(0);
  });
});
