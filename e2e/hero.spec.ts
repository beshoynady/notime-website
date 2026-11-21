import { expect, test, type Page } from "@playwright/test";
import { controllerReady, gotoReady } from "./helpers";

const shellOpacity = (page: Page) =>
  page.locator("[data-header-shell]").evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe("header tone through the pin", () => {
  test("stays hero for the whole pin, then light, and back to hero on the way up", async ({ page }) => {
    await page.goto("/en");
    await controllerReady(page);
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

test.describe("hero (reduced motion)", () => {
  test.use({ reducedMotion: "reduce" });

  test("no pin, no sweep: the static frame is final", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#page-stage[data-tone-ready]").waitFor({ state: "attached" });
    expect(await shellOpacity(page)).toBe(1);
    expect(await page.locator(".hero-clock-hand").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    await expect(page.locator(".hero-eyebrow")).toBeVisible();
    await expect(page.locator("#hero-title")).toBeVisible();
  });
});

/** N05 (B1): the hero says it in one screen, offers two actions, and the strip follows it. */
const HERO_COPY = {
  en: { eyebrow: "Every second is planned.", plan: "Plan your event", work: "See our work", eventDate: "Event date (approximate)", guests: "Number of guests", events: "Events & Hospitality" },
  ar: { eyebrow: "كل ثانية محسوبة.", plan: "خطّطوا لفعاليتكم معنا", work: "شاهدوا أعمالنا", eventDate: "تاريخ المناسبة (تقريبًا)", guests: "عدد الضيوف", events: "الفعاليات والضيافة" },
} as const;

/** Load and wait for the hero controller (the first screen itself needs no wait, D156). */
async function openHero(page: Page, locale: string) {
  await gotoReady(page, `/${locale}`);
  await controllerReady(page);
}

test.describe("N05: one-screen hero", () => {
  for (const locale of ["en", "ar"] as const) {
    const copy = HERO_COPY[locale];

    test(`the hero says it in one screen (${locale})`, async ({ page }) => {
      await openHero(page, locale);
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

    test(`two actions (${locale})`, async ({ page }) => {
      await openHero(page, locale);
      const hero = page.locator("#hero");
      const plan = hero.getByRole("link", { name: copy.plan, exact: true });
      const work = hero.getByRole("link", { name: copy.work, exact: true });
      await expect(plan).toHaveAttribute("href", `/${locale}/contact?category=events-hospitality`);
      await expect(work).toHaveAttribute("href", `/${locale}/work`);
      const vh = await page.evaluate(() => innerHeight);
      for (const link of [plan, work]) {
        const box = (await link.boundingBox())!;
        expect(box.y, "inside the first viewport").toBeGreaterThanOrEqual(0);
        expect(box.y + box.height, "inside the first viewport").toBeLessThanOrEqual(vh);
      }
    });

    test(`"plan your event" opens the brief with the event fields (${locale})`, async ({ page }) => {
      await openHero(page, locale);
      await page.locator("#hero").getByRole("link", { name: copy.plan, exact: true }).click();
      await page.waitForURL(`**/${locale}/contact?category=events-hospitality`);
      await page.locator("#brief-message").scrollIntoViewIfNeeded();
      await expect(page.getByLabel(copy.eventDate)).toBeVisible();
      await expect(page.getByLabel(copy.guests)).toBeVisible();
      await expect(page.locator("#brief-service optgroup").first()).toHaveAttribute("label", copy.events);
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

  test("the exit still completes at the pin's end", async ({ page }) => {
    await openHero(page, "en");
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
    // W02: the title dims to its floor and the lead with the quote button stays (no empty screen).
    expect(s.lines).toEqual([0.45, 0.45]);
    expect(s.clock).toEqual([0]);
    expect(s.sub).toEqual([1]);
    expect(s.eyebrow).toEqual([0]);
  });
});
