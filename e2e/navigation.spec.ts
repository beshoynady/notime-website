import { expect, test, type Page } from "@playwright/test";
import { getCategories, getServices } from "../src/content";
import { expectLanded, gotoReady } from "./helpers";

/**
 * Every way into a category page reaches it (D57): the mega menu (desktop), the mobile menu, the
 * homepage category cards and "All services". Regression: until 2026-11-09 all of them pointed
 * at the homepage (`/#services`), so no category page was reachable from the UI.
 */
const categories = getCategories();

async function expectCategory(page: Page, locale: "en" | "ar", i: number) {
  const c = categories[i];
  await expect(page).toHaveURL(new RegExp(`/${locale}/services/${c.slug}(#.*)?$`), { timeout: 15_000 }); // a client navigation to a large page: ~3 s on this machine
  // Software is its own sales page (D96), with its own headline.
  if (c.slug === "software-digital") await expect(page.locator("#sw-title")).toBeVisible();
  else await expect(page.locator("#category-title")).toHaveText(c.title[locale]);
}

for (const locale of ["en", "ar"] as const) {
  test.describe(`navigation to the category pages (${locale})`, () => {
    test("mega menu: each category, then a service lands on its section", async ({ page }) => {
      test.skip((page.viewportSize()?.width ?? 0) < 900, "desktop only (≥900px)");
      test.setTimeout(180_000); // six full page loads and six client navigations (~3 s each here) in one test
      const open = async () => {
        await gotoReady(page, `/${locale}`);
        await page.locator("button[aria-controls=mega-panel]").click();
        await expect(page.locator("#mega-panel")).toBeVisible();
      };
      for (let i = 0; i < categories.length; i++) {
        await open();
        await page.locator("#mega-panel ul").first().locator("li").nth(i).locator("a").click();
        await expectCategory(page, locale, i);
      }
      // A service of the last category: hover its row, then pick its first service.
      await open();
      await page.locator("#mega-panel ul").first().locator("li").nth(4).locator("a").hover();
      const service = getServices(categories[4].slug)[0];
      // Switching category cross-fades the service lists, so for ~150 ms the previous category's
      // list is still in the DOM (AnimatePresence popLayout). Wait for it to go before picking.
      const services = page.locator("#mega-panel ul.grid-cols-2");
      await expect(services).toHaveCount(1);
      await expect(services.first().locator("a").first()).toHaveAttribute("href", new RegExp(`/services/${categories[4].slug}#${service.anchor}$`));
      await services.first().locator("a").first().click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/services/${categories[4].slug}#${service.anchor}$`), { timeout: 15_000 });
      await expectLanded(page, service.anchor);
    });

    test("mobile menu: each category, then a service lands on its section", async ({ page }) => {
      test.skip((page.viewportSize()?.width ?? 9999) >= 900, "mobile only (<900px)");
      const open = async (i: number) => {
        await gotoReady(page, `/${locale}`);
        await page.locator("button[aria-controls=mobile-nav]").click();
        const item = page.locator("#mobile-nav details").nth(i);
        await item.locator("summary").click();
        return item;
      };
      for (let i = 0; i < categories.length; i++) {
        const item = await open(i);
        await item.locator("ul a").first().click(); // "View category"
        await expectCategory(page, locale, i);
      }
      const item = await open(1);
      const service = getServices(categories[1].slug)[0];
      await item.locator("ul a").nth(1).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/services/${categories[1].slug}#${service.anchor}$`));
      await expectLanded(page, service.anchor);
    });

    test("homepage category cards and 'All services'", async ({ page }) => {
      for (let i = 0; i < categories.length; i++) {
        await gotoReady(page, `/${locale}`);
        await page.locator("#services a.cat").nth(i).click();
        await expectCategory(page, locale, i);
      }
      await gotoReady(page, `/${locale}`);
      await page.locator("#services .cats-foot a").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/services$`));
    });
  });
}

/** N12: Events sits in the desktop main menu, between Services and Digital Solutions. */
const MENU = {
  en: ["Services", "Events", "Digital Solutions", "Work", "About"],
  ar: ["الخدمات", "الفعاليات", "الحلول الرقمية", "أعمالنا", "من نحن"],
} as const;

test.describe("main menu: Events (N12)", () => {
  test.beforeEach(({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 900, "desktop project only");
  });

  for (const locale of ["en", "ar"] as const) {
    test(`the main menu reads ${MENU[locale].join(", ")} (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      const items = page.locator("#site-header nav > div > button, #site-header nav > a");
      const texts = (await items.allTextContents()).map((s) => s.replace(/\s+/g, " ").trim());
      expect(texts).toEqual([...MENU[locale]]);
    });
  }

  test("Events is current on its page", async ({ page }) => {
    await gotoReady(page, "/en/services/events-hospitality");
    const events = page.locator("#site-header nav a", { hasText: "Events" });
    await expect(events).toHaveAttribute("aria-current", "page");
    await expect(page.locator("#site-header nav a[aria-current=page]")).toHaveCount(1);
  });

  test("EN hides Events between 900 and 1023, AR keeps it; no header item wraps", async ({ page }) => {
    for (const [locale, name] of [["en", "Events"], ["ar", "الفعاليات"]] as const) {
      for (const width of [900, 960, 1023, 1024]) {
        await page.setViewportSize({ width, height: 800 });
        await gotoReady(page, `/${locale}`);
        const events = page.locator("#site-header nav a", { hasText: name });
        if (locale === "en" && width < 1024) await expect(events).toBeHidden();
        else await expect(events).toBeVisible();
        const layout = await page.evaluate(() => {
          const nav = document.querySelector("#site-header nav")!;
          const items = [...nav.querySelectorAll(":scope > div > button, :scope > a")].filter((e) => e.getClientRects().length > 0);
          // Lines of text per item: distinct line boxes of a Range over its contents.
          const lines = items.map((e) => {
            const tops = new Set<number>();
            const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
            for (let t = walker.nextNode(); t; t = walker.nextNode()) {
              const range = document.createRange();
              range.selectNodeContents(t);
              for (const r of range.getClientRects()) if (r.width > 0) tops.add(Math.round(r.top));
            }
            return { text: e.textContent?.trim(), lines: tops.size };
          });
          const n = nav.getBoundingClientRect();
          const cluster = nav.nextElementSibling!.getBoundingClientRect();
          const logo = nav.previousElementSibling!.getBoundingClientRect();
          const overlap = (a: DOMRect, b: DOMRect) => a.left < b.right && b.left < a.right;
          return { lines, clusterOverlap: overlap(n, cluster), logoOverlap: overlap(n, logo) };
        });
        const where = `${locale}@${width}`;
        expect(layout.lines.length, where).toBe(locale === "en" && width < 1024 ? 4 : 5);
        for (const l of layout.lines) expect(l.lines, `${where}: "${l.text}" wraps`).toBe(1);
        expect(layout.clusterOverlap, `${where}: nav overlaps the language toggle / quote button`).toBe(false);
        expect(layout.logoOverlap, `${where}: nav overlaps the logo`).toBe(false);
      }
    }
  });
});
