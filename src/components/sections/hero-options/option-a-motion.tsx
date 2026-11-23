"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";

/** Where each card starts, in % of the stage (index = category order); it ends where the CSS puts it. */
const START_DESKTOP = [
  [50, 124, 4],
  [-12, 6, -9],
  [-14, 98, 8],
  [112, 4, 10],
  [114, 96, -7],
] as const;
const START_PHONE = [
  [50, -14, 0],
  [-20, 6, -8],
  [-24, 30, 8],
  [124, 4, 9],
  [128, 28, -8],
] as const;
/** The order they arrive in: the corners first, Events last, on 12, at zero. */
const ORDER = [1, 3, 2, 4, 0];

/**
 * Option A's motion (GSAP owns it all; nothing here uses Motion). The cards travel from outside
 * the frame to the dial, one per second of the countdown: the second hand steps from -30° to 0
 * and the timecode from 05 to 00. Desktop scrubs it with the scroll through a 220vh section with a
 * sticky stage; phones play it once on load. Reduced motion: nothing runs, the CSS end state shows.
 */
export function OptionAMotion() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const section = ref.current?.closest<HTMLElement>(".hx-a");
    if (!section || prefersReducedMotion()) {
      section?.setAttribute("data-ready", "");
      return;
    }
    const stage = section.querySelector<HTMLElement>(".hx-a-stage")!;
    const cards = gsap.utils.toArray<HTMLElement>(".hx-a-card", section);
    const hand = section.querySelector(".hx-a-dial .hx-dial-second");
    const ring = section.querySelector(".hx-a-dial .hx-dial-ring");
    const tc = section.querySelector(".hx-a-tc-s")!;
    const rtl = document.documentElement.dir === "rtl";
    const mm = gsap.matchMedia();

    const build = (start: typeof START_DESKTOP | typeof START_PHONE) => {
      const box = stage.getBoundingClientRect();
      cards.forEach((card, i) => {
        const [sx, sy, r] = start[i];
        const c = card.getBoundingClientRect();
        // From the card's centre where the CSS puts it; in Arabic they come in from the mirrored side.
        const x = ((rtl ? 100 - sx : sx) / 100) * box.width - (c.left + c.width / 2 - box.left);
        const y = (sy / 100) * box.height - (c.top + c.height / 2 - box.top);
        gsap.set(card, { x, y, rotation: rtl ? -r : r, scale: 1.35 });
      });
      gsap.set(hand, { rotation: -30, transformOrigin: "300px 300px" });
      gsap.set(ring, { opacity: 0.35 });
      tc.textContent = "05";
      section.setAttribute("data-ready", "");
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      ORDER.forEach((i, k) => {
        tl.to(cards[i], { x: 0, y: 0, rotation: 0, scale: 1, duration: 1 }, k * 0.8);
        tl.to(hand, { rotation: -30 + (k + 1) * 6, duration: 0.12, ease: "back.out(3)" }, k * 0.8 + 0.88);
        tl.call(() => (tc.textContent = String(4 - k).padStart(2, "0")), undefined, k * 0.8 + 0.9);
      });
      tl.to(ring, { opacity: 1, duration: 0.6 }, ">-0.1");
      return tl;
    };

    mm.add("(min-width: 900px)", () => {
      const tl = build(START_DESKTOP);
      // Scrubbed by the scroll through the tall section; the text count follows the playhead both ways.
      tl.eventCallback("onUpdate", () => {
        const left = Math.max(0, 5 - Math.floor(tl.progress() * 5.6));
        tc.textContent = String(left).padStart(2, "0");
      });
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.8 } }).add(tl.paused(false));
    });
    mm.add("(max-width: 899.98px)", () => {
      build(START_PHONE).timeScale(2.2).delay(0.25);
    });
    return () => mm.revert();
  }, []);
  return <span ref={ref} hidden />;
}
