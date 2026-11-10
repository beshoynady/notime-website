"use client";

import { useRef } from "react";
import { anchorOffset } from "@/components/providers/anchor-scroll";
import type { SceneConfig, Viewport } from "@/content/scenes";
import { gsap, useGSAP } from "@/lib/gsap";
import { enterFrom, layerDrift, lineSpans, pinLength, sceneMode, shotAt } from "@/lib/scene-math";

/**
 * Cross-fade of two shot lines, in vh of scroll, centred on the shot boundary: the next line comes
 * in while the last one goes, so there is never a stretch without a legible line (review D73:
 * separate 0.08 vh fade-out and fade-in left 26% of the desktop pin with no line at full opacity).
 */
const LINE_XFADE = 0.06;
/** Scrubbed eases: entrances settle, light swells (the Evening, spec §5.1). */
const ENTER_EASE = "power2.out";
const LIGHT_EASE = "sine.inOut";

/**
 * Scrubs a LayeredScene (GSAP owns it, CLAUDE.md): pins the scene for its pin length and plays
 * the shots on one timeline whose time is the vh scrolled. Where the scene passes (`mode`, per
 * width) it is not pinned: its timeline runs 0–1 while it crosses the viewport. Built per width
 * in gsap.matchMedia; under reduced motion nothing is built and the still stays.
 * `data-shot-active` on the scene follows the shot in play (tests, and CSS: the index dims during
 * the opening's shot 1, D74).
 *
 * `pinUnderBars`: a scene further down the page (the majlis) pins with its top under the fixed
 * header, where a landing on its section puts it; an opening pins at the viewport's top.
 */
export function SceneDirector({ scene, pinUnderBars = false }: { scene: SceneConfig; pinUnderBars?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = ref.current?.closest<HTMLElement>(".scene");
    if (!root) return;
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
        const dir = document.documentElement.dir === "rtl" ? -1 : 1;
        const shotRange = (i: number) => scene.shots[i]?.[viewport] ?? null;
        /** A shot that doesn't play at this width hands its cues to the next one that does. */
        const cueAt = (i: number): [number, number] => {
          for (let j = i; j < scene.shots.length; j++) {
            const r = shotRange(j);
            if (r) return r;
          }
          return [pin, pin];
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            ...(pass
              ? { start: "top bottom", end: "bottom top" }
              : {
                  start: pinUnderBars ? () => `top ${anchorOffset(root)}px` : "top top",
                  end: () => `+=${pin * innerHeight}`,
                  pin: true,
                  // The server-rendered wrapper holds the reserved distance (LayeredScene).
                  pinSpacer: root.parentElement?.classList.contains("scene-pin") ? root.parentElement : undefined,
                  // A scene further down the page is held by a transform, never position: fixed:
                  // Chrome scored the fixed switch mid-page as a layout shift (viewport vs document
                  // coordinates; CLS 1.85 on desktop, D74). Lenis drives the scroll in the same frame.
                  ...(pinUnderBars && { pinType: "transform" as const }),
                }),
            scrub: true,
            invalidateOnRefresh: true,
            // While active, the moving boxes are promoted (data-live, layered-scene.css).
            onToggle: (self) => root.toggleAttribute("data-live", self.isActive),
            onUpdate: (self) => {
              const shot = String(shotAt(self.progress * pin, scene.shots, viewport));
              // Written only on a change: a page-level :has() rule reads it (the index dims, D74).
              if (root.dataset.shotActive !== shot) root.dataset.shotActive = shot;
            },
          },
        });
        tl.set({}, {}, pin); // the timeline lasts exactly the pin

        for (const layer of scene.layers) {
          if (viewport === "mobile" && !layer.mobile) continue;
          const el = root.querySelector<HTMLElement>(`[data-layer="${CSS.escape(layer.id)}"]`);
          if (!el) continue;
          const enter = el.querySelector<HTMLElement>(".scene-enter")!;
          const light = el.querySelector<HTMLElement>(".scene-light")!;

          const end = layerDrift(layer.depth, layer.push ?? 0, 1);
          tl.fromTo(el, { y: 0, scale: 1 }, { y: () => (end.y / 100) * innerHeight, scale: end.scale, duration: pin }, 0);

          if (layer.enter) {
            const [start, stop] = cueAt(layer.enter.shot);
            tl.fromTo(enter, enterFrom(layer.enter.from, dir), { xPercent: 0, yPercent: 0, opacity: 1, scale: 1, duration: (stop - start) * 0.8, ease: ENTER_EASE }, start);
          }
          for (const key of layer.keys ?? []) {
            const [start, stop] = cueAt(key.shot);
            tl.to(light, { ...key.to, duration: (stop - start) * 0.8, ease: LIGHT_EASE }, start);
          }
        }

        // A line holds until the next one comes in (lineSpans); lines of shots that don't play here stay hidden.
        const lines = root.querySelectorAll<HTMLElement>(".scene-line");
        gsap.set(lines, { autoAlpha: 0 });
        const spans = lineSpans(scene.shots, viewport);
        spans.forEach(({ shot, start, end }, k) => {
          const line = root.querySelector<HTMLElement>(`.scene-line[data-shot="${shot}"]`);
          if (!line) return;
          if (k === 0) gsap.set(line, { autoAlpha: 1 });
          else tl.fromTo(line, { autoAlpha: 0 }, { autoAlpha: 1, duration: LINE_XFADE }, start - LINE_XFADE / 2);
          if (k < spans.length - 1) tl.to(line, { autoAlpha: 0, duration: LINE_XFADE }, end - LINE_XFADE / 2);
        });

        root.dataset.motion = viewport;
        // A transform pin moves the whole scene every frame: promoted while live (layered-scene.css).
        root.toggleAttribute("data-pin-transform", !pass && pinUnderBars);
        return () => {
          delete root.dataset.motion;
          root.removeAttribute("data-pin-transform");
          root.removeAttribute("data-live");
          root.dataset.shotActive = "0";
        };
      },
    );
    return () => mm.revert();
  });

  return <span ref={ref} hidden />;
}
