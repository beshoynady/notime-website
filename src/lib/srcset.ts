/**
 * Trims a width-descriptor `srcset` so no candidate is wider than the file itself (D51).
 *
 * `sizes` only describes layout width; the browser multiplies it by the device pixel ratio, so
 * `sizes` alone cannot stop a 2× or 3× screen asking for more pixels than the image has. The
 * candidate list can: with nothing above the native width, the browser never requests more.
 * Keeps the smallest candidate when all are wider. Density (`1x`/`2x`) sets pass through.
 */
export function capSrcSet<T extends string | undefined>(srcSet: T, nativeWidth: number | undefined): T {
  if (!srcSet || !nativeWidth) return srcSet;
  const candidates = srcSet.split(", ").map((c) => ({ c, w: Number(/ (\d+)w$/.exec(c)?.[1]) }));
  if (candidates.some((x) => !x.w)) return srcSet;
  const kept = candidates.filter((x) => x.w <= nativeWidth);
  return (kept.length ? kept : candidates.slice(0, 1)).map((x) => x.c).join(", ") as T;
}
