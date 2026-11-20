import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Labels inside the category modules don't collide (self-audit 2026-11-20):
 * B07 · Print · human scale: the figure's «1.8 m» label reached into the lens beside it on a phone.
 * B08 · Creative · motion playground: the play button put its mark above «PLAY».
 */
async function reach(page: Page, selector: string) {
  // Modules load as the page nears them: walk down until it's there.
  const el = page.locator(selector).first();
  for (let y = 0; y < 40_000 && !(await el.count()); y += 700) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  return el;
}

for (const locale of ["en", "ar"] as const) {
  test(`${locale} · Print: the figure's label clears the lens`, async ({ page }) => {
    await gotoReady(page, `/${locale}/services/production-print-gifts`);
    await reach(page, ".hs-stage .hs-lens");
    const gap = await page.evaluate(() => {
      const label = document.querySelector(".hs-fig-label > span")!.getBoundingClientRect();
      const lens = document.querySelector(".hs-stage .hs-lens")!.getBoundingClientRect();
      const ys = label.bottom > lens.top && label.top < lens.bottom;
      // Horizontal clearance where the two share rows (negative = overlap).
      return ys ? Math.max(lens.left - label.right, label.left - lens.right) : Infinity;
    });
    expect(gap).toBeGreaterThanOrEqual(0);
  });

  test(`${locale} · Creative: the play button keeps its mark and word on one line`, async ({ page, isMobile }) => {
    test.skip(isMobile, "the playground's controls are checked at desktop width");
    await gotoReady(page, `/${locale}/services/creative-production`);
    const btn = await reach(page, ".mp-play");
    const lines = await btn.evaluate((b) => {
      const icon = b.querySelector("svg")!.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(b);
      const text = [...range.getClientRects()].filter((r) => r.width > 0);
      // The mark and the word share a row: their vertical centres sit within a few pixels.
      const word = text[text.length - 1];
      return Math.abs(icon.top + icon.height / 2 - (word.top + word.height / 2));
    });
    expect(lines).toBeLessThanOrEqual(4);
  });
}
