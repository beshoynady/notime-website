"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { InterestForm } from "@/components/forms/interest-form";
import type { Locale } from "@/content/types";
import type { PRODUCTS } from "@/lib/forms/schemas";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { microTransition } from "@/lib/motion";

/**
 * "Register interest" opens the product's form in place (a disclosure: the button's
 * aria-expanded names the state; Motion fades the panel in, instant under reduced motion).
 */
export function InterestDisclosure({
  locale,
  product,
  productName,
  label,
  closeLabel,
}: {
  locale: Locale;
  product: (typeof PRODUCTS)[number];
  productName: string;
  label: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const id = useId();
  return (
    <div className="sw-interest">
      <button type="button" className="sw-btn sw-btn-dark sw-btn-sm" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span>{open ? closeLabel : label}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="panel"
            className="sw-interest-panel"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 8 }}
            transition={microTransition}
          >
            <InterestForm locale={locale} source="software-digital" product={product} productName={productName} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
