import { expect, test, type Page } from "@playwright/test";
import { DRAFT_SCENE } from "../src/content/scenes";
import { gotoReady, lcpEntry } from "./helpers";

/**
 * LayeredScene (Task 2.7; D64) on the hidden lab route that shows the draft scene
 * (`draft-animatic`, on the Studio page; every category has its own opening since D83). Needs a build with NEXT_PUBLIC_ENABLE_LAB=1; skipped
 * otherwise (the route answers 404).
 */
const LAB = (locale: "en" | "ar") => `/${locale}/lab/draft-animatic`;
const PIN_LIMIT = { desktop: 2.0, mobile: 1.2 };

// N06: the opening is the scene's still (the hero), then the pinned build scene (desktop, motion).
const HERO = '.scene[data-mode="still"]';
const BUILD = ".cat-build .scene";
const motionReady = (page: Page) => page.locator(`${BUILD}[data-motion]`).waitFor({ state: "attached" });
const enterX = (page: Page, layer: string, scope = BUILD) =>
  page.locator(`${scope} [data-layer="${layer}"] .scene-enter`).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
/** Scrolls `vh` screens into the build scene (it starts after the one-screen hero). */
const scrollIntoBuild = (page: Page, vh: number) =>
  page.evaluate((vh) => window.scrollTo(0, document.querySelector(".cat-build")!.getBoundingClientRect().top + scrollY + innerHeight * vh), vh);

test.beforeEach(async ({ request }) => {
  test.skip((await request.get(LAB("en"))).status() !== 200, "lab is off: build with NEXT_PUBLIC_ENABLE_LAB=1");
});

test("reduced motion: the still, with no pin, the promise as the lead, no build scene", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoReady(page, LAB("en"));
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".cat-build")).toBeHidden();
  await expect(page.locator(".cat-opening-lead")).toBeVisible();
  // Every entrance is done: the subject that enters in shot 2 is in place and opaque.
  const subject = page.locator(`${HERO} [data-layer="L1 subject"] .scene-enter`);
  await expect(subject).toHaveCSS("opacity", "1");
  expect(await enterX(page, "L2 from start", HERO)).toBe(0);
  for (const scene of await page.locator(".scene").all()) await expect(scene).not.toHaveAttribute("data-motion");
});

test("motion: the hero is the still at every width; the build scene pins on desktop only", async ({ page, isMobile }) => {
  await gotoReady(page, LAB("en"));
  await expect(page.locator(`${HERO} [data-layer="L1 subject"] .scene-enter`)).toHaveCSS("opacity", "1");
  await expect(page.locator(HERO)).not.toHaveAttribute("data-motion");
  if (isMobile) {
    await page.waitForTimeout(1000);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator(`${BUILD}[data-motion]`)).toHaveCount(0);
  }
});

test("motion: the pin stays within its limit and the shots follow the scroll", async ({ page, isMobile }) => {
  test.skip(isMobile, "the build scene pins on desktop only (N06)");
  const viewport = "desktop";
  await gotoReady(page, LAB("en"));
  await motionReady(page);
  const pin = await page.evaluate(() => {
    const spacer = document.querySelector<HTMLElement>(".pin-spacer")!;
    return (spacer.offsetHeight - spacer.firstElementChild!.getBoundingClientRect().height) / innerHeight;
  });
  expect(pin).toBeGreaterThan(0);
  expect(pin).toBeLessThanOrEqual(PIN_LIMIT[viewport] + 0.01);

  // The third shot (index 2) plays at both widths; scroll to the middle of its range.
  const [from, to] = DRAFT_SCENE.shots[2][viewport]!;
  await scrollIntoBuild(page, (from + to) / 2);
  await expect(page.locator(BUILD)).toHaveAttribute("data-shot-active", "2");
  await expect(page.locator(`${BUILD} .scene-line[data-shot="2"]`)).toBeVisible();
  await expect(page.locator(`${BUILD} .scene-line[data-shot="0"]`)).toBeHidden();
});

for (const [locale, sign] of [
  ["en", -1],
  ["ar", 1],
] as const) {
  test(`${locale}: a layer entering from inline-start starts on the ${sign < 0 ? "left" : "right"}`, async ({ page, isMobile }) => {
    test.skip(isMobile, "the build scene runs on desktop only (N06)");
    await gotoReady(page, LAB(locale));
    await motionReady(page);
    expect(Math.sign(await enterX(page, "L2 from start"))).toBe(sign);
  });
}

test("the H1 is the LCP element over the scene", async ({ page }) => {
  await gotoReady(page, LAB("en"));
  expect(await lcpEntry(page)).toEqual({ element: "H1#category-title", url: "" });
});
