import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { lineSpans, pinLength, stillState } from "@/lib/scene-math";
import { getScene } from ".";
import { WORKSHOP_OPENING as scene } from "./production-print-gifts";

const layer = (id: string) => scene.layers.find((l) => l.id === id)!;

describe("the Workshop opening (storyboard IV, Act 1)", () => {
  it("is the public opening of Production, Print & Gifts (D83)", () => {
    expect(getScene("production-print-gifts")).toBe(scene);
  });

  it("plays four shots on 2.0 vh on desktop and three on 1.2 vh on mobile, shots 2 and 3 merged", () => {
    expect(scene.shots.filter((s) => s.desktop)).toHaveLength(4);
    expect(scene.shots.filter((s) => s.mobile)).toHaveLength(3);
    expect(pinLength(scene.shots, "desktop")).toBe(2);
    expect(pinLength(scene.shots, "mobile")).toBe(1.2);
    const lines = (v: "desktop" | "mobile") => lineSpans(scene.shots, v).map((l) => scene.shots[l.shot].copyKey);
    expect(lines("desktop")).toEqual(["print.s1", "print.s2", "print.s3", "print.s4"]);
    expect(lines("mobile")).toEqual(["print.s1", "print.s2", "print.s4"]);
  });

  it("keeps every layer that shares a box on the same depth and push, so a rig registers as it drifts", () => {
    const byBox = new Map<string, Set<string>>();
    for (const l of scene.layers.filter((l) => l.box.block.startsWith("var("))) {
      const key = `${l.box.block}|${l.box.inline}`;
      byBox.set(key, (byBox.get(key) ?? new Set()).add(`${l.depth}/${l.push ?? 0}`));
    }
    for (const [box, motion] of byBox) expect([...motion], box).toHaveLength(1);
  });

  it("ends on the closed, ribboned box with the dieline faint beside it (the reduced still)", () => {
    const opacity = (id: string) => stillState(layer(id)).opacity ?? layer(id).style?.opacity ?? 1;
    for (const id of ["box-base", "box-lid", "ribbon", "sheet"]) expect(opacity(id), id).toBeGreaterThan(0.5);
    expect(opacity("dieline")).toBeCloseTo(0.3);
    for (const id of ["board", "dimensions", "ink", "fold", "paper-stack", "spool"]) expect(opacity(id), id).toBe(0);
  });

  it("draws every code layer in the theme stylesheet (workshop.css)", () => {
    const css = readFileSync(path.join(process.cwd(), "src/components/category/themes/workshop.css"), "utf8");
    const missing = scene.layers.filter((l) => l.fx && !css.includes(`.fx-${l.fx} {`)).map((l) => l.fx);
    expect(missing).toEqual([]);
  });

  it("places each rig through its CSS custom property, with the desktop place as the fallback", () => {
    for (const l of scene.layers.filter((l) => l.level !== 0 && l.id !== "light")) {
      expect(l.box.block, l.id).toMatch(/^var\(--ws-[a-z]+-b, .+\)$/);
      expect(l.box.inline, l.id).toMatch(/^var\(--ws-[a-z]+-i, .+\)$/);
    }
  });
});
