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
  // D169: one photograph, one place. Rand's photos tell the hero, the strip, About and the Work
  // pages, so the cards are credited stock frames, except Marketing's, a post shown nowhere else.
  it("each card's photo is the one the story names", () => {
    const photos = Object.fromEntries(getCategories().map((c) => [c.slug, c.photo]));
    expect(photos).toEqual({
      "events-hospitality": "card-events",
      "creative-production": "card-creative",
      "marketing-brand": "uae-pro-league-3",
      "production-print-gifts": "card-print",
      "software-digital": "card-software",
    });
  });

  it("every card photo is a registry entry: Rand's own, or credited stock", () => {
    for (const c of getCategories()) {
      const e = c.photo ? entry(c.photo) : undefined;
      expect(e, c.slug).toBeDefined();
      if (e!.source === "stock") expect(e!.credit?.license, c.slug).toBeTruthy();
      else expect(["rand-profile", "rand"], c.slug).toContain(e!.source);
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
