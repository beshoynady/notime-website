import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";
import { expectNoShift, recordModuleShifts } from "./modules/helpers";

/**
 * Module slots (Task 2.4), on the print-order module (Production, print & gifts). The Events
 * sections that used to carry modules are photo scenes now (D153), so the slot's own behaviour is
 * pinned here: it loads only near the viewport, inside the same box, and a failed chunk leaves the
 * section intact with no error. Loaded at the top of the page, the slot is several screens down,
 * outside the one-viewport preload margin.
 */
const PAGE = "/en/services/production-print-gifts";
const slot = '[data-module="print-order"]';

test.describe("module slot", () => {
  test("loads near the viewport, inside the same box", async ({ page }) => {
    await recordModuleShifts(page);
    await gotoReady(page, PAGE);
    await page.waitForTimeout(1000);
    await expect(page.locator(slot)).toHaveCount(1);
    await expect(page.locator(slot)).not.toHaveAttribute("data-module-ready");

    await page.locator(slot).scrollIntoViewIfNeeded();
    await expect(page.locator(slot)).toHaveAttribute("data-module-ready", "");
    await expect(page.locator(slot)).toHaveAttribute("role", "group");
    await expect(page.locator(slot)).toHaveAttribute("aria-labelledby", "print-ordering-title");
    await expectNoShift(page);
  });

  test("a failed module chunk leaves the section intact, with no error", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    await gotoReady(page, PAGE);
    await page.waitForTimeout(1000);
    // Chunk names are hashed: block every script requested from now on (the module's included).
    let aborted = 0;
    await page.route("**/_next/static/chunks/*.js", (r) => (aborted++, r.abort()));
    await page.locator(slot).scrollIntoViewIfNeeded();
    await expect.poll(() => aborted, { message: "the slot requested its chunk" }).toBeGreaterThan(0);
    await page.waitForTimeout(1500);
    await expect(page.locator(slot)).not.toHaveAttribute("data-module-ready");
    await expect(page.locator("#print-ordering .svc-quote")).toBeVisible();
    expect(errors.filter((e) => !/Failed to load resource|ERR_FAILED/.test(e))).toEqual([]);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Events has no module slot, and a slot elsewhere never claims to be ready", async ({ page }) => {
    await page.goto("/en/services/events-hospitality");
    // Every Events section is a photo scene with Rand's work (D153).
    await expect(page.locator("[data-module]")).toHaveCount(0);
    await expect(page.locator("section.svc .scene")).toHaveCount(6);
    await page.goto(PAGE);
    await expect(page.locator(slot)).toHaveCount(1);
    await expect(page.locator("[data-module-ready]")).toHaveCount(0);
  });
});
