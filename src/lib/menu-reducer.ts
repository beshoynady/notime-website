import type { CategorySlug } from "@/content/types";

/** A click within this many ms after a hover-intent open is ignored (prevents open→close flicker). */
export const CLICK_GRACE_MS = 450;
/** Hover must rest on the trigger this long before the panel opens. */
export const OPEN_INTENT_MS = 90;
/** The pointer may leave the header this long before the panel closes. */
export const CLOSE_DELAY_MS = 240;

export interface MenuState {
  open: boolean;
  active: CategorySlug;
  openedAt: number;
}

export type MenuEvent =
  | { type: "INTENT_OPEN"; now: number }
  | { type: "CLICK_TRIGGER"; now: number }
  | { type: "CLOSE" }
  | { type: "SET_ACTIVE"; slug: CategorySlug };

export function initialMenuState(active: CategorySlug): MenuState {
  return { open: false, active, openedAt: 0 };
}

/** Pure mega-menu state machine; timers live in the hook (useMegaMenu). */
export function menuReducer(state: MenuState, e: MenuEvent): MenuState {
  switch (e.type) {
    case "INTENT_OPEN":
      return state.open ? state : { ...state, open: true, openedAt: e.now };
    case "CLICK_TRIGGER":
      if (!state.open) return { ...state, open: true, openedAt: e.now };
      return e.now - state.openedAt < CLICK_GRACE_MS ? state : { ...state, open: false };
    case "CLOSE":
      return state.open ? { ...state, open: false } : state;
    case "SET_ACTIVE":
      return state.active === e.slug ? state : { ...state, active: e.slug };
  }
}
