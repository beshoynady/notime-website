import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

const overflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test.describe("no horizontal scroll at 360px", () => {
  test.skip(({ isMobile }) => !isMobile, "runs once, in the mobile project");
  test.use({ viewport: { width: 360, height: 780 } });

  for (const locale of ["en", "ar"] as const) {
    test(`menu closed and open (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      expect(await overflow(page)).toBeLessThanOrEqual(0);

      // Bottom of the page (footer, marquee) too.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      expect(await overflow(page)).toBeLessThanOrEqual(0);

      await page.locator("button[aria-controls=mobile-nav]").click();
      await expect(page.locator("#mobile-nav")).toBeVisible();
      await page.locator("#mobile-nav details").first().locator("summary").click();
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });
  }
});
