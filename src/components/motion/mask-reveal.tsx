"use client";

import { useLocale } from "next-intl";
import { useImperativeHandle, useRef, type ReactNode, type Ref } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { isRtl, type AppLocale } from "@/i18n/routing";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ReplayHandle } from "./reveal-words";

/** Clip-path inset that hides everything except the given logical edge. */
export function maskFrom(from: "start" | "end", rtl: boolean): string {
  const fromLeft = (from === "start") !== rtl; // start = left in LTR, right in RTL
  return fromLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
}

interface MaskRevealProps {
  children: ReactNode;
  /** Logical edge the reveal starts from; flips in RTL. */
  from?: "start" | "end";
  className?: string;
  trigger?: "scroll" | "manual";
  ref?: Ref<ReplayHandle>;
}

/** Clip-path wipe (1.2s expo.inOut) with a slow settle of the inner media (1.6s expo.out). */
export function MaskReveal({ children, from = "start", className, trigger = "scroll", ref }: MaskRevealProps) {
  const locale = useLocale() as AppLocale;
  const el = useRef<HTMLDivElement>(null);

  const build = (withScroll: boolean) => {
    const node = el.current;
    if (!node || prefersReducedMotion()) return;
    const st = withScroll ? { trigger: node, start: "top 80%", once: true } : undefined;
    gsap.fromTo(
      node,
      { clipPath: maskFrom(from, isRtl(locale)) },
      { clipPath: "inset(0 0% 0 0%)", duration: 1.2, ease: "expo.inOut", scrollTrigger: st },
    );
    if (node.firstElementChild) {
      gsap.fromTo(node.firstElementChild, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "expo.out", scrollTrigger: st });
    }
  };

  const { contextSafe } = useGSAP(() => trigger === "scroll" && build(true), {
    scope: el,
    dependencies: [locale],
    revertOnUpdate: true,
  });

  useImperativeHandle(ref, () => ({ replay: contextSafe(() => build(false)) }));

  return (
    <div ref={el} className={className}>
      {children}
    </div>
  );
}
