import { describe, expect, it } from "vitest";
import { pinLength, stillState, visibleLayers } from "@/lib/scene-math";
import { media } from "../media";
import { getScene } from ".";
import { STUDIO_OPENING as scene } from "./creative-production";

const layer = (id: string) => scene.layers.find((l) => l.id === id)!;
const lined = (v: "desktop" | "mobile") => scene.shots.filter((s) => s.copyKey && s[v]).map((s) => s.copyKey);

/** "Lights, then the frame" (docs/content/visual-stories.md, Creative Production; D158). */
describe("the Studio opening in photographs", () => {
  it("is the public opening of Creative Production, with the head there from the first frame", () => {
    expect(getScene("creative-production")).toBe(scene);
    expect(scene.hero).toBe(true);
  });

  it("is photographs: every image layer resolves in the registry; no drawn studio is left", () => {
    const images = scene.layers.filter((l) => l.slot);
    expect(images.length).toBeGreaterThanOrEqual(3);
    for (const l of images) expect(media(l.slot!), l.slot).toBeDefined();
    const drawn = new Set(["shade", "glow", "frame", "scrim", "blur"]);
    for (const l of scene.layers) if (l.fx) expect(drawn.has(l.fx), `${l.id}: fx-${l.fx}`).toBe(true);
  });

  it("plays dark studio → lights up → Rand's frame on a 2.0 vh pin; three lines on a laptop, two on a phone", () => {
    expect(pinLength(scene.shots, "desktop")).toBe(2.0);
    expect(lined("desktop")).toEqual(["creative.s1", "creative.s3", "creative.s4"]);
    expect(lined("mobile")).toEqual(["creative.s1", "creative.s4"]);
  });

  it("the frame is Rand's own work (catering-4), and the still is the lit studio with it", () => {
    expect(layer("frame").slot).toBe("catering-4");
    expect(media("catering-4")!.source).toBe("rand-profile");
    expect(stillState(layer("lit")).wipe).toBe(1);
    expect(stillState(layer("frame")).opacity ?? 1).toBe(1);
  });

  it("a hidden frame leaves the lit studio, never an empty box (spec §8)", () => {
    const shown = visibleLayers(scene, (id) => id !== "catering-4");
    expect(shown.layers.some((l) => l.slot === "catering-4")).toBe(false);
    expect(shown.layers.some((l) => l.slot === "cp-open-lit")).toBe(true);
  });
});
