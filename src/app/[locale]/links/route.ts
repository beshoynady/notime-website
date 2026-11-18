import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { NextRequest } from "next/server";
import { contact } from "@/config/contact";
import { SITE_URL } from "@/config/site";
import { categoryHref, CONTACT_HREF, WORK_INDEX_HREF } from "@/content";
import { getPathname } from "@/i18n/navigation";
import { dirOf, routing } from "@/i18n/routing";
import { contactStatus } from "@/lib/content-status";
import { FONT_FACE_CSS } from "@/lib/font-faces";
import { FONT_PRELOADS } from "@/lib/fonts";
import { captureLeadSource, leadChannel, serializeLeadSource } from "@/lib/lead-source";
import { renderLinksPage, type LinksRow } from "@/lib/links-page";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * /[locale]/links (D110), the link-in-bio page for Instagram and other profiles, as plain HTML
 * (decision #36: 90+ on phones; src/lib/links-page.ts). No React on the client: what needed it is
 * done here, from the request.
 * - The lead source (UTM tags, the referring site, this landing) is computed with the same
 *   captureLeadSource() and stored by a one-line script, so the next page's forms report it.
 * - WhatsApp comes first once its number is set in src/config/contact.ts (decision #34), its
 *   message naming where the visit came from (leadChannel(), decision #35).
 * - No Instagram row: the visitor is coming from there (decision #34).
 * noindex and out of the sitemap. Tag the profile link (docs/marketing/utm-guide-ar.md).
 */
export async function GET(req: NextRequest, ctx: RouteContext<"/[locale]/links">) {
  const { locale } = await ctx.params;
  if (!hasLocale(routing.locales, locale)) return new Response(null, { status: 404 });
  const [t, tw, tl, tf, tb, tm] = await Promise.all(
    (["linksPage", "whatsapp", "langToggle", "footer", "brand", "meta"] as const).map((namespace) => getTranslations({ locale, namespace })),
  );
  const path = (href: string, l: string = locale) => getPathname({ href, locale: l });
  const other = routing.locales.find((l) => l !== locale)!;

  const lead = captureLeadSource({
    url: req.url,
    referrer: req.headers.get("referer") ?? "",
    host: req.headers.get("host") ?? new URL(SITE_URL).host,
    existing: null,
  });
  const tagged = Object.keys(lead).some((k) => k.startsWith("utm_"));
  const channel = leadChannel(lead);
  const prefill = channel ? tw("prefillFrom", { channel: tw(`channels.${channel}`) }) : tw("prefill");
  const wa = contactStatus(contact).whatsapp ? whatsappHref(contact.whatsapp, prefill) : null;

  const rows: LinksRow[] = [
    ...(wa ? [{ href: wa, title: t("whatsapp.title"), note: t("whatsapp.note"), primary: true, external: true, icon: "whatsapp" as const }] : []),
    { href: path(CONTACT_HREF), title: t("quote.title"), note: t("quote.note"), primary: !wa },
    { href: path(WORK_INDEX_HREF), title: t("work.title"), note: t("work.note") },
    { href: `${path(categoryHref("events-hospitality"))}#celebrations`, title: t("celebrations.title"), note: t("celebrations.note") },
    { href: path(categoryHref("software-digital")), title: t("software.title"), note: t("software.note") },
  ];

  const review = process.env.NEXT_PUBLIC_REVIEW_MODE === "1" ? (await import("@/content/review/ui")).reviewUi.banner[locale] : null;
  const html = renderLinksPage({
    locale,
    dir: dirOf(locale),
    title: `${t("metaTitle")} · ${tm("title")}`,
    description: t("metaDescription"),
    alternates: { en: `${SITE_URL}${path("/links", "en")}`, ar: `${SITE_URL}${path("/links", "ar")}` },
    fontPreloads: FONT_PRELOADS[locale],
    fontFaces: FONT_FACE_CSS,
    logo: { src: "/images/brand/logo/logo-dark-bg-wordmark.svg", alt: tb("logoAlt"), homeHref: path("/"), homeLabel: tb("homeLabel") },
    // The other language keeps the visit's tags.
    lang: { href: `${path("/links", other)}${req.nextUrl.search}`, locale: other, label: tl(other), name: tl(other === "en" ? "enLabel" : "arLabel") },
    eyebrow: t("eyebrow"),
    heading: t("title"),
    lead: t("lead"),
    listLabel: t("listLabel"),
    rows,
    email: contact.email ? { label: t("email"), address: contact.email } : null,
    legal: { label: tf("legalNav"), links: [{ href: path("/privacy"), label: tf("legal.privacy") }, { href: path("/cookies"), label: tf("legal.cookies") }] },
    leadSource: { json: serializeLeadSource(lead), tagged },
    review,
  });
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // The page depends on the visit (tags, referrer): never shared from a cache.
      "cache-control": "private, no-cache",
      "x-robots-tag": "noindex, follow",
    },
  });
}
