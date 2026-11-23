import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * D108: an Arabic «و» glued to a Latin word renders on the wrong side of it ("Androidو"). Every
 * such pair is spaced («iOS و Android»). The copy rewrite brought five back (the close's gate,
 * 2026-11-23), so the Arabic strings are scanned here. A «و» before a number stays glued
 * («و37.6 ألف»): D108 keeps that form in running text.
 */
const GLUED = /و[A-Za-z]/g;
/** Approved service titles (docs/content/services-list.md) are not changed here; the spacing is a proposal to Rand. */
const APPROVED = ["الإعلانات المدفوعة وتخطيط الإعلام (Google وMeta)"];

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return files(p);
    return /\.(ts|json)$/.test(e.name) && !e.name.endsWith(".test.ts") ? [p] : [];
  });
}

describe("Arabic bidi (D108)", () => {
  it("no «و» is glued to a Latin word in the Arabic strings", () => {
    const root = path.join(process.cwd(), "src");
    const sources = [path.join(root, "messages", "ar.json"), ...files(path.join(root, "content"))];
    const hits = sources.flatMap((f) =>
      readFileSync(f, "utf8")
        .split("\n")
        .flatMap((line, i) => [...APPROVED.reduce((l, t) => l.replace(t, ""), line).matchAll(GLUED)].map((m) => `${path.relative(root, f)}:${i + 1} «${line.slice(Math.max(0, m.index! - 12), m.index! + 12)}»`)),
    );
    expect(hits).toEqual([]);
  });
});
