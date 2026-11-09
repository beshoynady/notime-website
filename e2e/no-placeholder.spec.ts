import { expect, test, type APIRequestContext } from "@playwright/test";
import { getCategories } from "../src/content";
import { gotoReady } from "./helpers";

/**
 * Fill or hide (D78): no public page, in either language, shows a TODO, a placeholder string, an
 * unfilled {token} or a link that goes nowhere. Designed image placeholders are allowed (they show
 * no "placeholder" text). Runs on the production build; review mode has its own spec.
 */
const ROUTES = ["", "/services", ...getCategories().map((c) => `/services/${c.slug}`), "/privacy", "/terms", "/cookies"];
/** Categories whose copy deck moves into the data in the v1 plan's decks task; fixme until then. */
const DECKS_PENDING = new Set(["/services/creative-production", "/services/marketing-brand", "/services/production-print-gifts", "/services/software-digital"]);
const BANNED_TEXT = /TODO|placeholder|lorem ipsum|\{[a-zA-Z]+\}|pending|later phase|will appear here soon/i;

const exists = new Map<string, Promise<string | null>>();
/** The page's HTML (null for a 4xx/5xx), fetched once per path. */
const html = (request: APIRequestContext, path: string) => {
  if (!exists.has(path)) exists.set(path, request.get(path).then(async (r) => (r.ok() ? await r.text() : null)));
  return exists.get(path)!;
};

for (const locale of ["en", "ar"] as const) {
  for (const route of ROUTES) {
    const path = `/${locale}${route}`;
    test(`${path}: no placeholder text, every link lands`, async ({ page, request }) => {
      test.fixme(DECKS_PENDING.has(route), "v1 plan, decks task: the deck's copy replaces the TODO points and FAQ");
      await gotoReady(page, path);
      const text = await page.locator("body").innerText();
      expect(text.match(BANNED_TEXT)?.[0], "visible placeholder text").toBeUndefined();

      const hrefs = await page.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
      expect(hrefs.filter((h) => h === null || h === "" || h === "#"), "empty links").toEqual([]);

      const internal = [...new Set(hrefs.filter((h): h is string => !!h && h.startsWith("/")))];
      for (const href of internal) {
        const [target, hash] = href.split("#");
        const body = await html(request, target || path);
        expect(body, `${href} returns an error`).not.toBeNull();
        if (hash) expect(body!.includes(`id="${hash}"`), `${href}: no #${hash} on that page`).toBe(true);
      }
    });
  }
}
