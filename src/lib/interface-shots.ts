/**
 * The Interface opening's shots (storyboards/software-digital.md, Act 1), in vh of scroll on
 * desktop (pinned, 2.0 vh) and in fractions of the stage's crossing on mobile (no pin; the
 * wireframe and the fill merge, D74 precedent). Each entry: [start, end, line index].
 * Mobile has no "Lines become a layout." line: its shot 2 is merged into the fill.
 */
export type Shot = readonly [start: number, end: number, line: number];

export const OPENING_SHOTS = {
  desktop: [
    [0, 0.45, 0],
    [0.45, 0.95, 1],
    [0.95, 1.5, 2],
    [1.5, 2.0, 3],
  ],
  mobile: [
    [0, 0.25, 0],
    [0.25, 0.4, 2],
    [0.4, 0.65, 2],
    [0.65, 1, 3],
  ],
} as const satisfies Record<"desktop" | "mobile", readonly Shot[]>;

/** The shot in play at `t` (clamped to the first and last). */
export function shotIndexAt(t: number, shots: readonly Shot[]): number {
  for (let i = shots.length - 1; i >= 0; i--) if (t >= shots[i][0]) return i;
  return 0;
}
