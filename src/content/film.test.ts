import { describe, expect, it } from "vitest";
import { getCategories } from "./index";
import { CHECKIN, checkinCount, FILM, FILM_SCENES, sceneCounter, sceneNumber } from "./film";
import { media } from "./media";

describe("home film", () => {
  it("walks through every category once, in the menu's order, between the opening and the finale", () => {
    expect(FILM[0].key).toBe("opening");
    expect(FILM.at(-1)?.key).toBe("finale");
    expect(FILM.flatMap((b) => b.category ?? [])).toEqual(getCategories().map((c) => c.slug));
  });

  it("names a registry plate for every scene, all visible today", () => {
    for (const b of FILM) expect(media(b.plate), b.plate).toBeDefined();
  });

  it("counts scenes as 01 … 06, the total fixed", () => {
    expect(FILM_SCENES).toBe(6);
    expect(sceneNumber(3)).toBe("03");
    expect(sceneCounter(3)).toBe("03 / 06");
    expect(sceneCounter(6)).toBe("06 / 06");
  });

  it("counts the example guests up through the scene, clamped", () => {
    expect(checkinCount(-1)).toBe(CHECKIN.from);
    expect(checkinCount(0)).toBe(CHECKIN.from);
    expect(checkinCount(1)).toBe(CHECKIN.to);
    expect(checkinCount(2)).toBe(CHECKIN.to);
    expect(checkinCount(0.5)).toBe(169);
    expect(CHECKIN.to).toBeLessThanOrEqual(CHECKIN.of);
  });
});
