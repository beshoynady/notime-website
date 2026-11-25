import { expect, test } from "@playwright/test";

/** Review focus 1: with JS disabled the film's opening is complete and nothing covers it (D174). */
test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const locale of ["en", "ar"] as const) {
    test(`title, eyebrow and CTAs are readable (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const hero = page.locator("#hero");

      const title = hero.getByRole("heading", { level: 1 });
      await expect(title).toBeVisible();
      await expect(title).toHaveAccessibleName(/.+/);
      const box = await title.boundingBox();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);

      const ctas = hero.locator(".hero-actions a");
      await expect(ctas).toHaveCount(2);
      for (const cta of await ctas.all()) {
        await expect(cta).toBeVisible();
        await expect(cta).toHaveAttribute("href", /.+/);
      }

      await expect(hero.locator(".hero-eyebrow")).toBeVisible();
      await expect(hero.locator(".hero-beat")).toHaveCount(0);
      // The header is never hidden.
      expect(await page.locator("[data-header-shell]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    });
  }
});
