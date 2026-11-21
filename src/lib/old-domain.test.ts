import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The previous landing site's domain only appears where its redirect is documented (D90): it 301s,
 * domain-wide and path-preserving, to https://notimehub.com at the host. Nothing in the code or
 * the content may point to it. The decision log, the checklist (renewal) and the handoff mention it
 * as records, not as links.
 */
const OLD = ["notime", "hub.com"].join("-"); // split so this file doesn't match itself
const ALLOWED = new Set(["docs/launch/hostinger-deploy.md", "docs/DECISIONS.md", "docs/CONTENT_CHECKLIST.md", "docs/HANDOFF.md"]);
const TEXT = /\.(ts|tsx|js|mjs|cjs|json|md|css|html|txt|xml|yml|yaml|svg|example)$|^\.[a-z]+rc$/;

describe("the old domain", () => {
  it(`is referenced only by the redirect docs`, () => {
    const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
      .split("\n")
      .filter((f) => f && TEXT.test(f.split("/").pop()!) && !ALLOWED.has(f));
    const hits = files.filter((f) => {
      try {
        return readFileSync(f, "utf8").includes(OLD);
      } catch {
        return false; // deleted in the working tree
      }
    });
    expect(hits).toEqual([]);
  });
});
