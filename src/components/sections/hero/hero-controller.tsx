"use client";

import { useLocale } from "next-intl";
import { useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import type { AppLocale } from "@/i18n/routing";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { formatTimecode } from "@/lib/time";

const WIDE = "(min-width: 900px)";
const NARROW = "(max-width: 899.98px)";
/** The visitor's first move, which builds the desktop pin (D156). */
const INTENT = ["wheel", "touchstart", "keydown", "pointerdown", "scroll"] as const;
/** The countdown's length: one second per object. */
const COUNT_MS = 5000;

/** Where each object starts, in % of the hero box (x, y) and its tilt; index = the categories' order. */
type Start = readonly (readonly [number, number, number])[];
/** Desktop: four wait half outside the frame's edges; Events waits above it, out of sight. */
const START_WIDE: Start = [
  [50, -22, 0],
  [3, 26, -10],
  [2, 90, 9],
  [97, 26, 10],
  [98, 88, -8],
];
const START_NARROW: Start = [
  [50, -18, 0],
  [-24, 8, -8],
  [-26, 30, 8],
  [124, 8, 9],
  [126, 30, -8],
];
/** The order they arrive in: the four corners, then Events, on 12, at zero. */
const ORDER = [1, 3, 2, 4, 0];
const STEP = 0.8;
const MOVE = 1;

/**
 * Client half of the hero (D156, D173). Nothing here gates the first screen: the server markup is
 * complete and visible at first paint, at its end state (zero). It turns the clock back five
 * seconds and plays the countdown: the objects come in one per second, the second hand steps up
 * to 12 and the timecode runs down to 00:00:00:00. Mirrored in Arabic (they come in from the
 * other side).
 * - Desktop: scrubbed by the scroll through a short pin (+50%: the spacer is 150svh in all), built
 *   on the first scroll, key or touch (#hero[data-hero-pinned]) so the first screen is never
 *   re-measured at rest (LCP, D156).
 * - Phones: no pin; one light gathering as the page opens.
 * - Reduced motion: nothing runs; the end state is final.
 */
export function HeroController() {
  const anchor = useRef<HTMLSpanElement>(null);
  const locale = useLocale() as AppLocale;

  useGSAP(
    () => {
      // Via the anchor, not getElementById: pages kept hidden by <Activity> after a client
      // navigation can leave a second #hero in the DOM (DECISIONS D32).
      const hero = anchor.current?.closest<HTMLElement>("#hero");
      if (!hero) return;
      hero.dataset.heroReady = "";
      if (prefersReducedMotion()) {
        hero.dataset.heroSet = "";
        return () => {
          delete hero.dataset.heroReady;
          delete hero.dataset.heroSet;
        };
      }
      const objects = gsap.utils.toArray<HTMLElement>(".hero-object", hero);
      const hand = hero.querySelector(".hero-dial-hand");
      const ring = hero.querySelector(".hero-dial-ring");
      const tc = hero.querySelector<HTMLElement>("[data-hero-tc]");
      const rtl = locale === "ar";
      const arrived = (ORDER.length - 1) * STEP + MOVE;
      let last = "";
      const count = (time: number) => {
        const txt = formatTimecode(COUNT_MS * Math.max(0, 1 - time / arrived));
        if (tc && txt !== last) tc.textContent = last = txt;
      };

      /** Puts everything five seconds back and returns the countdown (paused at 0). */
      const rewind = (start: Start) => {
        const box = hero.getBoundingClientRect();
        // Measured at rest (no transform yet): from each object's centre where the CSS puts it.
        const at = objects.map((o) => o.getBoundingClientRect());
        objects.forEach((o, i) => {
          const [sx, sy, r] = start[i];
          const c = at[i];
          const x = ((rtl ? 100 - sx : sx) / 100) * box.width - (c.left + c.width / 2 - box.left);
          const y = (sy / 100) * box.height - (c.top + c.height / 2 - box.top);
          gsap.set(o, { x, y, rotation: rtl ? -r : r, scale: 1.25 });
        });
        gsap.set(hand, { rotation: -30, svgOrigin: "300 300" });
        gsap.set(ring, { opacity: 0.35 });
        count(0);
        hero.dataset.heroSet = "";
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" }, onUpdate: () => count(tl.time()) });
        ORDER.forEach((i, k) => {
          tl.to(objects[i], { x: 0, y: 0, rotation: 0, scale: 1, duration: MOVE }, k * STEP);
          // The pivot on every tween: without it GSAP moves the origin and slides the hand off centre.
          tl.to(hand, { rotation: -30 + (k + 1) * 6, svgOrigin: "300 300", duration: 0.12, ease: "back.out(3)" }, k * STEP + MOVE - 0.12);
        });
        tl.to(ring, { opacity: 1, duration: 0.5, ease: "none" }, arrived - 0.3);
        // A short hold at zero, so scrub's catch-up has finished before the hero unpins.
        tl.to({}, { duration: 0.5 }, arrived);
        return tl;
      };

      const mm = gsap.matchMedia();
      const intent = new AbortController();
      let alive = true;
      mm.add(WIDE, () => {
        const tl = rewind(START_WIDE);
        // The pin is built on the visitor's first move (or at once if the page opens scrolled):
        // a pin built at rest turns #hero fixed while the first screen is still being measured,
        // and Chrome reported the title again as a new, larger LCP (D156). globals.css already
        // reserves the distance (.hero-pin), so a late build moves nothing.
        let st: ScrollTrigger | undefined;
        const build = () => {
          intent.abort();
          if (st || !alive) return;
          st = ScrollTrigger.create({
            trigger: hero,
            pin: true,
            pinSpacer: hero.parentElement?.classList.contains("hero-pin") ? hero.parentElement : undefined,
            start: "top top",
            end: "+=50%",
            scrub: 0.6,
            animation: tl,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          });
          ScrollTrigger.sort();
          hero.dataset.heroPinned = "";
        };
        if (scrollY > 0) build();
        else for (const e of INTENT) addEventListener(e, build, { passive: true, capture: true, signal: intent.signal });
        return () => {
          st?.kill();
          delete hero.dataset.heroPinned;
        };
      });
      mm.add(NARROW, () => {
        // One light gathering as the page opens: the whole countdown in about two seconds.
        const tl = rewind(START_NARROW);
        tl.timeScale(2.4);
        gsap.delayedCall(0.25, () => tl.play());
      });

      // Webfonts change line widths: re-measure the pin once they are in.
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

      return () => {
        alive = false;
        intent.abort();
        mm.revert();
        delete hero.dataset.heroReady;
        delete hero.dataset.heroSet;
        delete hero.dataset.heroPinned;
      };
    },
    { dependencies: [locale], revertOnUpdate: true },
  );

  return <span ref={anchor} hidden />;
}
