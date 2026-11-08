"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { anchorOffset } from "@/components/providers/anchor-scroll";
import { Numeral } from "@/components/ui/numeral";
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
 */
export function ServiceIndex({ items, label }: { items: IndexItem[]; label: string }) {
  const [active, setActive] = useState(-1);
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

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
    if (list && chip instanceof HTMLElement) centerChip(list, chip, reduced);
  }, [active, reduced]);

  return (
    <nav aria-label={label} className="svc-index" data-anchor-offset={CHIP_BAR_MEDIA}>
      <ol ref={listRef}>
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
