"use client";

import { useTranslations } from "next-intl";
import { contact } from "@/config/contact";
import { Link, usePathname } from "@/i18n/navigation";
import { ctaBarFor } from "@/lib/cta-bar";
import { contactStatus } from "@/lib/content-status";
import { useStickyBarVisible } from "./use-sticky-bar-visible";
import { WhatsAppLink } from "./whatsapp-link";
import "./mobile-cta-bar.css";

/**
 * The mobile CTA bar (N04), generalized from Software's sticky bar: "Request a quote" and, once
 * contact.ts has a number, WhatsApp (fill or hide, D78). Phones only (CSS). It appears once the
 * page's opening (`[data-cta-opening]`) has scrolled away; it hides while a form or the category's
 * quote block is in view and while a field has focus. Not on /contact (the form is the page) or on
 * Software's page (its own bar). Keyed by path so the visibility observers follow the page.
 */
export function MobileCtaBar() {
  const pathname = usePathname();
  const bar = ctaBarFor(pathname);
  if (!bar) return null;
  return <Bar key={pathname} quoteHref={bar.quoteHref} />;
}

function Bar({ quoteHref }: { quoteHref: string }) {
  const t = useTranslations("header");
  const tc = useTranslations("ctaBar");
  const tw = useTranslations("whatsapp");
  const show = useStickyBarVisible("[data-cta-opening]", "form, #quote");
  const hasWhatsApp = contactStatus(contact).whatsapp;
  return (
    <div className="cta-bar" data-show={show || undefined} role="region" aria-label={tc("label")} inert={!show}>
      <Link href={quoteHref} className="cta-bar-btn cta-bar-main">
        <span>{t("quote")}</span>
      </Link>
      {hasWhatsApp && (
        <WhatsAppLink number={contact.whatsapp} className="cta-bar-btn cta-bar-alt">
          <span>{tw("short")}</span>
        </WhatsAppLink>
      )}
    </div>
  );
}
