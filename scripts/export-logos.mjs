#!/usr/bin/env node
/**
 * The site itself uses the SVGs from vectorise-logos.mjs; these PNGs are for email and other
 * non-web uses.
 *
 * Trim and export the supplied logo PNGs (docs/brand/logo-source, untouched) to
 * public/images/brand/logo/. Pixels are only cropped and resampled: never recoloured,
 * redrawn or distorted (aspect ratio is preserved).
 *
 *   node scripts/export-logos.mjs
 *
 * Output per variant: <name>.png (2x master, used as the next/image source) and
 * <name>@1x.png (for non-Next uses such as email signatures).
 * TODO: replace placeholder — swap these PNGs for the designer's SVGs (CONTENT_CHECKLIST #14).
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "docs/brand/logo-source";
const OUT = "public/images/brand/logo";
const WIDTH_1X = 170; // header lockup at 1x: 140–170px

const VARIANTS = [
  { from: "logo-1.png", name: "logo-light-bg" }, // primary, ivory sections
  { from: "logo-3.png", name: "logo-light-bg-alt" },
  { from: "logo-4.png", name: "logo-dark-bg" }, // espresso sections, hero header
  { from: "logo-2.png", name: "logo-dark-bg-alt" },
];

await mkdir(OUT, { recursive: true });

for (const v of VARIANTS) {
  // trim() crops rows/columns matching the (transparent) top-left pixel.
  const trimmed = await sharp(path.join(SRC, v.from)).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;
  for (const [suffix, w] of [["", WIDTH_1X * 2], ["@1x", WIDTH_1X]]) {
    const file = path.join(OUT, `${v.name}${suffix}.png`);
    const info = await sharp(trimmed.data)
      .resize({ width: w, kernel: "lanczos3" })
      .png({ compressionLevel: 9, palette: false })
      .toFile(file);
    console.log(`${v.from} → ${file}  trimmed ${width}×${height} → ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
  }
}
