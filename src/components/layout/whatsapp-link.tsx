"use client";

import { useTranslations } from "next-intl";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { readLeadSource } from "@/components/providers/lead-source-capture";
import { leadChannel, parseLeadSource } from "@/lib/lead-source";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * A WhatsApp link whose message names where the visit came from (decision #35): "I found you
 * through Instagram" when this session arrived from Instagram (UTM tag or referring site,
 * src/lib/lead-source.ts), the plain message otherwise. The source lives in sessionStorage, so
 * the link renders with the plain message and is rewritten on click, when the source is known.
 * Renders nothing until contact.ts has a number (fill or hide, D78).
 */
export function WhatsAppLink({ number, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { number: string }) {
  const t = useTranslations("whatsapp");
  const href = whatsappHref(number, t("prefill"));
  if (!href) return null;
  const withSource = (e: MouseEvent<HTMLAnchorElement>) => {
    const channel = leadChannel(parseLeadSource(readLeadSource()));
    if (channel) e.currentTarget.href = whatsappHref(number, t("prefillFrom", { channel: t(`channels.${channel}`) }))!;
    onClick?.(e);
  };
  return <a {...rest} href={href} target="_blank" rel="noopener noreferrer" onClick={withSource} />;
}
