import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/** Task 6B: Home's work grid and Software's proof card follow the number of cards, from CSS alone. */
const box = async (page: Page, sel: string, n = 0) => {
  const b = await page.locator(sel).nth(n).boundingBox();
  if (!b) throw new Error(`no box for ${sel}[${n}]`);
  return b;
};
const near = (a: number, b: number, tol = 2) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
const right = (b: { x: number; width: number }) => b.x + b.width;

async function open(page: Page, path: string, sel: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoReady(page, path);
  await page.locator(sel).first().scrollIntoViewIfNeeded();
}

const cloneInPlace = (page: Page, sel: string, from: number) =>
  page.evaluate(
    ([s, i]) => {
      const el = document.querySelectorAll(s as string)[i as number];
      el.parentElement!.append(el.cloneNode(true));
    },
    [sel, from],
  );

test.describe("desktop grids follow the card count", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 900, "desktop only");

  for (const lang of ["en", "ar"] as const) {
    const rtl = lang === "ar";
    const WORK = "#work .work-grid > .work-card";

    test(`two work cards sit side by side at equal width (${lang})`, async ({ page }) => {
      await open(page, `/${lang}`, WORK);
      await expect(page.locator(WORK)).toHaveCount(2);
      const [a, b] = [await box(page, WORK, 0), await box(page, WORK, 1)];
      near(a.width, b.width);
      near(a.y, b.y);
      for (const i of [0, 1]) {
        const end = await page.locator(WORK).nth(i).evaluate((e) => getComputedStyle(e).gridRowEnd);
        expect(end).not.toBe("span 2");
      }
    });

    test(`a third work card brings back the designed grid (${lang})`, async ({ page }) => {
      await open(page, `/${lang}`, WORK);
      await cloneInPlace(page, WORK, 1);
      await expect(page.locator(WORK)).toHaveCount(3);
      const [a, b, c] = [await box(page, WORK, 0), await box(page, WORK, 1), await box(page, WORK, 2)];
      expect(a.width).toBeGreaterThan(b.width * 1.2);
      if (rtl) near(right(b), right(c));
      else near(b.x, c.x);
      expect(c.y).toBeGreaterThan(b.y + b.height);
    });

    const PROOF = "#proof .sw-proof-grid > .sw-proof-card";
    const path = `/${lang}/services/software-digital`;

    test(`one proof card takes the full row, image beside text (${lang})`, async ({ page }) => {
      await open(page, path, PROOF);
      const grid = await box(page, "#proof .sw-proof-grid");
      near((await box(page, PROOF)).width, grid.width);
      const v = await box(page, `${PROOF} .sw-proof-visual`);
      const l = await box(page, `${PROOF} .sw-proof-label`);
      expect(v.y).toBeLessThan(l.y + l.height);
      expect(l.y).toBeLessThan(v.y + v.height);
      if (rtl) expect(right(v)).toBeGreaterThan(right(l));
      else expect(v.x).toBeLessThan(l.x);
    });

    test(`a second proof card brings back two columns (${lang})`, async ({ page }) => {
      await open(page, path, PROOF);
      await cloneInPlace(page, PROOF, 0);
      await expect(page.locator(PROOF)).toHaveCount(2);
      const [a, b] = [await box(page, PROOF, 0), await box(page, PROOF, 1)];
      near(a.width, b.width);
      near(a.y, b.y);
      expect(a.width).toBeLessThan((await box(page, "#proof .sw-proof-grid")).width * 0.6);
      for (const i of [0, 1]) {
        const v = await box(page, `${PROOF} .sw-proof-visual`, i);
        const l = await box(page, `${PROOF} .sw-proof-label`, i);
        expect(v.y + v.height).toBeLessThanOrEqual(l.y + 0.5);
      }
    });
  }
});

test.describe("mobile keeps one column", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 900, "mobile only");

  test("work cards and the proof card stack full width", async ({ page }) => {
    await open(page, "/en", "#work .work-card");
    const grid = await box(page, "#work .work-grid");
    for (let i = 0; i < 2; i++) near((await box(page, "#work .work-card", i)).width, grid.width);
    await open(page, "/en/services/software-digital", "#proof .sw-proof-card");
    near((await box(page, "#proof .sw-proof-card")).width, (await box(page, "#proof .sw-proof-grid")).width);
  });
});
