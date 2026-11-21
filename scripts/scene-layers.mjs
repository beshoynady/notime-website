#!/usr/bin/env node
/**
 * Scene layers from a recipe (D152; docs/superpowers/specs/2026-11-21-visual-portfolio-design.md §7).
 *   node --env-file=.env.local scripts/scene-layers.mjs docs/content/recipes/<page>.json [--only=<id>]
 *
 * Each recipe item:
 *   { id, src, crop: { aspect: "16:9"|"9:16"|"4:5"|"3:4"|"1:1"|"3:2", focus?: [x, y] },
 *     grade?: "evening"|"workshop"|"editorial"|"studio", night?: true, cut?: "rembg",
 *     mobile?: { aspect: "9:16", focus?: [x, y] }, out: "public/images/<folder>/<id>.webp", maxWidth?: 2400 }
 * `src` is a file (Rand's profile photos: public/images/work/... or public/images/work/raw/...) or
 * `unsplash:<id>`, downloaded once into assets-inbox/stock/ (gitignored) through the API's
 * download endpoint. The crop is the largest box of `aspect` centred on `focus` (0–1, default the
 * centre) at native pixels, then shrunk to `maxWidth`: never enlarged (D51). `night` grades the
 * hour before (dark, cool, low saturation). `cut` keeps only the foreground (rembg, alpha).
 * Prints a registry stub per item for src/content/media.ts.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
process.removeAllListeners("warning");
const { GRADES } = await import("../src/lib/grade.ts");

const args = process.argv.slice(2);
const recipePath = args.find((a) => !a.startsWith("--"));
const only = args.find((a) => a.startsWith("--only="))?.slice(7);
const items = JSON.parse(readFileSync(recipePath, "utf8"));
const STOCK = "assets-inbox/stock";
mkdirSync(STOCK, { recursive: true });

const ratio = (a) => {
  const [w, h] = a.split(":").map(Number);
  return w / h;
};

async function source(src) {
  if (!src.startsWith("unsplash:")) return { file: src };
  const file = path.join(STOCK, `${src.replace(":", "-")}.jpg`);
  if (!existsSync(file)) {
    const out = execFileSync(process.execPath, ["--env-file=.env.local", "scripts/stock-search.mjs", `--get=${src}`, `--out=${file}`], { encoding: "utf8" });
    console.error(out.trim());
  }
  return { file };
}

/** The largest `aspect` box inside w×h, centred on focus (clamped inside the image). */
function cropBox(w, h, aspect, focus = [0.5, 0.5]) {
  const r = ratio(aspect);
  let cw = w;
  let ch = Math.round(w / r);
  if (ch > h) {
    ch = h;
    cw = Math.round(h * r);
  }
  const left = Math.min(Math.max(Math.round(focus[0] * w - cw / 2), 0), w - cw);
  const top = Math.min(Math.max(Math.round(focus[1] * h - ch / 2), 0), h - ch);
  return { left, top, width: cw, height: ch };
}

async function render(file, crop, item, suffix = "") {
  const meta = await sharp(file).rotate().metadata();
  const box = cropBox(meta.width, meta.height, crop.aspect, crop.focus);
  const maxWidth = suffix ? Math.min(item.maxWidth ?? 2400, 1080) : (item.maxWidth ?? 2400);
  let img = sharp(file).rotate().extract(box);
  if (box.width > maxWidth) img = img.resize({ width: maxWidth });
  if (item.grade) {
    const g = GRADES[item.grade];
    img = img.recomb(g.matrix).modulate(g.modulate);
  }
  if (item.night) img = img.modulate({ brightness: 0.62, saturation: 0.65 }).recomb([[0.82, 0, 0], [0, 0.9, 0], [0, 0.04, 1.08]]);
  // A cutout goes through rembg as a lossless PNG; everything else is encoded straight to WebP.
  if (item.cut === "rembg") {
    const tmpIn = path.join(STOCK, `_cut-${item.id}${suffix}.png`);
    const tmpOut = path.join(STOCK, `_cut-${item.id}${suffix}-out.png`);
    await img.png().toFile(tmpIn);
    execFileSync("python", ["scripts/lib/rembg-cut.py", tmpIn, tmpOut], { stdio: "inherit" });
    img = sharp(readFileSync(tmpOut));
  }
  const out = suffix ? item.out.replace(/\.webp$/, `${suffix}.webp`) : item.out;
  mkdirSync(path.dirname(out), { recursive: true });
  const info = await img.webp({ quality: 80, alphaQuality: 90, effort: 5 }).toFile(out);
  return { file: "/" + out.replace(/^public\//, "").replaceAll("\\", "/"), width: info.width, height: info.height, kb: Math.round(info.size / 1024) };
}

for (const item of items) {
  if (only && item.id !== only) continue;
  const { file } = await source(item.src);
  const [main, mobile] = await Promise.all([render(file, item.crop, item), item.mobile ? render(file, item.mobile, item, "-9x16") : null]);
  console.log(
    `${item.id}: ${main.file} ${main.width}x${main.height} ${main.kb}KB` + (mobile ? ` · mobile ${mobile.file} ${mobile.width}x${mobile.height} ${mobile.kb}KB` : ""),
  );
}
