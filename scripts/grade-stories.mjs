#!/usr/bin/env node
/**
 * Photo stories (D109) → graded AVIF + WebP in public/images/stories/.
 *   node scripts/grade-stories.mjs
 * Reads each story photo's raw profile file (public/images/work/raw/, gitignored, native size),
 * writes a PNG master to a temp folder, then grades it with the Evening grade through
 * scripts/grade.mjs (same matrix, quality and native-size rule as the scene layers).
 */
import { mkdirSync, mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
process.removeAllListeners("warning");
const { STORY_BASE, mediaAll } = await import("../src/content/media.ts");

/** Curated id → its raw extract (profile-inventory.md). */
const RAW = {
  "private-celebrations-1": "p9-2.jpg",
  "private-celebrations-2": "p9-1.jpg",
  "private-celebrations-4": "p10-5.jpg",
  "private-celebrations-5": "p11-1.jpg",
  "private-celebrations-6": "p9-3.jpg",
  "private-celebrations-7": "p8-5.jpg",
  "private-celebrations-8": "p10-2.jpg",
  "catering-1": "p28-1.jpg",
  "catering-2": "p4-1.jpg",
  "heritage-4": "p32-1.jpg",
  "heritage-5": "p31-1.jpg",
};

const masters = mkdtempSync(path.join(tmpdir(), "nt-stories-"));
for (const [id, base] of Object.entries(STORY_BASE)) {
  const photo = { id, ...mediaAll(id) };
  const raw = path.join("public", "images", "work", "raw", RAW[base] ?? "");
  if (!RAW[base] || !existsSync(raw)) throw new Error(`${id}: no raw file for ${base}`);
  const meta = await sharp(raw).metadata();
  if (meta.width !== photo.width || meta.height !== photo.height) throw new Error(`${photo.id}: ${meta.width}×${meta.height} on disk, ${photo.width}×${photo.height} in media.ts`);
  await sharp(raw).png().toFile(path.join(masters, `${photo.id}.png`));
}
const out = path.join("public", "images", "stories");
mkdirSync(out, { recursive: true });
const r = spawnSync(process.execPath, ["scripts/grade.mjs", "events-hospitality", masters, out], { stdio: "inherit" });
process.exit(r.status ?? 1);
