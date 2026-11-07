#!/usr/bin/env node
/**
 * Mobile Lighthouse for the hero, per locale, N runs (default 3), medians per metric.
 *   node scripts/lighthouse.mjs [base=http://localhost:3100] [outDir=docs/checkpoints/lighthouse] [--runs=3]
 *
 * Default Lighthouse mobile profile: Moto G Power emulation, simulated throttling
 * (150 ms RTT, 1.6 Mbps, 4x CPU slowdown). Three scenarios per run, via the user-flow API:
 *   first   - cold first visit: storage and cache reset, so the intro plays.
 *   return  - the same tab navigates again without a storage reset: sessionStorage["nt-intro"]
 *             is set, so the intro is skipped (short title reveal), and the HTTP cache is warm.
 *   skipped - isolation case: intro skipped (flag seeded before the boot script runs) but with
 *             storage and cache reset, so the cold network cost matches "first".
 *
 * Lighthouse is not a project dependency: it is installed once with npm into
 * $LIGHTHOUSE_DIR (default: <os tmp>/nt-lighthouse-<version>). It drives the installed Chrome
 * through chrome-launcher + puppeteer-core; no browser is downloaded.
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const LH_VERSION = "13.5.0";
const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const base = (positional[0] ?? "http://localhost:3100").replace(/\/$/, "");
const outDir = positional[1] ?? path.join("docs", "checkpoints", "lighthouse");
const RUNS = Number(args.find((a) => a.startsWith("--runs="))?.slice(7) ?? 3);
const LOCALES = ["en", "ar"];
const SCENARIOS = ["first", "return", "skipped"];

// ---- Lighthouse install (outside the repo) ---------------------------------------------
const lhDir = process.env.LIGHTHOUSE_DIR ?? path.join(os.tmpdir(), `nt-lighthouse-${LH_VERSION}`);
const mod = (name, entry) => pathToFileURL(path.join(lhDir, "node_modules", name, entry)).href;
if (!existsSync(path.join(lhDir, "node_modules", "lighthouse"))) {
  mkdirSync(lhDir, { recursive: true });
  console.log(`Installing lighthouse@${LH_VERSION} into ${lhDir}`);
  execSync(`npm install --no-save --no-package-lock --no-audit --no-fund --prefix "${lhDir}" lighthouse@${LH_VERSION}`, {
    stdio: "inherit",
    env: { ...process.env, PUPPETEER_SKIP_DOWNLOAD: "1" },
  });
}
const { startFlow } = await import(mod("lighthouse", "core/index.js"));
const launcherMod = await import(mod("chrome-launcher", "dist/index.js"));
const chromeLauncher = launcherMod.launch ? launcherMod : launcherMod.default;
const pptrMod = await import(mod("puppeteer-core", "lib/puppeteer/puppeteer-core.js"));
const puppeteer = pptrMod.default ?? pptrMod;

const config = {
  extends: "lighthouse:default",
  settings: { onlyCategories: ["performance", "accessibility", "best-practices", "seo"] },
};

/** The LCP element: Lighthouse 13 reports it in the LCP breakdown insight (older: its own audit). */
function lcpElement(lhr) {
  for (const id of ["lcp-breakdown-insight", "largest-contentful-paint-element", "lcp-discovery-insight"]) {
    const found = findDeep(lhr.audits[id]?.details, (d) => d.type === "node" && d.selector);
    if (found) return `${found.selector} | "${(found.nodeLabel ?? "").slice(0, 60)}"`;
  }
  return "?";
}
/** LCP subparts (ms) from the breakdown insight, when present. */
function lcpParts(lhr) {
  const table = findDeep(lhr.audits["lcp-breakdown-insight"]?.details, (d) => d.type === "table" && Array.isArray(d.items) && d.items.some((i) => i.subpart));
  if (!table) return undefined;
  return Object.fromEntries(table.items.filter((i) => i.subpart).map((i) => [i.subpart, Math.round(i.duration)]));
}
/** First object in an audit's details tree that matches `pred` (details nest differently per version). */
function findDeep(d, pred) {
  if (!d || typeof d !== "object") return null;
  if (pred(d)) return d;
  for (const v of Array.isArray(d) ? d : Object.values(d)) {
    const n = findDeep(v, pred);
    if (n) return n;
  }
  return null;
}
function summarize(lhr) {
  const a = lhr.audits;
  const metrics = a.metrics?.details?.items?.[0] ?? {};
  return {
    perf: Math.round(lhr.categories.performance.score * 100),
    a11y: Math.round(lhr.categories.accessibility.score * 100),
    bp: Math.round(lhr.categories["best-practices"].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    fcp: Math.round(a["first-contentful-paint"].numericValue),
    lcp: Math.round(a["largest-contentful-paint"].numericValue),
    lcpObserved: Math.round(metrics.observedLargestContentfulPaint ?? NaN),
    tbt: Math.round(a["total-blocking-time"].numericValue),
    cls: +a["cumulative-layout-shift"].numericValue.toFixed(4),
    si: Math.round(a["speed-index"].numericValue),
    // Host CPU benchmark: simulated throttling scales observed CPU time, so a loaded host
    // (low index) inflates the simulated numbers.
    benchmarkIndex: Math.round(lhr.environment?.benchmarkIndex ?? NaN),
    lcpEl: lcpElement(lhr),
    lcpParts: lcpParts(lhr),
  };
}

// A loaded machine can stall a CDP call past puppeteer's 30 s default (seen: `Network.enable timed out`),
// so the timeout is raised and a failed scenario is retried once in a fresh browser.
async function withPage(fn, attempt = 1) {
  try {
    return await withPageOnce(fn);
  } catch (err) {
    if (attempt >= 2) throw err;
    console.warn(`retrying after: ${String(err?.message ?? err).split("\n")[0]}`);
    return withPage(fn, attempt + 1);
  }
}

async function withPageOnce(fn) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });
  try {
    const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}`, protocolTimeout: 180_000 });
    const page = await browser.newPage();
    const out = await fn(page);
    await browser.disconnect();
    return out;
  } finally {
    await chrome.kill();
  }
}

mkdirSync(path.join(outDir, "raw"), { recursive: true });
const runs = {}; // runs[locale][scenario] = summary[]
for (const locale of LOCALES) {
  runs[locale] = Object.fromEntries(SCENARIOS.map((s) => [s, []]));
  const url = `${base}/${locale}`;
  for (let i = 1; i <= RUNS; i++) {
    // first + return in one tab, so the return visit keeps this tab's sessionStorage.
    const [first, ret] = await withPage(async (page) => {
      const flow = await startFlow(page, { config });
      await flow.navigate(url, { name: "first visit (intro)" });
      await flow.navigate(url, { name: "return visit (intro skipped)", disableStorageReset: true });
      const res = await flow.createFlowResult();
      return res.steps.map((s) => s.lhr);
    });
    // skipped: a fresh tab with the session flag seeded before any page script.
    const [skipped] = await withPage(async (page) => {
      await page.evaluateOnNewDocument(() => {
        try {
          sessionStorage.setItem("nt-intro", "1");
        } catch {}
      });
      const flow = await startFlow(page, { config });
      await flow.navigate(url, { name: "intro skipped, cold cache" });
      const res = await flow.createFlowResult();
      return res.steps.map((s) => s.lhr);
    });
    for (const [scenario, lhr] of [["first", first], ["return", ret], ["skipped", skipped]]) {
      const s = summarize(lhr);
      runs[locale][scenario].push(s);
      writeFileSync(path.join(outDir, "raw", `lh-${locale}-${scenario}-${i}.json.gz`), gzipSync(JSON.stringify(lhr)));
      console.log(locale, scenario, i, JSON.stringify(s));
    }
  }
}

const median = (a) => {
  const v = a.filter((x) => Number.isFinite(x)).sort((x, y) => x - y);
  return v.length ? v[Math.floor(v.length / 2)] : null;
};
const KEYS = ["perf", "a11y", "bp", "seo", "fcp", "lcp", "lcpObserved", "tbt", "cls", "si", "benchmarkIndex"];
const summary = {
  lighthouse: LH_VERSION,
  base,
  runs: RUNS,
  profile: "mobile, Moto G Power emulation, simulated throttling (150 ms RTT, 1.6 Mbps, 4x CPU)",
  medians: {},
  runsDetail: runs,
};
for (const locale of LOCALES) {
  summary.medians[locale] = {};
  for (const scenario of SCENARIOS) {
    const r = runs[locale][scenario];
    summary.medians[locale][scenario] = {
      ...Object.fromEntries(KEYS.map((k) => [k, median(r.map((x) => x[k]))])),
      lcpElements: [...new Set(r.map((x) => x.lcpEl))],
    };
  }
}
writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log("MEDIANS", JSON.stringify(summary.medians, null, 1));
