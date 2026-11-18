"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Whether a mobile sticky bar should show (shared by the site's CTA bar and Software's bar): the
 * page's opening (`openingSelector`, else the first `main section`) has scrolled away, no element
 * matching `formSelector` is in view, and no text field has focus (the on-screen keyboard is up).
 * Re-evaluated on every path change: the site's bar remounts per path (mobile-cta-bar.tsx), and
 * `pathname` re-runs the effect for a bar that stays mounted.
 */
export function useStickyBarVisible(openingSelector: string, formSelector: string): boolean {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // The visible page's opening: under cacheComponents, pages left behind by a client navigation
    // stay in the DOM hidden (React Activity, D32), so the first match may be a hidden page's.
    // When none is visible yet, the first match, as before.
    const visible = (sel: string) => Array.from(document.querySelectorAll(sel)).find((el) => el.checkVisibility?.() ?? true);
    const opening = visible(openingSelector) ?? visible("main section") ?? document.querySelector(openingSelector) ?? document.querySelector("main section");
    const forms = Array.from(document.querySelectorAll(formSelector));
    const state = { past: false, inForm: new Set<Element>(), typing: false };
    const update = () => setShow(state.past && state.inForm.size === 0 && !state.typing);

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === opening) state.past = !e.isIntersecting && e.boundingClientRect.top < 0;
        else if (e.isIntersecting) state.inForm.add(e.target);
        else state.inForm.delete(e.target);
      }
      update();
    });
    if (opening) io.observe(opening);
    for (const f of forms) if (f !== opening) io.observe(f);

    const isField = (t: EventTarget | null) => t instanceof HTMLElement && t.matches("input:not([type=radio]):not([type=checkbox]), textarea, select");
    const onIn = (e: FocusEvent) => {
      state.typing = isField(e.target);
      update();
    };
    const onOut = () => {
      state.typing = false;
      update();
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      io.disconnect();
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, [openingSelector, formSelector, pathname]);

  return show;
}
