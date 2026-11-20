"use client";

import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Below 900px (touch: no hover), the card crossing 60% of the viewport gets `is-on`.
 * Only a class flips; the opening itself is a CSS transition. Desktop is pure CSS. Below 900px it
 * also measures each fold into `--fold-h` (ResizeObserver), which a closed card's text drops by.
 */
export function CategoryCardsScroll({ children }: { children: ReactNode }) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!el.current || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(max-width: 899.98px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".cat", el.current);
        cards.forEach((card) =>
          ScrollTrigger.create({
            trigger: card,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => card.classList.toggle("is-on", self.isActive),
          }),
        );
        // The fold keeps its space (no layout shift, B01); a closed card lowers its text by the
        // fold's height (a transform, categories.css), so the title sits at the card's foot as
        // before instead of above an empty band.
        const folds = new ResizeObserver((entries) => {
          for (const e of entries) {
            const card = (e.target as HTMLElement).closest<HTMLElement>(".cat");
            card?.style.setProperty("--fold-h", `${(e.target as HTMLElement).offsetHeight}px`);
          }
        });
        cards.forEach((card) => {
          const fold = card.querySelector<HTMLElement>(".cat-fold");
          if (fold) folds.observe(fold);
        });
        return () => {
          folds.disconnect();
          cards.forEach((card, i) => {
            card.style.removeProperty("--fold-h");
            card.classList.toggle("is-on", i === 0);
          });
        };
      });
      return () => mm.revert();
    },
    { scope: el },
  );

  return (
    <div ref={el} className="cats" data-scroll-cards="">
      {children}
    </div>
  );
}
