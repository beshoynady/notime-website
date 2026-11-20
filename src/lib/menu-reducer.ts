import type { CategorySlug } from "@/content/types";

/** Hover must rest on the trigger this long before the panel opens. */
export const OPEN_INTENT_MS = 90;
/** The pointer may leave the header this long before the panel closes. */
export const CLOSE_DELAY_MS = 240;

export interface MenuState {
  open: boolean;
  active: CategorySlug;
  /** How the open panel was opened; null while closed. */
  openedBy: "hover" | "click" | null;
}

export type MenuEvent = { type: "INTENT_OPEN" } | { type: "CLICK_TRIGGER" } | { type: "CLOSE" } | { type: "SET_ACTIVE"; slug: CategorySlug };

export function initialMenuState(active: CategorySlug): MenuState {
  return { open: false, active, openedBy: null };
}

/**
 * Pure mega-menu state machine; timers live in the hook (useMegaMenu).
 * A click on a panel the hover opened keeps it open and holds it as clicked: the visitor who
 * hovers, reads, then clicks «Services» means "open it" (self-audit B09; a 450 ms grace used to
 * let a later click close it). Only a click on a click-opened panel closes it.
 */
export function menuReducer(state: MenuState, e: MenuEvent): MenuState {
  switch (e.type) {
    case "INTENT_OPEN":
      return state.open ? state : { ...state, open: true, openedBy: "hover" };
    case "CLICK_TRIGGER":
      if (!state.open) return { ...state, open: true, openedBy: "click" };
      return state.openedBy === "hover" ? { ...state, openedBy: "click" } : { ...state, open: false, openedBy: null };
    case "CLOSE":
      return state.open ? { ...state, open: false, openedBy: null } : state;
    case "SET_ACTIVE":
      return state.active === e.slug ? state : { ...state, active: e.slug };
  }
}
