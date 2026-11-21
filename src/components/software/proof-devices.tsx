"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useState, type PointerEvent, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Locale } from "@/content/types";
import { microTransition } from "@/lib/motion";

/**
 * "This website" in its two languages: a segmented control switches the device pair between the
 * English and the Arabic screenshots (Motion · micro, a cross-fade). The light follows a fine
 * pointer across the frames (its own layer). Reduced motion: an instant switch and no light.
 * The hidden language is inert, so assistive tech reads one pair.
 */
export function ProofDevices({ locale, labels, en, ar }: { locale: Locale; labels: { toggle: string; en: string; ar: string }; en: ReactNode; ar: ReactNode }) {
  const [lang, setLang] = useState<Locale>(locale);
  const reduced = useReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const light = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgba(234, 212, 171, 0.32), transparent 70%)`;
  const lit = fine && !reduced;
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };
  const transition = reduced ? { duration: 0 } : microTransition;

  return (
    <div className="sw-proof-visual" onPointerMove={lit ? onMove : undefined} onPointerLeave={
        lit
          ? () => {
              x.set(-999);
              y.set(-999);
            }
          : undefined
      }
    >
      <div className="sw-seg" role="group" aria-label={labels.toggle}>
        {(["en", "ar"] as const).map((l) => (
          <button key={l} type="button" className="sw-seg-btn" aria-pressed={lang === l} onClick={() => setLang(l)} lang={l}>
            {l === "en" ? labels.en : labels.ar}
          </button>
        ))}
      </div>
      <div className="sw-proof-panes">
        {(["en", "ar"] as const).map((l) => (
          <motion.div
            key={l}
            className="sw-proof-pane"
            initial={false}
            animate={{ opacity: lang === l ? 1 : 0 }}
            transition={transition}
            aria-hidden={lang !== l || undefined}
            inert={lang !== l}
            data-active={lang === l || undefined}
          >
            {l === "en" ? en : ar}
          </motion.div>
        ))}
      </div>
      {lit && <motion.span aria-hidden="true" className="sw-proof-light" style={{ backgroundImage: light }} />}
    </div>
  );
}
