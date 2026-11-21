#!/usr/bin/env node
/**
 * Vectorise the supplied logo PNGs (docs/brand/logo-source, untouched) to SVG, then prove the
 * SVGs match them (D88 (6)). No redesign, recolour or reshaping:
 * - each file holds exactly two flat colours that never touch; each colour is traced (Potrace)
 *   as its own layer and filled with the colour read from the PNG, byte for byte;
 * - the crop is the PNG's own trim (as in export-logos.mjs);
 * - the wordmark variant is the same artwork without the "CREATIVE HOUSE" line, in the same
 *   viewBox, so swapping lockup and wordmark never moves the letters.
 *
 * Check: each SVG is rendered at the PNG's own size and compared per colour (coverage ≥ 50%).
 * Every pixel that differs must lie within one pixel *of the smallest 2× rendering* (2 × 128px,
 * i.e. 12 source pixels) of the same colour in the other image, or the script fails. It also
 * prints the stricter count beyond one source pixel. Comparing resampled small renders instead
 * flags sub-pixel crossbars in the tagline that land either side of the 50% threshold, an
 * antialiasing artefact rather than a shape difference.
 *
 *   node scripts/vectorise-logos.mjs
 *
 * TODO: replace placeholder — the designer's SVGs replace these when they arrive (OQ #12,
 * CONTENT_CHECKLIST #14).
 */
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// esm-potrace-wasm is a browser build; in Node it expects CommonJS globals.
globalThis.require = createRequire(import.meta.url);
globalThis.__dirname = ".";
const { potrace, init } = await import("esm-potrace-wasm");
await init();

const SRC = "docs/brand/logo-source";
const OUT = "public/images/brand/logo";
const VARIANTS = [
  { from: "logo-1.png", name: "logo-light-bg" }, // ivory sections, the header on light
  { from: "logo-3.png", name: "logo-light-bg-alt" },
  { from: "logo-4.png", name: "logo-dark-bg" },
  { from: "logo-2.png", name: "logo-dark-bg-alt" },
  { from: "logo-4.png", name: "logo-dark-bg-wordmark", wordmark: true }, // dark header, footer
];
const SMALLEST_2X = 256; // the logo is 128px wide on phones (logo.tsx), 150px from 900px

const hex = ([r, g, b]) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

async function load(file) {
  const { data, info } = await sharp(path.join(SRC, file)).trim({ threshold: 1 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height };
}

/** The two flat colours of the artwork (fully opaque pixels only). */
function colours({ data }) {
  const count = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 255) continue;
    const k = `${data[i]},${data[i + 1]},${data[i + 2]}`;
    count.set(k, (count.get(k) ?? 0) + 1);
  }
  if (count.size !== 2) throw new Error(`expected 2 flat colours, found ${count.size}`);
  return [...count.keys()].map((k) => k.split(",").map(Number));
}

const nearest = (cols, r, g, b) => {
  let best = 0, d = Infinity;
  cols.forEach(([cr, cg, cb], i) => {
    const e = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    if (e < d) {
      d = e;
      best = i;
    }
  });
  return best;
};

/** Rows of the wordmark: everything above the last fully empty band (the tagline sits below it). */
function wordmarkRows({ data, W, H }) {
  const filled = (y) => {
    for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 0) return true;
    return false;
  };
  let y = H - 1;
  while (y >= 0 && filled(y)) y--; // up through the tagline
  while (y >= 0 && !filled(y)) y--; // up through the gap
  if (y < H * 0.5) throw new Error("no gap above the tagline");
  return y + 1; // rows [0, end)
}

/** Per-colour coverage masks: 1 where alpha ≥ 50% and the pixel is nearest that colour. */
function masks({ data, W, H }, cols, rows = H) {
  const m = cols.map(() => new Uint8Array(W * H));
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (data[i + 3] < 128) continue;
      m[nearest(cols, data[i], data[i + 1], data[i + 2])][y * W + x] = 1;
    }
  return m;
}

async function trace(mask, W, H) {
  const img = new Uint8ClampedArray(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const v = mask[i] ? 0 : 255;
    img[i * 4] = img[i * 4 + 1] = img[i * 4 + 2] = v;
    img[i * 4 + 3] = 255;
  }
  const svg = await potrace({ data: img, width: W, height: H }, {
    turdsize: 2, turnpolicy: 4, alphamax: 1, opticurve: 1, opttolerance: 0.2,
    pathonly: false, extractcolors: false, posterizelevel: 2, posterizationalgorithm: 0,
  });
  const d = [...svg.matchAll(/<path d="([^"]+)"/g)].map((x) => x[1].trim()).join(" ");
  const transform = svg.match(/<g transform="([^"]+)"/)?.[1];
  if (!d || !transform) throw new Error("unexpected potrace output");
  return { d, transform: transform.replace(/(\d+)\.0+\b/g, "$1").replace(/\.(\d*?)0+\b/g, ".$1") };
}

/** Pixels in `a` with no pixel of `b` within `r` px (a square neighbourhood). */
function misses(a, b, W, H, r) {
  let n = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (!a[y * W + x] || b[y * W + x]) continue;
      let near = false;
      for (let dy = -r; dy <= r && !near; dy++)
        for (let dx = -r; dx <= r && !near; dx++) {
          const yy = y + dy, xx = x + dx;
          if (yy >= 0 && yy < H && xx >= 0 && xx < W && b[yy * W + xx]) near = true;
        }
      if (!near) n++;
    }
  return n;
}

let failed = false;
for (const v of VARIANTS) {
  const png = await load(v.from);
  const cols = colours(png);
  const rows = v.wordmark ? wordmarkRows(png) : png.H;
  const layers = [];
  for (const [i, m] of masks(png, cols, rows).entries()) {
    if (!m.some(Boolean)) continue;
    layers.push({ fill: hex(cols[i]), ...(await trace(m, png.W, png.H)) });
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${png.W} ${png.H}" width="${png.W}" height="${png.H}">` +
    layers.map((l) => `<path fill="${l.fill}" transform="${l.transform}" d="${l.d}"/>`).join("") +
    `</svg>\n`;
  const file = path.join(OUT, `${v.name}.svg`);
  await writeFile(file, svg);

  // The reference: the PNG itself (the wordmark: with the tagline rows cleared).
  const ref = Buffer.from(png.data);
  if (v.wordmark) ref.fill(0, rows * png.W * 4);
  // Rendered at the source's own size: no resampling of the reference, so only the outline counts.
  const { W, H } = png;
  const out = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
  const ma = masks({ data: ref, W, H }, cols), mb = masks({ data: out, W, H }, cols);
  const count = (r) => cols.reduce((n, _, c) => n + misses(ma[c], mb[c], W, H, r) + misses(mb[c], ma[c], W, H, r), 0);
  const tol = Math.ceil(W / SMALLEST_2X); // one pixel of the smallest 2× rendering, in source pixels
  const [strict, gate] = [count(1), count(tol)];
  if (gate) failed = true;
  console.log(
    `${v.from} → ${file}  ${(svg.length / 1024).toFixed(1)} KB  ${layers.map((l) => l.fill).join(" ")}  ` +
      `beyond 1px at 2× (${tol} source px): ${gate}  ·  beyond 1 source px: ${strict}`,
  );
}
if (failed) {
  console.error("FAIL: an SVG's outline is more than 1px off its PNG at 2×");
  process.exit(1);
}
