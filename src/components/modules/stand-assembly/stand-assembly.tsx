"use client";

import { useRef } from "react";
import { STAND } from "@/content/modules/stand-assembly";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ModuleProps } from "../types";
import { StandView } from "./view";

/**
 * II · Exhibitions & booths (spec §6 I.2): the stand assembles as the visitor scrolls, one build
 * step after another (floor, walls, counter, lighting, graphics, screen), and the matching step in
 * the list lights. GSAP scrubs whole layer groups (transform and opacity only).
 *
 * No pin (a judgment call within the spec's "at most 1 viewport"): the drawing is tall enough to
 * scrub while it crosses the viewport, and a mid-page pin would cost the anchor landings and the
 * transform-pin CLS work the majlis needed (D74). The page keeps exactly two pins: the opening and
 * the majlis. Reduced motion (and before mount): assembled, every step lit.
 */
export default function StandAssembly({ locale }: ModuleProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const drawing = el.querySelector<HTMLElement>(".sa-drawing")!;
        const steps = Array.from(el.querySelectorAll<HTMLElement>(".sa-step"));
        const ids = STAND.parts.map((p) => p.id);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: drawing,
            start: "top 85%",
            end: "bottom 55%",
            scrub: true,
            onUpdate: (self) => steps.forEach((s, i) => s.toggleAttribute("data-lit", self.progress >= i / steps.length + 0.02)),
          },
        });
        ids.forEach((id, i) => {
          const g = drawing.querySelector(`[data-part="${id}"]`);
          if (g) tl.fromTo(g, { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, i);
        });
        return () => {
          for (const s of steps) s.setAttribute("data-lit", "");
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <StandView locale={locale} />
    </div>
  );
}
