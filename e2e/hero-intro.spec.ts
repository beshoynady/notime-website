import { expect, test, type Page } from "@playwright/test";

const shellOpacity = (page: Page) =>
  page.locator("[data-header-shell]").evaluate((el) => Number(getComputedStyle(el).opacity));

/** The controller has taken over (first visit: the intro is running). */
const controllerReady = (page: Page) => page.locator("#hero[data-hero-ready]").waitFor({ state: "attached" });

test.describe("hero intro (motion)", () => {
  test("first visit: shutters cover, header stays focusable, Tab finishes the intro", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard path is checked on desktop");
    await page.goto("/en");
    await controllerReady(page);
    // Hydrated past the intro deadline (machine under load): the controller correctly takes
    // the short-reveal path, so there are no shutters to test on this run.
    test.skip(await page.locator("html[data-intro-seen]").count() > 0, "hydrated past the intro deadline");
    await expect(page.locator(".hero-shutter.top")).toBeVisible();
    expect(await shellOpacity(page)).toBeLessThan(0.5);

    await page.keyboard.press("Tab");
    await expect(page.locator("html")).toHaveAttribute("data-intro-seen", "");
    await expect(page.locator(".hero-shutter.top")).toBeHidden();
    expect(await shellOpacity(page)).toBe(1);
    await expect(page.getByRole("link", { name: /skip/i })).toBeFocused();
  });

  test("a scroll or a tap skips to the end state", async ({ page, isMobile }) => {
    await page.goto("/en");
    await controllerReady(page);
    if (isMobile) await page.touchscreen.tap(30, 420);
    else {
      await page.mouse.move(700, 450);
      await page.mouse.wheel(0, 40);
    }
    await expect(page.locator("html")).toHaveAttribute("data-intro-seen", "", { timeout: 1000 });
    expect(await shellOpacity(page)).toBe(1);
  });

  test("plays once per session: a reload skips the shutters and reveals the title", async ({ page }) => {
    for (const locale of ["en", "ar"]) {
      await page.goto(`/${locale}`);
      await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen"), null, { timeout: 10_000 });
      await page.reload();
      // Before and after hydration: no shutters, header visible.
      await expect(page.locator(".hero-shutter.top")).toBeHidden();
      expect(await shellOpacity(page)).toBe(1);
      await controllerReady(page);
      // The short reveal ends with both lines in place.
      await expect
        .poll(() =>
          page.locator(".hero-line-inner").evaluateAll((els) => els.map((el) => new DOMMatrix(getComputedStyle(el).transform).f)),
        )
        .toEqual([0, 0]);
    }
  });
});

test.describe("header tone through the pin", () => {
  test("stays hero for the whole pin, then light, and back to hero on the way up", async ({ page }) => {
    await page.goto("/en");
    await controllerReady(page);
    // Skip with a key, not a wheel: Lenis would still be easing the wheel's scroll and
    // override the first programmatic jump.
    await page.keyboard.press("Shift");
    await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen"));
    const toneAt = async (f: number) => {
      await page.evaluate((f) => scrollTo(0, innerHeight * f), f);
      await page.waitForTimeout(150);
      return page.locator("#site-header").getAttribute("data-header-tone");
    };
    // The pin lasts 1.4 viewports after the hero's top; the light stub follows the spacer.
    expect(await toneAt(0.5)).toBe("hero");
    expect(await toneAt(1.3)).toBe("hero");
    expect(await toneAt(2.6)).toBe("light");
    expect(await toneAt(1.0)).toBe("hero");
  });
});

test.describe("hero intro (reduced motion)", () => {
  test.use({ reducedMotion: "reduce" });

  test("no intro, no pin: the static frame is final", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#stage[data-tone-ready]").waitFor({ state: "attached" });
    await expect(page.locator(".hero-shutter.top")).toBeHidden();
    expect(await shellOpacity(page)).toBe(1);
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    await expect(page.locator(".hero-beat")).toBeVisible();
    await expect(page.locator("#hero-title")).toBeVisible();
  });
});
