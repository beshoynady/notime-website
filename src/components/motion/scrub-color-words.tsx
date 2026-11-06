"use client";

import { useRef, type ElementType } from "react";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/gsap";

const DIM = "rgba(234, 212, 171, 0.3)"; // champagne at 30%
const LIT = "#F5E9D3"; // ivory

/**
 * A statement whose words colour in from champagne/30% to ivory as it scrolls through.
 * At rest (no JS, reduced motion) every word is ivory — the final state.
 */
export function ScrubColorWords({ text, as: Tag = "p", className }: { text: string; as?: ElementType; className?: string }) {
  const el = useRef<HTMLElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      if (!el.current || prefersReducedMotion()) return;
      gsap.fromTo(
        el.current.querySelectorAll("[data-w]"),
        { color: DIM },
        { color: LIT, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el.current, start: "top 80%", end: "bottom 45%", scrub: true } },
      );
    },
    { scope: el, dependencies: [text] },
  );

  return (
    <Tag ref={el} className={className}>
      {words.map((w, i) => (
        <span key={`${i}-${w}`} data-w="" style={{ color: LIT }}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
