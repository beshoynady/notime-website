"use client";

import { createContext, lazy, useContext, useEffect, type ComponentType, type LazyExoticComponent, type ReactNode } from "react";
import type { ModuleKey } from "@/content";
import type { ModuleProps } from "./types";

/** What the slot gives a loaded module: its static fallback and the ready signal. */
export const SlotContext = createContext<{ fallback: ReactNode; onReady: () => void }>({
  fallback: null,
  onReady: () => {},
});

/** A chunk that failed to load: the static fallback stays, and the slot is never marked ready. */
function Failed() {
  return useContext(SlotContext).fallback;
}

/** A loaded module: signals ready once it (and everything inside it) has committed. */
function withReady(Module: ComponentType<ModuleProps>) {
  return function ReadyModule(props: ModuleProps) {
    const { onReady } = useContext(SlotContext);
    useEffect(onReady, [onReady]);
    return <Module {...props} />;
  };
}

/**
 * Each module is its own chunk, loaded only when its slot nears the viewport. A failed import
 * resolves to Failed instead of throwing, so a blocked or broken chunk never reaches an error
 * boundary or the console.
 */
const load = (importer: () => Promise<{ default: ComponentType<ModuleProps> }>) =>
  lazy<ComponentType<ModuleProps>>(() =>
    importer().then(
      (m) => ({ default: withReady(m.default) }),
      () => ({ default: Failed }),
    ),
  );

/**
 * ModuleKey → lazy module. Partial while the modules are built one by one (Tasks 3.3–3.8 and
 * later): an unregistered key keeps its static fallback and never loads anything.
 */
export const MODULES: Partial<Record<ModuleKey, LazyExoticComponent<ComponentType<ModuleProps>>>> = {
  // Events & Hospitality (batch 2, Tasks 3.3–3.8).
  "agenda-timeline": load(() => import("./agenda-timeline/agenda-timeline")),
  "stand-assembly": load(() => import("./stand-assembly/stand-assembly")),
  "launch-reveal": load(() => import("./launch-reveal/launch-reveal")),
  "candle-moodboard": load(() => import("./candle-moodboard/candle-moodboard")),
  "menu-majlis": load(() => import("./menu-majlis/menu-majlis")),
  "stage-lights": load(() => import("./stage-lights/stage-lights")),
  // Batch 1 (D83): the template-built categories' modules.
  "rental-categories": load(() => import("./rental-categories/rental-categories")),
  "motion-playground": load(() => import("./motion-playground/motion-playground")),
  "press-release": load(() => import("./press-release/press-release")),
  "content-calendar": load(() => import("./content-calendar/content-calendar")),
  "print-order": load(() => import("./print-order/print-order")),
  "human-scale": load(() => import("./human-scale/human-scale")),
};
