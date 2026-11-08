import { expect, type Page } from "@playwright/test";
import type { CategoryTheme } from "../src/content";

/** Navigate and wait until client controllers have hydrated (ToneController marks #page-stage). */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await page.locator("#page-stage[data-tone-ready]").first().waitFor({ state: "attached" });
}

/** Wait until the hero controller has hydrated and taken over (it sets #hero[data-hero-ready]). */
export const controllerReady = (page: Page) => page.locator("#hero[data-hero-ready]").waitFor({ state: "attached" });

/**
 * Wait for the first-visit intro to end (it sets html[data-intro-seen]). On timeout, fail with
 * the page's state, so a stalled intro says why: an rAF count that stops growing means the page
 * was not rendering frames (GSAP's timeline only advances on rAF), not a controller bug.
 */
export async function waitForIntroEnd(page: Page, timeout = 10_000) {
  try {
    // Timer polling, not the default rAF polling: this waits for a DOM attribute, and must
    // still see it if the page stops producing frames.
    await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen"), null, { timeout, polling: 200 });
  } catch (err) {
    const state = await page
      .evaluate(async () => {
        let raf = 0;
        let counting = true;
        const tick = () => counting && (raf++, requestAnimationFrame(tick));
        requestAnimationFrame(tick);
        await new Promise((done) => setTimeout(done, 1000));
        counting = false;
        const hero = document.querySelector("#hero");
        return {
          now: Math.round(performance.now()),
          rafFramesIn1s: raf,
          visibility: document.visibilityState,
          readyState: document.readyState,
          heroIntro: hero?.hasAttribute("data-hero-intro"),
          heroReady: hero?.hasAttribute("data-hero-ready"),
          session: sessionStorage.getItem("nt-intro"),
          shutter: getComputedStyle(document.querySelector(".hero-shutter") ?? document.body).transform,
        };
      })
      .catch((e: Error) => ({ evaluateFailed: e.message }));
    throw new Error(`intro did not end within ${timeout} ms: ${JSON.stringify(state)}`, { cause: err });
  }
}

/** Anchor landings (D53): within ±4px of the lowest covering bar. */
const TOLERANCE = 4;

/** Target top minus the lowest covering bar's bottom, once the scroll has stopped. */
export async function landing(page: Page, id: string) {
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
    const bar = document.querySelector("nav.svc-index")!;
    const chipBar = matchMedia("(max-width: 899.98px)").matches ? bar.getBoundingClientRect().bottom : 0;
    return target - Math.max(header, chipBar);
  }, id);
}

export async function expectLanded(page: Page, id: string) {
  const offset = await landing(page, id);
  expect(Math.abs(offset), `landing offset ${offset}px`).toBeLessThanOrEqual(TOLERANCE);
  await expect(page.locator(`#${id}-title`)).toBeFocused();
}

/** The page's LCP entry so far: its element as `TAG#id`, and its url ("" for text). */
export function lcpEntry(page: Page) {
  return page.evaluate(
    () =>
      new Promise<{ element: string; url: string }>((resolve) => {
        new PerformanceObserver((list) => {
          const entry = list.getEntries().at(-1) as PerformanceEntry & { element?: Element; url: string };
          resolve({ element: `${entry.element?.tagName}#${entry.element?.id}`, url: entry.url });
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );
}

/** Each theme's page ground per tone, as `#page-stage` computes it (shared by the category specs). */
export const GROUND: Record<CategoryTheme, { dark?: string; light?: string }> = {
  evening: { dark: "rgb(46, 32, 23)", light: "rgb(245, 233, 211)" }, // espresso, ivory "morning after" band
  studio: { dark: "rgb(13, 8, 5)" }, // night
  editorial: { light: "rgb(245, 233, 211)" }, // ivory
  workshop: { light: "rgb(234, 212, 171)" }, // champagne
  interface: { light: "rgb(245, 233, 211)" }, // ivory
};
