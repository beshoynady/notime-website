import { expect, test, type Page } from "@playwright/test";
import { getScene } from "../src/content/scenes";
import { stillLead } from "../src/lib/scene-math";
import ar from "../src/messages/ar.json";
import en from "../src/messages/en.json";
import { expectLanded, gotoReady } from "./helpers";

/**
 * Category pages · the opening shell (Task 2.8; storyboards README §2): the service index shows
 * from the first frame, the skip control is the first Tab stop after the breadcrumbs and lands
 * the first service, and landings hold. The Events opening is a public pinned scene (batch 2), so
 * the pinned cases run on the public page.
 */
const PAGE = "/services/events-hospitality";
const LAB = PAGE; // the pinned opening: public since batch 2

const skip = (page: Page) => page.locator("a.cat-skip");
const indexLink = (page: Page, id: string) => page.locator(`nav.svc-index a[href="#${id}"]`);
const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

for (const locale of ["en", "ar"] as const) {
  test.describe(`opening (${locale})`, () => {
    // N06: the hero's two links read in order, "Request a quote" then the skip control.
    test("the index shows at load; Tab goes breadcrumbs → quote → skip → index", async ({ page, isMobile }) => {
      await gotoReady(page, `/${locale}${PAGE}`);
      await expect(page.locator("nav.svc-index")).toBeInViewport();
      await expect(indexLink(page, "conferences")).toBeInViewport();
      await page.locator(".crumbs a").last().focus();
      await page.keyboard.press("Tab");
      await expect(page.locator("a.cat-opening-quote")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(skip(page)).toBeFocused();
      await page.keyboard.press("Tab");
      // Below 900px the index starts with its "all services" toggle (D73).
      if (isMobile) {
        await expect(page.locator("button.svc-index-toggle")).toBeFocused();
        await page.keyboard.press("Tab");
      }
      await expect(indexLink(page, "conferences")).toBeFocused();
    });

    test("skip with Enter lands the first service, H2 focused", async ({ page }) => {
      await gotoReady(page, `/${locale}${PAGE}`);
      await skip(page).focus();
      await page.keyboard.press("Enter");
      await expectLanded(page, "conferences");
    });

    test("a deep link to the last service lands", async ({ page }) => {
      await gotoReady(page, `/${locale}${PAGE}#stage`);
      await page.waitForTimeout(1000);
      await expectLanded(page, "stage");
    });

    test("reduced motion: the skip control still lands", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await gotoReady(page, `/${locale}${PAGE}`);
      await skip(page).click();
      await expectLanded(page, "conferences");
    });

    test("no horizontal overflow in the opening at 360", async ({ page, isMobile }) => {
      test.skip(!isMobile, "narrow width: mobile");
      await page.setViewportSize({ width: 360, height: 780 });
      await gotoReady(page, `/${locale}${PAGE}`);
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });

    // N06: the hero is the finished scene, so its room photo shows from the first paint, loaded
    // with high priority. The LCP is the hero's text (the H1, or the lead where it sets larger,
    // as at 390 in English) or that photo; never the build scene's (lazy) copy, never anything else.
    test("LCP is the hero's text or its priority image", async ({ page }) => {
      await gotoReady(page, `/${locale}${PAGE}`);
      const lcp = await page.evaluate(
        () =>
          new Promise<{ inHero: boolean; text: boolean; priority: boolean }>((resolve) => {
            new PerformanceObserver((list) => {
              const entry = list.getEntries().at(-1) as PerformanceEntry & { element?: Element; url: string };
              const el = entry.element;
              resolve({
                inHero: !!el?.closest('.cat-opening .scene[data-mode="still"]'),
                text: entry.url === "",
                priority: el instanceof HTMLImageElement && el.fetchPriority === "high",
              });
            }).observe({ type: "largest-contentful-paint", buffered: true });
          }),
      );
      expect(lcp.inHero).toBe(true);
      expect(lcp.text || lcp.priority).toBe(true);
    });

    test.describe("pinned", () => {
      test.skip(({ isMobile }) => isMobile, "the build scene pins on desktop only (N06)");
      test("index VI chosen half a screen into the build scene lands #stage", async ({ page }) => {
        await gotoReady(page, `/${locale}${LAB}`);
        await page.locator(".cat-opening .scene[data-motion]").waitFor({ state: "attached" });
        // Half a screen into the build scene, which follows the one-screen hero (N06).
        await page.evaluate(() => window.scrollTo(0, innerHeight * 1.5));
        await page.waitForTimeout(300);
        await indexLink(page, "stage").click();
        await expectLanded(page, "stage");
        await expect(indexLink(page, "stage")).toHaveAttribute("aria-current", "location");
      });

      test("skip from the hero, above the pinned build, lands the first service", async ({ page }) => {
        await gotoReady(page, `/${locale}${LAB}`);
        await page.locator(".cat-opening .scene[data-motion]").waitFor({ state: "attached" });
        await skip(page).click();
        await expectLanded(page, "conferences");
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });
    });
  });
}

/**
 * N06 (A): the opening starts with the finished scene. The hero is the LayeredScene's still
 * (unpinned, one screen) with the head, the last shot line as the lead and "Request a quote";
 * on desktop with motion the pinned build scene follows it, and phones have no pin at all.
 */
const SCENE_CATEGORIES = ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts"] as const;
const MESSAGES = { en, ar } as const;
const hero = (page: Page) => page.locator('.cat-opening .scene[data-mode="still"]');

for (const slug of SCENE_CATEGORIES) {
  for (const locale of ["en", "ar"] as const) {
    test(`${locale}/${slug}: the hero shows the finished scene at once`, async ({ page }) => {
      const scenes = MESSAGES[locale].scenes as Record<string, Record<string, string>>;
      const [group, key] = stillLead(getScene(slug)!.shots)!.split(".");
      await gotoReady(page, `/${locale}/services/${slug}`);
      await expect(page.locator("h1#category-title")).toBeInViewport();
      await expect(page.locator(".cat-opening-lead")).toHaveText(scenes[group][key]);
      await expect(page.locator(".cat-opening-lead")).toBeInViewport();
      const quote = page.locator(".cat-opening a.cat-opening-quote");
      await expect(quote).toHaveText(MESSAGES[locale].header.quote);
      await expect(quote).toHaveAttribute("href", `/${locale}/contact?category=${slug}`);
      await expect(quote).toBeInViewport();
      expect(await page.evaluate(() => scrollY)).toBe(0);
      // The end frame: every entrance done, nothing clipped, never driven by GSAP.
      const layers = hero(page).locator("[data-layer]");
      expect(await layers.count()).toBeGreaterThan(0);
      const unfinished = await layers.evaluateAll((els) =>
        els
          .filter((l) => l.checkVisibility())
          .filter((l) => {
            const enter = l.querySelector<HTMLElement>(".scene-enter")!;
            const c = getComputedStyle(l.querySelector(".scene-light")!).clipPath;
            const clipped = c !== "none" && !/inset\(0(px|%)?\)/.test(c) && c !== "inset(0% 0% 0% 0%)";
            return getComputedStyle(enter).opacity !== "1" || clipped || enter.style.transform !== "";
          })
          .map((l) => l.getAttribute("data-layer")),
      );
      expect(unfinished).toEqual([]);
      await expect(hero(page)).not.toHaveAttribute("data-motion");
    });
  }
}

test("phones have no pin", async ({ page, isMobile }) => {
  test.skip(!isMobile, "390");
  await gotoReady(page, "/en/services/events-hospitality");
  await page.waitForTimeout(1500); // past any late ScrollTrigger build
  await expect(page.locator(".cat-opening .pin-spacer")).toHaveCount(0);
  await expect(page.locator(".cat-opening .cat-build")).toBeHidden();
});

test("desktop keeps the build: the pinned scene follows the hero", async ({ page, isMobile }) => {
  test.skip(isMobile, "1440");
  await gotoReady(page, "/en/services/events-hospitality");
  const spacer = page.locator(".cat-opening .cat-build > .scene-pin.pin-spacer");
  await expect(spacer).toHaveCount(1);
  const [heroBottom, buildTop] = await page.evaluate(() => [
    document.querySelector(".cat-opening .scene[data-mode='still']")!.getBoundingClientRect().bottom,
    document.querySelector(".cat-opening .cat-build")!.getBoundingClientRect().top,
  ]);
  expect(buildTop).toBeGreaterThanOrEqual(heroBottom - 1);
  // The build scene loads nothing before it is needed: its images stay lazy.
  const eager = await page.locator(".cat-build img").evaluateAll((imgs) => imgs.filter((i) => (i as HTMLImageElement).loading !== "lazy").length);
  expect(eager).toBe(0);
});
