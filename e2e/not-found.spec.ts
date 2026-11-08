import { expect, test } from "@playwright/test";

/**
 * Unknown URLs answer a real 404 on the first request, never a soft 200 (D68). The category and
 * lab routes set `ensureStatic = "navigation"`, so an unlisted slug waits for its complete render
 * and `notFound()` sets the status before anything is sent. Slugs are unique per run: a repeat
 * request could be answered from cache and hide a first-request 200.
 */
const fresh = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

for (const locale of ["en", "ar"] as const) {
  test.describe(`404 on the first request (${locale})`, () => {
    test.skip(({ isMobile }) => isMobile, "status codes don't depend on the width");

    test("an unknown category", async ({ request }) => {
      const res = await request.get(`/${locale}/services/${fresh("no-such-category")}`);
      expect(res.status()).toBe(404);
      expect(await res.text()).toContain('name="robots" content="noindex"');
    });

    test("an unknown lab page", async ({ request }) => {
      const res = await request.get(`/${locale}/lab/${fresh("nope")}-animatic`);
      expect(res.status()).toBe(404);
    });

    test("an unknown path outside the dynamic routes", async ({ request }) => {
      const res = await request.get(`/${locale}/${fresh("no-such-page")}`);
      expect(res.status()).toBe(404);
    });

    test("a real category still answers 200", async ({ request }) => {
      expect((await request.get(`/${locale}/services/events-hospitality`)).status()).toBe(200);
    });
  });
}
