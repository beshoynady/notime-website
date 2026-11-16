"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Stacking cards (D109): while the next card slides up over a held one, the held card's figure
 * steps back (scale 1 → 0.94) and dims, scrubbed. The hold itself is CSS (sticky, photo-stack.css).
 * GSAP owns `.pstack-fig` only; the sticky `li` is never tweened. Reduced motion builds nothing.
 */
export function PhotoStackMotion() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const root = ref.current?.closest<HTMLElement>(".pstack");
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = [...root.querySelectorAll<HTMLElement>(".pstack-card")];
      cards.slice(0, -1).forEach((card, i) => {
        const next = cards[i + 1];
        gsap.fromTo(
          card.querySelector(".pstack-fig"),
          { scale: 1, opacity: 1 },
          { scale: 0.94, opacity: 0.55, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top 35%", scrub: true } },
        );
      });
    });
    return () => mm.revert();
  });
  return <span ref={ref} hidden />;
}
