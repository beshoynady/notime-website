"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { ModuleProps } from "../types";
import { AgendaView } from "./view";

/**
 * I · Conferences & summits (spec §6 I.1): the day builds slot by slot. GSAP owns it, with no pin:
 * the rail fills as the list scrubs past the reading line (62% of the viewport), and each slot
 * lights as it reaches the line and dims again if the visitor scrolls back above it. Nothing to
 * operate, so no live region: the slots are a plain ordered list, all of it readable at any time.
 * Reduced motion (and before mount): every slot lit, the rail full.
 */
export default function AgendaTimeline({ locale }: ModuleProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const list = el.querySelector<HTMLElement>(".ag-list")!;
        const slots = Array.from(el.querySelectorAll<HTMLElement>(".ag-slot"));
        const fill = el.querySelector<HTMLElement>(".ag-fill")!;
        gsap.fromTo(fill, { "--ag-fill": 0 }, { "--ag-fill": 1, ease: "none", scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 62%", scrub: true } });
        for (const slot of slots) {
          slot.removeAttribute("data-lit");
          // Lit from the moment it reaches the line until the visitor scrolls back above it.
          ScrollTrigger.create({ trigger: slot, start: "top 62%", end: "max", onToggle: (self) => slot.toggleAttribute("data-lit", self.isActive) });
        }
        return () => {
          for (const slot of slots) slot.setAttribute("data-lit", "");
          fill.style.removeProperty("--ag-fill");
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <AgendaView locale={locale} />
    </div>
  );
}
