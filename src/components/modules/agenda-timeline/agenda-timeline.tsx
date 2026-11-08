"use client";

import { ModulePlaceholder } from "../module-placeholder";

/**
 * Stub (Task 2.4): renders exactly the static fallback, so the slot's loading, readiness,
 * failure and no-shift behaviour can be tested before the real module (Task 3.3) exists.
 * TODO: replace placeholder — the agenda timeline module (spec §6, I.1).
 */
export default function AgendaTimeline() {
  return <ModulePlaceholder />;
}
