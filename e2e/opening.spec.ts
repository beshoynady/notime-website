import { expect, test, type Page } from "@playwright/test";
import { expectLanded, gotoReady, lcpEntry } from "./helpers";

/**
 * Category pages · the opening shell (Task 2.8; storyboards README §2): the service index shows
 * from the first frame, the skip control is the first Tab stop after the breadcrumbs and lands
 * the first service, and landings hold. Public pages have a static opening until a category's
 * scene is approved; the pinned cases run on the lab animatic (build with
 * NEXT_PUBLIC_ENABLE_LAB=1, skipped otherwise).
 */
const PAGE = "/services/events-hospitality";
const LAB = "/lab/events-animatic";

const skip = (page: Page) => page.locator("a.cat-skip");
const indexLink = (page: Page, id: string) => page.locator(`nav.svc-index a[href="#${id}"]`);
const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

for (const locale of ["en", "ar"] as const) {
  test.describe(`opening (${locale})`, () => {
    test("the index shows at load; Tab goes breadcrumbs → skip → index", async ({ page }) => {
      await gotoReady(page, `/${locale}${PAGE}`);
      await expect(page.locator("nav.svc-index")).toBeInViewport();
      await expect(indexLink(page, "conferences")).toBeInViewport();
      await page.locator(".crumbs a").last().focus();
      await page.keyboard.press("Tab");
      await expect(skip(page)).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(indexLink(page, "conferences")).toBeFocused();
    });

    test("skip with Enter lands the first service, H2 focused", async ({ page }) => {
      await gotoReady(page, `/${locale}${PAGE}`);
      await skip(page).focus();
      await page.keyboard.press("Enter");
      await expectLanded(page, "conferences");
    });

    test("a deep link to the last service lands", async ({ page }) => {
      await gotoReady(page, `/${locale}${PAGE}#stage`);
      await page.waitForTimeout(1000);
      await expectLanded(page, "stage");
    });

    test("reduced motion: the skip control still lands", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await gotoReady(page, `/${locale}${PAGE}`);
      await skip(page).click();
      await expectLanded(page, "conferences");
    });

    test("no horizontal overflow in the opening at 360", async ({ page, isMobile }) => {
      test.skip(!isMobile, "narrow width: mobile");
      await page.setViewportSize({ width: 360, height: 780 });
      await gotoReady(page, `/${locale}${PAGE}`);
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });

    // The brief's rule: LCP is text. On a static opening at 390 the first service's intro can
    // outsize the H1, which is fine; a scene's opening fills the screen and its H1 is the LCP
    // (layered-scene.spec.ts).
    test("LCP is text, never an image", async ({ page }) => {
      await gotoReady(page, `/${locale}${PAGE}`);
      expect((await lcpEntry(page)).url).toBe("");
    });

    test.describe("pinned (lab)", () => {
      test.beforeEach(async ({ request }) => {
        test.skip((await request.get(`/en${LAB}`)).status() !== 200, "lab is off: build with NEXT_PUBLIC_ENABLE_LAB=1");
      });

      test("index VI chosen half a screen into the opening lands #stage", async ({ page }) => {
        await gotoReady(page, `/${locale}${LAB}`);
        await page.locator(".scene[data-motion]").waitFor({ state: "attached" });
        await page.evaluate(() => window.scrollTo(0, innerHeight * 0.5));
        await page.waitForTimeout(300);
        await indexLink(page, "stage").click();
        await expectLanded(page, "stage");
        await expect(indexLink(page, "stage")).toHaveAttribute("aria-current", "location");
      });

      test("skip from the top of the pinned opening lands the first service", async ({ page }) => {
        await gotoReady(page, `/${locale}${LAB}`);
        await page.locator(".scene[data-motion]").waitFor({ state: "attached" });
        await skip(page).click();
        await expectLanded(page, "conferences");
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });
    });
  });
}
