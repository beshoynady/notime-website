import { expect, test } from "@playwright/test";
import { CLIENT_NAMES } from "../src/content/work";

/** F1: the Work index filters through plain links (no JS needed), and the case pages stay anonymous. */
test.describe("work index without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("a chip filters the list and marks itself current; an empty view points back (en)", async ({ page }) => {
    await page.goto("/en/work");
    const cases = page.locator(".wk-case");
    await expect(cases).toHaveCount(2);

    await page.goto("/en/work/filter/production-print-gifts");
    await expect(cases).toHaveCount(1);

    await page.goto("/en/work/filter/creative-production");
    await expect(cases).toHaveCount(0);
    await page.getByRole("link", { name: "Show all work" }).click();
    await expect(page).toHaveURL(/\/en\/work$/);
  });
});

test.describe("work index chrome", () => {
  test("with fewer than six projects there is no filter bar, but filtered views still render", async ({ page }) => {
    await page.goto("/en/work");
    await expect(page.locator(".wk-case")).toHaveCount(2);
    await expect(page.locator("nav#filters")).toHaveCount(0);
    await page.goto("/en/work/filter/production-print-gifts");
    await expect(page.locator(".wk-case")).toHaveCount(1);
    await expect(page.locator("nav#filters")).toHaveCount(0);
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
      const hrefs = await page.locator(".wk-link").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
      expect(hrefs).toHaveLength(2);
      for (const href of hrefs) {
        await page.goto(href);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        const text = (await page.locator("body").innerText()).toLowerCase();
        for (const name of CLIENT_NAMES) expect(text, `${href} mentions ${name}`).not.toContain(name.toLowerCase());
        for (const src of await page.locator("img").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src") ?? ""))) {
          expect(src).not.toMatch(/\/images\/work\/(uae-|egyptair)/);
        }
        await expect(page.locator(".wc-next-link")).toHaveAttribute("href", /\/work\/[a-z-]+$/);
      }
    });
  }
});
