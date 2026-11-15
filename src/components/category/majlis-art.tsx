"use client";

import { useRef } from "react";
import { anchorOffset } from "@/components/providers/anchor-scroll";
import type { SceneConfig, Viewport } from "@/content/scenes";
import { gsap, useGSAP } from "@/lib/gsap";
import { pinLength, sceneMode } from "@/lib/scene-math";

const C = { night: "#0D0805", cocoa: "#634731", taupe: "#BB9A79", champ: "#EAD4AB", ivory: "#F5E9D3" };

/**
 * The majlis's foreground (section V; storyboard Act 2): a brass dallah at inline-end pouring
 * Arabic coffee into a small cup toward inline-start, and the steam. One drawing, so the pour
 * always meets the cup at any width; it mirrors in Arabic (evening.css flips the svg).
 *
 * GSAP scrubs it on the scene's own scroll range (the same start and end as SceneDirector: the
 * 0.6 vh pin under the header on desktop, the crossing on mobile): the pour draws during the
 * "pour" shot, the steam rises during the "bloom". Its own elements only; the scene's layers stay
 * SceneDirector's. Server render and reduced motion: the end frame (poured, steaming).
 */
export function MajlisArt({ scene }: { scene: SceneConfig }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const art = ref.current;
    const root = art?.closest<HTMLElement>(".scene");
    if (!art || !root) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const viewport: Viewport = ctx.conditions?.desktop ? "desktop" : "mobile";
        const pass = sceneMode(scene, viewport) === "pass";
        const pin = pass ? 1 : pinLength(scene.shots, viewport);
        if (pin === 0) return;
        const range = (id: string): [number, number] => scene.shots.find((s) => s.id === id)?.[viewport] ?? [0, pin];
        const [p0, p1] = range("pour");
        const [b0, b1] = range("bloom");
        art.dataset.motion = "";
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            ...(pass ? { start: "top bottom", end: "bottom top" } : { start: () => `top ${anchorOffset(root)}px`, end: () => `+=${pin * innerHeight}` }),
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        tl.set({}, {}, pin);
        tl.fromTo(art.querySelector(".mj-pour"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: p1 - p0, ease: "power1.in" }, p0);
        tl.fromTo(art.querySelector(".mj-dallah"), { rotate: 8 }, { rotate: 0, duration: (p1 - p0) * 0.6, ease: "power2.out", svgOrigin: "500 270" }, p0);
        tl.fromTo(art.querySelectorAll(".mj-steam"), { opacity: 0, y: 10 }, { opacity: 0.8, y: 0, duration: b1 - b0, stagger: (b1 - b0) * 0.15 }, b0);
        return () => {
          delete art.dataset.motion;
        };
      },
    );
    return () => mm.revert();
  });

  return (
    <div ref={ref} className="mj-art" aria-hidden="true">
      <svg viewBox="0 0 600 440">
        <defs>
          <linearGradient id="mj-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.ivory} />
            <stop offset=".35" stopColor={C.champ} />
            <stop offset=".75" stopColor={C.taupe} />
            <stop offset="1" stopColor={C.cocoa} />
          </linearGradient>
        </defs>
        {/* the tray and the cup */}
        <ellipse cx="282" cy="400" rx="96" ry="10" fill="none" stroke={C.taupe} strokeWidth="1.2" opacity=".7" />
        <ellipse cx="282" cy="392" rx="40" ry="5" fill={C.night} opacity=".5" />
        <path d="M254 352H310L301 386C299 393 265 393 263 386Z" fill={C.ivory} />
        <path d="M262 362H302" stroke={C.taupe} strokeWidth="1.5" opacity=".7" />
        <ellipse cx="282" cy="353" rx="27" ry="4.5" fill={C.taupe} />
        {/* the pour: golden Arabic coffee, from the beak to the cup */}
        <path className="mj-pour" d="M336 227C322 240 296 292 285 351" fill="none" stroke={C.champ} strokeWidth="3.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" />
        {/* the steam */}
        <g fill="none" stroke={C.ivory} strokeWidth="1.5" strokeLinecap="round" opacity=".45">
          <path className="mj-steam" d="M262 340c-9-14 9-22 0-36s9-22 0-34" />
          <path className="mj-steam" d="M250 344c-8-12 8-20 0-32s8-20 0-30" />
          <path className="mj-steam" d="M274 338c-9-14 9-24 0-38s9-22 0-32" />
        </g>
        {/* the dallah, tilted to pour */}
        <g className="mj-dallah">
          <g transform="translate(360 0) rotate(-35 120 270)">
            <path d="M116 176C90 166 56 156 30 150L26 156C54 166 86 184 112 198Z" fill="url(#mj-brass)" />
            <path d="M140 108C118 140 104 168 112 200C116 228 102 252 98 270H202C198 252 184 228 188 200C196 168 182 140 160 108Z" fill="url(#mj-brass)" />
            <path d="M138 74C136 92 140 100 144 108H156C160 100 164 92 162 74Z" fill={C.taupe} />
            <path d="M132 70L150 30L168 70Z" fill="url(#mj-brass)" />
            <ellipse cx="150" cy="71" rx="22" ry="5" fill={C.taupe} />
            <circle cx="150" cy="24" r="6" fill={C.champ} />
            <ellipse cx="150" cy="270" rx="52" ry="6" fill={C.cocoa} />
            <path d="M186 124C232 130 236 214 196 236" fill="none" stroke={C.taupe} strokeWidth="6" strokeLinecap="round" />
            <path d="M126 150C118 176 118 196 124 214M120 230C116 246 112 258 110 266" fill="none" stroke={C.ivory} strokeWidth="2" opacity=".55" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
