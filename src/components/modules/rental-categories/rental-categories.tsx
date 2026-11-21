"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { QUOTE_LINK } from "@/components/layout/nav-links";
import { FrameCorners } from "@/components/ornaments/frame-corners";
import { ButtonLink } from "@/components/ui/button";
import { RENTAL_CATEGORIES as T, type RentalCategoryId } from "@/content/modules/rental-categories";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { microTransition } from "@/lib/motion";
import type { ModuleProps } from "../types";
import { RentalDrawing } from "./drawings";
import "./rental-categories.css";

/** How far a chosen card lifts, in px. */
const LIFT = 6;

/**
 * Equipment & camera rental · the four categories (category-pages.md §6 II.12; D81; plan A7).
 * Categories only: no models, brands, quantities or prices until a real inventory exists (OQ #22).
 *
 * Each card is a toggle (`aria-pressed`): choosing it lifts it and reveals its line, and the
 * summary above names what was chosen (the module's one polite live region). More than one can be
 * chosen, like packing a kit. Motion owns the lift (the card) and the reveal (its line), one element
 * each. The lines' space is reserved, so a reveal never moves anything.
 *
 * Reduced motion: every line shows, nothing moves; choosing still works, instantly.
 * "Ask for availability" opens the contact page for this service, and renders only once that
 * page exists (`QUOTE_LINK.live`, D83); until then the module is complete without it.
 */
export default function RentalCategories({ service, locale }: ModuleProps) {
  const reduced = useReducedMotion();
  const [chosen, setChosen] = useState<RentalCategoryId[]>([]);

  const toggle = (id: RentalCategoryId) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : T.categories.map((x) => x.id).filter((x) => x === id || c.includes(x))));

  const names = T.categories.filter((c) => chosen.includes(c.id)).map((c) => c.name[locale]);
  const summary = names.length ? `${T.selected[locale]} ${names.join(T.separator[locale])}` : T.hint[locale];
  const transition = reduced ? { duration: 0 } : microTransition;

  return (
    <div className="rc">
      <p className="rc-summary" aria-live="polite">
        {summary}
      </p>
      <ul className="rc-grid">
        {T.categories.map((c) => {
          const on = chosen.includes(c.id);
          return (
            <li key={c.id}>
              <motion.button
                type="button"
                className="rc-card"
                aria-pressed={on}
                onClick={() => toggle(c.id)}
                initial={false}
                animate={{ y: on && !reduced ? -LIFT : 0 }}
                transition={transition}
              >
                <FrameCorners tone="champagne" inset="sm" className="rc-corners" />
                <RentalDrawing id={c.id} className="rc-drawing" />
                <span className="rc-name">{c.name[locale]}</span>
                <motion.span
                  className="rc-line"
                  initial={false}
                  animate={{ opacity: on || reduced ? 1 : 0, y: on || reduced ? 0 : 6 }}
                  transition={transition}
                >
                  {c.line[locale]}
                </motion.span>
              </motion.button>
            </li>
          );
        })}
      </ul>
      {QUOTE_LINK.live && (
        <ButtonLink href={`${QUOTE_LINK.href}?service=${service.anchor}`} variant="primary" arrow className="rc-cta">
          {T.cta[locale]}
        </ButtonLink>
      )}
    </div>
  );
}
