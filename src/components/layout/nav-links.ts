import { categoryHref } from "@/content/links";

/**
 * Header and mobile-menu links. A link shows only once its page exists (`live`, fill or hide,
 * D78): Work arrives with the Work index (v1 plan F1) and Contact with the contact page and its
 * form (Task 4.2). About points at the homepage statement until the About page exists (F2).
 */
export const NAV_LINKS = [
  { key: "work", href: "/work", live: false },
  { key: "digital", href: categoryHref("software-digital"), live: true },
  { key: "about", href: "/#about", live: true },
  { key: "contact", href: "/contact", live: false },
] as const;

/** "Request a quote": hidden until /contact exists. */
export const QUOTE_LINK = { key: "quote", href: "/contact", live: false } as const;
export const QUOTE_HREF = QUOTE_LINK.href;

/** The homepage services section: the hero CTA scrolls to it. Menus and cards link the category pages (D57). */
export const SERVICES_HREF = "/#services";
