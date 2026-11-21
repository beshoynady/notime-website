/**
 * Rand's own work under a service section, as a strip of photos (D153): "our work", so the
 * registry's real photos only (never stock or AI, CLAUDE.md). Ids are `src/content/media.ts`'s;
 * a hidden or unapproved photo drops out, and a strip with fewer than two left isn't shown.
 */
export const GALLERIES: Record<string, string[]> = {
  "conferences-summits": ["catering-7", "catering-1"],
  // ⚑ client-visible: shown until Rand says otherwise (question 4); hide one with NEXT_PUBLIC_MEDIA_HIDE.
  // (uae-pro-league-1, a print on fabric, stays in the laptop scene: a 3:4 tile crops it to nothing.)
  "exhibitions-booths": ["sandoz-1", "egyptair-pavilion-1"],
  // None repeats a photo this page already shows in a scene (the opening, EVENTS_GALAS, EVENTS_MAJLIS).
  "galas-private-celebrations": ["private-celebrations-5", "private-celebrations-6", "private-celebrations-7", "catering-3"],
  "catering-heritage-hospitality": ["heritage-3", "catering-5", "catering-2", "catering-6", "catering-4"],
};

/** The ids a page shows: the visible ones in order, or none when fewer than two remain. */
export function visibleGallery(ids: string[], has: (id: string) => boolean): string[] {
  const shown = ids.filter(has);
  return shown.length >= 2 ? shown : [];
}
