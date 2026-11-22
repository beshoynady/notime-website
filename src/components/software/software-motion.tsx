"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The page's scroll motion below the opening (GSAP owns it; one ScrollTrigger set per width in
 * gsap.matchMedia). Every target is drawn complete by the server, so without JS or under reduced
 * motion the page is its final state; the tweens start from hidden only once built (gsap.from on
 * off-screen elements, so nothing flashes).
 * - `[data-sw-reveal]`: children rise in, staggered.
 * - the proof devices assemble; the proof phone drifts a little against the laptop.
 * - `[data-sw-steps]`: the process rail fills from inline-start (or top on mobile); steps light.
 * - `[data-sw-gridlines]`: the event band's grid wipes in from inline-start.
 * Hover and focus states are CSS on other elements; Motion owns only the proof toggle, its light,
 * the interest disclosure and the hover sweep (never these targets).
 */
export function SoftwareMotion() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = ref.current?.closest<HTMLElement>(".sw-page");
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
        const rtl = document.documentElement.dir === "rtl";
        const dir = rtl ? -1 : 1;
        const enter = (trigger: Element, start = "top 82%") => ({ trigger, start, toggleActions: "play none none none" });

        for (const el of q("[data-sw-reveal]")) {
          gsap.from(el.children, { opacity: 0, y: 18, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: enter(el) });
        }
        for (const pair of q(".sw-proof-pair")) {
          const laptop = pair.querySelector(".sw-laptop");
          const phone = pair.querySelector(".sw-phone");
          const tl = gsap.timeline({ scrollTrigger: enter(pair, "top 85%") });
          if (laptop) tl.from(laptop, { opacity: 0, y: 28, duration: 0.9, ease: "power3.out" });
          if (phone) tl.from(phone, { opacity: 0, xPercent: 18 * dir, duration: 0.9, ease: "power3.out" }, 0.15);
        }
        if (desktop) {
          // A light parallax: the proof phones drift up against their laptops (their wrappers, so the entrance above keeps its own element).
          for (const pane of q(".sw-proof-pane")) {
            gsap.fromTo(pane.querySelector(".sw-proof-pair"), { y: 0 }, { y: -10, ease: "none", scrollTrigger: { trigger: pane, start: "top bottom", end: "bottom top", scrub: true } });
          }
        }

        // The rail runs on desktop only: on a phone the steps are a sideways row (D161).
        for (const wrap of desktop ? q("[data-sw-steps]") : []) {
          const fill = wrap.querySelector(".sw-steps-fill");
          const steps = Array.from(wrap.querySelectorAll<HTMLElement>(".sw-step"));
          if (!fill) continue;
          gsap.fromTo(
            fill,
            desktop ? { scaleX: 0 } : { scaleY: 0 },
            {
              ...(desktop ? { scaleX: 1 } : { scaleY: 1 }),
              ease: "none",
              scrollTrigger: {
                trigger: wrap,
                start: "top 75%",
                end: "bottom 55%",
                scrub: true,
                onUpdate: (self) => steps.forEach((s, i) => s.toggleAttribute("data-lit", self.progress >= i / steps.length)),
              },
            },
          );
          wrap.dataset.motion = "";
        }

        for (const g of q("[data-sw-gridlines]")) {
          gsap.fromTo(g, { clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0%)", duration: 1.4, ease: "power2.inOut", scrollTrigger: enter(g, "top 85%") });
        }

        return () => {
          for (const s of q(".sw-step")) s.removeAttribute("data-lit");
          for (const w of q("[data-sw-steps]")) delete (w as HTMLElement).dataset.motion;
        };
      },
    );
    return () => mm.revert();
  });

  return <span ref={ref} hidden />;
}
