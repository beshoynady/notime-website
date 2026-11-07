"use client";

import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { mediaQueryList } from "@/hooks/use-media-query";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { splitVars } from "@/hooks/use-split-text";
import type { AppLocale } from "@/i18n/routing";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { afterFirstPaint } from "@/lib/idle";
import { withSplitText, type SplitTextPlugin } from "@/lib/split-text";
import { createSceneState } from "./scene-state";

// Client-only: the canvas has nothing to server-render (the CSS gradient on .hero is the
// same picture), and keeping it out of the server bundle keeps the hero's HTML light.
const HeroScene = dynamic(() => import("./hero-scene").then((m) => m.HeroScene), { ssr: false });

/** sessionStorage key: the intro plays once per session (the boot script reads it too). */
const INTRO_KEY = "nt-intro";
/** The CSS failsafe lifts the shutters at 5s; a controller that starts later must not replay the intro. */
const INTRO_DEADLINE_MS = 4500;
/** Repeat visits: the CSS failsafe reveals the masked title at 2.5s. */
const REVEAL_DEADLINE_MS = 2400;
/** Same as the motion-mode CSS on .hero-title, so the focus pull can add blur to it. */
const TITLE_SHADOW = "drop-shadow(0px 4px 40px rgba(13, 8, 5, 0.55))";
/** Same breakpoint as the CSS: masks, letter rise and SplitText only from here up. */
const WIDE = "(min-width: 900px)";
const NARROW = "(max-width: 899.98px)";

/**
 * Client half of the hero. Owns the SceneState shared by reference with the canvas, the
 * clock hand and GSAP, and runs:
 * - the first-visit intro (once per session; skippable by wheel, touch, key or click, and
 *   finished early when focus enters the header);
 * - the short title reveal on repeat visits (no shutters; desktop only);
 * - the pinned, scrubbed scroll timeline (mirrored in Arabic).
 * Each element is animated by one timeline only: the intro moves inner elements, the
 * scroll timeline their wrappers. Reduced motion: none of this; the static frame is final.
 *
 * LCP (D43): below 900px the title is painted in place from the first frame on every
 * visit (no masks, no split, no fade, no motion); the first-visit shutters part over it.
 * SplitText is downloaded only at >= 900px (letter rise, beat words).
 */
export function HeroController() {
  const [state] = useState(createSceneState);
  const [sceneOn, setSceneOn] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);
  const locale = useLocale() as AppLocale;

  // The canvas is atmosphere, not content (the CSS gradient is the same picture): mount it
  // after the first paint, outside the hydration task (D44).
  useEffect(() => afterFirstPaint(() => setSceneOn(true)), []);

  useGSAP(
    (context) => {
      // Via the anchor, not getElementById: pages kept hidden by <Activity> after a client
      // navigation can leave a second #hero in the DOM (DECISIONS D32).
      const hero = anchor.current?.closest<HTMLElement>("#hero");
      if (!hero || prefersReducedMotion()) return;
      const q = gsap.utils.selector(hero);
      const root = document.documentElement;
      const shell = document.querySelector<HTMLElement>("[data-header-shell]");
      const title = q(".hero-title")[0];
      const beat = q(".hero-beat")[0];
      const inners = q(".hero-line-inner");
      const dir = locale === "ar" ? -1 : 1;
      // Width at start, for the intro and the repeat-visit reveal (each runs once).
      const wide = mediaQueryList(WIDE).matches;
      let alive = true;
      let cancelTitle = () => {};

      // ---- Scroll: pinned, scrubbed --------------------------------------------------
      // Built synchronously at every width, so the pin spacer exists before the
      // ToneController measures its zones; only the desktop beat words wait for SplitText.
      const mm = gsap.matchMedia();
      // Both conditions: matchMedia only runs the callback while at least one matches.
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
            end: "+=140%",
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // The page subtree can hydrate after the layout's ToneController has made its
            // triggers; refresh the pin first so later triggers include its spacing.
            refreshPriority: 1,
          },
        });
        ScrollTrigger.sort();
        // Line 1 exits towards the reading start, line 2 towards the end (mirrored in AR).
        tl.to(lines[0], { xPercent: -38 * dir, opacity: 0, ease: "power2.in", duration: 1 }, 0)
          .to(lines[1], { xPercent: 38 * dir, opacity: 0, ease: "power2.in", duration: 1 }, 0)
          .to(q(".hero-sub"), { y: -50, opacity: 0, duration: 0.6 }, 0)
          .to(q(".hero-clock-wrap"), { scale: 2.9, opacity: 0, duration: 1.25 }, 0)
          .to(state, { spread: 2.5, speed: 8, duration: 1.2 }, 0)
          .to(q(".hero-hud"), { opacity: 0, duration: 0.4 }, 0)
          .to(q(".hero-letterbox.top"), { yPercent: -100, duration: 0.8 }, 0.25)
          .to(q(".hero-letterbox.bottom"), { yPercent: 100, duration: 0.8 }, 0.25)
          .to(state, { speed: 1.4, spread: 1.7, duration: 0.6 }, 1.2)
          .to(beat, { y: -30, duration: 0.6 }, 1.8);
        if (!ctx.conditions?.wide) {
          // Mobile: the beat rises as one block (no SplitText below 900px).
          tl.fromTo(beat, { opacity: 0, yPercent: 18 }, { opacity: 1, yPercent: 0, duration: 0.6, ease: "power2.out" }, 0.95);
          return;
        }
        tl.set(beat, { opacity: 1 }, 0.95);
        // Focus pull (elevation): the title racks out of focus as it leaves. Desktop only.
        tl.fromTo(title, { filter: `${TITLE_SHADOW} blur(0px)` }, { filter: `${TITLE_SHADOW} blur(6px)`, duration: 0.4 }, 0.6);
        // Beat words rise once SplitText is in (ends at 1.95, inside the timeline's length).
        // Without it, the beat still appears at 0.95 as one block.
        return withSplitText(ctx, (Split) => {
          const words = Split.create(beat, { ...splitVars(locale, { wordsOnly: true }), aria: "none" }).words;
          tl.from(words, { yPercent: 110, stagger: 0.09, duration: 0.5, ease: "power2.out" }, 0.95);
        });
      });

      // ---- Intro or repeat-visit reveal ----------------------------------------------
      const firstVisit = !root.hasAttribute("data-intro-seen") && performance.now() < INTRO_DEADLINE_MS;
      // Session flag only: html[data-intro-seen] is set when the intro ends, because the
      // CSS intro gate (shutters, hidden header) keys off its absence.
      const markSeen = () => {
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {}
      };
      let cleanupSkip = () => {};

      if (!firstVisit) {
        // Also reached on a first visit that hydrated past the deadline (the CSS failsafe
        // has already opened the shutters): record the intro as seen either way.
        markSeen();
        root.dataset.introSeen = "";
        // Desktop: same masked state the CSS held (as yPercent, so GSAP owns it), then rise.
        // Mobile: the title is already painted in place (LCP), so it stays put.
        const reveal = wide && performance.now() < REVEAL_DEADLINE_MS;
        if (reveal) gsap.set(inners, { y: 0, yPercent: 115 });
        hero.dataset.heroReady = "";
        delete hero.dataset.heroIntro;
        if (reveal) gsap.to(inners, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 });
      } else {
        markSeen(); // a reload mid-intro gets the short reveal, not the intro again
        hero.dataset.heroReady = "";
        const shutters = q(".hero-shutter");
        const hud = q("[data-hud]");
        const owned = shell ? [...shutters, shell] : shutters;
        // The controller owns these now: cancel the CSS failsafe animations.
        gsap.set(owned, { animation: "none" });

        const finish = () => {
          // Desktop: shows the held lines if the intro ended before their rise was added.
          gsap.set(inners, { visibility: "visible" });
          cleanupSkip();
          root.dataset.introSeen = "";
          delete hero.dataset.heroIntro; // shutters and intro-only CSS off
          gsap.set(owned, { clearProps: "all" });
          // The split stays (reverted with the context on unmount): reverting here moved the
          // centred block by a subpixel, a measured 0.0011 layout shift at the end of the intro.
        };
        // Start dark, hand at 12 (through GSAP like every other write to the shared state).
        gsap.set(state, { alpha: 0, handIntro: 0 });
        const intro = gsap.timeline({ onComplete: finish });
        intro
          // Header: opacity only, never visibility, so it stays focusable.
          .set(shell ?? [], { opacity: 0 }, 0)
          .to(shutters[0], { yPercent: -101, duration: 1.7, ease: "expo.inOut" }, 0.15)
          .to(shutters[1], { yPercent: 101, duration: 1.7, ease: "expo.inOut" }, 0.15)
          .to(state, { alpha: 1, duration: 2.6, ease: "power2.out" }, 0.3)
          .fromTo(q(".hero-clock-ring"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: "power3.inOut" }, 0.55)
          .to(state, { handIntro: 1, duration: 2.6, ease: "power3.inOut" }, 0.7)
          .from(q(".hero-clock-ticks line"), { autoAlpha: 0, duration: 0.6, stagger: 0.014 }, 0.8)
          // The lead is visible from frame one (LCP candidate): y only.
          .from([q(".hero-lead")[0], q(".hero-sub a")[0]], { y: 26, duration: 1.1, ease: "power3.out", stagger: 0.12 }, 1.9)
          .from(hud, { autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 2.1)
          .to(shell ?? [], { opacity: 1, duration: 0.8, ease: "power2.out" }, 2.1);

        // Mobile (LCP rule, D43): the title is painted in place and stays still; the shutters
        // part over it. Any animation of it after its first paint (a transform settle, even a
        // blur) made Chrome report a second LCP entry when the tween ended: measured +1.1-2.1 s
        // at 4x CPU, versus LCP = first contentful paint with the title still.
        if (wide) {
          // Desktop: letters (EN) or words (AR) rise out of the line masks at 1.15s. The lines
          // are held with visibility, not moved: the split can change their width (a cold
          // first visit re-renders in the loaded webfont), and a hidden box is not a layout
          // shift. If SplitText never arrives, the lines rise whole.
          gsap.set(inners, { visibility: "hidden" });
          const addTitle = (Split: SplitTextPlugin | null) => {
            if (intro.progress() === 1) return; // skipped or ended meanwhile: finish() showed the lines
            const at = Math.max(1.15, intro.time());
            const split = Split?.create(inners, { ...splitVars(locale, { mask: false }), aria: "none" });
            const units = split ? (locale === "ar" ? split.words : split.chars) : inners;
            const stagger = split ? (locale === "ar" ? 0.11 : 0.045) : 0.08;
            intro
              .set(inners, { visibility: "visible" }, at)
              .from(units, { duration: 1.5, ease: "expo.out", yPercent: 118, rotate: split ? 5 : 0, stagger }, at);
          };
          cancelTitle = withSplitText(context, addTitle, () => addTitle(null));
        }

        // Skippable: any scroll, touch, key or click jumps to the end state; so does
        // focus entering the header (e.g. Tab to the skip link) before it has faded in.
        const skip = () => {
          if (intro.progress() < 1) intro.progress(1);
        };
        const passive = { passive: true, capture: true } as const;
        addEventListener("wheel", skip, passive);
        addEventListener("touchstart", skip, passive);
        addEventListener("pointerdown", skip, passive);
        addEventListener("keydown", skip, true);
        shell?.addEventListener("focusin", skip);
        cleanupSkip = () => {
          removeEventListener("wheel", skip, passive);
          removeEventListener("touchstart", skip, passive);
          removeEventListener("pointerdown", skip, passive);
          removeEventListener("keydown", skip, true);
          shell?.removeEventListener("focusin", skip);
        };
      }

      // Webfonts change line widths: re-measure the pin once they are in.
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

      return () => {
        alive = false;
        cancelTitle();
        cleanupSkip();
        delete hero.dataset.heroReady;
      };
    },
    { dependencies: [locale, state], revertOnUpdate: true },
  );

  // Pointer parallax: mouse only; touch and pen leave the scene centred.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      state.pointer.x = (e.clientX / innerWidth) * 2 - 1;
      state.pointer.y = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, [state]);

  return (
    <>
      <span ref={anchor} hidden />
      {sceneOn && <HeroScene state={state} />}
    </>
  );
}
