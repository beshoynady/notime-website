#!/usr/bin/env node
/**
 * The home hero's five objects (D173): one per service, cut out on transparency and finished to
 * one look, so five stock photographs read as one set.
 *   node --env-file=.env.local scripts/hero-objects.mjs [--only=<id>]
 *
 * Per object: crop the source (Unsplash, downloaded once into assets-inbox/stock/), paint a
 * generic interface into a blank screen (phone, laptop: no logo, no words), cut the object out
 * (rembg, scripts/lib/rembg-cut.py), then one finish for all five:
 *   - one grade: a warm gradient map (espresso → cocoa → taupe → champagne → ivory) mixed with
 *     the source, so a black lens, a chrome lamp and a white phone share one palette;
 *   - one key light: brighter on the start side, falling off to the end side, from above;
 *   - one shadow: a soft contact shadow under the object, away from the light.
 * The spotlight also gets its beam (a soft warm cone from the lens). Output: alpha WebP, max 720px.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const STOCK = "assets-inbox/stock";
const WORK = "assets-inbox/hero-objects";
mkdirSync(STOCK, { recursive: true });
mkdirSync(WORK, { recursive: true });

const P = { espresso: "#2E2017", cocoa: "#634731", taupe: "#BB9A79", champagne: "#EAD4AB", ivory: "#F5E9D3" };

/** A generic campaign post on a phone: avatar, picture, actions, caption lines, a button, two stats. */
const PHONE_UI = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 984 2212">
  <defs>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.cocoa}"/><stop offset="1" stop-color="${P.espresso}"/></linearGradient>
  </defs>
  <rect width="984" height="2212" fill="${P.ivory}"/>
  <circle cx="104" cy="250" r="48" fill="${P.cocoa}"/><circle cx="104" cy="250" r="20" fill="${P.champagne}"/>
  <rect x="176" y="222" width="270" height="24" rx="12" fill="${P.espresso}"/>
  <rect x="176" y="262" width="170" height="18" rx="9" fill="${P.taupe}"/>
  <circle cx="852" cy="250" r="9" fill="${P.cocoa}"/><circle cx="882" cy="250" r="9" fill="${P.cocoa}"/><circle cx="912" cy="250" r="9" fill="${P.cocoa}"/>
  <rect y="340" width="984" height="1000" fill="url(#m)"/>
  <circle cx="610" cy="760" r="250" fill="${P.champagne}"/><circle cx="560" cy="700" r="150" fill="${P.ivory}" fill-opacity="0.55"/>
  <circle cx="610" cy="760" r="330" fill="none" stroke="${P.champagne}" stroke-opacity="0.35" stroke-width="6"/>
  <path d="M0 1180 C 220 1060 420 1120 600 1060 S 900 980 984 1010 V1340 H0Z" fill="${P.espresso}" fill-opacity="0.85"/>
  <rect x="70" y="420" width="190" height="58" rx="29" fill="${P.ivory}" fill-opacity="0.92"/>
  <path d="M90 1446 c0-34 44-42 56-12 c12-30 56-22 56 12 c0 34-56 62-56 62 s-56-28-56-62z" fill="${P.cocoa}"/>
  <circle cx="290" cy="1460" r="38" fill="none" stroke="${P.espresso}" stroke-width="12"/>
  <path d="M390 1430 l90 30 -90 30 12 -30z" fill="none" stroke="${P.espresso}" stroke-width="12" stroke-linejoin="round"/>
  <path d="M870 1420 h56 v92 l-28 -22 -28 22z" fill="none" stroke="${P.espresso}" stroke-width="12" stroke-linejoin="round"/>
  <rect x="70" y="1570" width="780" height="24" rx="12" fill="${P.cocoa}"/>
  <rect x="70" y="1616" width="640" height="24" rx="12" fill="${P.cocoa}" fill-opacity="0.7"/>
  <rect x="70" y="1662" width="420" height="24" rx="12" fill="${P.cocoa}" fill-opacity="0.5"/>
  <rect x="60" y="1740" width="864" height="124" rx="62" fill="${P.espresso}"/>
  <rect x="362" y="1790" width="260" height="24" rx="12" fill="${P.champagne}"/>
  <rect x="60" y="1912" width="414" height="190" rx="36" fill="${P.champagne}"/>
  <rect x="510" y="1912" width="414" height="190" rx="36" fill="${P.champagne}"/>
  <g fill="${P.cocoa}"><rect x="104" y="2032" width="34" height="40" rx="6"/><rect x="156" y="2002" width="34" height="70" rx="6"/><rect x="208" y="1972" width="34" height="100" rx="6"/><rect x="260" y="1952" width="34" height="120" rx="6"/></g>
  <path d="M554 2060 L630 2020 L700 2040 L780 1970 L880 1956" fill="none" stroke="${P.cocoa}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/** A generic website on a laptop: a bar, a headline block, two buttons, a picture, four cards. */
const LAPTOP_UI = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 1600 1000" preserveAspectRatio="none">
  <defs>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.taupe}"/><stop offset="1" stop-color="${P.cocoa}"/></linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="${P.ivory}"/>
  <rect width="1600" height="96" fill="${P.espresso}"/>
  <rect x="64" y="30" width="36" height="36" rx="8" fill="${P.champagne}"/><rect x="116" y="38" width="120" height="20" rx="10" fill="${P.champagne}"/>
  <g fill="${P.champagne}" fill-opacity="0.7"><rect x="900" y="40" width="90" height="16" rx="8"/><rect x="1020" y="40" width="90" height="16" rx="8"/><rect x="1140" y="40" width="90" height="16" rx="8"/></g>
  <rect x="1290" y="26" width="240" height="44" rx="22" fill="${P.champagne}"/>
  <rect x="80" y="210" width="660" height="56" rx="12" fill="${P.espresso}"/>
  <rect x="80" y="290" width="580" height="56" rx="12" fill="${P.espresso}"/>
  <rect x="80" y="370" width="400" height="56" rx="12" fill="${P.cocoa}"/>
  <rect x="80" y="466" width="560" height="18" rx="9" fill="${P.taupe}"/><rect x="80" y="500" width="480" height="18" rx="9" fill="${P.taupe}"/>
  <rect x="80" y="560" width="250" height="72" rx="36" fill="${P.espresso}"/><rect x="350" y="560" width="250" height="72" rx="36" fill="none" stroke="${P.espresso}" stroke-width="6"/>
  <rect x="860" y="170" width="660" height="480" rx="28" fill="url(#m)"/>
  <circle cx="1190" cy="410" r="150" fill="${P.champagne}" fill-opacity="0.9"/><circle cx="1190" cy="410" r="200" fill="none" stroke="${P.ivory}" stroke-opacity="0.5" stroke-width="6"/>
  <g>
    <rect x="80" y="720" width="335" height="230" rx="22" fill="${P.champagne}"/><rect x="440" y="720" width="335" height="230" rx="22" fill="${P.champagne}"/>
    <rect x="800" y="720" width="335" height="230" rx="22" fill="${P.champagne}"/><rect x="1160" y="720" width="360" height="230" rx="22" fill="${P.champagne}"/>
    <g fill="${P.cocoa}"><rect x="110" y="880" width="200" height="16" rx="8"/><rect x="470" y="880" width="200" height="16" rx="8"/><rect x="830" y="880" width="200" height="16" rx="8"/><rect x="1190" y="880" width="200" height="16" rx="8"/></g>
    <g fill="${P.taupe}"><rect x="110" y="750" width="275" height="104" rx="14"/><rect x="470" y="750" width="275" height="104" rx="14"/><rect x="830" y="750" width="275" height="104" rx="14"/><rect x="1190" y="750" width="300" height="104" rx="14"/></g>
  </g>
</svg>`;

/**
 * Items. `box` crops the source at native pixels. `screen` paints the UI: a rect (phone, filled only
 * where the source is light, so the island and the bezel stay) or a quad TL, TR, BR, BL (laptop).
 * Coordinates are in the crop after it is shrunk to `width`.
 */
const ITEMS = [
  { id: "hero-obj-events", src: "unsplash:DH8AInU9iYU", box: [0, 0, 3032, 2021], width: 1600, beam: { from: [700, 633], slope: 0.28, spread: 0.3 } },
  // The lens's engraved maker names are painted out (`clean`): no brand on the site.
  { id: "hero-obj-creative", src: "unsplash:m-u31puVzMQ", box: [1050, 450, 1950, 1650], width: 1400, clean: [[1040, 340, 1270, 1090], [880, 990, 1140, 1140], [170, 470, 310, 810]] },
  { id: "hero-obj-marketing", src: "unsplash:fNsML7R50Ec", box: [1550, 250, 1450, 2600], width: 1450, screen: { ui: PHONE_UI, rect: [229, 155, 984, 2212] }, rotate: 10 },
  { id: "hero-obj-print", src: "unsplash:L99DoqmExQE", box: [2150, 600, 1600, 1750], width: 1600 },
  { id: "hero-obj-software", src: "unsplash:WPQF4r0JUcg", box: [1300, 650, 3850, 2380], width: 1600, screen: { ui: LAPTOP_UI, quad: [[792, 64], [1522, 64], [1396, 786], [676, 684]] } },
];

async function source(src) {
  const file = path.join(STOCK, `${src.replace(":", "-")}.jpg`);
  if (!existsSync(file)) {
    const out = execFileSync(process.execPath, ["--env-file=.env.local", "scripts/stock-search.mjs", `--get=${src}`, `--out=${file}`], { encoding: "utf8" });
    console.error(out.trim());
  }
  return file;
}

const raw = async (img) => {
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
};

/** Paints `ui` into the crop: inside a rect where the source is light, or inside a quad (row-wise map). */
async function paintScreen(rgba, screen) {
  const { data, w } = rgba;
  if (screen.rect) {
    const [x0, y0, sw, sh] = screen.rect;
    const ui = await raw(sharp(Buffer.from(screen.ui(sw, sh))).resize(sw, sh));
    for (let y = 0; y < sh; y++)
      for (let x = 0; x < sw; x++) {
        const i = ((y0 + y) * w + x0 + x) * 4;
        const l = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const k = Math.min(1, Math.max(0, (l - 150) / 70)); // light screen → 1, island/bezel → 0
        const j = (y * sw + x) * 4;
        for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * (1 - k) + ui.data[j + c] * k);
      }
    return;
  }
  const [tl, tr, br, bl] = screen.quad;
  const UW = 1600;
  const UH = 1000;
  const ui = await raw(sharp(Buffer.from(screen.ui(UW, UH))));
  const lerp = (a, b, t) => a + (b - a) * t;
  const yMin = Math.floor(Math.min(tl[1], tr[1]));
  const yMax = Math.ceil(Math.max(bl[1], br[1]));
  for (let y = yMin; y <= yMax; y++) {
    for (let x = Math.floor(Math.min(tl[0], bl[0])); x <= Math.ceil(Math.max(tr[0], br[0])); x++) {
      // top edge and bottom edge at this x, then left and right edges at this y
      const top = lerp(tl[1], tr[1], (x - tl[0]) / (tr[0] - tl[0]));
      const bot = lerp(bl[1], br[1], (x - bl[0]) / (br[0] - bl[0]));
      const v = (y - top) / (bot - top);
      if (v < 0 || v > 1) continue;
      const left = lerp(tl[0], bl[0], v);
      const right = lerp(tr[0], br[0], v);
      const u = (x - left) / (right - left);
      if (u < 0 || u > 1) continue;
      const i = (y * w + x) * 4;
      const j = (Math.min(UH - 1, Math.round(v * (UH - 1))) * UW + Math.min(UW - 1, Math.round(u * (UW - 1)))) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = ui.data[j + c];
    }
  }
}

/**
 * Paints out engraved lettering inside a box: a grey-level opening (min, then max, over a square
 * window) removes light marks thinner than the window and keeps broad light areas (a chrome ring,
 * the glass) as they were.
 */
function cleanText({ data, w }, [x0, y0, x1, y1]) {
  const R = 9;
  const bw = x1 - x0 + 1;
  const bh = y1 - y0 + 1;
  for (let c = 0; c < 3; c++) {
    let cur = new Float32Array(bw * bh);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) cur[y * bw + x] = data[((y0 + y) * w + x0 + x) * 4 + c];
    const pass = (src, horiz, op) => {
      const out = new Float32Array(bw * bh);
      for (let y = 0; y < bh; y++)
        for (let x = 0; x < bw; x++) {
          let v = src[y * bw + x];
          for (let k = -R; k <= R; k++) {
            const xx = horiz ? x + k : x;
            const yy = horiz ? y : y + k;
            if (xx < 0 || yy < 0 || xx >= bw || yy >= bh) continue;
            v = op(v, src[yy * bw + xx]);
          }
          out[y * bw + x] = v;
        }
      return out;
    };
    cur = pass(pass(cur, true, Math.min), false, Math.min);
    cur = pass(pass(cur, true, Math.max), false, Math.max);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) data[((y0 + y) * w + x0 + x) * 4 + c] = Math.round(cur[y * bw + x]);
  }
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const MAP = [
  [0, hex("#120c08")],
  [0.28, hex("#3d2a1c")],
  [0.5, hex(P.cocoa)],
  [0.72, hex(P.taupe)],
  [0.88, hex(P.champagne)],
  [1, hex("#fbf3e4")],
];
function mapped(l) {
  for (let k = 1; k < MAP.length; k++)
    if (l <= MAP[k][0]) {
      const [a, ca] = MAP[k - 1];
      const [b, cb] = MAP[k];
      const t = (l - a) / (b - a);
      return ca.map((v, c) => v + (cb[c] - v) * t);
    }
  return MAP.at(-1)[1];
}

/** The shared finish: lift, gradient map mixed with the source, the key light from the start side. */
function finish({ data, w, h }) {
  let x0 = w;
  let x1 = 0;
  let y0 = h;
  let y1 = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] > 24) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const i = (y * w + x) * 4;
      if (!data[i + 3]) continue;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const l0 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      // key light: upper start corner 1.22 → lower end corner 0.78
      const fx = (x - x0) / Math.max(1, x1 - x0);
      const fy = (y - y0) / Math.max(1, y1 - y0);
      const key = 1.22 - 0.3 * fx - 0.14 * fy;
      const l = Math.min(1, (0.07 + 0.93 * l0) * key);
      const m = mapped(l);
      const keep = 0.32; // share of the source colour (warmed) kept over the map
      const src = [r * 1.04 + 0.02, g * 0.97 + 0.01, b * 0.82].map((v) => v * 255 * key);
      for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round(m[c] * (1 - keep) + src[c] * keep)));
    }
  return { x0, x1, y0, y1 };
}

async function build(item) {
  const file = await source(item.src);
  const [left, top, width, height] = item.box;
  let img = sharp(file).rotate().extract({ left, top, width, height }).resize({ width: item.width });
  const rgba = await raw(img);
  if (item.screen) await paintScreen(rgba, item.screen);
  // The cutout is taken from the untouched picture (a clean-up box must not change the silhouette);
  // the cleaned colour is laid under that alpha afterwards.
  const cleaned = { ...rgba, data: Buffer.from(rgba.data) };
  for (const r of item.clean ?? []) cleanText(cleaned, r);
  const tmpIn = path.join(WORK, `${item.id}-in.png`);
  const tmpOut = path.join(WORK, `${item.id}-cut.png`);
  await sharp(rgba.data, { raw: { width: rgba.w, height: rgba.h, channels: 4 } }).png().toFile(tmpIn);
  if (!existsSync(tmpOut) || process.argv.includes("--recut")) execFileSync("python", ["scripts/lib/rembg-cut.py", tmpIn, tmpOut], { stdio: "inherit" });

  const cutRaw = await raw(sharp(readFileSync(tmpOut)));
  for (let i = 0; i < cutRaw.data.length; i += 4) for (let c = 0; c < 3; c++) cutRaw.data[i + c] = cleaned.data[i + c];
  let cut = sharp(cutRaw.data, { raw: { width: cutRaw.w, height: cutRaw.h, channels: 4 } });
  if (item.rotate) cut = cut.rotate(item.rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  const obj = await raw(cut);
  const bb = finish(obj);
  const ow = bb.x1 - bb.x0 + 1;
  const oh = bb.y1 - bb.y0 + 1;
  const objBuf = await sharp(obj.data, { raw: { width: obj.w, height: obj.h, channels: 4 } })
    .extract({ left: bb.x0, top: bb.y0, width: ow, height: oh })
    .png()
    .toBuffer();

  // Canvas: room for the shadow below and, for the spotlight, the beam to the start side.
  const pad = Math.round(Math.max(ow, oh) * 0.08);
  const beamRoom = item.beam ? Math.round(ow * 0.55) : 0;
  const cw = ow + pad * 2 + beamRoom;
  const ch = oh + pad * 2;
  const ox = pad + beamRoom;
  const oy = pad;

  // Contact shadow: the object's alpha at half strength, blurred, offset down and to the end side.
  const alpha = await sharp(objBuf).extractChannel(3).linear(0.5, 0).toBuffer();
  const shadow = await sharp({ create: { width: ow, height: oh, channels: 3, background: "#0b0705" } }).joinChannel(alpha).png().toBuffer();
  const shadowSoft = await sharp(shadow)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .blur(Math.max(4, pad * 0.45))
    .png()
    .toBuffer();

  const layers = [{ input: shadowSoft, left: ox - pad + Math.round(pad * 0.35), top: oy - pad + Math.round(pad * 0.6) }];
  if (item.beam) {
    // The beam: a soft cone from the lens towards the start side, in champagne light.
    const fx = item.beam.from[0] - bb.x0 + ox;
    const fy = item.beam.from[1] - bb.y0 + oy;
    const tx = Math.round(cw * 0.03);
    const ty = fy + (fx - tx) * item.beam.slope;
    const dx = tx - fx;
    const dy = ty - fy;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;
    const half = len * item.beam.spread;
    const pts = [
      [fx + nx * 70, fy + ny * 70],
      [tx + nx * half, ty + ny * half],
      [tx - nx * half, ty - ny * half],
      [fx - nx * 70, fy - ny * 70],
    ];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}"><defs>
      <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}">
        <stop offset="0" stop-color="${P.champagne}" stop-opacity="0.55"/><stop offset="0.45" stop-color="${P.champagne}" stop-opacity="0.18"/><stop offset="1" stop-color="${P.champagne}" stop-opacity="0"/>
      </linearGradient><filter id="f"><feGaussianBlur stdDeviation="${Math.round(len * 0.03)}"/></filter></defs>
      <polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="url(#b)" filter="url(#f)"/></svg>`;
    layers.push({ input: Buffer.from(svg), left: 0, top: 0 });
  }
  layers.push({ input: objBuf, left: ox, top: oy });

  const out = `public/images/stock/${item.id}.webp`;
  const canvas = await sharp({ create: { width: cw, height: ch, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(layers)
    .png()
    .toBuffer();
  const info = await sharp(canvas)
    .resize({ width: 720, height: 720, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(out);
  console.log(`${item.id}: /${out.replace(/^public\//, "")} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}

for (const item of ITEMS) if (!only || item.id === only) await build(item);
