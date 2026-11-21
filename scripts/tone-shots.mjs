#!/usr/bin/env node
/**
 * Screenshots at every dark ↔ light turn of a page, to compare two builds (D115: the stage tweens
 * its own background-color instead of the inherited --page-bg; nothing should look different).
 *   node scripts/tone-shots.mjs <base> <out-dir> [--paths=/en,/ar,/en/about,/ar/about]
 * For each page, width (1440, 390) and turn: one shot with the turn's line at 70% of the viewport
 * (the old ground still on) and one at 35% (the new ground on), each after the 0.9 s tween settles.
 * File names: <path>_<width>_t<turn>_<before|after>.png. Compare two folders with --compare.
 *   node scripts/tone-shots.mjs --compare <dir-a> <dir-b>   (pixel difference per file, via sharp)
 */
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const opt = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;

if (process.argv.includes("--compare")) {
  const sharp = (await import("sharp")).default;
  const [a, b] = process.argv.slice(2).filter((x) => !x.startsWith("--"));
  let worst = 0;
  for (const f of readdirSync(a).filter((f) => f.endsWith(".png"))) {
    const [ra, rb] = await Promise.all([a, b].map((d) => sharp(path.join(d, f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
    if (ra.info.width !== rb.info.width || ra.info.height !== rb.info.height) {
      console.log(`${f}: size differs`);
      continue;
    }
    let diff = 0;
    let maxd = 0;
    for (let i = 0; i < ra.data.length; i += 4) {
      const d = Math.max(...[0, 1, 2].map((c) => Math.abs(ra.data[i + c] - rb.data[i + c])));
      if (d > 8) diff++;
      maxd = Math.max(maxd, d);
    }
    const pct = (100 * diff) / (ra.info.width * ra.info.height);
    worst = Math.max(worst, pct);
    console.log(`${f}: ${pct.toFixed(3)}% of pixels differ by more than 8/255 (largest channel difference ${maxd})`);
  }
  console.log(`worst: ${worst.toFixed(3)}%`);
  process.exit(0);
}

const { chromium } = await import("@playwright/test");
const [base, out] = process.argv.slice(2).filter((x) => !x.startsWith("--"));
const paths = opt("paths", "/en,/ar,/en/about,/ar/about").split(",");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const p of paths)
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
  ]) {
    const mobile = w < 900;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(base + p, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    // Turns: the top of each ground section whose tone differs from the one before (document y).
    const turns = await page.evaluate(() => {
      const box = (el) => (el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el);
      const secs = [...document.querySelectorAll("#page-stage section[data-tone]")].filter((s) => s.checkVisibility() && !s.closest("footer"));
      const ys = [];
      for (let i = 1; i < secs.length; i++)
        if (secs[i].dataset.tone !== secs[i - 1].dataset.tone) ys.push(box(secs[i]).getBoundingClientRect().top + scrollY);
      return ys;
    });
    for (const [t, y] of turns.entries())
      for (const [label, at] of [
        ["before", 0.7],
        ["after", 0.35],
      ]) {
        await page.evaluate((top) => window.scrollTo(0, top), y - h * at);
        await page.waitForTimeout(1800);
        const name = `${p.replace(/\//g, "_") || "_"}_${w}_t${t + 1}_${label}.png`;
        await page.screenshot({ path: path.join(out, name), animations: "disabled", caret: "hide" });
      }
    console.log(p, w, `${turns.length} turns`);
    await ctx.close();
  }
await browser.close();
