import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * The hero on phones (D173): no pin. The five objects gather once on load; a real touch scroll
 * moves the hero away at once, and a rotation keeps the end state with no error.
 */
async function heroState(page: Page) {
  return page.evaluate(() => ({
    heroTop: document.getElementById("hero")!.getBoundingClientRect().top,
    spacers: document.querySelectorAll(".pin-spacer:has(> #hero)").length,
    tc: document.querySelector("#hero [data-hero-tc]")!.textContent,
    objects: [...document.querySelectorAll(".hero-object")].map((el) => Number(getComputedStyle(el).opacity)),
  }));
}

test.describe("hero on phones", () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, "touch / mobile viewport only"));

  test("a real touch scroll moves the hero away: no pin", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, "/en");
    await expect(page.locator("#hero [data-hero-tc]")).toHaveText("TC 00:00:00:00", { timeout: 6000 });
    // Real touch events (touchstart → touchmove → touchend), so the browser's native touch
    // scrolling moves the page. (Input.synthesizeScrollGesture with gestureSourceType
    // "touch" does not scroll in headless Chrome; measured.)
    const cdp = await page.context().newCDPSession(page);
    const touch = (type: "touchStart" | "touchMove" | "touchEnd", y?: number) =>
      cdp.send("Input.dispatchTouchEvent", { type, touchPoints: y === undefined ? [] : [{ x: 195, y }] });
    await touch("touchStart", 760);
    for (let d = 40; d <= 480; d += 40) await touch("touchMove", 760 - d);
    await touch("touchEnd");
    await page.waitForTimeout(500);
    const s = await heroState(page);
    expect(s.spacers, "no pin spacer around the hero").toBe(0);
    expect(s.heroTop, "the hero scrolls away with the finger").toBeLessThan(-200);
  });

  test("rotating keeps the end state, with no error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, "/en");
    await expect(page.locator("#hero [data-hero-tc]")).toHaveText("TC 00:00:00:00", { timeout: 6000 });
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(800);
    const s = await heroState(page);
    expect(s.spacers).toBe(0);
    expect(s.objects).toEqual([1, 1, 1, 1, 1]);
    expect(errors).toEqual([]);
  });
});
