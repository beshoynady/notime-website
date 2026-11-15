"use client";

import type { Prefill } from "@/lib/prefill";

/**
 * A tiny client store for the consultation prefill: a "Discuss this" or tier CTA pushes its
 * choice here and the form, further down the page, applies it without a navigation. The URL
 * (`?build=…&tier=…#consult`) is the other way in, read once by the form on mount.
 */
type Entry = Prefill & { seq: number };

let current: Entry = { seq: 0 };
const listeners = new Set<() => void>();

export function pushPrefill(p: Prefill) {
  current = { ...p, seq: current.seq + 1 };
  for (const l of listeners) l();
}

/**
 * Calls `fn` with every prefill pushed from now on, and (on a later tick) with the one already
 * pushed, so a form that mounts after a click still gets it. Returns the unsubscribe.
 */
export function onPrefill(fn: (p: Prefill) => void) {
  const l = () => fn(current);
  listeners.add(l);
  if (current.seq) queueMicrotask(l);
  return () => void listeners.delete(l);
}
