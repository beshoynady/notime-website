"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motionTokens } from "@/lib/motion";
import { tickAngle } from "@/lib/ornaments";
import { cn } from "@/lib/utils";
import "./ornaments.css";

const TICKS = Array.from({ length: 12 }, (_, i) => i);

/**
 * A 12-tick dial for an eyebrow: the house's name is a clock. Its hand points at the section's
 * place on the page (30° per section). When the section scrolls in, the hand steps from the
 * previous tick to this one (GSAP, once). Reduced motion: the hand is drawn at its tick.
 * `at` fixes the tick; otherwise it is the section's index among the page's sections.
 */
export function TickMarker({ at, className }: { at?: number; className?: string }) {
  const root = useRef<SVGSVGElement>(null);
  const hand = useRef<SVGLineElement>(null);

  useGSAP(
    () => {
      const svg = root.current;
      if (!svg || !hand.current) return;
      const section = svg.closest("section");
      const sections = [...document.querySelectorAll("main section")];
      const index = at ?? Math.max(0, section ? sections.indexOf(section) : 0);
      const angle = tickAngle(index);
      svg.dataset.tick = String(index % 12);
      gsap.set(hand.current, { rotation: angle, svgOrigin: "12 12" });
      if (prefersReducedMotion()) return;
      gsap.set(hand.current, { rotation: angle - 30 });
      ScrollTrigger.create({
        trigger: section ?? svg,
        start: "top 80%",
        once: true,
        onEnter: () => gsap.to(hand.current, { rotation: angle, duration: motionTokens.base.duration, ease: motionTokens.base.gsapEase }),
      });
    },
    { scope: root, dependencies: [at] },
  );

  return (
    <svg ref={root} aria-hidden="true" data-ornament="tick" viewBox="0 0 24 24" className={cn("tick-marker", className)}>
      {TICKS.map((i) => (
        <line key={i} x1="12" y1={i % 3 === 0 ? 1.5 : 2.5} x2="12" y2="4.5" transform={`rotate(${i * 30} 12 12)`} className="tick" />
      ))}
      <line ref={hand} x1="12" y1="12" x2="12" y2="6" className="tick-hand" />
      <circle cx="12" cy="12" r="1.2" className="tick-pin" />
    </svg>
  );
}
