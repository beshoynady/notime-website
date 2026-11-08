import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/json-ld";
import { Numeral } from "@/components/ui/numeral";
import { SITE_URL } from "@/config/site";
import { categoryHref, getCategories, getServices, SERVICES_INDEX_HREF, serviceHref, type Locale } from "@/content";
import { Link } from "@/i18n/navigation";
import { overviewJsonLd } from "@/lib/jsonld";
import { toRoman } from "@/lib/roman";
import { localeAlternates } from "@/lib/seo";
import "./services.css";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale as Locale, SERVICES_INDEX_HREF),
  };
}

/**
 * /services: the directory of the five categories and all their services (D57). Each category
 * title opens its page; each service opens its section there (the anchor utility lands it, D53).
 */
export default async function ServicesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const categories = getCategories();
  return (
    <main id="main">
      <JsonLd data={overviewJsonLd(categories, locale, SITE_URL)} />
      <section data-tone="light" aria-labelledby="services-title" className="svx">
        <div className="frame">
          <header className="svx-head">
            <div>
              <p className="sec-eyebrow text-eyebrow text-cocoa">{t("services.eyebrow")}</p>
              <h1 id="services-title" className="text-h1">
                {t("services.headingLead")} <b>{t("services.headingKey")}</b>
              </h1>
            </div>
            <p className="svx-intro text-lead">{t("services.intro")}</p>
          </header>

          <ol className="svx-list" aria-label={t("services.listLabel")}>
            {categories.map((c) => {
              const services = getServices(c.slug);
              const titleId = `svx-${c.slug}`;
              return (
                <li key={c.slug} className="svx-row">
                  <Numeral className="svx-num">{toRoman(c.order)}</Numeral>
                  <div className="svx-cat">
                    <h2 id={titleId} className="svx-title">
                      <Link href={categoryHref(c.slug)}>
                        {c.title[locale]}
                        <ArrowRight aria-hidden="true" strokeWidth={1.25} className="svx-arrow rtl:-scale-x-100" />
                      </Link>
                    </h2>
                    <p className="svx-summary">{c.summary[locale]}</p>
                    <p className="svx-count text-eyebrow">{t("megaMenu.count", { count: services.length })}</p>
                  </div>
                  <ul className="svx-services">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link href={serviceHref(s)} className="text-link">
                          {s.title[locale]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}
