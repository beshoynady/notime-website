/**
 * The motion playground's four easings (category-pages.md §6 II.9): value over normalised time,
 * both 0–1. Pure, so the curve diagram and the title card read the same numbers.
 */
export const EASINGS = {
  linear: (t: number) => t,
  /** A cubic ease out: quick start, gentle landing. */
  "ease-out": (t: number) => 1 - (1 - t) ** 3,
  /** A damped spring: passes the mark by about a fifth, then settles. */
  spring: (t: number) => 1 - Math.exp(-6 * t) * Math.cos(12 * t),
  /** The site's own curve (GSAP expo.out, src/lib/motion.ts). */
  expo: (t: number) => 1 - 2 ** (-10 * t),
} as const;

export type EasingId = keyof typeof EASINGS;

/** An easing's value at time `t`, clamped to the run: exactly 0 before it and exactly 1 at its end. */
export function ease(id: EasingId, t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return EASINGS[id](t);
}

/** The diagram's box in SVG units: a square, plus headroom above it for the spring's overshoot. */
export const CURVE_BOX = { size: 100, headroom: 28 } as const;

/** The easing as an SVG path in CURVE_BOX: time runs along x, value up the y axis (0 at the bottom). */
export function curvePath(id: EasingId, samples = 48): string {
  const s = CURVE_BOX.size;
  const point = (i: number) => {
    const t = i / samples;
    const y = s - ease(id, t) * s;
    return `${round(t * s)} ${round(y)}`;
  };
  return Array.from({ length: samples + 1 }, (_, i) => `${i === 0 ? "M" : "L"}${point(i)}`).join("");
}

const round = (n: number) => Math.round(n * 100) / 100;
