import { expect, test } from "@playwright/test";
import { expectLanded, gotoReady } from "./helpers";

/**
 * The Events sections (D153): each tells its story in photographs instead of a drawn module. I–IV
 * play as they pass, never pinned; the majlis (V) and the stage (VI) pin from 1024px. Rand's own
 * work follows as a strip that starts at the inline-start in both directions, and a deep link
 * lands on its H2 even when the section is a pinned scene.
 */
const SECTIONS = ["conferences", "exhibitions", "launches", "celebrations"] as const;

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: Events I–IV are photo scenes with no module and no pin`, async ({ page }) => {
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
    // D169: the one Events gallery left until Rand's new photos arrive.
    const strip = page.locator("section#hospitality .svc-gallery");
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

  for (const id of ["hospitality", "stage"] as const) {
    test(`${locale}: a deep link to #${id} lands on its H2 over the scene`, async ({ page }) => {
      await gotoReady(page, `/${locale}/services/events-hospitality#${id}`);
      await expectLanded(page, id);
      await expect(page.locator(`#${id} .scene [data-layer] img`).first()).toBeAttached();
      await expect(page.locator(`#${id}-title`)).toBeInViewport();
    });
  }
}
