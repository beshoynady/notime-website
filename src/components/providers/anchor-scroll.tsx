"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLenis, type LenisControls } from "@/components/providers/lenis-provider";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { anchorScrollTop, sameDocumentHash } from "@/lib/anchor";
import { ScrollTrigger } from "@/lib/gsap";

/** How long a deep link keeps re-landing while late layout (pin spacer, fonts, images) settles. */
const SETTLE_MS = 2500;

/** The heading that names `target`: itself, its aria-labelledby element, or its first h1-h3. */
function headingFor(target: HTMLElement): HTMLElement {
  if (/^H[1-6]$/.test(target.tagName)) return target;
  const labelled = target.getAttribute("aria-labelledby")?.split(" ")[0];
  const byLabel = labelled ? document.getElementById(labelled) : null;
  return byLabel ?? target.querySelector<HTMLElement>("h1, h2, h3") ?? target;
}

/** Moves focus without scrolling; the heading gets tabindex="-1" (no outline, see globals.css). */
function focusHeading(target: HTMLElement) {
  const h = headingFor(target);
  if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
  h.focus({ preventScroll: true });
}

function landingTop(target: HTMLElement): number {
  const header = document.getElementById("site-header");
  return anchorScrollTop({
    targetTop: target.getBoundingClientRect().top,
    scrollY: window.scrollY,
    headerBottom: header ? header.getBoundingClientRect().bottom : 0,
    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
  });
}

/**
 * Smooth (Lenis) scroll to `target`, its top under the header; then focus its heading.
 * Instant under reduced motion, or before Lenis exists (first paint).
 */
export function scrollToAnchor(lenis: LenisControls, target: HTMLElement, opts: { immediate?: boolean; focus?: boolean } = {}) {
  const immediate = opts.immediate || prefersReducedMotion() || !lenis.active;
  const done = () => opts.focus !== false && focusHeading(target);
  // force: the mobile menu stops Lenis while open, and a link click closes it in the same task.
  lenis.scrollTo(landingTop(target), { immediate, force: true, onComplete: done });
}

/** Re-lands a deep link (`/en#services`) until the layout settles or the user takes over. */
function settleOn(lenis: LenisControls, id: string): () => void {
  let raf = 0;
  let focused = false;
  const land = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      scrollToAnchor(lenis, el, { immediate: true, focus: !focused });
      focused = true;
    });
  };
  const ro = new ResizeObserver(land);
  ro.observe(document.body);
  ScrollTrigger.addEventListener("refresh", land);
  document.fonts?.ready.then(land);
  land();

  const passive: AddEventListenerOptions = { passive: true };
  const stop = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    ScrollTrigger.removeEventListener("refresh", land);
    clearTimeout(timer);
    for (const t of ["wheel", "touchstart", "pointerdown", "keydown"] as const) removeEventListener(t, stop, passive);
  };
  for (const t of ["wheel", "touchstart", "pointerdown", "keydown"] as const) addEventListener(t, stop, passive);
  const timer = setTimeout(stop, SETTLE_MS);
  return stop;
}

/**
 * One anchor behaviour for the whole site (D53): in-page links, menu links and deep links
 * land with the target's top under the fixed header, then focus moves to its heading.
 * - Clicks: a window capture listener runs before Next's <Link>, which then sees
 *   defaultPrevented and leaves same-page hashes alone.
 * - Deep links and cross-page links with a hash: re-landed after each route change.
 * The skip link (`#main`) keeps its native behaviour.
 */
export function AnchorScroll() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const id = sameDocumentHash(a.href, location.href);
      const target = id ? document.getElementById(id) : null;
      if (!id || !target || target.tagName === "MAIN") return;
      e.preventDefault();
      if (location.hash !== `#${encodeURIComponent(id)}` && location.hash !== `#${id}`) {
        history.pushState(history.state, "", `#${id}`);
      }
      // Two frames: a menu closing on this click restores scrolling and drops `inert` first.
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToAnchor(lenis, target)));
    };
    addEventListener("click", onClick, true);
    return () => removeEventListener("click", onClick, true);
  }, [lenis]);

  useEffect(() => {
    const id = sameDocumentHash(location.href, location.href);
    if (!id || id === "main" || !document.getElementById(id)) return;
    return settleOn(lenis, id);
  }, [lenis, pathname]);

  return null;
}
