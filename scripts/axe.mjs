#!/usr/bin/env node
/**
 * axe-core audit (WCAG 2.0/2.1 A and AA) of live pages.
 *   node scripts/axe.mjs <baseUrl> <path> [<path>...] [--widths=1440,390] [--out=<json>]
 * For each path and width: opens the page in the installed Chrome, injects node_modules/axe-core,
 * prints the violations grouped by impact (rule id, node count) and exits 1 if any is serious or
 * critical. --out writes the full result (with selectors) as JSON.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const [base, ...paths] = args.filter((a) => !a.startsWith("--"));
if (!base || paths.length === 0) {
  console.error("usage: node scripts/axe.mjs <baseUrl> <path> [<path>...] [--widths=1440,390] [--out=<json>]");
  process.exit(2);
}
const widths = opt("widths", "1440,390").split(",").map(Number);
const out = opt("out", null);
const axePath = path.resolve("node_modules", "axe-core", "axe.min.js");
const ORDER = ["critical", "serious", "moderate", "minor"];

const browser = await chromium.launch({ channel: "chrome" });
const results = [];
let blocking = 0;

for (const p of paths) {
  for (const width of widths) {
    const mobile = width < 768;
    const ctx = await browser.newContext({ viewport: { width, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
    const page = await ctx.newPage();
    await page.goto(new URL(p, base).href, { waitUntil: "load" });
    await page.waitForTimeout(1500); // hydration and the opening settle
    await page.addScriptTag({ path: axePath });
    const res = await page.evaluate(() =>
      axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } }),
    );
    const violations = res.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => ({ target: n.target, html: n.html.slice(0, 160) })),
    }));
    results.push({ path: p, width, violations });
    console.log(`\n${p} @ ${width}: ${violations.length ? `${violations.length} violation(s)` : "no violations"}`);
    for (const impact of ORDER) {
      for (const v of violations.filter((x) => x.impact === impact)) {
        console.log(`  [${impact}] ${v.id} x${v.nodes.length}: ${v.help}`);
        if (impact === "critical" || impact === "serious") blocking += 1;
      }
    }
    await ctx.close();
  }
}
await browser.close();
if (out) await writeFile(out, JSON.stringify(results, null, 2));
console.log(blocking ? `\n${blocking} serious/critical violation(s)` : "\nno serious or critical violations");
process.exit(blocking ? 1 : 0);
