"use client";

import { mediaQueryList, useMediaQuery } from "./use-media-query";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the user asks for reduced motion. On the server it is `false`, but the
 * CSS under `@media (prefers-reduced-motion: reduce)` and `html[data-reduced]`
 * already shows the final, static state before hydration.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery(QUERY);
}

/** Non-hook read for code that runs inside effects / GSAP contexts. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && mediaQueryList(QUERY).matches;
}
