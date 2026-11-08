"use client";

import { useRef } from "react";
import type { SceneConfig, Viewport } from "@/content/scenes";
import { gsap, useGSAP } from "@/lib/gsap";
import { enterFrom, layerDrift, pinLength, shotAt } from "@/lib/scene-math";

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
 * the shots on one timeline whose time is the vh scrolled. A pass scene (`mode: "pass"`) is not
 * pinned: its timeline runs 0–1 while it crosses the viewport. Built per width in gsap.matchMedia;
 * under reduced motion nothing is built and the still stays. `data-shot-active` on the scene
 * follows the shot in play (tests, and a hook for CSS).
 */
export function SceneDirector({ scene }: { scene: SceneConfig }) {
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
        const pass = scene.mode === "pass";
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
              : { start: "top top", end: () => `+=${pin * innerHeight}`, pin: true }),
            scrub: true,
            invalidateOnRefresh: true,
            // While active, the moving boxes are promoted (data-live, layered-scene.css).
            onToggle: (self) => root.toggleAttribute("data-live", self.isActive),
            onUpdate: (self) => {
              root.dataset.shotActive = String(shotAt(self.progress * pin, scene.shots, viewport));
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

        const lineOf = (i: number) => root.querySelector<HTMLElement>(`.scene-line[data-shot="${i}"]`);
        const playing = scene.shots.map((_, i) => shotRange(i)).filter((r) => r !== null);
        let shown = 0;
        scene.shots.forEach((_, i) => {
          const line = lineOf(i);
          const r = shotRange(i);
          if (!line) return;
          if (!r) return void gsap.set(line, { autoAlpha: 0 });
          const first = shown === 0;
          const last = shown === playing.length - 1;
          shown++;
          if (first) gsap.set(line, { autoAlpha: 1 });
          else tl.fromTo(line, { autoAlpha: 0 }, { autoAlpha: 1, duration: LINE_XFADE }, r[0] - LINE_XFADE / 2);
          if (!last) tl.to(line, { autoAlpha: 0, duration: LINE_XFADE }, r[1] - LINE_XFADE / 2);
        });

        root.dataset.motion = viewport;
        return () => {
          delete root.dataset.motion;
          root.removeAttribute("data-live");
          root.dataset.shotActive = "0";
        };
      },
    );
    return () => mm.revert();
  });

  return <span ref={ref} hidden />;
}
