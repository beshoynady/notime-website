import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Production, Print & Gifts in photographs (D160; docs/content/visual-stories.md): the opening plays
 * the materials → the press → the gold skyline gift on a laptop; every section but ordering shows a
 * photograph, never a drawing or the human-scale module; ordering keeps its module; Fabrication
 * carries a strip of two stands NO TIME built.
 */
const SECTIONS = ["printing", "fabrication", "packaging", "gifts", "merchandise"];

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: Print sections are photographs`, async ({ page }) => {
    await gotoReady(page, `/${locale}/services/production-print-gifts`);
    await expect(page.locator(".svc-visual[data-visual='drawing']")).toHaveCount(0);
    await expect(page.locator("[data-module='human-scale']")).toHaveCount(0);
    await expect(page.locator("[data-module='print-order']")).toHaveCount(1);
    for (const id of SECTIONS) {
      const img = page.locator(`#${id} .svc-visual[data-visual='photo'] img`);
      await expect(img, id).toHaveCount(1);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth), { message: id }).toBeGreaterThan(0);
    }
    await expect(page.locator("#fabrication .svc-gallery li")).toHaveCount(2);
  });

  test(`${locale}: the opening's frame is its own still (D169)`, async ({ page, isMobile }) => {
    test.skip(isMobile, "the frame is laptop-only, as in Events");
    await gotoReady(page, `/${locale}/services/production-print-gifts`);
    const src = await page.locator(".cat-opening [data-layer='gift'] img").getAttribute("src");
    expect(decodeURIComponent(src ?? "")).toContain("pg-frame.webp");
  });
}
