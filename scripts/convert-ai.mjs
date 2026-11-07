#!/usr/bin/env node
/**
 * AI image masters -> public/images/ai/<slot>.{avif,webp} (delivery spec in
 * docs/content/image-prompts.md: AVIF q55, WebP q78, sRGB, size as exported).
 *   node scripts/convert-ai.mjs <masters-dir>
 *
 * Masters are the full-size PNG exports from the Canva folder "NO TIME – Website AI" (D50),
 * named <slot>.png and kept outside the repo. Only slots listed in PASSED are converted: each
 * one was inspected at full size (no text or logos, hands correct, no artefacts). Prints the
 * 10px WebP blur placeholder to paste into src/content/images.ts.
 */
import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const OUT = path.join("public", "images", "ai");

/** Slots whose master passed the full-size inspection. Keep in sync with image-prompts.md. */
export const PASSED = [
  "cat-creative-production-4x5",
  "cat-marketing-brand-4x5",
  "cat-production-print-gifts-4x5",
  "cat-software-digital-4x5",
  "hero-fallback-9x16",
  "process-plan-4x5",
  "product-qr-check-in-16x9",
];

const dir = process.argv[2];
if (!dir) throw new Error("usage: node scripts/convert-ai.mjs <masters-dir>");
mkdirSync(OUT, { recursive: true });

for (const slot of PASSED) {
  const src = path.join(dir, `${slot}.png`);
  if (!existsSync(src)) throw new Error(`${src} missing`);
  const img = sharp(src).toColourspace("srgb");
  const base = path.join(OUT, slot);
  const [avif, webp, blur] = await Promise.all([
    img.clone().avif({ quality: 55, effort: 6 }).toFile(`${base}.avif`),
    img.clone().webp({ quality: 78 }).toFile(`${base}.webp`),
    img.clone().resize(10).webp({ quality: 50 }).toBuffer(),
  ]);
  console.log(`${slot} ${avif.width}x${avif.height} avif ${(avif.size / 1024).toFixed(0)}KB webp ${(webp.size / 1024).toFixed(0)}KB`);
  console.log(`  blurDataURL: "data:image/webp;base64,${blur.toString("base64")}"`);
}
