/**
 * The human-scale drawing (category-pages.md §6, IV.19): print formats at true relative scale
 * beside a 1.8 m figure. Every unit here is a millimetre; the SVG's viewBox is the lineup's box,
 * y down, everything standing on one floor line. Pure, so the scale is tested, not eyeballed.
 *
 * Direction: the drawing is laid out from inline-start in left-to-right units. In Arabic the SVG
 * is mirrored as a whole (it holds shapes only), and every HTML label is placed with
 * `inset-inline-start: pct(x)`, which the browser mirrors with it.
 */

export interface Size {
  w: number;
  h: number;
}
export interface Box extends Size {
  x: number;
  y: number;
}

/** The reference: a 1.8 m figure, and the box its silhouette is drawn in. */
export const FIGURE = { w: 520, h: 1800 } as const;
/** Clear space at both inline ends, above the tallest format (for its dimension) and below the floor (the ruler). */
const MARGIN = 220;
const HEAD = 360;
const FOOT = 300;
/** The loupe: a lens of this radius, centred this far above the floor. */
const LENS_R = 470;
const LENS_Y = 2000;
/** The magnified format fills at most this share of the lens radius (corner to corner). */
const LENS_FILL = 0.92;

/** Space before a format: wider between wider neighbours, so the lineup reads as one row. */
const gap = (a: Size, b: Size) => Math.round(200 + 0.1 * (a.w + b.w));

export interface Lineup {
  width: number;
  height: number;
  /** y of the floor line. */
  floor: number;
  figure: Box;
  items: (Box & { id: string })[];
}

export function lineup(formats: (Size & { id: string })[]): Lineup {
  const tallest = Math.max(FIGURE.h, ...formats.map((f) => f.h));
  const floor = HEAD + tallest;
  const figure: Box = { x: MARGIN, y: floor - FIGURE.h, ...FIGURE };
  let prev: Box = figure;
  const items = formats.map((f) => {
    const box = { id: f.id, x: prev.x + prev.w + gap(prev, f), y: floor - f.h, w: f.w, h: f.h };
    prev = box;
    return box;
  });
  return { width: prev.x + prev.w + MARGIN, height: floor + FOOT, floor, figure, items };
}

export interface Loupe {
  cx: number;
  cy: number;
  r: number;
  /** Whole-number magnification of the format inside the lens: the number shown is the one drawn. */
  power: number;
}

/** A lens above a format too small to read at the lineup's scale (a card, a brochure); null for the rest. */
export function loupe(item: Box, l: Pick<Lineup, "floor">): Loupe | null {
  const half = Math.hypot(item.w, item.h) / 2;
  const power = Math.floor((LENS_FILL * LENS_R) / half);
  if (power < 2) return null;
  return { cx: item.x + item.w / 2, cy: l.floor - LENS_Y, r: LENS_R, power };
}

/** Whole metres along the floor, from the figure's inline-start edge to the drawing's end. */
export function rulerTicks(l: Pick<Lineup, "width" | "figure">): { m: number; x: number }[] {
  const ticks: { m: number; x: number }[] = [];
  for (let m = 0; l.figure.x + m * 1000 <= l.width; m++) ticks.push({ m, x: l.figure.x + m * 1000 });
  return ticks;
}

/** "850 × 2000": width × height in Western digits, ungrouped (D50; spec sheets write 3000, not 3,000). */
export function formatSize({ w, h }: Size): string {
  return `${w} × ${h}`;
}

/** A drawing coordinate as a percentage of its extent, for an HTML label over the SVG. */
export function pct(v: number, of: number): string {
  return `${Math.round((v / of) * 100000) / 1000}%`;
}
