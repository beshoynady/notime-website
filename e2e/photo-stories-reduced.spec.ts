import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Decision #31's condition: every photo story has a static version under reduced motion (the
 * final state, nothing pinned, tweened or clipped), at both widths.
 */
test.use({ reducedMotion: "reduce" });

/** Scrolls through the element, so anything that would only appear on scroll has had its chance. */
async function scrollThrough(page: Page, sel: string) {
  await page.evaluate(async (sel) => {
    const el = document.querySelector<HTMLElement>(sel)!;
    const top = el.getBoundingClientRect().top + scrollY;
    for (let y = top - innerHeight; y < top + el.offsetHeight; y += innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  }, sel);
}

/** Inline styles GSAP would have written (transform, clip-path, opacity) inside the element. */
const tweened = (page: Page, sel: string) =>
  page.evaluate((sel) => {
    const out: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>(`${sel}, ${sel} *`)) {
      const s = el.style;
      if (s.transform || s.translate || s.scale || s.clipPath || (s.opacity && s.opacity !== "1")) out.push(`${el.className}: ${el.getAttribute("style")}`);
    }
    return out;
  }, sel);

/** Every image inside the element, scrolled to the middle of the screen, is laid out and opaque. */
const imagesShown = (page: Page, sel: string) =>
  page.evaluate(async (sel) => {
    const hidden: string[] = [];
    for (const img of document.querySelectorAll<HTMLImageElement>(`${sel} img`)) {
      img.scrollIntoView({ block: "center" });
      await new Promise((r) => setTimeout(r, 120));
      const r = img.getBoundingClientRect();
      let o = 1;
      for (let n: HTMLElement | null = img; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
      if (!(r.width > 0 && r.height > 0 && o > 0.99)) hidden.push(`${img.alt} (${Math.round(r.width)}x${Math.round(r.height)}, opacity ${o})`);
    }
    return hidden;
  }, sel);

test("About: the one-evening story is plain photos and text", async ({ page }) => {
  await gotoReady(page, "/en/about");
  await scrollThrough(page, "#ab-room");
  expect(await tweened(page, "#ab-room")).toEqual([]);
  expect(await imagesShown(page, "#ab-room")).toEqual([]);
});

test("Home: the photo strip is a swipe row, not a pinned scrub", async ({ page }) => {
  await gotoReady(page, "/en");
  await scrollThrough(page, "#home-strip");
  const strip = await page.evaluate(() => {
    const root = document.getElementById("home-strip")!;
    const track = root.querySelector<HTMLElement>(".pstrip-track")!;
    return { tall: root.offsetHeight / innerHeight, overflow: getComputedStyle(track).overflowX, focusable: track.tabIndex === 0 };
  });
  expect(strip.tall).toBeLessThan(1.6);
  expect(strip.overflow).toBe("auto");
  expect(strip.focusable).toBe(true);
  expect(await tweened(page, "#home-strip")).toEqual([]);
});

for (const path of ["/en/services/events-hospitality", "/ar/services/production-print-gifts"]) {
  test(`${path}: the opening scene is its still, unpinned and unclipped`, async ({ page }) => {
    await gotoReady(page, path);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    const clipped = await page.locator(".scene").first().locator("[data-layer]").evaluateAll((layers) =>
      layers.filter((l) => {
        const c = getComputedStyle(l).clipPath;
        return c !== "none" && !/inset\(0(px|%)?\)/.test(c) && c !== "inset(0% 0% 0% 0%)";
      }).length,
    );
    expect(await page.locator(".scene").first().locator("[data-layer]").count()).toBeGreaterThan(0);
    expect(clipped).toBe(0);
  });
}
