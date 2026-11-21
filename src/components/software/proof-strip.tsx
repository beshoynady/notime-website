import { BrandImage } from "@/components/ui/brand-image";
import type { Locale } from "@/content";
import { cta, finalCta, proof } from "@/content/software/page";
import { lighthouseProof, SOFTWARE_FLAGS } from "@/config/software";
import { Laptop, Phone } from "./device-frames";
import { ProofDevices } from "./proof-devices";

/**
 * Proof, right after the hero (brief §2): this website, in device frames with real screenshots captured from it (EN and AR). The Lighthouse
 * line shows only behind its flag and at 90+ (D65; off in v1). Then the free website review CTA.
 */
export function ProofStrip({ locale }: { locale: Locale }) {
  const scores = lighthouseProof(SOFTWARE_FLAGS.lighthouseProof, null); // TODO: replace placeholder — read the production Lighthouse summary when the flag turns on
  const pair = (lang: Locale) => (
    <div className="sw-proof-pair">
      <Laptop className="sw-proof-laptop">
        <BrandImage slot={`notime-website-home-${lang}`} sizes="(min-width: 900px) 40vw, 80vw" fill />
      </Laptop>
      <Phone className="sw-proof-phone">
        <BrandImage slot={`notime-website-category-${lang}`} sizes="(min-width: 900px) 12vw, 30vw" fill />
      </Phone>
    </div>
  );
  return (
    <section id="proof" data-tone="light" aria-labelledby="proof-title" className="sw-section sw-proof">
      <div className="frame">
        <h2 id="proof-title" className="sw-h2 sw-proof-title">
          {proof.title[locale]}
        </h2>
        <div className="sw-proof-grid">
          <article className="sw-proof-card" data-sw-reveal="">
            <ProofDevices
              locale={locale}
              labels={{ toggle: proof.site.toggle[locale], en: proof.site.english[locale], ar: proof.site.arabic[locale] }}
              en={pair("en")}
              ar={pair("ar")}
            />
            <h3 className="sw-proof-label">{proof.site.label[locale]}</h3>
            <p className="sw-proof-line">{proof.site.line[locale]}</p>
            {scores && (
              <p className="sw-proof-scores">
                {proof.site.lighthouse[locale]}: {scores.performance} · {scores.accessibility} · {scores.bestPractices} · {scores.seo}
              </p>
            )}
          </article>
        </div>

        <aside className="sw-review-cta" aria-labelledby="review-cta-title">
          <div>
            <h3 id="review-cta-title" className="sw-review-cta-title">
              {proof.review.title[locale]}
            </h3>
            <p className="sw-review-cta-body">{cta.reviewPromise[locale]}</p>
          </div>
          <a href={`#${finalCta.reviewAnchor}`} className="sw-btn sw-btn-ghost">
            <span>{cta.review[locale]}</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
