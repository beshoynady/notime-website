import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { MEDIA, media, mediaAll, pick, type MediaEntry } from "./media";

/** The one image registry (D152; spec docs/superpowers/specs/2026-11-21-visual-portfolio-design.md §6). */
sharp.cache(false);
const disk = (url: string) => path.join(process.cwd(), "public", url);
const files = (m: MediaEntry) => [{ file: m.file, width: m.width, height: m.height }, ...(m.mobile ? [m.mobile] : [])];

describe("media registry", () => {
  it("has unique ids", () => {
    expect(new Set(MEDIA.map((m) => m.id)).size).toBe(MEDIA.length);
  });

  it("returns nothing for an unknown id", () => {
    expect(media("no-such-image")).toBeUndefined();
  });

  it("hides a hidden entry, or one named in the hide list, from pages but not from tooling", () => {
    const base = { width: 10, height: 10, source: "rand" as const, alt: null, spec: "a fixture for the hide switch" };
    const list: MediaEntry[] = [
      { ...base, id: "shown", file: "/a.webp" },
      { ...base, id: "off", file: "/b.webp", hidden: true },
    ];
    expect(pick(list, "shown")?.id).toBe("shown");
    expect(pick(list, "off")).toBeUndefined();
    expect(pick(list, "off", { includeHidden: true })?.id).toBe("off");
    expect(pick(list, "shown", { hide: ["shown"] })).toBeUndefined();
    expect(mediaAll(MEDIA[0].id)?.id).toBe(MEDIA[0].id);
    expect(media(MEDIA.find((m) => !m.hidden)!.id)).toBeDefined();
  });

  it("credits every stock image with its licence, and traces every profile image to its source", () => {
    for (const m of MEDIA) {
      if (m.source === "stock") expect(m.credit?.license, m.id).toMatch(/^(Unsplash|Pexels) License$/);
      if (m.source === "rand-profile") expect(m.from, m.id).toBeTruthy();
    }
  });

  it("gives every picture that carries meaning an English and an Arabic alt", () => {
    for (const m of MEDIA) {
      if (m.alt === null) continue;
      expect(m.alt.en.trim(), m.id).not.toBe("");
      expect(m.alt.ar.trim(), m.id).not.toBe("");
    }
  });

  it("writes a shooting spec for every slot", () => {
    for (const m of MEDIA) expect(m.spec.length, m.id).toBeGreaterThan(20);
  });

  it("points at files that exist, at the size it claims", async () => {
    for (const m of MEDIA) {
      for (const f of files(m)) {
        expect(existsSync(disk(f.file)), `${m.id}: ${f.file}`).toBe(true);
        const meta = await sharp(disk(f.file)).metadata();
        expect([meta.width, meta.height], `${m.id}: ${f.file}`).toEqual([f.width, f.height]);
      }
    }
  });
});

describe("scene layers read the registry", () => {
  it("resolves an id that only the registry knows", async () => {
    const { getSceneImage } = await import("./scenes");
    const s = getSceneImage("catering-1");
    expect(s?.src).toBe("/images/work/catering/catering-1.webp");
    expect([s?.width, s?.height]).toEqual([1408, 794]);
    expect(s?.alt?.en).toMatch(/buffet/i);
  });
});

describe("a hidden photo hides every file made from it (review, Task 16)", () => {
  it("crops, graded copies, scene slots and service photos drop out with their base", async () => {
    vi.stubEnv("NEXT_PUBLIC_MEDIA_HIDE", "private-celebrations-1,catering-6,private-celebrations-5");
    vi.resetModules();
    const { media: m } = await import("./media");
    const { getSceneImage } = await import("./scenes/images");
    const { serviceVisual } = await import("./service-visuals");
    expect(m("ev-open-night"), "the night crop of the hall").toBeUndefined();
    expect(m("st-hall"), "the story copy of its dessert table").toBeUndefined();
    expect(getSceneImage("ev-open-room"), "the scene plate of the hall").toBeUndefined();
    expect(getSceneImage("ev-open-table"), "the tables cut from the hall").toBeUndefined();
    expect(serviceVisual("photography"), "a stock still, not made from a hidden photo").toBeDefined();
    vi.unstubAllEnvs();
    vi.resetModules();
  });
});
