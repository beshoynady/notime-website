import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Self-audit B01 (2026-11-20): on a phone the «Five crafts» cards open one by one as they scroll
 * into view. Opening grew the card and pushed the page under the reader's finger (CLS 0.09-0.11).
 * Scrolling through the whole list moves nothing.
 */
for (const locale of ["en", "ar"] as const) {
  test(`${locale}: the category cards open without moving the page`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "the cards open on scroll only on phones");
    await page.addInitScript(() => {
      const w = window as unknown as { __cardShift: number };
      w.__cardShift = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean; sources: { node?: Node }[] }[]) {
          if (!e.hadRecentInput && e.sources.some((s) => (s.node as Element | undefined)?.closest?.(".cats, .cats ~ *, #services ~ section"))) {
            w.__cardShift += e.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await gotoReady(page, `/${locale}`);
    const cats = page.locator(".cats");
    await cats.scrollIntoViewIfNeeded();
    const { top, bottom } = await cats.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + scrollY, bottom: r.bottom + scrollY };
    });
    const opened = new Set<number>();
    for (let y = top - 600; y < bottom + 200; y += 220) {
      await page.evaluate((to) => window.scrollTo(0, to), y);
      await page.waitForTimeout(350);
      for (const i of await page.locator(".cats .cat").evaluateAll((cards) => cards.flatMap((c, i) => (c.classList.contains("is-on") ? [i] : []))))
        opened.add(i);
    }
    await page.waitForTimeout(1000);
    // The cards opened on the way, and nothing moved.
    expect(opened.size).toBeGreaterThan(2);
    expect(await page.evaluate(() => (window as unknown as { __cardShift: number }).__cardShift)).toBe(0);
  });
}

/** The owner (2026-11-20): the space kept for the fold must not show as an empty band under a closed card's title. */
for (const locale of ["en", "ar"] as const) {
  test(`${locale}: a closed card's title sits at the card's foot`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "the cards open on scroll only on phones");
    await gotoReady(page, `/${locale}`);
    await page.locator(".cats").scrollIntoViewIfNeeded();
    // The first card is open; the ones below it, still under 60% of the screen, are closed.
    await page.evaluate(() => window.scrollTo(0, document.querySelector(".cats")!.getBoundingClientRect().top + scrollY - 200));
    await page.waitForTimeout(1200);
    const gaps = await page.locator(".cats .cat:not(.is-on)").evaluateAll((cards) =>
      cards.map((c) => {
        const card = c.getBoundingClientRect();
        const title = c.querySelector("h3")!.getBoundingClientRect();
        return Math.round(card.bottom - title.bottom);
      }),
    );
    expect(gaps.length).toBeGreaterThan(0);
    for (const gap of gaps) expect(gap).toBeLessThanOrEqual(32); // the card's padding (22px) and a little
  });
}
