"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Below this height the stage can't show all four steps under the header, so it doesn't pin. */
const PROCESS_PIN_MIN_H = 640; // globals.css (.process-pin) and process.css use the same value
const MOTION = "(prefers-reduced-motion: no-preference)";
const DESKTOP = `(min-width: 900px) and (min-height: ${PROCESS_PIN_MIN_H}px) and ${MOTION}`;
const UNPINNED = `(max-width: 899.98px) and ${MOTION}, (max-height: ${PROCESS_PIN_MIN_H - 0.02}px) and ${MOTION}`;

/**
 * The scroll build for How we work (GSAP owns it; nothing here is touched by Motion).
 * - Desktop: the section pins for 1 viewport (the plan's limit); the rail draws from the
 *   reading start and the steps rise in one after another, scrubbed.
 * - Mobile, and a desktop screen too short for the stage (owner report 2026-11-20: the steps
 *   stayed cut off at the bottom of a 1366×768 laptop for the whole pin): no pin; each step
 *   rises in as it enters.
 * - Reduced motion (or no JS): nothing runs, so the server's complete state stays.
 */
export function ProcessScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const root = ref.current!;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=100%",
            pin: true,
            // The server-rendered wrapper below holds the reserved distance (globals.css).
            pinSpacer: root.parentElement ?? undefined,
            // The wrapper is display: flex (D168), and ScrollTrigger drops pin spacing by default
            // under a flex parent; the spacing it always had (padding: the reserved distance) stays.
            pinSpacing: true,
            scrub: 0.6,
          },
        });
        tl.fromTo(root.querySelector(".process-rail-fill"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 4 }, 0);
        root.querySelectorAll(".process-step").forEach((step, i) => {
          tl.fromTo(step, { autoAlpha: 0.15, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, i * 1.05);
        });
      });
      mm.add(UNPINNED, () => {
        ref.current!.querySelectorAll(".process-step").forEach((step) => {
          gsap.fromTo(
            step,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: step, start: "top 85%", toggleActions: "play none none none" } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div className="process-pin">
      <div ref={ref} className="process-stage">
        {children}
      </div>
    </div>
  );
}
