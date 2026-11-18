import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * The header that hides on scroll (owner's change 2): on the five category pages below 900px it
 * slides up on the way down and returns on the way up; the chip bar and the private-celebrations
 * cards move with it by translate (no gap, no layout shift). Everywhere else it stays.
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

  test("the celebration cards follow", async ({ page }) => {
    await gotoReady(page, `/en${EVENTS}`);
    const list = await docTop(page, ".pstack-cards");
    const geometry = () =>
      page.evaluate(() => {
        const card = document.querySelector(".pstack-card")!.getBoundingClientRect();
        return {
          card: card.top,
          lead: document.querySelector(".pstack-lead")!.getBoundingClientRect().bottom,
          chip: document.querySelector(".svc-index")!.getBoundingClientRect().bottom,
          list: document.querySelector(".pstack-cards")!.getBoundingClientRect().top,
        };
      });
    // On the way in (header hidden, the cards still in flow), a raised card never covers the lead.
    await scrollSteps(page, list - 900, 300);
    await scrollSteps(page, list - 500);
    await expectHeader(page, "hidden");
    const inFlow = await geometry();
    expect(inFlow.card, `card top ${inFlow.card}, lead bottom ${inFlow.lead}`).toBeGreaterThanOrEqual(inFlow.lead);
    // The first card stuck: the same gap under the chip bar with the header hidden and shown.
    await scrollSteps(page, list - 40);
    await expectHeader(page, "hidden");
    const hidden = await geometry();
    expect(hidden.list, "the first card is held").toBeLessThan(hidden.card);
    await scrollSteps(page, list - 90);
    await expectHeader(page, "shown");
    const shown = await geometry();
    expect(shown.list, "the first card is held").toBeLessThan(shown.card);
    expect(Math.abs(hidden.card - hidden.chip - (shown.card - shown.chip)), `gap hidden ${hidden.card - hidden.chip}, shown ${shown.card - shown.chip}`).toBeLessThanOrEqual(2);
    // In step on every frame of the slide, both ways: the held card never jumps against the bar.
    const gaps = await page.evaluate(async () => {
      const frame = () => new Promise((r) => requestAnimationFrame(r));
      const card = document.querySelector(".pstack-card")!;
      const chip = document.querySelector(".svc-index")!;
      const out: number[] = [];
      for (const d of [50, -50]) {
        window.scrollTo({ top: scrollY + d, behavior: "instant" });
        for (let i = 0; i < 30; i++) {
          await frame();
          out.push(card.getBoundingClientRect().top - chip.getBoundingClientRect().bottom);
        }
      }
      return out;
    });
    const gap = shown.card - shown.chip;
    for (const g of gaps) expect(Math.abs(g - gap), `per-frame gaps ${gaps.map(Math.round)}`).toBeLessThanOrEqual(2);
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
