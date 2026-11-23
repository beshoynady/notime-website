#!/usr/bin/env node
/**
 * README screenshots (docs/readme/): Home, Events and Work at 1440 and 390, English and Arabic, as
 * WebP under 300 KB; Home framed on a laptop (also the GitHub social preview); a short GIF of the
 * Events opening's layers moving with the scroll.
 *   npm run build && npm start   (then, in another shell)
 *   node scripts/readme-shots.mjs [--base=http://localhost:3000] [--only=gif|laptop]
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const BASE = process.argv.find((a) => a.startsWith("--base="))?.slice(7) ?? "http://localhost:3000";
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const OUT = "docs/readme";
mkdirSync(OUT, { recursive: true });

const PAGES = { home: "", events: "/services/events-hospitality", work: "/work" };
const SIZES = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

async function open(browser, size, path, reducedMotion = "no-preference") {
  const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1, reducedMotion, isMobile: size.width < 900, hasTouch: size.width < 900 });
  await page.goto(BASE + path);
  await page.locator("#page-stage[data-tone-ready]").first().waitFor({ state: "attached" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3500); // the hero's entrance and the font swap
  return page;
}

/** WebP at the highest quality that stays under 300 KB. */
async function webp(png, file) {
  for (const quality of [82, 74, 66, 58, 50]) {
    const buf = await sharp(png).webp({ quality, effort: 6 }).toBuffer();
    if (buf.length < 300 * 1024 || quality === 50) {
      await sharp(buf).toFile(file);
      return Math.round(buf.length / 1024);
    }
  }
}

const browser = await chromium.launch({ channel: process.env.CI ? undefined : "chrome" }); // locally: the installed Chrome (D12)
let home1440;
for (const locale of ONLY ? [] : ["en", "ar"]) {
  for (const [name, path] of Object.entries(PAGES)) {
    for (const [sizeName, size] of Object.entries(SIZES)) {
      const page = await open(browser, size, `/${locale}${path}`);
      const png = await page.screenshot();
      if (locale === "en" && name === "home" && sizeName === "desktop") home1440 = png;
      const kb = await webp(png, `${OUT}/${name}-${size.width}-${locale}.webp`);
      console.log(`${name}-${size.width}-${locale}.webp ${kb} KB`);
      await page.close();
    }
  }
}

// Home on a laptop: the screen in a dark bezel over a thin base, on the site's espresso ground.
const laptop = async (w, h, file, format) => {
  const screenW = Math.round(w * 0.72);
  const screenH = Math.round((screenW * 900) / 1440);
  const bezel = Math.round(screenW * 0.025);
  const bodyW = screenW + bezel * 2;
  const bodyH = screenH + bezel * 2;
  const left = Math.round((w - bodyW) / 2);
  const top = Math.round((h - bodyH - h * 0.06) / 2);
  const baseW = Math.round(bodyW * 1.16);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="#2E2017"/>
    <rect x="${left}" y="${top}" width="${bodyW}" height="${bodyH}" rx="${bezel}" fill="#0d0a08" stroke="#634731" stroke-width="2"/>
    <rect x="${Math.round((w - baseW) / 2)}" y="${top + bodyH}" width="${baseW}" height="${Math.round(h * 0.022)}" rx="${Math.round(h * 0.011)}" fill="#BB9A79"/>
  </svg>`;
  const screen = await sharp(home1440 ?? `${OUT}/home-1440-en.webp`).resize(screenW, screenH).toBuffer();
  const img = sharp(Buffer.from(svg)).composite([{ input: screen, left: left + bezel, top: top + bezel }]);
  await (format === "jpg" ? img.jpeg({ quality: 86, mozjpeg: true }) : img.webp({ quality: 82 })).toFile(file);
  console.log(file);
};
if (ONLY !== "gif") {
  await laptop(1600, 1000, `${OUT}/hero-laptop.webp`, "webp");
  await laptop(1280, 640, `${OUT}/social-preview.jpg`, "jpg"); // GitHub takes PNG or JPG under 1 MB
}

if (!ONLY || ONLY === "gif") {
// Events opening: the layers moving with the scroll (about 7 s at 7 fps, small enough for a README).
{
  const page = await open(browser, SIZES.desktop, "/en/services/events-hospitality");
  const end = await page.evaluate(() => {
    const first = document.querySelector("main section");
    return Math.round((first?.getBoundingClientRect().bottom ?? innerHeight * 3) + scrollY - innerHeight);
  });
  const frames = [];
  const n = 42;
  for (let i = 0; i < n; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((end * i) / (n - 1)));
    await page.waitForTimeout(140);
    frames.push(await sharp(await page.screenshot()).resize(560).png().toBuffer());
  }
  await page.waitForTimeout(1200);
  const last = await sharp(await page.screenshot()).resize(560).png().toBuffer();
  for (let i = 0; i < 6; i++) frames.push(last); // a short hold before the loop
  await sharp(frames, { join: { animated: true } })
    .gif({ delay: frames.map(() => 150), loop: 0, effort: 10, colours: 64, dither: 0.4, interFrameMaxError: 8 })
    .toFile(`${OUT}/events-layers.gif`);
  console.log(`${OUT}/events-layers.gif, ${frames.length} frames, scroll 0 → ${end}`);
  await page.close();
}
}
await browser.close();
