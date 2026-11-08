import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

const SERVICES_PAGES = [
  "/services",
  "/services/events-hospitality",
  "/services/creative-production",
  "/services/marketing-brand",
  "/services/production-print-gifts",
  "/services/software-digital",
] as const;

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

    test(`styleguide, top to bottom (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}/styleguide`);
      expect(await overflow(page)).toBeLessThanOrEqual(0);
      // Walk the page so scroll-driven states (open card, parallax, marquee) all run.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });

    // The services overview and the five category pages (D57).
    for (const path of SERVICES_PAGES) {
      test(`${path}, top to bottom (${locale})`, async ({ page }) => {
        await gotoReady(page, `/${locale}${path}`);
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
        });
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });
    }
  }
});
