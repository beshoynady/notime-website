"use client";

import { usePathname, useSearchParams } from "next/navigation";
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

/**
 * Whether the visitor has pointed or typed in this document yet. Before that (a deep link on
 * load) the browser can't tell how they arrived and would show the ring, even after a click on
 * another page; after it, its focus-visible heuristic knows (D74, P7).
 */
let interacted = false;
if (typeof window !== "undefined") {
  for (const t of ["pointerdown", "keydown"] as const) addEventListener(t, () => (interacted = true), { capture: true, once: true, passive: true });
}

/**
 * Moves focus without scrolling; the heading gets tabindex="-1". The ring shows only after
 * keyboard navigation (globals.css): a landing on load never shows it.
 */
function focusHeading(target: HTMLElement) {
  const h = headingFor(target);
  if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
  h.focus({ preventScroll: true, ...(interacted ? {} : { focusVisible: false }) });
}

/**
 * Where content starts under the bars that cover the top of the viewport: the lowest bottom of
 * every visible `[data-anchor-offset]` element (the fixed header; the sticky chip bar on mobile
 * category pages). A non-empty attribute value is a media query the element counts under.
 * A sticky bar counts at its stuck position, and only when `target` is inside its scope: the
 * nearest `[data-anchor-scope]` ancestor, else its parent (it scrolls away with that box; the
 * category index sits in a track beside the content it indexes, so it names its scope). Viewport px.
 */
export function anchorOffset(target?: Element): number {
  let bottom = 0;
  for (const el of document.querySelectorAll<HTMLElement>("[data-anchor-offset]")) {
    const media = el.dataset.anchorOffset;
    if ((media && !matchMedia(media).matches) || !el.checkVisibility()) continue;
    const style = getComputedStyle(el);
    if (style.position === "sticky") {
      const scope = el.closest("[data-anchor-scope]") ?? el.parentElement;
      if (target && !scope?.contains(target)) continue;
      bottom = Math.max(bottom, parseFloat(style.top) + el.offsetHeight);
    } else {
      bottom = Math.max(bottom, el.getBoundingClientRect().bottom);
    }
  }
  return bottom;
}

function landingTop(target: HTMLElement): number {
  return anchorScrollTop({
    targetTop: target.getBoundingClientRect().top,
    scrollY: window.scrollY,
    headerBottom: anchorOffset(target),
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
  // While settling, this re-landing is what keeps the target in place: Chrome's scroll anchoring
  // would also react to the pin spacers being re-measured and pull the page back by a pin's
  // length for a few frames (M1: 1260 px on /en#digital, 1800 px on Marketing). Off until stop.
  const root = document.documentElement;
  root.style.overflowAnchor = "none";
  const ro = new ResizeObserver(land);
  ro.observe(document.body);
  ScrollTrigger.addEventListener("refresh", land);
  document.fonts?.ready.then(land);
  land();

  const passive: AddEventListenerOptions = { passive: true };
  const stop = () => {
    root.style.overflowAnchor = "";
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
 * - Deep links and cross-page links with a hash: re-landed after each route change, including
 *   a change of query only (`?service=…#quote`). Mount it inside <Suspense> (useSearchParams).
 * The skip link (`#main`) keeps its native behaviour.
 */
export function AnchorScroll() {
  const lenis = useLenis();
  const pathname = usePathname();
  const search = useSearchParams().toString();

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
  }, [lenis, pathname, search]);

  return null;
}
