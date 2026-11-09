/**
 * Legal values for the Privacy Policy, Terms of Use, Cookie Policy and the footer (D78): the only
 * place they live. An empty value hides every line that needs it (fill or hide, D78); nothing
 * shows a placeholder. CONTENT_CHECKLIST #8 (licence, legal entity) and #24 (legal review).
 */
import type { Localized } from "@/content/types";

export interface LegalConfig {
  /** The registered legal entity, as on the trade licence. */
  legalName: string;
  /** The registered address. */
  address: Localized<string>;
  /** Where data requests go: an email address or a postal address. */
  dataRequestContact: string;
  /** Trade licence number and issuing authority, for the footer line. */
  licence: Localized<string>;
  /**
   * Courts named in the Terms (§9). Dubai is the default for a mainland Dubai licence; it changes
   * if the licence is DIFC, ADGM or another free zone with its own courts (the legal reviewer
   * confirms it against the licence).
   */
  courts: Localized<string>;
  /** The version that prevails if the Arabic and English texts differ; the legal reviewer confirms it. */
  prevailingLanguage: "ar" | "en";
  /** True once a lawyer has reviewed the three pages. Until then they are noindex and out of the sitemap. */
  reviewed: boolean;
}

export const legal: LegalConfig = {
  legalName: "", // TODO: replace placeholder — CONTENT_CHECKLIST #8
  address: { en: "", ar: "" }, // TODO: replace placeholder — CONTENT_CHECKLIST #8
  dataRequestContact: "", // TODO: replace placeholder — CONTENT_CHECKLIST #24
  licence: { en: "", ar: "" }, // TODO: replace placeholder — CONTENT_CHECKLIST #8
  courts: { en: "the courts of Dubai", ar: "محاكم دبي" },
  prevailingLanguage: "ar",
  reviewed: false, // CONTENT_CHECKLIST #24: a legal review is required before launch
};
