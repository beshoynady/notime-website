import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Self-audit B11 (2026-11-20): on a laptop the services rail (a 60% scrim) stayed over the
 * full-bleed scenes and cut the Events catering scene. Over a scene it steps aside; past the
 * sections it returns. Since every Events section is a scene (D153, D155) it only fades: it stays
 * in the Tab order and comes back on focus or hover (category-index.spec.ts).
 */
for (const locale of ["en", "ar"] as const) {
  test(`${locale}: the rail steps aside over a full-bleed scene and comes back`, async ({ page, isMobile }) => {
    test.skip(isMobile, "the rail is the laptop layout; phones use the chip bar");
    await gotoReady(page, `/${locale}/services/events-hospitality`);
    const rail = page.locator("nav.svc-index");
    const scenes = page.locator(".svc-scene");
    expect(await scenes.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await scenes.count()); i++) {
      await scenes.nth(i).evaluate((el) => {
        const r = el.getBoundingClientRect();
        window.scrollTo(0, r.top + scrollY + 40);
      });
      await expect(rail).toHaveAttribute("data-over-scene", "");
      await expect(rail).toHaveCSS("opacity", "0");
    }
    // Past the scenes (the FAQ beside the rail's track): the rail is back.
    await page.locator("section.cat-faq").evaluate((el) => el.scrollIntoView({ block: "start" }));
    await expect(rail).not.toHaveAttribute("data-over-scene", "");
    await expect(rail).toHaveCSS("opacity", "1");
  });
}
