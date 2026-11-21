#!/usr/bin/env node
/**
 * Before/after Lighthouse on the same machine, interleaved: for each run and each page, the
 * "before" server then the "after" one, so machine load drifts hit both alike.
 *   node scripts/lighthouse-ab.mjs <before-base> <after-base> <out.json> [--runs=3] [--paths=/en,/ar/links]
 *     [--links-before=<base>]   (a third server for /links, which the "before" commit didn't have)
 * Writes every row ({ side, path, run, ...scripts/lighthouse-pages.mjs row }) and prints the
 * median table (perf, a11y, bp, seo, FCP, LCP, TBT, CLS, SI, JS KB, benchmark index).
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const pos = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const opt = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const [beforeBase, afterBase, out] = pos;
const runs = Number(opt("runs", 3));
const linksBefore = opt("links-before");
const cats = ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts", "software-digital"];
const all = ["en", "ar"].flatMap((l) => [`/${l}`, ...cats.map((c) => `/${l}/services/${c}`), `/${l}/links`]);
const paths = opt("paths") ? opt("paths").split(",") : all;
const tmp = mkdtempSync(path.join(os.tmpdir(), "lh-ab-"));
const rows = [];
const one = (side, base, p, run) => {
  const file = path.join(tmp, `${side}-${run}-${p.replace(/\W/g, "_")}.json`);
  execFileSync(process.execPath, ["scripts/lighthouse-pages.mjs", base, file, `--only=${p}`], { stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  const [row] = JSON.parse(readFileSync(file, "utf8"));
  rows.push({ side, run, ...row });
  console.log(side.padEnd(6), p.padEnd(40), `run ${run}`, `perf ${row.perf} lcp ${row.lcp} tbt ${row.tbt} bench ${row.bench}`);
  writeFileSync(out, JSON.stringify(rows, null, 2));
};
for (let run = 1; run <= runs; run++)
  for (const p of paths) {
    const before = p.endsWith("/links") ? linksBefore : beforeBase;
    if (before) one("before", before, p, run);
    one("after", afterBase, p, run);
  }

const keys = ["perf", "a11y", "bp", "seo", "fcp", "lcp", "tbt", "cls", "si", "jsKB", "bench"];
const med = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
console.log(`\n| Page | Side | ${keys.join(" | ")} |\n|${"---|".repeat(keys.length + 2)}`);
for (const p of paths)
  for (const side of ["before", "after"]) {
    const rs = rows.filter((r) => r.path === p && r.side === side);
    if (!rs.length) continue;
    console.log(`| ${p} | ${side} | ${keys.map((k) => med(rs.map((r) => r[k]))).join(" | ")} |`);
  }
