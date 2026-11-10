import { expect, test } from "@playwright/test";
import { controllerReady, gotoReady } from "./helpers";

/** Language switches mid-pin and with a menu open leave no stale triggers, splits or menus (D31). */
test.describe("locale switch", () => {
  test.beforeEach(({ isMobile }) => test.skip(isMobile, "the header toggle and mega menu are desktop UI"));

  test("mid-pin switch: one pin spacer, no leftover split, URL /ar", async ({ page }) => {
    await gotoReady(page, "/en");
    await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen") || !!document.querySelector(".pin-spacer"));
    await page.evaluate(() => scrollTo(0, innerHeight * 0.7)); // 50% of the 140% pin
    await page.waitForTimeout(600);

    await page.locator("header a[hreflang=ar]").click();
    await page.waitForURL(/\/ar$/);
    await page.locator("#page-stage[data-tone-ready]").waitFor({ state: "attached" });
    // The pin belongs to the hero controller, and the page can hydrate after the layout's
    // ToneController (D40): wait for the controller's own marker, not only the layout's.
    await controllerReady(page);

    // One spacer around the hero (other pins, How we work since D84, have their own). It is the
    // server-rendered wrapper, so the hero is never moved in the DOM (D43).
    const heroSpacer = page.locator(".pin-spacer:has(> #hero)");
    expect(await heroSpacer.count()).toBe(1);
    expect(await heroSpacer.evaluate((el) => el.classList.contains("hero-pin"))).toBe(true);
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
    await page.mouse.wheel(0, 10); // skip the intro so the header is interactive
    const trigger = page.locator("button[aria-controls=mega-panel]");
    await trigger.click();
    await expect(page.locator("#mega-panel")).toBeVisible();

    await page.locator("header a[hreflang=ar]").click();
    await page.waitForURL(/\/ar$/);
    await expect(page.locator("button[aria-controls=mega-panel]")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mega-panel")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.hasAttribute("data-overlay-open"))).toBe(false);
  });
});
