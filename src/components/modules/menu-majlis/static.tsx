import type { ModuleProps } from "../types";
import { MenuView } from "./view";

/** Server fallback: the menu card, its dallah drawn (the reduced-motion state). */
export function MenuMajlisStatic({ locale }: ModuleProps) {
  return <MenuView locale={locale} />;
}
