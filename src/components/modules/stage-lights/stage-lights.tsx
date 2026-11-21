"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { STAGE_LIGHTS as D, type LightGroupId } from "@/content/modules/stage-lights";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ease } from "@/lib/motion";
import { ExampleLabel } from "../example-label";
import type { ModuleProps } from "../types";
import { StageSvg } from "./stage-svg";
import "../events-modules.css";

type Lights = Record<LightGroupId, boolean>;
const ALL_ON: Lights = { wash: true, spots: true, back: true, screen: true };
const ALL_OFF: Lights = { wash: false, spots: false, back: false, screen: false };
const CUE_MS = 1100;

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

/**
 * VI · Stage & technical production (spec §6 I.6). Motion owns it: four toggle buttons fade their
 * light group in and out, and "Run the cues" plays the four cues one after another from a dark
 * stage (about 4.4 s, so under the 5 s limit; it can be stopped, and any switch stops it). Every
 * change is announced in the one live region ("Spots on, 2 of 4 groups"). Reduced motion: the
 * switches and the cues still work, with instant on and off. It starts fully lit, as the server
 * fallback, so the swap shows nothing.
 */
export default function StageLights({ locale }: ModuleProps) {
  const reduced = useReducedMotion();
  const [lights, setLights] = useState<Lights>(ALL_ON);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const timers = useRef<number[]>([]);
  const total = D.groups.length;
  const labelOf = (id: LightGroupId) => D.groups.find((g) => g.id === id)!.label[locale];

  const clear = () => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const toggle = (id: LightGroupId) => {
    if (running) {
      clear();
      setRunning(false);
    }
    const next = { ...lights, [id]: !lights[id] };
    setLights(next);
    const n = Object.values(next).filter(Boolean).length;
    setStatus(fill(D.status[next[id] ? "on" : "off"][locale], { group: labelOf(id), n, total }));
  };

  const run = () => {
    if (running) {
      clear();
      setRunning(false);
      setStatus(D.status.stopped[locale]);
      return;
    }
    clear();
    setRunning(true);
    setLights(ALL_OFF);
    setStatus(D.status.start[locale]);
    let acc: Lights = ALL_OFF;
    D.cues.forEach((cue, i) => {
      timers.current.push(
        window.setTimeout(
          () => {
            acc = { ...acc, [cue.group]: true };
            setLights(acc);
            setStatus(fill(D.status.cue[locale], { n: i + 1, total: D.cues.length, cue: cue.label[locale] }));
            if (i === D.cues.length - 1) setRunning(false);
          },
          (reduced ? 0 : CUE_MS) * (i + 1) - (reduced ? 0 : CUE_MS / 2),
        ),
      );
    });
  };

  const transition = reduced ? { duration: 0 } : { duration: 0.7, ease: ease.expoOut };

  return (
    <div className="evm" data-evm="stage">
      <div className="evm-head">
        <h3 className="evm-title">{D.title[locale]}</h3>
        {D.example && <ExampleLabel />}
      </div>
      <p className="evm-note">{D.note[locale]}</p>
      <div className="st-frame">
        <StageSvg
          group={(id, children) => (
            <motion.g key={id} data-group={id} initial={false} animate={{ opacity: lights[id] ? 1 : 0 }} transition={transition}>
              {children}
            </motion.g>
          )}
        />
      </div>
      <div className="st-controls">
        <div className="evm-row" role="group" aria-label={D.groupsLabel[locale]}>
          {D.groups.map((g) => (
            <button key={g.id} type="button" className="evm-chip" aria-pressed={lights[g.id]} onClick={() => toggle(g.id)}>
              <span className="st-switch-dot" aria-hidden="true" />
              {g.label[locale]}
            </button>
          ))}
        </div>
        <button type="button" className="evm-btn" onClick={run}>
          {running ? D.stop[locale] : D.run[locale]}
        </button>
      </div>
      <p className="evm-live" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
