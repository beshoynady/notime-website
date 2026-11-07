import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/** Pin geometry: hero height + 140% of the viewport (the scroll timeline's `end: "+=140%"`). */
async function pinState(page: Page) {
  return page.evaluate(() => {
    const spacer = document.querySelector<HTMLElement>(".pin-spacer")!;
    const hero = document.getElementById("hero")!;
    const cv = document.querySelector<HTMLCanvasElement>(".hero-canvas")!;
    return {
      spacer: spacer.offsetHeight,
      expected: hero.offsetHeight + innerHeight * 1.4,
      heroTop: hero.getBoundingClientRect().top,
      canvas: { cssW: cv.clientWidth, cssH: cv.clientHeight, heroW: hero.clientWidth, heroH: hero.clientHeight, w: cv.width, h: cv.height },
    };
  });
}

test.describe("hero pin on mobile", () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, "touch / mobile viewport only"));

  test("a real touch scroll pins the hero and releases it after the pin", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, "/en");
    await page.touchscreen.tap(30, 420); // skip the intro
    await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen"));
    // Real touch events (touchstart → touchmove → touchend), so the browser's native touch
    // scrolling moves the page. (Input.synthesizeScrollGesture with gestureSourceType
    // "touch" does not scroll in headless Chrome; measured.)
    const cdp = await page.context().newCDPSession(page);
    /** Finger drags of up to 560px each, 40px per move, until `distance` is covered. */
    const swipe = async (distance: number) => {
      const touch = (type: "touchStart" | "touchMove" | "touchEnd", y?: number) =>
        cdp.send("Input.dispatchTouchEvent", { type, touchPoints: y === undefined ? [] : [{ x: 195, y }] });
      for (let done = 0; done < distance; ) {
        const stroke = Math.min(560, distance - done);
        await touch("touchStart", 760);
        for (let d = 40; d < stroke + 40; d += 40) await touch("touchMove", 760 - Math.min(stroke, d));
        await touch("touchEnd");
        done += stroke;
      }
    };

    await swipe(500); // inside the pin (pin length 1.4 × 844 ≈ 1182px)
    await page.waitForTimeout(400);
    const mid = await pinState(page);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(200);
    expect(Math.abs(mid.heroTop)).toBeLessThanOrEqual(1); // held at the top while pinned
    expect(Math.abs(mid.spacer - mid.expected)).toBeLessThanOrEqual(2);

    await swipe(1400); // past the end of the pin
    await page.waitForTimeout(400);
    expect((await pinState(page)).heroTop).toBeLessThan(-50); // released: scrolls away
  });

  test("resizing mid-pin keeps the pin and the canvas consistent", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, "/en");
    await page.touchscreen.tap(30, 420);
    await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen"));
    await page.evaluate(() => scrollTo(0, innerHeight * 0.7));
    await page.waitForTimeout(400);
    const before = await pinState(page);

    // Height-only change (address bar / keyboard): ignoreMobileResize keeps the pin as it was.
    await page.setViewportSize({ width: 390, height: 700 });
    await page.waitForTimeout(500);
    expect((await pinState(page)).spacer).toBe(before.spacer);

    // Rotation (width changes): the pin re-measures; the canvas follows its box.
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(800); // ScrollTrigger refresh + the canvas's 150 ms debounce
    const after = await pinState(page);
    expect(Math.abs(after.spacer - after.expected)).toBeLessThanOrEqual(2);
    expect(after.canvas.cssW).toBe(after.canvas.heroW);
    expect(after.canvas.cssH).toBe(after.canvas.heroH);
    // Backing store keeps the box's aspect ratio (one scale for both axes).
    expect(Math.abs(after.canvas.w / after.canvas.cssW - after.canvas.h / after.canvas.cssH)).toBeLessThan(0.01);
    expect(errors).toEqual([]);
  });
});
