import { expect, test, type Page } from "@playwright/test";
import { controllerReady, gotoReady, waitForIntroEnd } from "./helpers";

const shellOpacity = (page: Page) =>
  page.locator("[data-header-shell]").evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe("hero intro (motion)", () => {
  test("first visit: shutters cover, header stays focusable, Tab finishes the intro", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard path is checked on desktop");
    await page.goto("/en");
    await controllerReady(page);
    // Hydrated past the intro deadline (machine under load): the controller correctly takes
    // the short-reveal path, so there are no shutters to test on this run.
    test.skip(await page.locator("html[data-intro-seen]").count() > 0, "hydrated past the intro deadline");
    await expect(page.locator(".hero-shutter.top")).toBeVisible();
    expect(await shellOpacity(page)).toBeLessThan(0.5);

    await page.keyboard.press("Tab");
    await expect(page.locator("html")).toHaveAttribute("data-intro-seen", "");
    await expect(page.locator(".hero-shutter.top")).toBeHidden();
    expect(await shellOpacity(page)).toBe(1);
    await expect(page.getByRole("link", { name: /skip/i })).toBeFocused();
  });

  test("a scroll or a tap skips to the end state", async ({ page, isMobile }) => {
    await page.goto("/en");
    await controllerReady(page);
    if (isMobile) await page.touchscreen.tap(30, 420);
    else {
      await page.mouse.move(700, 450);
      await page.mouse.wheel(0, 40);
    }
    await expect(page.locator("html")).toHaveAttribute("data-intro-seen", "", { timeout: 1000 });
    expect(await shellOpacity(page)).toBe(1);
  });

  test("plays once per session: a reload skips the shutters and reveals the title", async ({ page }) => {
    for (const locale of ["en", "ar"]) {
      await page.goto(`/${locale}`);
      await waitForIntroEnd(page);
      await page.reload();
      // Before and after hydration: no shutters, header visible.
      await expect(page.locator(".hero-shutter.top")).toBeHidden();
      expect(await shellOpacity(page)).toBe(1);
      await controllerReady(page);
      // The short reveal ends with both lines in place.
      await expect
        .poll(() =>
          page.locator(".hero-line-inner").evaluateAll((els) => els.map((el) => new DOMMatrix(getComputedStyle(el).transform).f)),
        )
        .toEqual([0, 0]);
    }
  });
});

test.describe("header tone through the pin", () => {
  test("stays hero for the whole pin, then light, and back to hero on the way up", async ({ page }) => {
    await page.goto("/en");
    await controllerReady(page);
    // Skip with a key, not a wheel: Lenis would still be easing the wheel's scroll and
    // override the first programmatic jump.
    await page.keyboard.press("Shift");
    await waitForIntroEnd(page);
    const toneAt = async (f: number) => {
      await page.evaluate((f) => scrollTo(0, innerHeight * f), f);
      await page.waitForTimeout(150);
      return page.locator("#site-header").getAttribute("data-header-tone");
    };
    // The pin lasts 1 viewport after the hero's top (N05); the photo strip and About (both
    // dark) follow the spacer, then Categories (light).
    expect(await toneAt(0.5)).toBe("hero");
    expect(await toneAt(0.9)).toBe("hero");
    expect(await toneAt(2.6)).toBe("dark");
    expect(await toneAt(1.0)).toBe("hero");
    await page.locator("#services").evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY + 40));
    await page.waitForTimeout(150);
    expect(await page.locator("#site-header").getAttribute("data-header-tone")).toBe("light");
  });
});

test.describe("hero LCP rule below 900px (D43)", () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, "mobile viewport only"));

  for (const locale of ["en", "ar"] as const) {
    // What the hero code controls: the title is never masked, split or held, so its paint
    // waits on nothing but the text itself. (When the text paints is the webfont's block
    // period, D38 / OPEN_QUESTIONS #14: the first contentful paint can be the clock SVG or
    // the logo a little earlier, measured 100-500 ms, with or without the intro.)
    test(`the title is the LCP, never masked or split (${locale})`, async ({ page }) => {
      await page.addInitScript(() => {
        const w = window as unknown as { __lcp: string[] };
        w.__lcp = [];
        new PerformanceObserver((l) => {
          for (const e of l.getEntries() as unknown as { element: Element | null }[]) w.__lcp.push(e.element?.className ?? "");
        }).observe({ type: "largest-contentful-paint", buffered: true });
      });
      // First visit (intro plays), then a repeat visit in the same tab (intro skipped).
      for (const visit of ["first", "repeat"]) {
        await page.goto(`/${locale}`);
        await controllerReady(page);
        await page.waitForTimeout(1500);
        const r = await page.evaluate(() => ({
          lcp: (window as unknown as { __lcp: string[] }).__lcp.at(-1),
          splitNodes: document.querySelectorAll(".hero-line-inner *").length,
          masks: [...document.querySelectorAll(".hero-line")].map((el) => getComputedStyle(el).overflow),
          visible: [...document.querySelectorAll(".hero-line-inner")].map((el) => getComputedStyle(el).visibility),
        }));
        expect(r.lcp, `${visit} visit LCP element`).toContain("hero-line-inner");
        expect(r.splitNodes, `${visit} visit: no SplitText below 900px`).toBe(0);
        expect(r.masks, `${visit} visit: no line masks below 900px`).toEqual(["visible", "visible"]);
        expect(r.visible, `${visit} visit: lines never hidden`).toEqual(["visible", "visible"]);
      }
    });
  }
});

test.describe("hero intro (reduced motion)", () => {
  test.use({ reducedMotion: "reduce" });

  test("no intro, no pin: the static frame is final", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#page-stage[data-tone-ready]").waitFor({ state: "attached" });
    await expect(page.locator(".hero-shutter.top")).toBeHidden();
    expect(await shellOpacity(page)).toBe(1);
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    await expect(page.locator(".hero-eyebrow")).toBeVisible();
    await expect(page.locator("#hero-title")).toBeVisible();
  });
});

/** N05 (B1): the hero says it in one screen, offers two actions, and the strip follows it. */
const HERO_COPY = {
  en: { eyebrow: "Every second is planned.", plan: "Plan your event", work: "See our work" },
  ar: { eyebrow: "كل ثانية محسوبة.", plan: "خطّطوا لفعاليتكم معنا", work: "شاهدوا أعمالنا" },
} as const;

/** Load, skip the intro (a key on desktop, a tap on phones) and wait for its end state. */
async function openHero(page: Page, locale: string, isMobile: boolean) {
  await gotoReady(page, `/${locale}`);
  await controllerReady(page);
  if (isMobile) await page.touchscreen.tap(30, 420);
  else await page.keyboard.press("Shift");
  await waitForIntroEnd(page);
  await page.waitForTimeout(400);
}

test.describe("N05: one-screen hero", () => {
  for (const locale of ["en", "ar"] as const) {
    const copy = HERO_COPY[locale];

    test(`the hero says it in one screen (${locale})`, async ({ page, isMobile }) => {
      await openHero(page, locale, isMobile);
      const hero = page.locator("#hero");
      const eyebrow = hero.locator("p.hero-eyebrow");
      await expect(eyebrow).toHaveText(copy.eyebrow);
      // Read once: no decorative repeat and no sr-only duplicate.
      await expect(page.getByText(copy.eyebrow, { exact: true })).toHaveCount(1);
      await expect(page.locator(".hero-beat")).toHaveCount(0);
      await expect(hero.locator(".sr-only")).toHaveCount(0);
      const m = await page.evaluate(() => {
        const r = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        return { eyebrow: r("#hero .hero-eyebrow"), title: r("#hero-title"), header: r("#site-header").bottom, vh: innerHeight };
      });
      expect(m.eyebrow.height, "eyebrow rendered").toBeGreaterThan(0);
      expect(m.eyebrow.top, "eyebrow below the header").toBeGreaterThanOrEqual(m.header);
      expect(m.eyebrow.bottom, "eyebrow above the title").toBeLessThanOrEqual(m.title.top + 1);
      expect(m.eyebrow.bottom, "eyebrow in the first viewport").toBeLessThanOrEqual(m.vh);
    });

    test(`two actions (${locale})`, async ({ page, isMobile }) => {
      await openHero(page, locale, isMobile);
      const hero = page.locator("#hero");
      const plan = hero.getByRole("link", { name: copy.plan, exact: true });
      const work = hero.getByRole("link", { name: copy.work, exact: true });
      await expect(plan).toHaveAttribute("href", `/${locale}/contact`);
      await expect(work).toHaveAttribute("href", `/${locale}/work`);
      const vh = await page.evaluate(() => innerHeight);
      for (const link of [plan, work]) {
        const box = (await link.boundingBox())!;
        expect(box.y, "inside the first viewport").toBeGreaterThanOrEqual(0);
        expect(box.y + box.height, "inside the first viewport").toBeLessThanOrEqual(vh);
      }
    });

    test(`the strip comes right after the hero (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      const order = await page.evaluate(() =>
        [...document.querySelectorAll("main#main > *")]
          .filter((el) => el.tagName !== "SCRIPT")
          .slice(0, 2)
          .map((el) => (el.classList.contains("hero-pin") || el.classList.contains("pin-spacer") ? el.querySelector("#hero")?.id : el.id)),
      );
      expect(order).toEqual(["hero", "home-strip"]);
      await expect(page.locator("#work #home-strip, #work .pstrip")).toHaveCount(0);
    });
  }

  test("the exit still completes at the pin's end", async ({ page, isMobile }) => {
    await openHero(page, "en", isMobile);
    // The pin's end: the spacer's top plus the distance it reserves below the hero.
    await page.evaluate(() => {
      const spacer = document.querySelector<HTMLElement>(".hero-pin")!;
      const hero = document.getElementById("hero")!;
      const end = spacer.getBoundingClientRect().top + scrollY + spacer.offsetHeight - hero.offsetHeight;
      scrollTo(0, end - 2);
    });
    // scrub: 1 (the playhead catches up within a second).
    await page.waitForTimeout(1800);
    const s = await page.evaluate(() => {
      const op = (sel: string) => [...document.querySelectorAll(sel)].map((el) => Number(getComputedStyle(el).opacity));
      return {
        heroTop: Math.round(document.getElementById("hero")!.getBoundingClientRect().top),
        lines: op(".hero-line"),
        clock: op(".hero-clock-wrap"),
        sub: op(".hero-sub"),
        eyebrow: op(".hero-eyebrow"),
      };
    });
    expect(Math.abs(s.heroTop), "still held at the pin's end").toBeLessThanOrEqual(2);
    expect(s.lines).toEqual([0, 0]);
    expect(s.clock).toEqual([0]);
    expect(s.sub).toEqual([0]);
    expect(s.eyebrow).toEqual([0]);
  });
});
