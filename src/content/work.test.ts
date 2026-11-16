import { describe, expect, it } from "vitest";
import { getServices } from "./index";
import { BRANDED_PHOTO_DIRS, CLIENT_NAMES, getWorkBySlug, nextWork, workItems, workView, type WorkItem } from "./work";

/** Every string a value holds, however deep. */
function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (v && typeof v === "object") return Object.values(v).flatMap(strings);
  return [];
}

/**
 * What an anonymous case page can render: the anonymous view, the story and the slug. The internal
 * `key` ("uaeaf") is never rendered (pages use the slug for ids and React keys), so it is left out.
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

  it("never shows a branded photo in an anonymous case page", () => {
    for (const w of workItems) {
      const v = workView(w, false);
      expect(v.photos, w.key).toEqual([]);
      const media = strings(anonymousPage(w)).filter((s) => s.startsWith("/"));
      for (const dir of BRANDED_PHOTO_DIRS) for (const m of media) expect(m, `${w.key} media`).not.toContain(dir);
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
  it("named cases use only their own curated photos", () => {
    for (const w of workItems) for (const p of w.named.photos) expect(p, w.key).toMatch(/^\/images\/work\//);
  });
});
