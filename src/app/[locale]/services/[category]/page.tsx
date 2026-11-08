import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CategoryHero } from "@/components/category/category-hero";
import { ServiceIndex } from "@/components/category/service-index";
import { ServiceSection } from "@/components/category/service-section";
import { THEME_TONE } from "@/components/category/theme";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/config/site";
import { categoryHref, getCategories, getCategory, getServices, type CategorySlug, type Locale } from "@/content";
import { localeAlternates } from "@/lib/seo";
import { categoryJsonLd } from "@/lib/jsonld";
import { toRoman } from "@/lib/roman";
import "@/components/category/category.css";

/**
 * The five category pages (D57), prerendered. Under Cache Components `dynamicParams` is not
 * available: any other slug renders on request and resolve() answers it with notFound().
 */
export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

async function resolve(params: PageProps<"/[locale]/services/[category]">["params"]) {
  const { locale, category: slug } = await params;
  const category = getCategory(slug as CategorySlug);
  if (!category) notFound();
  return { locale: locale as Locale, category };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[category]">): Promise<Metadata> {
  const { locale, category } = await resolve(params);
  return {
    title: category.title[locale],
    description: category.summary[locale],
    alternates: localeAlternates(locale, categoryHref(category.slug)),
  };
}

export default async function CategoryPage({ params }: PageProps<"/[locale]/services/[category]">) {
  const { locale, category } = await resolve(params);
  const services = getServices(category.slug);
  const tone = THEME_TONE[category.theme];
  const t = await getTranslations("category");
  const index = services.map((s) => ({ anchor: s.anchor, numeral: toRoman(s.order), title: s.title[locale] }));
  return (
    <main id="main" data-theme={category.theme}>
      <JsonLd data={categoryJsonLd(category, services, locale, SITE_URL)} />
      <CategoryHero category={category} serviceCount={services.length} />
      <section data-tone={tone} className="cat-body">
        <div className="cat-layout frame">
          <ServiceIndex items={index} label={t("indexLabel")} />
          <div className="cat-sections">
            {services.map((s) => (
              <ServiceSection key={s.slug} service={s} tone={tone} />
            ))}
          </div>
        </div>
      </section>
      {/* TODO: replace placeholder — FAQ and the quote block (#quote) arrive in Task 2.5. */}
    </main>
  );
}
