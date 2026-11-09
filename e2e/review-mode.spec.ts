import { expect, test } from "@playwright/test";
import { getCategories } from "../src/content";
import { gotoReady } from "./helpers";

/**
 * Review mode (v1 plan, Task A1). The production build shows none of it (D78); the review build
 * (NEXT_PUBLIC_REVIEW_MODE=1, `npm run review:build && npm run review:start`) shows the banner,
 * a reference number on every section and badged example blocks. The review half runs against
 * PW_REVIEW_URL (e.g. http://localhost:3200) and is skipped, with that reason, without it.
 */
const PAGES = ["/en", "/ar", ...getCategories().flatMap((c) => [`/en/services/${c.slug}`, `/ar/services/${c.slug}`])];
const REVIEW_TEXT = /Example – to be replaced|مثال – يُستبدل|Review version – not public|نسخة مراجعة – غير منشورة/;

test.describe("production build: no review content", () => {
  for (const path of PAGES) {
    test(`${path}`, async ({ page }) => {
      await gotoReady(page, path);
      await expect(page.locator("[data-ref]")).toHaveCount(0);
      await expect(page.locator("[data-example]")).toHaveCount(0);
      expect(await page.locator("body").innerText()).not.toMatch(REVIEW_TEXT);
      expect(await page.locator("html").getAttribute("data-review")).toBeNull();
    });
  }
});

test.describe("review build", () => {
  const base = process.env.PW_REVIEW_URL;
  test.skip(!base, "needs the review build: npm run review:build && npm run review:start, then PW_REVIEW_URL=http://localhost:3200");

  test("is noindexed and closed to crawlers", async ({ request }) => {
    const res = await request.get(`${base}/en`);
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
    expect(await (await request.get(`${base}/robots.txt`)).text()).toMatch(/Disallow: \//);
  });

  for (const locale of ["en", "ar"] as const) {
    test(`homepage (${locale}): banner, unique section numbers, badged examples`, async ({ page }) => {
      await gotoReady(page, `${base}/${locale}`);
      const banner = page.locator(".review-banner");
      await expect(banner).toBeVisible();
      await expect(banner).toHaveText(locale === "en" ? "Review version – not public" : "نسخة مراجعة – غير منشورة");
      expect(await banner.evaluate((el) => getComputedStyle(el).position)).toBe("fixed");
      const refs = await page.locator("[data-ref]").evaluateAll((els) => els.map((e) => e.getAttribute("data-ref")));
      expect(refs).toEqual(expect.arrayContaining(["H-01", "H-02", "H-03", "H-11", "H-12"]));
      expect(new Set(refs).size).toBe(refs.length);
      const examples = page.locator("[data-example]");
      expect(await examples.count()).toBeGreaterThan(0);
      for (const block of await examples.all()) {
        await expect(block.locator(".example-badge")).toHaveText(locale === "en" ? "Example – to be replaced" : "مثال – يُستبدل");
      }
      // RTL: the reference tag sits at the inline end, which is the left in Arabic.
      const ref = page.locator('[data-ref="H-02"]');
      await ref.scrollIntoViewIfNeeded();
      const box = (await ref.boundingBox())!;
      const width = page.viewportSize()!.width;
      if (locale === "en") expect(box.x).toBeGreaterThan(width / 2);
      else expect(box.x + box.width).toBeLessThan(width / 2);
    });
  }

  test("category page: every service section is numbered", async ({ page }) => {
    const c = getCategories()[0];
    await gotoReady(page, `${base}/en/services/${c.slug}`);
    const services = await page.locator("section.svc").count();
    expect(await page.locator("section.svc > [data-ref]").count()).toBe(services);
  });
});
