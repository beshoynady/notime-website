import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/config/site";
import { getServices, type Category, type Locale } from "@/content";
import { cta, finalCta, sticky } from "@/content/software/page";
import { categoryJsonLd } from "@/lib/jsonld";
import { FinalCta, QualityStrip, SoftwareFaq } from "./closing";
import { Tiers, Ways, Why } from "./engagement";
import { InterfaceOpening } from "./interface-opening";
import { Problems } from "./problems";
import { ProcessTimeline } from "./process-timeline";
import { Products } from "./products";
import { ProofStrip } from "./proof-strip";
import { ServiceBlocks } from "./service-blocks";
import { SoftwareMotion } from "./software-motion";
import { StickyBar } from "./sticky-bar";
import "@/components/category/category.css";
import "./software.css";

/**
 * Software & Digital, the site's strongest sales page (D91; docs/content/software-brief.md). Its
 * own sequence of the brief's 14 sections, not the shared category template: the opening, proof,
 * the problem, the six services and event tech, how we work, the engagement
 * levels, two ways to work, why NO TIME, the products, the quality strip, the FAQ and the final
 * CTA with both forms. One primary CTA (the free 30-min intro call), repeated at each decision
 * point; the free website review is the secondary one. JSON-LD: Service items, FAQPage and
 * BreadcrumbList (categoryJsonLd, shared with the other categories).
 */
export function SoftwarePage({ category, locale }: { category: Category; locale: Locale }) {
  const services = getServices(category.slug);
  return (
    <main id="main" data-theme={category.theme} className="sw-page">
      <JsonLd data={categoryJsonLd(category, services, locale, SITE_URL)} />
      <InterfaceOpening category={category} locale={locale} serviceCount={services.length} />
      <ProofStrip locale={locale} />
      <Problems locale={locale} />
      <ServiceBlocks items={services} locale={locale} />
      <ProcessTimeline locale={locale} />
      <Tiers locale={locale} />
      <Ways locale={locale} />
      <Why locale={locale} />
      <Products locale={locale} />
      <QualityStrip locale={locale} />
      <SoftwareFaq category={category} locale={locale} />
      <FinalCta category={category} locale={locale} />
      <StickyBar label={sticky.label[locale]} book={sticky.book[locale]} review={cta.reviewShort[locale]} reviewId={finalCta.reviewAnchor} />
      <SoftwareMotion />
    </main>
  );
}
