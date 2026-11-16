import { expect, test } from "@playwright/test";

/**
 * /links (D110, decisions #34–#36): plain HTML, no framework script; noindex; no Instagram row;
 * the visit's tags reach the next page's forms through sessionStorage.
 */
test.describe("/links", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop" && info.project.name !== "mobile", "two widths are enough"));

  for (const locale of ["en", "ar"] as const) {
    test(`${locale}: plain, noindex, the rows in order, no Instagram`, async ({ page }) => {
      const res = await page.goto(`/${locale}/links`);
      expect(res?.status()).toBe(200);
      expect(res?.headers()["x-robots-tag"]).toContain("noindex");
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
      expect(await page.locator('script[src*="/_next/"]').count()).toBe(0);
      await expect(page.locator("h1")).toHaveCount(1);
      const hrefs = await page.locator(".lk-list a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
      expect(hrefs).toContain(`/${locale}/contact`);
      expect(hrefs).toContain(`/${locale}/services/events-hospitality#celebrations`);
      expect(hrefs.some((h) => h?.includes("instagram.com"))).toBe(false);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("a tagged visit is the session's lead source, and the next page keeps it", async ({ page }) => {
    await page.goto("/en/links?utm_source=instagram&utm_medium=bio");
    const read = () => page.evaluate(() => JSON.parse(sessionStorage.getItem("nt-lead") ?? "null"));
    expect(await read()).toMatchObject({ utm_source: "instagram", utm_medium: "bio", landing: "/en/links" });
    await page.locator('.lk-list a[href="/en/contact"]').click();
    await page.waitForURL("**/en/contact");
    expect(await read()).toMatchObject({ utm_source: "instagram", landing: "/en/links" });
  });

  test("the language link keeps the visit's tags", async ({ page }) => {
    await page.goto("/en/links?utm_source=instagram&utm_medium=bio");
    await expect(page.locator(".lk-lang")).toHaveAttribute("href", "/ar/links?utm_source=instagram&utm_medium=bio");
  });
});
