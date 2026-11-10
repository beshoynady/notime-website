"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { HUMAN_SCALE_COPY as COPY, SCALE_FORMATS, type ScaleFormat } from "@/content/modules/human-scale";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease, motionTokens } from "@/lib/motion";
import type { ModuleProps } from "../types";
import { formatSize, lineup, loupe, pct, rulerTicks, type Box } from "./scale-layout";
import "./human-scale.css";

const L = lineup(SCALE_FORMATS);
const TICKS = rulerTicks(L);
/** Where dimension lines sit off a format's edge, in mm. */
const DIM_OFF = 120;

/** A figure standing 1.8 m, drawn in a 52 × 180 box (×10 = mm). Symmetric, so it never needs mirroring. */
const FIGURE_PATH =
  "M26 1a10 10 0 1 1 0 20a10 10 0 1 1 0-20ZM14 25h24c4 0 7 3 7.6 7l3.4 39c.3 3-3.7 3.8-4.5.9L40 40v52l-2.6 86h-7.6L27 108h-2l-2.8 70h-7.6L12 92V40L8.5 72.9c-.8 2.9-4.8 2.1-4.5-.9L7.4 32c.6-4 3.6-7 6.6-7Z";

/**
 * Human scale (spec §6, IV.19): typical print formats at true relative scale against a 1.8 m
 * figure, from a business card to a backdrop. The visitor picks a format (native radios); the
 * chosen one is drawn in ink with its dimension line, and a lens magnifies the small ones at a
 * whole-number power, so even a business card reads beside a person.
 *
 * Owners: GSAP draws the floor ruler across the drawing once, as the section's one hero motion
 * (storyboard: "a dimension line extends to the section's full width"); Motion fades the
 * dimension, the lens and their labels between choices. Separate elements. Reduced motion: the
 * ruler is drawn and choices switch instantly; the radios keep working.
 * RTL: the SVG (shapes only) is mirrored as a whole; HTML labels sit at logical offsets.
 */
export default function HumanScale({ locale }: ModuleProps) {
  const [chosen, setChosen] = useState<ScaleFormat["id"]>("card");
  const [said, setSaid] = useState("");
  const reduced = useReducedMotion();
  const name = useId();
  const root = useRef<HTMLDivElement>(null);
  const t = (k: keyof typeof COPY) => COPY[k][locale];

  const index = SCALE_FORMATS.findIndex((f) => f.id === chosen);
  const format = SCALE_FORMATS[index];
  const box = L.items[index];
  const lens = loupe(box, L);
  const size = formatSize(format);
  const fade = { duration: reduced ? 0 : motionTokens.base.duration * 0.75, ease: ease.power3Out };

  useGSAP(
    () => {
      const el = root.current;
      if (!el || reduced) return;
      const rule = el.querySelector<SVGGElement>(".hs-ruler");
      const marks = el.querySelector<HTMLElement>(".hs-ticks");
      // Already on screen when the module mounts (a landing): leave it drawn, no flash.
      if (!rule || !marks || el.getBoundingClientRect().top < innerHeight * 0.85) return;
      gsap.set(rule, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(marks, { autoAlpha: 0 });
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } })
        .to(rule, { scaleX: 1, duration: 0.9, ease: "power3.out" })
        .to(marks, { autoAlpha: 1, duration: 0.4, ease: "power3.out" }, "-=0.3");
    },
    { scope: root, dependencies: [reduced] },
  );

  const choose = (f: ScaleFormat) => {
    setChosen(f.id);
    setSaid(
      COPY.announce[locale]
        .replace("{name}", f.name[locale])
        .replace("{size}", formatSize(f))
        .replace("{basis}", f.basis[locale]),
    );
  };

  /** An HTML label anchored at a drawing point (centred on it), so it mirrors with the page. */
  const at = (x: number, y: number) => ({ insetInlineStart: pct(x, L.width), insetBlockStart: pct(y, L.height) });
  const label = lens
    ? { x: lens.cx, y: lens.cy - lens.r - 70 }
    : { x: box.x + box.w / 2, y: box.y - DIM_OFF - 70 };

  return (
    <div ref={root} className="hs">
      <div className="hs-head">
        <h3 className="text-eyebrow hs-title">{t("title")}</h3>
        <fieldset className="hs-choose">
          <legend className="sr-only">{t("choose")}</legend>
          {SCALE_FORMATS.map((f) => (
            <label key={f.id} className="hs-chip" data-on={f.id === chosen ? "" : undefined}>
              <input type="radio" name={name} value={f.id} checked={f.id === chosen} onChange={() => choose(f)} className="sr-only" />
              {f.name[locale]}
            </label>
          ))}
        </fieldset>
      </div>

      <div className="hs-stage" style={{ aspectRatio: `${L.width} / ${L.height}` }} aria-hidden="true">
        <svg className="hs-svg" viewBox={`0 0 ${L.width} ${L.height}`} preserveAspectRatio="xMidYMid meet">
          {/* The floor ruler: whole metres from the figure's feet, 10 cm minor ticks. */}
          <g className="hs-ruler">
            <path className="hs-line" d={`M${L.figure.x} ${L.floor}H${L.width - 60}`} />
            {Array.from({ length: Math.floor((L.width - 60 - L.figure.x) / 100) + 1 }, (_, i) => {
              const x = L.figure.x + i * 100;
              const major = i % 10 === 0;
              return <path key={i} className={major ? "hs-line" : "hs-tick"} d={`M${x} ${L.floor}v${major ? 110 : 45}`} />;
            })}
          </g>

          {/* The figure, and its height: always shown, it's the reference. */}
          <path className="hs-figure" d={FIGURE_PATH} transform={`translate(${L.figure.x} ${L.figure.y}) scale(10)`} />
          <Dim x1={L.figure.x - 100} y1={L.figure.y} x2={L.figure.x - 100} y2={L.floor} />

          {L.items.map((b, i) => (
            <Format key={b.id} id={SCALE_FORMATS[i].id} box={b} on={i === index} />
          ))}

          <AnimatePresence initial={false}>
            <motion.g key={chosen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade}>
              {lens ? (
                <>
                  <path className="hs-line" d={`M${lens.cx} ${lens.cy + lens.r}V${box.y - 20}`} />
                  <circle className="hs-lens" cx={lens.cx} cy={lens.cy} r={lens.r} />
                  <rect
                    className="hs-fmt"
                    data-on=""
                    x={lens.cx - (box.w * lens.power) / 2}
                    y={lens.cy - (box.h * lens.power) / 2}
                    width={box.w * lens.power}
                    height={box.h * lens.power}
                  />
                  <CropMarks box={{ x: lens.cx - (box.w * lens.power) / 2, y: lens.cy - (box.h * lens.power) / 2, w: box.w * lens.power, h: box.h * lens.power }} />
                </>
              ) : (
                <>
                  <Dim x1={box.x} y1={box.y - DIM_OFF} x2={box.x + box.w} y2={box.y - DIM_OFF} />
                  <Dim x1={box.x + box.w + DIM_OFF} y1={box.y} x2={box.x + box.w + DIM_OFF} y2={L.floor} />
                </>
              )}
            </motion.g>
          </AnimatePresence>
        </svg>

        {/* Labels over the drawing (HTML: the brand faces, and they mirror with the page). */}
        <div className="hs-ticks">
          {TICKS.map((tk, i) => (
            <span key={tk.m} className="hs-at hs-tick-label" style={at(tk.x, L.floor + 190)}>
              <span>{i === TICKS.length - 1 ? `${tk.m} ${t("metre")}` : tk.m}</span>
            </span>
          ))}
        </div>
        <span className="hs-at hs-fig-label" style={at(L.figure.x + L.figure.w / 2, L.figure.y - 110)}>
          <span>{t("figure")}</span>
        </span>
        <AnimatePresence initial={false}>
          <motion.span key={chosen} className="hs-at hs-size" style={at(label.x, label.y)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade}>
            <span>
              <bdi dir="ltr">{size}</bdi> {t("unit")}
            </span>
          </motion.span>
        </AnimatePresence>
        {lens && (
          <span key={`p-${chosen}`} className="hs-at hs-power" style={at(lens.cx, lens.cy + lens.r * 0.78)}>
            <span>
              <bdi dir="ltr">{COPY.power[locale].replace("{n}", String(lens.power))}</bdi>
            </span>
          </span>
        )}
      </div>

      <p className="hs-readout" aria-hidden="true">
        <span className="hs-readout-name">{format.name[locale]}</span>
        <span>
          <bdi dir="ltr">{size}</bdi> {t("unit")}
        </span>
        <span className="hs-readout-basis">{format.basis[locale]}</span>
      </p>
      <p className="hs-note">{t("note")}</p>
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
    </div>
  );
}

function Format({ id, box, on }: { id: ScaleFormat["id"]; box: Box; on: boolean }) {
  const { x, y, w, h } = box;
  return (
    <g data-format={id}>
      <rect className="hs-fmt" data-on={on ? "" : undefined} x={x} y={y} width={w} height={h} />
      {id === "brochure" && <path className="hs-detail" d={`M${x + w * 0.18} ${y + h * 0.2}h${w * 0.64}M${x + w * 0.18} ${y + h * 0.3}h${w * 0.4}`} />}
      {id === "rollup" && <rect className="hs-base" x={x - 30} y={y + h - 70} width={w + 60} height={70} />}
      {id === "backdrop" && <path className="hs-detail" d={`M${x + w / 4} ${y}v${h}M${x + w / 2} ${y}v${h}M${x + (3 * w) / 4} ${y}v${h}`} />}
    </g>
  );
}

/** A dimension line with extension ticks at both ends (architectural slashes). */
function Dim({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const s = 34;
  return (
    <g className="hs-dim">
      <path d={`M${x1} ${y1}L${x2} ${y2}`} />
      <path d={`M${x1 - s} ${y1 + s}L${x1 + s} ${y1 - s}M${x2 - s} ${y2 + s}L${x2 + s} ${y2 - s}`} />
    </g>
  );
}

/** Crop marks around a format in the lens, as on a press sheet. */
function CropMarks({ box: { x, y, w, h } }: { box: Box }) {
  const g = 16;
  const l = 50;
  const d = [
    `M${x - g - l} ${y}h${l}M${x} ${y - g - l}v${l}`,
    `M${x + w + g} ${y}h${l}M${x + w} ${y - g - l}v${l}`,
    `M${x - g - l} ${y + h}h${l}M${x} ${y + h + g}v${l}`,
    `M${x + w + g} ${y + h}h${l}M${x + w} ${y + h + g}v${l}`,
  ].join("");
  return <path className="hs-crop" d={d} />;
}
