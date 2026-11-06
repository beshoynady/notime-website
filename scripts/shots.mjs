#!/usr/bin/env node
/**
 * Checkpoint screenshots.
 *   node scripts/shots.mjs <label> [--hero] [--base=http://localhost:3100]
 * Writes docs/checkpoints/<label>/{en,ar}-{1440,390}[-reduced].png plus menu-open states
 * ({locale}-{width}-menu.png). With --hero: hero-intro-end.png, hero-mid-scroll.png, hero.webm.
 * Uses the installed Chrome (channel: "chrome"); no Playwright browser downloads.
 */
import { mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

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

async function open(ctx, locale, reduced) {
  const page = await ctx.newPage();
  // Same readiness marker as e2e/helpers.ts gotoReady (importing .ts from .mjs warns in Node).
  await page.goto(`${base}/${locale}`);
  await page.locator("#stage[data-tone-ready]").first().waitFor({ state: "attached" });
  await page.evaluate(() => document.fonts.ready);
  if (!reduced) await page.waitForTimeout(1200); // let the intro settle (none when reduced)
  return page;
}

for (const reduced of [false, true]) {
  for (const s of sizes) {
    const ctx = await browser.newContext({
      viewport: { width: s.width, height: s.height },
      deviceScaleFactor: s.mobile ? 2 : 1,
      isMobile: s.mobile,
      hasTouch: s.mobile,
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
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
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } },
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/en`);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(out, "hero-intro-end.png") });
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(out, "hero-mid-scroll.png") });
  const video = page.video();
  await ctx.close();
  if (video) await rename(await video.path(), path.join(out, "hero.webm"));
  console.log("✓ hero");
}

await browser.close();
