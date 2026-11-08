#!/usr/bin/env node
/**
 * Scene layers -> graded AVIF + WebP (D64; docs/design/storyboards/layers.md "Colour unity").
 *   node scripts/grade.mjs <category> <in> <out> [--width N]
 *
 * <in> is a PNG master (a cutout keeps its alpha) or a folder of them, named <slot>.png and kept
 * outside the repo; <out> is normally public/images/scenes/<category>. Each master gets the
 * category's grade (src/lib/grade.ts: a sharp recomb matrix, then modulate) and is written at
 * native size: AVIF q55 and WebP q78, sRGB, alpha kept. `--width` may only shrink: a wider target
 * is refused (D51). Prints each file's size and the totals per format; the per-scene mobile
 * budget (≤ 600 KB) is enforced by the scene content tests.
 */
import { createRequire } from "node:module";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
// The grades live in TypeScript (src/lib/grade.ts, shared with the app); Node runs it directly but
// warns that the repo's package.json sets no "type". Expected here, so only that warning is muted.
process.removeAllListeners("warning");
process.on("warning", (w) => w.code !== "MODULE_TYPELESS_PACKAGE_JSON" && console.warn(w));
const { CATEGORY_GRADE, GRADES, upscaleProblem } = await import("../src/lib/grade.ts");

const args = process.argv.slice(2);
const widthAt = args.indexOf("--width");
const width = widthAt >= 0 ? Number(args.splice(widthAt, 2)[1]) : undefined;
const [category, input, out] = args;
if (!category || !input || !out) throw new Error("usage: node scripts/grade.mjs <category> <in> <out> [--width N]");
const grade = CATEGORY_GRADE[category];
if (!grade) throw new Error(`no grade for ${category} (src/lib/grade.ts CATEGORY_GRADE)`);
const { matrix, modulate } = GRADES[grade];

const masters = statSync(input).isDirectory()
  ? readdirSync(input).filter((f) => f.endsWith(".png")).map((f) => path.join(input, f))
  : [input];
if (masters.length === 0) throw new Error(`no .png masters in ${input}`);
mkdirSync(out, { recursive: true });

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const totals = { avif: 0, webp: 0 };
for (const master of masters) {
  const slot = path.basename(master, ".png");
  const meta = await sharp(master).metadata();
  const problem = upscaleProblem(meta.width, width);
  if (problem) throw new Error(`${slot}: ${problem}`);
  let img = sharp(master).toColourspace("srgb").recomb(matrix).modulate(modulate);
  if (width && width < meta.width) img = img.resize({ width });
  const base = path.join(out, slot);
  const [avif, webp] = await Promise.all([
    img.clone().avif({ quality: 55, effort: 6 }).toFile(`${base}.avif`),
    img.clone().webp({ quality: 78, alphaQuality: 90 }).toFile(`${base}.webp`),
  ]);
  for (const [ext, info] of [["avif", avif], ["webp", webp]]) {
    totals[ext] += info.size;
    console.log(`${slot}.${ext}  ${info.width} × ${info.height}  ${kb(info.size)}`);
  }
}
console.log(`total avif  ${kb(totals.avif)}`);
console.log(`total webp  ${kb(totals.webp)}`);
