"use client";

import { useCallback, useSyncExternalStore } from "react";

/** One MediaQueryList per query, created lazily (snapshot reads run on every render). */
const lists = new Map<string, MediaQueryList>();
export function mediaQueryList(query: string): MediaQueryList {
  let mq = lists.get(query);
  if (!mq) lists.set(query, (mq = window.matchMedia(query)));
  return mq;
}

/** Live `matchMedia(query).matches`; `serverValue` (default false) before hydration. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = mediaQueryList(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => mediaQueryList(query).matches,
    () => serverValue,
  );
}
