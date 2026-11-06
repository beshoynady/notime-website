"use client";

import type { RefObject } from "react";
import type { AppLocale } from "@/i18n/routing";
import { SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "./use-reduced-motion";

interface SplitOptions {
  locale: AppLocale;
  /** Build the animation. Returning it lets autoSplit revert/re-create it on resize and font load. */
  onSplit: (split: SplitText) => gsap.core.Animation | void;
  /**
   * Wrap each unit in an overflow mask. English masks chars, Arabic masks words
   * (Arabic letters must stay joined, so Arabic never splits into chars).
   */
  mask?: boolean;
  /** Split by words in both languages (word reveals). */
  wordsOnly?: boolean;
}

/**
 * GSAP SplitText with the project's language rules: chars in English, words in Arabic.
 * Reverts on unmount and on locale change (the split is recorded in the useGSAP context);
 * re-splits on resize and when fonts load (`autoSplit`). Skipped under reduced motion,
 * so the original, unsplit text is the final state.
 */
export function useSplitText(ref: RefObject<HTMLElement | null>, { locale, onSplit, mask = true, wordsOnly = false }: SplitOptions) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const byWords = wordsOnly || locale === "ar";
      SplitText.create(el, {
        type: byWords ? "words" : "words,chars",
        mask: mask ? (byWords ? "words" : "chars") : undefined,
        aria: "auto",
        autoSplit: true,
        onSplit: (split) => onSplit(split),
      });
    },
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );
}
