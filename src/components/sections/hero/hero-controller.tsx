"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import type { AppLocale } from "@/i18n/routing";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { formatTimecode } from "@/lib/time";

/** How far the title dims on its way out (W02): still read, no longer competing. */
const TITLE_FLOOR = 0.45;
const WIDE = "(min-width: 900px)";
const NARROW = "(max-width: 899.98px)";

/**
 * Client half of the hero (D156). Nothing here gates the first screen: the server markup is
 * complete and visible at first paint. It runs:
 * - the pinned, scrubbed scroll exit (mirrored in Arabic; one screen, N05), built on the first
 *   scroll, key or touch (it sets #hero[data-hero-pinned]): the title lines part and dim, the
 *   eyebrow, clock and HUD leave, the letterbox opens, the plate drifts closer;
 * - the HUD timecode, while the hero is on screen (once a second under reduced motion).
 * Reduced motion: no pin and no exit; the static frame is final.
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
      if (prefersReducedMotion()) return () => delete hero.dataset.heroReady;
      const q = gsap.utils.selector(hero);
      const dir = locale === "ar" ? -1 : 1;
      let alive = true;

      // Built on the visitor's first scroll, key or touch (or at once if the page opens scrolled),
      // not at hydration: a pin built at rest turns #hero fixed while the first screen is still
      // being measured, and Chrome reported the title again as a new, larger LCP (+0.9 s on a slow
      // phone, D156). LCP ends at the first input, and globals.css already reserves the pin's
      // distance (.hero-pin), so a late build moves nothing.
      const mm = gsap.matchMedia();
      const build = () => {
        off();
        // Both conditions: matchMedia only runs while at least one matches.
        mm.add({ wide: WIDE, narrow: NARROW }, (ctx) => {
          const lines = q(".hero-line");
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: hero,
              pin: true,
              // The server-rendered wrapper (hero.tsx), so the hero is never moved in the DOM.
              pinSpacer: hero.parentElement?.classList.contains("hero-pin") ? hero.parentElement : undefined,
              start: "top top",
              // One screen (N05); the last part of the timeline leaves room for scrub's 1 s
              // catch-up, so the exit has finished before the hero unpins.
              end: "+=100%",
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 1,
            },
          });
          ScrollTrigger.sort();
          // Line 1 parts towards the reading start, line 2 towards the end (mirrored in AR). They
          // dim but stay, and leave with the hero (W02). The lead and actions stay put.
          tl.to(lines[0], { xPercent: -38 * dir, opacity: TITLE_FLOOR, ease: "power2.in", duration: 1 }, 0)
            .to(lines[1], { xPercent: 38 * dir, opacity: TITLE_FLOOR, ease: "power2.in", duration: 1 }, 0)
            .to(q(".hero-eyebrow"), { y: -40, opacity: 0, duration: 0.6 }, 0)
            .to(q(".hero-clock-wrap"), { scale: 2.2, opacity: 0, duration: 1.25 }, 0)
            .to(q(".hero-plate"), { scale: 1.08, duration: 1.8 }, 0)
            .to(q(".hero-hud"), { opacity: 0, duration: 0.4 }, 0)
            .to(q(".hero-letterbox.top"), { yPercent: -100, duration: 0.8 }, 0.25)
            .to(q(".hero-letterbox.bottom"), { yPercent: 100, duration: 0.8 }, 0.25);
          // Focus pull: the title racks out of focus as it leaves. Desktop only.
          if (ctx.conditions?.wide)
            tl.fromTo(q(".hero-title"), { filter: "blur(0px)" }, { filter: "blur(3px)", duration: 0.4 }, 0.6);
        });
        hero.dataset.heroPinned = "";
      };
      const INTENT = ["wheel", "touchstart", "keydown", "pointerdown", "scroll"] as const;
      const opts = { passive: true, capture: true } as const;
      function off() {
        for (const e of INTENT) removeEventListener(e, build, opts);
      }
      if (scrollY > 0) build();
      else for (const e of INTENT) addEventListener(e, build, opts);

      // Webfonts change line widths: re-measure the pin once they are in.
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

      return () => {
        alive = false;
        off();
        mm.revert();
        delete hero.dataset.heroReady;
        delete hero.dataset.heroPinned;
      };
    },
    { dependencies: [locale], revertOnUpdate: true },
  );

  // The HUD timecode (24 fps), only while the hero is on screen and the tab visible.
  useEffect(() => {
    const hero = anchor.current?.closest<HTMLElement>("#hero");
    const tc = hero?.querySelector<HTMLElement>("[data-hero-tc]");
    if (!hero || !tc) return;
    const t0 = performance.now();
    const reduced = prefersReducedMotion();
    let last = "";
    let raf = 0;
    let timer = 0;
    let onScreen = true;
    const write = () => {
      const txt = formatTimecode(performance.now() - t0);
      if (txt !== last) tc.textContent = last = txt;
    };
    const loop = () => {
      write();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
    const start = () => {
      stop();
      if (!onScreen || document.hidden) return;
      if (reduced) timer = window.setInterval(write, 1000);
      else raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      start();
    });
    io.observe(hero);
    document.addEventListener("visibilitychange", start);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return <span ref={anchor} hidden />;
}
