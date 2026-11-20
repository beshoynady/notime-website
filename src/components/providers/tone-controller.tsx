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
 * - the page background (#page-stage's own background-color, not the inherited `--page-bg`: a custom
 *   property tweened on the stage re-styled every element under it on every frame, ~90 ms a frame on a
 *   phone at 4× CPU) tweens to a section's ground (`--tone-ground`, which a
 *   theme may set, globals.css) as it crosses 55% of the viewport;
 * - `data-ground` on the stage names the ground's tone. Each section paints its own ground
 *   (globals.css), so its text never sits on the wrong one (M1: About's stats on ivory measured
 *   about 1.1:1). Sections on the other tone used to fade out instead, which left up to half a
 *   screen empty at each tone change (W02); `data-zone` only marks the sections now;
 * - the header switches tone when a section passes under it (`data-header-tone` on #site-header):
 *   the section's own tone (or "hero"), since every section paints its own ground.
 */
/** A section's ground: its `--tone-ground`, or the tone's default when a page sets none. */
function groundOf(section: HTMLElement) {
  return (
    getComputedStyle(section).getPropertyValue("--tone-ground").trim() ||
    PAGE_BG[(section.dataset.tone as Tone) ?? "dark"]
  );
}

export function ToneController() {
  const pathname = usePathname();
  const locale = useLocale();

  useGSAP(
    () => {
      const stage = document.getElementById("page-stage");
      const header = document.getElementById("site-header");
      if (!stage) return;
      const duration = prefersReducedMotion() ? 0 : 0.9;
      const headerH = header?.offsetHeight ?? 68;
      // Only the visible page: under cacheComponents, pages left behind by a client
      // navigation stay in the DOM hidden (React Activity) and must not get triggers.
      const sections = gsap.utils
        .toArray<HTMLElement>("#page-stage section[data-tone]")
        .filter((s) => s.checkVisibility?.() ?? true);

      // A section's scroll box: its pin spacer when another controller pins it (the spacer
      // holds the whole pinned distance), otherwise the section itself. Read at refresh time.
      // These zones only read layout, so they refresh last (refreshPriority -1): ScrollTrigger
      // re-applies each pin's spacing only when it reaches that pin, and a zone refreshed
      // before a pin measured every section below it one pin length too high (D73: the Events
      // opening's pin turned the ground ivory under section VI).
      const box = (el: HTMLElement) =>
        el.parentElement?.classList.contains("pin-spacer")
          ? el.parentElement
          : el;
      const docTop = (el: HTMLElement) =>
        box(el).getBoundingClientRect().top + window.scrollY;

      let underHeader: HTMLElement | undefined;
      let groundTone: Tone = "dark";
      const setHeader = () => {
        if (!header || !underHeader) return;
        header.dataset.headerTone =
          underHeader.dataset.header === "hero"
            ? "hero"
            : ((underHeader.dataset.tone as Tone) ?? "dark");
      };
      const setGround = (section: HTMLElement) => {
        groundTone = (section.dataset.tone as Tone) ?? "dark";
        stage.dataset.ground = groundTone;
        setHeader();
      };

      // Initial state: the first section, set BEFORE the zones exist. A zone already active at
      // load (a short opening on a phone puts the next section's zone at scroll 0) toggles on as
      // it's created and must have the last word; set after, this used to reset the tone to the
      // first section while the ground had already turned, leaving the active section hidden.
      const first = sections[0];
      if (first) {
        gsap.set(stage, { backgroundColor: groundOf(first) });
        underHeader = first;
        setGround(first);
      }

      // The footer paints its own ground, so it never turns the page's (D105): at the bottom of a
      // page the last light section stayed on screen while the footer's zone turned the ground
      // dark and faded it out. The last section above the footer holds the ground to the end.
      // Any other section that paints its own ground (data-bg="own") likewise, except the page's
      // first, which sets the initial ground (the hero): /services' closing CTA (self-audit B12).
      const grounds = sections.filter(
        (s, i) => !s.closest("footer") && (i === 0 || s.dataset.bg !== "own"),
      );

      sections.forEach((section, i) => {
        section.dataset.zone = "";
        const ground = groundOf(section);
        // Zones run from a section's top to the next section's top (no gaps), as numbers
        // rather than trigger strings: with the pinned hero as the trigger element,
        // ScrollTrigger subtracts the pin's own length from its positions (measured: the
        // header went back to the hero tone only 1.4 viewports too late on the way up).
        const next = sections[i + 1];
        const zone = (
          line: () => number,
          to: HTMLElement | undefined = next,
        ) => ({
          start: () => docTop(section) - line(),
          end: () =>
            (to ? docTop(to) : docTop(section) + box(section).offsetHeight) -
            line(),
        });
        const g = grounds.indexOf(section);
        if (g !== -1) {
          const nextGround = grounds[g + 1];
          ScrollTrigger.create({
            ...zone(() => innerHeight * 0.55, nextGround),
            ...(nextGround ? {} : { end: "max" }),
            refreshPriority: -1,
            onToggle: (self) => {
              if (!self.isActive) return;
              gsap.to(stage, {
                backgroundColor: ground,
                duration,
                ease: "power2.out",
                overwrite: "auto",
              });
              setGround(section);
            },
          });
        }
        if (header) {
          ScrollTrigger.create({
            ...zone(() => headerH),
            refreshPriority: -1,
            onToggle: (self) => {
              if (!self.isActive) return;
              underHeader = section;
              setHeader();
            },
          });
        }
      });

      stage.dataset.toneReady = "";
      ScrollTrigger.refresh();

      return () => {
        delete stage.dataset.toneReady;
        delete stage.dataset.ground;
        sections.forEach((section) => delete section.dataset.zone);
      };
    },
    { dependencies: [pathname, locale], revertOnUpdate: true },
  );

  return null;
}
