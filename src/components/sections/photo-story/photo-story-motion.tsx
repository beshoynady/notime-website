"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The split screen's motion (D109): per photo, a mask wipe that opens from the block centre as
 * the photo enters, and the image settling from a 1.12 push-in, both scrubbed to its crossing.
 * GSAP owns `.ps-mask` (clip-path) and `.ps-push` (scale), two boxes, never shared. Built in
 * gsap.matchMedia, so reduced motion builds nothing and the photos are plainly there.
 */
export function PhotoStoryMotion() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const root = ref.current?.closest<HTMLElement>(".ps");
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      for (const fig of root.querySelectorAll<HTMLElement>(".ps-photo")) {
        const mask = fig.querySelector<HTMLElement>(".ps-mask")!;
        const push = fig.querySelector<HTMLElement>(".ps-push")!;
        const st = { trigger: fig, start: "top bottom", end: "center 55%", scrub: true };
        gsap.fromTo(mask, { clipPath: "inset(22% 8% 22% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st });
        gsap.fromTo(push, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true } });
      }
    });
    return () => mm.revert();
  });
  return <span ref={ref} hidden />;
}
