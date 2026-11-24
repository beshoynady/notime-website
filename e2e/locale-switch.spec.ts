import { expect, test } from "@playwright/test";
import { controllerReady, gotoReady } from "./helpers";

/** Language switches mid-pin and with a menu open leave no stale triggers, splits or menus (D31). */
test.describe("locale switch", () => {
  test.beforeEach(({ isMobile }) => test.skip(isMobile, "the header toggle and mega menu are desktop UI"));

  test("mid-film switch: one film, its timelines rebuilt, an Arabic title, URL /ar", async ({ page }) => {
    await gotoReady(page, "/en");
    await controllerReady(page);
    await page.evaluate(() => scrollTo({ top: innerHeight * 1.5, behavior: "instant" })); // mid-film
    await page.waitForTimeout(600);

    await page.locator("header a[hreflang=ar]").click();
    await page.waitForURL(/\/ar$/);
    await page.locator("#page-stage[data-tone-ready]").waitFor({ state: "attached" });
    // The film's timelines belong to FilmMotion, which can hydrate after the layout's
    // ToneController (D40): wait for its own marker.
    await controllerReady(page);
    await expect(page.locator("#film")).toHaveCount(1);
    await expect(page.locator("#film > .film-beat")).toHaveCount(7);
    const title = await page.locator("#hero-title").evaluate((el) => ({
      text: el.textContent ?? "",
      label: el.getAttribute("aria-label") ?? "",
    }));
    expect(title.text).not.toMatch(/[A-Za-z]/); // no English chars left in the Arabic title
    expect(title.label).not.toMatch(/[A-Za-z]/);
  });

  test("switching with the mega menu open lands with it closed", async ({ page }) => {
    await gotoReady(page, "/en");
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 10);
    const trigger = page.locator("button[aria-controls=mega-panel]");
    await trigger.click();
    await expect(page.locator("#mega-panel")).toBeVisible();

    await page.locator("header a[hreflang=ar]").click();
    await page.waitForURL(/\/ar$/);
    await expect(page.locator("button[aria-controls=mega-panel]")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mega-panel")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.hasAttribute("data-overlay-open"))).toBe(false);
  });

  test("the toggle's names start with its visible text", async ({ page }) => {
    await gotoReady(page, "/en");
    await expect(page.locator("header a[hreflang=en]")).toHaveAccessibleName("EN, English");
    await expect(page.locator("header a[hreflang=ar]")).toHaveAccessibleName("ع، العربية");
  });
});
