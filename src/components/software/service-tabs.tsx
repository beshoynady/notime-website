"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ANCHOR_REVEAL } from "@/lib/anchor";

/** `num` is shown before the label when given; a panel is named by its tab unless `labelledBy` says otherwise. */
export type ServiceTab = { id: string; num?: string; label: string; panel: ReactNode; labelledBy?: string };

/**
 * A tab set for the Software page (Task C2, D161; WAI-ARIA tabs, automatic activation): the six
 * services, and the two ways to start at the end (the intro call and the website review).
 * Every panel is rendered on the server and only `hidden`, so its text is in the HTML. Arrows move
 * between tabs (mirrored in Arabic), Home/End jump to the ends. A link to a service's anchor
 * (`#apps`, on load or in-page) opens its panel: the site's anchor handler announces its target
 * (ANCHOR_REVEAL) before it measures where to land, and re-lands a deep link while the page settles.
 * Without JavaScript the tabs can't switch, so every panel shows in order and the tab row is hidden
 * (software.css, `html:not([data-js])`); a deep link then lands on its panel like any section.
 */
export function ServiceTabs({ items, label, className = "sw-blocks", panelClassName = "sw-block" }: { items: ServiceTab[]; label: string; className?: string; panelClassName?: string }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const indexOf = (id: string) => items.findIndex((t) => t.id === id);
    // A deep link can land before this listener exists (a phone hydrates after the first
    // landings): open the addressed panel on mount too; the anchor handler re-lands as it grows.
    const fromHash = indexOf(decodeURIComponent(location.hash.slice(1)));
    const raf = fromHash > 0 ? requestAnimationFrame(() => setActive(fromHash)) : 0;
    const onReveal = (e: Event) => {
      const panel = (e.target as Element).closest("[role='tabpanel']");
      const i = panel ? indexOf(panel.id) : -1;
      // Synchronous, so the anchor handler measures the open panel.
      if (i >= 0) flushSync(() => setActive(i));
    };
    // Back and forward between two panels' anchors switch the panel too.
    const onHash = () => {
      const i = indexOf(decodeURIComponent(location.hash.slice(1)));
      if (i >= 0) setActive(i);
    };
    el.addEventListener(ANCHOR_REVEAL, onReveal);
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener(ANCHOR_REVEAL, onReveal);
      window.removeEventListener("hashchange", onHash);
    };
  }, [items]);

  const choose = (i: number) => {
    setActive(i);
    const tab = tabs.current[i];
    tab?.focus();
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    const last = items.length - 1;
    let next: number | undefined;
    if (step) next = (active + step + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === undefined) return;
    e.preventDefault();
    choose(next);
  };

  return (
    <div ref={root} className={className}>
      <div role="tablist" aria-label={label} className="sw-tabs" onKeyDown={onKeyDown}>
        {items.map((t, i) => (
          <button
            key={t.id}
            ref={(b) => void (tabs.current[i] = b)}
            type="button"
            role="tab"
            id={`${t.id}-tab`}
            aria-controls={t.id}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            className="sw-tab"
            onClick={() => choose(i)}
          >
            {t.num && (
              <span className="sw-tab-num tabular" aria-hidden="true">
                {t.num}
              </span>
            )}
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <article key={t.id} id={t.id} role="tabpanel" aria-labelledby={t.labelledBy ?? `${t.id}-tab`} hidden={i !== active} className={panelClassName}>
          {t.panel}
        </article>
      ))}
    </div>
  );
}
