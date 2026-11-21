import { describe, expect, it } from "vitest";
import { formatSize, FIGURE, lineup, loupe, pct, rulerTicks } from "./scale-layout";

const FORMATS = [
  { id: "card", w: 85, h: 55 },
  { id: "brochure", w: 210, h: 297 },
  { id: "rollup", w: 850, h: 2000 },
  { id: "backdrop", w: 3000, h: 2400 },
];

describe("lineup (true relative scale, in mm)", () => {
  const l = lineup(FORMATS);

  it("stands the figure and every format on one floor line, at their real sizes", () => {
    expect(l.figure.h).toBe(FIGURE.h);
    expect(l.figure.y + l.figure.h).toBe(l.floor);
    for (const [i, f] of FORMATS.entries()) {
      expect(l.items[i]).toMatchObject({ id: f.id, w: f.w, h: f.h, y: l.floor - f.h });
    }
  });

  it("orders them from inline-start: the figure, then the formats in the given order, never overlapping", () => {
    const boxes = [l.figure, ...l.items];
    for (let i = 1; i < boxes.length; i++) expect(boxes[i].x).toBeGreaterThan(boxes[i - 1].x + boxes[i - 1].w);
  });

  it("keeps everything inside the drawing, with room above the tallest format and below the floor", () => {
    const last = l.items[l.items.length - 1];
    expect(l.figure.x).toBeGreaterThan(0);
    expect(last.x + last.w).toBeLessThan(l.width);
    expect(Math.min(...l.items.map((b) => b.y))).toBeGreaterThan(0);
    expect(l.height).toBeGreaterThan(l.floor);
  });
});

describe("loupe (small formats are magnified, at a whole-number power)", () => {
  const l = lineup(FORMATS);

  it("magnifies only formats too small to read at the lineup's scale", () => {
    expect(loupe(l.items[0], l)).not.toBeNull();
    expect(loupe(l.items[1], l)).not.toBeNull();
    expect(loupe(l.items[2], l)).toBeNull();
    expect(loupe(l.items[3], l)).toBeNull();
  });

  it("states a true, whole-number magnification of at least 2, and the magnified format fits the lens", () => {
    for (const item of l.items.slice(0, 2)) {
      const z = loupe(item, l)!;
      expect(Number.isInteger(z.power)).toBe(true);
      expect(z.power).toBeGreaterThanOrEqual(2);
      const half = Math.hypot((item.w * z.power) / 2, (item.h * z.power) / 2);
      expect(half).toBeLessThan(z.r);
    }
  });

  it("sits above its format, clear of the floor, inside the drawing", () => {
    for (const item of l.items.slice(0, 2)) {
      const z = loupe(item, l)!;
      expect(z.cx).toBeCloseTo(item.x + item.w / 2);
      expect(z.cy + z.r).toBeLessThan(item.y);
      expect(z.cy - z.r).toBeGreaterThan(0);
    }
  });
});

describe("rulerTicks", () => {
  it("marks every whole metre from the figure's inline-start edge to the drawing's end", () => {
    const l = lineup(FORMATS);
    const ticks = rulerTicks(l);
    expect(ticks[0]).toEqual({ m: 0, x: l.figure.x });
    expect(ticks.map((t) => t.m)).toEqual(ticks.map((_, i) => i));
    for (const t of ticks) expect(t.x).toBeLessThanOrEqual(l.width);
    expect(ticks.at(-1)!.x + 1000).toBeGreaterThan(l.width);
  });
});

describe("formatSize and pct", () => {
  it("writes width × height in Western digits, with no grouping", () => {
    expect(formatSize({ w: 85, h: 55 })).toBe("85 × 55");
    expect(formatSize({ w: 3000, h: 2400 })).toBe("3000 × 2400");
  });

  it("turns drawing units into a percentage of the drawing, for logically placed HTML labels", () => {
    expect(pct(250, 1000)).toBe("25%");
    expect(pct(1, 3)).toBe("33.333%");
  });
});
