"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export interface LenisControls {
  stop(): void;
  start(): void;
  scrollTo(target: number | string | HTMLElement, opts?: { offset?: number; immediate?: boolean }): void;
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
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: false,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (process.env.NODE_ENV !== "production") (window as unknown as { lenis?: Lenis }).lenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
      if (process.env.NODE_ENV !== "production") delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, [reduced]);

  const controls = useMemo<LenisControls>(
    () => ({
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      scrollTo: (target, opts) => {
        if (lenisRef.current) lenisRef.current.scrollTo(target, opts);
        else if (typeof target === "number") window.scrollTo({ top: target });
        else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
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
