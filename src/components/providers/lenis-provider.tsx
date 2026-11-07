"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { afterFirstPaint } from "@/lib/idle";

export interface LenisControls {
  stop(): void;
  start(): void;
  scrollTo(
    target: number | string | HTMLElement,
    opts?: { offset?: number; immediate?: boolean; force?: boolean; onComplete?: () => void },
  ): void;
  /** True while Lenis runs (off under reduced motion, and until the first paint). */
  readonly active: boolean;
}

const LenisContext = createContext<LenisControls | null>(null);

/**
 * Smooth scrolling, driven by the GSAP ticker so Lenis and ScrollTrigger share one clock.
 * Off under reduced motion (native scrolling). Overlays opt out with `data-lenis-prevent`.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const tick = (time: number) => lenisRef.current?.raf(time * 1000);
    // Created after the first paint, outside the hydration task (D44); until then the page
    // scrolls natively, and the controls below fall back to native scrolling.
    const cancel = afterFirstPaint(() => {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        autoRaf: false,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (process.env.NODE_ENV !== "production") (window as unknown as { lenis?: Lenis }).lenis = lenis;
    });

    return () => {
      cancel();
      if (!lenisRef.current) return;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenisRef.current.destroy();
      lenisRef.current = null;
      if (process.env.NODE_ENV !== "production") delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, [reduced]);

  const controls = useMemo<LenisControls>(
    () => ({
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      scrollTo: (target, opts) => {
        if (lenisRef.current) return lenisRef.current.scrollTo(target, opts);
        if (typeof target === "number") window.scrollTo({ top: target, behavior: "instant" });
        else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
        opts?.onComplete?.();
      },
      get active() {
        return lenisRef.current !== null;
      },
    }),
    [],
  );

  return <LenisContext.Provider value={controls}>{children}</LenisContext.Provider>;
}

/** Stop/start/scrollTo; safe to call when Lenis is off (reduced motion). */
export function useLenis(): LenisControls {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error("useLenis must be used inside <LenisProvider>");
  return ctx;
}
