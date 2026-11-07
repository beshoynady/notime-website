import { expect, test } from "@playwright/test";
import { imageSlots } from "../src/content/images";
import { gotoReady } from "./helpers";

// D51: no screen requests more pixels than an image file has. A 3× screen at desktop width is
// the worst case for `sizes`; the capped srcset must still stop at the slot's native width.
test.use({ deviceScaleFactor: 3 });

const nativeBySrc = new Map<string, number>(imageSlots.filter((s) => s.src).map((s) => [s.src!, s.width!]));

for (const locale of ["en", "ar"] as const) {
  test(`images never exceed their native width (${locale})`, async ({ page }) => {
    await gotoReady(page, `/${locale}/styleguide`);
    const imgs = page.locator("img[srcset]");
    expect(await imgs.count()).toBeGreaterThan(0);
    // Load every lazy image, then read what the browser chose and what the server sent.
    const seen = await imgs.evaluateAll(async (els) => {
      for (const el of els as HTMLImageElement[]) el.loading = "eager";
      await Promise.all((els as HTMLImageElement[]).map((el) => el.decode().catch(() => undefined)));
      // naturalWidth is density-corrected for w-descriptors, so decode the response itself to
      // get the pixels the server actually sent.
      return Promise.all(
        (els as HTMLImageElement[]).map(async (el) => ({
          src: new URL(el.currentSrc).searchParams.get("url"),
          natural: (await createImageBitmap(await (await fetch(el.currentSrc)).blob())).width,
          candidates: el.srcset.split(", ").map((c) => Number(/ (\d+)w$/.exec(c)?.[1])),
        })),
      );
    });
    // Slot images only (the logo is a static import, not a slot).
    const slots = seen.filter((s) => s.src?.startsWith("/images/"));
    expect(slots.length).toBeGreaterThan(0);
    for (const s of slots) {
      const native = nativeBySrc.get(s.src ?? "");
      expect(native, `slot for ${s.src}`).toBeDefined();
      expect(Math.max(...s.candidates), `largest candidate for ${s.src}`).toBeLessThanOrEqual(native!);
      expect(s.natural, `served width for ${s.src}`).toBeLessThanOrEqual(native!);
    }
  });
}
