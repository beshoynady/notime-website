import { describe, expect, it } from "vitest";
import { copyProblems } from "@/lib/copy-rules";
import { RELATED_WORK_COPY, relatedWork } from "../related-work";
import { SERVICE_HOOKS } from "../service-hooks";
import { AGENDA } from "./agenda-timeline";
import { MOODBOARD } from "./candle-moodboard";
import { EVENT_PHOTOS } from "./event-photos";
import { LAUNCH_REVEAL } from "./launch-reveal";
import { MENU } from "./menu-majlis";
import { STAGE_LIGHTS } from "./stage-lights";
import { STAND } from "./stand-assembly";

/** Every localized pair ({ en, ar } of strings) in a module's data, with its path. */
function pairs(value: unknown, path: string): [string, { en: string; ar: string }][] {
  if (!value || typeof value !== "object") return [];
  const o = value as Record<string, unknown>;
  if (typeof o.en === "string" && typeof o.ar === "string") return [[path, { en: o.en, ar: o.ar }]];
  return Object.entries(o).flatMap(([k, v]) => pairs(v, `${path}.${k}`));
}

describe("Events & Hospitality modules (Tasks 3.3-3.8), hooks and related work", () => {
  const data = {
    "agenda-timeline": AGENDA,
    "stage-lights": STAGE_LIGHTS,
    "launch-reveal": LAUNCH_REVEAL,
    "candle-moodboard": MOODBOARD,
    "menu-majlis": MENU,
    "stand-assembly": STAND,
    "event-photos": EVENT_PHOTOS,
    "service-hooks": SERVICE_HOOKS,
    "related-work": RELATED_WORK_COPY,
  };
  const all = Object.entries(data).flatMap(([k, v]) => pairs(v, k));

  it("follow the copy rules (copy-rules.ts) in both languages", () => {
    expect(all.flatMap(([k, t]) => [...copyProblems(k, t.en, "en"), ...copyProblems(k, t.ar, "ar")])).toEqual([]);
  });

  it("carry no placeholder text and no Eastern Arabic digits (D50)", () => {
    for (const [k, t] of all) {
      for (const s of [t.en, t.ar]) expect(s, k).not.toMatch(/TODO|lorem/i);
      expect(t.ar, k).not.toMatch(/[٠-٩۰-۹]/);
    }
  });

  it("demo data is labelled Example; the menu (the real offering) is not", () => {
    for (const d of [AGENDA, STAGE_LIGHTS, LAUNCH_REVEAL, MOODBOARD, STAND]) expect(d.example).toBe(true);
    expect("example" in MENU && MENU.example).toBeFalsy();
  });

  it("agenda: 24-hour times in order", () => {
    const times = AGENDA.slots.map((s) => s.time);
    for (const t of times) expect(t).toMatch(/^([01]\d|2[0-3]):[0-5]\d$/);
    expect([...times].sort()).toEqual(times);
  });

  it("stage lights: the cues bring every group up exactly once", () => {
    const cued = STAGE_LIGHTS.cues.map((c) => c.group);
    expect(new Set(cued).size).toBe(cued.length);
    expect(new Set(cued)).toEqual(new Set(STAGE_LIGHTS.groups.map((g) => g.id)));
  });

  it("stand: six distinct build steps", () => {
    const ids = STAND.parts.map((p) => p.id);
    expect(ids).toHaveLength(6);
    expect(new Set(ids).size).toBe(6);
  });

  it("photos: real NO TIME files with native sizes and alt text in both languages", () => {
    for (const [k, p] of Object.entries(EVENT_PHOTOS)) {
      expect(p.src, k).toMatch(/^\/images\/work\//);
      expect(p.width, k).toBeGreaterThan(0);
      expect(p.height, k).toBeGreaterThan(0);
      expect(p.alt.en.length, k).toBeGreaterThan(10);
      expect(p.alt.ar.length, k).toBeGreaterThan(10);
    }
  });

  it("related work: hidden (empty) for a category without cases, never repeats a case", () => {
    for (const c of ["events-hospitality", "marketing-brand", "creative-production", "production-print-gifts", "software-digital"] as const) {
      const ids = relatedWork(c).map((r) => r.view.key);
      expect(new Set(ids).size, c).toBe(ids.length);
      for (const r of relatedWork(c)) expect(r.also, c).not.toContain(c);
    }
  });
});
