#!/usr/bin/env node
/**
 * Milestone screenshots of a whole page (M1: the homepage).
 *   node scripts/fullpage.mjs <label> [--path=/] [--base=http://localhost:3100]
 * Writes docs/checkpoints/<label>/:
 *   full-{locale}-{width}.png       the whole page in reduced motion (every section in its final
 *                                   state, no pins), so the layout reads top to bottom;
 *   sec-{locale}-{width}-{nn}-{id}.png  each top-level section of <main> in the viewport with
 *                                   motion on, scrolled to it step by step so its reveals ran.
 * Uses the installed Chrome (channel: "chrome"), like shots.mjs.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const label = args.find((a) => !a.startsWith("--")) ?? "latest";
const route = args.find((a) => a.startsWith("--path="))?.slice(7) ?? "/";
const base = (args.find((a) => a.startsWith("--base="))?.slice(7) ?? "http://localhost:3100").replace(/\/$/, "");
const out = path.join("docs", "checkpoints", label);
await mkdir(out, { recursive: true });

const sizes = [
  { width: 1440, height: 900, mobile: false },
  { width: 390, height: 844, mobile: true },
];
const browser = await chromium.launch({ channel: "chrome" });
const url = (locale) => `${base}/${locale}${route === "/" ? "" : route}`;

async function open(s, locale, reduced) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: 1,
    isMobile: s.mobile,
    hasTouch: s.mobile,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  // Fonts are display: optional (D38): load once so they are cached, then reload.
  await page.goto(url(locale));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(url(locale));
  await page.locator("#page-stage[data-tone-ready]").first().waitFor({ state: "attached" });
  await page.evaluate(() => document.fonts.ready);
  if (!reduced && route === "/") {
    await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen"), null, { timeout: 15_000 });
  }
  await page.waitForTimeout(400);
  return { ctx, page, errors };
}

/** Walk down the page so every scroll-triggered reveal and lazy module runs. */
async function walk(page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => Math.round(innerHeight * 0.6));
  for (let y = 0; y < total; y += step) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(220);
  }
}

for (const s of sizes) {
  for (const locale of ["en", "ar"]) {
    // 1. Whole page, reduced motion.
    {
      const { ctx, page, errors } = await open(s, locale, true);
      await walk(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(out, `full-${locale}-${s.width}.png`), fullPage: true });
      console.log("✓ full", locale, s.width, errors.length ? `console errors: ${errors.join(" | ")}` : "no console errors");
      await ctx.close();
    }
    // 2. Each section in the viewport, motion on.
    {
      const { ctx, page, errors } = await open(s, locale, false);
      const ids = await page.evaluate(() =>
        [...document.querySelectorAll("main#main > *")].map((el, i) => el.id || el.getAttribute("aria-labelledby") || `s${i}`),
      );
      const count = ids.length;
      for (let i = 0; i < count; i++) {
        const top = await page.evaluate((i) => {
          const el = document.querySelectorAll("main#main > *")[i];
          return el ? el.getBoundingClientRect().top + scrollY : null;
        }, i);
        if (top == null) continue;
        // Approach in steps so scrubbed timelines and reveals play as they would for a visitor.
        const from = await page.evaluate(() => scrollY);
        for (let k = 1; k <= 6; k++) {
          await page.evaluate((y) => window.scrollTo(0, y), from + ((top - from) * k) / 6);
          await page.waitForTimeout(150);
        }
        await page.waitForTimeout(1400);
        const nn = String(i + 1).padStart(2, "0");
        await page.screenshot({ path: path.join(out, `sec-${locale}-${s.width}-${nn}-${ids[i]}.png`) });
      }
      console.log("✓ sections", locale, s.width, count, errors.length ? `console errors: ${errors.join(" | ")}` : "no console errors");
      await ctx.close();
    }
  }
}

await browser.close();
