import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Self-audit B02 (2026-11-20): when the brand face arrives after the first paint (a cold visit on
 * a slow line), the swap from the fallback must not move the page. One fallback face matched only
 * the regular weight's Latin width, so the Software opening jumped 30px (CLS 0.17) and Arabic text
 * re-wrapped. Here every font file is held back 1.5s, so the swap always happens on screen.
 */
const PAGES = ["/en/services/software-digital", "/en/about", "/ar/about", "/ar/contact", "/ar/services/events-hospitality"];

for (const path of PAGES) {
  test(`${path}: a late font swap moves nothing`, async ({ page, isMobile }) => {
    test.skip(isMobile, "measured at laptop width; the fallbacks are the same faces on a phone");
    // Held back 1.5s, then delivered in request order (the preloads' order, as one HTTP/2
    // connection mostly delivers them).
    let queue = new Promise((r) => setTimeout(r, 1500));
    await page.route("**/fonts/*.woff2", async (route) => {
      const turn = queue.then(() => route.continue());
      queue = turn.then(() => new Promise((r) => setTimeout(r, 30)));
      await turn;
    });
    await page.addInitScript(() => {
      const w = window as unknown as { __shifts: string[]; __cls: number };
      w.__cls = 0;
      w.__shifts = [];
      new PerformanceObserver((list) => {
        type Rect = { x: number; y: number; width: number; height: number };
        const r = (b: Rect) => `${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)}`;
        for (const e of list.getEntries() as unknown as { value: number; startTime: number; hadRecentInput: boolean; sources: { node?: Node; previousRect: Rect; currentRect: Rect }[] }[]) {
          if (e.hadRecentInput) continue;
          w.__cls += e.value;
          const what = (n?: Node) => (n instanceof Element ? `${n.tagName.toLowerCase()}.${String(n.className).split(" ")[0]}` : (n?.textContent ?? "?").slice(0, 16));
          w.__shifts.push(`${e.value.toFixed(4)} @${Math.round(e.startTime)}ms ${e.sources.map((s) => `${what(s.node)} ${r(s.previousRect)} -> ${r(s.currentRect)}`).join(" | ")}`);
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await gotoReady(page, path);
    // The matched fallbacks are local Arial (Windows, macOS, iOS). Where it's missing (the Linux CI
    // runner, Android), the stack falls through to the system sans, which nothing is matched to.
    // Checked as the fallbacks use it, through local(): a plain "Arial" family can resolve to an
    // alias (Liberation Sans on Linux) that local("Arial") never matches.
    const hasArial = await page.evaluate(() =>
      new FontFace("nt-arial-probe", 'local("Arial")').load().then(
        () => true,
        () => false,
      ),
    );
    test.skip(!hasArial, "no local Arial: the fallbacks have nothing to match");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const { cls, shifts } = await page.evaluate(() => {
      const w = window as unknown as { __shifts: string[]; __cls: number };
      return { cls: w.__cls, shifts: w.__shifts };
    });
    expect(cls, shifts.join("\n")).toBeLessThan(0.01);
  });
}
