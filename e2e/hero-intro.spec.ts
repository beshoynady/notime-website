import { expect, test, type Page } from "@playwright/test";
import { controllerReady, waitForIntroEnd } from "./helpers";

const shellOpacity = (page: Page) =>
  page.locator("[data-header-shell]").evaluate((el) => Number(getComputedStyle(el).opacity));

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
      await waitForIntroEnd(page);
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
    await waitForIntroEnd(page);
    const toneAt = async (f: number) => {
      await page.evaluate((f) => scrollTo(0, innerHeight * f), f);
      await page.waitForTimeout(150);
      return page.locator("#site-header").getAttribute("data-header-tone");
    };
    // The pin lasts 1.4 viewports after the hero's top; About (dark) follows the spacer, then
    // Categories (light).
    expect(await toneAt(0.5)).toBe("hero");
    expect(await toneAt(1.3)).toBe("hero");
    expect(await toneAt(2.6)).toBe("dark");
    expect(await toneAt(1.0)).toBe("hero");
    await page.locator("#services").evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY + 40));
    await page.waitForTimeout(150);
    expect(await page.locator("#site-header").getAttribute("data-header-tone")).toBe("light");
  });
});

test.describe("hero LCP rule below 900px (D43)", () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, "mobile viewport only"));

  for (const locale of ["en", "ar"] as const) {
    // What the hero code controls: the title is never masked, split or held, so its paint
    // waits on nothing but the text itself. (When the text paints is the webfont's block
    // period, D38 / OPEN_QUESTIONS #14: the first contentful paint can be the clock SVG or
    // the logo a little earlier, measured 100-500 ms, with or without the intro.)
    test(`the title is the LCP, never masked or split (${locale})`, async ({ page }) => {
      await page.addInitScript(() => {
        const w = window as unknown as { __lcp: string[] };
        w.__lcp = [];
        new PerformanceObserver((l) => {
          for (const e of l.getEntries() as unknown as { element: Element | null }[]) w.__lcp.push(e.element?.className ?? "");
        }).observe({ type: "largest-contentful-paint", buffered: true });
      });
      // First visit (intro plays), then a repeat visit in the same tab (intro skipped).
      for (const visit of ["first", "repeat"]) {
        await page.goto(`/${locale}`);
        await controllerReady(page);
        await page.waitForTimeout(1500);
        const r = await page.evaluate(() => ({
          lcp: (window as unknown as { __lcp: string[] }).__lcp.at(-1),
          splitNodes: document.querySelectorAll(".hero-line-inner *").length,
          masks: [...document.querySelectorAll(".hero-line")].map((el) => getComputedStyle(el).overflow),
          visible: [...document.querySelectorAll(".hero-line-inner")].map((el) => getComputedStyle(el).visibility),
        }));
        expect(r.lcp, `${visit} visit LCP element`).toContain("hero-line-inner");
        expect(r.splitNodes, `${visit} visit: no SplitText below 900px`).toBe(0);
        expect(r.masks, `${visit} visit: no line masks below 900px`).toEqual(["visible", "visible"]);
        expect(r.visible, `${visit} visit: lines never hidden`).toEqual(["visible", "visible"]);
      }
    });
  }
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
