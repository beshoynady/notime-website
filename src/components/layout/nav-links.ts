import { ABOUT_HREF, categoryHref, CONTACT_HREF, WORK_INDEX_HREF } from "@/content/links";

/**
 * Header and mobile-menu links. A link shows only once its page exists (`live`, fill or hide,
 * D78). Contact is live (D102); the header and the mobile menu reach it through the quote button,
 * so only the footer lists it.
 */
export const NAV_LINKS = [
  { key: "work", href: WORK_INDEX_HREF, live: true },
  { key: "digital", href: categoryHref("software-digital"), live: true },
  { key: "about", href: ABOUT_HREF, live: true },
  { key: "contact", href: CONTACT_HREF, live: true }, // the page exists (D102)
] as const;

/**
 * The desktop header's links (N12): Events joins the main menu beside Services. The mobile menu
 * and the footer keep NAV_LINKS (Events is a category there already).
 */
export const HEADER_LINKS = [
  { key: "events", href: categoryHref("events-hospitality"), live: true },
  { key: "digital", href: categoryHref("software-digital"), live: true },
  { key: "work", href: WORK_INDEX_HREF, live: true },
  { key: "about", href: ABOUT_HREF, live: true },
] as const;

/** "Request a quote": hidden until /contact exists. */
export const QUOTE_LINK = { key: "quote", href: "/contact", live: true } as const; // the brief form works (D102)
export const QUOTE_HREF = QUOTE_LINK.href;

/** The homepage services section: the hero CTA scrolls to it. Menus and cards link the category pages (D57). */
export const SERVICES_HREF = "/#services";
