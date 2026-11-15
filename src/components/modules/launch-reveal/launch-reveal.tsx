"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LAUNCH_REVEAL as D, type LaunchFormatId } from "@/content/modules/launch-reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ease } from "@/lib/motion";
import { ExampleLabel } from "../example-label";
import type { ModuleProps } from "../types";
import { LaunchPlinth, LaunchSetting } from "./launch-stage";
import "../events-modules.css";

type Phase = "closed" | "counting" | "open";
const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

/**
 * III · Product launches & brand activations (spec §6 I.3). Motion owns it, all on demand: "Start
 * the reveal" runs a 5-second countdown (5 → 1), then the two curtain halves draw apart toward the
 * edges (mirrored by the layout in Arabic) and the spot blooms on the product. The countdown can be
 * skipped; the live region speaks only at the start and the end (spec). The three settings switch
 * the backdrop and say what the format is. Reduced motion: the curtain is open, no countdown; the
 * button closes and reopens it instantly.
 * The curtain starts closed once mounted; the server fallback is the open stage, and the module
 * mounts about a viewport before it shows, so the swap isn't seen.
 */
export default function LaunchReveal({ locale }: ModuleProps) {
  const reduced = useReducedMotion();
  const [state, setPhase] = useState<Phase>("closed");
  // Reduced motion is known only after hydration: until the visitor closes it, the curtain then
  // rests open (the final state). Derived at render, so no effect sets state.
  const [closedByVisitor, setClosedByVisitor] = useState(false);
  const phase: Phase = reduced && state === "closed" && !closedByVisitor ? "open" : state;
  const [count, setCount] = useState(D.countdownFrom);
  const [format, setFormat] = useState<LaunchFormatId>(D.formats[0].id);
  const [status, setStatus] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const current = D.formats.find((f) => f.id === format)!;

  useEffect(() => () => window.clearInterval(timer.current), []);

  const reveal = () => {
    window.clearInterval(timer.current);
    setPhase("open");
    setStatus(D.status.done[locale]);
  };
  const onMain = () => {
    if (phase === "counting") return reveal();
    if (phase === "open") {
      setPhase("closed");
      setClosedByVisitor(true);
      setStatus(D.status.closed[locale]);
      return;
    }
    if (reduced) return reveal();
    setCount(D.countdownFrom);
    setPhase("counting");
    setStatus(D.status.start[locale]);
    let n = D.countdownFrom;
    timer.current = window.setInterval(() => {
      n -= 1;
      if (n <= 0) reveal();
      else setCount(n);
    }, 1000);
  };
  const choose = (id: LaunchFormatId) => {
    setFormat(id);
    const f = D.formats.find((x) => x.id === id)!;
    setStatus(fill(D.status.format[locale], { format: f.label[locale], line: f.line[locale] }));
  };

  const open = phase === "open";
  // The halves part toward their own edges: inline-start is the right edge in Arabic.
  const edge = locale === "ar" ? -1 : 1;
  const t = reduced ? { duration: 0 } : { duration: 1.4, ease: ease.expoInOut };
  const label = phase === "counting" ? D.skip : open ? D.reset : D.start;

  return (
    <div className="evm" data-evm="launch">
      <div className="evm-head">
        <h3 className="evm-title">{D.title[locale]}</h3>
        {D.example && <ExampleLabel kind="example" />}
      </div>
      <p className="evm-note">{D.note[locale]}</p>
      <div className="lr-stage">
        <div className="lr-setting">
          <AnimatePresence initial={false}>
            <motion.div key={format} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduced ? { duration: 0 } : { duration: 0.5 }}>
              <LaunchSetting format={format} />
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.div className="lr-spot" aria-hidden="true" initial={false} animate={{ opacity: open ? 1 : 0.15 }} transition={t} />
        <div className="lr-plinth">
          <LaunchPlinth />
        </div>
        <p className="lr-product-label">{D.productLabel[locale]}</p>
        <div className="lr-curtains" aria-hidden="true">
          <motion.div className="lr-curtain" data-side="start" initial={false} animate={{ x: open ? `${-101 * edge}%` : "0%" }} transition={t} />
          <motion.div className="lr-curtain" data-side="end" initial={false} animate={{ x: open ? `${101 * edge}%` : "0%" }} transition={t} />
        </div>
        <AnimatePresence>
          {phase === "counting" && (
            <motion.div key={count} className="lr-count" aria-hidden="true" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: ease.expoOut }}>
              <bdi lang="en">{count}</bdi>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="lr-controls">
        <button type="button" className="evm-btn evm-btn-solid" onClick={onMain}>
          {label[locale]}
        </button>
        <div className="evm-row" role="group" aria-label={D.formatsLabel[locale]}>
          {D.formats.map((f) => (
            <button key={f.id} type="button" className="evm-chip" aria-pressed={f.id === format} onClick={() => choose(f.id)}>
              {f.label[locale]}
            </button>
          ))}
        </div>
      </div>
      <p className="lr-format-line">{current.line[locale]}</p>
      <p className="evm-live" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
