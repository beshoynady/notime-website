"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * The Evening's scroll motion in Act 2 (GSAP owns it; themes/evening.css styles it):
 * - each service section's own light (`.svc-light`) comes on once as the section arrives:
 *   opacity and scale, 1.4 s, expo.out (spec §5.1: light blooms, never a blur);
 * - desktop: the section crossing the viewport's middle gets `data-active`, so the hover reveal
 *   (its light swells, a light sweep runs along the deliverables and they rise in; CSS, the
 *   2026-11-11 spec) also plays for a visitor who never hovers, and on keyboard focus.
 * Reduced motion: nothing is built, every light is on and every deliverable shows (the still).
 */
export function EveningDirector() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const page = ref.current?.closest<HTMLElement>("main");
    if (!page) return;
    const sections = Array.from(page.querySelectorAll<HTMLElement>(".cat-body .svc"));
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        for (const svc of sections) {
          const light = svc.querySelector<HTMLElement>(".svc-light");
          if (light) {
            ScrollTrigger.create({
              trigger: svc,
              start: "top 75%",
              once: true,
              onEnter: () => {
                light.setAttribute("data-lit", "");
                gsap.fromTo(light, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.4, ease: "expo.out" });
              },
            });
          }
          if (ctx.conditions?.desktop) {
            ScrollTrigger.create({ trigger: svc, start: "top 55%", end: "bottom 45%", onToggle: (self) => svc.toggleAttribute("data-active", self.isActive) });
          }
        }
        return () => {
          for (const svc of sections) {
            svc.removeAttribute("data-active");
            svc.querySelector(".svc-light")?.setAttribute("data-lit", "");
          }
        };
      },
    );
    return () => mm.revert();
  });

  return <span ref={ref} hidden />;
}
