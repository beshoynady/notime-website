/**
 * JSON-LD for the services pages (D57). Pure: page components serialize the result.
 * Only facts the site states elsewhere: no ratings, reviews, prices or area served
 * until the client confirms them. FAQ entries still marked TODO are left out.
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
