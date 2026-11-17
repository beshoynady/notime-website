import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * A visitor who scrolls before the pins are built stays where they are (final pass, 2026-11-17).
 * On a slow CPU the page is usable before ScrollTrigger builds the Events opening's pin; building
 * it used to move the visitor up by one pin length (1800 px at 1440×900), through Chrome's scroll
 * anchoring (holdScroll, src/lib/gsap.ts). 8× CPU through CDP, so this runs on Chromium only.
 */
test("building the opening's pin doesn't move a visitor who is already below it", async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== "chromium" || isMobile, "CPU throttling through CDP; the desktop pin");
  test.setTimeout(120_000); // 8x CPU: the page takes ~10x longer to build its pins
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 8 });
  await gotoReady(page, "/en/services/events-hospitality");
  const target = await page.evaluate(() => {
    const faq = document.querySelector("section.cat-faq")!;
    const y = Math.round(faq.getBoundingClientRect().top + scrollY - innerHeight * 0.55);
    window.scrollTo(0, y);
    return y;
  });
  const builtBefore = await page.locator(".pin-spacer").count();
  await page.waitForFunction(() => document.querySelectorAll(".pin-spacer").length > 0, null, { timeout: 60_000 });
  await page.waitForTimeout(1000);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  test.info().annotations.push({ type: "pins built after the scroll", description: String(builtBefore === 0) });
  const now = await page.evaluate(() => scrollY);
  expect(Math.abs(now - target)).toBeLessThanOrEqual(2);
});

/**
 * The floor that prevents it (globals.css, "Pin reservations") must never add space: on every
 * pinned wrapper it is at most the pin's own height plus the distance ScrollTrigger reserves.
 */
for (const path of ["/en", "/en/services/events-hospitality", "/ar/services/production-print-gifts", "/en/services/software-digital"]) {
  test(`${path}: every pin's floor fits inside its real height`, async ({ page }) => {
    await gotoReady(page, path);
    // A page may have no pin at this width (Software pins on desktop only): wait less than the test's own limit.
    await page.waitForFunction(() => document.querySelectorAll(".pin-spacer").length > 0, null, { timeout: 10_000 }).catch(() => {});
    const over = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".hero-pin.pin-spacer, .scene-pin.pin-spacer, .process-pin.pin-spacer")].map((w) => {
        const pin = w.firstElementChild as HTMLElement;
        const floor = parseFloat(getComputedStyle(w).minHeight) || 0;
        const real = pin.offsetHeight + (parseFloat(w.style.paddingBottom) || 0);
        // A pin is one screen: one stretched by the floor was measured at that height and kept it.
        return { wrapper: w.className, excess: Math.round(floor - real), pinOverScreen: Math.round(pin.offsetHeight - innerHeight) };
      }),
    );
    for (const o of over) {
      expect(o.excess, o.wrapper).toBeLessThanOrEqual(1);
      expect(o.pinOverScreen, `${o.wrapper}: the pin is taller than the screen`).toBeLessThanOrEqual(1);
    }
  });
}
