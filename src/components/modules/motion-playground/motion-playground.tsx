"use client";

import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { FrameCorners } from "@/components/ornaments/frame-corners";
import { Button } from "@/components/ui/button";
import { MOTION_PLAYGROUND as T } from "@/content/modules/motion-playground";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ModuleProps } from "../types";
import { CURVE_BOX, curvePath, ease, type EasingId } from "./easing";
import "./motion-playground.css";

/** One run of the title card, in seconds: long enough to read the curve, short of any pause control (WCAG 2.2.2). */
const RUN = 1.4;
/** How far the title starts from its place, toward inline-start, as a share of its own width. */
const TITLE_TRAVEL = 40;

/**
 * Motion graphics · the motion playground (category-pages.md §6 II.9). The visitor chooses an
 * easing (native radios: arrow keys move through them) and presses Play: the title card's line
 * slides in from inline-start and a diamond playhead crosses the card, both on that easing, while
 * a dot runs the curve. Motion owns all of it (direct interaction); one clock (`time`, linear)
 * drives the eased value, so the card and the diagram can't drift apart.
 *
 * At rest, and under reduced motion, everything sits at its end: the title in place, the playhead
 * at the end, the dot at the curve's end. Reduced motion hides Play and says why; the choices still
 * swap the curve and its description. RTL: time runs from inline-start, so the travel and the
 * diagram mirror. Announcements: one polite live region.
 */
export default function MotionPlayground({ locale }: ModuleProps) {
  const reduced = useReducedMotion();
  const [id, setId] = useState<EasingId>("expo");
  const [message, setMessage] = useState("");
  const run = useRef<AnimationPlaybackControls | null>(null);
  const name = useId();
  const dir = locale === "ar" ? -1 : 1;

  const time = useMotionValue(1);
  const value = useMotionValue(1);
  const titleX = useTransform(value, (v) => `${(v - 1) * TITLE_TRAVEL * dir}%`);
  const headX = useTransform(value, (v) => `${v * 100 * dir}%`);
  const dotX = useTransform(time, (t) => t * CURVE_BOX.size);
  const dotY = useTransform(value, (v) => CURVE_BOX.size - v * CURVE_BOX.size);

  const current = T.easings.find((e) => e.id === id)!;

  const settle = () => {
    run.current?.stop();
    time.set(1);
    value.set(1);
  };
  // Reduced motion (or a change to it mid-run): straight to the end frame.
  useEffect(() => {
    if (!reduced) return;
    run.current?.stop();
    time.set(1);
    value.set(1);
  }, [reduced, time, value]);
  useEffect(() => () => run.current?.stop(), []);

  const choose = (next: EasingId) => {
    settle();
    setId(next);
    const e = T.easings.find((x) => x.id === next)!;
    setMessage(`${e.name[locale]}: ${e.line[locale]}`);
  };

  const play = () => {
    run.current?.stop();
    time.set(0);
    value.set(0);
    setMessage(`${T.playing[locale]} ${current.name[locale]}`);
    run.current = animate(0, 1, {
      duration: RUN,
      ease: "linear",
      onUpdate: (t) => {
        time.set(t);
        value.set(ease(id, t));
      },
    });
  };

  return (
    <div className="mp">
      <div className="mp-card">
        <FrameCorners tone="champagne" inset="sm" />
        <p className="mp-label" aria-hidden="true">
          <span>{T.cardLabel[locale]}</span>
          <span className="mp-label-value">{current.name[locale]}</span>
        </p>
        <div className="mp-title-box">
          <motion.p className="mp-title" style={{ x: titleX }}>
            {T.title[locale]}
          </motion.p>
        </div>
        <div className="mp-track" aria-hidden="true">
          <motion.span className="mp-run" style={{ x: headX }}>
            <span className="mp-head" />
          </motion.span>
        </div>
      </div>

      <div className="mp-controls">
        <fieldset className="mp-choices">
          <legend className="mp-legend">{T.legend[locale]}</legend>
          {T.easings.map((e) => (
            <label key={e.id} className="mp-choice">
              <input type="radio" name={name} value={e.id} checked={e.id === id} onChange={() => choose(e.id)} />
              <span>{e.name[locale]}</span>
            </label>
          ))}
        </fieldset>

        <div className="mp-curve-box">
          <svg
            className="mp-curve rtl:-scale-x-100"
            viewBox={`0 ${-CURVE_BOX.headroom} ${CURVE_BOX.size} ${CURVE_BOX.size + CURVE_BOX.headroom}`}
            aria-hidden="true"
          >
            <line x1="0" y1={CURVE_BOX.size} x2={CURVE_BOX.size} y2={CURVE_BOX.size} className="mp-axis" />
            <line x1="0" y1="0" x2={CURVE_BOX.size} y2="0" className="mp-axis mp-axis-target" />
            <path d={curvePath(id)} className="mp-path" />
            <motion.circle r="3.2" cx={dotX} cy={dotY} className="mp-dot" />
          </svg>
          {!reduced && (
            <Button type="button" variant="ghost" size="sm" onClick={play} className="mp-play">
              {/* Time runs from inline-start here, so the play mark points the reading way (flips in RTL). */}
              <svg viewBox="0 0 10 12" aria-hidden="true" className="mp-play-icon rtl:-scale-x-100">
                <path d="M0 0 10 6 0 12z" />
              </svg>
              {T.play[locale]}
            </Button>
          )}
        </div>

        <p className="mp-desc">{current.line[locale]}</p>
        {reduced && <p className="mp-note">{T.reduced[locale]}</p>}
      </div>

      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
