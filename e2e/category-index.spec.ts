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

    // D74, P7: the landed heading shows the focus ring after keyboard navigation only.
    test("rail: Enter lands with a focus ring on the heading, a click lands with none", async ({ page, isMobile }) => {
      test.skip(isMobile, "rail: desktop");
      await gotoReady(page, `/${locale}${PAGE}`);
      const ring = (id: string) => page.locator(`#${id}-title`).evaluate((h) => getComputedStyle(h).outlineStyle);
      await indexLink(page, "launches").click();
      await expectLanded(page, "launches");
      expect(await ring("launches")).toBe("none");
      await indexLink(page, "stage").focus();
      await page.keyboard.press("Enter");
      await expectLanded(page, "stage");
      expect(await ring("stage")).toBe("solid");
    });

    test("a deep link on load lands focused, with no ring (how the visitor arrived is unknown)", async ({ page, isMobile }) => {
      test.skip(isMobile, "the same at both widths");
      await gotoReady(page, `/${locale}${PAGE}#launches`);
      await expectLanded(page, "launches");
      expect(await page.locator("#launches-title").evaluate((h) => getComputedStyle(h).outlineStyle)).toBe("none");
    });

    // D74, P4: Roman numerals in English, 01-06 in Arabic (rail, chips, section numerals, eyebrow).
    test("order numerals follow the locale", async ({ page }) => {
      await gotoReady(page, `/${locale}${PAGE}`);
      const expected = locale === "en" ? ["I", "II", "III", "IV", "V", "VI"] : ["01", "02", "03", "04", "05", "06"];
      await expect(page.locator("nav.svc-index .svc-index-num")).toHaveText(expected);
      await expect(page.locator(".svc .svc-num")).toHaveText(expected);
      await expect(page.locator(".cat-opening-eyebrow bdi")).toHaveText(locale === "en" ? "I" : "01");
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
