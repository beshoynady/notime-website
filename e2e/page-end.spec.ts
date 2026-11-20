import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Self-audit B03 (2026-11-20): on a phone the space reserved for the sticky bar sat on the body,
 * so wherever the bar was hidden (a 404, a page's end) an ivory band showed under the dark footer.
 * At the page's end the screen's last pixels belong to the footer (or the bar over it), and the
 * footer's last line is never under a shown bar.
 */
for (const path of ["/en/this-page-does-not-exist", "/en/services/creative-production", "/ar/services/software-digital", "/ar/about"]) {
  test(`${path}: the page ends on the footer`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "the sticky bars are phone-only");
    await gotoReady(page, path);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(600);
    const end = await page.evaluate(() => {
      const at = document.elementFromPoint(innerWidth / 2, innerHeight - 4);
      const bar = document.querySelector<HTMLElement>(".cta-bar[data-show], .sw-sticky[data-show]");
      const leaves = [...document.querySelectorAll("footer *")].filter((e) => !e.children.length && e.textContent?.trim());
      const lastLine = Math.max(...leaves.map((e) => e.getBoundingClientRect().bottom));
      return {
        onFooter: !!at?.closest("footer, .cta-bar, .sw-sticky"),
        what: at ? `${at.tagName.toLowerCase()}.${at.className}` : "none",
        lastLine: Math.round(lastLine),
        barTop: bar ? Math.round(bar.getBoundingClientRect().top) : Math.round(innerHeight),
      };
    });
    expect(end.onFooter, `the screen ends on ${end.what}`).toBe(true);
    expect(end.lastLine).toBeLessThanOrEqual(end.barTop);
  });
}
