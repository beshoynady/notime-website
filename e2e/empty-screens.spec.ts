import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { gotoReady } from "./helpers";

/**
 * W02 (the owner, 2026-11-20): "no empty screen at any scroll moment, at any size, with motion or
 * reduced motion". Each page is scrolled in steps of half a screen; at every stop, with the fixed
 * chrome hidden (header, quote bar, WhatsApp, services rail), at least half of the screen below
 * the header holds content. Content is detail: a pixel row has it when at least 3 of its pixels
 * differ from their neighbour by more than 14 grey levels, which text, photos, drawings and rules
 * have, and smooth light leaks and flat grounds don't. All seven sizes: scripts/empty-screens.mjs.
 */
const PAGES = [
  "/en",
  "/ar",
  "/en/services",
  "/en/services/events-hospitality",
  "/ar/services/creative-production",
  "/en/services/marketing-brand",
  "/ar/services/production-print-gifts",
  "/ar/services/software-digital",
  "/en/work",
  "/en/about",
  "/ar/contact",
];
const MAX_EMPTY = 0.5;
const HIDE = "#site-header, .cta-bar, .wa-fab, nav.svc-index, [data-review-ui] { visibility: hidden !important; }";

/** The tallest run of pixel rows without detail between `top` and `bottom` (the shot is at 1x). */
async function emptyBand(png: Buffer, top: number, bottom: number) {
  const { data, info } = await sharp(png).greyscale().raw().toBuffer({ resolveWithObject: true });
  let run = 0;
  let best = 0;
  for (let y = top; y < bottom; y++) {
    let edges = 0;
    const row = y * info.width;
    for (let x = 0; x < info.width - 1 && edges < 3; x++) if (Math.abs(data[row + x + 1] - data[row + x]) > 14) edges++;
    run = edges >= 3 ? 0 : run + 1;
    best = Math.max(best, run);
  }
  return best;
}

for (const reduced of [false, true]) {
  test.describe(reduced ? "reduced motion" : "motion", () => {
    test.use({ deviceScaleFactor: 1, reducedMotion: reduced ? "reduce" : "no-preference" });
    for (const path of PAGES) {
      test(`${path}: every screen is at least half content`, async ({ page }) => {
        test.setTimeout(10 * 60_000);
        await gotoReady(page, path);
        await page.addStyleTag({ content: HIDE });
        await page.evaluate(() => document.fonts.ready);
        const { headerH, height } = await page.evaluate(() => ({
          headerH: Math.round(document.getElementById("site-header")?.getBoundingClientRect().height ?? 0),
          height: innerHeight,
        }));
        const empty: string[] = [];
        for (let y = 0; ; ) {
          await page.evaluate((to) => window.scrollTo(0, to), y);
          await page.waitForTimeout(reduced ? 250 : 1500); // scrub: 1 catches up in about a second
          const { max, bar } = await page.evaluate(() => ({
            max: document.documentElement.scrollHeight - innerHeight,
            bar: Math.round(document.querySelector(".cta-bar[data-show]")?.getBoundingClientRect().height ?? 0),
          }));
          const band = await emptyBand(await page.screenshot(), headerH, height - bar);
          const share = band / (height - bar - headerH);
          if (share > MAX_EMPTY) empty.push(`scroll ${y}: ${band}px empty (${Math.round(share * 100)}%)`);
          if (y >= max) break;
          y = Math.min(max, y + Math.round(height / 2));
        }
        expect(empty, empty.join("\n")).toEqual([]);
      });
    }
  });
}
