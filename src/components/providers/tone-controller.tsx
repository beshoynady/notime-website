"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const PAGE_BG = { dark: "#2E2017", light: "#F5E9D3" } as const;
type Tone = keyof typeof PAGE_BG;
export type HeaderTone = Tone | "hero";

/**
 * Page tone system (DECISIONS F):
 * - the page background (#stage, `--page-bg`) tweens to a section's tone as it crosses 55% of the viewport;
 * - the header switches tone when a section passes under it (`data-header-tone` on #site-header).
 * Sections only become transparent once this controller has run (`#stage[data-tone-ready]`),
 * so the page stays readable if JS fails.
 */
export function ToneController() {
  const pathname = usePathname();
  const locale = useLocale();

  useGSAP(
    () => {
      const stage = document.getElementById("stage");
      const header = document.getElementById("site-header");
      if (!stage) return;
      const duration = prefersReducedMotion() ? 0 : 0.9;
      const headerH = header?.offsetHeight ?? 68;
      const sections = gsap.utils.toArray<HTMLElement>("section[data-tone]");

      sections.forEach((section) => {
        const tone = (section.dataset.tone as Tone) ?? "dark";
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) gsap.to(stage, { "--page-bg": PAGE_BG[tone], duration, ease: "power2.out", overwrite: "auto" });
          },
        });
        if (header) {
          ScrollTrigger.create({
            trigger: section,
            start: `top ${headerH}px`,
            end: `bottom ${headerH}px`,
            onToggle: (self) => {
              if (self.isActive) header.dataset.headerTone = section.dataset.header === "hero" ? "hero" : tone;
            },
          });
        }
      });

      // Initial state for the first section (before any toggle fires).
      const first = sections[0];
      if (first) gsap.set(stage, { "--page-bg": PAGE_BG[(first.dataset.tone as Tone) ?? "dark"] });
      stage.dataset.toneReady = "";
      ScrollTrigger.refresh();

      return () => {
        delete stage.dataset.toneReady;
      };
    },
    { dependencies: [pathname, locale], revertOnUpdate: true },
  );

  return null;
}
