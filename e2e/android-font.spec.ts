import { expect, test } from "@playwright/test";
import { emulateAndroidFonts } from "./android-fonts";
import { gotoReady } from "./helpers";

/**
 * The owner (2026-11-20): a late font swap moves nothing on Android either. Android has no Arial,
 * so the stack falls to the Roboto-matched faces (Roboto for Latin, Noto Naskh Arabic for Arabic).
 * A Pixel is imitated here: local("Arial") is made to miss, and the Roboto and Naskh local()
 * sources are served from OFL subsets (e2e/android-fonts.ts). The brand fonts are held back
 * 1.5s, so the swap always happens on screen. Runs on any machine, the Linux CI runner included.
 */
const PAGES = ["/en", "/en/services/software-digital", "/en/about", "/ar", "/ar/about", "/ar/contact", "/ar/services/events-hospitality"];

// Android draws text unhinted, with fractional advances. Chromium on Linux (the CI runner) hints
// and rounds each glyph's advance to a whole pixel by default, which moved line breaks by a word
// on two pages that Android, like Windows, sets as the fallback did (D149). The flag only acts on
// Linux.
test.use({ launchOptions: { args: ["--font-render-hinting=none"] } });

for (const p of PAGES) {
  test(`${p}: a late font swap on Android moves nothing`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "Android is a phone");
    await emulateAndroidFonts(page);
    // The system faces are on the device; only the brand files travel. Held back, then delivered
    // in request order.
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
    await gotoReady(page, p);
    // The imitation took: Arial is gone and a Roboto-matched face is in use until the swap.
    const probe = await page.evaluate(async () => ({
      arial: await new FontFace("nt-arial-probe", 'local("nt-no-arial-on-android")').load().then(
        () => true,
        () => false,
      ),
      android: [...document.fonts].some((f) => f.family.includes("Android") && f.status === "loaded"),
    }));
    expect(probe).toEqual({ arial: false, android: true });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const { cls, shifts } = await page.evaluate(() => {
      const w = window as unknown as { __shifts: string[]; __cls: number };
      return { cls: w.__cls, shifts: w.__shifts };
    });
    expect(cls, shifts.join("\n")).toBeLessThan(0.01);
  });
}
