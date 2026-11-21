import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseCredits } from "@/lib/credits";
import { imageCredits } from "./credits";

/** Every licensed stock image on the site is credited, and every credit points at a real file (D80). */
describe("image credits (src/content/credits.json)", () => {
  const pub = (f: string) => path.join("public", f);

  it("lists only files that exist, each once, with a valid source, page and photographer", () => {
    expect(new Set(imageCredits.map((c) => c.file)).size).toBe(imageCredits.length);
    for (const c of imageCredits) {
      expect(existsSync(pub(c.file)), c.file).toBe(true);
      expect(c.sha256, c.file).toMatch(/^[0-9a-f]{64}$/);
      // The same rules as the inbox CSV: source, page on the source's site, photographer.
      expect(() => parseCredits(`filename,source,page_url,photographer\nx,${c.source},${c.pageUrl},"${c.photographer}"\n`), c.file).not.toThrow();
      expect(c.source).not.toBe("chatgpt");
    }
  });

  it("credits every file under public/images/stock", () => {
    const dir = path.join("public", "images", "stock");
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".webp")) : [];
    const credited = new Set(imageCredits.map((c) => c.file));
    for (const f of files) expect(credited.has(`/images/stock/${f}`), f).toBe(true);
  });
});
