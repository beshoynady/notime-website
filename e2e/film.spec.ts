import { expect, test, type Page } from "@playwright/test";
import ar from "../src/messages/ar.json";
import en from "../src/messages/en.json";
import { getCategories } from "../src/content";
import { controllerReady, gotoReady } from "./helpers";

/**
 * The home film (D174): seven scenes, the five categories in the menu's order and names, an LTR
 * counter, localized slates, a skip link, the stacked frames under reduced motion, and nothing
 * cut off at the sizes the owner checks (1366×768, 1280×720, 1440×900, 390×844, 375×667).
 */
const MSG = { en, ar } as const;
const SCENES = ["opening", "events", "creative", "marketing", "print", "digital", "finale"] as const;

/** Holds scene `i` on screen: its rise done, nothing covering its copy. */
const hold = (page: Page, i: number) =>
  page.evaluate((n) => {
    const beat = document.querySelectorAll("#film > .film-beat")[n];
    scrollTo({ top: beat.getBoundingClientRect().top + scrollY + (n ? innerHeight * 0.1 : 0), behavior: "instant" });
  }, i);

for (const locale of ["en", "ar"] as const) {
  test.describe(`${locale}: the film`, () => {
    test("seven scenes; the categories by their menu names, linked, counted 01 / 06 left to right", async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      await expect(page.locator("#film > .film-beat")).toHaveCount(7);
      expect(await page.locator("#film > .film-beat").evaluateAll((els) => els.map((e) => e.getAttribute("data-beat")))).toEqual([...SCENES]);
      const cats = getCategories();
      await expect(page.locator("#film .film-cat")).toHaveText(cats.map((c) => c.title[locale]));
      for (const [i, c] of cats.entries())
        await expect(page.locator("#film .film-go").nth(i)).toHaveAttribute("href", `/${locale}/services/${c.slug}`);
      const counters = page.locator("#film .film-count bdi");
      await expect(counters).toHaveText(["01 / 06", "02 / 06", "03 / 06", "04 / 06", "05 / 06", "06 / 06"]);
      for (const c of await counters.all()) await expect(c).toHaveAttribute("dir", "ltr");
      // The counter reads 03 / 06 on screen in Arabic too: "03" left of "06".
      await hold(page, 3);
      const order = await counters.nth(2).evaluate((el) => {
        const r = document.createRange();
        r.setStart(el.firstChild!, 0);
        r.setEnd(el.firstChild!, 2);
        const first = r.getBoundingClientRect().left;
        r.setStart(el.firstChild!, 5);
        r.setEnd(el.firstChild!, 7);
        return first < r.getBoundingClientRect().left;
      });
      expect(order, "03 sits left of 06").toBe(true);
    });

    test("slates in the page's language", async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      const slates = SCENES.slice(1).map((k) => MSG[locale].film.slate[k]);
      await expect(page.locator("#film .film-slate")).toHaveText(slates);
      if (locale === "ar") for (const s of slates) expect(s).not.toMatch(/[A-Za-z]/);
    });

    test("Skip the film lands on the section after it", async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      await controllerReady(page);
      await page.getByRole("link", { name: MSG[locale].film.skip }).click();
      await expect(page).toHaveURL(/#after-film$/);
      await expect
        .poll(() => page.evaluate(() => Math.round(document.getElementById("after-film")!.getBoundingClientRect().top)), { timeout: 8000 })
        .toBeLessThan(200);
    });
  });
}

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("the scenes stack at their final frames (nothing sticky, nothing faded)", async ({ page }) => {
    await gotoReady(page, "/ar");
    const plates = await page.locator("#film .film-plate").evaluateAll((els) => els.map((e) => getComputedStyle(e).position));
    expect(new Set(plates)).toEqual(new Set(["absolute"]));
    for (const copy of await page.locator("#film [data-film-copy]").all()) {
      await copy.scrollIntoViewIfNeeded();
      expect(await copy.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
    }
  });
});

/** The owner's five sizes, both locales: at every scene, no copy, prop or control off screen. */
const SIZES = [
  [1366, 768],
  [1280, 720],
  [1440, 900],
  [390, 844],
  [375, 667],
] as const;

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: nothing cut off at any scene, at the five sizes`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "sizes set here; one project is enough");
    test.setTimeout(120_000);
    const cut: string[] = [];
    for (const [w, h] of SIZES) {
      await page.setViewportSize({ width: w, height: h });
      await gotoReady(page, `/${locale}`);
      await controllerReady(page);
      for (let i = 0; i < SCENES.length; i++) {
        await hold(page, i);
        await page.waitForTimeout(350);
        const bad = await page.evaluate((n) => {
          const beat = document.querySelectorAll("#film > .film-beat")[n];
          const sel = "[data-film-copy] > *, .film-slate, .film-phone, .film-tablet, .film-card, .film-wall .film-campaign, .film-dial-wrap, .film-vf";
          const out: string[] = [];
          for (const el of [...beat.querySelectorAll(sel), document.querySelector(".film-skip")!]) {
            const r = el.getBoundingClientRect();
            if (!r.width) continue;
            if (r.left < -1 || r.right > innerWidth + 1 || r.top < -1 || r.bottom > innerHeight + 1)
              out.push(`${el.className}: ${Math.round(r.left)},${Math.round(r.top)} → ${Math.round(r.right)},${Math.round(r.bottom)}`);
          }
          return out;
        }, i);
        for (const b of bad) cut.push(`${w}×${h} ${SCENES[i]}: ${b}`);
      }
    }
    expect(cut).toEqual([]);
  });
}
