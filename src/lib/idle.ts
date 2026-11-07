/** Where requestIdleCallback is missing (Safari), run this long after the painted frame. */
const FALLBACK_DELAY_MS = 50;

/**
 * Run `cb` after the first frame has painted and the main thread is idle, at the latest
 * `timeout` ms after that. Used to keep non-critical setup (hero canvas, Lenis) out of the
 * hydration task, so first paint and the LCP text come first. Returns a cancel function.
 *
 * Order: rAF (runs just before a frame paints) → a task (runs after that frame) →
 * requestIdleCallback({ timeout }), or a short timer where it is unsupported.
 */
export function afterFirstPaint(cb: () => void, { timeout = 500 }: { timeout?: number } = {}): () => void {
  let cancelled = false;
  let raf = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let idle: number | undefined;
  const run = () => {
    if (cancelled) return;
    cancelled = true; // once
    cb();
  };

  raf = requestAnimationFrame(() => {
    timer = setTimeout(() => {
      if (cancelled) return;
      if (typeof requestIdleCallback === "function") idle = requestIdleCallback(run, { timeout });
      else timer = setTimeout(run, FALLBACK_DELAY_MS);
    }, 0);
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    clearTimeout(timer);
    if (idle !== undefined) cancelIdleCallback(idle); // set only where requestIdleCallback exists
  };
}
