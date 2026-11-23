import { describe, expect, it } from "vitest";
import { pinLength, stillState, visibleLayers } from "@/lib/scene-math";
import { media } from "../media";
import { getScene } from ".";
import { EDITORIAL_OPENING as scene } from "./marketing-brand";

const layer = (id: string) => scene.layers.find((l) => l.id === id)!;
const lined = (v: "desktop" | "mobile") => scene.shots.filter((s) => s.copyKey && s[v]).map((s) => s.copyKey);

/** "The brief on the desk" (docs/content/visual-stories.md, Marketing & Brand; D159). */
describe("the Editorial opening in photographs", () => {
  it("is the public opening of Marketing & Brand, with the head there from the first frame", () => {
    expect(getScene("marketing-brand")).toBe(scene);
    expect(scene.hero).toBe(true);
  });

  it("is photographs: every image layer resolves in the registry; no drawn spread is left", () => {
    const images = scene.layers.filter((l) => l.slot);
    expect(images.length).toBe(scene.layers.length);
    for (const l of images) expect(media(l.slot!), l.slot).toBeDefined();
    const drawn = new Set(["wash", "frame"]);
    for (const l of scene.layers) if (l.fx) expect(drawn.has(l.fx), `${l.id}: fx-${l.fx}`).toBe(true);
  });

  it("plays blank page → the desk → the post on a 2.0 vh pin; three lines on a laptop, two on a phone", () => {
    expect(pinLength(scene.shots, "desktop")).toBe(2.0);
    expect(lined("desktop")).toEqual(["marketing.s1", "marketing.s3", "marketing.s4"]);
    expect(lined("mobile")).toEqual(["marketing.s1", "marketing.s4"]);
  });

  it("both desk layers share one file, so the blank page costs no second download", () => {
    expect(layer("blank").slot).toBe(layer("desk").slot);
  });

  it("the post is NO TIME's own published work, and the still is the clean desk with it", () => {
    expect(layer("post").slot).toBe("uae-pro-league-4");
    expect(media("uae-pro-league-4")!.source).toBe("rand-profile");
    expect(stillState(layer("desk")).wipe).toBe(1);
    expect(stillState(layer("post")).opacity ?? 1).toBe(1);
  });

  it("a withheld post leaves the desk, never an empty frame (spec §8)", () => {
    const shown = visibleLayers(scene, (id) => id !== "uae-pro-league-4");
    expect(shown.layers.some((l) => l.slot === "uae-pro-league-4")).toBe(false);
    expect(shown.layers.some((l) => l.id === "desk")).toBe(true);
  });
});
