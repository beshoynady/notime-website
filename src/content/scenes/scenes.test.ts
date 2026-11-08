import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import { sceneProblems } from "@/lib/scene-math";
import { getCategories } from "..";
import { DRAFT_SCENE, getScene, LAB_IDS, labCategory } from ".";

const scenes = [DRAFT_SCENE, ...getCategories().flatMap((c) => getScene(c.slug) ?? [])];
const lookup = (m: unknown, key: string) => key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], m);

describe("scene configs", () => {
  it.each(scenes.map((s) => [s.id, s] as const))("%s follows the scene rules (D64)", (_, s) => {
    expect(sceneProblems(s)).toEqual([]);
  });

  it.each(scenes.map((s) => [s.id, s] as const))("%s has every shot line in EN and AR", (_, s) => {
    const missing = s.shots.flatMap((shot) => ["en", "ar"].filter((l) => typeof lookup(l === "en" ? en : ar, `scenes.${shot.copyKey}`) !== "string").map((l) => `${l}:${shot.copyKey}`));
    expect(missing).toEqual([]);
  });
});

describe("lab ids", () => {
  it("map one-to-one to the five categories", () => {
    const slugs = Object.values(LAB_IDS);
    expect(new Set(slugs).size).toBe(5);
    expect(slugs.sort()).toEqual(getCategories().map((c) => c.slug).sort());
  });

  it("resolve `<id>-animatic` to its category, and nothing else", () => {
    expect(labCategory("events-animatic")).toBe("events-hospitality");
    expect(labCategory("software-animatic")).toBe("software-digital");
    expect(labCategory("events")).toBeUndefined();
    expect(labCategory("constructor-animatic")).toBeUndefined();
  });
});
