import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import { GALLERIES } from "./galleries";
import { HERO_PLATE } from "./hero";
import { imageSlots } from "./images";
import { MEDIA, type MediaEntry } from "./media";
import { ROOM_STORY, STORY_PHOTOS, STRIP } from "./photo-stories";
import { productPages } from "./product-pages";
import { allScenes, DRAFT_SCENE } from "./scenes";
import { SCENE_IMAGES } from "./scenes/images";
import { SERVICE_VISUALS } from "./service-visuals";
import { reelFrames } from "./showreel";
import * as softwarePage from "./software/page";
import { workCollections, workItems } from "./work";

/**
 * One photograph, one place (D169): no picture shows in two slots anywhere on the site. A slot is
 * one block a visitor sees (the hero, a category card, a gallery, a scene, a Work page). A crop or
 * a graded copy counts as its original (`base`, or the profile page or stock id it came from).
 *
 * Two kinds of repeat are by design and not counted, because they show the same thing twice on
 * purpose: a Work item's cover on the cards that link to it (Home's Work, the Work index, related
 * work: those are built from the item, so they never name a photo here), and the reel, a
 * slideshow of the Work pages' photos.
 */
const byId = new Map(MEDIA.map((m) => [m.id, m]));
const byFile = new Map<string, MediaEntry>();
for (const m of MEDIA) {
  byFile.set(m.file, m);
  if (m.mobile) byFile.set(m.mobile.file, m);
}

/** The original a registry id or a file comes from; null when the string names no picture. */
function root(ref: string): string | null {
  // A storyboard scene slot with a file (scenes/images.ts) is a crop of the registry photo it names.
  const sceneSlot = SCENE_IMAGES.find((s) => s.id === ref && s.src);
  if (sceneSlot) return sceneSlot.source.kind === "real" ? root(sceneSlot.source.from) : sceneSlot.src;
  let m = byId.get(ref) ?? byFile.get(ref);
  if (!m) return ref.startsWith("/images/") ? ref : null;
  while (m.base && byId.get(m.base)) m = byId.get(m.base)!;
  return m.from && /^(p\d|unsplash:|pexels:)/.test(m.from) ? m.from : m.file;
}

/** Every picture a value names, however deep (scenes nest their layers). */
function pictures(value: unknown, out = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    const r = root(value);
    if (r) out.add(r);
  } else if (Array.isArray(value)) value.forEach((v) => pictures(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => pictures(v, out));
  return out;
}

const slotFile = (id: string) => imageSlots.find((s) => s.id === id)?.src ?? null;

function slots(): Map<string, Set<string>> {
  const s = new Map<string, unknown>();
  s.set("home hero", HERO_PLATE);
  for (const c of categories) {
    s.set(`home category card ${c.slug}`, c.photo ?? slotFile(c.image));
    s.set(`menu ${c.slug}`, slotFile(c.image));
  }
  s.set("home strip", STRIP.frames.map((f) => STORY_PHOTOS[f.photo]));
  s.set("about story", ROOM_STORY.beats.map((b) => STORY_PHOTOS[b.photo]));
  for (const [slug, v] of Object.entries(SERVICE_VISUALS)) s.set(`service visual ${slug}`, v.kind === "media" ? v.id : v.from);
  for (const [slug, ids] of Object.entries(GALLERIES)) s.set(`gallery ${slug}`, ids);
  for (const scene of allScenes()) if (scene !== DRAFT_SCENE) s.set(`scene ${scene.id}`, scene);
  for (const w of workItems) s.set(`work ${w.slug}`, w.cover);
  for (const c of workCollections) s.set(`work ${c.slug}`, c.photos);
  for (const [id, p] of Object.entries(productPages)) s.set(`product ${id}`, p.photo);
  for (const [name, value] of Object.entries(softwarePage)) s.set(`software ${name}`, value);
  const where = new Map<string, Set<string>>();
  for (const [slot, value] of s) for (const r of pictures(value)) (where.get(r) ?? where.set(r, new Set()).get(r)!).add(slot);
  return where;
}

const reel = new Set(reelFrames.map((f) => root(f.src)));

/**
 * Repeats still to replace, page by page (D169): each goes when its page gets its own photos.
 * The list may only shrink: a root listed here that no longer repeats fails the test too.
 */
const PENDING: string[] = [
  // Creative Production (scene and service visuals), with Software's AI picture.
  "p10-2", "p4-1", "p27-1", "p31-2", "p25-3", "unsplash:26MJGnCM0Wc",
  // Production, Print & Gifts (scene and service visuals).
  "p24-1", "p23-4", "p23-2", "p23-3",
];

/**
 * The one repeat kept on purpose, with its reason. The Events opening is a film cut from one photo
 * in three depths (the room at night, lit, and its near tables, D109); it is the glass-roofed hall
 * that is also Home's hero. It goes when Rand sends a wide photo of another room she dressed
 * (rand-images-message.md), which the film is then cut from.
 */
const KEPT: Record<string, string[]> = { "p9-2": ["home hero", "scene events-opening"] };

describe("one photograph, one place (D169)", () => {
  const where = slots();
  const repeats = [...where].filter(([, s]) => s.size > 1);

  it("no picture shows in two slots", () => {
    const kept = (r: string, s: Set<string>) => KEPT[r] && [...s].sort().join() === [...KEPT[r]].sort().join();
    const open = repeats.filter(([r, s]) => !PENDING.includes(r) && !kept(r, s));
    expect(open.map(([r, s]) => `${r}: ${[...s].join(" · ")}`)).toEqual([]);
  });

  it("the pending list names only repeats that still exist", () => {
    const live = new Set(repeats.map(([r]) => r));
    expect(PENDING.filter((r) => !live.has(r))).toEqual([]);
  });

  it("the reel shows only the Work pages' photos", () => {
    for (const r of [...reel].filter((r) => !PENDING.includes(r!))) {
      expect(r, "a reel frame outside the registry").not.toBeNull();
      const s = where.get(r!) ?? new Set<string>();
      expect([...s].filter((slot) => !slot.startsWith("work ")), r!).toEqual([]);
      expect(s.size, `${r} is in no Work page`).toBeGreaterThan(0);
    }
  });

  it("finds the slots it checks (a renamed export would empty it)", () => {
    const all = new Set([...where.values()].flatMap((s) => [...s]));
    for (const slot of ["home hero", "home strip", "about story", "gallery photography", "work rooms-we-dressed", "product minute-zero"]) {
      expect(all.has(slot), slot).toBe(true);
    }
    expect([...all].filter((s) => s.startsWith("scene ")).length).toBeGreaterThan(5);
  });
});
