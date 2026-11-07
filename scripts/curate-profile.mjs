#!/usr/bin/env node
/**
 * Curated company-profile images (Task 11b): raw extraction -> public/images/work/<slug>/ as
 * AVIF + WebP at native size (long edge capped at 1600, never upscaled).
 *   node scripts/extract-profile.mjs   (first: writes public/images/work/raw/, gitignored)
 *   node scripts/curate-profile.mjs
 *
 * Only images that are real NO TIME work, show no identifiable person, and are large enough for
 * a site slot. Everything else stays in raw/ with its reason in docs/content/profile-inventory.md
 * (people pending photo rights, low resolution pending originals, stock, AI, talent).
 * None of these files is wired to a page until each client approves the use of its name (OQ #17).
 */
import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const RAW = path.join("public", "images", "work", "raw");
const OUT = path.join("public", "images", "work");
const MAX = 1600;

/** slug -> raw files, in display order. Keep in sync with profile-inventory.md. */
export const CURATED = {
  "uae-pro-league": ["p5-1.jpg", "p5-3.jpg", "p13-3.jpg", "p13-4.jpg", "p23-4.jpg"],
  "uae-athletics-federation": ["p18-2.jpg", "p18-4.png", "p6-4.jpg"],
  "egyptair-pavilion": ["p19-2.jpg"],
  // Ultimate Power Solution: every stand photo shows identifiable people (pending rights).
  sandoz: ["p8-1.jpg"],
  "private-celebrations": ["p9-2.jpg", "p9-1.jpg", "p10-1.jpg", "p10-5.jpg", "p11-1.jpg", "p9-3.jpg", "p8-5.jpg", "p10-2.jpg"],
  catering: ["p28-1.jpg", "p4-1.jpg", "p4-3.jpg", "p25-3.jpg", "p26-1.jpg", "p27-1.jpg", "p29-1.jpg"],
  heritage: ["p31-2.jpg", "p31-3.jpg", "p31-5.jpg", "p32-1.jpg", "p31-1.jpg"],
  gifts: ["p23-3.jpg", "p23-2.jpg"],
};

for (const [slug, files] of Object.entries(CURATED)) {
  const dir = path.join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  for (const [i, file] of files.entries()) {
    const src = path.join(RAW, file);
    if (!existsSync(src)) throw new Error(`${src} missing: run scripts/extract-profile.mjs first`);
    const base = path.join(dir, `${slug}-${i + 1}`);
    const img = sharp(src).rotate().resize(MAX, MAX, { fit: "inside", withoutEnlargement: true });
    const [avif, webp] = await Promise.all([
      img.clone().avif({ quality: 55, effort: 6 }).toFile(`${base}.avif`),
      img.clone().webp({ quality: 78 }).toFile(`${base}.webp`),
    ]);
    console.log(`${file} -> ${slug}/${slug}-${i + 1} ${avif.width}x${avif.height} avif ${(avif.size / 1024).toFixed(0)}KB webp ${(webp.size / 1024).toFixed(0)}KB`);
  }
}
