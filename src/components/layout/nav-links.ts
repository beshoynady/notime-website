import { ABOUT_HREF, categoryHref, WORK_INDEX_HREF } from "@/content/links";

/**
 * Header and mobile-menu links. A link shows only once its page exists (`live`, fill or hide,
 * D78): Work and About have their pages (v1 plan F1, F2); Contact arrives with the contact page
 * and its form (Task 4.2).
 */
export const NAV_LINKS = [
  { key: "work", href: WORK_INDEX_HREF, live: true },
  { key: "digital", href: categoryHref("software-digital"), live: true },
  { key: "about", href: ABOUT_HREF, live: true },
  { key: "contact", href: "/contact", live: false },
] as const;

/** "Request a quote": hidden until /contact exists. */
export const QUOTE_LINK = { key: "quote", href: "/contact", live: true } as const; // the brief form works (D102)
export const QUOTE_HREF = QUOTE_LINK.href;

/** The homepage services section: the hero CTA scrolls to it. Menus and cards link the category pages (D57). */
export const SERVICES_HREF = "/#services";
