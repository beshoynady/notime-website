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
  if (process.env.NODE_ENV !== "production") Object.assign(window, { ScrollTrigger });
}

export { gsap, ScrollTrigger, useGSAP };
