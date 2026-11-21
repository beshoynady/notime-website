import path from "node:path";
import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

/**
 * Marketing · content calendar (self-audit 2026-11-20):
 * B06 · a post's accessible name carries its visible text (WCAG 2.5.3 label in name): it was an
 *   aria-label of the day and topic only, so the channel and language shown on it were left out.
 * B05 · its channel line never cuts a label mid-word: a long channel name ends in an ellipsis and
 *   the language mark stays whole («INSTAGRAM AR · E» before).
 */
test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: every post's name holds its visible text, and no label is cut`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "the channel line shows from 640px");
    await gotoReady(page, `/${locale}/services/marketing-brand`);
    // The module loads as the page nears it: walk down until it's there.
    const cal = page.locator(".cal-table");
    for (let y = 0; y < 40_000 && !(await cal.count()); y += 700) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(120);
    }
    await cal.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const entries = page.locator(".cal-entry");
    expect(await entries.count()).toBeGreaterThan(0);

    await page.addScriptTag({ path: path.resolve("node_modules", "axe-core", "axe.min.js") });
    const violations = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (ctx: unknown, opts: unknown) => Promise<{ violations: { id: string; nodes: unknown[] }[] }> } }).axe;
      const r = await axe.run({ include: [".cal-table"] }, { runOnly: { type: "rule", values: ["label-content-name-mismatch"] }, rules: { "label-content-name-mismatch": { enabled: true } } });
      return r.violations.map((v) => `${v.id}: ${v.nodes.length}`);
    });
    expect(violations).toEqual([]);

    const cut = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".cal-entry-ch")].flatMap((ch) => {
        const box = ch.getBoundingClientRect();
        const lang = ch.querySelector<HTMLElement>(".cal-entry-lang")!.getBoundingClientRect();
        const name = ch.querySelector<HTMLElement>(".cal-entry-name")!;
        const out: string[] = [];
        // The language mark sits whole inside the line (inline-start/end either way round).
        if (lang.left < box.left - 0.5 || lang.right > box.right + 0.5) out.push(`lang cut: ${ch.textContent}`);
        // A channel name that doesn't fit says so with an ellipsis.
        if (name.scrollWidth > name.clientWidth + 1 && getComputedStyle(name).textOverflow !== "ellipsis") out.push(`name cut: ${ch.textContent}`);
        return out;
      }),
    );
    expect(cut).toEqual([]);
  });
}
