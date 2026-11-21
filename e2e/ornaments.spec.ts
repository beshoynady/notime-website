import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Ornament kit (v1 plan, Task A4), on the styleguide's Patterns section and dark closing band:
 * logical placement mirrors in Arabic, reduced motion holds everything still, hover treatments
 * stay off touch screens, and nothing shifts the layout.
 */
const pattern = (page: Page, k: string) => page.locator(`[data-pattern="${k}"]`);

/** Where `el` sits inside `parent`, as "start" (left) or "end" (right) of its centre. */
async function side(page: Page, selector: string, parentSelector: string) {
  return page.evaluate(
    ([sel, par]) => {
      const el = document.querySelector(sel)!.getBoundingClientRect();
      const p = (document.querySelector(sel)!.closest(par) as Element).getBoundingClientRect();
      return el.left + el.width / 2 < p.left + p.width / 2 ? "left" : "right";
    },
    [selector, parentSelector] as const,
  );
}

test.describe("placement", () => {
  for (const [locale, start, end] of [
    ["en", "left", "right"],
    ["ar", "right", "left"],
  ] as const) {
    test(`/${locale}: frame corners and light leak sit on the reading side`, async ({ page }) => {
      await gotoReady(page, `/${locale}/styleguide#patterns`);
      await expect(pattern(page, "corners").locator('[data-corner]')).toHaveCount(4);
      expect(await side(page, '[data-pattern="corners"] [data-corner="start-start"]', ".frame-corners")).toBe(start);
      expect(await side(page, '[data-pattern="corners"] [data-corner="end-end"]', ".frame-corners")).toBe(end);
      expect(await side(page, '.sg-closing [data-ornament="light-leak"]', ".sg-closing")).toBe(end);
    });
  }
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("Ken Burns, clock hand and sweep don't move over 2 s of scrolling", async ({ page }) => {
    await gotoReady(page, "/en/styleguide#patterns");
    // Each dial places its hand once on mount (data-tick); that placement isn't motion.
    const dials = page.locator('[data-ornament="tick"]');
    await expect(dials.and(page.locator("[data-tick]"))).toHaveCount(await dials.count());
    const read = () =>
      page.evaluate(() =>
        [...document.querySelectorAll('[data-motion="ken-burns"] > div, [data-ornament="tick"] .tick-hand, .hover-sweep-sheen')].map((e) => getComputedStyle(e).transform + (e.getAttribute("transform") ?? "") + ((e as HTMLElement).style?.transform ?? "")),
      );
    const before = await read();
    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(500);
    }
    await page.locator('[data-pattern="sweep"] [data-motion="hover-sweep"]').hover();
    expect(await read()).toEqual(before);
    // Ken Burns leaves the image at its own size.
    for (const t of await page.locator('[data-motion="ken-burns"] > div').evaluateAll((els) => els.map((e) => getComputedStyle(e).transform))) expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(t);
  });
});

test("hover treatments are only attached on a fine pointer", async ({ page, isMobile }) => {
  await gotoReady(page, "/en/styleguide#patterns");
  await expect(page.locator('[data-motion="hover-sweep"]')).toHaveCount(1);
  await expect(page.locator(".hover-sweep-sheen")).toHaveCount(isMobile ? 0 : 1);
  await expect(pattern(page, "sweep").locator(".sg-pat-hint")).toBeVisible({ visible: !isMobile });
});

test("the styleguide doesn't shift while the ornaments load and run", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number };
    w.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) w.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await gotoReady(page, "/en/styleguide");
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(800);
  const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
  expect(cls, `CLS ${cls}`).toBeLessThan(0.01);
});
