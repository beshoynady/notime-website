import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

const SERVICES_PAGES = [
  "/services",
  "/services/events-hospitality",
  "/services/creative-production",
  "/services/marketing-brand",
  "/services/production-print-gifts",
  "/services/software-digital",
] as const;

const overflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test.describe("no horizontal scroll at 360px", () => {
  test.skip(({ isMobile }) => !isMobile, "runs once, in the mobile project");
  test.use({ viewport: { width: 360, height: 780 } });

  for (const locale of ["en", "ar"] as const) {
    test(`menu closed and open (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      expect(await overflow(page)).toBeLessThanOrEqual(0);

      // Bottom of the page (footer, marquee) too.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      expect(await overflow(page)).toBeLessThanOrEqual(0);

      await page.locator("button[aria-controls=mobile-nav]").click();
      await expect(page.locator("#mobile-nav")).toBeVisible();
      await page.locator("#mobile-nav details").first().locator("summary").click();
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });

    test(`styleguide, top to bottom (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}/styleguide`);
      expect(await overflow(page)).toBeLessThanOrEqual(0);
      // Walk the page so scroll-driven states (open card, parallax, marquee) all run.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });

    // The services overview and the five category pages (D57).
    for (const path of SERVICES_PAGES) {
      test(`${path}, top to bottom (${locale})`, async ({ page }) => {
        await gotoReady(page, `/${locale}${path}`);
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
        });
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });
    }
  }
});

test.describe("How we work starts on the page grid", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  for (const locale of ["en", "ar"] as const) {
    test(`the heading shares the logo's start edge (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}`);
      await page.locator("#how-we-work").scrollIntoViewIfNeeded();
      const edges = await page.evaluate(() => {
        const rtl = document.documentElement.dir === "rtl";
        const edge = (el: Element | null) => {
          const r = el!.getBoundingClientRect();
          return rtl ? r.right : r.left;
        };
        return { logo: edge(document.querySelector("header a")), h2: edge(document.querySelector("#how-we-work h2")) };
      });
      expect(Math.abs(edges.h2 - edges.logo)).toBeLessThanOrEqual(2);
    });
  }
});

test.describe("Choose the mood keeps its gutter at 390", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  for (const locale of ["en", "ar"] as const) {
    test(`the text stays inside the gutter (${locale})`, async ({ page }) => {
      await gotoReady(page, `/${locale}/services/events-hospitality`);
      await page.locator("#celebrations").scrollIntoViewIfNeeded();
      const bad = await page.evaluate(() => {
        const root = document.querySelector("#celebrations")!;
        const out: string[] = [];
        for (const el of root.querySelectorAll("p, h2, h3, h4, a, button, figcaption")) {
          if (el.closest(".pstack-cards")) continue; // the photo row
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.left < 15 || r.right > window.innerWidth - 15) out.push(`${el.tagName}.${el.className} ${Math.round(r.left)}-${Math.round(r.right)}`);
        }
        return out;
      });
      expect(bad).toEqual([]);
    });
  }
});

test.describe("case study has no empty band (N21)", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only: the 40% rule is stated at 1440");

  // BLANK injects a forced blank so the test can be shown to fail (temporary check only).
  for (const locale of ["en", "ar"] as const) {
    for (const slug of ["football-league-events-awards", "airline-exhibition-pavilion"]) {
      test(`${slug} (${locale}): no empty run taller than 40% of the viewport`, async ({ page }) => {
        await gotoReady(page, `/${locale}/work/${slug}`);
        if (process.env.N21_BLANK) await page.addStyleTag({ content: process.env.N21_BLANK });

        // Walk the page. The tone controller fades a section while it is far from the viewport, so
        // "seen" is recorded per element at each step: it counts only if, at some scroll position,
        // it was really visible (its own and every ancestor's opacity >= 0.5, not hidden).
        const result = await page.evaluate(async () => {
          const vh = window.innerHeight;
          const sel = "main h1, main h2, main h3, main p, main li, main dt, main dd, main a, main img, main svg, main figure";
          const seen = new Set<Element>();
          const sections = [...document.querySelectorAll("main > section")];
          const sectionBest = new Map<Element, number>(sections.map((s) => [s, 0]));
          const visible = (el: Element) => {
            for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
              const cs = getComputedStyle(n);
              if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.5) return false;
            }
            return true;
          };
          const sample = () => {
            for (const e of document.querySelectorAll(sel)) if (!seen.has(e) && visible(e)) seen.add(e);
            for (const s of sections) {
              const r = s.getBoundingClientRect();
              if (r.bottom > 0 && r.top < vh) sectionBest.set(s, Math.max(sectionBest.get(s)!, parseFloat(getComputedStyle(s).opacity)));
            }
          };
          for (let y = 0; y < document.documentElement.scrollHeight; y += 200) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 90));
            sample();
          }
          sample();

          const mainTop = document.querySelector("main")!.getBoundingClientRect().top + scrollY;
          const foot = document.querySelector("footer");
          const end = foot ? foot.getBoundingClientRect().top + scrollY : document.documentElement.scrollHeight;
          const runs: [number, number][] = [];
          for (const e of seen) {
            const r = e.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) continue;
            // A backdrop taller than the viewport is not content that fills the band.
            if (/^(IMG|svg|FIGURE)$/i.test(e.tagName) && r.height > vh * 1.5) continue;
            if (!/^(IMG|svg|FIGURE)$/i.test(e.tagName) && !(e.textContent ?? "").trim()) continue;
            runs.push([r.top + scrollY, r.bottom + scrollY]);
          }
          runs.sort((a, b) => a[0] - b[0]);
          let cursor = mainTop;
          let max = 0;
          for (const [t, b] of runs) {
            max = Math.max(max, t - cursor);
            cursor = Math.max(cursor, b);
          }
          max = Math.max(max, end - cursor);
          return { max: Math.round(max), limit: Math.round(vh * 0.4), faded: sections.filter((s) => sectionBest.get(s)! < 0.9).map((s) => s.id || s.getAttribute("aria-labelledby") || s.className) };
        });
        console.log(`N21 ${slug} ${locale}: largest empty run ${result.max}px (limit ${result.limit}px)`);
        // Each section reached full opacity while on screen: the test measures what a visitor sees.
        expect(result.faded).toEqual([]);
        expect(result.max).toBeLessThanOrEqual(result.limit);
      });
    }
  }
});
