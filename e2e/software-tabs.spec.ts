import { expect, test } from "@playwright/test";
import { getServices } from "../src/content";
import { gotoReady } from "./helpers";

/**
 * Software in tabs (Task C2, D161): the six services sit in one tab set (WAI-ARIA tabs, automatic
 * activation, arrows reversed in Arabic); every panel is server-rendered, so its text is in the HTML
 * while its tab is closed; a link to a service's anchor opens that panel; the drawn visuals are
 * device photographs; on a phone the page is under half its old length (23,063px).
 */
const services = getServices("software-digital");
const PATH = (l: string) => `/${l}/services/software-digital`;

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: six tabs, one panel shown, every panel in the HTML`, async ({ page, request }) => {
    await gotoReady(page, PATH(locale));
    const tabs = page.locator("#services [role='tablist'] [role='tab']");
    await expect(tabs).toHaveCount(6);
    await expect(page.locator("#services [role='tabpanel']")).toHaveCount(6);
    await expect(page.locator("#services [role='tabpanel']:visible")).toHaveCount(1);
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

    const html = await (await request.get(PATH(locale))).text();
    for (const s of services) {
      expect(html, s.anchor).toContain(`id="${s.anchor}"`);
      expect(html, s.anchor).toContain(s.summary[locale].replace(/&/g, "&amp;").replace(/'/g, "&#x27;").slice(0, 40));
    }
    // The drawings are gone; every panel shows a photograph.
    await expect(page.locator("#services .sw-v")).toHaveCount(0);
    for (const s of services) await expect(page.locator(`#${s.anchor} img`), s.anchor).toHaveCount(1);
  });

  test(`${locale}: arrow keys move between tabs (mirrored in Arabic)`, async ({ page }) => {
    await gotoReady(page, PATH(locale));
    const tabs = page.locator("#services [role='tab']");
    await tabs.first().focus();
    await page.keyboard.press(locale === "ar" ? "ArrowLeft" : "ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(`#${services[1].anchor}`)).toBeVisible();
    await page.keyboard.press("End");
    await expect(tabs.nth(5)).toBeFocused();
    await page.keyboard.press(locale === "ar" ? "ArrowLeft" : "ArrowRight");
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  });

  test(`${locale}: a service anchor opens its panel (deep link and in-page link)`, async ({ page }) => {
    await gotoReady(page, `${PATH(locale)}#${services[1].anchor}`);
    await expect(page.locator(`#${services[1].anchor}`)).toBeVisible();
    await expect(page.locator(`#services [role='tab'][aria-controls='${services[1].anchor}']`)).toHaveAttribute("aria-selected", "true");
    await expect.poll(() => page.locator(`#${services[1].anchor}`).evaluate((e) => Math.round(e.getBoundingClientRect().top))).toBeLessThan(400);

    // A real click ends the deep link's settling (pointerdown); a scripted one doesn't, so press first.
    await page.mouse.click(2, 300);
    await page.evaluate((id) => {
      const a = document.createElement("a");
      a.href = `#${id}`;
      a.textContent = "go";
      document.body.append(a);
      a.click();
    }, services[4].anchor);
    await expect(page.locator(`#${services[4].anchor}`)).toBeVisible();
    await expect(page.locator(`#${services[1].anchor}`)).toBeHidden();
  });

  test(`${locale}: "Discuss this" still presets the consultation form`, async ({ page }) => {
    await gotoReady(page, `${PATH(locale)}?build=${services[1].anchor}#consult`);
    await expect(page.locator("#consult [name='build']:checked")).toHaveValue(services[1].anchor);
    await expect.poll(() => page.locator("#consult").evaluate((e) => Math.round(e.getBoundingClientRect().top))).toBeLessThan(200);
  });

  test(`${locale}: the phone page is under half its old length`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "the target is the phone length");
    await gotoReady(page, PATH(locale));
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(11500);
  });
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("every panel shows in order and the tab rows are hidden (ar)", async ({ page }) => {
    await page.goto(PATH("ar"));
    await expect(page.locator("[role='tablist']").first()).toBeHidden();
    const panels = page.locator("[role='tabpanel']");
    const n = await panels.count();
    expect(n).toBeGreaterThanOrEqual(8);
    for (let i = 0; i < n; i++) await expect(panels.nth(i)).toBeVisible();
  });
});

test("back and forward between two anchors switch the panel (en)", async ({ page }) => {
  await gotoReady(page, PATH("en"));
  const [a, b] = [services[1].anchor, services[2].anchor];
  await page.evaluate((h) => (location.hash = h), a);
  await expect(page.locator(`#${a}`)).toBeVisible();
  await page.evaluate((h) => (location.hash = h), b);
  await expect(page.locator(`#${b}`)).toBeVisible();
  await page.goBack();
  await expect(page.locator(`#${a}`)).toBeVisible();
  await expect(page.locator(`#${b}`)).toBeHidden();
});
