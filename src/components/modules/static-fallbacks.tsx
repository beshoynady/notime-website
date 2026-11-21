import type { ComponentType } from "react";
import type { ModuleKey } from "@/content";
import { CandleMoodboardStatic } from "./candle-moodboard/static";
import { MenuMajlisStatic } from "./menu-majlis/static";
import { StageLightsStatic } from "./stage-lights/static";
import type { ModuleProps } from "./types";

/**
 * Server fallbacks (Task 3.3–3.8): a module's final state, rendered on the server in the same box
 * the client module mounts into, so the section reads complete without JS, under reduced motion
 * and before the chunk arrives. A key without one keeps the empty fallback (fill or hide, D78) and
 * its height reservation (category.css). Server-only: the client registry is registry.tsx.
 */
export const STATIC_FALLBACKS: Partial<Record<ModuleKey, ComponentType<ModuleProps>>> = {
  // The Events & Hospitality modules (batch 2).
  "candle-moodboard": CandleMoodboardStatic,
  "menu-majlis": MenuMajlisStatic,
  "stage-lights": StageLightsStatic,
};
