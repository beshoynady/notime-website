"use client";

/**
 * Single GSAP entry point. Plugins are registered once, client-side only.
 * Import gsap, ScrollTrigger and useGSAP from here, never from "gsap" directly.
 * SplitText is loaded on demand through `loadSplitText()` in `lib/split-text.ts`.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Mobile address-bar show/hide must not re-measure pinned sections mid-scroll.
  ScrollTrigger.config({ ignoreMobileResize: true });
  // A refresh briefly writes `padding: 0` on each pin spacer to measure; Chrome's scroll
  // anchoring then pulled a deep-linked page back by the pin's length for a few frames until
  // AnchorScroll re-landed (M1: 1260 px on /en#digital). Anchoring is off only while measuring.
  const root = document.documentElement;
  ScrollTrigger.addEventListener("refreshInit", () => (root.style.overflowAnchor = "none"));
  ScrollTrigger.addEventListener("refresh", () => (root.style.overflowAnchor = ""));
  if (process.env.NODE_ENV !== "production") Object.assign(window, { ScrollTrigger });
}

export { gsap, ScrollTrigger, useGSAP };
