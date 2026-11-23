import { describe, expect, it } from "vitest";
import { getServices } from "./index";
import { showWorkFilters } from "@/lib/work-filter";
import { MEDIA, mediaAll, pick } from "./media";
import {
  CLIENT_NAMES,
  COLLECTION_MIN_PHOTOS,
  collectionPhotos,
  getCollectionBySlug,
  getWorkBySlug,
  nextWork,
  visibleCollections,
  workCards,
  workCollections,
  workItems,
  workView,
  type WorkItem,
} from "./work";

/** Every string a value holds, however deep. */
function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (v && typeof v === "object") return Object.values(v).flatMap(strings);
  return [];
}

/**
 * What an anonymous case page can render: the anonymous view, the story and the slug. The internal
 * `key` ("egyptair") is never rendered (pages use the slug for ids and React keys), so it is left out.
 */
const anonymousPage = (w: WorkItem) => {
  const { key: _key, ...view } = workView(w, false);
  return { view, story: w.story, slug: w.slug };
};

describe("case pages (F1): anonymisation", () => {
  it("never shows a client name in an anonymous case page, its slug or its story", () => {
    for (const w of workItems) {
      const text = strings(anonymousPage(w)).join(" ‖ ").toLowerCase();
      for (const name of CLIENT_NAMES) expect(text, `${w.key} mentions ${name}`).not.toContain(name.toLowerCase());
    }
  });

  it("shows only the case's own cover photo, flagged for Rand's approval (D150, D164)", () => {
    for (const w of workItems) {
      expect(strings(anonymousPage(w)).filter((s) => s.startsWith("/")), `${w.key}: no file path in the page data`).toEqual([]);
      const cover = mediaAll(w.cover)!;
      expect(cover.source, w.key).toBe("rand-profile");
      expect(cover.randApproval, w.key).toBe("client-visible");
    }
  });

  it("no picture's alt text names a client, in either language", () => {
    for (const m of MEDIA) {
      const alt = `${m.alt?.en ?? ""} ‖ ${m.alt?.ar ?? ""}`.toLowerCase();
      for (const name of CLIENT_NAMES) expect(alt, `${m.id} names ${name}`).not.toContain(name.toLowerCase());
    }
  });

  it("keeps the campaign figures with their scope", () => {
    for (const w of workItems) {
      const r = w.story.result;
      if (r?.figures?.length) expect(r.scope, `${w.key}: figures need their scope`).toBeDefined();
    }
  });
});

describe("case pages (F1): data", () => {
  it("has unique, lowercase slugs that resolve back to their case", () => {
    const slugs = workItems.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const w of workItems) {
      expect(w.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(getWorkBySlug(w.slug)).toBe(w);
    }
    expect(getWorkBySlug("nope")).toBeUndefined();
  });

  it("links the scope to real services, and the next case wraps around", () => {
    const known = new Set(getServices().map((s) => s.slug));
    for (const w of workItems) for (const s of w.story.scope) expect(known.has(s), `${w.key}: ${s}`).toBe(true);
    expect(nextWork(workItems.at(-1)!)).toBe(workItems[0]);
  });

  it("writes every story string in both languages, with the same number of points", () => {
    for (const w of workItems) {
      const { en, ar } = w.story.execution.points;
      expect(ar.length, w.key).toBe(en.length);
      for (const s of strings(w.story).filter((x) => !/^[a-z-]+$/.test(x))) expect(s.trim(), w.key).not.toBe("");
    }
  });
});

describe("no AI or stock photo on real work (D106)", () => {
  it("no image slot is reserved for a Work case", async () => {
    const { imageSlots } = await import("./images");
    expect(imageSlots.filter((s) => s.id.startsWith("work-")).map((s) => s.id)).toEqual([]);
  });
});

describe("Work collections: Rand's own photos (Task 15, D164)", () => {
  it("every picture a Work page shows is NO TIME's own: rand-profile or rand", () => {
    const ids = [...workItems.map((w) => w.cover), ...workCollections.flatMap((c) => c.photos)];
    for (const id of ids) expect(["rand-profile", "rand"], id).toContain(mediaAll(id)?.source);
  });

  it("a collection shows its visible photos in order, and hides when fewer than four remain", () => {
    for (const c of workCollections) {
      expect(c.photos.length, c.slug).toBeGreaterThanOrEqual(COLLECTION_MIN_PHOTOS);
      expect(collectionPhotos(c)?.map((m) => m.id), c.slug).toEqual(c.photos);
    }
    const gifts = workCollections.find((c) => c.photos.length === COLLECTION_MIN_PHOTOS)!;
    const hide = [gifts.photos[1]];
    expect(collectionPhotos(gifts, (id) => pick(MEDIA, id, { hide }))).toBeUndefined();
    const big = workCollections.find((c) => c.photos.length > COLLECTION_MIN_PHOTOS)!;
    const shown = collectionPhotos(big, (id) => pick(MEDIA, id, { hide: [big.photos[0]] }))!;
    expect(shown.map((m) => m.id)).toEqual(big.photos.slice(1));
    expect(visibleCollections((id) => pick(MEDIA, id, { hide })).map((c) => c.slug)).not.toContain(gifts.slug);
  });

  it("collections never name a client, and every string is written in both languages", () => {
    for (const c of workCollections) {
      const text = strings([c.label, c.summary]).join(" ‖ ").toLowerCase();
      for (const name of CLIENT_NAMES) expect(text, `${c.slug} mentions ${name}`).not.toContain(name.toLowerCase());
      for (const l of [c.label, c.summary]) expect(l.en.trim() && l.ar.trim(), c.slug).toBeTruthy();
    }
  });

  it("cases and collections share one URL space, and together they bring the filter row back", () => {
    const cards = workCards();
    const slugs = cards.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of workCollections) {
      expect(c.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(getCollectionBySlug(c.slug)).toBe(c);
      expect(getWorkBySlug(c.slug)).toBeUndefined();
    }
    expect(cards.map((c) => c.kind)).toEqual([...workItems.map(() => "case"), ...workCollections.map(() => "collection")]);
    expect(cards.every((c) => c.cover)).toBe(true);
    expect(showWorkFilters(cards.length)).toBe(true);
  });
});
