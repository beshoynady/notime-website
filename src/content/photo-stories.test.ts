import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MEDIA, mediaAll, pick } from "./media";
import { ROOM_STORY, STORY_PHOTOS, STRIP, storyBeats, type StoryPhotoKey } from "./photo-stories";

describe("photo stories (D109) from the registry (Task 14)", () => {
  it("every story photo is a registry entry with its graded files on disk", () => {
    for (const id of Object.values(STORY_PHOTOS)) {
      const m = mediaAll(id);
      expect(m, id).toBeDefined();
      for (const ext of ["webp", "avif"]) {
        const file = path.join(process.cwd(), "public", m!.file.replace(/\.webp$/, `.${ext}`));
        expect(existsSync(file), file).toBe(true);
      }
    }
  });

  it("a story photo is the Evening-graded copy of a profile photo: same source, size and alt", () => {
    for (const id of Object.values(STORY_PHOTOS)) {
      const m = mediaAll(id)!;
      expect(m.source, id).toBe("rand-profile");
      expect(m.grade, id).toBe("evening");
      expect(m.file, id).toBe(`/images/stories/${id}.webp`);
      const base = MEDIA.find((e) => e.id !== id && e.from === m.from && e.file.startsWith("/images/work/"));
      expect(base, id).toBeDefined();
      expect([m.width, m.height, m.alt], id).toEqual([base!.width, base!.height, base!.alt]);
    }
  });

  it("every photo a story uses is defined, with alt text in both languages", () => {
    const used = [...ROOM_STORY.beats.map((b) => b.photo), ...STRIP.frames.map((f) => f.photo)] as StoryPhotoKey[];
    for (const key of used) {
      const m = mediaAll(STORY_PHOTOS[key]);
      expect(m?.alt?.en && m.alt.ar, key).toBeTruthy();
    }
  });

  it("a hidden photo drops its beat; the others keep their order", () => {
    const hide = [STORY_PHOTOS[ROOM_STORY.beats[1].photo]];
    const shown = storyBeats(ROOM_STORY.beats, (id) => pick(MEDIA, id, { hide }));
    expect(shown.map((b) => b.photo)).toEqual(ROOM_STORY.beats.filter((_, i) => i !== 1).map((b) => b.photo));
    expect(shown.every((b) => b.entry.id !== hide[0])).toBe(true);
  });
});
