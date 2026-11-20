import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * The owner (2026-11-20): a late font swap moves nothing on Android either. Android has no Arial,
 * so the stack falls to the Roboto-matched faces (Roboto for Latin, Noto Naskh Arabic for Arabic).
 * A Pixel is imitated here: local("Arial") is made to miss, and the Roboto and Naskh local()
 * sources are served from OFL subsets (e2e/fixtures/android-fonts). The brand fonts are held back
 * 1.5s, so the swap always happens on screen. Runs on any machine, the Linux CI runner included.
 */
const FIXTURES = path.join(__dirname, "fixtures", "android-fonts");
/** Inline, so they are ready at the first paint, as a phone's own system faces are (a url() face
 *  would load late and was not even fetched during the swap). */
const inline = (file: string) => `url(data:font/woff2;base64,${readFileSync(path.join(FIXTURES, file)).toString("base64")})`;
const ROBOTO = inline("roboto.woff2");
const NASKH = inline("noto-naskh-arabic.woff2");

/**
 * A src list of local() faces, quoted or not (the build's minifier drops the quotes), and with the
 * quotes escaped where the CSS also sits in a script string (the page's RSC payload).
 */
const q = '(?:\\\\?")?';
const locals = (...names: string[]) => new RegExp(names.map((n) => `local\\(\\s*${q}${n}${q}\\s*\\)`).join("\\s*,\\s*"), "g");

/** The site's CSS as a Pixel resolves it: no Arial; Roboto and Naskh from the fixtures. Quote-free. */
function asAndroid(css: string) {
  return css
    .replace(locals("Arial"), "local(nt-no-arial-on-android)")
    .replace(locals("Roboto", "Roboto Regular", "Roboto-Regular"), ROBOTO)
    .replace(locals("Noto Naskh Arabic", "Noto Naskh Arabic Regular", "NotoNaskhArabic-Regular"), NASKH);
}

const PAGES = ["/en", "/en/services/software-digital", "/en/about", "/ar", "/ar/about", "/ar/contact", "/ar/services/events-hospitality"];

// Android draws text unhinted, with fractional advances. Chromium on Linux (the CI runner) hints
// and rounds each glyph's advance to a whole pixel by default, which moved line breaks by a word
// on two pages that Android, like Windows, sets as the fallback did (D149). The flag only acts on
// Linux.
test.use({ launchOptions: { args: ["--font-render-hinting=none"] } });

for (const p of PAGES) {
  test(`${p}: a late font swap on Android moves nothing`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "Android is a phone");
    // The CSS is inlined in the documents; a stylesheet, where there is one, gets the same.
    await page.route("**/*", async (route) => {
      const type = route.request().resourceType();
      if (type !== "document" && type !== "stylesheet") return route.fallback();
      const response = await route.fetch();
      const headers = { ...response.headers() };
      delete headers["content-length"];
      delete headers["content-encoding"];
      const text = await response.text();
      // In a document, only the <style> blocks: the RSC payload's text rows carry their own
      // byte lengths, and an edit there breaks hydration.
      const body = type === "stylesheet" ? asAndroid(text) : text.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, (block) => asAndroid(block));
      await route.fulfill({ status: response.status(), headers, body });
    });
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
