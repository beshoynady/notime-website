"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { ModuleKey } from "@/content";
import { afterFirstPaint } from "@/lib/idle";
import { MODULES, SlotContext } from "./registry";
import type { ModuleProps } from "./types";

/**
 * The region a signature module lives in (spec §4): `role="group"` named by the section's H2.
 * - Renders the static fallback (`children`): on the server, without JS, and until the module is in.
 * - Loads the module once the slot is within one viewport, after first paint.
 * - Swaps it in inside the same box: the box keeps the fallback's height as its minimum, so
 *   nothing below moves. While the chunk loads Suspense shows the fallback; if it fails, the
 *   fallback stays (registry: Failed).
 * - `data-module-ready` marks a mounted module (tests, and modules' own CSS hooks).
 */
export function ModuleSlot({
  moduleKey,
  titleId,
  children,
  ...props
}: ModuleProps & { moduleKey: ModuleKey; titleId: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [minBlock, setMinBlock] = useState<number>();
  const onReady = useCallback(() => setReady(true), []);
  const Module = MODULES[moduleKey];

  useEffect(() => {
    const el = ref.current;
    if (!Module || !el) return;
    let io: IntersectionObserver | undefined;
    const cancel = afterFirstPaint(() => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          setMinBlock(el.offsetHeight);
          setActive(true);
        },
        { rootMargin: "100% 0px" },
      );
      io.observe(el);
    });
    return () => {
      cancel();
      io?.disconnect();
    };
  }, [Module]);

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={titleId}
      className="svc-module"
      data-module={moduleKey}
      data-module-ready={ready ? "" : undefined}
      style={minBlock ? { minBlockSize: minBlock } : undefined}
    >
      {active && Module ? (
        <SlotContext value={{ fallback: children, onReady }}>
          <Suspense fallback={children}>
            <Module {...props} />
          </Suspense>
        </SlotContext>
      ) : (
        children
      )}
    </div>
  );
}
