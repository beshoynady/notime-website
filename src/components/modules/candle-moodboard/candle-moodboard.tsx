"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { MOODBOARD as D, type MoodId } from "@/content/modules/candle-moodboard";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { ExampleLabel } from "../example-label";
import type { ModuleProps } from "../types";
import { MoodBoardBody, MoodPhotos } from "./board";
import "../events-modules.css";

const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

/**
 * IV · Galas & private celebrations (spec §6 I.4). Two owners on separate layers: GSAP lights the
 * candle glow behind the module once as it arrives (`.cm-glow`, its own element); Motion owns the
 * mood switch: the photos crossfade and the board re-flows (`layout` on the board only, never on
 * the images). The moods are toggle buttons in one group; each change is announced. Reduced
 * motion: the switch is instant and the glow is simply there.
 */
export default function CandleMoodboard({ locale }: ModuleProps) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [moodId, setMoodId] = useState<MoodId>(D.moods[0].id);
  const [status, setStatus] = useState("");
  const mood = D.moods.find((m) => m.id === moodId)!;

  useGSAP(
    () => {
      const glow = root.current?.querySelector(".cm-glow");
      if (!glow) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(glow, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: glow, start: "top 80%", toggleActions: "play none none none" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const choose = (id: MoodId) => {
    if (id === moodId) return;
    setMoodId(id);
    const m = D.moods.find((x) => x.id === id)!;
    setStatus(fill(D.status[locale], { mood: m.label[locale], line: m.line[locale] }));
  };
  const t = reduced ? { duration: 0 } : { duration: 0.6, ease: ease.expoOut };

  return (
    <div ref={root} className="evm" data-evm="moodboard">
      <div className="evm-head">
        <h3 className="evm-title">{D.title[locale]}</h3>
        {D.example && <ExampleLabel />}
      </div>
      <p className="evm-note">{D.note[locale]}</p>
      <div className="evm-row" role="group" aria-label={D.moodsLabel[locale]}>
        {D.moods.map((m) => (
          <button key={m.id} type="button" className="evm-chip" aria-pressed={m.id === moodId} onClick={() => choose(m.id)}>
            {m.label[locale]}
          </button>
        ))}
      </div>
      <div className="cm-wrap">
        <span className="cm-glow" aria-hidden="true" />
        <div className="cm-grid">
          <div className="grid">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div key={moodId} className="[grid-area:1/1]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t}>
                <MoodPhotos mood={mood} locale={locale} />
              </motion.div>
            </AnimatePresence>
          </div>
          <motion.div layout className="cm-board" transition={t}>
            <motion.div key={moodId} className="grid gap-[18px]" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={t}>
              <MoodBoardBody mood={mood} locale={locale} />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <p className="evm-live" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
