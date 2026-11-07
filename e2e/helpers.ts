import type { Page } from "@playwright/test";

/** Navigate and wait until client controllers have hydrated (ToneController marks #stage). */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await page.locator("#stage[data-tone-ready]").first().waitFor({ state: "attached" });
}

/** Wait until the hero controller has hydrated and taken over (it sets #hero[data-hero-ready]). */
export const controllerReady = (page: Page) => page.locator("#hero[data-hero-ready]").waitFor({ state: "attached" });

/**
 * Wait for the first-visit intro to end (it sets html[data-intro-seen]). On timeout, fail with
 * the page's state, so a stalled intro says why: an rAF count that stops growing means the page
 * was not rendering frames (GSAP's timeline only advances on rAF), not a controller bug.
 */
export async function waitForIntroEnd(page: Page, timeout = 10_000) {
  try {
    // Timer polling, not the default rAF polling: this waits for a DOM attribute, and must
    // still see it if the page stops producing frames.
    await page.waitForFunction(() => document.documentElement.hasAttribute("data-intro-seen"), null, { timeout, polling: 200 });
  } catch (err) {
    const state = await page
      .evaluate(async () => {
        let raf = 0;
        let counting = true;
        const tick = () => counting && (raf++, requestAnimationFrame(tick));
        requestAnimationFrame(tick);
        await new Promise((done) => setTimeout(done, 1000));
        counting = false;
        const hero = document.querySelector("#hero");
        return {
          now: Math.round(performance.now()),
          rafFramesIn1s: raf,
          visibility: document.visibilityState,
          readyState: document.readyState,
          heroIntro: hero?.hasAttribute("data-hero-intro"),
          heroReady: hero?.hasAttribute("data-hero-ready"),
          session: sessionStorage.getItem("nt-intro"),
          shutter: getComputedStyle(document.querySelector(".hero-shutter") ?? document.body).transform,
        };
      })
      .catch((e: Error) => ({ evaluateFailed: e.message }));
    throw new Error(`intro did not end within ${timeout} ms: ${JSON.stringify(state)}`, { cause: err });
  }
}
