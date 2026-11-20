import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Self-audit B12 (2026-11-20): on /services the ground turned dark for the closing CTA while the
 * list's last row was still in the top third of the screen, and the row faded out unread. While
 * any part of the last row is on screen below the header, the list stays shown.
 */
for (const locale of ["en", "ar"] as const) {
  test(`${locale}: the list's last row stays readable until it leaves the screen`, async ({ page }) => {
    await gotoReady(page, `/${locale}/services`);
    const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= max; y += 160) {
      await page.evaluate((to) => window.scrollTo(0, to), y);
      await page.waitForTimeout(550); // the zone fade is 0.45s
      const s = await page.evaluate(() => {
        const row = [...document.querySelectorAll(".svx-row")].pop()!.getBoundingClientRect();
        const header = document.getElementById("site-header")!.getBoundingClientRect().bottom;
        return { onScreen: row.bottom > header + 24 && row.top < innerHeight, opacity: getComputedStyle(document.querySelector(".svx")!).opacity };
      });
      if (s.onScreen) expect(s.opacity, `at scroll ${y}`).toBe("1");
    }
  });
}
