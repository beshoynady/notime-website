import { expect, test, type Locator } from "@playwright/test";
import { gotoReady } from "./helpers";

/** The decoded `src` of each image a locator matches. */
const srcs = (imgs: Locator) => imgs.evaluateAll((els) => els.map((i) => decodeURIComponent(i.getAttribute("src") ?? "")));

/**
 * Home (visual portfolio, Task C4): the «Five crafts» cards and «Real projects» show photographs.
 * Real projects use each case's own photo, never a drawing (CaseVisual) or a stand-in (D106, D150).
 */
for (const locale of ["en", "ar"] as const) {
  test(`${locale}: the crafts cards and real projects are photographs`, async ({ page }) => {
    await gotoReady(page, `/${locale}`);
    const cards = page.locator(".cats .cat .cat-media img");
    await expect(cards).toHaveCount(5);
    const cardSrcs = await srcs(cards);
    for (const file of ["private-celebrations-2", "catering-4", "uae-pro-league-3", "gifts-1"])
      expect(cardSrcs.some((s) => s.includes(`${file}.webp`)), file).toBe(true);

    await expect(page.locator("#work .case-visual")).toHaveCount(0);
    const work = page.locator("#work .work-media img");
    await expect(work).toHaveCount(2);
    const workSrcs = await srcs(work);
    for (const file of ["egyptair-pavilion-1", "uae-pro-league-2"]) expect(workSrcs.some((s) => s.includes(`${file}.webp`)), file).toBe(true);
    // Every photo loads (no broken box).
    for (const img of await page.locator(".cats img, #work .work-media img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    // The photos fill their boxes: the duotone wrapper once collapsed to 0px (an unlayered
    // `position: relative` beat `absolute`).
    for (const media of await page.locator("#work .work-media").all()) {
      const [box, img] = await Promise.all([media.boundingBox(), media.locator("img").boundingBox()]);
      expect(box!.height).toBeGreaterThan(100);
      expect(img!.height).toBeGreaterThanOrEqual(box!.height - 1);
    }
  });
}
