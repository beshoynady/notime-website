"use client";

import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Scrubbed vertical parallax. The inner layer is oversized by `amount`% top and bottom
 * so no gap shows at either end of the travel. Static under reduced motion.
 */
export function Parallax({ children, amount = 12, className }: { children: ReactNode; amount?: number; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!inner.current || prefersReducedMotion()) return;
      gsap.fromTo(
        inner.current,
        { yPercent: -amount },
        { yPercent: amount, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: frame, dependencies: [amount] },
  );

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-x-0" style={{ top: `-${amount}%`, bottom: `-${amount}%` }}>
        {children}
      </div>
    </div>
  );
}
