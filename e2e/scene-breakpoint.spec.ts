import { expect, test } from "@playwright/test";

/**
 * Scenes pin from 1024px (D151, the owner's "laptop"); below that they pass, with no pin and no
 * reserved distance. The 9:16 art direction still switches at 900px (SceneImage).
 */
test.skip(({ isMobile }) => isMobile, "window widths are a desktop concern");

const PAGE = "/en/services/events-hospitality";
const SCENE = '[data-scene="events-majlis"]';

async function motionAt(page: import("@playwright/test").Page, width: number) {
  await page.setViewportSize({ width, height: 800 });
  await page.goto(PAGE);
  const scene = page.locator(SCENE);
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-motion", /desktop|mobile/);
  return scene.getAttribute("data-motion");
}

test("a tablet-width window plays the scene without a pin", async ({ page }) => {
  expect(await motionAt(page, 1000)).toBe("mobile");
});

test("a laptop pins it", async ({ page }) => {
  expect(await motionAt(page, 1280)).toBe("desktop");
});

test("narrowing the window below 1024px mid-scene releases the pin", async ({ page }) => {
  await motionAt(page, 1280);
  const tall = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width: 1000, height: 800 });
  await expect(page.locator(SCENE)).toHaveAttribute("data-motion", "mobile");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(tall);
  await page.locator("#stage-title").scrollIntoViewIfNeeded();
  await expect(page.locator("#stage-title")).toBeInViewport();
});
