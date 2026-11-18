"use client";

import { useEffect } from "react";
import { mediaQueryList } from "@/hooks/use-media-query";
import { usePathname } from "@/i18n/navigation";
import { autohidesOn, HEADER_AUTOHIDE_MEDIA, HEADER_HIDE_DELTA, nextHeaderHidden } from "@/lib/header-hide";

/**
 * The header that hides on scroll (owner's change 2): on the category pages below 900px it slides
 * up on the way down and returns on the way up. This only sets `html[data-header-hidden]`; the
 * header, the chip bar and the private-celebrations cards move by `translate` in CSS (globals.css,
 * "Header autohide"), so nothing changes layout. It stays shown at the top, while a menu is open
 * (`html[data-overlay-open]`) and while the header holds keyboard focus (not a tap's focus). Lenis
 * drives the native scroll position, so the window's `scroll` event serves with Lenis on and off.
 */
export function HeaderAutohide() {
  const pathname = usePathname();
  const active = autohidesOn(pathname);

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const shell = document.querySelector<HTMLElement>("[data-header-shell]");
    const header = document.getElementById("site-header");
    const mq = mediaQueryList(HEADER_AUTOHIDE_MEDIA);
    // The last settled position: it moves only once a scroll passes the delta, so a slow scroll of
    // a few px per event still adds up to a hide or a show.
    let last = { y: window.scrollY, hidden: false };

    const set = (hidden: boolean) => {
      last.hidden = hidden;
      root.toggleAttribute("data-header-hidden", hidden);
    };
    // Keyboard focus only (:focus-visible): a tap also focuses the button it lands on (the burger,
    // after opening and closing the menu), and that must not keep the header from hiding.
    const held = () => !mq.matches || root.hasAttribute("data-overlay-open") || !!shell?.querySelector(":focus-visible");

    const onScroll = () => {
      const y = window.scrollY;
      const headerH = header?.offsetHeight ?? 68;
      if (held()) {
        last = { y, hidden: false };
        return set(false);
      }
      const hidden = nextHeaderHidden(last, y, { headerH, delta: HEADER_HIDE_DELTA });
      if (Math.abs(y - last.y) > HEADER_HIDE_DELTA || y < headerH) last = { y, hidden };
      set(hidden);
    };
    const show = () => {
      last = { y: window.scrollY, hidden: false };
      set(false);
    };
    const onFocus = (e: FocusEvent) => e.target instanceof Element && e.target.matches(":focus-visible") && show();
    const onMedia = () => !mq.matches && show();
    // A menu opening shows the header at once (its button lives there; the overlay is drawn in it).
    const overlay = new MutationObserver(() => root.hasAttribute("data-overlay-open") && show());

    window.addEventListener("scroll", onScroll, { passive: true });
    shell?.addEventListener("focusin", onFocus);
    mq.addEventListener("change", onMedia);
    overlay.observe(root, { attributes: true, attributeFilter: ["data-overlay-open"] });
    return () => {
      window.removeEventListener("scroll", onScroll);
      shell?.removeEventListener("focusin", onFocus);
      mq.removeEventListener("change", onMedia);
      overlay.disconnect();
      root.removeAttribute("data-header-hidden");
    };
  }, [active]);

  return null;
}
