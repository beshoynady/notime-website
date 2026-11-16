"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { contactHref } from "@/content/links";
import { contact } from "@/config/contact";
import { whatsappHref } from "@/lib/whatsapp";

/** The quote block's actions for the service named in `?service=<anchor>` (unknown anchors are ignored). */
export function QuoteActions({
  titles,
  tone,
}: {
  titles: Record<string, string>;
  tone: "dark" | "light";
}) {
  const anchor = useSearchParams().get("service");
  const known = anchor && Object.hasOwn(titles, anchor) ? anchor : undefined;
  return (
    <QuoteActionsView
      service={known ? titles[known] : undefined}
      anchor={known}
      tone={tone}
    />
  );
}

/**
 * The brief on /contact first (D102: `?service=` carries the service), then WhatsApp and email,
 * each only when set in src/config/contact.ts.
 */
export function QuoteActionsView({
  service,
  anchor,
  tone,
}: {
  service?: string;
  anchor?: string;
  tone: "dark" | "light";
}) {
  const t = useTranslations("category.quote");
  const tw = useTranslations("whatsapp");
  const wa = whatsappHref(
    contact.whatsapp,
    service ? t("prefill", { service }) : tw("prefill"),
  );
  const subject = service
    ? `?subject=${encodeURIComponent(t("service", { service }))}`
    : "";
  const email = contact.email ? `mailto:${contact.email}${subject}` : null;
  const icon = "size-4 shrink-0";
  return (
    <>
      {service && (
        <p className="cat-quote-service">{t("service", { service })}</p>
      )}
      <div className="cat-quote-actions">
        <ButtonLink
          href={contactHref(anchor)}
          variant={tone === "dark" ? "primary" : "dark"}
          arrow
        >
          {t("brief")}
        </ButtonLink>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost" })}
          >
            <MessageCircle
              aria-hidden="true"
              strokeWidth={1.5}
              className={icon}
            />
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
    </>
  );
}
