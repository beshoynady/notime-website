#!/usr/bin/env node
/**
 * Proves a production build carries no review-mode content (v1 plan, Task A1; D78).
 *   node scripts/check-no-review-leak.mjs [distDir=.next]
 *
 * Scans what reaches visitors: every file under <distDir>/static (browser chunks, CSS) and the
 * prerendered pages under <distDir>/server/app (.html, .rsc, .body, .meta). Server-only JS is not
 * shipped, so it isn't scanned. Exits 1 on any hit, naming the file and the string.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const dist = process.argv[2] ?? ".next";
const NEEDLES = ["Example – to be replaced", "مثال – يُستبدل", "Review version – not public", "نسخة مراجعة – غير منشورة", 'data-ref="', "data-review=\"\"", "Client name", "اسم العميل"];
const PAGE = /\.(html|rsc|body|meta)$/;

function* walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

if (!existsSync(path.join(dist, "static"))) throw new Error(`${dist}/static not found: build first`);
const files = [...walk(path.join(dist, "static")), ...[...walk(path.join(dist, "server", "app"))].filter((f) => PAGE.test(f))];
const hits = [];
for (const f of files) {
  const text = readFileSync(f, "utf8");
  for (const n of NEEDLES) if (text.includes(n)) hits.push(`${f}: "${n}"`);
}
if (hits.length) {
  console.error(`Review content in the ${dist} build:\n${hits.join("\n")}`);
  process.exit(1);
}
console.log(`no review content in ${dist} (${files.length} files scanned)`);
