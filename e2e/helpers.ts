import type { Page } from "@playwright/test";

/** Navigate and wait until client controllers have hydrated (ToneController marks #stage). */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await page.locator("#stage[data-tone-ready]").first().waitFor({ state: "attached" });
}
