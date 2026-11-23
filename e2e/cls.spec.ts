import { writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { emulateAndroidFonts } from "./android-fonts";
import { recorder } from "./cls-recorder";
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
// A failure keeps its trace (D168): an intermittent CLS of 1.0 lost its evidence twice.
test.use({ launchOptions: { args: ["--font-render-hinting=none"] }, trace: "retain-on-failure" });

test.describe("no layout shift on load (font swap, hero)", () => {
  for (const locale of ["en", "ar"] as const) {
    test(`CLS is 0 (${locale})`, async ({ page }, testInfo) => {
      if (WITHOUT_ARIAL) await emulateAndroidFonts(page);
      await page.addInitScript(recorder);
      const t0 = Date.now();
      await gotoReady(page, `/${locale}`);
      const tReady = Date.now() - t0;
      const early = await page.screenshot();
      await page.evaluate(() => document.fonts.ready);
      // Past the hand's sweep (0.2 s + 2.4 s) and the font swap, then a margin.
      await page.waitForTimeout(3000);
      const ev = await page.evaluate(() => {
        const w = window as unknown as { __ev: { cls: number; shifts: unknown[] } & Record<string, unknown> };
        const resources = performance.getEntriesByType("resource").map((r) => {
          const e = r as PerformanceResourceTiming;
          return { name: e.name.replace(location.origin, ""), type: e.initiatorType, start: Math.round(e.startTime), end: Math.round(e.responseEnd), size: e.transferSize };
        });
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        const faces = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style}: ${f.status}`);
        return { ...w.__ev, faces, resources, nav: nav && { responseStart: Math.round(nav.responseStart), dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd) } };
      });
      const failed = ev.cls >= LIMIT[locale];
      if (failed) {
        const evidence = { locale, project: testInfo.project.name, withoutArial: WITHOUT_ARIAL, gotoReadyMs: tReady, ...ev };
        const file = testInfo.outputPath("cls-evidence.json");
        writeFileSync(file, JSON.stringify(evidence, null, 2));
        await testInfo.attach("cls-evidence", { path: file, contentType: "application/json" });
        await testInfo.attach("screen-at-ready", { body: early, contentType: "image/png" });
        await testInfo.attach("screen-after", { body: await page.screenshot(), contentType: "image/png" });
      }
      const summary = (ev.shifts as { t: number; value: number; scrollY: number; sources: { node: string; from: { y: number }; to: { y: number } }[] }[])
        .map((s) => `${s.t} ms, ${s.value.toFixed(4)}, scrollY ${s.scrollY}: ${s.sources.map((x) => `${x.node} y ${x.from.y}→${x.to.y}`).join(", ")}`)
        .join(" | ");
      expect(ev.cls, summary).toBeLessThan(LIMIT[locale]);
    });
  }
});

/**
 * A ScrollTrigger refresh after the page has settled moves nothing (D168). A visitor gets one when
 * the page hydrates before `load` or before the fonts (a slow network), and on every window resize.
 * The cause was How we work's wrapper (its pinSpacer) switching display block ↔ flex on each refresh:
 * Chrome rebuilt the pinned stage and counted it as a full-screen shift (1.0) even off screen.
 * Software's opening has a block wrapper around a grid pin; it is here as a guard (measured: 0).
 * ScrollTrigger refreshes on the window's `load` event, so dispatching one runs a real refresh.
 */
test.describe("no layout shift when ScrollTrigger refreshes (D168)", () => {
  for (const path of ["/en", "/ar", "/en/services/software-digital"]) {
    test(`a refresh moves nothing (${path})`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop", "the pins exist from 900px");
      await page.addInitScript(recorder);
      await gotoReady(page, path);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1500);
      const before = await page.evaluate(() => (window as unknown as { __ev: { shifts: unknown[] } }).__ev.shifts.length);
      for (let i = 0; i < 2; i++) {
        await page.evaluate(() => dispatchEvent(new Event("load")));
        await page.waitForTimeout(400);
      }
      const after = await page.evaluate((n) => (window as unknown as { __ev: { shifts: { value: number; sources: { node: string }[] }[] } }).__ev.shifts.slice(n), before);
      const sum = after.reduce((a, s) => a + s.value, 0);
      expect(sum, after.map((s) => `${s.value.toFixed(4)}: ${s.sources.map((x) => x.node).join(", ")}`).join(" | ")).toBeLessThan(0.001);
    });
  }
});
