"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Scrubs the strip's track towards inline-end while its stage is held (D109). The hold is CSS
 * (sticky inside a wrapper sized from the server render, photo-strip.css), so GSAP pins nothing
 * and adds no spacer: it only moves `.pstrip-track` (x), from its start to its last frame (the
 * stage clips, never the track). RTL moves it the other way. Desktop with motion only; elsewhere the track is a native swipe row.
 */
export function PhotoStripMotion() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const root = ref.current?.closest<HTMLElement>(".pstrip");
    const track = root?.querySelector<HTMLElement>(".pstrip-track");
    if (!root || !track) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const dir = document.documentElement.dir === "rtl" ? 1 : -1;
      // From the first frame's outer edge to the last's, plus the padding at both ends, minus the
      // track's box: the same in both directions (rects, not scroll offsets).
      const travel = () => {
        const frames = track.children;
        if (!frames.length) return 0;
        const a = frames[0].getBoundingClientRect();
        const b = frames[frames.length - 1].getBoundingClientRect();
        const pad = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
        return Math.max(0, Math.max(a.right, b.right) - Math.min(a.left, b.left) + 2 * pad - track.clientWidth);
      };
      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => dir * travel(),
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
        },
      );
    });
    return () => mm.revert();
  });
  return <span ref={ref} hidden />;
}
