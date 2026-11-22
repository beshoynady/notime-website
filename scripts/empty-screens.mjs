/**
 * Empty-screen survey (W02, the owner 2026-11-20: "no empty screen at any scroll moment, at any
 * size, with motion or reduced motion"). Scrolls each page in steps of 0.5 of the screen, takes a
 * shot of every stop with the fixed chrome hidden (header, quote bar, WhatsApp, services rail),
 * and finds the tallest horizontal band with no detail: a row has detail when at least 3 of its
 * pixels differ from their neighbour by more than 14 grey levels (dim text still counts). Smooth light leaks and flat
 * grounds have none; text, photos, drawings and rules do.
 *
 *   node scripts/empty-screens.mjs <base> [--sizes=1440x900,390x844] [--paths=/en,/ar]
 *     [--reduced] [--max=0.45] [--shots=<dir>] [--css=<file>] (extra CSS, for trying a fix)
 *
 * Prints every stop whose empty band is over --max of the screen (below the header), and saves
 * its shot to --shots when given. Exit 1 if any.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const args = Object.fromEntries(process.argv.slice(3).map((a) => a.replace(/^--/, "").split("=")).map(([k, v]) => [k, v ?? true]));
const base = process.argv[2];
const SIZES = (args.sizes ?? "1440x900,1366x768,1280x720,1024x768,390x844,375x667,360x740").split(",").map((s) => s.split("x").map(Number));
const PATHS = (
  args.paths ??
  [
    "/en",
    "/en/services",
    "/en/services/events-hospitality",
    "/en/services/marketing-brand",
    "/en/services/creative-production",
    "/en/services/production-print-gifts",
    "/en/services/software-digital",
    "/en/work",
    "/en/work/airline-exhibition-pavilion",
    "/en/work/football-league-events-awards",
    "/en/about",
    "/en/work/rooms-we-dressed",
    "/en/products/minute-zero",
    "/en/products/peak-hour",
    "/en/contact",
    "/en/privacy",
    "/en/no-such-page",
  ].join(",")
).split(",");
const MAX = Number(args.max ?? 0.45);
const HIDE = "#site-header, .cta-bar, .wa-fab, nav.svc-index, [data-review-ui] { visibility: hidden !important; }";

/** The tallest run of rows without detail, between `top` and `bottom` (CSS px; the shot is at 1x). */
async function emptyBand(png, top, bottom) {
  const { data, info } = await sharp(png).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width } = info;
  let run = 0;
  let best = { size: 0, from: top };
  for (let y = top; y < bottom; y++) {
    let edges = 0;
    const row = y * width;
    for (let x = 0; x < width - 1 && edges < 3; x++) if (Math.abs(data[row + x + 1] - data[row + x]) > 14) edges++;
    if (edges >= 3) run = 0;
    else if (++run > best.size) best = { size: run, from: y - run + 1 };
  }
  return best;
}

const browser = await chromium.launch({ channel: process.env.CI ? undefined : "chrome" });
const found = [];
for (const [width, height] of SIZES) {
  const mobile = width < 900;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: args.reduced ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  for (const p of PATHS) {
    await page.goto(base + p);
    await page.locator("#page-stage[data-tone-ready]").first().waitFor({ state: "attached", timeout: 30000 }).catch(() => {});
    await page.addStyleTag({ content: HIDE });
    if (args.css) await page.addStyleTag({ path: args.css });
    await page.evaluate(() => document.fonts.ready);
    const headerH = await page.evaluate(() => document.getElementById("site-header")?.getBoundingClientRect().height ?? 0);
    let y = 0;
    for (;;) {
      await page.evaluate((to) => window.scrollTo(0, to), y);
      await page.waitForTimeout(args.reduced ? 250 : 1500); // scrub: 1 catches up in about a second
      const { max, bar } = await page.evaluate(() => ({
        max: document.documentElement.scrollHeight - innerHeight,
        bar: (() => {
          const b = document.querySelector(".cta-bar[data-show]");
          return b ? b.getBoundingClientRect().height : 0;
        })(),
      }));
      const top = Math.round(headerH);
      const bottom = height - Math.round(bar);
      const png = await page.screenshot();
      const band = await emptyBand(png, top, bottom);
      const share = band.size / (bottom - top);
      if (share > MAX) {
        const row = { size: `${width}x${height}`, path: p, scroll: y, of: max, empty: band.size, at: band.from, share: Math.round(share * 100) };
        found.push(row);
        console.log(JSON.stringify(row));
        if (args.shots) {
          mkdirSync(args.shots, { recursive: true });
          await sharp(png).webp({ quality: 60 }).toFile(path.join(args.shots, `${p.replaceAll("/", "_")}-${width}x${height}-${y}${args.reduced ? "-reduced" : ""}.webp`));
        }
      }
      if (y >= max) break;
      y = Math.min(max, y + Math.round(height / 2));
    }
  }
  await context.close();
}
await browser.close();
console.log(`${found.length} empty stops (over ${Math.round(MAX * 100)}% of the screen)`);
process.exit(found.length ? 1 : 0);
