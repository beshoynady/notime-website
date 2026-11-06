"use client";

import { useLocale } from "next-intl";
import { useImperativeHandle, useRef, type ElementType, type ReactNode, type Ref } from "react";
import { useSplitText } from "@/hooks/use-split-text";
import type { AppLocale } from "@/i18n/routing";
import { gsap, type SplitText } from "@/lib/gsap";
import { motionTokens, stagger } from "@/lib/motion";

export interface ReplayHandle {
  replay(): void;
}

interface RevealWordsProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Play on scroll into view (default) or only when replay() is called. */
  trigger?: "scroll" | "manual";
  ref?: Ref<ReplayHandle>;
}

/**
 * Words rise out of a mask (GSAP · base: 0.8s power3.out, 0.06s stagger).
 * Server-rendered text stays as-is without JS or under reduced motion.
 */
export function RevealWords({ children, as: Tag = "p", className, delay = 0, trigger = "scroll", ref }: RevealWordsProps) {
  const locale = useLocale() as AppLocale;
  const el = useRef<HTMLElement>(null);
  const split = useRef<SplitText | null>(null);

  const play = (words: Element[]) =>
    gsap.fromTo(
      words,
      { yPercent: 110 },
      { yPercent: 0, duration: motionTokens.base.duration, ease: motionTokens.base.gsapEase, stagger: stagger.word, delay },
    );

  useSplitText(el, {
    locale,
    wordsOnly: true,
    onSplit: (s) => {
      split.current = s;
      if (trigger === "manual") return;
      return gsap.fromTo(
        s.words,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: motionTokens.base.duration,
          ease: motionTokens.base.gsapEase,
          stagger: stagger.word,
          delay,
          scrollTrigger: { trigger: el.current, start: "top 80%", once: true },
        },
      );
    },
  });

  useImperativeHandle(ref, () => ({ replay: () => split.current && play(split.current.words) }));

  return (
    <Tag ref={el} className={className}>
      {children}
    </Tag>
  );
}
