import { describe, expect, it } from "vitest";
import { GALLERIES, GALLERY_MIN } from "./galleries";
import { MEDIA, pick, visibleMedia } from "./media";
import { services } from "./services";

describe("service galleries (D153)", () => {
  it("every id is a registry photo, and every key is a service", () => {
    for (const [slug, ids] of Object.entries(GALLERIES)) {
      expect(services.some((s) => s.slug === slug), slug).toBe(true);
      for (const id of ids) expect(MEDIA.some((m) => m.id === id), `${slug}:${id}`).toBe(true);
    }
  });

  it("only Rand's own photos: a gallery is 'our work', never stock", () => {
    for (const ids of Object.values(GALLERIES)) for (const id of ids) expect(MEDIA.find((m) => m.id === id)!.source, id).toMatch(/^rand/);
  });

  it("drops hidden photos, and shows nothing when fewer than two remain (fill or hide, D78)", () => {
    const ids = (list: string[], hide: string[]) => visibleMedia(list, GALLERY_MIN, (id) => pick(MEDIA, id, { hide })).map((m) => m.id);
    expect(ids(["sandoz-1", "egyptair-pavilion-1", "uae-pro-league-1"], ["sandoz-1"])).toEqual(["egyptair-pavilion-1", "uae-pro-league-1"]);
    expect(ids(["sandoz-1", "egyptair-pavilion-1"], ["sandoz-1"])).toEqual([]);
  });
});
