import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

const SERVICES_PAGES = [
  "/services",
  "/services/events-hospitality",
  "/services/creative-production",
  "/services/marketing-brand",
  "/services/production-print-gifts",
  "/services/software-digital",
] as const;

const overflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test.describe("no horizontal scroll at 360px", () => {
  test.skip(({ isMobile }) => !isMobile, "runs once, in the mobile project");
  test.use({ viewport: { width: 360, height: 780 } });

  for (const locale of ["en", "ar"] as const) {
    test(`menu closed and open (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      expect(await overflow(page)).toBeLessThanOrEqual(0);

      // Bottom of the page (footer, marquee) too.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      expect(await overflow(page)).toBeLessThanOrEqual(0);

      await page.locator("button[aria-controls=mobile-nav]").click();
      await expect(page.locator("#mobile-nav")).toBeVisible();
      await page.locator("#mobile-nav details").first().locator("summary").click();
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });

    test(`styleguide, top to bottom (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}/styleguide`);
      expect(await overflow(page)).toBeLessThanOrEqual(0);
      // Walk the page so scroll-driven states (open card, parallax, marquee) all run.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });

    // The services overview and the five category pages (D57).
    for (const path of SERVICES_PAGES) {
      test(`${path}, top to bottom (${locale})`, async ({ page }) => {
        await gotoReady(page, `/${locale}${path}`);
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
        });
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });
    }
  }
});

test.describe("How we work starts on the page grid", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  for (const locale of ["en", "ar"] as const) {
    test(`the heading shares the logo's start edge (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      await page.locator("#how-we-work").scrollIntoViewIfNeeded();
      const edges = await page.evaluate(() => {
        const rtl = document.documentElement.dir === "rtl";
        const edge = (el: Element | null) => {
          const r = el!.getBoundingClientRect();
          return rtl ? r.right : r.left;
        };
        return { logo: edge(document.querySelector("header a")), h2: edge(document.querySelector("#how-we-work h2")) };
      });
      expect(Math.abs(edges.h2 - edges.logo)).toBeLessThanOrEqual(2);
    });
  }
});

test.describe("Choose the mood keeps its gutter at 390", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  for (const locale of ["en", "ar"] as const) {
    test(`the text stays inside the gutter (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}/services/events-hospitality`);
      await page.locator("#celebrations").scrollIntoViewIfNeeded();
      const bad = await page.evaluate(() => {
        const root = document.querySelector("#celebrations")!;
        const out: string[] = [];
        for (const el of root.querySelectorAll("p, h2, h3, h4, a, button, figcaption")) {
          if (el.closest(".pstack-cards")) continue; // the photo row
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.left < 15 || r.right > window.innerWidth - 15) out.push(`${el.tagName}.${el.className} ${Math.round(r.left)}-${Math.round(r.right)}`);
        }
        return out;
      });
      expect(bad).toEqual([]);
    });
  }
});
