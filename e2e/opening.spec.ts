import { expect, test, type Page } from "@playwright/test";
import { getScene } from "../src/content/scenes";
import { stillLead } from "../src/lib/scene-math";
import ar from "../src/messages/ar.json";
import en from "../src/messages/en.json";
import { expectLanded, gotoReady, heroLcp } from "./helpers";

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

    // N06 (controller ruling 2026-11-18): the LCP is the hero's text (H1 or lead) or its eager,
    // high-priority image in the still scene, and nothing else (heroLcp). Every category below.
    test("LCP is the hero's text or its priority image", async ({ page }) => {
      await gotoReady(page, `/${locale}${PAGE}`);
      const lcp = await heroLcp(page);
      expect(["h1", "lead", "image"], lcp.label).toContain(lcp.kind);
    });

    // v1.1: pinned build scene after the category hero (owner scope cut 2026-11-18)
    test.describe("pinned", () => {
      test.skip(({ isMobile }) => isMobile, "the build scene pins on desktop only (N06)");
      test.fixme("index VI chosen half a screen into the build scene lands #stage", async ({ page }) => {
        await gotoReady(page, `/${locale}${LAB}`);
        await page.locator(".cat-opening .scene[data-motion]").waitFor({ state: "attached" });
        // Half a screen into the build scene, which follows the one-screen hero (N06).
        await page.evaluate(() => window.scrollTo(0, innerHeight * 1.5));
        await page.waitForTimeout(300);
        await indexLink(page, "stage").click();
        await expectLanded(page, "stage");
        await expect(indexLink(page, "stage")).toHaveAttribute("aria-current", "location");
      });

      test.fixme("skip from the hero, above the pinned build, lands the first service", async ({ page }) => {
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
 * (unpinned, one screen) with the head, the last shot line as the lead and "Request a quote".
 * A scene marked `hero` (D154, Events) plays its film pinned from 1024px instead, with the same
 * head on screen from the first frame, and is the still below 1024px.
 */
const plays = (slug: Parameters<typeof getScene>[0], isMobile: boolean) => !!getScene(slug)?.hero && !isMobile;
const SCENE_CATEGORIES = ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts"] as const;
const MESSAGES = { en, ar } as const;
const hero = (page: Page) => page.locator('.cat-opening .scene[data-mode]');

for (const slug of SCENE_CATEGORIES) {
  for (const locale of ["en", "ar"] as const) {
    test(`${locale}/${slug}: the hero shows the finished scene at once`, async ({ page, isMobile }) => {
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
      // A playing hero starts at its first frame, driven by GSAP; the head above is what matters.
      if (plays(slug, isMobile)) return await expect(hero(page)).toHaveAttribute("data-motion", "desktop");
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

    test(`${locale}/${slug}: the LCP is the hero's text or an eager, high-priority hero image`, async ({ page }) => {
      await gotoReady(page, `/${locale}/services/${slug}`);
      const lcp = await heroLcp(page);
      // The Workshop's phone still has no image file: its largest paint is an inline drawing
      // (no request), reported to the controller as the one exception to the ruling.
      const allowed = slug === "production-print-gifts" ? ["h1", "lead", "image", "drawing"] : ["h1", "lead", "image"];
      expect(allowed, lcp.label).toContain(lcp.kind);
      // Every hero image that shows at this width with high priority is eager (the LCP candidate).
      const candidates = await hero(page)
        .locator('img[fetchpriority="high"]')
        .evaluateAll((imgs) => imgs.filter((i) => i.checkVisibility()).map((i) => (i as HTMLImageElement).loading));
      for (const loading of candidates) expect(loading).not.toBe("lazy");
    });

    // The eyebrow reads index · count in both directions (the index first, at inline-start).
    test(`${locale}/${slug}: the eyebrow shows the index before the count`, async ({ page }) => {
      await gotoReady(page, `/${locale}/services/${slug}`);
      const eyebrow = page.locator(".cat-opening-eyebrow");
      const index = await eyebrow.locator("bdi").first().boundingBox();
      const count = await eyebrow.locator(".cat-opening-count").boundingBox();
      if (locale === "en") expect(index!.x + index!.width).toBeLessThanOrEqual(count!.x + 1);
      else expect(index!.x).toBeGreaterThanOrEqual(count!.x + count!.width - 1);
    });
  }

  test(`${slug}: phones never request the hero's desktop-only image files`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "phones");
    const requested: string[] = [];
    page.on("request", (r) => requested.push(decodeURIComponent(r.url())));
    await gotoReady(page, `/en/services/${slug}`);
    await page.waitForLoadState("networkidle");
    const files = await page
      .locator('.cat-opening .scene[data-mode] .scene-layer:not([data-mobile]) img')
      .evaluateAll((imgs) => imgs.map((i) => new URL((i as HTMLImageElement).getAttribute("src")!, location.href).searchParams.get("url") ?? ""));
    for (const file of files.filter(Boolean)) expect(requested.filter((u) => u.includes(file)), file).toEqual([]);
  });
}

// v1.1: pinned build scene after the category hero (owner scope cut 2026-11-18)
test.fixme("desktop: the build scene's last line, the hero's lead, is read once", async ({ page, isMobile }) => {
  test.skip(isMobile, "the build scene runs on desktop only");
  await gotoReady(page, "/en/services/events-hospitality");
  const lead = (await page.locator(".cat-opening-lead").textContent())!;
  const lines = page.locator(".cat-build .scene-line");
  const hidden = await lines.evaluateAll((els) => els.map((e) => [e.textContent, e.getAttribute("aria-hidden")]));
  expect(hidden.filter(([, h]) => h === "true").map(([t]) => t)).toEqual([lead]);
  expect(hidden.length).toBeGreaterThan(1);
});

// The owner's scope cut (2026-11-18): the opening is the still hero only, at every width. No pin,
// no ScrollTrigger and no reserved band after it: the intro, then the services, follow the hero.
// A `hero` scene (D154) is the exception from 1024px; below that it holds to the same rule.
for (const slug of SCENE_CATEGORIES) {
  test(`${slug}: the opening has no pin where it is the still`, async ({ page, isMobile }) => {
    test.skip(plays(slug, isMobile), "this hero pins here (see the next test)");
    await gotoReady(page, `/en/services/${slug}`);
    await page.waitForTimeout(1500); // past any late ScrollTrigger build
    const opening = page.locator("main .cat-opening");
    await expect(opening.locator(".pin-spacer")).toHaveCount(0);
    // A hero keeps its wrapper below 1024px, reserving nothing (--pin-m 0).
    if (getScene(slug)?.hero) expect(await opening.locator(".scene-pin").evaluate((el) => (el as HTMLElement).offsetHeight - el.firstElementChild!.getBoundingClientRect().height)).toBe(0);
    else await expect(opening.locator(".scene-pin")).toHaveCount(0);
    await expect(opening.locator(".scene[data-motion]")).toHaveCount(0); // no SceneDirector
    // Scrolled half a screen, the hero moves with the page (nothing holds it in place).
    const top0 = await hero(page).evaluate((el) => el.getBoundingClientRect().top);
    await page.evaluate(() => window.scrollTo(0, innerHeight / 2));
    await page.waitForTimeout(300);
    const [top1, scrolled] = await hero(page).evaluate((el) => [el.getBoundingClientRect().top, scrollY]);
    expect(scrolled).toBeGreaterThan(0);
    expect(Math.abs(top0 - scrolled - top1)).toBeLessThanOrEqual(1);
    // No empty band: the intro starts where the hero ends, and the opening ends after the intro.
    const [heroBottom, afterTop, afterBottom, openingBottom] = await page.evaluate(() => {
      const r = (s: string) => document.querySelector(s)!.getBoundingClientRect();
      return [r('.cat-opening .scene[data-mode]').bottom, r(".cat-opening-after").top, r(".cat-opening-after").bottom, r(".cat-opening").bottom];
    });
    expect(Math.abs(afterTop - heroBottom)).toBeLessThanOrEqual(1);
    expect(Math.abs(openingBottom - afterBottom)).toBeLessThanOrEqual(1);
  });
}

test("events: the hero pins its film from 1024px, the head stays on screen, and the intro follows the pin", async ({ page, isMobile }) => {
  test.skip(isMobile, "the film plays where scenes pin (D151)");
  await gotoReady(page, "/en/services/events-hospitality");
  await expect(hero(page)).toHaveAttribute("data-mode", "hero");
  await expect(hero(page)).toHaveAttribute("data-motion", "desktop");
  await expect(page.locator("main .cat-opening .pin-spacer")).toHaveCount(1);
  // First frame: the night plate, the lit room still closed (wipe 0), the head readable.
  await expect(page.locator("h1#category-title")).toBeInViewport();
  await expect(page.locator(".cat-opening a.cat-opening-quote")).toBeInViewport();
  // Half way through the film the scene is still held, and so is the head.
  await page.evaluate(() => window.scrollTo(0, innerHeight));
  await page.waitForTimeout(400);
  expect(await hero(page).evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBe(0);
  await expect(page.locator("h1#category-title")).toBeInViewport();
  // After the pin the intro sits right under the released scene, with no empty band.
  await page.evaluate(() => window.scrollTo(0, document.querySelector(".cat-opening-after")!.getBoundingClientRect().top + scrollY - innerHeight / 2));
  const gap = () => page.evaluate(() => document.querySelector(".cat-opening-after")!.getBoundingClientRect().top - document.querySelector(".cat-opening .scene")!.getBoundingClientRect().bottom);
  await expect.poll(async () => Math.abs(await gap())).toBeLessThanOrEqual(1);
});
