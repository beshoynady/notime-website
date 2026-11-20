import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Self-audit B09 (2026-11-20): a visitor who hovers «Services», reads, then clicks it means
 * "open it". The click used to close the panel the hover had opened.
 */
test("hover opens the mega menu; a later click keeps it open; the next click closes it", async ({ page, isMobile }) => {
  test.skip(isMobile, "the mega menu is desktop-only");
  await gotoReady(page, "/en");
  const trigger = page.locator("button[aria-controls=mega-panel]");
  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.waitForTimeout(800); // well past any grace period
  await trigger.click();
  await page.waitForTimeout(300);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mega-panel")).toBeVisible();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
