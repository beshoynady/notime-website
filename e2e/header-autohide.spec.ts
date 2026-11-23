import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * The header that hides on scroll (owner's change 2): on the five category pages below 900px it
 * slides up on the way down and returns on the way up; the chip bar moves with it by translate
 * (no gap, no layout shift). Everywhere else it stays.
 */
const EVENTS = "/services/events-hospitality";
const PHONE_PAGES = [
  ["en", EVENTS],
  ["ar", "/services/software-digital"],
] as const;

/** Scrolls the window to `to` in small steps, one per frame, as a finger or a wheel would. */
async function scrollSteps(page: Page, to: number, step = 40) {
  await page.evaluate(
    async ({ to, step }) => {
      const frame = () => new Promise((r) => requestAnimationFrame(r));
      let y = Math.round(scrollY);
      while (y !== to) {
        y = to > y ? Math.min(y + step, to) : Math.max(y - step, to);
        window.scrollTo({ top: y, behavior: "instant" });
        await frame();
      }
      await frame();
    },
    { to, step },
  );
}

const headerTop = (page: Page) => page.evaluate(() => document.getElementById("site-header")!.getBoundingClientRect().top);
const headerH = (page: Page) => page.evaluate(() => document.getElementById("site-header")!.offsetHeight);
const docTop = (page: Page, selector: string) =>
  page.evaluate((s) => Math.round(document.querySelector(s)!.getBoundingClientRect().top + scrollY), selector);

/** Waits for the header to settle hidden (fully above the viewport's top) or shown. */
async function expectHeader(page: Page, state: "hidden" | "shown") {
  const h = await headerH(page);
  if (state === "hidden") await expect.poll(() => headerTop(page)).toBeLessThanOrEqual(-h + 1);
  else await expect.poll(() => headerTop(page)).toBeGreaterThanOrEqual(-1);
  await page.waitForTimeout(150); // the followers share the header's transition; let them land too
}

test.describe("header autohide (phones)", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "mobile", "phone width"));

  for (const [locale, path] of PHONE_PAGES) {
    test(`hides on the way down, returns on the way up (${locale}${path})`, async ({ page }) => {
      await gotoReady(page, `/${locale}${path}`);
      await expectHeader(page, "shown");
      await scrollSteps(page, 600);
      await expectHeader(page, "hidden");
      await scrollSteps(page, 550);
      await expectHeader(page, "shown");
      // And back at the top it stays.
      await scrollSteps(page, 0);
      await expectHeader(page, "shown");
    });
  }

  test("the chip bar follows", async ({ page }) => {
    await gotoReady(page, `/en${EVENTS}`);
    const start = await docTop(page, "#conferences");
    await scrollSteps(page, start, 200);
    await scrollSteps(page, start + 400);
    await expectHeader(page, "hidden");
    const hidden = await page.evaluate(() => ({
      chip: document.querySelector(".svc-index")!.getBoundingClientRect().top,
      safe: document.querySelector(".safe-top-strip")!.getBoundingClientRect().bottom,
    }));
    expect(Math.abs(hidden.chip - hidden.safe), `chip bar top ${hidden.chip}, safe area ${hidden.safe}`).toBeLessThanOrEqual(2);
    await scrollSteps(page, start + 350);
    await expectHeader(page, "shown");
    const shown = await page.evaluate(() => ({
      chip: document.querySelector(".svc-index")!.getBoundingClientRect().top,
      header: document.getElementById("site-header")!.getBoundingClientRect().bottom,
    }));
    expect(Math.abs(shown.chip - shown.header), `chip bar top ${shown.chip}, header bottom ${shown.header}`).toBeLessThanOrEqual(2);
  });


  test("no layout shift", async ({ page }) => {
    await gotoReady(page, `/en${EVENTS}`);
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const w = window as unknown as { __shift: number };
      w.__shift = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as { value: number }[]) w.__shift += e.value;
      }).observe({ type: "layout-shift" });
    });
    await scrollSteps(page, 1500);
    await expectHeader(page, "hidden");
    await scrollSteps(page, 1200);
    await expectHeader(page, "shown");
    await scrollSteps(page, 2400);
    await expectHeader(page, "hidden");
    await page.waitForTimeout(400);
    const shift = await page.evaluate(() => (window as unknown as { __shift: number }).__shift);
    expect(shift).toBeLessThan(0.01);
  });

  test("focus brings it back", async ({ page }) => {
    await gotoReady(page, `/en${EVENTS}`);
    await scrollSteps(page, 600);
    await expectHeader(page, "hidden");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await expectHeader(page, "shown");
  });

  test("a tap's focus doesn't hold it", async ({ page }) => {
    await gotoReady(page, `/en${EVENTS}`);
    const burger = page.locator("button[aria-controls=mobile-nav]");
    await burger.tap();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await burger.tap();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expect(burger).toBeFocused(); // the tap left focus in the header
    await scrollSteps(page, 600);
    await expectHeader(page, "hidden");
  });

  test("only on category pages", async ({ page }) => {
    for (const path of ["/en", "/en/work"]) {
      await gotoReady(page, path);
      await scrollSteps(page, 600);
      await page.waitForTimeout(500);
      expect(await headerTop(page), path).toBeGreaterThanOrEqual(-1);
      expect(await page.evaluate(() => document.documentElement.hasAttribute("data-header-hidden")), path).toBe(false);
    }
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("still hides and shows, without a transition", async ({ page }) => {
      await gotoReady(page, `/en${EVENTS}`);
      await scrollSteps(page, 600);
      await expectHeader(page, "hidden");
      const durations = await page.evaluate(() => getComputedStyle(document.getElementById("site-header")!).transitionDuration.split(",").map(parseFloat));
      for (const d of durations) expect(d).toBeLessThan(0.01);
      await scrollSteps(page, 550);
      await expectHeader(page, "shown");
    });

  });
});

test("desktop unchanged", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "desktop width");
  await gotoReady(page, `/en${EVENTS}`);
  await scrollSteps(page, 600);
  await page.waitForTimeout(500);
  expect(await headerTop(page)).toBeGreaterThanOrEqual(-1);
  expect(await page.evaluate(() => document.documentElement.hasAttribute("data-header-hidden"))).toBe(false);
});
