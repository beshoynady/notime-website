import { expect, type Page, type TestInfo } from "@playwright/test";
import type { CategoryTheme } from "../src/content";

/** Navigate and wait until client controllers have hydrated (ToneController marks #page-stage). */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await page.locator("#page-stage[data-tone-ready]").first().waitFor({ state: "attached" });
}

/** Wait until the home film's motion has hydrated and built its timelines (#film[data-film-ready]). */
export const controllerReady = (page: Page) => page.locator("#film[data-film-ready]").waitFor({ state: "attached" });

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
    // The bars where they rest: the header that hides on category pages (and the chip bar that
    // follows it) count as shown, so a jump down keeps the header's height above it (accepted, spec).
    const rest = (el: Element) => el.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(el).translate.split(" ")[1] ?? "") || 0);
    const target = document.getElementById(id)!.getBoundingClientRect().top;
    const header = rest(document.getElementById("site-header")!);
    const bar = document.querySelector("nav.svc-index")!;
    const chipBar = matchMedia("(max-width: 899.98px)").matches ? rest(bar) : 0;
    return target - Math.max(header, chipBar);
  }, id);
}

/**
 * The landing focuses its heading when the scroll completes (scrollToAnchor's onComplete), so that
 * is awaited first: a still scrollY alone can't tell "landed" from "not started yet" (a busy first
 * load on CI started the scroll after two equal polls, offset 3166px) or from a pause mid-flight.
 */
export async function expectLanded(page: Page, id: string) {
  await expect(page.locator(`#${id}-title`)).toBeFocused({ timeout: 10_000 });
  const offset = await landing(page, id);
  expect(Math.abs(offset), `landing offset ${offset}px`).toBeLessThanOrEqual(TOLERANCE);
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

/**
 * A category page's LCP element as the N06 hero allows it (controller ruling, 2026-11-18): the
 * hero's text (its H1 or its lead), or a hero image that is eager with `fetchpriority="high"`
 * inside `.cat-opening`'s still scene. "drawing" is a code-drawn layer of the still scene whose
 * image is an inline `data:` SVG (no request, painted with the first frame: the Workshop's ribbon
 * at 390); it is reported separately so a test can name it. `kind` is "other" for anything else.
 * A page with no still scene (Software's own opening) reports "text" for a text LCP.
 */
export function heroLcp(page: Page) {
  return page.evaluate(
    () =>
      new Promise<{ kind: "h1" | "lead" | "image" | "drawing" | "text" | "other"; label: string }>((resolve) => {
        new PerformanceObserver((list) => {
          const entry = list.getEntries().at(-1) as PerformanceEntry & { element?: Element; url: string };
          const el = entry.element ?? null;
          const label = `${el?.tagName}.${el?.className} ${entry.url}`;
          if (!document.querySelector('.cat-opening .scene[data-mode]')) return resolve({ kind: entry.url === "" ? "text" : "other", label });
          const still = el?.closest('.cat-opening .scene[data-mode]');
          if (!el || !still) return resolve({ kind: "other", label });
          if (el.matches("h1#category-title")) return resolve({ kind: "h1", label });
          if (el.matches(".cat-opening-lead")) return resolve({ kind: "lead", label });
          if (el.matches(".scene-light") && entry.url.startsWith("data:image/svg+xml")) return resolve({ kind: "drawing", label });
          const img = el instanceof HTMLImageElement && entry.url !== "" && el.loading !== "lazy" && el.getAttribute("fetchpriority") === "high";
          resolve({ kind: img ? "image" : "other", label });
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

/**
 * Each form test posts as its own client (x-forwarded-for, which the actions read for the rate
 * limit): the suite sends a dozen forms from one machine, and the limiter's fifth-in-ten-minutes
 * answer is correct behaviour, not a failure of the test under it (M3 CI).
 */
export async function asOwnClient(page: Page, info: TestInfo) {
  const n = [...`${info.project.name}|${info.titlePath.join("|")}|${info.retry}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}` });
}
