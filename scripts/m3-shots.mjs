#!/usr/bin/env node
/**
 * M3 screenshots: every page in the sitemap plus the 404, in EN and AR, at 1440 and 390.
 *   node scripts/m3-shots.mjs [--base=http://localhost:3100] [--only=/contact] [--out=docs/checkpoints/m3]
 * Writes docs/checkpoints/m3/<page>/full-{locale}-{width}.jpg: the whole page in reduced motion
 * (every section in its final state), stitched from viewport tiles as in fullpage.mjs (the page
 * ground is a fixed stage that follows the scroll). JPEG, since a phone-width page outgrows
 * WebP's 16,383 px limit and PNGs of 88 pages would weigh hundreds of MB. Console errors and
 * horizontal overflow go to docs/checkpoints/m3/summary.json.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith("--base="))?.slice(7) ?? "http://localhost:3100").replace(/\/$/, "");
const only = args.find((a) => a.startsWith("--only="))?.slice(7);
const out = args.find((a) => a.startsWith("--out="))?.slice(6) ?? path.join("docs", "checkpoints", "m3");

const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const routes = [
  ...new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname)
      .filter((p) => p === "/en" || p.startsWith("/en/"))
      .map((p) => p.slice(3) || "/"),
  ),
  "/this-page-does-not-exist",
].filter((r) => !only || r === only);
// --only also takes a route the sitemap leaves out (/links is noindex).
if (only && !routes.length) routes.push(only);

const sizes = [
  { width: 1440, height: 900, mobile: false },
  { width: 390, height: 844, mobile: true },
];
const name = (r) => (r === "/" ? "home" : r === "/this-page-does-not-exist" ? "404" : r.slice(1).replaceAll("/", "__"));
const browser = await chromium.launch({ channel: "chrome" });
const summary = [];

for (const route of routes) {
  const dir = path.join(out, name(route));
  await mkdir(dir, { recursive: true });
  for (const s of sizes) {
    for (const locale of ["en", "ar"]) {
      const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: 1, isMobile: s.mobile, hasTouch: s.mobile, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      const errors = [];
      page.on("console", (m) => m.type() === "error" && !/404 \(Not Found\)/.test(m.text()) && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(String(e)));
      const url = `${base}/${locale}${route === "/" ? "" : route}`;
      // Fonts are display: optional (D38): load once so they're cached, then reload.
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      // Walk down once so lazy modules and images load.
      const total0 = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total0; y += Math.round(s.height * 0.8)) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(140);
      }
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const tiles = [];
      for (let y = 0; ; y += s.height) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(350);
        const at = await page.evaluate(() => scrollY);
        tiles.push({ top: at, buf: await page.screenshot() });
        if (tiles.length === 1) await page.addStyleTag({ content: "body header:not(main header){visibility:hidden!important}" });
        if (at + s.height >= total) break;
      }
      await sharp({ create: { width: s.width, height: total, channels: 3, background: "#000" }, limitInputPixels: false })
        .composite(tiles.map((t) => ({ input: t.buf, top: t.top, left: 0 })))
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(path.join(dir, `full-${locale}-${s.width}.jpg`));
      summary.push({ route, locale, width: s.width, height: total, overflow, errors });
      console.log(`✓ ${route} ${locale} ${s.width} (${total}px)${overflow > 0 ? ` OVERFLOW ${overflow}px` : ""}${errors.length ? ` errors: ${errors.length}` : ""}`);
      await ctx.close();
    }
  }
}

await browser.close();
await writeFile(path.join(out, only ? `summary-${name(only)}.json` : "summary.json"), JSON.stringify(summary, null, 2));
