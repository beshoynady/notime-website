import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import { SECTION_PIN_LIMIT, sceneProblems } from "@/lib/scene-math";
import { getCategories, getServices } from "..";
import { EVENTS_OPENING } from "./events-hospitality";
import { allScenes, allSectionScenes, DRAFT_SCENE, getLabScene, getScene, getSectionScene, LAB_IDS, labCategory } from ".";

const scenes = allScenes();
const sectionScenes = new Set(allSectionScenes());
const lookup = (m: unknown, key: string) => key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], m);

describe("scene configs", () => {
  it.each(scenes.map((s) => [s.id, s] as const))("%s follows the scene rules (D64; a section scene's pin, D74)", (_, s) => {
    expect(sceneProblems(s, sectionScenes.has(s) ? SECTION_PIN_LIMIT : undefined)).toEqual([]);
  });

  it.each(scenes.map((s) => [s.id, s] as const))("%s has every shot line in EN and AR", (_, s) => {
    const missing = s.shots.flatMap((shot) => !shot.copyKey ? [] : ["en", "ar"].filter((l) => typeof lookup(l === "en" ? en : ar, `scenes.${shot.copyKey}`) !== "string").map((l) => `${l}:${shot.copyKey}`));
    expect(missing).toEqual([]);
  });
});

describe("scenes in review (lab only until approved)", () => {
  it("Events' opening shows on the lab route; the public page keeps its static opening", () => {
    expect(getScene("events-hospitality")).toBeUndefined();
    expect(getLabScene("events-hospitality").id).toBe("events-opening");
  });

  it("a category with no scene yet shows the draft template on the lab route", () => {
    expect(getLabScene("software-digital")).toBe(DRAFT_SCENE);
  });

  it("the majlis plays in section V (hospitality), on the lab route only: pinned on desktop, passing on mobile (D74)", () => {
    const hospitality = getServices("events-hospitality").find((s) => s.anchor === "hospitality")!;
    expect(getSectionScene(hospitality, true)?.id).toBe("events-majlis");
    expect(getSectionScene(hospitality, true)?.mode).toEqual({ desktop: "pin", mobile: "pass" });
    expect(getSectionScene(hospitality, false)).toBeUndefined();
    const others = getCategories().flatMap((c) => getServices(c.slug)).filter((s) => s !== hospitality);
    expect(others.filter((s) => getSectionScene(s, true))).toEqual([]);
  });

  it("the Evening opening: three lines over four shots on desktop, the same three on mobile (D74, P1)", () => {
    const lined = (v: "desktop" | "mobile") => EVENTS_OPENING.shots.filter((s) => s.copyKey && s[v]).map((s) => s.copyKey);
    expect(EVENTS_OPENING.shots.filter((s) => s.desktop)).toHaveLength(4);
    expect(lined("desktop")).toEqual(["events.s1", "events.s3", "events.s4"]);
    expect(lined("mobile")).toEqual(lined("desktop"));
  });

  it("every scene is listed once for the rule checks", () => {
    expect(scenes.map((s) => s.id).sort()).toEqual(["draft", "editorial-opening", "events-majlis", "events-opening", "studio-opening", "workshop-opening"]);
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
