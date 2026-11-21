import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Review Focus 5 of the visual portfolio (D153): on a slow phone the first screen is text and one
 * plate, so no image below the first viewport may load eagerly. Measured at the top of the page,
 * before any scroll: every `<img>` that isn't `loading="lazy"` must start inside the first screen.
 * The first screen itself must hold at least one eager image (the plate), so the query is live.
 */
const PAGES = ["/en", "/ar", "/en/services/events-hospitality", "/ar/services/events-hospitality"];

for (const path of PAGES) {
  test(`${path}: no eager image below the first screen`, async ({ page }) => {
    await gotoReady(page, path);
    await page.evaluate(() => window.scrollTo(0, 0));
    const { above, below } = await page.evaluate(() => {
      const out = { above: [] as string[], below: [] as string[] };
      for (const img of document.querySelectorAll("img")) {
        if (img.loading === "lazy") continue;
        const r = img.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue; // not laid out at this width (a picture source for the other one)
        const name = img.closest("[data-layer]")?.getAttribute("data-layer") ?? img.alt ?? img.currentSrc;
        (r.top + scrollY < innerHeight ? out.above : out.below).push(`${name} @${Math.round(r.top + scrollY)}`);
      }
      return out;
    });
    expect(below, "eager images below the first screen").toEqual([]);
    if (path.includes("/services/")) expect(above.length, "the first screen's plate is eager").toBeGreaterThan(0);
  });
}
