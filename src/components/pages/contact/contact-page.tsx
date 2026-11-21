import { MessageCircle, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ContactForm, type BriefService } from "@/components/forms/contact-form";
import { LightLeak } from "@/components/ornaments/light-leak";
import { PageCrumbs } from "@/components/pages/page-crumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { contact } from "@/config/contact";
import { SITE_URL } from "@/config/site";
import { BREADCRUMB_LABELS, CONTACT_HREF, getCategories, getServices, type Locale } from "@/content";
import { trailJsonLd } from "@/lib/jsonld";
import { whatsappHref } from "@/lib/whatsapp";
import { CopyEmail } from "./copy-email";
import "@/components/category/category.css";
import "./contact.css";

const FAQ = [1, 2, 3, 4, 5] as const;

/**
 * /contact (F3, D102): the brief first (one form, `?service=` presets it), the direct lines beside
 * it (email with a copy button; WhatsApp only once its number is set, D78), then the five general
 * questions (benchmarks §FAQ: 1, 3, 6, 8, 10; the NDA question waits for Rand's answer). Answers
 * explain the process, never numbers.
 */
export async function ContactPage({ locale }: { locale: Locale }) {
  const t = await getTranslations("contactPage");
  const categories = getCategories();
  const order = categories.map((c) => c.slug);
  const briefServices: BriefService[] = [...getServices()]
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.order - b.order)
    .map((s) => ({ value: s.anchor, label: s.title[locale], software: s.category === "software-digital", events: s.category === "events-hospitality", category: s.category }));
  const briefCategories = categories.map((c) => ({ slug: c.slug, title: c.title[locale] }));
  const wa = whatsappHref(contact.whatsapp);
  const faq = FAQ.map((n) => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) }));
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <main id="main" className="ct">
      <JsonLd data={[trailJsonLd([{ name: BREADCRUMB_LABELS.contact[locale], path: CONTACT_HREF }], locale, SITE_URL), faqLd]} />

      <section data-tone="dark" aria-labelledby="ct-title" className="pg-open ct-open">
        <LightLeak position="end-top" />
        <div className="frame">
          <PageCrumbs current={BREADCRUMB_LABELS.contact[locale]} />
          <p className="sec-eyebrow text-eyebrow text-champagne">{t("eyebrow")}</p>
          <h1 id="ct-title" className="ct-title">
            {t("title")}
          </h1>
          <p className="text-lead ct-lead">{t("lead")}</p>
        </div>
      </section>

      <section data-tone="light" aria-labelledby="ct-form-title" className="section-pad ct-body">
        <div className="frame ct-grid">
          <div className="ct-form">
            <h2 id="ct-form-title" className="ct-h2">
              {t("formTitle")}
            </h2>
            <ContactForm locale={locale} services={briefServices} categories={briefCategories} />
          </div>
          <aside className="ct-direct" aria-labelledby="ct-direct-title">
            <h2 id="ct-direct-title" className="text-eyebrow ct-direct-title">
              {t("directTitle")}
            </h2>
            {contact.email && (
              <div className="ct-line">
                <p className="ct-line-label">{t("emailLabel")}</p>
                <a href={`mailto:${contact.email}`} className="ct-email" dir="ltr">
                  {contact.email}
                </a>
                <CopyEmail email={contact.email} copy={t("copy")} copied={t("copied")} />
              </div>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="ct-wa">
                <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-4" />
                {t("whatsapp")}
              </a>
            )}
            <p className="ct-base">{t("base")}</p>
          </aside>
        </div>
      </section>

      <section className="cat-faq cat-end" data-tone="dark" aria-labelledby="ct-faq-title">
        <div className="cat-end-grid frame">
          <header className="cat-end-head">
            <p className="text-eyebrow">{t("faqEyebrow")}</p>
            <h2 id="ct-faq-title" className="cat-faq-title">
              {t("faqTitle")}
            </h2>
          </header>
          <div className="cat-faq-list">
            {faq.map(({ q, a }) => (
              <details key={q} className="cat-faq-item">
                <summary>
                  <span>{q}</span>
                  <Plus aria-hidden="true" strokeWidth={1.25} className="cat-faq-icon" />
                </summary>
                <div className="cat-faq-a">
                  <p>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
