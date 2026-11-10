"use client";

import { useRef } from "react";
import { QUOTE_LINK } from "@/components/layout/nav-links";
import { ButtonLink } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ORDER_STEPS, PRINT_ORDER_COPY as COPY, type OrderStep } from "@/content/modules/print-order";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ModuleProps } from "../types";
import "./print-order.css";

/**
 * Print order (spec §6, IV.23; v1 plan A8): "Order your print online" as the four steps of a
 * request, set as job tickets torn from one docket. No cart, no quantities to pick, no prices.
 * The steps are always fully visible (nothing waits on a tap), so the module is complete without
 * its CTA: the request link to `/contact?service=print-store` renders only once the contact page
 * is live (QUOTE_LINK.live, D83).
 *
 * Owner: GSAP, once: the tickets slide in from inline-start one after another as the module
 * scrolls in (storyboard: "like job tickets"); nothing else moves. Reduced motion, or a module
 * that mounts already on screen: the tickets are simply there.
 */
export default function PrintOrder({ service, locale }: ModuleProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const total = ORDER_STEPS.length;

  useGSAP(
    () => {
      const el = root.current;
      if (!el || reduced || el.getBoundingClientRect().top < innerHeight * 0.85) return;
      const tickets = el.querySelectorAll<HTMLElement>(".po-ticket");
      const dir = document.documentElement.dir === "rtl" ? -1 : 1;
      gsap.set(tickets, { autoAlpha: 0, x: -28 * dir });
      gsap.to(tickets, {
        autoAlpha: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="po">
      <h3 className="text-eyebrow po-title">{COPY.title[locale]}</h3>
      <ol className="po-steps">
        {ORDER_STEPS.map((step, i) => (
          <li key={step.id} className="po-ticket" data-step={step.id}>
            <span className="po-stub" aria-hidden="true">
              <span className="po-num">{String(i + 1).padStart(2, "0")}</span>
            </span>
            <div className="po-body">
              <StepIcon id={step.id} />
              <h4 className="po-step-title">
                <span className="sr-only">
                  {COPY.step[locale].replace("{n}", String(i + 1)).replace("{total}", String(total))}:{" "}
                </span>
                {step.title[locale]}
              </h4>
              <p className="po-line">{step.line[locale]}</p>
            </div>
          </li>
        ))}
      </ol>
      {QUOTE_LINK.live && (
        <ButtonLink href={`${QUOTE_LINK.href}?service=${service.anchor}`} variant="dark" arrow className="po-cta">
          {COPY.cta[locale]}
        </ButtonLink>
      )}
    </div>
  );
}

/** Line icons, one per step (cocoa, 1.25 stroke). The artwork's arrow points along the reading direction. */
function StepIcon({ id }: { id: OrderStep["id"] }) {
  const paths: Record<OrderStep["id"], string> = {
    // a business card beside a roll-up on its base
    item: "M4 20h17v11H4zM26 5h9v26h-9zM24 31h13",
    // a sheet with a folded corner, sent toward inline-end
    artwork: "M6 4h13l6 6v24H6zM19 4v6h6M27 20h9M32 16l4 4-4 4",
    // a proof with crop marks, approved
    proof: "M10 8h20v24H10zM4 8h3M10 2v3M33 8h3M30 2v3M4 32h3M10 35v3M33 32h3M30 35v3M15 20l4 4 7-8",
    // printed sheets, stacked, with a registration target
    print: "M8 12h22v22H8zM11 9h22v22M14 6h22v22M19 23m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M19 17v12M13 23h12",
  };
  return (
    <svg className="po-icon" data-dir={id === "artwork" ? "" : undefined} viewBox="0 0 40 40" aria-hidden="true">
      <path d={paths[id]} />
    </svg>
  );
}
