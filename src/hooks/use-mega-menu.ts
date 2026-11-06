"use client";

import { useCallback, useEffect, useReducer, useRef, type FocusEvent, type PointerEvent } from "react";
import type { CategorySlug } from "@/content/types";
import { CLOSE_DELAY_MS, OPEN_INTENT_MS, initialMenuState, menuReducer } from "@/lib/menu-reducer";
import { setOverlayOpen } from "@/lib/overlay";

const PANEL_ID = "mega-panel";

/**
 * Mega-menu behaviour: hover intent (90ms, fine pointers only) or click to open;
 * close 240ms after the pointer leaves the header, on Esc (focus returns to the
 * trigger), on backdrop click, when focus leaves trigger+panel, on a link click,
 * and when the viewport drops below 900px.
 */
export function useMegaMenu(firstCategory: CategorySlug) {
  const [state, dispatch] = useReducer(menuReducer, firstCategory, initialMenuState);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

  const close = useCallback((returnFocus = false) => {
    clearTimers();
    dispatch({ type: "CLOSE" });
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Header-level hover tracking; Esc, resize and the page-level overlay flag below.
  useEffect(() => {
    const header = triggerRef.current?.closest<HTMLElement>("#site-header");
    if (!header) return;
    const isMouse = (e: globalThis.PointerEvent) => e.pointerType === "mouse";
    const onEnter = (e: globalThis.PointerEvent) => isMouse(e) && window.clearTimeout(closeTimer.current);
    const onLeave = (e: globalThis.PointerEvent) => {
      if (!isMouse(e)) return;
      window.clearTimeout(openTimer.current);
      closeTimer.current = window.setTimeout(() => dispatch({ type: "CLOSE" }), CLOSE_DELAY_MS);
    };
    header.addEventListener("pointerenter", onEnter);
    header.addEventListener("pointerleave", onLeave);
    return () => {
      header.removeEventListener("pointerenter", onEnter);
      header.removeEventListener("pointerleave", onLeave);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!state.open) {
      setOverlayOpen(false);
      return;
    }
    setOverlayOpen(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => !mq.matches && close();
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [state.open, close]);

  const triggerProps = {
    ref: triggerRef,
    type: "button" as const,
    "aria-expanded": state.open,
    "aria-controls": PANEL_ID,
    onClick: () => {
      clearTimers();
      dispatch({ type: "CLICK_TRIGGER", now: Date.now() });
    },
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      window.clearTimeout(closeTimer.current);
      openTimer.current = window.setTimeout(() => dispatch({ type: "INTENT_OPEN", now: Date.now() }), OPEN_INTENT_MS);
    },
    onPointerLeave: () => window.clearTimeout(openTimer.current),
  };

  /** Spread on the element wrapping trigger + panel: closes when focus leaves both. */
  const regionProps = {
    onBlur: (e: FocusEvent<HTMLElement>) => {
      if (state.open && !e.currentTarget.contains(e.relatedTarget as Node | null)) close();
    },
  };

  const setActive = (slug: CategorySlug) => dispatch({ type: "SET_ACTIVE", slug });

  return { state, triggerProps, regionProps, panelId: PANEL_ID, setActive, close };
}
