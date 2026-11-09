import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";
import { expectNoShift, recordModuleShifts } from "./modules/helpers";

/**
 * Module slots (Task 2.4), with the agenda-timeline stub. Loaded at #stage (section VI), the
 * conferences slot is far above, outside the one-viewport preload margin.
 *
 * The production build renders no fallback box while a module is unbuilt (fill or hide, D78; the
 * "in design" box shows only in review mode), so a slot's fallback here is empty. The slot itself,
 * its loading and its failure handling are what these tests pin.
 */
const FALLBACK = process.env.NEXT_PUBLIC_REVIEW_MODE === "1" ? 1 : 0;
const PAGE = "/en/services/events-hospitality";
const slot = '[data-module="agenda-timeline"]';

test.describe("module slot", () => {
  test("loads near the viewport, inside the same box", async ({ page }) => {
    await recordModuleShifts(page);
    await gotoReady(page, `${PAGE}#stage`);
    await page.waitForTimeout(1000);
    await expect(page.locator(slot)).not.toHaveAttribute("data-module-ready");
    await expect(page.locator(`${slot} .module-placeholder`)).toHaveCount(FALLBACK);

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
    await expect(page.locator(`${slot} .module-placeholder`)).toHaveCount(FALLBACK);
    await expect(page.locator(slot)).not.toHaveAttribute("data-module-ready");
    expect(errors.filter((e) => !/Failed to load resource|ERR_FAILED/.test(e))).toEqual([]);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every slot renders its static fallback (empty in production)", async ({ page }) => {
    await page.goto(PAGE);
    const slots = page.locator("[data-module]");
    await expect(slots).toHaveCount(6);
    await expect(page.locator("[data-module] .module-placeholder")).toHaveCount(6 * FALLBACK);
    await expect(page.locator("[data-module-ready]")).toHaveCount(0);
  });
});
