import { describe, expect, it } from "vitest";
import { CATEGORY_GRADE, GRADES, recomb, sceneImageFile, upscaleProblem } from "./grade";

describe("GRADES", () => {
  it("every grade warms a neutral grey (R > G > B), toward espresso and champagne", () => {
    for (const [name, g] of Object.entries(GRADES)) {
      const [r, gr, b] = recomb(g.matrix, [128, 128, 128]);
      expect(r, name).toBeGreaterThan(gr);
      expect(gr, name).toBeGreaterThan(b);
    }
  });

  it("no channel gains more than 15%, so highlights don't clip into flat white", () => {
    for (const [name, g] of Object.entries(GRADES)) {
      for (const row of g.matrix) expect(row.reduce((a, v) => a + v, 0), name).toBeLessThanOrEqual(1.15);
    }
  });

  it("maps each image category to its storyboard grade; Software has none (drawn in code)", () => {
    expect(CATEGORY_GRADE).toEqual({
      "events-hospitality": "evening",
      "production-print-gifts": "workshop",
      "marketing-brand": "editorial",
      "creative-production": "studio",
    });
  });
});

describe("recomb", () => {
  it("multiplies the matrix by the colour, rounding and clamping to 0–255", () => {
    expect(
      recomb(
        [
          [1, 0, 0],
          [0, 0.5, 0],
          [0, 0, 2],
        ],
        [100, 100, 200],
      ),
    ).toEqual([100, 50, 255]);
  });
});

describe("sceneImageFile", () => {
  it("is public/images/scenes/<category>/<slot>.<ext>", () => {
    expect(sceneImageFile("events-hospitality", "ev-open-hall", "webp")).toBe("public/images/scenes/events-hospitality/ev-open-hall.webp");
  });
});

describe("upscaleProblem", () => {
  it("refuses a target wider than the source", () => {
    expect(upscaleProblem(800, 1200)).toBe("refusing to upscale: source is 800px wide, target 1200px");
  });

  it("accepts the native width, a smaller one, or none", () => {
    expect(upscaleProblem(800, 800)).toBeNull();
    expect(upscaleProblem(800, 400)).toBeNull();
    expect(upscaleProblem(800)).toBeNull();
  });
});
