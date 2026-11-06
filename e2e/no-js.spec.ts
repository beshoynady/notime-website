import { expect, test } from "@playwright/test";

/** Review focus 1: with JS disabled the hero is complete and nothing covers it. */
test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const locale of ["en", "ar"] as const) {
    test(`title, CTA and beat are readable; no shutters (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const hero = page.locator("#hero");

      const title = hero.getByRole("heading", { level: 1 });
      await expect(title).toBeVisible();
      await expect(title).toHaveAccessibleName(/.+/);
      const box = await title.boundingBox();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);

      for (const shutter of await hero.locator(".hero-shutter").all()) await expect(shutter).toBeHidden();

      const cta = hero.locator(".hero-sub a");
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", /.+/);

      await expect(hero.locator(".hero-beat")).toBeVisible();
      // The header is not hidden by the intro state.
      expect(await page.locator("[data-header-shell]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    });
  }
});
