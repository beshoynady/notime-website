#!/usr/bin/env node
/**
 * Images dropped by hand into assets-inbox/ (gitignored) -> their slots. Three sources, one
 * pipeline (D79, D80):
 *   - pexels / unsplash: licensed stock the user downloads by hand from pexels.com or
 *     unsplash.com (no API, no scraping, never automated);
 *   - chatgpt: images the user makes in ChatGPT (free tier).
 * Each file is named as in docs/content/stock-shot-list.md or image-prompt-pack.md, and has a row
 * in assets-inbox/credits.csv (`filename,source,page_url,photographer`; a chatgpt row leaves the
 * last two empty). A file with no row is refused.
 *
 *   node scripts/ingest-images.mjs
 *     Scans the inbox (and writes the credits.csv template if it's missing). For each file:
 *     matches its slot (src/lib/image-gen.ts inboxTarget), reads its credits row, checks its
 *     AI-provenance markers (C2PA, IPTC) and SHA-256, and cuts full-size inspection tiles into
 *     raw/inspect/<file>/ for the visual check (faces in focus, text, logos, brands, watermarks,
 *     hands, artefacts, a cool cast that won't take the palette). A script can't judge those: a
 *     person looks at every tile. Logs the file as received.
 *
 *   node scripts/ingest-images.mjs --verdict <file> accepted|rejected "<what was checked / why>"
 *     Records the full-size inspection. A visible watermark is always a rejection: it is never
 *     cropped or painted out.
 *
 *   node scripts/ingest-images.mjs --install <file>
 *     Only for a file whose exact bytes were accepted. Crops the largest centred area at the
 *     slot's aspect, never enlarging (D51); removes the background with rembg for cutout slots;
 *     then scene layers get their category's grade (scripts/grade.mjs) into
 *     public/images/scenes/<category>/, and site slots are encoded (AVIF q55, WebP q78) into
 *     public/images/stock/ (stock) or public/images/ai/ (ChatGPT, kept apart as CLAUDE.md asks).
 *     A stock image's credit goes into src/content/credits.json for the "Image credits" page.
 *     Prints the size and blur placeholder for the data files. The original stays untouched in
 *     assets-inbox/ (its hash is in the log).
 *
 *   node scripts/ingest-images.mjs --contact-sheet <file> [<file> …]
 *     One PNG: the installed new images beside the 7 approved Canva images, for the user's review.
 *
 * Every step appends a row to docs/content/image-generation-log.md (source, date, size, hash).
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

process.removeAllListeners("warning");
process.on("warning", (w) => w.code !== "MODULE_TYPELESS_PACKAGE_JSON" && console.warn(w));
const { centreCrop, inboxTarget, provenance, sceneCategory } = await import("../src/lib/image-gen.ts");
const { creditFor, parseCredits, upsertCredit } = await import("../src/lib/credits.ts");
const sharp = createRequire(import.meta.url)("sharp");

const INBOX = "assets-inbox";
const CREDITS_CSV = path.join(INBOX, "credits.csv");
const CREDITS_JSON = path.join("src", "content", "credits.json");
const LOG = path.join("docs", "content", "image-generation-log.md");
const TOOL = { pexels: "Pexels (manual download)", unsplash: "Unsplash (manual download)", chatgpt: "ChatGPT (free tier)" };
const APPROVED = [
  "cat-creative-production-4x5",
  "cat-marketing-brand-4x5",
  "cat-production-print-gifts-4x5",
  "cat-software-digital-4x5",
  "hero-fallback-9x16",
  "process-plan-4x5",
  "product-qr-check-in-16x9",
];

const read = (p) => readFileSync(p, "utf8");
const docs = () => [read("docs/content/image-prompts.md"), read("docs/design/storyboards/layers.md")];
const today = () => new Date().toISOString().slice(0, 10);
const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const logRow = (c) => appendFileSync(LOG, `| ${c.join(" | ")} |\n`);
const row = (credit, slot, aspect, size, status) => logRow([today(), slot, aspect, TOOL[credit.source], size, "—", "0.00", "—", status]);
const inboxFile = (name) => {
  const p = path.join(INBOX, path.basename(name));
  if (!existsSync(p)) throw new Error(`${p} not found`);
  return p;
};
const credits = () => {
  if (!existsSync(CREDITS_CSV)) writeFileSync(CREDITS_CSV, "filename,source,page_url,photographer\n");
  return parseCredits(read(CREDITS_CSV));
};
const isStock = (credit) => credit.source !== "chatgpt";
/** Where a site slot's files go: stock and AI images are kept apart (CLAUDE.md). */
const siteDir = (credit) => path.join("public", "images", isStock(credit) ? "stock" : "ai");

async function scan() {
  mkdirSync(INBOX, { recursive: true });
  const rows = credits();
  const files = readdirSync(INBOX).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  if (!files.length) return console.log(`${INBOX}/ is empty: save the images there, named as in docs/content/stock-shot-list.md, with a row each in ${CREDITS_CSV}`);
  for (const f of files) {
    const file = path.join(INBOX, f);
    let t, credit;
    try {
      t = inboxTarget(f, ...docs());
      credit = creditFor(f, rows);
    } catch (e) {
      console.log(`✗ ${f}: ${e.message}`);
      continue;
    }
    const buf = readFileSync(file);
    const { width, height } = await sharp(buf).metadata();
    const marks = provenance(buf);
    const hash = sha(buf);
    const crop = centreCrop(width, height, t.aspect);
    // Full-size tiles (≤ 800 px a side, no scaling) for the visual inspection.
    const dir = path.join("raw", "inspect", path.basename(f, path.extname(f)));
    mkdirSync(dir, { recursive: true });
    const tileCols = Math.ceil(width / 800), tileRows = Math.ceil(height / 800);
    const tw = Math.ceil(width / tileCols), th = Math.ceil(height / tileRows);
    for (let r = 0; r < tileRows; r++)
      for (let c = 0; c < tileCols; c++) {
        const left = c * tw, top = r * th;
        await sharp(buf).extract({ left, top, width: Math.min(tw, width - left), height: Math.min(th, height - top) }).png().toFile(path.join(dir, `tile-${r}-${c}.png`));
      }
    const marksText = `C2PA ${marks.c2pa ? "yes" : "no"}, IPTC AI ${marks.iptcAi ? "yes" : "no"}`;
    const by = isStock(credit) ? `, ${credit.photographer}, ${credit.pageUrl}` : "";
    row(credit, t.slot, t.aspect, `${width}×${height}`, `received ${f}${by} (${marksText}, sha256 ${hash.slice(0, 12)}); delivers ${crop.width}×${crop.height}${t.cutout ? ", cutout" : ""}`);
    console.log(`✓ ${f} → ${t.slot} ${t.aspect} (${t.kind}${t.cutout ? ", cutout" : ""}, ${credit.source}): ${width}×${height} → ${crop.width}×${crop.height}; ${marksText}; tiles in ${dir}`);
  }
}

/** The latest verdict for these exact bytes is "accepted" (a later rejection wins). */
function accepted(file) {
  const hash = sha(readFileSync(file)).slice(0, 12);
  const verdicts = read(LOG).split("\n").filter((l) => l.includes(`sha256 ${hash}`) && /\| (accepted|rejected):/.test(l));
  return /\| accepted:/.test(verdicts.at(-1) ?? "");
}

async function install(name) {
  const file = inboxFile(name);
  const credit = creditFor(path.basename(file), credits());
  if (!accepted(file)) throw new Error(`${name}: no "accepted" verdict for these exact bytes; inspect the tiles, then --verdict`);
  const t = inboxTarget(path.basename(file), ...docs());
  const { width, height } = await sharp(file).metadata();
  const crop = centreCrop(width, height, t.aspect);
  const stage = path.join("raw", "ai", "masters", t.kind === "scene" ? sceneCategory(t.slot) : "site");
  mkdirSync(stage, { recursive: true });
  const master = path.join(stage, `${t.master}.png`);
  await sharp(file).extract(crop).toColourspace("srgb").png().toFile(master);
  if (t.cutout) {
    try {
      execFileSync("rembg", ["i", master, master], { stdio: "inherit" });
    } catch {
      throw new Error(`${t.slot} is a cutout and rembg isn't available: install it (user scope) and run --install again`);
    }
  }
  let published;
  if (t.kind === "scene") {
    const cat = sceneCategory(t.slot);
    const out = path.join("public", "images", "scenes", cat);
    execFileSync(process.execPath, ["scripts/grade.mjs", cat, master, out], { stdio: "inherit" });
    published = `/images/scenes/${cat}/${t.master}.webp`;
  } else {
    const out = siteDir(credit);
    mkdirSync(out, { recursive: true });
    const img = sharp(master).toColourspace("srgb");
    await Promise.all([img.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(out, `${t.slot}.avif`)), img.clone().webp({ quality: 78 }).toFile(path.join(out, `${t.slot}.webp`))]);
    const blur = await sharp(master).resize(10).webp({ quality: 50 }).toBuffer();
    published = `/${path.posix.join("images", path.basename(out), `${t.slot}.webp`)}`;
    console.log(`${t.slot}: src ${published}, width ${crop.width}, height ${crop.height}, blurDataURL data:image/webp;base64,${blur.toString("base64")}`);
  }
  const hash = sha(readFileSync(file));
  if (isStock(credit)) {
    const list = existsSync(CREDITS_JSON) ? JSON.parse(read(CREDITS_JSON)) : [];
    const entry = { file: published, slot: t.master, source: credit.source, pageUrl: credit.pageUrl, photographer: credit.photographer, date: today(), sha256: hash };
    writeFileSync(CREDITS_JSON, `${JSON.stringify(upsertCredit(list, entry), null, 2)}\n`);
    console.log(`credit: ${credit.photographer} on ${credit.source} → ${CREDITS_JSON}`);
  }
  row(credit, t.slot, t.aspect, `${crop.width}×${crop.height}`, `installed ${published} from sha256 ${hash.slice(0, 12)}${t.cutout ? " (rembg cutout)" : ""}`);
}

async function contactSheet(names) {
  const cell = 360;
  const rows = credits();
  const tiles = [
    ...names.map((n) => {
      const t = inboxTarget(path.basename(n), ...docs());
      const credit = creditFor(path.basename(n), rows);
      const f = t.kind === "scene" ? path.join("public", "images", "scenes", sceneCategory(t.slot), `${t.master}.webp`) : path.join(siteDir(credit), `${t.slot}.webp`);
      return { file: f, label: `NEW ${t.master} (${credit.source})` };
    }),
    ...APPROVED.map((id) => ({ file: path.join("public", "images", "ai", `${id}.webp`), label: id })),
  ];
  const cols = 4;
  const label = (s) => Buffer.from(`<svg width="${cell}" height="28"><rect width="100%" height="100%" fill="#2e2017"/><text x="8" y="19" font-family="Arial" font-size="13" fill="#ead4ab">${s}</text></svg>`);
  const composites = [];
  for (const [i, t] of tiles.entries()) {
    const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + 28);
    composites.push({ input: await sharp(t.file).resize(cell, cell, { fit: "contain", background: "#1d140e" }).png().toBuffer(), left: x, top: y });
    composites.push({ input: label(t.label), left: x, top: y + cell });
  }
  const out = path.join("raw", "inspect", `contact-sheet-${today()}.png`);
  await sharp({ create: { width: cols * cell, height: Math.ceil(tiles.length / cols) * (cell + 28), channels: 3, background: "#1d140e" } }).composite(composites).png().toFile(out);
  console.log(`contact sheet: ${out}`);
}

const args = process.argv.slice(2);
if (args[0] === "--verdict") {
  const [, name, verdict, reason = ""] = args;
  if (!["accepted", "rejected"].includes(verdict) || !reason) throw new Error('--verdict <file> accepted|rejected "<what was checked / why>"');
  const file = inboxFile(name);
  const credit = creditFor(path.basename(file), credits());
  const t = inboxTarget(path.basename(file), ...docs());
  const { width, height } = await sharp(file).metadata();
  row(credit, t.slot, t.aspect, `${width}×${height}`, `${verdict}: ${reason.replaceAll("|", "/")} (sha256 ${sha(readFileSync(file)).slice(0, 12)})`);
} else if (args[0] === "--install") await install(args[1]);
else if (args[0] === "--contact-sheet") await contactSheet(args.slice(1));
else if (args.length === 0) await scan();
else throw new Error("usage: see the header of scripts/ingest-images.mjs");
