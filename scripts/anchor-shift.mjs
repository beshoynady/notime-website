#!/usr/bin/env node
/**
 * Anchor-landing shift: open a page directly on a section anchor and watch the target.
 *   node scripts/anchor-shift.mjs [--base=http://localhost:3100] [--width=1440] [--locale=en] [--page=<slug>]
 * For each category page (or only --page) and each service section on it: a fresh tab opens
 * /<locale>/services/<slug>#<id>, then for 5 s records how far the target's top moves from where
 * it first landed, and the layout-shift entries (CLS, excluding shifts after input).
 * Prints one line per anchor and the worst case; exits 1 if any anchor moves more than 1 px.
 */
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const base = opt("base", "http://localhost:3100").replace(/\/$/, "");
const width = Number(opt("width", "1440"));
const locale = opt("locale", "en");
const only = opt("page", null);
const slugs = only
  ? [only]
  : ["events-hospitality", "creative-production", "marketing-brand", "production-print-gifts", "software-digital"];

const mobile = width < 768;
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
  viewport: { width, height: mobile ? 844 : 900 },
  isMobile: mobile,
  hasTouch: mobile,
});
// Warm the font cache once (display: optional, D38) so font swaps don't count.
{
  const p = await ctx.newPage();
  await p.goto(`${base}/${locale}`);
  await p.evaluate(() => document.fonts.ready);
  await p.close();
}

let worst = { move: 0, cls: 0, where: "" };
for (const slug of slugs) {
  const index = await ctx.newPage();
  await index.goto(`${base}/${locale}/services/${slug}`);
  const ids = await index.evaluate(() =>
    [...document.querySelectorAll("main section[id]")].map((s) => s.id).filter((id) => !id.startsWith("radix")),
  );
  await index.close();
  for (const id of ids) {
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(`${base}/${locale}/services/${slug}#${id}`);
    const samples = await page.evaluate(
      (id) =>
        new Promise((resolve) => {
          const el = document.getElementById(id);
          const tops = [];
          const t0 = performance.now();
          const tick = () => {
            tops.push(el ? Math.round(el.getBoundingClientRect().top) : NaN);
            if (performance.now() - t0 < 5000) setTimeout(tick, 50);
            else resolve(tops);
          };
          tick();
        }),
      id,
    );
    const cls = await page.evaluate(() => window.__cls);
    const first = samples[0];
    const move = Math.max(...samples.map((t) => Math.abs(t - first)));
    const final = samples.at(-1);
    console.log(
      `${slug}#${id}`.padEnd(52),
      `landed ${String(first).padStart(5)}  final ${String(final).padStart(5)}  max move ${String(move).padStart(4)} px  CLS ${cls.toFixed(3)}`,
    );
    if (move > worst.move || cls > worst.cls) worst = { move: Math.max(move, worst.move), cls: Math.max(cls, worst.cls), where: `${slug}#${id}` };
    await page.close();
  }
}
console.log(`\nworst: max move ${worst.move} px, CLS ${worst.cls.toFixed(3)} (${worst.where || "none"})`);
await browser.close();
process.exit(worst.move > 1 ? 1 : 0);
