import { Plus } from "lucide-react";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { WebsiteReviewForm } from "@/components/forms/website-review-form";
import { SectionRef } from "@/components/review/section-ref";
import type { Category, Locale } from "@/content";
import { cta, faqCopy, finalCta, quality, tiers, TIER_IDS } from "@/content/software/page";
import { CONSULT_ID } from "@/lib/prefill";
import { categoryRef } from "@/lib/review";

/** The quality strip (brief §12): quiet, text only; the stack named lightly, no logo wall. */
export function QualityStrip({ locale }: { locale: Locale }) {
  return (
    <section id={quality.anchor} data-tone="light" aria-labelledby="quality-title" className="sw-quality">
      <div className="frame">
        <h2 id="quality-title" className="sw-quality-title">
          {quality.title[locale]}
        </h2>
        <ul className="sw-quality-list">
          {quality.items.map((x, i) => (
            <li key={i}>{x[locale]}</li>
          ))}
        </ul>
        <p className="sw-quality-stack" dir="auto">
          {quality.stack[locale]}
        </p>
      </div>
    </section>
  );
}

/**
 * FAQ (brief §13): the category's 7 entries (categories.ts, so the FAQPage schema matches), in
 * native <details>, under a heading that answers the objections it covers.
 */
export function SoftwareFaq({ category, locale }: { category: Category; locale: Locale }) {
  return (
    <section className="cat-faq cat-end sw-faq" data-tone="light" aria-labelledby="faq-title">
      <SectionRef id={categoryRef(category.slug, "faq")} />
      <div className="cat-end-grid frame">
        <header className="cat-end-head">
          <h2 id="faq-title" className="sw-h2">
            {faqCopy.title[locale]}
          </h2>
        </header>
        <div className="cat-faq-list">
          {category.faq.map((item, i) => (
            <details key={i} className="cat-faq-item">
              <summary>
                <span>{item.q[locale]}</span>
                <Plus aria-hidden="true" strokeWidth={1.25} className="cat-faq-icon" />
              </summary>
              <div className="cat-faq-a">
                <p>{item.a[locale]}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The final CTA with risk reversal (brief §14), the bookend: the closing line answers the
 * opening's cursor, then the consultation form (#consult), then the free website review
 * (#website-review), the secondary way in.
 */
export function FinalCta({ category, locale }: { category: Category; locale: Locale }) {
  const tierLabels = Object.fromEntries(TIER_IDS.map((id) => [id, tiers.items[id].name[locale]])) as Record<(typeof TIER_IDS)[number], string>;
  return (
    <>
      <section id={CONSULT_ID} data-tone="light" aria-labelledby="consult-title" className="sw-section sw-consult">
        <div className="frame sw-consult-layout">
          <header className="sw-consult-head">
            <h2 id="consult-title" className="sw-consult-title">
              {category.closing[locale]}
            </h2>
            <p className="sw-consult-risk">{finalCta.risk[locale]}</p>
            <a href={`#${finalCta.reviewAnchor}`} className="sw-link">
              {finalCta.reviewTitle[locale]}
            </a>
          </header>
          <div className="sw-consult-form">
            <ConsultationForm locale={locale} source="software-digital" tierLabels={tierLabels} />
          </div>
        </div>
      </section>
      <section id={finalCta.reviewAnchor} data-tone="light" aria-labelledby="review-title" className="sw-section sw-review">
        <div className="frame sw-consult-layout">
          <header className="sw-consult-head">
            <h2 id="review-title" className="sw-h2">
              {finalCta.reviewTitle[locale]}
            </h2>
            <p className="sw-consult-risk">{cta.reviewPromise[locale]}</p>
          </header>
          <div className="sw-consult-form">
            <WebsiteReviewForm locale={locale} source="software-digital" />
          </div>
        </div>
      </section>
    </>
  );
}
