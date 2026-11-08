"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { contact } from "@/config/contact";
import { whatsappHref } from "@/lib/whatsapp";

/** The quote block's actions for the service named in `?service=<anchor>` (unknown anchors are ignored). */
export function QuoteActions({ titles, tone }: { titles: Record<string, string>; tone: "dark" | "light" }) {
  const anchor = useSearchParams().get("service");
  const service = anchor && Object.hasOwn(titles, anchor) ? titles[anchor] : undefined;
  return <QuoteActionsView service={service} tone={tone} />;
}

/** WhatsApp and email, each only when set in src/config/contact.ts; otherwise the pending note. */
export function QuoteActionsView({ service, tone }: { service?: string; tone: "dark" | "light" }) {
  const t = useTranslations("category.quote");
  const tw = useTranslations("whatsapp");
  const wa = whatsappHref(contact.whatsapp, service ? t("prefill", { service }) : tw("prefill"));
  const subject = service ? `?subject=${encodeURIComponent(t("service", { service }))}` : "";
  const email = contact.email ? `mailto:${contact.email}${subject}` : null;
  const icon = "size-4 shrink-0";
  return (
    <>
      {service && <p className="cat-quote-service">{t("service", { service })}</p>}
      {wa || email ? (
        <div className="cat-quote-actions">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: tone === "dark" ? "primary" : "dark" })}>
              <MessageCircle aria-hidden="true" strokeWidth={1.5} className={icon} />
              {t("whatsapp")}
            </a>
          )}
          {email && (
            <a href={email} className={buttonVariants({ variant: "ghost" })}>
              <Mail aria-hidden="true" strokeWidth={1.5} className={icon} />
              {t("email")}
            </a>
          )}
        </div>
      ) : (
        // TODO: replace placeholder — shows until the WhatsApp number or email is set (CONTENT_CHECKLIST #7).
        <p className="cat-quote-pending">{t("contactPending")}</p>
      )}
    </>
  );
}
