import { expect, test, type Page } from "@playwright/test";
import { getCategories, getServices, type CategoryTheme } from "../src/content";
import { gotoReady } from "./helpers";

/**
 * Category pages · structure and themes (Task 2.5), every category in EN and AR: one H1, the six
 * service sections in data order, the FAQ and the quote block, JSON-LD, no overflow, and the
 * header never dark-on-dark (it follows each section's tone) while the page ground is the theme's.
 */
const GROUND: Record<CategoryTheme, { dark?: string; light?: string }> = {
  evening: { dark: "rgb(46, 32, 23)", light: "rgb(245, 233, 211)" }, // espresso, ivory "morning after" band
  studio: { dark: "rgb(13, 8, 5)" }, // night
  editorial: { light: "rgb(245, 233, 211)" }, // ivory
  workshop: { light: "rgb(234, 212, 171)" }, // champagne
  interface: { light: "rgb(245, 233, 211)" }, // ivory
};

const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

/** Scrolls so that `y` (a document offset of the section's top, minus `line`) is at the top. */
const scrollSectionTo = (page: Page, i: number, line: "header" | "mid") =>
  page.evaluate(
    ([i, line]) => {
      const s = document.querySelectorAll<HTMLElement>("#page-stage section[data-tone]")[i as number];
      const header = document.getElementById("site-header")!.getBoundingClientRect().bottom;
      const at = line === "header" ? header : innerHeight * 0.5;
      window.scrollTo(0, s.getBoundingClientRect().top + scrollY - at + 12);
    },
    [i, line] as const,
  );

for (const category of getCategories()) {
  const services = getServices(category.slug);
  for (const locale of ["en", "ar"] as const) {
    const path = `/${locale}/services/${category.slug}`;

    test.describe(`${path}`, () => {
      test("overflow: none at this width, top to bottom", async ({ page }) => {
        await gotoReady(page, path);
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
        });
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });

      test.describe("desktop only", () => {
        test.skip(({ isMobile }) => isMobile, "structure is the same at every width");

        // FIXME(Task 2.5): the FAQ and quote block are not built yet.
        test.fixme("one H1, six sections in data order, FAQ and quote block", async ({ page }) => {
          await gotoReady(page, path);
          await expect(page.locator("h1")).toHaveCount(1);
          const ids = await page.locator(".cat-sections > section[id]").evaluateAll((els) => els.map((e) => e.id));
          expect(ids).toEqual(services.map((s) => s.anchor));
          for (const s of services) {
            await expect(page.locator(`#${s.anchor} h2#${s.anchor}-title`)).toHaveText(s.title[locale]);
          }
          await expect(page.locator("section.cat-faq h2")).toHaveCount(1);
          await expect(page.locator("section.cat-faq details")).toHaveCount(category.faq.length);
          await expect(page.locator("section#quote h2")).toHaveCount(1);
        });

        // FIXME(Task 2.5): the FAQ is not built yet.
        test.fixme("the FAQ opens and closes with Enter", async ({ page }) => {
          await gotoReady(page, path);
          const item = page.locator("section.cat-faq details").first();
          await item.locator("summary").focus();
          await page.keyboard.press("Enter");
          await expect(item).toHaveAttribute("open", "");
          await expect(item.locator("summary + *")).toBeVisible();
          await page.keyboard.press("Enter");
          await expect(item).not.toHaveAttribute("open");
        });

        test("JSON-LD parses: ItemList, BreadcrumbList, FAQPage once the FAQ is written", async ({ page }) => {
          await gotoReady(page, path);
          const types = await page.locator('script[type="application/ld+json"]').evaluateAll((els) =>
            els.flatMap((e) => [JSON.parse(e.textContent ?? "")].flat().map((n: { "@type": string }) => n["@type"])),
          );
          expect(types).toEqual(expect.arrayContaining(["ItemList", "BreadcrumbList"]));
          // FAQPage only for written answers (jsonld.ts); the placeholders are TODO keys until Task 3.1.
          const written = category.faq.some((f) => !f.a[locale].startsWith("TODO"));
          expect(types.includes("FAQPage")).toBe(written);
        });

        // FIXME(Task 2.5): the theme grounds (workshop champagne, studio night, the Evening ivory band) are not built yet.
        test.fixme("header tone follows each section; the page ground is the theme's", async ({ page }) => {
          await gotoReady(page, path);
          const tones = await page
            .locator("#page-stage section[data-tone]")
            .evaluateAll((els) => els.filter((e) => e.checkVisibility()).map((e) => [(e as HTMLElement).dataset.tone, (e as HTMLElement).dataset.header ?? "", e.closest("main") ? "main" : "outside"]));
          const header = page.locator("#site-header");
          const stage = page.locator("#page-stage");
          for (const [i, [tone, headerKind, where]] of tones.entries()) {
            await scrollSectionTo(page, i, "header");
            await expect(header).toHaveAttribute("data-header-tone", headerKind === "hero" ? "hero" : tone!);
            if (where !== "main") continue; // the footer paints its own ground
            await scrollSectionTo(page, i, "mid");
            const ground = GROUND[category.theme][tone as "dark" | "light"];
            expect(ground, `${category.theme} has a ${tone} ground`).toBeDefined();
            await expect.poll(() => stage.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(ground);
          }
        });
      });
    });
  }
}
