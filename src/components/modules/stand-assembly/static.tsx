import type { ModuleProps } from "../types";
import { StandView } from "./view";

/** Server fallback (the reduced-motion state): the stand assembled, the six steps numbered. */
export function StandAssemblyStatic({ locale }: ModuleProps) {
  return <StandView locale={locale} />;
}
