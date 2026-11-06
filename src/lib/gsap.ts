"use client";

/**
 * Single GSAP entry point. Plugins are registered once, client-side only.
 * Import gsap, ScrollTrigger, SplitText and useGSAP from here, never from "gsap" directly.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // Mobile address-bar show/hide must not re-measure pinned sections mid-scroll.
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (process.env.NODE_ENV !== "production") Object.assign(window, { ScrollTrigger });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
