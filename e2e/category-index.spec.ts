import { expect, test, type Page } from "@playwright/test";
import { expectLanded, gotoReady } from "./helpers";

/**
 * Category pages · service index (Task 2.3): landings go under every bar that covers the top
 * (the header; on mobile also the sticky chip bar), within ±4px, and the index follows the
 * section in view (aria-current="location").
 */
const PAGE = "/services/events-hospitality";
const indexLink = (page: Page, id: string) => page.locator(`nav.svc-index a[href="#${id}"]`);

for (const locale of ["en", "ar"] as const) {
  test.describe(`service index (${locale})`, () => {
    test("deep link on load lands under the chip bar", async ({ page, isMobile }) => {
      test.skip(!isMobile, "chip bar: mobile");
      await gotoReady(page, `/${locale}${PAGE}#exhibitions`);
      await page.waitForTimeout(1000);
      await expectLanded(page, "exhibitions");
      await expect(indexLink(page, "exhibitions")).toHaveAttribute("aria-current", "location");
    });

    test("chip III lands #launches and becomes current", async ({ page, isMobile }) => {
      test.skip(!isMobile, "chip bar: mobile");
      await gotoReady(page, `/${locale}${PAGE}`);
      await page.evaluate(() => window.scrollTo(0, document.getElementById("conferences")!.offsetTop));
      await indexLink(page, "launches").click();
      await expectLanded(page, "launches");
      await expect(page).toHaveURL(/#launches$/);
      await expect(indexLink(page, "launches")).toHaveAttribute("aria-current", "location");
      // The active chip is visible inside the bar, and the page never scrolls sideways.
      await expect(indexLink(page, "launches")).toBeInViewport({ ratio: 1 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    });

    // Any service two taps away on mobile (D73): the toggle opens all six as rows.
    test("the toggle shows all six; one tap lands V and closes the list", async ({ page, isMobile }) => {
      test.skip(!isMobile, "chip bar: mobile");
      await gotoReady(page, `/${locale}${PAGE}`);
      const toggle = page.locator("button.svc-index-toggle");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      for (const id of ["conferences", "exhibitions", "launches", "celebrations", "hospitality", "stage"]) {
        await expect(indexLink(page, id)).toBeInViewport({ ratio: 1 });
        expect((await indexLink(page, id).boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      await indexLink(page, "hospitality").click();
      await expectLanded(page, "hospitality");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      // Escape closes it and gives focus back to the toggle.
      await toggle.click();
      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    });

    test("rail IV lands under the header", async ({ page, isMobile }) => {
      test.skip(isMobile, "rail: desktop");
      await gotoReady(page, `/${locale}${PAGE}`);
      await indexLink(page, "celebrations").click();
      await expectLanded(page, "celebrations");
      await expect(indexLink(page, "celebrations")).toHaveAttribute("aria-current", "location");
    });

    test("scrolling into section V makes rail V current", async ({ page, isMobile }) => {
      test.skip(isMobile, "rail: desktop");
      await gotoReady(page, `/${locale}${PAGE}`);
      await page.mouse.move(700, 450);
      // Past the spy line (header bottom + 8px), short of section VI.
      const goal = await page.evaluate(() => document.getElementById("hospitality")!.getBoundingClientRect().top + scrollY - 40);
      for (let i = 0; i < 80 && (await page.evaluate(() => scrollY)) < goal; i++) {
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(120);
      }
      await expect(indexLink(page, "hospitality")).toHaveAttribute("aria-current", "location");
      await expect(page.locator('nav.svc-index a[aria-current="location"]')).toHaveCount(1);
    });
  });
}
