import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * CI skips docs-only changes (D75): `.github/workflows/ci.yml` runs on `**` minus `docs/**` and
 * `**\/*.md`, then re-includes the docs the unit tests read. A test that starts reading another
 * doc must add it there, or a change to that doc alone would never run the test.
 */
const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8");

function testFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? testFiles(p) : e.name.endsWith(".test.ts") ? [p] : [];
  });
}

/** Paths a test reads with `readFileSync(path.join(process.cwd(), …))`, joined with "/". */
function docsReadByTests(): string[] {
  const found = new Set<string>();
  for (const file of testFiles("src")) {
    for (const m of readFileSync(file, "utf8").matchAll(/path\.join\(process\.cwd\(\),\s*([^)]*)\)/g)) {
      const parts = [...m[1].matchAll(/"([^"]+)"/g)].map((p) => p[1]);
      if (parts.length === 0 || m[1].includes("${")) continue;
      const p = parts.join("/");
      if (p.startsWith("docs/") || p.endsWith(".md")) found.add(p);
    }
  }
  return [...found].sort();
}

describe("CI path filters", () => {
  it("finds the docs the tests read", () => {
    expect(docsReadByTests()).toContain("docs/content/services-list.md");
  });

  it("re-include, in both the push and the pull_request lists, every doc a test reads", () => {
    const ci = read(".github/workflows/ci.yml");
    for (const doc of docsReadByTests()) {
      const listed = ci.split("\n").filter((l) => l.trim().startsWith(`- "${doc}"`)).length;
      expect(listed, `${doc} in ci.yml paths (push and pull_request)`).toBe(2);
    }
  });
});
