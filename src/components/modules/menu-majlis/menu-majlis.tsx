"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ModuleProps } from "../types";
import { MenuView } from "./view";

/**
 * V · Catering & heritage hospitality (spec §6 I.5): the offering as a printed menu, no prices.
 * GSAP, once, on scroll entry: the dallah draws in stroke by stroke and the menu's sections rise
 * in after it. No loop, nothing to operate. Reduced motion (and before mount): drawn and in place.
 */
export default function MenuMajlis({ locale }: ModuleProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || el.getBoundingClientRect().top < innerHeight * 0.85) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" } });
        tl.fromTo(el.querySelectorAll(".mm-stroke"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.18 });
        tl.from(el.querySelectorAll(".mm-sec"), { opacity: 0, y: 12, duration: 0.8, ease: "expo.out", stagger: 0.08 }, 0.3);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <MenuView locale={locale} />
    </div>
  );
}
