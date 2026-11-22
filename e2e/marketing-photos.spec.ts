import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Marketing & Brand in photographs (D159; docs/content/visual-stories.md): the opening plays the
 * blank page → the desk → the league's post on a laptop; every section shows a photograph, never a
 * drawing or a module; Social shows the league's feed whole.
 */
const SECTIONS = ["branding", "social", "digital-marketing", "content-strategy", "pr", "paid-media"];

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: Marketing sections are photographs`, async ({ page }) => {
    await gotoReady(page, `/${locale}/services/marketing-brand`);
    await expect(page.locator(".svc-visual[data-visual='drawing']")).toHaveCount(0);
    await expect(page.locator("[data-module='content-calendar'], [data-module='press-release']")).toHaveCount(0);
    for (const id of SECTIONS) {
      const img = page.locator(`#${id} .svc-visual[data-visual='photo'] img`);
      await expect(img, id).toHaveCount(1);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth), { message: id }).toBeGreaterThan(0);
    }
    // The league's feed is the section's own picture, whole (a square, not cropped to 16:9).
    const box = await page.locator("#social .svc-visual").boundingBox();
    expect(Math.abs(box!.width / box!.height - 680 / 685)).toBeLessThan(0.02);
  });

  test(`${locale}: the opening's frame is the league's real post`, async ({ page, isMobile }) => {
    test.skip(isMobile, "the frame is laptop-only, as in Events");
    await gotoReady(page, `/${locale}/services/marketing-brand`);
    const src = await page.locator(".cat-opening [data-layer='post'] img").getAttribute("src");
    expect(decodeURIComponent(src ?? "")).toContain("uae-pro-league-4.webp");
  });
}
