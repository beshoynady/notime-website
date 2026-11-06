"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ease, microTransition } from "@/lib/motion";

const FINE = "(hover: hover) and (pointer: fine)";
const HOT = "a, button, summary, [data-cursor], img, video";
const SIZE = 64;
const REST = 10 / SIZE;
/** Follow lag: slightly longer than the micro token so the dot trails the native cursor. */
const FOLLOW = { duration: 0.35, ease: ease.expoOut } as const;

/**
 * Cursor follower for mouse users: a 10px champagne dot (difference blend) that grows to
 * 64px over interactive elements. The native cursor stays visible. Not mounted on touch
 * devices or under reduced motion. Motion values only: React never re-renders per event.
 */
export function CustomCursor() {
  const isFine = useMediaQuery(FINE);
  const reduced = useReducedMotion();
  if (!isFine || reduced) return null;
  return <Follower />;
}

function Follower() {
  const x = useMotionValue(-SIZE);
  const y = useMotionValue(-SIZE);
  const scale = useMotionValue(REST);
  const opacity = useMotionValue(0);

  useEffect(() => {
    let hot = false;
    let shown = false;
    const show = (on: boolean) => {
      if (on === shown) return;
      shown = on;
      animate(opacity, on ? 1 : 0, microTransition);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      animate(x, e.clientX - SIZE / 2, FOLLOW);
      animate(y, e.clientY - SIZE / 2, FOLLOW);
      show(true);
    };
    const onOver = (e: PointerEvent) => {
      const next = !!(e.target as Element | null)?.closest?.(HOT);
      if (next === hot) return;
      hot = next;
      animate(scale, hot ? 1 : REST, FOLLOW);
    };
    const onLeave = () => show(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y, scale, opacity]);

  return (
    // dir="ltr": the follower is positioned from the viewport's physical top-left corner
    // (clientX/Y), so its origin must not flip in RTL. overflow-hidden keeps it from ever
    // widening the page. The blend mode sits on this wrapper because it is the stacking
    // context: on the dot itself it would only blend with this empty layer.
    <div aria-hidden="true" dir="ltr" className="pointer-events-none fixed inset-0 z-[80] overflow-hidden mix-blend-difference">
      <motion.div
        className="absolute start-0 top-0 rounded-full bg-champagne"
        style={{ x, y, scale, opacity, width: SIZE, height: SIZE }}
      />
    </div>
  );
}
