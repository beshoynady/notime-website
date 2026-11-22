#!/usr/bin/env node
/**
 * Section screenshots, one WebP per section, for inventories and before/after reports.
 *   node scripts/section-shots.mjs <out-dir> [--base=http://localhost:3100] [--width=1440] [--locale=en] [--motion]
 * Default: reduced motion (every scene shows its end frame, the state a reviewer judges), so the
 * shot is stable. Each section is clipped to its first 1600 px and scaled to 720 px wide.
 * Uses the installed Chrome (channel: "chrome"), one page at a time.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith("--")) ?? "docs/review/graphics-inventory";
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const base = opt("base", "http://localhost:3100").replace(/\/$/, "");
const width = Number(opt("width", "1440"));
const locale = opt("locale", "en");
const motion = args.includes("--motion");
const mobile = width < 900;

/** page path (after the locale) → [file name, selector] */
export const TARGETS = {
  "": [
    ["home-hero", "#hero"],
    ["home-strip", "#home-strip"],
    ["home-about", "#about"],
    ["home-services", "#services"],
    ["home-work", "#work"],
    ["home-digital", "#digital"],
    ["home-process", "#how-we-work"],
    ["home-markets", "#markets"],
  ],
  "/services/events-hospitality": [
    ["events-opening", '[data-scene="events-opening"]'],
    ["events-conferences", "#conferences"],
    ["events-exhibitions", "#exhibitions"],
    ["events-launches", "#launches"],
    ["events-celebrations", "#celebrations"],
    ["events-hospitality", "#hospitality"],
    ["events-stage", "#stage"],
  ],
  "/services/creative-production": [
    ["creative-opening", '[data-scene="studio-opening"]'],
    ["creative-photography", "#photography"],
    ["creative-video", "#video"],
    ["creative-motion", "#motion"],
    ["creative-ai-content", "#ai-content"],
    ["creative-set-design", "#set-design"],
    ["creative-rental", "#rental"],
  ],
  "/services/marketing-brand": [
    ["marketing-opening", '[data-scene="editorial-opening"]'],
    ["marketing-branding", "#branding"],
    ["marketing-social", "#social"],
    ["marketing-digital", "#digital-marketing"],
    ["marketing-content", "#content-strategy"],
    ["marketing-pr", "#pr"],
    ["marketing-paid", "#paid-media"],
  ],
  "/services/production-print-gifts": [
    ["print-opening", '[data-scene="workshop-opening"]'],
    ["print-printing", "#printing"],
    ["print-fabrication", "#fabrication"],
    ["print-packaging", "#packaging"],
    ["print-gifts", "#gifts"],
    ["print-ordering", "#print-ordering"],
    ["print-merchandise", "#merchandise"],
  ],
  "/services/software-digital": [
    ["software-hero", "#page-stage > *:first-child"],
    ["software-proof", "#proof"],
    ["software-problems", "#problems"],
    ["software-services", "#services"],
    ["software-process", "#how-we-work"],
    ["software-products", "#products"],
    ["software-quality", "#quality"],
    ["software-tiers", ".sw-tiers"],
    ["software-ways", ".sw-ways"],
    ["software-consult", ".sw-consult, .sw-review"],
  ],
  "/about": [
    ["about-top", "#page-stage > *:first-child"],
    ["about-room", "#ab-room"],
  ],
  "/work": [["work-index", "#page-stage"]],
  "/work/airline-exhibition-pavilion": [["work-case", "#page-stage"]],
  "/products/minute-zero": [["product-minute-zero", "#page-stage"]],
};

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width, height: mobile ? 844 : 900 },
  deviceScaleFactor: 1,
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: motion ? "no-preference" : "reduce",
});
const page = await context.newPage();
const only = opt("only", "");
let n = 0;
for (const [route, targets] of Object.entries(TARGETS)) {
  if (only && !route.includes(only)) continue;
  await page.goto(`${base}/${locale}${route}`, { waitUntil: "networkidle" });
  // Bring lazy media in: walk the page once, then back to the top.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  for (const [name, selector] of targets) {
    const el = page.locator(selector).first();
    if (!(await el.count())) {
      console.warn(`missing ${route} ${selector}`);
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const box = await page.evaluate((sel) => {
      const r = document.querySelector(sel).getBoundingClientRect();
      return { x: 0, y: r.top + scrollY, width: innerWidth, height: Math.min(r.height, 1600) };
    }, selector);
    if (box.height < 4) continue;
    const png = await page.screenshot({ clip: box, fullPage: true });
    const file = path.join(out, `${name}-${locale}-${width}.webp`);
    await sharp(png).resize({ width: Math.min(720, width) }).webp({ quality: 62 }).toFile(file);
    n++;
  }
}
await browser.close();
console.log(`${n} shots → ${out}`);
