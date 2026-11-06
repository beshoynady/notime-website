import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

test.describe("mobile menu", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 9999) >= 900, "mobile only (<900px)");

  for (const locale of ["en", "ar"] as const) {
    test(`opens full height, locks the page and closes with Esc (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      const burger = page.locator("button[aria-controls=mobile-nav]");
      const nav = page.locator("#mobile-nav");

      await burger.click();
      await expect(burger).toHaveAttribute("aria-expanded", "true");
      await expect(nav).toBeVisible();

      // Regression: a backdrop-filter on the header once clipped the fixed overlay to ~60px.
      const box = await nav.boundingBox();
      const vh = page.viewportSize()!.height;
      expect(box!.y + box!.height).toBeGreaterThanOrEqual(vh - 1);

      await expect(page.locator("#stage")).toHaveAttribute("inert", "");
      expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

      // Native <details> accordion.
      const first = nav.locator("details").first();
      await first.locator("summary").click();
      await expect(first).toHaveAttribute("open", "");
      await expect(first.locator("ul a").first()).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(nav).toBeHidden();
      await expect(burger).toBeFocused();
      await expect(page.locator("#stage")).not.toHaveAttribute("inert", "");
    });

    test(`a link click closes the menu (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      await page.locator("button[aria-controls=mobile-nav]").click();
      const nav = page.locator("#mobile-nav");
      await nav.locator("nav > div a").first().click();
      await expect(nav).toBeHidden();
    });
  }
});
