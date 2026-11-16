import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PRIVATE_STACK, ROOM_STORY, STORY_PHOTOS, STRIP, storySrc, type StoryPhotoKey } from "./photo-stories";

describe("photo stories (D109)", () => {
  it("every story photo has its graded files on disk", () => {
    for (const photo of Object.values(STORY_PHOTOS)) {
      for (const ext of ["webp", "avif"]) {
        const file = path.join(process.cwd(), "public", storySrc(photo).replace(/\.webp$/, `.${ext}`));
        expect(existsSync(file), file).toBe(true);
      }
    }
  });
  it("every photo a story uses is defined, with alt text in both languages", () => {
    const used = [
      ...ROOM_STORY.beats.map((b: { photo: StoryPhotoKey }) => b.photo),
      ...STRIP.frames.map((f: { photo: StoryPhotoKey }) => f.photo),
      ...PRIVATE_STACK.cards.map((c: { photo: StoryPhotoKey }) => c.photo),
    ];
    for (const key of used) {
      const p = STORY_PHOTOS[key];
      expect(p, key).toBeDefined();
      expect(p.alt.en.length && p.alt.ar.length, key).toBeTruthy();
    }
  });
});
