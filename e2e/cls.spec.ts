import { expect, test } from "@playwright/test";
import { emulateAndroidFonts } from "./android-fonts";
import { gotoReady } from "./helpers";

/**
 * Sum of layout-shift entries not caused by input (CLS proxy), observed from navigation start.
 * Since D156 nothing covers the first screen, so the one-step font swap (D149) is on screen. The
 * title has its own matched fallbacks (fonts.css). Arabic keeps a 0.002 allowance: the lead, the two
 * buttons and the header's quote button swap from the site-wide Alexandria faces, 4-9% narrow at
 * 400/500 (measured 0.0012 at 1440; the same on every Arabic page). Recalibrating those bands is
 * OPEN_QUESTIONS #25; then this goes back to 0.001.
 */
const LIMIT = { en: 0.001, ar: 0.002 } as const;
/**
 * Linux (the CI runner) has neither Arial nor Roboto, so neither set of matched faces would apply and
 * the swap there stood for no real visitor (CLS 0.003 EN, 0.009 AR on CI). There the page resolves
 * its fonts as a device without Arial does (Android, ChromeOS), which also covers the hero's
 * Android-matched title faces at desktop width. Windows and macOS runs measure the Arial path.
 */
const WITHOUT_ARIAL = process.platform === "linux" || process.env.E2E_WITHOUT_ARIAL === "1";
// As in android-font.spec: Chromium on Linux hints and rounds glyph advances unless told not to,
// which Android and Windows don't. The flag only acts on Linux.
test.use({ launchOptions: { args: ["--font-render-hinting=none"] } });

test.describe("no layout shift on load (font swap, hero)", () => {
  for (const locale of ["en", "ar"] as const) {
    test(`CLS is 0 (${locale})`, async ({ page }) => {
      if (WITHOUT_ARIAL) await emulateAndroidFonts(page);
      await page.addInitScript(() => {
        type Shift = { value: number; startTime: number; hadRecentInput: boolean; sources: { node?: Node; previousRect: DOMRectReadOnly; currentRect: DOMRectReadOnly }[] };
        const w = window as unknown as { __cls: number; __shifts: string[] };
        w.__cls = 0;
        w.__shifts = [];
        const name = (n?: Node) => (n instanceof Element ? `${n.tagName.toLowerCase()}.${[...n.classList].join(".")}` : String(n?.nodeName));
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as unknown as Shift[]) {
            if (e.hadRecentInput) continue;
            w.__cls += e.value;
            // The evidence a rare failure needs (an intermittent 1.0 under machine load).
            const src = e.sources.map((s) => `${name(s.node)} y ${Math.round(s.previousRect.y)}→${Math.round(s.currentRect.y)}`).join(", ");
            w.__shifts.push(`${Math.round(e.startTime)} ms, ${e.value.toFixed(4)}, scrollY ${Math.round(scrollY)}: ${src}`);
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await gotoReady(page, `/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      // Past the hand's sweep (0.2 s + 2.4 s) and the font swap, then a margin.
      await page.waitForTimeout(3000);
      const { cls, shifts } = await page.evaluate(() => {
        const w = window as unknown as { __cls: number; __shifts: string[] };
        return { cls: w.__cls, shifts: w.__shifts };
      });
      expect(cls, shifts.join(" | ")).toBeLessThan(LIMIT[locale]);
    });
  }
});
