import { expect, test, type Page } from "@playwright/test";
import { getCategories, getServices } from "../src/content";
import { expectLanded, gotoReady } from "./helpers";

/**
 * Every way into a category page reaches it (D57): the mega menu (desktop), the mobile menu, the
 * homepage category cards and "All services". Regression: until 2026-11-09 all of them pointed
 * at the homepage (`/#services`), so no category page was reachable from the UI.
 */
const categories = getCategories();

async function expectCategory(page: Page, locale: "en" | "ar", i: number) {
  const c = categories[i];
  await expect(page).toHaveURL(new RegExp(`/${locale}/services/${c.slug}(#.*)?$`));
  await expect(page.locator("#category-title")).toHaveText(c.title[locale]);
}

for (const locale of ["en", "ar"] as const) {
  test.describe(`navigation to the category pages (${locale})`, () => {
    test("mega menu: each category, then a service lands on its section", async ({ page }) => {
      test.skip((page.viewportSize()?.width ?? 0) < 900, "desktop only (≥900px)");
      const open = async () => {
        await gotoReady(page, `/${locale}`);
        await page.locator("button[aria-controls=mega-panel]").click();
        await expect(page.locator("#mega-panel")).toBeVisible();
      };
      for (let i = 0; i < categories.length; i++) {
        await open();
        await page.locator("#mega-panel ul").first().locator("li").nth(i).locator("a").click();
        await expectCategory(page, locale, i);
      }
      // A service of the last category: hover its row, then pick its first service.
      await open();
      await page.locator("#mega-panel ul").first().locator("li").nth(4).locator("a").hover();
      const service = getServices(categories[4].slug)[0];
      await page.locator("#mega-panel ul.grid-cols-2 a").first().click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/services/${categories[4].slug}#${service.anchor}$`));
      await expectLanded(page, service.anchor);
    });

    test("mobile menu: each category, then a service lands on its section", async ({ page }) => {
      test.skip((page.viewportSize()?.width ?? 9999) >= 900, "mobile only (<900px)");
      const open = async (i: number) => {
        await gotoReady(page, `/${locale}`);
        await page.locator("button[aria-controls=mobile-nav]").click();
        const item = page.locator("#mobile-nav details").nth(i);
        await item.locator("summary").click();
        return item;
      };
      for (let i = 0; i < categories.length; i++) {
        const item = await open(i);
        await item.locator("ul a").first().click(); // "View category"
        await expectCategory(page, locale, i);
      }
      const item = await open(1);
      const service = getServices(categories[1].slug)[0];
      await item.locator("ul a").nth(1).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/services/${categories[1].slug}#${service.anchor}$`));
      await expectLanded(page, service.anchor);
    });

    test("homepage category cards and 'All services'", async ({ page }) => {
      for (let i = 0; i < categories.length; i++) {
        await gotoReady(page, `/${locale}`);
        await page.locator("#services a.cat").nth(i).click();
        await expectCategory(page, locale, i);
      }
      await gotoReady(page, `/${locale}`);
      await page.locator("#services .cats-foot a").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/services$`));
    });
  });
}
