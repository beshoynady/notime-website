// Mobile Lighthouse (navigation, default mobile profile) for home + the five categories, EN/AR (Task 16).
//   node scripts/lighthouse-pages.mjs <base> <out.json> [--runs=1] [--only=/en]  (uses the install from scripts/lighthouse.mjs)
import { writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
const lhDir = path.join(os.tmpdir(), "nt-lighthouse-13.5.0");
const mod = (n, e) => pathToFileURL(path.join(lhDir, "node_modules", n, e)).href;
const lighthouse = (await import(mod("lighthouse", "core/index.js"))).default;
const cl = await import(mod("chrome-launcher", "dist/index.js"));
const launch = cl.launch ?? cl.default.launch;
const [base, out] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const runs = Number(process.argv.find((a) => a.startsWith("--runs="))?.slice(7) ?? 1);
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const cats = ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts", "software-digital"];
const paths = ["en", "ar"].flatMap((l) => [`/${l}`, ...cats.map((c) => `/${l}/services/${c}`)]).filter((p) => !only || p === only);
const config = { extends: "lighthouse:default", settings: { onlyCategories: ["performance", "accessibility", "best-practices", "seo"] } };
const findDeep = (d, pred) => { if (!d || typeof d !== "object") return null; if (pred(d)) return d; for (const v of Array.isArray(d) ? d : Object.values(d)) { const n = findDeep(v, pred); if (n) return n; } return null; };
const res = [];
for (const p of paths) for (let r = 0; r < runs; r++) {
  const chrome = await launch({ chromeFlags: ["--headless=new"] });
  try {
    const { lhr } = await lighthouse(base + p, { port: chrome.port, output: "json", logLevel: "error" }, config);
    const a = lhr.audits;
    const reqs = a["network-requests"]?.details?.items ?? [];
    const js = reqs.filter((i) => i.resourceType === "Script").reduce((s, i) => s + (i.transferSize ?? 0), 0);
    const font = reqs.filter((i) => i.resourceType === "Font").reduce((s, i) => s + (i.transferSize ?? 0), 0);
    const el = findDeep(a["lcp-breakdown-insight"]?.details, (d) => d.type === "node" && d.selector);
    const row = { path: p, perf: Math.round(lhr.categories.performance.score * 100), a11y: Math.round(lhr.categories.accessibility.score * 100), bp: Math.round(lhr.categories["best-practices"].score * 100), seo: Math.round(lhr.categories.seo.score * 100),
      fcp: Math.round(a["first-contentful-paint"].numericValue), lcp: Math.round(a["largest-contentful-paint"].numericValue), tbt: Math.round(a["total-blocking-time"].numericValue), cls: +a["cumulative-layout-shift"].numericValue.toFixed(4), si: Math.round(a["speed-index"].numericValue),
      jsKB: Math.round(js / 1024), fontKB: Math.round(font / 1024), totalKB: Math.round(a["total-byte-weight"].numericValue / 1024), bench: Math.round(lhr.environment?.benchmarkIndex ?? 0), lcpEl: el ? `${el.selector} | ${(el.nodeLabel ?? "").slice(0, 40)}` : "?",
      bootup: Math.round(a["bootup-time"]?.numericValue ?? 0), mainthread: Math.round(a["mainthread-work-breakdown"]?.numericValue ?? 0) };
    res.push(row); console.log(JSON.stringify(row));
  } finally { await chrome.kill(); }
}
writeFileSync(out, JSON.stringify(res, null, 2));
