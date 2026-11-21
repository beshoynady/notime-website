"use client";

import { useLocale } from "next-intl";
import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { kenBurnsOrigin, kenBurnsScale, type KenBurnsOrigin } from "@/lib/ornaments";
import { cn } from "@/lib/utils";

/**
 * A slow push-in on a still, scrubbed by scroll while the frame crosses the viewport (GSAP).
 * The inner layer owns the transform, so the image inside is untouched; the origin follows the
 * reading direction. Reduced motion: no transform at all (the image sits at its own size).
 */
export function KenBurns({ children, from = 1, to = 1.08, origin = "center", className }: { children: ReactNode; from?: number; to?: number; origin?: KenBurnsOrigin; className?: string }) {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!inner.current || prefersReducedMotion()) return;
      const el = inner.current;
      gsap.set(el, { transformOrigin: kenBurnsOrigin(origin, dir), scale: from });
      ScrollTrigger.create({
        trigger: frame.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (st) => gsap.set(el, { scale: kenBurnsScale(st.progress, from, to) }),
      });
    },
    { scope: frame, dependencies: [from, to, origin, dir] },
  );

  return (
    <div ref={frame} data-motion="ken-burns" className={cn("relative overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
