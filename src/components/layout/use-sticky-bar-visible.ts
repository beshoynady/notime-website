"use client";

import { useEffect, useState } from "react";

/**
 * Whether a mobile sticky bar should show (shared by the site's CTA bar and Software's bar): the
 * page's opening (`openingSelector`, else the first `main section`) has scrolled away, no element
 * matching `formSelector` is in view, and no text field has focus (the on-screen keyboard is up).
 */
export function useStickyBarVisible(openingSelector: string, formSelector: string): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const opening = document.querySelector(openingSelector) ?? document.querySelector("main section");
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
  }, [openingSelector, formSelector]);

  return show;
}
