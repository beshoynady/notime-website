import { expect, test, type Page } from "@playwright/test";
import { EVENTS_MAJLIS, EVENTS_OPENING } from "../src/content/scenes/events-hospitality";
import { lineSpans } from "../src/lib/scene-math";
import { GROUND, gotoReady } from "./helpers";

/**
 * The Events & Hospitality scenes (Task 3.0, public with the full Events build): the opening's
 * four shots (three on mobile) and three lines on the pin, the index dimmed during shot 1, and the
 * majlis in section V: a 0.6 vh pin with two beats on desktop, a crossing on mobile (D74). The
 * scenes left the lab with batch 2, so these run on the public page (the name is kept for history).
 */
const LAB = (locale: "en" | "ar") => `/${locale}/services/events-hospitality`;
const majlis = (page: Page) => page.locator('#hospitality .scene[data-scene="events-majlis"]');
// N06: the opening is the scene's still (the hero) and nothing else; the pinned build scene that
// followed it on desktop is v1.1 (build and its helpers serve the fixme tests below).
const build = (page: Page) => page.locator('.cat-opening .cat-build .scene[data-scene="events-opening"]');
const buildReady = (page: Page) => page.locator(".cat-opening .cat-build .scene[data-motion]").waitFor({ state: "attached" });
/** Scrolls `vh` screens into the build scene (it starts after the one-screen hero). */
const scrollIntoBuild = (page: Page, vh: number) =>
  page.evaluate((vh) => window.scrollTo(0, document.querySelector(".cat-build")!.getBoundingClientRect().top + scrollY + innerHeight * vh), vh);

test("the public page shows the opening's still and plays the majlis", async ({ page }) => {
  await gotoReady(page, LAB("en"));
  await expect(page.locator('.cat-opening .scene[data-scene="events-opening"][data-mode="still"]')).toHaveCount(1);
  await expect(majlis(page)).toHaveCount(1);
  await expect(majlis(page).locator(".mj-art")).toHaveCount(1); // the drawn dallah and its pour
});

for (const locale of ["en", "ar"] as const) {
  // v1.1: pinned build scene after the category hero (owner scope cut 2026-11-18)
  test.fixme(`${locale}: the build scene plays its shots in order on the pin, one of three lines at a time`, async ({ page, isMobile }) => {
    test.skip(isMobile, "the build scene runs on desktop only (N06)");
    const viewport = "desktop";
    await gotoReady(page, LAB(locale));
    const opening = build(page);
    await buildReady(page);
    await expect(opening.locator(".scene-line")).toHaveCount(3); // D74, P1
    const spans = lineSpans(EVENTS_OPENING.shots, viewport);
    for (const [i, shot] of EVENTS_OPENING.shots.entries()) {
      const range = shot[viewport];
      if (!range) continue;
      const mid = (range[0] + range[1]) / 2;
      await scrollIntoBuild(page, mid);
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
  await expect(page.locator(".pin-spacer")).toHaveCount(0); // N06: no pin at all on phones
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

// D74, P3: the index stays from the first frame (D64) but steps back to 40% during shot 1 of
// the build scene, on its pin (N06); over the hero it is at full.
// v1.1: pinned build scene after the category hero (owner scope cut 2026-11-18)
test.fixme("the index dims during the build scene's first shot, back on hover, focus or the next shot", async ({ page, isMobile }) => {
  test.skip(isMobile, "the build scene runs on desktop only (N06)");
  const viewport = "desktop";
  await gotoReady(page, LAB("en"));
  await buildReady(page);
  const index = page.locator("nav.svc-index");
  await expect(index).toHaveCSS("opacity", "1");
  await scrollIntoBuild(page, 0.1);
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
  await scrollIntoBuild(page, (next[0] + next[1]) / 2);
  await expect(index).toHaveCSS("opacity", "1");
});

// N06: no build scene at any width, so nothing dims the index: it stays at full over the hero.
test("the index stays at full opacity over the hero", async ({ page }) => {
  await gotoReady(page, LAB("en"));
  await page.waitForTimeout(1000);
  await expect(page.locator("nav.svc-index")).toHaveCSS("opacity", "1");
  await page.evaluate(() => window.scrollTo(0, innerHeight * 0.4));
  await page.waitForTimeout(500);
  await expect(page.locator("nav.svc-index")).toHaveCSS("opacity", "1");
});

/** The page ground as #page-stage paints it. */
const ground = (page: Page) => page.locator("#page-stage").evaluate((el) => getComputedStyle(el).backgroundColor);

// A pin adds its spacer below it: the tone zones of everything after it must include that distance
// (measured before the fix: the ground turned one pin length early, so Stage read ivory on ivory
// and the FAQ espresso on espresso). The majlis (section V) pins on desktop.
test("the ground follows the sections below the pinned scenes", async ({ page }) => {
  await gotoReady(page, LAB("en"));
  await page.locator("#hospitality .scene[data-motion]").waitFor({ state: "attached" });
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
  // N06: the hero is the still with the promise as its lead.
  await expect(page.locator(".cat-opening-lead")).toBeVisible();
  // The majlis' end frame: poured, steaming, lit, night.
  await expect(majlis(page).locator('[data-layer="tent-bloom"] .scene-light')).toHaveCSS("opacity", "1");
  await expect(majlis(page).locator(".mj-art")).not.toHaveAttribute("data-motion");
  await expect(majlis(page).locator(".mj-pour")).toHaveCSS("stroke-dashoffset", "0px");
  await expect(page.locator("nav.svc-index")).toHaveCSS("opacity", "1");
});
