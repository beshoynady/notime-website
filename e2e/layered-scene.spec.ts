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

const motionReady = (page: Page) => page.locator(".scene[data-motion]").waitFor({ state: "attached" });
const enterX = (page: Page, layer: string) =>
  page.locator(`[data-layer="${layer}"] .scene-enter`).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);

test.beforeEach(async ({ request }) => {
  test.skip((await request.get(LAB("en"))).status() !== 200, "lab is off: build with NEXT_PUBLIC_ENABLE_LAB=1");
});

test("reduced motion: the still, with no pin and every shot line shown", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoReady(page, LAB("en"));
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  const lines = page.locator(".scene-line");
  await expect(lines).toHaveCount(DRAFT_SCENE.shots.length);
  for (const line of await lines.all()) await expect(line).toBeVisible();
  // Every entrance is done: the subject that enters in shot 2 is in place and opaque.
  const subject = page.locator('[data-layer="L1 subject"] .scene-enter');
  await expect(subject).toHaveCSS("opacity", "1");
  expect(await enterX(page, "L2 from start")).toBe(0);
  await expect(page.locator(".scene")).not.toHaveAttribute("data-motion");
});

test("motion: the pin stays within its limit and the shots follow the scroll", async ({ page, isMobile }) => {
  const viewport = isMobile ? "mobile" : "desktop";
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
  await page.evaluate((vh) => window.scrollTo(0, innerHeight * vh), (from + to) / 2);
  await expect(page.locator(".scene")).toHaveAttribute("data-shot-active", "2");
  await expect(page.locator('.scene-line[data-shot="2"]')).toBeVisible();
  await expect(page.locator('.scene-line[data-shot="0"]')).toBeHidden();
});

for (const [locale, sign] of [
  ["en", -1],
  ["ar", 1],
] as const) {
  test(`${locale}: a layer entering from inline-start starts on the ${sign < 0 ? "left" : "right"}`, async ({ page }) => {
    await gotoReady(page, LAB(locale));
    await motionReady(page);
    expect(Math.sign(await enterX(page, "L2 from start"))).toBe(sign);
  });
}

test("the H1 is the LCP element over the scene", async ({ page }) => {
  await gotoReady(page, LAB("en"));
  expect(await lcpEntry(page)).toEqual({ element: "H1#category-title", url: "" });
});
