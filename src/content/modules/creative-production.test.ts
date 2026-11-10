import { describe, expect, it } from "vitest";
import { EASINGS } from "@/components/modules/motion-playground/easing";
import { copyProblems } from "@/lib/copy-rules";
import { MOTION_PLAYGROUND } from "./motion-playground";
import { RENTAL_CATEGORIES } from "./rental-categories";

type Loc = { en: string; ar: string };
const isLoc = (v: unknown): v is Loc => typeof v === "object" && v !== null && "en" in v && "ar" in v;
/** Every localized string in a module's data, with its path. */
function strings(value: unknown, path: string): [string, Loc][] {
  if (isLoc(value)) return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}.${i}`));
  if (typeof value === "object" && value !== null) return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

describe("Creative Production module copy (D83)", () => {
  const all = [...strings(MOTION_PLAYGROUND, "motion-playground"), ...strings(RENTAL_CATEGORIES, "rental-categories")];

  it("is written in both languages and follows the voice rules", () => {
    for (const [k, t] of all) expect(t.en.trim() && t.ar.trim(), k).toBeTruthy();
    expect(all.flatMap(([k, t]) => [...copyProblems(k, t.en, "en"), ...copyProblems(k, t.ar, "ar")])).toEqual([]);
  });

  it("has no digits: no models, quantities or prices (D81, OQ #22)", () => {
    expect(all.filter(([, t]) => /[0-9٠-٩]/.test(t.en + t.ar)).map(([k]) => k)).toEqual([]);
  });

  it("rental: the four categories of D81, nothing else", () => {
    expect(RENTAL_CATEGORIES.categories.map((c) => c.id)).toEqual(["cameras", "lenses", "lighting", "audio"]);
  });

  it("motion playground: one description per easing, in the easing module's order", () => {
    expect(MOTION_PLAYGROUND.easings.map((e) => e.id)).toEqual(Object.keys(EASINGS));
  });
});
