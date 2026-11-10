import { expect, test, type Browser } from "@playwright/test";
import { waitForIntroEnd } from "./helpers";

/**
 * The hero title reads in full at rest (D94): every line's text box sits inside the viewport,
 * below the fixed header and clear of the HUD, and the CTA stays above the bottom letterbox.
 * The sizes are the user's list plus two real laptop windows (screen minus browser chrome),
 * where the title used to rise under the header and the CTA dip into the letterbox.
 */
const SIZES: [number, number][] = [
  [1440, 900],
  [1366, 768],
  [1280, 720],
  [1366, 657],
  [1280, 593],
  [390, 844],
  [360, 640],
];

type Box = { top: number; bottom: number; left: number; right: number };

async function measure(browser: Browser, w: number, h: number, locale: string, visit: "first" | "return") {
  const mobile = w < 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto(`/${locale}`);
  await waitForIntroEnd(page, 25_000); // generous: the intro runs long on a loaded machine
  if (visit === "return") {
    await page.reload();
    await page.waitForFunction(() => !!document.querySelector("#hero[data-hero-ready]") || innerWidth < 900, null, { timeout: 10_000 });
  }
  await page.waitForTimeout(1500); // the line rise settles
  const m = await page.evaluate(() => {
    const box = (r: DOMRect) => ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
    const lines = [...document.querySelectorAll("#hero-title .hero-line-inner")].map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return box(range.getBoundingClientRect());
    });
    const hud = [...document.querySelectorAll(".hero-hud > div")]
      .filter((d) => getComputedStyle(d).visibility !== "hidden" && getComputedStyle(d).display !== "none")
      .map((d) => box(d.getBoundingClientRect()));
    return {
      header: document.querySelector("#site-header")!.getBoundingClientRect().bottom,
      lines,
      hud,
      cta: box(document.querySelector(".hero-sub a")!.getBoundingClientRect()),
      letterbox: document.querySelector(".hero-letterbox.bottom")!.getBoundingClientRect().top,
      vw: innerWidth,
      vh: innerHeight,
    };
  });
  await ctx.close();
  return m;
}

const overlaps = (a: Box, b: Box) => a.top < b.bottom && b.top < a.bottom && a.left < b.right && b.left < a.right;

test.describe("hero title fits", () => {
  for (const [w, h] of SIZES)
    for (const locale of ["en", "ar"])
      for (const visit of ["first", "return"] as const)
        test(`${w}x${h} ${locale} ${visit}`, async ({ browser }, info) => {
          test.skip(info.project.name !== "desktop", "sizes are set per test; run once");
          const m = await measure(browser, w, h, locale, visit);
          for (const [i, l] of m.lines.entries()) {
            const at = `line ${i + 1}`;
            expect(l.top, `${at} below the header`).toBeGreaterThanOrEqual(m.header);
            expect(l.bottom, `${at} inside the viewport`).toBeLessThanOrEqual(m.vh);
            expect(l.left, `${at} start inside`).toBeGreaterThanOrEqual(0);
            expect(l.right, `${at} end inside`).toBeLessThanOrEqual(m.vw);
            for (const b of m.hud) expect(overlaps(l, b), `${at} clear of the HUD`).toBe(false);
          }
          expect(m.cta.bottom, "CTA above the letterbox").toBeLessThanOrEqual(m.letterbox);
        });
});
