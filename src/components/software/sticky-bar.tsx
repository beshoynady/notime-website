"use client";

import { useEffect, useState } from "react";
import { CONSULT_ID } from "@/lib/prefill";

/**
 * The mobile sticky bar (D65; brief A): the intro call, and the free website review as the second
 * option. It appears once the opening has scrolled away, and hides while #consult or the review
 * form is in view and while a form field has focus (the on-screen keyboard is up). Its height is
 * reserved at the page's end (software.css), so it never covers content or the focused element.
 * Mobile only (CSS). The floating WhatsApp button hides while it shows (software.css; it doesn't
 * render at all until a number is configured, D78).
 */
export function StickyBar({ label, book, review, reviewId }: { label: string; book: string; review: string; reviewId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const opening = document.querySelector(".sw-opening");
    const forms = [document.getElementById(CONSULT_ID), document.getElementById(reviewId)].filter((x): x is HTMLElement => !!x);
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
    for (const f of forms) io.observe(f);

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
  }, [reviewId]);

  return (
    <div className="sw-sticky" data-show={show || undefined} role="region" aria-label={label} inert={!show}>
      <a href={`#${CONSULT_ID}`} className="sw-btn sw-btn-dark sw-sticky-main">
        <span>{book}</span>
      </a>
      <a href={`#${reviewId}`} className="sw-btn sw-btn-ghost sw-sticky-alt">
        <span>{review}</span>
      </a>
    </div>
  );
}
