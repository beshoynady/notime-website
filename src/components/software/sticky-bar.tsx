"use client";

import { useStickyBarVisible } from "@/components/layout/use-sticky-bar-visible";
import { CONSULT_ID } from "@/lib/prefill";

/**
 * The mobile sticky bar (D65; brief A): the intro call, and the free website review as the second
 * option. It appears once the opening has scrolled away, and hides while #consult or the review
 * form is in view and while a form field has focus (the on-screen keyboard is up). Its height is
 * reserved at the page's end (software.css), so it never covers content or the focused element.
 * Mobile only (CSS). The floating WhatsApp button sits above it while it shows (software.css; it
 * doesn't render at all until a number is configured, D78). The visibility logic is shared with the
 * site's CTA bar (use-sticky-bar-visible.ts).
 */
export function StickyBar({ label, book, review, reviewId }: { label: string; book: string; review: string; reviewId: string }) {
  const show = useStickyBarVisible("[data-cta-opening]", `#${CONSULT_ID}, #${reviewId}`);

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
