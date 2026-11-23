import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Creative Production in photographs (D158; docs/content/visual-stories.md): the opening plays the
 * studio dark → lit → Rand's frame on a laptop; Video, Motion, AI and Rental show a photograph,
 * never a drawing or a module; Photography and Set & stage carry a strip of Rand's work.
 */
for (const locale of ["en", "ar"] as const) {
  test(`${locale}: Creative sections are photographs`, async ({ page }) => {
    await gotoReady(page, `/${locale}/services/creative-production`);
    await expect(page.locator(".svc-visual[data-visual='drawing']")).toHaveCount(0);
    await expect(page.locator("[data-module='motion-playground'], [data-module='rental-categories']")).toHaveCount(0);
    for (const id of ["video", "motion", "ai-content", "rental"]) {
      const img = page.locator(`#${id} .svc-visual[data-visual='photo'] img`);
      await expect(img, id).toHaveCount(1);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth), { message: id }).toBeGreaterThan(0);
    }
    // D169: set design's gallery hides until Rand's photos arrive (its photos show elsewhere).
    await expect(page.locator("#photography .svc-gallery li")).toHaveCount(2);
    await expect(page.locator("#set-design .svc-gallery")).toHaveCount(0);
  });

  test(`${locale}: the opening's frame is its own still (D169)`, async ({ page, isMobile }) => {
    test.skip(isMobile, "the frame is laptop-only, as in Events");
    await gotoReady(page, `/${locale}/services/creative-production`);
    const src = await page.locator(".cat-opening [data-layer='frame'] img").getAttribute("src");
    expect(decodeURIComponent(src ?? "")).toContain("cp-frame.webp");
  });
}
