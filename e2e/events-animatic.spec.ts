import { expect, test, type Page } from "@playwright/test";
import { EVENTS_MAJLIS, EVENTS_OPENING } from "../src/content/scenes/events-hospitality";
import { gotoReady } from "./helpers";

/**
 * The Events & Hospitality animatic (Task 3.0) on the hidden lab route: the opening's four shots
 * (three on mobile) on the pin, and the majlis in section V, which is never pinned and plays as it
 * crosses the viewport. In review, so the public page keeps its static opening. Needs a build with
 * NEXT_PUBLIC_ENABLE_LAB=1; skipped otherwise.
 */
const LAB = (locale: "en" | "ar") => `/${locale}/lab/events-animatic`;
const majlis = (page: Page) => page.locator('#hospitality .scene[data-scene="events-majlis"]');

test.beforeEach(async ({ request }) => {
  test.skip((await request.get(LAB("en"))).status() !== 200, "lab is off: build with NEXT_PUBLIC_ENABLE_LAB=1");
});

test("the public page keeps its static opening while the scene is in review", async ({ page }) => {
  await gotoReady(page, "/en/services/events-hospitality");
  await expect(page.locator(".scene")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: the opening plays its shots in order on the pin`, async ({ page, isMobile }) => {
    const viewport = isMobile ? "mobile" : "desktop";
    await gotoReady(page, LAB(locale));
    const opening = page.locator('.cat-opening .scene[data-scene="events-opening"]');
    await page.locator('.cat-opening .scene[data-motion]').waitFor({ state: "attached" });
    for (const [i, shot] of EVENTS_OPENING.shots.entries()) {
      const range = shot[viewport];
      if (!range) continue;
      await page.evaluate((vh) => window.scrollTo(0, innerHeight * vh), (range[0] + range[1]) / 2);
      await expect(opening).toHaveAttribute("data-shot-active", String(i));
      await expect(opening.locator(`.scene-line[data-shot="${i}"]`)).toBeVisible();
    }
  });
}

test("the majlis is not pinned and plays as it crosses the viewport", async ({ page }) => {
  await gotoReady(page, LAB("en"));
  await page.locator('#hospitality .scene[data-motion]').waitFor({ state: "attached" });
  await expect(page.locator(".pin-spacer")).toHaveCount(1); // the opening's only
  await expect(majlis(page).locator("#hospitality-title")).toHaveCount(1); // the H2 sits over the scene
  // Scroll to a point of the crossing: 0 when its top enters, 1 when its bottom leaves.
  const crossTo = (f: number) =>
    majlis(page).evaluate((el: HTMLElement, f) => {
      const top = el.getBoundingClientRect().top + scrollY;
      window.scrollTo(0, top - innerHeight + f * (innerHeight + el.offsetHeight));
    }, f);
  for (const [i, shot] of EVENTS_MAJLIS.shots.entries()) {
    const [from, to] = shot.desktop!;
    await crossTo((from + to) / 2);
    await expect(majlis(page)).toHaveAttribute("data-shot-active", String(i));
  }
});

test("reduced motion: both scenes show their still, nothing pinned", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoReady(page, LAB("en"));
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".cat-opening .scene-line")).toHaveCount(EVENTS_OPENING.shots.length);
  for (const line of await page.locator(".cat-opening .scene-line").all()) await expect(line).toBeVisible();
  await expect(majlis(page).locator('[data-layer="pour"] .scene-light')).toHaveCSS("opacity", "1");
});
