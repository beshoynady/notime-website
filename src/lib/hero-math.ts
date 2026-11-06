/** Clock face geometry (SVG viewBox 600, centre 300). */
export const CLOCK = { centre: 300, ring: 284, majorInner: 262, minorInner: 274 } as const;

const r2 = (n: number) => Math.round(n * 100) / 100 + 0; // + 0 turns -0 into 0

export interface Tick {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  major: boolean;
}

/** Tick `i` of 60 (6° apart); every fifth tick is major (longer). */
export function tickGeometry(i: number): Tick {
  const a = (i * 6 * Math.PI) / 180;
  const major = i % 5 === 0;
  const { centre: c, ring } = CLOCK;
  const inner = major ? CLOCK.majorInner : CLOCK.minorInner;
  return {
    x1: r2(c + Math.sin(a) * ring),
    y1: r2(c - Math.cos(a) * ring),
    x2: r2(c + Math.sin(a) * inner),
    y2: r2(c - Math.cos(a) * inner),
    major,
  };
}

/** Particles for a viewport: one per 8500 px², clamped to 70–170. */
export function particleCount(w: number, h: number): number {
  return Math.round(Math.min(170, Math.max(70, (w * h) / 8500)));
}

/** Canvas backing-store budget in device pixels (the atmosphere is soft; fill rate is the cost). */
const PIXEL_BUDGET = 900_000;

/**
 * Backing-store scale for the hero canvas: the DPR, capped at 1.5 below 900px wide and
 * 2 above, then lowered (to a floor of 0.5) so w × h × scale² stays within ~0.9 MP.
 */
export function canvasScale(w: number, h: number, dpr: number): number {
  const capped = Math.min(dpr || 1, w < 900 ? 1.5 : 2);
  const fit = Math.sqrt(PIXEL_BUDGET / (w * h));
  return Math.max(0.5, Math.floor(Math.min(capped, fit) * 100) / 100);
}
