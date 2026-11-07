"use client";

import type { SplitText as SplitTextClass } from "gsap/SplitText";
import { gsap } from "./gsap";

export type { SplitText } from "gsap/SplitText";
export type SplitTextPlugin = typeof SplitTextClass;

let pending: Promise<SplitTextPlugin> | null = null;

/**
 * The GSAP SplitText plugin, downloaded and registered on first use (D44): only the
 * desktop hero and the word reveals need it, so it stays out of the mobile page.
 * A failed download is not cached, so a later call retries.
 */
export function loadSplitText(): Promise<SplitTextPlugin> {
  pending ??= import("gsap/SplitText").then(
    ({ SplitText }) => {
      gsap.registerPlugin(SplitText);
      return SplitText;
    },
    (err) => {
      pending = null;
      throw err;
    },
  );
  return pending;
}

/**
 * Run `fn` inside `ctx` once SplitText is loaded (so the context's revert also reverts the
 * split), or `onFail` if it cannot load. Returns a cancel function for the caller's cleanup.
 * The flag is per call on purpose: `ctx.isReverted` cannot guard a late promise, because
 * useGSAP and gsap.matchMedia reuse one context across runs and `add()` resets it.
 */
export function withSplitText(ctx: gsap.Context, fn: (Split: SplitTextPlugin) => void, onFail?: () => void): () => void {
  let live = true;
  loadSplitText().then(
    (Split) => live && ctx.add(() => fn(Split)),
    () => live && onFail && ctx.add(onFail),
  );
  return () => {
    live = false;
  };
}
