import { describe, expect, it } from "vitest";
import { getCategories } from "./index";
import { mediaAll } from "./media";
import { workItems } from "./work";

/**
 * Home (visual portfolio, Task C4; docs/content/visual-stories.md "Home"): the «Five crafts» cards
 * and «Real projects» are photographs from the registry, Rand's own wherever one exists.
 */
const entry = mediaAll;

describe("home: the five crafts cards", () => {
  it("each card's photo is the one the story names", () => {
    const photos = Object.fromEntries(getCategories().map((c) => [c.slug, c.photo]));
    expect(photos).toMatchObject({
      "events-hospitality": "private-celebrations-2",
      "creative-production": "catering-4",
      "marketing-brand": "uae-pro-league-3",
      "production-print-gifts": "gifts-1",
    });
  });

  it("every card photo is a registry entry from Rand's own work", () => {
    for (const c of getCategories()) {
      if (!c.photo) continue;
      expect(entry(c.photo), c.slug).toBeDefined();
      expect(["rand-profile", "rand"], c.slug).toContain(entry(c.photo)!.source);
    }
  });
});

describe("home: real projects", () => {
  it("each case has its own cover photo, a real one (never a stand-in, D106)", () => {
    expect(Object.fromEntries(workItems.map((w) => [w.key, w.cover]))).toEqual({
      egyptair: "egyptair-pavilion-1",
      uaepl: "uae-pro-league-2",
    });
    for (const w of workItems) expect(["rand-profile", "rand"], w.key).toContain(entry(w.cover)?.source);
  });
});
