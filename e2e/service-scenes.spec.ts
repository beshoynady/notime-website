import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Events I–III (D153): each section tells its story in photographs (a scene that plays as it
 * passes, never pinned) instead of a drawn module, and Rand's own work follows as a strip that
 * starts at the inline-start in both directions.
 */
const SECTIONS = ["conferences", "exhibitions", "launches"] as const;

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: Events I–III are photo scenes with no module`, async ({ page }) => {
    await gotoReady(page, `/${locale}/services/events-hospitality`);
    for (const id of SECTIONS) {
      const section = page.locator(`section#${id}`);
      await expect(section.locator(".scene"), id).toHaveCount(1);
      await expect(section.locator("[data-module]"), id).toHaveCount(0);
      await expect(section.locator(".scene"), id).not.toHaveAttribute("data-mode", /.+/);
      await expect(section.locator(".pin-spacer"), id).toHaveCount(0);
    }
  });

  test(`${locale}: the work strip starts at the inline-start, and every tile has its picture`, async ({ page }) => {
    await gotoReady(page, `/${locale}/services/events-hospitality`);
    const strip = page.locator("section#exhibitions .svc-gallery");
    await strip.scrollIntoViewIfNeeded();
    const tiles = strip.locator("img");
    expect(await tiles.count()).toBeGreaterThanOrEqual(2);
    const [box, first] = await Promise.all([strip.boundingBox(), tiles.first().boundingBox()]);
    if (locale === "en") expect(Math.abs(first!.x - box!.x)).toBeLessThanOrEqual(1);
    else expect(Math.abs(first!.x + first!.width - (box!.x + box!.width))).toBeLessThanOrEqual(1);
    for (const img of await tiles.all()) {
      expect(await img.getAttribute("src")).toBeTruthy();
      expect((await img.boundingBox())!.width).toBeGreaterThan(40);
    }
  });
}
