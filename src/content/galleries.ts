/**
 * Rand's own work under a service section, as a strip of photos (D153): "our work", so the
 * registry's real photos only (never stock or AI, CLAUDE.md). Ids are `src/content/media.ts`'s;
 * a hidden or unapproved photo drops out, and a strip with fewer than two left isn't shown.
 */
export const GALLERIES: Record<string, string[]> = {
  // D169: a photo shows in one place only. The Work pages, the hero, the Home strip and About's
  // story hold most of NO TIME's photos, so a gallery keeps only those shown nowhere else and
  // hides below GALLERY_MIN (fill or hide, D78) until Rand's new photos arrive (rand-images-message.md).
  "conferences-summits": [],
  "exhibitions-booths": [],
  "galas-private-celebrations": [],
  "catering-heritage-hospitality": ["catering-6", "catering-13"],
  photography: ["catering-8", "catering-9"],
  "set-stage-design": [],
  "stand-fabrication-signage": ["sandoz-1", "smith-gulf-1"],
};

/** Under this many visible photos a strip isn't shown (`visibleMedia`, media.ts). */
export const GALLERY_MIN = 2;
