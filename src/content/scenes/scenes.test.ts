import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import { SECTION_PIN_LIMIT, sceneProblems, visibleLayers } from "@/lib/scene-math";
import { getCategories, getServices } from "..";
import { EVENTS_OPENING } from "./events-hospitality";
import { allScenes, allSectionScenes, getSceneImage, DRAFT_LAB_ID, DRAFT_SCENE, getLabScene, getScene, getSectionScene, LAB_IDS, labCategory, labScene } from ".";

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

describe("scenes, public and in review", () => {
  it("Events' opening is public (the full Events build), and the lab route shows the same scene", () => {
    expect(getScene("events-hospitality")?.id).toBe("events-opening");
    expect(getLabScene("events-hospitality").id).toBe("events-opening");
  });

  it("a category with no scene yet shows the draft template on the lab route", () => {
    expect(getLabScene("software-digital")).toBe(DRAFT_SCENE);
  });

  it("every Events section has its scene, public and on the lab route, and no other category has one yet (D153)", () => {
    const events = getServices("events-hospitality");
    for (const s of events) expect(getSectionScene(s, false)?.id, s.anchor).toBe(getSectionScene(s, true)?.id);
    expect(events.map((s) => getSectionScene(s, false)?.id)).toEqual(["events-conferences", "events-exhibitions", "events-launches", "events-galas", "events-majlis", "events-stage"]);
    const others = getCategories().flatMap((c) => getServices(c.slug)).filter((s) => !events.includes(s));
    expect(others.filter((s) => getSectionScene(s, true))).toEqual([]);
  });

  it("the Evening opening: three lines over four shots on desktop, the same three on mobile (D74, P1)", () => {
    const lined = (v: "desktop" | "mobile") => EVENTS_OPENING.shots.filter((s) => s.copyKey && s[v]).map((s) => s.copyKey);
    expect(EVENTS_OPENING.shots.filter((s) => s.desktop)).toHaveLength(4);
    expect(lined("desktop")).toEqual(["events.s1", "events.s3", "events.s4"]);
    expect(lined("mobile")).toEqual(lined("desktop"));
  });

  it("the Evening opening is photographs only: the room at night, the light, the tables, the entrance (D153, D154)", () => {
    expect(EVENTS_OPENING.layers.filter((l) => l.fx === "ev-hall")).toEqual([]);
    for (const l of EVENTS_OPENING.layers.filter((x) => x.slot)) expect(getSceneImage(l.slot!)?.src, l.id).toBeTruthy();
    const plate = EVENTS_OPENING.layers.find((l) => l.level === 0 && !l.keys);
    expect(plate?.slot).toBe("ev-open-night");
    const entrance = EVENTS_OPENING.layers.find((l) => l.slot === "ev-entrance");
    expect(entrance?.enter?.shot).toBe(3);
  });

  it("a scene drops the layers whose picture is hidden, and keeps its shots (fill or hide, D78)", () => {
    const shown = visibleLayers(EVENTS_OPENING, (slot) => slot !== "ev-entrance");
    expect(shown.layers.some((l) => l.slot === "ev-entrance")).toBe(false);
    expect(shown.layers.length).toBe(EVENTS_OPENING.layers.length - 1);
    expect(shown.shots).toEqual(EVENTS_OPENING.shots);
  });

  it("the Events sections tell their story in photographs: I–IV pass, the majlis and the stage pin from 1024px (D153)", () => {
    const drawn = new Set(["shade", "glow", "frame", "scrim", "blur"]);
    const modes: Record<string, unknown> = {
      "events-conferences": "pass",
      "events-exhibitions": "pass",
      "events-launches": "pass",
      "events-galas": "pass",
      "events-majlis": { desktop: "pin", mobile: "pass" },
      "events-stage": { desktop: "pin", mobile: "pass" },
    };
    for (const service of getServices("events-hospitality")) {
      const scene = getSectionScene(service, false)!;
      expect(scene.mode, scene.id).toEqual(modes[scene.id]);
      for (const l of scene.layers) {
        if (l.slot) expect(getSceneImage(l.slot)?.src, `${scene.id}:${l.id}`).toBeTruthy();
        if (l.fx) expect(drawn.has(l.fx), `${scene.id}:${l.id} fx-${l.fx}`).toBe(true);
      }
      // A photograph under everything on both widths: the phone never opens on an empty frame.
      for (const width of ["desktop", "mobile"] as const) {
        const shown = scene.layers.filter((l) => (width === "mobile" ? l.mobile : l.desktop !== false));
        expect(shown.some((l) => l.level === 0 && l.slot), `${scene.id} ${width}`).toBe(true);
      }
    }
  });

  it("every scene is listed once for the rule checks", () => {
    expect(scenes.map((s) => s.id).sort()).toEqual(["draft", "editorial-opening", "events-conferences", "events-exhibitions", "events-galas", "events-launches", "events-majlis", "events-opening", "events-stage", "studio-opening", "workshop-opening"]);
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

  it("keep the draft template on its own route, the engine fixture (e2e/layered-scene.spec.ts)", () => {
    expect(labCategory(`${DRAFT_LAB_ID}-animatic`)).toBe("creative-production");
    expect(labScene(`${DRAFT_LAB_ID}-animatic`)).toBe(DRAFT_SCENE);
    expect(labScene("studio-animatic")).toBe(getLabScene("creative-production"));
    expect(labScene("nope-animatic")).toBeUndefined();
  });
});
