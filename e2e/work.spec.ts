import { expect, test } from "@playwright/test";
import { CLIENT_NAMES, workCards, workCollections } from "../src/content/work";

/** F1, D164: the Work index (cases and Rand's collections) filters through plain links (no JS needed), the case pages stay anonymous, and every entry has its own shareable page. */
test.describe("work index without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("a chip filters the list and marks itself current; an empty view points back (en)", async ({ page }) => {
    await page.goto("/en/work");
    const cases = page.locator(".wk-case");
    await expect(cases).toHaveCount(workCards().length);

    await page.goto("/en/work/filter/production-print-gifts");
    await expect(cases).toHaveCount(2);
    await expect(page.locator('nav#filters a[aria-current="page"]')).toHaveCount(2);

    await page.goto("/en/work/filter/creative-production");
    await expect(cases).toHaveCount(0);
    await page.getByRole("link", { name: "Show all work" }).click();
    await expect(page).toHaveURL(/\/en\/work$/);
  });
});

test.describe("work index chrome", () => {
  test("from six entries the filter row shows, and each card links to its own page", async ({ page }) => {
    await page.goto("/en/work");
    expect(workCards().length).toBeGreaterThanOrEqual(6);
    await expect(page.locator("nav#filters")).toBeVisible();
    const hrefs = await page.locator(".wk-link").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(workCards().map((c) => `/en/work/${c.slug}`));
  });

  const closing = [
    { path: "/en/work", title: "Planning something like this?", label: "Request a quote", href: "/en/contact" },
    { path: "/ar/work", title: "تخطّطون لمشروع كهذا؟", label: "اطلبوا عرض سعر", href: "/ar/contact" },
    { path: "/en/services", title: "Not sure which service you need?", label: "Request a quote", href: "/en/contact" },
    { path: "/ar/services", title: "لم تحدّدوا الخدمة بعد؟", label: "اطلبوا عرض سعر", href: "/ar/contact" },
  ];
  for (const c of closing) {
    test(`${c.path} ends with the closing block`, async ({ page }) => {
      await page.goto(c.path);
      const last = page.locator("main > section").last();
      await expect(last.getByRole("heading", { name: c.title })).toBeVisible();
      await expect(last.getByRole("link", { name: c.label })).toHaveAttribute("href", c.href);
    });
  }
});

test.describe("case pages", () => {
  for (const locale of ["en", "ar"] as const) {
    test(`every case is anonymous and links to the next one (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/work`);
      const hrefs = await page.locator('.wk-case[data-kind="case"] .wk-link').evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
      expect(hrefs).toHaveLength(2);
      for (const href of hrefs) {
        await page.goto(href);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        const text = (await page.locator("body").innerText()).toLowerCase();
        for (const name of CLIENT_NAMES) expect(text, `${href} mentions ${name}`).not.toContain(name.toLowerCase());
        // The cover may show the client (D150, D164); its alt text never names them.
        for (const alt of await page.locator("img").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt") ?? ""))) {
          for (const name of CLIENT_NAMES) expect(alt.toLowerCase(), `${href} alt`).not.toContain(name.toLowerCase());
        }
        await expect(page.locator(".wc-next-link")).toHaveAttribute("href", /\/work\/[a-z-]+$/);
      }
    });
  }
});

test.describe("collection pages (D164)", () => {
  for (const locale of ["en", "ar"] as const) {
    test(`each collection shows its photos with alt text (${locale})`, async ({ page }) => {
      for (const c of workCollections) {
        await page.goto(`/${locale}/work/${c.slug}`);
        await expect(page.getByRole("heading", { level: 1, name: c.label[locale] })).toBeVisible();
        const alts = await page.locator(".wcol-item img").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt") ?? ""));
        expect(alts.length, c.slug).toBe(c.photos.length);
        for (const alt of alts) expect(alt.trim(), c.slug).not.toBe("");
      }
    });
  }

  test("the copy-link button writes the page URL to the clipboard and confirms (en)", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en/work/rooms-we-dressed#top");
    const button = page.getByRole("button", { name: "Copy link" });
    await button.click();
    await expect(page.getByRole("button", { name: "Link copied" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/en\/work\/rooms-we-dressed$/);
  });

  test("an unknown slug is a 404", async ({ page }) => {
    const res = await page.goto("/en/work/not-a-collection");
    expect(res?.status()).toBe(404);
  });
});

test.describe("copy link without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("is not shown, since it can't work", async ({ page }) => {
    await page.goto("/ar/work/rooms-we-dressed");
    await expect(page.locator(".copy-link")).toBeHidden();
  });
});
