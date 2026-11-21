import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Home (visual portfolio, Task C4): the «Five crafts» cards and «Real projects» show photographs.
 * Real projects use each case's own photo, never a drawing (CaseVisual) or a stand-in (D106, D150).
 */
for (const locale of ["en", "ar"] as const) {
  test(`${locale}: the crafts cards and real projects are photographs`, async ({ page }) => {
    await gotoReady(page, `/${locale}`);
    const cards = page.locator(".cats .cat .cat-media img");
    await expect(cards).toHaveCount(5);
    const cardSrcs = (await cards.evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).getAttribute("src") ?? ""))).map(decodeURIComponent);
    for (const file of ["private-celebrations-2", "catering-4", "uae-pro-league-3", "gifts-1"])
      expect(cardSrcs.some((s) => s.includes(`${file}.webp`)), file).toBe(true);

    await expect(page.locator("#work .case-visual")).toHaveCount(0);
    const work = page.locator("#work .work-media img");
    await expect(work).toHaveCount(2);
    const workSrcs = (await work.evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).getAttribute("src") ?? ""))).map(decodeURIComponent);
    expect(workSrcs.some((s) => s.includes("egyptair-pavilion-1.webp"))).toBe(true);
    expect(workSrcs.some((s) => s.includes("uae-pro-league-2.webp"))).toBe(true);
    // Every photo loads (no broken box).
    for (const img of await page.locator(".cats img, #work .work-media img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
  });
}

/** The duotone wrapper once collapsed to 0px (an unlayered `position: relative` beat `absolute`). */
test("the real-projects photos fill their boxes", async ({ page }) => {
  await gotoReady(page, "/en");
  for (const media of await page.locator("#work .work-media").all()) {
    await media.scrollIntoViewIfNeeded();
    const [box, img] = await Promise.all([media.boundingBox(), media.locator("img").boundingBox()]);
    expect(box!.height).toBeGreaterThan(100);
    expect(img!.height).toBeGreaterThanOrEqual(box!.height - 1);
  }
});
