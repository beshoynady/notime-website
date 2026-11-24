import { expect, test, type Page } from "@playwright/test";
import { controllerReady, gotoReady } from "./helpers";

const shellOpacity = (page: Page) =>
  page.locator("[data-header-shell]").evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe("header tone through the pin", () => {
  test("stays hero for the whole pin, then light, and back to hero on the way up", async ({ page }) => {
    await page.goto("/en");
    await controllerReady(page);
    const header = page.locator("#site-header");
    // Polled, not read once after a fixed wait: under load (two workers) the tone took longer
    // than 150 ms to follow a jump, and the old single read failed 2 runs in 6.
    const toneAt = async (f: number, tone: string) => {
      await page.evaluate((f) => scrollTo(0, innerHeight * f), f);
      await expect(header, `tone at ${f} viewports`).toHaveAttribute("data-header-tone", tone, { timeout: 3000 });
    };
    // Desktop pins for half a viewport after the hero's top (D173: 150svh in all), phones don't
    // pin; either way the hero then scrolls away under the header, the photo strip and About (both
    // dark) follow, then Categories (light).
    await toneAt(0.4, "hero");
    await toneAt(0.9, "hero");
    await toneAt(2.1, "dark");
    await toneAt(0.5, "hero");
    await page.locator("#services").evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY + 40));
    await expect(header).toHaveAttribute("data-header-tone", "light", { timeout: 3000 });
  });
});

test.describe("hero (reduced motion)", () => {
  test.use({ reducedMotion: "reduce" });

  test("no pin, no countdown: the static frame is final (zero, every object in place)", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#page-stage[data-tone-ready]").waitFor({ state: "attached" });
    await controllerReady(page);
    expect(await shellOpacity(page)).toBe(1);
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    await expect(page.locator("#hero [data-hero-tc]")).toHaveText("TC 00:00:00:00");
    const objects = await page.locator(".hero-object").evaluateAll((els) =>
      els.map((el) => ({ opacity: Number(getComputedStyle(el).opacity), transform: getComputedStyle(el).transform })),
    );
    expect(objects).toHaveLength(5);
    for (const o of objects) expect(o).toEqual({ opacity: 1, transform: "none" });
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

  test("phones: no pin, the objects gather to zero on load (D173)", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone layout");
    await openHero(page, "en");
    await expect(page.locator("#hero [data-hero-tc]")).toHaveText("TC 00:00:00:00", { timeout: 6000 });
    expect(await page.locator(".pin-spacer:has(> #hero)").count()).toBe(0);
  });

  test("the countdown reaches zero at the pin's end (D173)", async ({ page, isMobile }) => {
    test.skip(isMobile, "phones don't pin (D173)");
    await openHero(page, "en");
    // The pin's end: the spacer's top plus the distance it reserves below the hero.
    const end = await page.evaluate(() => {
      const spacer = document.querySelector<HTMLElement>(".hero-pin")!;
      const hero = document.getElementById("hero")!;
      return spacer.getBoundingClientRect().top + scrollY + spacer.offsetHeight - hero.offsetHeight;
    });
    // Wheel steps, as a visitor scrolls: a programmatic jump can be overridden by the smooth
    // scroller's own target (it left the page at the top in CI).
    await page.mouse.move(700, 450);
    // The deltas add up to the target (reading scrollY mid-glide would overshoot past the pin).
    for (let sent = 0; sent < end - 4; ) {
      const d = Math.min(40, end - 4 - sent);
      await page.mouse.wheel(0, d);
      sent += d;
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => scrollY), "scrolled to the pin's end").toBeGreaterThanOrEqual(end - 12);
    // scrub: 0.6 (the playhead catches up within a second).
    await page.waitForTimeout(1800);
    const s = await page.evaluate(() => {
      const op = (sel: string) => [...document.querySelectorAll(sel)].map((el) => Number(getComputedStyle(el).opacity));
      // Rotation and scale only (a, b, c, d of the matrix): GSAP folds the CSS centring into the translation.
      const turn = (el: Element) => {
        const m = new DOMMatrix(getComputedStyle(el).transform);
        return [m.a, m.b, m.c, m.d].map((v) => Math.round(v * 100) / 100);
      };
      const hand = document.querySelector(".hero-dial-hand")!.getAttribute("transform") ?? "";
      return {
        heroTop: Math.round(document.getElementById("hero")!.getBoundingClientRect().top),
        tc: document.querySelector("#hero [data-hero-tc]")!.textContent,
        objects: [...document.querySelectorAll(".hero-object")].map(turn),
        hand: hand.replace(/\s/g, ""),
        copy: op(".hero-line, .hero-eyebrow, .hero-sub"),
      };
    });
    expect(Math.abs(s.heroTop), "still held at the pin's end").toBeLessThanOrEqual(2);
    expect(s.tc).toBe("TC 00:00:00:00");
    expect(s.objects).toEqual(Array(5).fill([1, 0, 0, 1]));
    // The hand on 12, on its own centre (no rotation and no stray translation).
    expect(s.hand).toMatch(/^matrix\(1,0,0,1,-?0(\.0+\d*)?,-?0(\.0+\d*)?\)$/);
    // The copy never moves or dims: the first screen stays readable through the countdown.
    expect(s.copy).toEqual([1, 1, 1, 1]);
  });
});
