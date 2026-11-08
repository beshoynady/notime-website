import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";
import { expectNoShift, recordModuleShifts } from "./modules/helpers";

/**
 * Module slots (Task 2.4), with the agenda-timeline stub. Loaded at #stage (section VI), the
 * conferences slot is far above, outside the one-viewport preload margin.
 */
const PAGE = "/en/services/events-hospitality";
const slot = '[data-module="agenda-timeline"]';

test.describe("module slot", () => {
  test("loads near the viewport, inside the same box", async ({ page }) => {
    await recordModuleShifts(page);
    await gotoReady(page, `${PAGE}#stage`);
    await page.waitForTimeout(1000);
    await expect(page.locator(slot)).not.toHaveAttribute("data-module-ready");
    await expect(page.locator(`${slot} .module-placeholder`)).toHaveCount(1);

    await page.locator(slot).scrollIntoViewIfNeeded();
    await expect(page.locator(slot)).toHaveAttribute("data-module-ready", "");
    await expect(page.locator(slot)).toHaveAttribute("role", "group");
    await expect(page.locator(slot)).toHaveAttribute("aria-labelledby", "conferences-title");
    await expectNoShift(page);
  });

  test("keeps the static fallback when the module chunk fails", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    await gotoReady(page, `${PAGE}#stage`);
    await page.waitForTimeout(1000);
    // Chunk names are hashed: block every script requested from now on (the module's included).
    let aborted = 0;
    await page.route("**/_next/static/chunks/*.js", (r) => (aborted++, r.abort()));
    await page.locator(slot).scrollIntoViewIfNeeded();
    await expect.poll(() => aborted, { message: "the slot requested its chunk" }).toBeGreaterThan(0);
    await page.waitForTimeout(1500);
    await expect(page.locator(`${slot} .module-placeholder`)).toHaveCount(1);
    await expect(page.locator(slot)).not.toHaveAttribute("data-module-ready");
    expect(errors.filter((e) => !/Failed to load resource|ERR_FAILED/.test(e))).toEqual([]);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every slot shows its static fallback", async ({ page }) => {
    await page.goto(PAGE);
    const slots = page.locator("[data-module]");
    await expect(slots).toHaveCount(6);
    await expect(page.locator("[data-module] .module-placeholder")).toHaveCount(6);
    await expect(page.locator("[data-module-ready]")).toHaveCount(0);
  });
});
