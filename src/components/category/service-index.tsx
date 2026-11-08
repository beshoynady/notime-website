"use client";

import { List, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { anchorOffset } from "@/components/providers/anchor-scroll";
import { Numeral } from "@/components/ui/numeral";
import { mediaQueryList } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { activeIndex } from "@/lib/scrollspy";

export interface IndexItem {
  anchor: string;
  numeral: string;
  title: string;
}

/** The chip bar (below 900px) sits under the header, so landings and the spy line count it. */
const CHIP_BAR_MEDIA = "(max-width: 899.98px)";
/** A landing is within ±4px of the offset; the line sits a little lower so it always counts. */
const LINE_SLACK = 8;

/** Scrolls the active chip to the middle of the chip bar (inside the bar only, never the page). */
function centerChip(list: HTMLElement, chip: HTMLElement, instant: boolean) {
  if (list.scrollWidth <= list.clientWidth) return;
  // Measured on screen, so it holds in RTL too (where scrollLeft runs negative); the browser
  // clamps the result to the bar's scroll range.
  const c = chip.getBoundingClientRect();
  const l = list.getBoundingClientRect();
  const delta = c.left + c.width / 2 - (l.left + l.width / 2);
  list.scrollTo({ left: list.scrollLeft + delta, behavior: instant ? "instant" : "smooth" });
}

/**
 * Category page · service index (spec §4, part 2): a sticky rail at ≥ 900px, a sticky chip bar
 * below. Plain hash links, so the anchor utility lands them (D53) and they work without JS.
 * Scrollspy: ScrollTrigger only holds state (tops measured on refresh, activeIndex on update);
 * Motion moves the indicator (layoutId). The active link has aria-current="location".
 *
 * Below 900px a toggle at the bar's inline-start opens the same list as full-width rows, so any
 * service is two taps away (review D73: Catering sat at x = 940 on a 390px screen, three to five
 * actions away). The links aren't duplicated; choosing one, Escape or a tap outside closes it.
 */
export function ServiceIndex({ items, label }: { items: IndexItem[]; label: string }) {
  const [active, setActive] = useState(-1);
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const listId = useId();

  // Open: Escape (focus back on the toggle), a tap outside, or growing past the chip bar's
  // width (the rail has no toggle) closes it, as the mobile menu does.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      toggleRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) close();
    };
    const mq = mediaQueryList(CHIP_BAR_MEDIA);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", close);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", close);
    };
  }, [open]);

  useGSAP(
    () => {
      const sections = items.map((it) => document.getElementById(it.anchor));
      let tops: number[] = [];
      let offset = 0;
      const update = () => setActive(activeIndex(tops, window.scrollY + offset + LINE_SLACK));
      const measure = () => {
        tops = sections.map((s) => (s ? s.getBoundingClientRect().top + window.scrollY : Infinity));
        offset = anchorOffset(sections[0] ?? undefined);
        update();
      };
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: measure });
      measure();
    },
    { dependencies: [items] },
  );

  useEffect(() => {
    const list = listRef.current;
    const chip = active >= 0 ? list?.children[active]?.firstElementChild : null;
    if (list && chip instanceof HTMLElement && !open) centerChip(list, chip, reduced);
  }, [active, reduced, open]);

  return (
    <nav ref={navRef} aria-label={label} className="svc-index" data-anchor-offset={CHIP_BAR_MEDIA} data-open={open ? "" : undefined}>
      <button
        ref={toggleRef}
        type="button"
        className="svc-index-toggle"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X aria-hidden="true" strokeWidth={1.25} className="size-5" /> : <List aria-hidden="true" strokeWidth={1.25} className="size-5" />}
      </button>
      <ol ref={listRef} id={listId} onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
        {items.map((it, i) => (
          <li key={it.anchor}>
            <a href={`#${it.anchor}`} className="svc-index-link" aria-current={i === active ? "location" : undefined}>
              {i === active && (
                <motion.span
                  layoutId="svc-index-indicator"
                  className="svc-index-ind"
                  aria-hidden="true"
                  transition={reduced ? { duration: 0 } : { duration: 0.5, ease: ease.expoOut }}
                />
              )}
              <Numeral className="svc-index-num">{it.numeral}</Numeral>
              <span className="svc-index-title">{it.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
