// Runs Lighthouse (mobile, default simulated throttling) 3x per locale; prints medians,
// LCP time + element, CLS. Reports are read from JSON written by the CLI.
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const [base = "http://localhost:3100", outDir = "."] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const summary = {};

for (const locale of ["en", "ar"]) {
  const runs = [];
  for (let i = 1; i <= 3; i++) {
    const out = path.join(outDir, `lh-${locale}-${i}.json`);
    execFileSync(
      "npx",
      [
        "-y",
        "lighthouse@12.6.1",
        `${base}/${locale}`,
        "--form-factor=mobile",
        "--only-categories=performance,accessibility,best-practices,seo",
        "--output=json",
        `--output-path=${out}`,
        "--chrome-flags=--headless=new",
        "--quiet",
      ],
      { stdio: "inherit", shell: true },
    );
    const r = JSON.parse(readFileSync(out, "utf8"));
    const lcpEl = r.audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node;
    runs.push({
      perf: Math.round(r.categories.performance.score * 100),
      a11y: Math.round(r.categories.accessibility.score * 100),
      bp: Math.round(r.categories["best-practices"].score * 100),
      seo: Math.round(r.categories.seo.score * 100),
      lcp: Math.round(r.audits["largest-contentful-paint"].numericValue),
      fcp: Math.round(r.audits["first-contentful-paint"].numericValue),
      tbt: Math.round(r.audits["total-blocking-time"].numericValue),
      cls: +r.audits["cumulative-layout-shift"].numericValue.toFixed(4),
      lcpEl: lcpEl ? `${lcpEl.selector} | "${(lcpEl.nodeLabel ?? "").slice(0, 60)}"` : "?",
    });
    console.log(locale, i, JSON.stringify(runs.at(-1)));
  }
  summary[locale] = Object.fromEntries(["perf", "a11y", "bp", "seo", "lcp", "fcp", "tbt", "cls"].map((k) => [k, median(runs.map((r) => r[k]))]));
  summary[locale].lcpElements = [...new Set(runs.map((r) => r.lcpEl))];
}
console.log("MEDIANS", JSON.stringify(summary, null, 1));
