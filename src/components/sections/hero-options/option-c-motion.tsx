"use client";

import { useMotionValueEvent, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Option C's motion. Motion (pointer, desktop): a spring carries the light to the cursor, written
 * as --sx/--sy on .hx-c-spot. GSAP (scroll): the bezel (.hx-c-turn) turns as the hero leaves, and on
 * phones the light (.hx-c-spot-m, its own wrapper) travels down the engraving with the scroll.
 * The second hand's sweep to 12 on load is CSS. Reduced motion: none of it; the light rests on 12.
 */
export function OptionCMotion() {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0.42, { stiffness: 60, damping: 18 });
  const y = useSpring(0.3, { stiffness: 60, damping: 18 });
  const spot = () => ref.current?.closest(".hx-c")?.querySelector<HTMLElement>(".hx-c-spot");
  useMotionValueEvent(x, "change", (v) => spot()?.style.setProperty("--sx", `${(v * 100).toFixed(2)}%`));
  useMotionValueEvent(y, "change", (v) => spot()?.style.setProperty("--sy", `${(v * 100).toFixed(2)}%`));

  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>(".hx-c");
    if (!section || prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const face = section.querySelector<HTMLElement>(".hx-c-turn")!;
    const move = (e: PointerEvent) => {
      const r = face.getBoundingClientRect();
      x.set((e.clientX - r.left) / r.width);
      y.set((e.clientY - r.top) / r.height);
    };
    section.addEventListener("pointermove", move);
    return () => section.removeEventListener("pointermove", move);
  }, [x, y]);

  useGSAP(() => {
    const section = ref.current?.closest<HTMLElement>(".hx-c");
    if (!section || prefersReducedMotion()) return;
    const st = { trigger: section, start: "top top", end: "bottom top", scrub: true };
    gsap.to(section.querySelector(".hx-c-turn"), { rotation: -24, ease: "none", scrollTrigger: st });
    const mm = gsap.matchMedia();
    mm.add("(hover: none), (pointer: coarse)", () => {
      gsap.fromTo(
        section.querySelector(".hx-c-spot-m"),
        { "--mx": "38%", "--my": "8%" },
        { "--mx": "12%", "--my": "62%", ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom 30%", scrub: true } },
      );
    });
    return () => mm.revert();
  }, []);

  return <span ref={ref} hidden />;
}
