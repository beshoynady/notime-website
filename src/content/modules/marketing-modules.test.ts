import { describe, expect, it } from "vitest";
import { copyProblems } from "@/lib/copy-rules";
import { CALENDAR } from "./content-calendar";
import { PRESS_RELEASE } from "./press-release";

/** Every localized pair ({ en, ar } of strings) in a module's data, with its path. */
function pairs(value: unknown, path: string): [string, { en: string; ar: string }][] {
  if (!value || typeof value !== "object") return [];
  const o = value as Record<string, unknown>;
  if (typeof o.en === "string" && typeof o.ar === "string") return [[path, { en: o.en, ar: o.ar }]];
  return Object.entries(o).flatMap(([k, v]) => pairs(v, `${path}.${k}`));
}

describe("Marketing & Brand modules (D83): content-calendar and press-release", () => {
  const all = [...pairs(CALENDAR, "content-calendar"), ...pairs(PRESS_RELEASE, "press-release")];

  it("follow the copy rules (copy-rules.ts) in both languages", () => {
    expect(all.flatMap(([k, t]) => [...copyProblems(k, t.en, "en"), ...copyProblems(k, t.ar, "ar")])).toEqual([]);
  });

  it("are marked as examples and carry no placeholder text", () => {
    expect(CALENDAR.example).toBe(true);
    expect(PRESS_RELEASE.example).toBe(true);
    for (const [k, t] of all) for (const s of [t.en, t.ar]) expect(s, k).not.toMatch(/TODO|lorem/i);
  });

  it("calendar: every entry fits every month, one post per day, every pillar and channel used", () => {
    const days = CALENDAR.entries.map((e) => e.day);
    expect(Math.max(...days)).toBeLessThanOrEqual(28);
    expect(new Set(days).size).toBe(days.length);
    expect(new Set(CALENDAR.entries.map((e) => e.pillar))).toEqual(new Set(CALENDAR.pillars.map((p) => p.id)));
    expect(new Set(CALENDAR.entries.map((e) => e.channel))).toEqual(new Set(CALENDAR.channels.map((c) => c.id)));
  });

  it("press release: names no real address (the contact is on example.com)", () => {
    expect(PRESS_RELEASE.release.contactEmail).toMatch(/@example\.com$/);
  });
});
