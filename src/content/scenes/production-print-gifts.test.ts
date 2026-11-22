import { describe, expect, it } from "vitest";
import { pinLength, stillState, visibleLayers } from "@/lib/scene-math";
import { media } from "../media";
import { getScene } from ".";
import { WORKSHOP_OPENING as scene } from "./production-print-gifts";

const layer = (id: string) => scene.layers.find((l) => l.id === id)!;
const lined = (v: "desktop" | "mobile") => scene.shots.filter((s) => s.copyKey && s[v]).map((s) => s.copyKey);

/** "From the press to the hand" (docs/content/visual-stories.md, Production, Print & Gifts; D160). */
describe("the Workshop opening in photographs", () => {
  it("is the public opening of Production, Print & Gifts, with the head there from the first frame", () => {
    expect(getScene("production-print-gifts")).toBe(scene);
    expect(scene.hero).toBe(true);
  });

  it("is photographs: every layer is a registry image; no drawn press sheet is left", () => {
    for (const l of scene.layers) expect(l.slot && media(l.slot), l.id).toBeTruthy();
    for (const l of scene.layers) if (l.fx) expect(l.fx, l.id).toBe("frame");
  });

  it("plays materials → the press → the gift on a 2.0 vh pin; three lines on a laptop, two on a phone", () => {
    expect(pinLength(scene.shots, "desktop")).toBe(2.0);
    expect(lined("desktop")).toEqual(["print.s1", "print.s3", "print.s4"]);
    expect(lined("mobile")).toEqual(["print.s1", "print.s4"]);
  });

  it("the gift is NO TIME's own piece (gifts-1), and the still is the press with it", () => {
    expect(layer("gift").slot).toBe("gifts-1");
    expect(media("gifts-1")!.source).toBe("rand-profile");
    expect(stillState(layer("press")).wipe).toBe(1);
    expect(stillState(layer("gift")).opacity ?? 1).toBe(1);
  });

  it("a hidden gift leaves the press, never an empty frame (spec §8)", () => {
    const shown = visibleLayers(scene, (id) => id !== "gifts-1");
    expect(shown.layers.some((l) => l.slot === "gifts-1")).toBe(false);
    expect(shown.layers.some((l) => l.id === "press")).toBe(true);
  });
});
