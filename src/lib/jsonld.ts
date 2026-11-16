/**
 * JSON-LD for the services pages (D57). Pure: page components serialize the result.
 * Only facts the site states elsewhere: no ratings, reviews or prices. The area served is the six
 * markets the site states (About, FAQ; the 2026 profile). FAQ entries still marked TODO are left out.
 */
import {
  BREADCRUMB_LABELS,
  categoryHref,
  ORGANIZATION_NAME,
  SERVICES_INDEX_HREF,
  type Category,
  type Locale,
  type Service,
} from "@/content";
import { markets, type MarketKey } from "@/content/markets";

const isWritten = (s: string) => !s.startsWith("TODO:");

function organization(siteUrl: string) {
  return { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: ORGANIZATION_NAME, url: siteUrl };
}

function breadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export function categoryJsonLd(category: Category, services: Service[], locale: Locale, siteUrl: string): object[] {
  const page = `${siteUrl}/${locale}${categoryHref(category.slug)}`;
  const nodes: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: category.title[locale],
      itemListElement: services.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          "@id": `${page}#${s.anchor}`,
          url: `${page}#${s.anchor}`,
          name: s.title[locale],
          description: s.summary[locale],
          serviceType: category.title[locale],
          provider: organization(siteUrl),
        },
      })),
    },
  ];
  const faq = category.faq.filter((f) => isWritten(f.q[locale]) && isWritten(f.a[locale]));
  if (faq.length > 0) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q[locale],
        acceptedAnswer: { "@type": "Answer", text: f.a[locale] },
      })),
    });
  }
  nodes.push(
    breadcrumb([
      { name: BREADCRUMB_LABELS.home[locale], url: `${siteUrl}/${locale}` },
      { name: BREADCRUMB_LABELS.services[locale], url: `${siteUrl}/${locale}${SERVICES_INDEX_HREF}` },
      { name: category.title[locale], url: page },
    ]),
  );
  return nodes;
}

export function overviewJsonLd(categories: Category[], locale: Locale, siteUrl: string): object[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: categories.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.title[locale],
        url: `${siteUrl}/${locale}${categoryHref(c.slug)}`,
      })),
    },
    breadcrumb([
      { name: BREADCRUMB_LABELS.home[locale], url: `${siteUrl}/${locale}` },
      { name: BREADCRUMB_LABELS.services[locale], url: `${siteUrl}/${locale}${SERVICES_INDEX_HREF}` },
    ]),
  ];
}

/** A page trail as JSON-LD (the visible breadcrumbs use the same labels). Paths are locale-less. */
export function trailJsonLd(trail: { name: string; path: string }[], locale: Locale, siteUrl: string): object {
  return breadcrumb([
    { name: BREADCRUMB_LABELS.home[locale], url: `${siteUrl}/${locale}` },
    ...trail.map((t) => ({ name: t.name, url: `${siteUrl}/${locale}${t.path}` })),
  ]);
}

/**
 * A case study (F1) as a CreativeWork: the label and summary the page shows (the anonymous version
 * until the client approves its name), the categories as genres, the house as creator. No client
 * name, image, date or figure beyond what the page itself states.
 */
export function workCaseJsonLd(
  work: { label: string; summary: string; path: string; genres: string[] },
  locale: Locale,
  siteUrl: string,
): object {
  const url = `${siteUrl}/${locale}${work.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url,
    url,
    name: work.label,
    description: work.summary,
    genre: work.genres,
    inLanguage: locale,
    creator: organization(siteUrl),
  };
}

/**
 * The home page (D103): the house and the site. Only stated facts: the name, the inbox, Dubai
 * (legal pages, FAQ), the six markets (About), the two languages. No founding date, no social
 * profiles until they exist (CONTENT_CHECKLIST #7).
 */
const COUNTRY: Record<MarketKey, string> = { ae: "United Arab Emirates", sa: "Saudi Arabia", qa: "Qatar", om: "Oman", kw: "Kuwait", eg: "Egypt" };

export function homeJsonLd(locale: Locale, siteUrl: string, email: string): object[] {
  return [
    {
      "@context": "https://schema.org",
      ...organization(siteUrl),
      logo: `${siteUrl}/images/brand/logo/logo-light-bg.png`,
      email,
      address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
      areaServed: markets.map((m) => ({ "@type": "Country", name: COUNTRY[m.key] })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: ORGANIZATION_NAME,
      url: `${siteUrl}/${locale}`,
      inLanguage: locale,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ];
}
