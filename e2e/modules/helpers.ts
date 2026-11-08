import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Shared helpers for the signature-module specs (Task 2.4).
 */

/** Records layout shifts whose moved nodes sit inside a `[data-module]` slot. Call before goto. */
export async function recordModuleShifts(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __moduleShift: number };
    w.__moduleShift = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean; sources?: { node?: Node }[] }[]) {
        if (e.hadRecentInput) continue;
        const inSlot = e.sources?.some((s) => s.node instanceof Element && s.node.closest("[data-module]"));
        if (inSlot) w.__moduleShift += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
}

/** The layout shift recorded inside module slots so far must stay under 0.01. */
export async function expectNoShift(page: Page) {
  const shift = await page.evaluate(() => (window as unknown as { __moduleShift: number }).__moduleShift);
  expect(shift, `layout shift inside module slots: ${shift}`).toBeLessThan(0.01);
}

/**
 * Rapid repeated input (Review Focus 5): clicks `n` times without waiting, lets animations
 * settle, and returns `attr` of `state` (default: the clicked control itself).
 */
export async function spamThenSettle(page: Page, control: Locator, n: number, attr = "aria-pressed", state: Locator = control) {
  for (let i = 0; i < n; i++) await control.click({ delay: 0, noWaitAfter: true });
  await page.waitForTimeout(1500);
  return state.getAttribute(attr);
}
