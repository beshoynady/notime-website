#!/usr/bin/env node
/**
 * Frame times while scrolling through an element at a steady speed, with the CPU throttled
 * (decision #31: the photo stories must not stutter on a weak device).
 *   node scripts/scroll-jank.mjs --url=http://localhost:3000/en/about --sel=#ab-room [--cpu=4]
 *     [--width=1440] [--height=900] [--speed=1000] [--runs=3] [--warm]
 * --warm scrolls through once before measuring, so first-time image loading and decoding is out
 * of the numbers and what remains is the scroll work itself.
 * Prints the median, p95 and longest frame, and the share of frames over 33 ms (under 30 fps) and
 * over 50 ms, per run and as the median of the runs. A width below 900 is a touch context.
 * Uses the installed Chrome (channel: "chrome").
 */
import { chromium } from "@playwright/test";

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const url = arg("url");
const sel = arg("sel");
const cpu = Number(arg("cpu", 4));
const width = Number(arg("width", 1440));
const height = Number(arg("height", 900));
const speed = Number(arg("speed", 1000));
const runs = Number(arg("runs", 3));
const warm = process.argv.includes("--warm");
if (!url || !sel) throw new Error("--url and --sel are required");

const mobile = width < 900;
const browser = await chromium.launch({ channel: "chrome" });
const results = [];
for (let r = 0; r < runs; r++) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(2500); // hydration, pins and images settle before measuring
  if (warm)
    await page.evaluate(async (sel) => {
      const el = document.querySelector(sel);
      const top = el.getBoundingClientRect().top + scrollY;
      for (let y = Math.max(0, top - innerHeight); y < top + el.offsetHeight + innerHeight; y += innerHeight / 3) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 250));
      }
      // A lazy image that hasn't started loading never settles decode(): load them all, then cap the wait.
      const imgs = [...document.querySelectorAll(`${sel} img`)];
      for (const i of imgs) i.loading = "eager";
      await Promise.race([Promise.all(imgs.map((i) => i.decode().catch(() => {}))), new Promise((r) => setTimeout(r, 8000))]);
    }, sel);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  const frames = await page.evaluate(
    async ({ sel, speed }) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`no ${sel}`);
      const top = el.getBoundingClientRect().top + scrollY;
      const from = Math.max(0, top - innerHeight);
      const to = top + el.offsetHeight;
      window.scrollTo(0, from);
      await new Promise((r) => setTimeout(r, 300));
      const deltas = [];
      return new Promise((done) => {
        let last = performance.now();
        let y = from;
        const step = (now) => {
          const dt = now - last;
          last = now;
          deltas.push(dt);
          y += (speed * dt) / 1000;
          window.scrollTo(0, y);
          if (y < to) requestAnimationFrame(step);
          else done(deltas.slice(1));
        };
        requestAnimationFrame(step);
      });
    },
    { sel, speed },
  );
  await ctx.close();
  const s = [...frames].sort((a, b) => a - b);
  const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  const row = { frames: s.length, median: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), max: +s[s.length - 1].toFixed(1), over33: +((100 * s.filter((d) => d > 33.4).length) / s.length).toFixed(1), over50: +((100 * s.filter((d) => d > 50).length) / s.length).toFixed(1) };
  results.push(row);
  console.log(`run ${r + 1}`, JSON.stringify(row));
}
await browser.close();
const med = (k) => [...results.map((x) => x[k])].sort((a, b) => a - b)[Math.floor(results.length / 2)];
console.log("median", JSON.stringify({ url, sel, cpu, width, warm, median: med("median"), p95: med("p95"), max: med("max"), over33: med("over33"), over50: med("over50") }));
