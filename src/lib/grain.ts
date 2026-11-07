/**
 * Film grain for the hero canvas (D45): one noise tile, rendered once, drawn as a pattern
 * and jittered a few times per second. Replaces the CSS SVG `feTurbulence` layer, whose
 * raster held back the first frame on cold loads (measured, Checkpoint 3).
 */

/** Small, fast, seedable PRNG (mulberry32): the same seed always gives the same tile. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * RGBA pixels of a `size` x `size` noise tile: each pixel is the tint scaled by one random
 * luminance (0–1), fully opaque. Drawn additively, a black pixel adds nothing and a bright one
 * adds the tint, so the grain keeps the tint's hue.
 */
export function noiseTile(size: number, [r, g, b]: [number, number, number], seed = 1): Uint8ClampedArray<ArrayBuffer> {
  const next = rng(seed);
  const px = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < px.length; i += 4) {
    const l = next();
    px[i] = r * l;
    px[i + 1] = g * l;
    px[i + 2] = b * l;
    px[i + 3] = 255;
  }
  return px;
}

/**
 * Pattern offset at time `t` (ms): constant within each of `fps` steps per second, then a
 * jump to another whole-pixel position inside the tile, so the grain flickers like film
 * instead of sliding.
 */
export function grainOffset(t: number, fps: number, tile: number): { x: number; y: number } {
  const next = rng(Math.floor((t * fps) / 1000) + 1);
  return { x: Math.floor(next() * tile), y: Math.floor(next() * tile) };
}
