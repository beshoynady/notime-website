import { getTranslations } from "next-intl/server";
import { QUOTE_LINK } from "@/components/layout/nav-links";
import { LightLeak } from "@/components/ornaments/light-leak";
import { SectionRef } from "@/components/review/section-ref";
import { ButtonLink } from "@/components/ui/button";
import { contact } from "@/config/contact";
import { SERVICES_INDEX_HREF } from "@/content";
import { contactStatus } from "@/lib/content-status";
import { HOME_REF } from "@/lib/review";
import { whatsappHref } from "@/lib/whatsapp";
import "./final-cta.css";

/**
 * Home · Final CTA (H-10, dark): the page's last line, answering the hero ("It's time …").
 * Fill or hide (D78): "Request a quote" goes to /contact once it exists (Task F3); until then the
 * one action is "Explore our services" (the /services index, not back up this page), so the section never offers a dead end. WhatsApp shows
 * only with a number in config/contact.ts.
 */
export async function FinalCta() {
  const [t, th, tw] = await Promise.all([getTranslations("cta"), getTranslations("hero"), getTranslations("whatsapp")]);
  const wa = contactStatus(contact).whatsapp ? whatsappHref(contact.whatsapp, tw("prefill")) : null;
  return (
    <section id="start" data-tone="dark" aria-labelledby="cta-title" className="final-cta section-pad">
      <SectionRef id={HOME_REF.cta} />
      <LightLeak position="end-top" />
      <div className="frame final-cta-frame">
        <h2 id="cta-title" className="final-cta-title text-display">
          {t("headingLead")} <b>{t("headingKey")}</b>
        </h2>
        {/* "We'll come back to you" only once there is a way to reach us (M1 gate). */}
        <p className="final-cta-body text-lead">{QUOTE_LINK.live || wa ? t("body") : t("bodyInterim")}</p>
        <div className="final-cta-actions">
          {QUOTE_LINK.live ? (
            <ButtonLink href={QUOTE_LINK.href} variant="primary" arrow>
              {t("primary")}
            </ButtonLink>
          ) : (
            <ButtonLink href={SERVICES_INDEX_HREF} variant="primary" arrow>
              {th("cta")}
            </ButtonLink>
          )}
          {wa && (
            <a href={wa} className="text-link" target="_blank" rel="noopener noreferrer">
              {t("secondary")}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
