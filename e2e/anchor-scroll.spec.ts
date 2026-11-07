import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Anchor landing (D53): every route to an anchor puts the target's top at the header's bottom
 * (±4px), then focuses the target's heading. "Explore our services" is the site's first click.
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

async function expectLanded(page: Page, id: string, heading: string) {
  const offset = await landing(page, id);
  expect(Math.abs(offset), `landing offset ${offset}px`).toBeLessThanOrEqual(TOLERANCE);
  await expect(page.locator(`#${heading}`)).toBeFocused();
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
}

const skipIntro = (page: Page) => page.addInitScript(() => sessionStorage.setItem("nt-intro", "1"));

for (const locale of ["en", "ar"] as const) {
  test.describe(`anchor landing (${locale})`, () => {
    test("hero CTA lands #services under the header and focuses its heading", async ({ page }) => {
      await skipIntro(page);
      await gotoReady(page, `/${locale}`);
      await page.locator('#hero a[href$="#services"]').click();
      await expectLanded(page, "services", "services-title");
    });

    test("deep link on load (first visit: the intro is skipped, the header is visible)", async ({ page }) => {
      await gotoReady(page, `/${locale}#services`);
      await expect(page.locator("html")).toHaveAttribute("data-intro-seen", "");
      // Late layout (hero pin spacer, fonts) shifts #services after the first landing; the
      // utility re-lands until it settles.
      await page.waitForTimeout(1500);
      await expectLanded(page, "services", "services-title");
      expect(await page.locator("[data-header-shell]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    });

    test("mega-menu service link lands #services and closes the panel", async ({ page, isMobile }) => {
      test.skip(isMobile, "desktop mega menu");
      await skipIntro(page);
      await gotoReady(page, `/${locale}`);
      await page.locator("button[aria-controls=mega-panel]").click();
      await page.locator('#mega-panel a[href$="#services"]').first().click();
      await expect(page.locator("#mega-panel")).toBeHidden();
      await expectLanded(page, "services", "services-title");
    });

    test("mobile-menu service link lands #services after the menu closes", async ({ page, isMobile }) => {
      test.skip(!isMobile, "mobile menu");
      await skipIntro(page);
      await gotoReady(page, `/${locale}`);
      await page.locator("button[aria-controls=mobile-nav]").click();
      await page.locator("#mobile-nav summary").first().click();
      await page.locator('#mobile-nav a[href$="#services"]').first().click();
      await expect(page.locator("#mobile-nav")).toBeHidden();
      await expectLanded(page, "services", "services-title");
    });
  });
}

test.describe("anchor landing (reduced motion)", () => {
  test.use({ reducedMotion: "reduce" });

  test("jumps instantly to the same landing", async ({ page }) => {
    await gotoReady(page, "/en");
    await page.locator('#hero a[href$="#services"]').click();
    // No easing: the final position is reached within a couple of frames of the click.
    await page.waitForTimeout(120);
    const offset = await page.evaluate(
      () => document.getElementById("services")!.getBoundingClientRect().top - document.getElementById("site-header")!.getBoundingClientRect().bottom,
    );
    expect(Math.abs(offset), `landing offset ${offset}px`).toBeLessThanOrEqual(TOLERANCE);
    await expect(page.locator("#services-title")).toBeFocused();
  });
});
