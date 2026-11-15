"use client";

import type { MouseEvent, ReactNode } from "react";
import { scrollToAnchor } from "@/components/providers/anchor-scroll";
import { useLenis } from "@/components/providers/lenis-provider";
import { pushPrefill } from "@/components/forms/prefill-store";
import { CONSULT_ID, prefillHref, type Prefill } from "@/lib/prefill";

/**
 * "Discuss this" / "Talk about Grow": a real link (`?build=apps#consult`) that works with the URL
 * alone (no JS, a new tab, a shared link). On the page it presets the form through the store and
 * lands on #consult with the site's anchor behaviour (D53), without a navigation.
 */
export function PrefillLink({ prefill, className, children, label }: { prefill: Prefill; className?: string; children: ReactNode; label?: string }) {
  const lenis = useLenis();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = document.getElementById(CONSULT_ID);
    if (!target) return;
    pushPrefill(prefill);
    // The site's anchor handler already took a same-query link; otherwise land here.
    if (e.defaultPrevented) return;
    e.preventDefault();
    scrollToAnchor(lenis, target);
  };
  return (
    <a href={prefillHref(prefill)} className={className} onClick={onClick} aria-label={label}>
      {children}
    </a>
  );
}
