import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

test.describe("mega menu · keyboard", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 900, "desktop only (≥900px)");

  for (const locale of ["en", "ar"] as const) {
    test(`opens, navigates and closes with the keyboard (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      const trigger = page.locator("button[aria-controls=mega-panel]");
      const panel = page.locator("#mega-panel");

      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(panel).toBeVisible();

      // Tab moves into the panel: the first category link.
      await page.keyboard.press("Tab");
      const first = panel.locator("ul").first().locator("a").first();
      await expect(first).toBeFocused();
      await expect(first).toHaveAttribute("aria-current", "true");

      // Focus on category III swaps the services column.
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      const third = panel.locator("ul").first().locator("li").nth(2).locator("a");
      await expect(third).toBeFocused();
      await expect(third).toHaveAttribute("aria-current", "true");
      await expect(panel.locator("ul.grid-cols-2 li")).toHaveCount(6);

      // Esc closes and returns focus to the trigger.
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      // Reopen; Shift+Tab out of the trigger region closes it.
      await page.keyboard.press("Enter");
      await expect(panel).toBeVisible();
      await page.keyboard.press("Shift+Tab");
      await expect(panel).toBeHidden();
    });

    test(`backdrop click closes; links close the panel (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      const trigger = page.locator("button[aria-controls=mega-panel]");
      const panel = page.locator("#mega-panel");
      await trigger.click();
      await expect(panel).toBeVisible();
      await page.mouse.click(700, 880); // below the panel → backdrop
      await expect(panel).toBeHidden();

      await trigger.click();
      await panel.locator("ul.grid-cols-2 a").first().click();
      await expect(panel).toBeHidden();
    });
  }
});
