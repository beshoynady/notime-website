"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { OPENING_SHOTS, shotIndexAt } from "@/lib/interface-shots";

/**
 * Scrubs the Interface opening (GSAP owns it; one timeline per width in gsap.matchMedia).
 * Desktop: pinned for 2.0 vh, four shots: the caret blinks (CSS), the wireframe draws, the UI
 * fills and the state labels arrive, then the laptop's bezel closes round it and the phone slides
 * in from inline-end. Mobile: no pin; it plays while the stage crosses the viewport and ends on the
 * phone alone. Reduced motion: nothing is built; the server-rendered still stays.
 *
 * Owners: every tweened element here is GSAP's alone (the stage has no Motion).
 */
export function InterfaceDirector() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = ref.current?.closest<HTMLElement>(".sw-op");
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const desktop = !!ctx.conditions?.desktop;
        const shots = OPENING_SHOTS[desktop ? "desktop" : "mobile"];
        const total = shots[shots.length - 1][1];
        const dir = document.documentElement.dir === "rtl" ? -1 : 1;
        const stage = q(".sw-op-stage")[0];

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: desktop
            ? {
                trigger: root,
                start: "top top",
                end: () => `+=${total * innerHeight}`,
                pin: true,
                pinSpacer: root.parentElement?.classList.contains("scene-pin") ? root.parentElement : undefined,
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => setShot(root, shotIndexAt(self.progress * total, shots)),
              }
            : {
                trigger: stage,
                start: "top 85%",
                end: "bottom 35%",
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => setShot(root, shotIndexAt(self.progress * total, shots)),
              },
        });
        tl.set({}, {}, total);

        const [s1, s2, s3, s4] = shots;
        // Shot 2: the caret stretches into the first line; the wireframe draws, block by block.
        tl.to(q(".sw-caret"), { scaleX: 14, opacity: 0, duration: 0.12 }, s1[1] - 0.06);
        tl.fromTo(q(".sw-wire rect"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: (s2[1] - s2[0]) * 0.7, stagger: 0.05 }, s2[0]);
        tl.fromTo(q(".sw-wire-label"), { opacity: 0 }, { opacity: 1, duration: 0.1, stagger: 0.06 }, s2[0] + 0.1);
        // Shot 3: each outlined block fills in place; the wireframe falls back to a trace.
        tl.fromTo(q(".sw-art .sw-ui > *"), { opacity: 0 }, { opacity: 1, duration: (s3[1] - s3[0]) * 0.5, stagger: 0.06 }, s3[0]);
        tl.to(q(".sw-wire, .sw-wire-label"), { opacity: 0.18, duration: 0.15 }, s3[0] + 0.1);
        tl.fromTo(q(".sw-ui-states"), { opacity: 0 }, { opacity: 1, duration: 0.12 }, s3[0] + (s3[1] - s3[0]) * 0.55);
        // Shot 4: the UI shrinks into a screen; the devices arrive; the light comes up.
        const d4 = (s4[1] - s4[0]) * 0.8;
        if (desktop) {
          tl.fromTo(q(".sw-art"), { scale: 1.1 }, { scale: 1, duration: d4 }, s4[0]);
          tl.fromTo(q(".sw-op-laptop"), { "--bezel": 0 }, { "--bezel": 1, duration: d4 }, s4[0]);
          tl.fromTo(q(".sw-laptop-base"), { opacity: 0 }, { opacity: 1, duration: d4 }, s4[0]);
          tl.fromTo(q(".sw-op-phone"), { xPercent: 40 * dir, opacity: 0 }, { xPercent: 0, opacity: 1, duration: d4, ease: "power2.out" }, s4[0] + 0.08);
        } else {
          tl.to(q(".sw-op-laptop"), { opacity: 0, scale: 0.92, duration: d4 * 0.6 }, s4[0]);
          tl.fromTo(q(".sw-op-phone"), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: d4, ease: "power2.out" }, s4[0] + 0.05);
        }
        tl.fromTo(q(".sw-op-glow"), { opacity: 0 }, { opacity: 1, duration: d4 }, s4[0]);
        tl.fromTo(q(".sw-live"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, s4[0] + d4);

        // Lines: the one for the shot in play, cross-faded at the boundaries.
        const lines = q(".sw-op-line");
        gsap.set(lines, { autoAlpha: 0 });
        gsap.set(lines[0], { autoAlpha: 1 });
        shots.forEach((s, i) => {
          const line = lines[s[2]];
          if (i === 0 || !line || s[2] === shots[i - 1][2]) return;
          const prev = lines[shots[i - 1][2]];
          tl.to(prev, { autoAlpha: 0, duration: 0.05 }, s[0] - 0.04);
          tl.fromTo(line, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, s[0]);
        });

        root.dataset.motion = desktop ? "desktop" : "mobile";
        return () => {
          delete root.dataset.motion;
          root.dataset.shot = "0";
        };
      },
    );
    return () => mm.revert();
  });

  return <span ref={ref} hidden />;
}

function setShot(root: HTMLElement, i: number) {
  const v = String(i);
  if (root.dataset.shot !== v) root.dataset.shot = v;
}
