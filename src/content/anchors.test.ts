import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getServices } from "./index";

/** What renders on a category page: the locale layout and its parts, the route, its sections and modules. */
const ON_CATEGORY_PAGE = [
  "app/[locale]/layout.tsx",
  "app/[locale]/services/[category]/",
  "components/layout/",
  "components/providers/",
  "components/category/",
  "components/modules/",
  "components/ui/",
];

/** Every literal id (id="…" in JSX) in what renders on a category page. */
function sourceIds(): Map<string, string> {
  const ids = new Map<string, string>();
  for (const entry of readdirSync("src", { recursive: true }) as string[]) {
    const rel = entry.replaceAll("\\", "/");
    if (!rel.endsWith(".tsx") || !ON_CATEGORY_PAGE.some((p) => rel.startsWith(p))) continue;
    const text = readFileSync(join("src", rel), "utf8");
    for (const m of text.matchAll(/\bid="([^"]+)"/g)) ids.set(m[1], rel);
  }
  return ids;
}

describe("service anchors (D57)", () => {
  it("never collide with an id on the category page around them", () => {
    // A collision makes getElementById find the wrong element: #stage once hit the layout
    // wrapper, so deep links and the scrollspy went to the top of the page.
    const ids = sourceIds();
    expect(ids.has("site-header")).toBe(true); // the scan reaches the layout
    const clashes = getServices()
      .flatMap((s) => [s.anchor, `${s.anchor}-title`])
      .filter((id) => ids.has(id))
      .map((id) => `${id} (also in ${ids.get(id)})`);
    expect(clashes).toEqual([]);
  });
});
