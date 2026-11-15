import type { ModuleProps } from "../types";
import { AgendaView } from "./view";

/** Server fallback: the full agenda, every slot lit (the reduced-motion state). */
export function AgendaTimelineStatic({ locale }: ModuleProps) {
  return <AgendaView locale={locale} />;
}
