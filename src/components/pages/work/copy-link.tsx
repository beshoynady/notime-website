"use client";

import { Check, Link2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Labels = { copy: string; copied: string; failed: string };

/**
 * Copies the page's address (Task 15): the URL the visitor is on, without its hash or query, so a
 * shared link opens this case or collection. Motion owns the press (a small scale, none when motion
 * is reduced); the label confirms ("Link copied") and the status line tells screen readers. If the
 * clipboard refuses, the status says where to copy it from. Hidden without JavaScript (work.css).
 */
export function CopyLink({ labels }: { labels: Labels }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  const reduce = useReducedMotion();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.origin + window.location.pathname);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2400);
  }

  const Icon = state === "copied" ? Check : Link2;
  return (
    <p className="copy-link-row">
      <motion.button type="button" onClick={copy} whileTap={reduce ? undefined : { scale: 0.96 }} className="copy-link" data-state={state}>
        <Icon aria-hidden="true" strokeWidth={1.5} className="copy-link-icon" />
        <span>{state === "copied" ? labels.copied : labels.copy}</span>
      </motion.button>
      <span role="status" className="copy-link-status">
        {state === "failed" ? labels.failed : state === "copied" ? <span className="sr-only">{labels.copied}</span> : null}
      </span>
    </p>
  );
}
