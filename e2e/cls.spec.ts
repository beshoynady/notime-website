import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/** Sum of layout-shift entries not caused by input (CLS proxy), observed from navigation start. */
test.describe("no layout shift on load (font swap, hero intro)", () => {
  for (const locale of ["en", "ar"] as const) {
    test(`CLS is 0 (${locale})`, async ({ page }) => {
      await page.addInitScript(() => {
        const w = window as unknown as { __cls: number };
        w.__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
            if (!e.hadRecentInput) w.__cls += e.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await gotoReady(page, `/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(3500); // through the hero intro
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls).toBeLessThan(0.001);
    });
  }
});
