#!/usr/bin/env node
/**
 * A scroll sequence as one contact sheet: viewport frames with motion on, side by side.
 *   node scripts/frames.mjs <out.jpg> --url=http://localhost:3100/en/about [--width=1440] [--height=900]
 *     [--sel=#work-strip] [--from=0] [--to=1] [--n=5] [--scale=0.4]
 * Without --sel the frames run from --from to --to as fractions of the page's scroll range. With
 * --sel they run across that element: 0 = its top at the viewport's top, 1 = its bottom there
 * (so a pinned scene plays through). A width below 900 is a touch context at 2x.
 * Uses the installed Chrome (channel: "chrome").
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const args = process.argv.slice(2);
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const out = args.find((a) => !a.startsWith("--"));
const url = opt("url");
if (!out || !url) throw new Error("usage: node scripts/frames.mjs <out.jpg> --url=… [--sel=…] [--from=0] [--to=1] [--n=5]");
const width = Number(opt("width", "1440"));
const height = Number(opt("height", width < 900 ? "844" : "900"));
const n = Number(opt("n", "5"));
const from = Number(opt("from", "0"));
const to = Number(opt("to", "1"));
const scale = Number(opt("scale", width < 900 ? "0.5" : "0.4"));
const sel = opt("sel");
const mobile = width < 900;

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
// Walk down once so lazy images load and every trigger has measured.
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total; y += Math.round(height * 0.8)) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);

const range = await page.evaluate((sel) => {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (!sel) return [0, max];
  const el = document.querySelector(sel);
  if (!el) throw new Error(`no element for ${sel}`);
  // A pinned scene's spacer is its parent: measure the outermost box that starts at the same place.
  const r = el.getBoundingClientRect();
  return [Math.max(0, r.top + scrollY), Math.min(max, r.bottom + scrollY)];
}, sel);

const tiles = [];
for (let i = 0; i < n; i++) {
  const f = n === 1 ? from : from + ((to - from) * i) / (n - 1);
  const y = Math.round(range[0] + (range[1] - range[0]) * f);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(900); // Lenis and the scrubs settle
  tiles.push(await page.screenshot({ type: "png" }));
}
await browser.close();

const w = Math.round(width * scale);
const h = Math.round(height * scale);
const gap = 8;
const small = await Promise.all(tiles.map((t) => sharp(t).resize(w, h).toBuffer()));
await mkdir(path.dirname(out), { recursive: true });
await sharp({ create: { width: n * w + (n - 1) * gap, height: h, channels: 3, background: "#777" } })
  .composite(small.map((input, i) => ({ input, left: i * (w + gap), top: 0 })))
  .jpeg({ quality: 82 })
  .toFile(out);
console.log(out, `${n} frames`, range, errors.length ? errors : "no page errors");
