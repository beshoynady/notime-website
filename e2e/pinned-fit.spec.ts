import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * A pinned section shows all of its content (owner report, 2026-11-20: the home "How we work"
 * steps stayed cut off at the bottom of a laptop screen for the whole pin). At the last pinned
 * moment, when every build has finished, the lowest and the highest visible text or image in the
 * pin sit fully on screen: below the header (when it shows) and above the sticky quote bar.
 * Short screens: a pin that can't fit isn't pinned (process-scroll.tsx, globals.css).
 */
const SIZES = [
  { width: 1280, height: 720, project: "desktop" },
  // A 1366×768 laptop under the taskbar and the browser's tabs, address and bookmarks bars: the
  // steps of How we work ended 22px below the screen for the whole pin (owner report 2026-11-20).
  { width: 1366, height: 625, project: "desktop" },
  // A narrow laptop window: Software's opening copy is at its tallest at 1024px.
  { width: 1024, height: 660, project: "desktop" },
  { width: 375, height: 667, project: "mobile" },
] as const;
const PAGES = ["/en", "/ar", "/en/services/events-hospitality", "/ar/services/events-hospitality", "/en/services/software-digital", "/ar/services/software-digital"];

async function buildPins(page: Page) {
  // Walk down once: pins below the fold are built as the page reaches them.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => innerHeight);
  for (let y = 0; y < h; y += step) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(40);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

/** Scroll to the last moment the pin at index `i` is held, with its build finished. */
async function toPinEnd(page: Page, i: number) {
  const spacer = await page.evaluate((i) => {
    const w = document.querySelectorAll<HTMLElement>(".pin-spacer")[i];
    return { top: w.getBoundingClientRect().top + scrollY, pad: parseFloat(w.style.paddingBottom) || 0 };
  }, i);
  // Mid-pin, the pinned box sits at its start offset (0, or under the header for an inner scene).
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(spacer.top + spacer.pad / 2));
  await page.waitForTimeout(300);
  const offset = await page.evaluate((i) => Math.round(document.querySelectorAll<HTMLElement>(".pin-spacer")[i].firstElementChild!.getBoundingClientRect().top), i);
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(spacer.top + spacer.pad - Math.max(0, offset) - 2));
  await page.waitForTimeout(1200); // scrubbed timelines settle
}

function measure(page: Page, i: number) {
  return page.evaluate((i) => {
    const pin = document.querySelectorAll<HTMLElement>(".pin-spacer")[i].firstElementChild as HTMLElement;
    const shown = (e: Element) => {
      for (let n: Element | null = e; n && n !== pin.parentElement; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return false;
        if (n.getAttribute("aria-hidden") === "true" && e.tagName !== "IMG") return false;
      }
      return true;
    };
    // A scene's full-frame plate is the backdrop: it bleeds past the frame on purpose (cover, drift
    // and push), so only the content above it is measured. Framed photos still count.
    const plate = (e: Element) => {
      // The home hero's objects come in from outside the frame on purpose (D173); the copy is measured.
      if (e.closest(".hero-objects")) return true;
      const layer = e.closest<HTMLElement>(".scene-layer");
      return !!layer && /^0(px)?$/.test(layer.style.insetBlock) && /^0(px)?$/.test(layer.style.insetInline);
    };
    const leaves = [...pin.querySelectorAll("h1,h2,h3,h4,p,li,a,button,img,figcaption,dt,dd")].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 2 && r.height > 2 && shown(e) && !plate(e);
    });
    const name = (e: Element) => `${e.tagName.toLowerCase()} "${(e.textContent || e.getAttribute("alt") || "").trim().slice(0, 30)}"`;
    let low = leaves[0], high = leaves[0];
    for (const e of leaves) {
      if (e.getBoundingClientRect().bottom > low.getBoundingClientRect().bottom) low = e;
      if (e.getBoundingClientRect().top < high.getBoundingClientRect().top) high = e;
    }
    const header = document.querySelector("header");
    const hr = header?.getBoundingClientRect();
    const headerBottom = header && hr && hr.bottom > 0 && getComputedStyle(header).visibility !== "hidden" ? hr.bottom : 0;
    let floor = innerHeight;
    const bar = document.querySelector(".cta-bar");
    if (bar) {
      const cs = getComputedStyle(bar);
      const br = bar.getBoundingClientRect();
      if (cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.05 && br.height > 0 && br.top < innerHeight) floor = br.top;
    }
    return {
      pin: pin.parentElement!.className.replace("pin-spacer", "").trim(),
      count: leaves.length,
      low: name(low),
      lowBottom: Math.round(low.getBoundingClientRect().bottom),
      high: name(high),
      highTop: Math.round(high.getBoundingClientRect().top),
      floor: Math.round(floor),
      headerBottom: Math.round(headerBottom),
    };
  }, i);
}

for (const size of SIZES) {
  test.describe(`${size.width}×${size.height}`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });
    for (const path of PAGES) {
      test(`${path}: every pin shows its last element on screen`, async ({ page }, info) => {
        test.skip(info.project.name !== size.project, `runs in the ${size.project} project`);
        test.setTimeout(90_000);
        await gotoReady(page, path);
        await page.evaluate(() => document.fonts.ready);
        await buildPins(page);
        const pins = await page.locator(".pin-spacer").count();
        for (let i = 0; i < pins; i++) {
          await toPinEnd(page, i);
          const m = await measure(page, i);
          expect(m.count, `${m.pin}: shows content`).toBeGreaterThan(0);
          expect(m.lowBottom, `${m.pin}: ${m.low} ends below the screen or under the quote bar`).toBeLessThanOrEqual(m.floor + 1);
          expect(m.highTop, `${m.pin}: ${m.high} starts under the header`).toBeGreaterThanOrEqual(m.headerBottom - 1);
        }
      });
    }
  });
}
