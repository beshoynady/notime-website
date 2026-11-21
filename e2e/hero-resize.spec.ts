import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/** Pin geometry: hero height + 100% of the viewport (the scroll timeline's `end: "+=100%"`, N05). */
async function pinState(page: Page) {
  return page.evaluate(() => {
    const spacer = document.querySelector<HTMLElement>(".pin-spacer")!;
    const hero = document.getElementById("hero")!;
    return {
      spacer: spacer.offsetHeight,
      expected: hero.offsetHeight + innerHeight * 1.0,
      heroTop: hero.getBoundingClientRect().top,
    };
  });
}

test.describe("hero pin on mobile", () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, "touch / mobile viewport only"));

  test("a real touch scroll pins the hero and releases it after the pin", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, "/en");
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

    await swipe(500); // inside the pin (pin length 1.0 × 844 = 844px)
    await page.waitForTimeout(400);
    const mid = await pinState(page);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(200);
    expect(Math.abs(mid.heroTop)).toBeLessThanOrEqual(1); // held at the top while pinned
    expect(Math.abs(mid.spacer - mid.expected)).toBeLessThanOrEqual(2);

    await swipe(1400); // past the end of the pin
    await page.waitForTimeout(400);
    expect((await pinState(page)).heroTop).toBeLessThan(-50); // released: scrolls away
  });

  test("resizing mid-pin keeps the pin consistent", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, "/en");
    await page.evaluate(() => scrollTo(0, innerHeight * 0.5)); // mid-pin
    await page.waitForTimeout(400);
    const before = await pinState(page);

    // Height-only change (address bar / keyboard): ignoreMobileResize keeps the pin as it was.
    await page.setViewportSize({ width: 390, height: 700 });
    await page.waitForTimeout(500);
    expect((await pinState(page)).spacer).toBe(before.spacer);

    // Rotation (width changes): the pin re-measures.
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(800); // ScrollTrigger refresh
    const after = await pinState(page);
    expect(Math.abs(after.spacer - after.expected)).toBeLessThanOrEqual(2);
    expect(errors).toEqual([]);
  });
});
