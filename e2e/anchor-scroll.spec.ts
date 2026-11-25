import { expect, test, type Page } from "@playwright/test";
import { expectLanded as expectLandedOnCategory, gotoReady } from "./helpers";

/**
 * Anchor landing (D53): every route to an anchor puts the target's top at the header's bottom
 * (±4px), then focuses the target's heading. Since N05 the hero's actions open /contact and /work
 * (e2e/hero.spec.ts), so the home page has no in-page link to #services; a deep link still lands.
 */
const TOLERANCE = 4;

/** Target top minus header bottom, once the scroll has stopped moving. */
async function landing(page: Page, id: string) {
  let last = NaN;
  await expect
    .poll(
      async () => {
        const y = await page.evaluate(() => Math.round(scrollY));
        const still = y === last;
        last = y;
        return still;
      },
      { timeout: 8000, intervals: [250] },
    )
    .toBe(true);
  return page.evaluate((id) => {
    const target = document.getElementById(id)!.getBoundingClientRect().top;
    const header = document.getElementById("site-header")!.getBoundingClientRect().bottom;
    return target - header;
  }, id);
}

/** Focus first: it marks the end of the landing (see expectLanded in helpers.ts). */
async function expectLanded(page: Page, id: string, heading: string) {
  await expect(page.locator(heading)).toBeFocused({ timeout: 10_000 });
  const offset = await landing(page, id);
  expect(Math.abs(offset), `landing offset ${offset}px`).toBeLessThanOrEqual(TOLERANCE);
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
}

for (const locale of ["en", "ar"] as const) {
  test.describe(`anchor landing (${locale})`, () => {
    test("deep link on load (the header is visible)", async ({ page }) => {
      await gotoReady(page, `/${locale}#services`);
      // #services is the film's Events scene (D174); its heading is the category name. Late
      // layout (fonts) can shift it after the first landing; the utility re-lands until it settles.
      await page.waitForTimeout(1500);
      await expectLanded(page, "services", "#services .film-cat");
      expect(await page.locator("[data-header-shell]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    });

    // Since the menus link the category pages (6530abf, D57), a service link opens its category
    // page at the service's anchor; the menu closes and the landing is the same rule.
    test("mega-menu service link lands its section on the category page and closes the panel", async ({ page, isMobile }) => {
      test.skip(isMobile, "desktop mega menu");
      await gotoReady(page, `/${locale}`);
      await page.locator("button[aria-controls=mega-panel]").click();
      await page.locator('#mega-panel a[href$="/services/events-hospitality#conferences"]').first().click();
      await expect(page.locator("#mega-panel")).toBeHidden();
      await expect(page).toHaveURL(new RegExp(`/${locale}/services/events-hospitality#conferences$`));
      await expectLandedOnCategory(page, "conferences");
    });

    test("mobile-menu service link lands its section on the category page after the menu closes", async ({ page, isMobile }) => {
      test.skip(!isMobile, "mobile menu");
      await gotoReady(page, `/${locale}`);
      await page.locator("button[aria-controls=mobile-nav]").click();
      await page.locator("#mobile-nav summary").first().click();
      await page.locator('#mobile-nav a[href$="/services/events-hospitality#conferences"]').first().click();
      await expect(page.locator("#mobile-nav")).toBeHidden();
      await expect(page).toHaveURL(new RegExp(`/${locale}/services/events-hospitality#conferences$`));
      await expectLandedOnCategory(page, "conferences");
    });
  });
}

// D123: the print service's anchor was renamed; a link already shared still lands, under its new name.
test("an old #print-store link lands on Print ordering", async ({ page }) => {
  await gotoReady(page, "/en/services/production-print-gifts#print-store");
  await page.waitForTimeout(1500);
  await expectLandedOnCategory(page, "print-ordering");
  await expect(page).toHaveURL(/#print-ordering$/);
});

test.describe("anchor landing (reduced motion)", () => {
  test.use({ reducedMotion: "reduce" });

  // An in-page link (the category opening's skip link; the home hero has none since N05).
  test("jumps instantly to the same landing", async ({ page }) => {
    await gotoReady(page, "/en/services/events-hospitality");
    const skip = page.locator("a.cat-skip");
    const id = (await skip.getAttribute("href"))!.replace(/^#/, "");
    await skip.click();
    // No easing: the final position is reached within a couple of frames of the click.
    await page.waitForTimeout(120);
    const early = await page.evaluate(() => Math.round(scrollY));
    await expectLandedOnCategory(page, id);
    expect(Math.abs((await page.evaluate(() => Math.round(scrollY))) - early), "no easing after the jump").toBeLessThanOrEqual(2);
  });
});
