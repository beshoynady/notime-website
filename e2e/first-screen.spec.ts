import { expect, test, type Page } from "@playwright/test";

/**
 * Home's first screen is complete at first paint (visual portfolio C1, Task 8): no intro gate.
 * On a first visit (a fresh context, nothing in sessionStorage), 200 ms after `load`, the header,
 * the H1 and both CTAs are fully opaque and on screen. The hero has no photo plate since D173: its
 * five objects load eagerly at low priority (they start outside the frame, where lazy loading
 * never fires), and LCP is the H1.
 */

/**
 * The element's effective opacity (its own times every ancestor's), and whether it's on screen.
 * `own: false` counts the ancestors only: a header control has a designed resting dim (the burger
 * at 0.9, the nav links lighter), and what a gate would change is the opacity above it.
 */
const seen = (page: Page, selector: string, own = true) =>
  page.locator(selector).first().evaluate((el, own) => {
    let opacity = 1;
    let hidden = false;
    for (let n: Element | null = own ? el : el.parentElement; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      opacity *= parseFloat(cs.opacity);
      if (cs.visibility === "hidden" || cs.display === "none") hidden = true;
    }
    const r = el.getBoundingClientRect();
    const onScreen = r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
    return { opacity, hidden, onScreen };
  }, own);

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: header, H1 and both CTAs at first paint`, async ({ page, isMobile }) => {
    test.setTimeout(30_000);
    await page.goto(`/${locale}`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(200);
    const targets = [
      // The header's shell is what an intro would hold back (a zero-height wrapper round the fixed
      // header: its opacity counts, its box doesn't); then its menu button or first nav link.
      ["header", "[data-header-shell]"],
      ["header control", isMobile ? '#site-header button[aria-controls="mobile-nav"]' : "#site-header nav a:visible"],
      ["H1", "#hero-title"],
      ["primary CTA", ".hero-actions a >> nth=0"],
      ["work CTA", ".hero-actions a >> nth=1"],
    ] as const;
    for (const [name, selector] of targets) {
      const s = await seen(page, selector, name !== "header control");
      expect(s.hidden, `${name} hidden`).toBe(false);
      expect(s.opacity, `${name} opacity`).toBeGreaterThanOrEqual(0.99);
      if (name !== "header") expect(s.onScreen, `${name} on screen`).toBe(true);
    }
    // The five objects: eager at low priority, so they never compete with the title.
    const objects = page.locator("#hero .hero-object img");
    await expect(objects).toHaveCount(5);
    for (const img of await objects.all()) {
      await expect(img).toHaveAttribute("fetchpriority", "low");
      expect(await img.getAttribute("loading")).not.toBe("lazy");
    }
    // No intro gate is left in the page: no shutters, nothing waiting on html[data-intro-seen].
    await expect(page.locator(".hero-shutter")).toHaveCount(0);
  });

  test(`${locale}: LCP is the H1`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await page.waitForLoadState("load");
    const lcp = await page.evaluate(
      () =>
        new Promise<string>((resolve) => {
          const none = setTimeout(() => resolve("no LCP entry"), 5000);
          new PerformanceObserver((list) => {
            const el = (list.getEntries().at(-1) as PerformanceEntry & { element?: Element }).element;
            clearTimeout(none);
            resolve(el?.matches("#hero-title, #hero-title *") ? "h1" : `${el?.tagName}.${el?.className}`);
          }).observe({ type: "largest-contentful-paint", buffered: true });
        }),
    );
    expect(lcp).toBe("h1");
  });

  // The scroll timeline gives the title's lines their rest transform when the controller hydrates.
  // If that lands on the box holding the text, Chrome repaints it as a new, larger LCP entry, late
  // on a slow phone (+0.9 s in Lighthouse, D156). No title entry may come after hydration.
  test(`${locale}: hydration doesn't re-report the title as LCP`, async ({ page }) => {
    test.setTimeout(45_000);
    await page.addInitScript(() => {
      const w = window as unknown as { __lcp: number[]; __ready?: number };
      w.__lcp = [];
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as unknown as { startTime: number; element: Element | null }[])
          if (e.element?.closest("#hero-title")) w.__lcp.push(e.startTime);
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new MutationObserver(() => {
        if (w.__ready === undefined && document.querySelector("#hero[data-hero-ready]")) w.__ready = performance.now();
      }).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-hero-ready"] });
    });
    // A slow phone's CPU, so hydration lands after the first paint (as in Lighthouse).
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto(`/${locale}`);
    await page.locator("#hero[data-hero-ready]").waitFor({ state: "attached", timeout: 20_000 });
    await page.waitForTimeout(1500);
    const { lcp, ready } = await page.evaluate(() => {
      const w = window as unknown as { __lcp: number[]; __ready?: number };
      return { lcp: w.__lcp, ready: w.__ready ?? 0 };
    });
    expect(lcp.length, "the title painted").toBeGreaterThan(0);
    expect(lcp.filter((t) => t > ready), `title LCP entries after hydration (${ready.toFixed(0)} ms)`).toEqual([]);
  });
}
