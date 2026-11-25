"use client";

import { useRef } from "react";
import { checkinCount } from "@/content/film";
import { gsap, useGSAP } from "@/lib/gsap";
import { formatTimecode } from "@/lib/time";

/** The viewfinder's countdown, in ms: five seconds down to zero over the Creative scene. */
const TC_MS = 5000;
/** The visitor's first move, which builds the scenes' motion. */
const INTENT = ["wheel", "touchstart", "keydown", "pointerdown", "scroll"] as const;

/**
 * Client half of the film (film.tsx). The layout is CSS: in motion mode each scene rises over the
 * one before (sticky plates, a screen of overlap). This only adds, scrubbed by the scroll:
 * - the rise becomes a dissolve: the incoming plate is held in place (counter-translated) while it
 *   fades in, and the outgoing copy fades out before it is covered;
 * - a slow dolly on every plate, and each scene's own move (lights up, the timecode to zero, the
 *   screens on, the card set down, the guests counted in, the hand to twelve).
 * Transforms and opacity only (no layout, CLS 0). Nothing runs under reduced motion, where the
 * scenes stack at their final frames; the server markup is that final state.
 */
export function FilmMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const film = anchor.current?.closest<HTMLElement>(".film");
    if (!film) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", (context) => {
      if (document.documentElement.hasAttribute("data-reduced")) return;
      const beats = gsap.utils.toArray<HTMLElement>(":scope > .film-beat", film);
      const q = (el: HTMLElement, s: string) => el.querySelector<HTMLElement>(s);

      // Built on the visitor's first move, not at hydration: measuring every scene then blocks the
      // main thread while the first screen loads (TBT; D156 did the same for the hero). Until then
      // the opening holds its first frame (film.css). Added through the context, so the tweens made
      // later still revert with this media query.
      const intent = new AbortController();
      const build = context.add("build", () => {
        intent.abort();
        if (film.hasAttribute("data-film-built")) return;
        film.dataset.filmBuilt = "";
        beats.forEach((beat, i) => {
          const plate = q(beat, ".film-plate");
          const cover = q(beat, ".film-cover");
          const copy = q(beat, "[data-film-copy]");
          const prevCopy = i > 0 ? q(beats[i - 1], "[data-film-copy]") : null;
          // The scene's whole time on screen: rising in (from the bottom), then held.
          const span = { trigger: beat, start: i === 0 ? "top top" : "top bottom", end: "bottom bottom", scrub: true };
          // The scene's own move: from mid-rise to just after it has arrived, so it is done while held.
          const act = { trigger: beat, start: "top 60%", end: "top -15%", scrub: true };

          if (cover) gsap.fromTo(cover, { scale: 1.1 }, { scale: 1, ease: "none", scrollTrigger: span });

          if (i > 0 && plate) {
            const rise = gsap.timeline({ scrollTrigger: { trigger: beat, start: "top bottom", end: "top top", scrub: true } });
            rise.fromTo(plate, { yPercent: -100 }, { yPercent: 0, ease: "none", duration: 1 }, 0);
            rise.fromTo(plate, { opacity: 0 }, { opacity: 1, ease: "power1.inOut", duration: 0.6 }, 0);
            // The copy is held in place too and dissolves in as the old copy leaves, so a scene's
            // words are on screen through every transition (W02: no empty screen mid-rise).
            const copyBox = q(beat, ".film-copy");
            if (copyBox) rise.fromTo(copyBox, { yPercent: -100 }, { yPercent: 0, ease: "none", duration: 1 }, 0);
            if (prevCopy) rise.to(prevCopy, { opacity: 0, yPercent: -6, ease: "power1.in", duration: 0.3 }, 0.1);
            if (copy) {
              rise.fromTo(copy, { opacity: 0 }, { opacity: 1, ease: "power1.out", duration: 0.3 }, 0.4);
              // Unclickable until it shows: held over the scene before, it would take that scene's clicks.
              rise.set(copy, { pointerEvents: "none", immediateRender: true }, 0);
              rise.set(copy, { pointerEvents: "auto" }, 0.55);
            }
          }

          const veil = q(beat, "[data-film-veil]");
          const haze = q(beat, "[data-film-haze]");
          if (veil) gsap.fromTo(veil, { opacity: 0.82 }, { opacity: 0, ease: "power2.out", scrollTrigger: act });
          if (haze) gsap.fromTo(haze, { opacity: 0 }, { opacity: 1, ease: "power1.in", scrollTrigger: act });

          const tc = q(beat, "[data-film-tc]");
          if (tc)
            gsap.to({}, {
              scrollTrigger: { ...act, onUpdate: (st) => (tc.textContent = formatTimecode((1 - st.progress) * TC_MS)) },
            });

          const screen = q(beat, "[data-film-screen]");
          if (screen) gsap.fromTo(screen, { opacity: 0.08 }, { opacity: 1, ease: "power2.in", scrollTrigger: act });
          const device = q(beat, "[data-film-device]");
          if (device) gsap.fromTo(device, { yPercent: 14, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power2.out", scrollTrigger: act });

          const card = q(beat, "[data-film-card]");
          if (card) gsap.fromTo(card, { yPercent: -40, rotate: -16, opacity: 0 }, { yPercent: 0, rotate: -6, opacity: 1, ease: "power2.out", scrollTrigger: act });

          const count = q(beat, "[data-film-count]");
          const bar = q(beat, "[data-film-bar]");
          if (count && bar)
            gsap.to({}, {
              scrollTrigger: {
                ...act,
                onUpdate: (st) => {
                  const n = checkinCount(st.progress);
                  count.textContent = String(n);
                  bar.style.transform = `scaleX(${n / checkinCount(1)})`;
                },
              },
            });

          const hand = q(beat, ".film-dial-hand");
          if (hand) gsap.fromTo(hand, { rotate: -30 }, { rotate: 0, ease: "steps(5)", svgOrigin: "300 300", scrollTrigger: act });
        });
      });

      if (scrollY > 0) build();
      else for (const e of INTENT) addEventListener(e, () => build(), { passive: true, capture: true, signal: intent.signal });
      return () => {
        intent.abort();
        delete film.dataset.filmBuilt;
      };
    });
    // Hydrated, the first move awaited (e2e waits on it; set under reduced motion too).
    film.dataset.filmReady = "";
    return () => mm.revert();
  });

  return <span ref={anchor} hidden />;
}
