/**
 * Pure math for the ornament kit (v1 plan, Task A4): Ken Burns scale and origin, and the
 * clock-tick angle. Kept apart from the components so it is unit-tested.
 */
export type KenBurnsOrigin = "center" | "start-top" | "end-top" | "start-bottom" | "end-bottom";

/** Scale for a scroll progress, clamped to the range between `from` and `to`. */
export function kenBurnsScale(progress: number, from: number, to: number): number {
  const p = Math.min(1, Math.max(0, progress));
  return from + (to - from) * p;
}

/** CSS transform-origin; "start" and "end" follow the reading direction. */
export function kenBurnsOrigin(origin: KenBurnsOrigin, dir: "ltr" | "rtl"): string {
  if (origin === "center") return "50% 50%";
  const [side, edge] = origin.split("-") as ["start" | "end", "top" | "bottom"];
  const atLeft = (side === "start") === (dir === "ltr");
  return `${atLeft ? "0%" : "100%"} ${edge === "top" ? "0%" : "100%"}`;
}

/** The tick for the nth section on a page: 30° per section, a full turn every twelve. */
export const tickAngle = (index: number) => (((index % 12) + 12) % 12) * 30;
