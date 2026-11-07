#!/usr/bin/env node
/**
 * Checkpoint screenshots.
 *   node scripts/shots.mjs <label> [--hero] [--base=http://localhost:3100]
 * Writes docs/checkpoints/<label>/{en,ar}-{1440,390}[-reduced].png plus menu-open states
 * ({locale}-{width}-menu.png). With --hero, per locale and width: hero-{locale}-{width}-intro-end.png,
 * -scroll-split.png (title splitting, particles warping) and -scroll-beat.png (second beat), plus
 * hero.webp (animated recording of intro + scroll, 1440 viewport at 960px, EN).
 * Uses the installed Chrome (channel: "chrome"); no Playwright browser downloads.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const args = process.argv.slice(2);
const label = args.find((a) => !a.startsWith("--")) ?? "latest";
const hero = args.includes("--hero");
const base = (args.find((a) => a.startsWith("--base="))?.slice(7) ?? "http://localhost:3100").replace(/\/$/, "");
const out = path.join("docs", "checkpoints", label);
await mkdir(out, { recursive: true });

const sizes = [
  { width: 1440, height: 900, mobile: false },
  { width: 390, height: 844, mobile: true },
];

const browser = await chromium.launch({ channel: "chrome" });

const contextFor = (s, reduced = false) =>
  browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: s.mobile ? 2 : 1,
    isMobile: s.mobile,
    hasTouch: s.mobile,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });

/**
 * Fonts use display: optional (D38): on a cold first load the page usually stays in the
 * fallback face. Shots load the page once in the same tab (fonts land in the memory cache;
 * a separate warm-up tab is not enough, measured), clear sessionStorage so the intro plays
 * again, and reload. `cold-first-visit-en-1440.png` records the cold case on purpose.
 */
async function warmFonts(page, locale) {
  await page.goto(`${base}/${locale}`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => sessionStorage.clear());
}

async function open(ctx, locale, reduced, { warm = true } = {}) {
  const page = await ctx.newPage();
  if (warm) await warmFonts(page, locale);
  // Same readiness marker as e2e/helpers.ts gotoReady (importing .ts from .mjs warns in Node).
  await page.goto(`${base}/${locale}`);
  await page.locator("#stage[data-tone-ready]").first().waitFor({ state: "attached" });
  await page.evaluate(() => document.fonts.ready);
  // First visit: wait for the intro to end (it sets html[data-intro-seen]); none when reduced.
  if (!reduced) {
    await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen"), null, { timeout: 15_000 });
    await page.waitForTimeout(400);
  }
  return page;
}

for (const reduced of [false, true]) {
  for (const s of sizes) {
    const ctx = await contextFor(s, reduced);
    for (const locale of ["en", "ar"]) {
      const page = await open(ctx, locale, reduced);
      const name = `${locale}-${s.width}${reduced ? "-reduced" : ""}`;
      await page.screenshot({ path: path.join(out, `${name}.png`) });
      if (!reduced) {
        const trigger = s.mobile ? "button[aria-controls=mobile-nav]" : "button[aria-controls=mega-panel]";
        await page.locator(trigger).click();
        await page.waitForTimeout(1300);
        await page.screenshot({ path: path.join(out, `${name}-menu.png`) });
      }
      await page.close();
      console.log("✓", name);
    }
    await ctx.close();
  }
}

if (hero) {
  /** Scroll inside the pin (a fraction of the viewport height) and let the scrub (1s) settle. */
  const scrollPin = async (page, f) => {
    await page.evaluate((f) => window.scrollTo(0, innerHeight * f), f);
    await page.waitForTimeout(1600);
  };
  for (const s of sizes) {
    for (const locale of ["en", "ar"]) {
      // A fresh context per shot: each one is a first visit, so the intro plays.
      const ctx = await contextFor(s);
      const page = await open(ctx, locale, false);
      const name = `hero-${locale}-${s.width}`;
      await page.screenshot({ path: path.join(out, `${name}-intro-end.png`) });
      // Positions in the 140% pin: lines parting with focus pull; then the beat settled.
      await scrollPin(page, 0.42);
      await page.screenshot({ path: path.join(out, `${name}-scroll-split.png`) });
      await scrollPin(page, 1.05);
      await page.screenshot({ path: path.join(out, `${name}-scroll-beat.png`) });
      await ctx.close();
      console.log("✓", name);
    }
  }

  // Evidence for the open font decision (D38 amendment): a truly cold first visit.
  {
    const ctx = await contextFor(sizes[0]);
    const page = await open(ctx, "en", false, { warm: false });
    await page.screenshot({ path: path.join(out, "cold-first-visit-en-1440.png") });
    await ctx.close();
  }

  // Recording: Playwright video needs its own ffmpeg download (not allowed here), so the
  // frames come from Chrome's CDP screencast and sharp assembles an animated WebP.
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await warmFonts(page, "en");
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    frames.push({ t: metadata.timestamp, buf: Buffer.from(data, "base64") });
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 70, maxWidth: 960, maxHeight: 600 });
  const navAt = Date.now() / 1000; // screencast timestamps are epoch seconds
  await page.goto(`${base}/en`);
  await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen"), null, { timeout: 15_000 });
  await page.waitForTimeout(1000);
  await page.mouse.move(720, 450);
  for (let i = 0; i < 28; i++) {
    await page.mouse.wheel(0, 90);
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(1500);
  await cdp.send("Page.stopScreencast");
  await ctx.close();

  // Drop the blank frames before first paint (near-white), then resample to a steady
  // 15 fps (the screencast only sends frames when pixels change).
  while (frames.length > 1 && frames[0].t < navAt) frames.shift(); // the warm-up load's last frames
  while (frames.length > 1 && (await sharp(frames[0].buf).stats()).channels[0].mean > 200) frames.shift();
  const FPS = 15;
  const t0 = frames[0].t;
  const end = frames.at(-1).t;
  const picked = [];
  for (let t = t0, i = 0; t <= end; t += 1 / FPS) {
    while (i + 1 < frames.length && frames[i + 1].t <= t) i++;
    picked.push(frames[i].buf);
  }
  const webp = await sharp(picked, { join: { animated: true } })
    .webp({ quality: 82, delay: picked.map(() => Math.round(1000 / FPS)), loop: 0 })
    .toBuffer();
  await writeFile(path.join(out, "hero.webp"), webp);
  console.log(`✓ hero.webp (${picked.length} frames, ${(picked.length / FPS).toFixed(1)}s, ${(webp.length / 1e6).toFixed(1)} MB)`);
}

await browser.close();
