"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The page's scroll motion below the opening (GSAP owns it; one ScrollTrigger set per width in
 * gsap.matchMedia). Every target is drawn complete by the server, so without JS or under reduced
 * motion the page is its final state; the tweens start from hidden only once built (gsap.from on
 * off-screen elements, so nothing flashes).
 * - `[data-sw-draw]`: service lines draw (stroke) as their block arrives.
 * - `[data-sw-reveal]`: children rise in, staggered; the case study's checklist one line per 80 ms.
 * - proof and case-study devices assemble; the proof phone drifts a little against the laptop.
 * - `[data-sw-steps]`: the process rail fills from inline-start (or top on mobile); steps light.
 * - `[data-sw-count]`: the event counter counts up its example value; the meter fills.
 * - `[data-sw-gridlines]`: the event band's grid wipes in from inline-start.
 * - desktop: a service block crossing the viewport's middle gets `data-active` (its state label,
 *   sweep-free state change and deliverables, CSS), so a visitor who never hovers still sees them.
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
        const enter = (trigger: Element, start = "top 82%") => ({ trigger, start, once: true });

        for (const v of q(".sw-v")) {
          const paths = v.querySelectorAll("[data-sw-draw]");
          if (paths.length) gsap.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out", stagger: 0.08, scrollTrigger: enter(v, "top 85%") });
        }
        for (const el of q("[data-sw-reveal]")) {
          gsap.from(el.children, { opacity: 0, y: 18, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: enter(el) });
        }
        for (const list of q("[data-sw-checklist]")) {
          gsap.from(list.children, { opacity: 0, x: -10 * dir, duration: 0.4, ease: "power2.out", stagger: 0.08, scrollTrigger: enter(list, "top 85%") });
        }
        for (const pair of q(".sw-proof-pair, [data-sw-devices]")) {
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

        for (const wrap of q("[data-sw-steps]")) {
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

        for (const el of q<HTMLElement>("[data-sw-count]")) {
          const target = Number(el.dataset.swCount) || 0;
          const box = el.closest(".sw-v-count") ?? el;
          const counter = { v: 0 };
          const meter = box.querySelector<HTMLElement>("[data-sw-meter]");
          const tl = gsap.timeline({ scrollTrigger: enter(box, "top 80%") });
          tl.fromTo(counter, { v: 0 }, { v: target, duration: 1.6, ease: "power2.out", onUpdate: () => void (el.textContent = String(Math.round(counter.v))) });
          if (meter) tl.fromTo(meter, { scaleX: 0 }, { scaleX: Number(meter.dataset.swMeter) || 1, duration: 1.6, ease: "power2.out" }, 0);
        }
        for (const g of q("[data-sw-gridlines]")) {
          gsap.fromTo(g, { clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0%)", duration: 1.4, ease: "power2.inOut", scrollTrigger: enter(g, "top 85%") });
        }

        if (desktop) {
          for (const block of q(".sw-block")) {
            gsap.timeline({ scrollTrigger: { trigger: block, start: "top 55%", end: "bottom 45%", onToggle: (self) => block.toggleAttribute("data-active", self.isActive) } });
          }
        }
        return () => {
          for (const b of q(".sw-block")) b.removeAttribute("data-active");
          for (const s of q(".sw-step")) s.removeAttribute("data-lit");
          for (const w of q("[data-sw-steps]")) delete (w as HTMLElement).dataset.motion;
        };
      },
    );
    return () => mm.revert();
  });

  return <span ref={ref} hidden />;
}
