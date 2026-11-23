#!/usr/bin/env node
/**
 * A scroll recording of one page, as WebM, for the report.
 *   node scripts/scroll-video.mjs <base> <path> <out.webm> [--width=1440] [--height=900] [--steps=90] [--step=90]
 * Frames come from Chrome's CDP screencast and Chrome's own MediaRecorder encodes them (VP9), as in
 * scripts/shots.mjs: Playwright's recordVideo would need an ffmpeg download (not allowed here).
 * The wheel moves `step` px every 150 ms, so scrubbed scenes play at a reading pace.
 */
import { writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const [base, pagePath, out] = args.filter((a) => !a.startsWith("--"));
if (!base || !pagePath || !out) {
  console.error("usage: node scripts/scroll-video.mjs <base> <path> <out.webm> [--width=1440] [--height=900] [--steps=90] [--step=90]");
  process.exit(2);
}
const width = Number(opt("width", 1440));
const height = Number(opt("height", 900));
const steps = Number(opt("steps", 90));
const step = Number(opt("step", 90));
const FPS = 15;

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width, height }, ...(width < 900 ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}) });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
const frames = [];
cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
  frames.push({ t: metadata.timestamp, buf: Buffer.from(data, "base64") });
  cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
});
await page.goto(base + pagePath, { waitUntil: "load" });
await page.waitForTimeout(1500);
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 72, maxWidth: Math.min(width, 1280), maxHeight: Math.min(height * (width < 900 ? 2 : 1), 900) });
await page.waitForTimeout(1500);
await page.mouse.move(width / 2, height / 2);
for (let i = 0; i < steps; i++) {
  if (width < 900) await page.evaluate((dy) => scrollBy(0, dy), step);
  else await page.mouse.wheel(0, step);
  await page.waitForTimeout(150);
}
await page.waitForTimeout(1500);
await cdp.send("Page.stopScreencast");
await ctx.close();

// Resample to a steady rate (the screencast only sends a frame when pixels change).
const picked = [];
for (let t = frames[0].t, i = 0; t <= frames.at(-1).t; t += 1 / FPS) {
  while (i + 1 < frames.length && frames[i + 1].t <= t) i++;
  picked.push(frames[i].buf);
}

const enc = await browser.newContext({ viewport: { width: 320, height: 200 } });
const ep = await enc.newPage();
await ep.goto("about:blank");
await ep.evaluate(() => (window.__frames = []));
for (let i = 0; i < picked.length; i += 40) {
  await ep.evaluate(
    async (list) => {
      for (const b64 of list) {
        const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        window.__frames.push(await createImageBitmap(new Blob([bytes], { type: "image/jpeg" })));
      }
    },
    picked.slice(i, i + 40).map((b) => b.toString("base64")),
  );
}
const b64 = await ep.evaluate(async (fps) => {
  const list = window.__frames;
  const canvas = Object.assign(document.createElement("canvas"), { width: list[0].width, height: list[0].height });
  const g = canvas.getContext("2d");
  g.drawImage(list[0], 0, 0);
  const track = canvas.captureStream(0).getVideoTracks()[0];
  const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m));
  const rec = new MediaRecorder(new MediaStream([track]), { mimeType: mime, videoBitsPerSecond: 2_000_000 });
  const chunks = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const stopped = new Promise((r) => (rec.onstop = r));
  rec.start();
  const t0 = performance.now();
  for (let i = 0; i < list.length; i++) {
    g.drawImage(list[i], 0, 0);
    track.requestFrame();
    await new Promise((r) => setTimeout(r, Math.max(0, t0 + ((i + 1) * 1000) / fps - performance.now())));
  }
  rec.stop();
  await stopped;
  const u = new Uint8Array(await new Blob(chunks, { type: mime }).arrayBuffer());
  let s = "";
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
  return btoa(s);
}, FPS);
await enc.close();
await browser.close();
const buf = Buffer.from(b64, "base64");
await writeFile(out, buf);
console.log(`✓ ${out} (${picked.length} frames, ${(picked.length / FPS).toFixed(1)} s, ${(buf.length / 1e6).toFixed(1)} MB)`);
