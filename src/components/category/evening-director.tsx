"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * The Evening's scroll motion in Act 2 (GSAP owns it; themes/evening.css styles it):
 * desktop: the section crossing the viewport's middle gets `data-active`, so the hover reveal (a
 * light sweep runs along the deliverables and they rise in; CSS, the 2026-11-11 spec) also plays
 * for a visitor who never hovers, and on keyboard focus. (Each section's own light left when every
 * section became a photo scene, D153.) Reduced motion: nothing is built, every deliverable shows.
 */
export function EveningDirector() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const page = ref.current?.closest<HTMLElement>("main");
    if (!page) return;
    const sections = Array.from(page.querySelectorAll<HTMLElement>(".cat-body .svc"));
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      for (const svc of sections) {
        ScrollTrigger.create({ trigger: svc, start: "top 55%", end: "bottom 45%", onToggle: (self) => svc.toggleAttribute("data-active", self.isActive) });
      }
      return () => {
        for (const svc of sections) svc.removeAttribute("data-active");
      };
    });
    return () => mm.revert();
  });

  return <span ref={ref} hidden />;
}
