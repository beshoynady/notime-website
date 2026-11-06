/**
 * Contact details, social links and the WhatsApp number — the only place they live
 * (CLAUDE.md, DECISIONS D11). Components read from here; never duplicate these values.
 */
export interface ContactConfig {
  email: string;
  /** E.164 digits with or without "+" and spaces, e.g. "+971 5x xxx xxxx". */
  whatsapp: string;
  instagram: string;
  facebook: string;
}

export const contact: ContactConfig = {
  email: "", // TODO: replace placeholder — CONTENT_CHECKLIST #7
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", // TODO: replace placeholder — CONTENT_CHECKLIST #7
  instagram: "", // TODO: replace placeholder — CONTENT_CHECKLIST #7
  facebook: "", // TODO: replace placeholder — CONTENT_CHECKLIST #7
};
