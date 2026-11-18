import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/** N04: the shared mobile CTA bar. Phones only; hidden at first; hides for forms, the quote block and the keyboard. */
const LABEL = { en: "Quick contact", ar: "تواصل سريع" } as const;
const QUOTE = { en: "Request a quote", ar: "اطلبوا عرض سعر" } as const;
const bar = (page: Page, locale: "en" | "ar") => page.getByRole("region", { name: LABEL[locale] });

/** Past the opening: scroll just beyond the marked opening's bottom edge. */
async function pastOpening(page: Page) {
  await page.evaluate(() => {
    // The home hero is pinned inside its spacer: the opening ends where the spacer ends.
    const opening = document.querySelector("[data-cta-opening]")!;
    const el = opening.closest(".hero-pin") ?? opening;
    window.scrollTo(0, el.getBoundingClientRect().bottom + window.scrollY + 40);
  });
}

test.describe("mobile CTA bar", () => {
  test.describe("phone", () => {
    test.beforeEach(({}, info) => test.skip(info.project.name !== "mobile", "phone width"));

    test("hidden at first, shown after the opening, links to /contact", async ({ page }) => {
      await gotoReady(page, "/en");
      await expect(bar(page, "en")).toBeHidden();
      await pastOpening(page);
      await expect(bar(page, "en")).toBeVisible();
      await expect(bar(page, "en").getByRole("link", { name: QUOTE.en })).toHaveAttribute("href", "/en/contact");
      await expect(bar(page, "en").getByRole("link")).toHaveCount(1); // no WhatsApp number yet (D78)
    });

    test("category pages carry the hint", async ({ page }) => {
      await gotoReady(page, "/ar/services/creative-production");
      await pastOpening(page);
      await expect(bar(page, "ar")).toBeVisible();
      await expect(bar(page, "ar").getByRole("link", { name: QUOTE.ar })).toHaveAttribute("href", "/ar/contact?category=creative-production");
    });

    test("not on contact, not on Software's page, never on /links", async ({ page }) => {
      await gotoReady(page, "/en/contact");
      await expect(page.locator(".cta-bar")).toHaveCount(0);
      await page.goto("/en/links");
      await expect(page.locator(".cta-bar")).toHaveCount(0);
      await gotoReady(page, "/en/services/software-digital");
      await expect(page.locator(".cta-bar")).toHaveCount(0);
      await expect(page.locator(".sw-sticky")).toHaveCount(1);
      await expect(page.getByRole("region", { name: "Quick contact" })).toHaveCount(0);
      await expect(page.locator(".sw-sticky")).toHaveAttribute("role", "region");
    });

    test("hides for the keyboard (a focused text field)", async ({ page }) => {
      await gotoReady(page, "/en/services/marketing-brand");
      await pastOpening(page);
      await expect(bar(page, "en")).toBeVisible();
      // Category pages have no form of their own: put a text field in the page, away from the quote block.
      await page.evaluate(() => {
        const i = document.createElement("input");
        i.id = "kb-probe";
        i.type = "email";
        i.style.cssText = "position:fixed;inset-block-start:90px;inset-inline-start:20px;z-index:1";
        document.body.append(i);
      });
      await page.locator("#kb-probe").focus();
      await expect(bar(page, "en")).toBeHidden();
      await page.locator("#kb-probe").blur();
      await expect(bar(page, "en")).toBeVisible();
    });

    test("hides while the quote block is in view", async ({ page }) => {
      await gotoReady(page, "/en/services/marketing-brand");
      await pastOpening(page);
      await expect(bar(page, "en")).toBeVisible();
      await page.locator("#quote").scrollIntoViewIfNeeded();
      await page.evaluate(() => document.querySelector("#quote")!.scrollIntoView({ block: "center" }));
      await expect(bar(page, "en")).toBeHidden();
    });

    test("never covers the footer", async ({ page }) => {
      await gotoReady(page, "/en/work");
      await pastOpening(page);
      await expect(bar(page, "en")).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(600);
      const gap = await page.evaluate(() => {
        const links = document.querySelectorAll("footer a");
        const last = links[links.length - 1].getBoundingClientRect();
        const b = document.querySelector(".cta-bar")!.getBoundingClientRect();
        return { lastBottom: last.bottom, barTop: b.top, shown: document.querySelector(".cta-bar")!.hasAttribute("data-show") };
      });
      // At the end the bar may be showing or not; either way the last link clears it.
      expect(gap.lastBottom).toBeLessThanOrEqual(gap.barTop);
    });

    for (const [path, sel] of [
      ["/en/services/marketing-brand", ".cta-bar"],
      ["/en/services/software-digital", ".sw-sticky"],
    ] as const) {
      test(`steps aside while the menu is open: ${sel}`, async ({ page }) => {
        await gotoReady(page, path);
        await pastOpening(page);
        const b = page.locator(sel);
        await expect(b).toBeVisible();
        // Category pages hide the header on the way down: a short scroll up, well past the opening, brings the burger back.
        await page.evaluate(async () => {
          window.scrollTo({ top: scrollY + 600, behavior: "instant" });
          for (let i = 0; i < 3; i++) {
            window.scrollTo({ top: scrollY - 40, behavior: "instant" });
            await new Promise((r) => requestAnimationFrame(r));
          }
        });
        const burger = page.locator("button[aria-controls=mobile-nav]");
        await expect(burger).toBeInViewport();
        await expect(b).toBeVisible();
        await burger.click();
        await expect(page.locator("#mobile-nav")).toBeVisible();
        await expect(b).toBeHidden();
        // Out of the Tab order: Tab from the menu's last control never lands in the bar, and its links can't take focus.
        await page.locator("#mobile-nav").locator("a, button, summary").last().focus();
        await page.keyboard.press("Tab");
        expect(await page.evaluate((s) => !!document.activeElement?.closest(s), sel)).toBe(false);
        expect(await b.evaluate((el) => [...el.querySelectorAll("a")].some((a) => (a.focus(), document.activeElement === a)))).toBe(false);
        await burger.click();
        await expect(page.locator("#mobile-nav")).toBeHidden();
        await expect(b).toBeVisible();
      });
    }

    test("no layout shift while the bar shows and hides", async ({ page }) => {
      await page.addInitScript(() => {
        const w = window as unknown as { __cls: number };
        w.__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) w.__cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      await gotoReady(page, "/en/services/marketing-brand");
      await pastOpening(page);
      await expect(bar(page, "en")).toBeVisible();
      await page.evaluate(() => document.querySelector("#quote")!.scrollIntoView({ block: "center" }));
      await expect(bar(page, "en")).toBeHidden();
      await page.waitForTimeout(500);
      expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.01);
    });
  });

  test("desktop: none", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop width");
    await gotoReady(page, "/en/services/marketing-brand");
    await pastOpening(page);
    await page.waitForTimeout(500);
    await expect(page.locator(".cta-bar")).toBeHidden();
  });
});
