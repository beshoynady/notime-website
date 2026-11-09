"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useLocale } from "next-intl";
import type { PointerEvent, ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import "@/components/ornaments/ornaments.css";

const FINE = "(hover: hover) and (pointer: fine)";
const SWEEP = { duration: 0.9, ease: ease.expoOut } as const;

/**
 * A pale champagne sheen that crosses a card's media once on hover, in the reading direction
 * (Motion · micro). Fine pointers only: on touch the sheen isn't rendered at all. Reduced motion:
 * nothing. The sheen is its own layer, so the media and any GSAP on it are untouched.
 */
export function HoverSweep({ children, className }: { children: ReactNode; className?: string }) {
  const fine = useMediaQuery(FINE);
  const reduced = useReducedMotion();
  const rtl = useLocale() === "ar";
  const p = useMotionValue(0); // 0 → 1 across the card
  // The sheen is 60% of the card wide: -110% starts it clear of the start edge, 180% ends it clear
  // of the far edge. In Arabic it sits at the right and travels the other way.
  const x = useTransform(p, (v) => `${rtl ? 110 - v * 290 : -110 + v * 290}%`);
  const on = fine && !reduced;

  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    p.jump(0);
    animate(p, 1, SWEEP);
  };

  return (
    <div data-motion="hover-sweep" className={cn("relative overflow-hidden", className)} onPointerEnter={on ? onEnter : undefined}>
      {children}
      {on && <motion.span aria-hidden="true" className="hover-sweep-sheen" style={{ x }} />}
    </div>
  );
}
