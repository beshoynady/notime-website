#!/usr/bin/env node
/**
 * Company profile extraction (Task 11b): embedded images at native resolution, and the text
 * verbatim by page.
 *   node scripts/extract-profile.mjs --survey [pdf]   one line per image: page, size, filter, bytes
 *   node scripts/extract-profile.mjs [pdf]            images -> public/images/work/raw/p{page}-{n}.{ext}
 *   node scripts/extract-profile.mjs --text [pdf]     text, by page -> stdout
 * pdf defaults to docs/brand/company-profile-2026.pdf.
 *
 * Images are the PDF's own image objects, not page renders. JPEG (DCTDecode) and JPEG 2000
 * streams are written byte for byte; anything else is decoded once to PNG (with its soft
 * mask as alpha). An image placed on several pages is written once, named after its first page.
 * Pages 20 (media network), 30 and 34 (singers, oud players) and 35-37 (influencer network)
 * are skipped, images and text (project rules: no talent or influencer content).
 *
 * The extraction engine is MuPDF.js (npm `mupdf`, AGPL-3.0, DECISIONS D47). It is a tool, not a
 * dependency: it is installed with npm into $MUPDF_DIR (default: <os tmp>/nt-mupdf-<version>),
 * never into this repo, and no site code imports it.
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MUPDF_VERSION = "1.28.1";
// PDF page numbers (the printed folios run one lower from page 21 on).
// 20 media network (no outlet confirmed, OQ) · 30 Arabic singers · 34 oud players (talent)
// 35-37 celebrity & influencer network. Project rules: no talent or influencer content.
const SKIP_PAGES = new Set([20, 30, 34, 35, 36, 37]);
const OUT_DIR = path.join("public", "images", "work", "raw");

const args = process.argv.slice(2);
const mode = args.includes("--survey") ? "survey" : args.includes("--text") ? "text" : "extract";
const pdfPath = args.find((a) => !a.startsWith("--")) ?? path.join("docs", "brand", "company-profile-2026.pdf");

// ---- MuPDF.js install (outside the repo) ---------------------------------------------------
const toolDir = process.env.MUPDF_DIR ?? path.join(os.tmpdir(), `nt-mupdf-${MUPDF_VERSION}`);
const entry = path.join(toolDir, "node_modules", "mupdf", "dist", "mupdf.js");
if (!existsSync(entry)) {
  mkdirSync(toolDir, { recursive: true });
  console.error(`Installing mupdf@${MUPDF_VERSION} into ${toolDir}`);
  execSync(`npm install --no-save --no-package-lock --no-audit --no-fund --prefix "${toolDir}" mupdf@${MUPDF_VERSION}`, { stdio: "inherit" });
}
const mupdf = await import(pathToFileURL(entry).href);

const doc = mupdf.Document.openDocument(readFileSync(pdfPath), "application/pdf");
const pdf = doc.asPDF();
const pageCount = doc.countPages();

/** Decoded content of a page's /Contents (one stream or an array of streams). */
function contentOf(contents) {
  if (contents.isNull()) return "";
  if (contents.isArray()) return Array.from({ length: contents.length }, (_, i) => contentOf(contents.get(i))).join("\n");
  return new TextDecoder("latin1").decode(contents.readStream().asUint8Array());
}

/**
 * Image XObjects a content stream actually draws (`/Name Do`), recursing into form XObjects.
 * The resources dictionary alone is not enough: this PDF shares one dictionary across pages.
 */
function imagesDrawn(content, resources, seen = new Set(), out = []) {
  const xobjects = resources?.get("XObject");
  if (!xobjects || xobjects.isNull()) return out;
  for (const [, name] of content.matchAll(/\/([^\s/[\]()<>{}%]+)\s+Do\b/g)) {
    const ref = xobjects.get(name);
    if (ref.isNull()) continue;
    const id = ref.isIndirect() ? ref.asIndirect() : -1;
    const key = `${id}:${name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const obj = ref.resolve();
    const subtype = obj.get("Subtype").asName();
    if (subtype === "Image") out.push({ name, ref });
    else if (subtype === "Form") {
      const own = obj.get("Resources");
      imagesDrawn(contentOf(ref), own.isNull() ? resources : own, seen, out);
    }
  }
  return out;
}

const filterOf = (obj) => {
  const f = obj.get("Filter");
  if (f.isNull()) return "none";
  if (f.isArray()) return Array.from({ length: f.length }, (_, i) => f.get(i).asName()).join("+");
  return f.asName();
};

if (mode === "text") {
  for (let i = 0; i < pageCount; i++) {
    const page = i + 1;
    if (SKIP_PAGES.has(page)) {
      console.log(`\n=== Page ${page} (skipped) ===`);
      continue;
    }
    const text = doc.loadPage(i).toStructuredText("preserve-whitespace").asText().trim();
    console.log(`\n=== Page ${page} ===\n${text}`);
  }
  process.exit(0);
}

if (mode === "extract") mkdirSync(OUT_DIR, { recursive: true });
const written = new Map(); // xref -> file name
let total = 0;
for (let i = 0; i < pageCount; i++) {
  const page = i + 1;
  const pageObj = doc.loadPage(i).getObject();
  const imgs = imagesDrawn(contentOf(pageObj.get("Contents")), pageObj.getInheritable("Resources"));
  if (SKIP_PAGES.has(page)) {
    if (mode === "survey") console.log(`p${page}: skipped (${imgs.length} images)`);
    continue;
  }
  let n = 0;
  for (const { name, ref } of imgs) {
    const obj = ref.resolve();
    const xref = ref.isIndirect() ? ref.asIndirect() : -1;
    const w = obj.get("Width").asNumber();
    const h = obj.get("Height").asNumber();
    const filter = filterOf(obj);
    const smask = !obj.get("SMask").isNull();
    const isMask = obj.get("ImageMask").isBoolean?.() && obj.get("ImageMask").asBoolean();
    if (isMask || w < 16 || h < 16) continue; // stencil masks and spacer pixels are not pictures
    const cs = obj.get("ColorSpace");
    const csName = cs.isName() ? cs.asName() : cs.isArray() ? cs.get(0).asName() : "?";
    if (written.has(xref)) {
      if (mode === "survey") console.log(`p${page}: ${name} = ${written.get(xref)} (repeat)`);
      continue;
    }
    n++;
    total++;
    const raw = filter === "DCTDecode" || filter === "JPXDecode";
    const ext = filter === "DCTDecode" ? "jpg" : filter === "JPXDecode" ? "jp2" : "png";
    const file = `p${page}-${n}.${ext}`;
    written.set(xref, file);
    if (mode === "survey") {
      const bytes = ref.readRawStream().length;
      console.log(`p${page}: ${file} ${w}x${h} ${filter} ${csName}${smask ? " +smask" : ""} ${(bytes / 1024).toFixed(0)}KB`);
      continue;
    }
    // CMYK JPEGs are decoded to PNG too, so browsers and sharp read them the same way.
    let data;
    if (raw && !smask && csName !== "DeviceCMYK") data = ref.readRawStream().asUint8Array();
    else {
      const pix = pdf.loadImage(ref).toPixmap();
      data = pix.asPNG();
    }
    const out = raw && !smask && csName !== "DeviceCMYK" ? file : file.replace(/\.(jpg|jp2)$/, ".png");
    writeFileSync(path.join(OUT_DIR, out), data);
    console.log(`${out} ${w}x${h}`);
  }
}
console.error(`${total} unique images on ${pageCount} pages${mode === "extract" ? ` -> ${OUT_DIR}` : ""}`);
