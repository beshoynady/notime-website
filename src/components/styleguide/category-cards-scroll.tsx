"use client";

import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Below 900px (touch: no hover), the card crossing 60% of the viewport gets `is-on`.
 * Only a class flips; the opening itself is a CSS transition. Desktop is pure CSS.
 */
export function CategoryCardsScroll({ children }: { children: ReactNode }) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!el.current || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(max-width: 899.98px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".sg-cat", el.current);
        cards.forEach((card) =>
          ScrollTrigger.create({
            trigger: card,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => card.classList.toggle("is-on", self.isActive),
          }),
        );
        return () => cards.forEach((card, i) => card.classList.toggle("is-on", i === 0));
      });
      return () => mm.revert();
    },
    { scope: el },
  );

  return (
    <div ref={el} className="sg-cats" data-scroll-cards="">
      {children}
    </div>
  );
}
