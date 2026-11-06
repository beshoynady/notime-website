"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ease } from "@/lib/motion";

const FOLLOW = { duration: 0.5, ease: ease.expoOut } as const; // tween, never spring

/**
 * Magnetic pull toward the pointer (Motion · micro). Fine pointers only; the
 * wrapper owns the transform, so the child (e.g. a Button) stays untouched.
 */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    animate(x, (e.clientX - (r.left + r.width / 2)) * strength, FOLLOW);
    animate(y, (e.clientY - (r.top + r.height / 2)) * strength, FOLLOW);
  };
  const onLeave = () => {
    animate(x, 0, FOLLOW);
    animate(y, 0, FOLLOW);
  };

  return (
    <motion.div ref={ref} className={className} style={{ x, y, display: "inline-block" }} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </motion.div>
  );
}
