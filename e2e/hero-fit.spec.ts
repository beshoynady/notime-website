import { expect, test, type Browser } from "@playwright/test";

/**
 * The hero reads in full at its end state (D94, D173): every title line's text box sits inside the
 * viewport, below the fixed header, and clear of the five objects and their captions; the eyebrow
 * and both CTAs (N05) stay inside the frame and clear of the objects, the CTAs above the timecode.
 * The end state is the layout itself, measured under reduced motion (the static frame).
 * The sizes are the user's list plus two real laptop windows (screen minus browser chrome),
 * where the title used to rise under the header.
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

async function measure(browser: Browser, w: number, h: number, locale: string) {
  const mobile = w < 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`/${locale}`);
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const m = await page.evaluate(() => {
    const box = (r: DOMRect) => ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
    const lines = [...document.querySelectorAll("#hero-title .hero-line")].map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return box(range.getBoundingClientRect());
    });
    // Each object: its picture and, where shown, its caption.
    const objects = [...document.querySelectorAll(".hero-object-img, .hero-object figcaption")]
      .filter((d) => getComputedStyle(d).display !== "none")
      .map((d) => box(d.getBoundingClientRect()));
    return {
      header: document.querySelector("#site-header")!.getBoundingClientRect().bottom,
      lines,
      objects,
      ctas: [...document.querySelectorAll("#hero .hero-sub a")].map((a) => box(a.getBoundingClientRect())),
      eyebrow: box(document.querySelector("#hero .hero-eyebrow")!.getBoundingClientRect()),
      tc: document.querySelector("#hero .hero-tc")!.getBoundingClientRect().top,
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
      test(`${w}x${h} ${locale}`, async ({ browser }, info) => {
          test.skip(info.project.name !== "desktop", "sizes are set per test; run once");
          const m = await measure(browser, w, h, locale);
          for (const [i, l] of m.lines.entries()) {
            const at = `line ${i + 1}`;
            expect(l.top, `${at} below the header`).toBeGreaterThanOrEqual(m.header);
            expect(l.bottom, `${at} inside the viewport`).toBeLessThanOrEqual(m.vh);
            expect(l.left, `${at} start inside`).toBeGreaterThanOrEqual(0);
            expect(l.right, `${at} end inside`).toBeLessThanOrEqual(m.vw);
            for (const b of m.objects) expect(overlaps(l, b), `${at} clear of the objects`).toBe(false);
          }
          expect(m.eyebrow.top, "eyebrow below the header").toBeGreaterThanOrEqual(m.header);
          for (const b of m.objects) expect(overlaps(m.eyebrow, b), "eyebrow clear of the objects").toBe(false);
          expect(m.ctas.length, "two CTAs").toBe(2);
          for (const [i, c] of m.ctas.entries()) {
            expect(c.bottom, `CTA ${i + 1} above the timecode`).toBeLessThanOrEqual(m.tc);
            expect(c.bottom, `CTA ${i + 1} inside the viewport`).toBeLessThanOrEqual(m.vh);
            for (const b of m.objects) expect(overlaps(c, b), `CTA ${i + 1} clear of the objects`).toBe(false);
            expect(c.left, `CTA ${i + 1} start inside`).toBeGreaterThanOrEqual(0);
            expect(c.right, `CTA ${i + 1} end inside`).toBeLessThanOrEqual(m.vw);
          }
        });
});
