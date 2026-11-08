import { expect, test, type Page } from "@playwright/test";
import { getCategories, getServices, type CategoryTheme } from "../src/content";
import { END_TONE, THEME_TONE } from "../src/components/category/theme";
import { gotoReady, lcpEntry } from "./helpers";

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

/** Scrolls the section's top to just above the header's bottom (or mid-viewport). Returns false
 * when the page ends first (the footer under a short last section never reaches the header). */
const scrollSectionTo = (page: Page, i: number, line: "header" | "mid") =>
  page.evaluate(
    ([i, line]) => {
      const s = document.querySelectorAll<HTMLElement>("#page-stage section[data-tone]")[i as number];
      const header = document.getElementById("site-header")!.getBoundingClientRect().bottom;
      const at = line === "header" ? header : innerHeight * 0.5;
      window.scrollTo(0, s.getBoundingClientRect().top + scrollY - at + 12);
      return s.getBoundingClientRect().top <= at;
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

      if (END_TONE[category.theme] !== THEME_TONE[category.theme]) {
        test("the index has scrolled away before the ground turns to Act 3's tone", async ({ page }) => {
          await gotoReady(page, path);
          // ToneController turns the ground when the FAQ's top crosses 55% of the viewport.
          const overlap = await page.evaluate(async () => {
            const faq = document.querySelector("section.cat-faq")!;
            window.scrollTo(0, faq.getBoundingClientRect().top + scrollY - innerHeight * 0.55);
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
            const header = document.getElementById("site-header")!.getBoundingClientRect().bottom;
            return document.querySelector(".cat-index-track .svc-index")!.getBoundingClientRect().bottom - header;
          });
          expect(overlap).toBeLessThanOrEqual(0);
        });
      }

      test.describe("desktop only", () => {
        test.skip(({ isMobile }) => isMobile, "structure is the same at every width");

        test("one H1, six sections in data order, FAQ and quote block", async ({ page }) => {
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

        test("the FAQ opens and closes with Enter", async ({ page }) => {
          await gotoReady(page, path);
          const item = page.locator("section.cat-faq details").first();
          await item.locator("summary").focus();
          await page.keyboard.press("Enter");
          await expect(item).toHaveAttribute("open", "");
          await expect(item.locator("summary + *")).toBeVisible();
          await page.keyboard.press("Enter");
          await expect(item).not.toHaveAttribute("open");
        });

        test("grain only on dark grounds: none over a light section, never the LCP", async ({ page }) => {
          await gotoReady(page, path);
          // For each visible section in main: does it or any ancestor paint the grain tile?
          const sections = await page.locator("main section[data-tone]").evaluateAll((els) =>
            els
              .filter((e) => e.checkVisibility())
              .map((e) => {
                let grained = false;
                for (let a: Element | null = e; a; a = a.parentElement) {
                  if (getComputedStyle(a, "::before").backgroundImage.includes("feTurbulence")) grained = true;
                }
                return { tone: (e as HTMLElement).dataset.tone, grained };
              }),
          );
          for (const s of sections) expect(s.grained, `a ${s.tone} section`).toBe(s.tone === "dark");
          expect((await lcpEntry(page)).url, "the LCP is text, not the grain tile").toBe("");
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

        test("header tone follows each section; the page ground is the theme's", async ({ page }) => {
          await gotoReady(page, path);
          const tones = await page
            .locator("#page-stage section[data-tone]")
            .evaluateAll((els) => els.filter((e) => e.checkVisibility()).map((e) => [(e as HTMLElement).dataset.tone, (e as HTMLElement).dataset.header ?? "", e.closest("main") ? "main" : "outside"]));
          const header = page.locator("#site-header");
          const stage = page.locator("#page-stage");
          for (const [i, [tone, headerKind, where]] of tones.entries()) {
            if (!(await scrollSectionTo(page, i, "header"))) continue;
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
