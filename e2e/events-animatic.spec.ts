import { expect, test, type Page } from "@playwright/test";
import { EVENTS_MAJLIS, EVENTS_OPENING } from "../src/content/scenes/events-hospitality";
import { lineSpans } from "../src/lib/scene-math";
import { GROUND, gotoReady } from "./helpers";

/**
 * The Events & Hospitality animatic (Task 3.0) on the hidden lab route: the opening's four shots
 * (three on mobile) and three lines on the pin, the index dimmed during shot 1, and the majlis in
 * section V: a 0.6 vh pin with two beats on desktop, a crossing on mobile (D74). In review, so the
 * public page keeps its static opening. Needs a build with NEXT_PUBLIC_ENABLE_LAB=1; skipped otherwise.
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
  test(`${locale}: the opening plays its shots in order on the pin, one of three lines at a time`, async ({ page, isMobile }) => {
    const viewport = isMobile ? "mobile" : "desktop";
    await gotoReady(page, LAB(locale));
    const opening = page.locator('.cat-opening .scene[data-scene="events-opening"]');
    await page.locator('.cat-opening .scene[data-motion]').waitFor({ state: "attached" });
    await expect(opening.locator(".scene-line")).toHaveCount(3); // D74, P1
    const spans = lineSpans(EVENTS_OPENING.shots, viewport);
    for (const [i, shot] of EVENTS_OPENING.shots.entries()) {
      const range = shot[viewport];
      if (!range) continue;
      const mid = (range[0] + range[1]) / 2;
      await page.evaluate((vh) => window.scrollTo(0, innerHeight * vh), mid);
      await expect(opening).toHaveAttribute("data-shot-active", String(i));
      // A shot without a line (the lights coming up) keeps the previous one.
      const line = spans.find((l) => mid >= l.start && mid < l.end)!;
      await expect(opening.locator(`.scene-line[data-shot="${line.shot}"]`)).toBeVisible();
      await expect(opening.locator(".scene-line:visible")).toHaveCount(1);
    }
  });
}

test("desktop: the majlis pins 0.6 vh under the header and plays the pour, then the bloom", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop pin");
  await gotoReady(page, LAB("en"));
  await page.locator('#hospitality .scene[data-motion="desktop"]').waitFor({ state: "attached" });
  await expect(majlis(page).locator("#hospitality-title")).toHaveCount(1); // the H2 sits over the scene
  const spacer = page.locator("#hospitality .pin-spacer");
  await expect(spacer).toHaveCount(1);
  const extra = await spacer.evaluate((el) => (el.getBoundingClientRect().height - el.firstElementChild!.getBoundingClientRect().height) / innerHeight);
  expect(extra).toBeCloseTo(0.6, 1);
  const headerBottom = () => page.evaluate(() => document.getElementById("site-header")!.getBoundingClientRect().bottom);
  // vh into the pin, from where the scene's top meets the header's bottom.
  const pinTo = (vh: number) =>
    spacer.evaluate((el, vh) => {
      const header = document.getElementById("site-header")!.getBoundingClientRect().bottom;
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - header + vh * innerHeight);
    }, vh);
  for (const [i, shot] of EVENTS_MAJLIS.shots.entries()) {
    if (!shot.desktop) continue;
    const [from, to] = shot.desktop;
    await pinTo((from + to) / 2);
    await expect(majlis(page)).toHaveAttribute("data-shot-active", String(i));
    const top = (await majlis(page).evaluate((el) => el.getBoundingClientRect().top)) - (await headerBottom());
    expect(Math.abs(top)).toBeLessThanOrEqual(2); // held under the header
  }
  await pinTo(0.6);
  await expect(majlis(page).locator('[data-layer="tent-bloom"] .scene-light')).toHaveCSS("opacity", "1");
});

test("mobile: the majlis is not pinned and plays as it crosses the viewport", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile crossing");
  await gotoReady(page, LAB("en"));
  await page.locator('#hospitality .scene[data-motion="mobile"]').waitFor({ state: "attached" });
  await expect(page.locator(".pin-spacer")).toHaveCount(1); // the opening's only
  // Scroll to a point of the crossing: 0 when its top enters, 1 when its bottom leaves.
  const crossTo = (f: number) =>
    majlis(page).evaluate((el: HTMLElement, f) => {
      const top = el.getBoundingClientRect().top + scrollY;
      window.scrollTo(0, top - innerHeight + f * (innerHeight + el.offsetHeight));
    }, f);
  for (const [i, shot] of EVENTS_MAJLIS.shots.entries()) {
    const [from, to] = shot.mobile!;
    await crossTo((from + to) / 2);
    await expect(majlis(page)).toHaveAttribute("data-shot-active", String(i));
  }
});

// D74, P3: the index stays from the first frame (D64) but steps back to 40% during shot 1.
test("the index dims during the opening's first shot, back on hover, focus or the next shot", async ({ page, isMobile }) => {
  const viewport = isMobile ? "mobile" : "desktop";
  await gotoReady(page, LAB("en"));
  await page.locator(".cat-opening .scene[data-motion]").waitFor({ state: "attached" });
  const index = page.locator("nav.svc-index");
  await expect(index).toHaveCSS("opacity", "0.4");
  if (!isMobile) {
    await index.hover();
    await expect(index).toHaveCSS("opacity", "1");
    await page.mouse.move(720, 450);
    await expect(index).toHaveCSS("opacity", "0.4");
  }
  await index.locator("a").first().focus();
  await expect(index).toHaveCSS("opacity", "1");
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await expect(index).toHaveCSS("opacity", "0.4");
  const next = EVENTS_OPENING.shots.find((s, i) => i > 0 && s[viewport])![viewport]!;
  await page.evaluate((vh) => window.scrollTo(0, innerHeight * vh), (next[0] + next[1]) / 2);
  await expect(index).toHaveCSS("opacity", "1");
});

/** The page ground as #page-stage paints it. */
const ground = (page: Page) => page.locator("#page-stage").evaluate((el) => getComputedStyle(el).backgroundColor);

// The opening's pin adds its spacer below the opening: the tone zones of everything after it must
// include that distance (measured before the fix: the ground turned one pin length early, so
// Stage read ivory on ivory and the FAQ espresso on espresso).
test("the ground follows the sections below the pinned opening", async ({ page }) => {
  await gotoReady(page, LAB("en"));
  await page.locator(".cat-opening .scene[data-motion]").waitFor({ state: "attached" });
  const scrollToTop = (selector: string, at: number) =>
    page.locator(selector).first().evaluate((el, at) => {
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * at);
    }, at);
  await scrollToTop("#stage", 0.2); // the last service, on the dark ground
  await expect.poll(() => ground(page)).toBe(GROUND.evening.dark);
  await page.waitForTimeout(1500); // past the tone tween and any late refresh: it stays dark
  expect(await ground(page)).toBe(GROUND.evening.dark);
  await scrollToTop("section.cat-faq", 0.2); // Act 3, the ivory band
  await expect.poll(() => ground(page)).toBe(GROUND.evening.light);
});

test("reduced motion: both scenes show their still, nothing pinned, the index at full", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoReady(page, LAB("en"));
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".cat-opening .scene-line")).toHaveCount(EVENTS_OPENING.shots.filter((s) => s.copyKey).length);
  for (const line of await page.locator(".cat-opening .scene-line").all()) await expect(line).toBeVisible();
  // The majlis' end frame: poured, lit, night.
  for (const layer of ["pour", "tent-bloom"]) await expect(majlis(page).locator(`[data-layer="${layer}"] .scene-light`)).toHaveCSS("opacity", "1");
  await expect(page.locator("nav.svc-index")).toHaveCSS("opacity", "1");
});
