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
      // Only the visible page: under cacheComponents, pages left behind by a client
      // navigation stay in the DOM hidden (React Activity) and must not get triggers.
      const sections = gsap.utils.toArray<HTMLElement>("#stage section[data-tone]").filter((s) => s.checkVisibility());

      // A section's scroll box: its pin spacer when another controller pins it (the spacer
      // holds the whole pinned distance), otherwise the section itself. Read at refresh time,
      // so a pin created after these triggers is still included.
      const box = (el: HTMLElement) => (el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el);
      const docTop = (el: HTMLElement) => box(el).getBoundingClientRect().top + window.scrollY;

      sections.forEach((section, i) => {
        const tone = (section.dataset.tone as Tone) ?? "dark";
        // Zones run from a section's top to the next section's top (no gaps), as numbers
        // rather than trigger strings: with the pinned hero as the trigger element,
        // ScrollTrigger subtracts the pin's own length from its positions (measured: the
        // header went back to the hero tone only 1.4 viewports too late on the way up).
        const next = sections[i + 1];
        const zone = (line: () => number) => ({
          start: () => docTop(section) - line(),
          end: () => (next ? docTop(next) : docTop(section) + box(section).offsetHeight) - line(),
        });
        ScrollTrigger.create({
          ...zone(() => innerHeight * 0.55),
          onToggle: (self) => {
            if (self.isActive) gsap.to(stage, { "--page-bg": PAGE_BG[tone], duration, ease: "power2.out", overwrite: "auto" });
          },
        });
        if (header) {
          ScrollTrigger.create({
            ...zone(() => headerH),
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
