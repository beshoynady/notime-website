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
   * if the licence is DIFC, ADGM or another free zone with its own courts (checked against the
   * licence at the owner's final read, D89).
   */
  courts: Localized<string>;
  /**
   * The cookieless analytics service, by its public name ("Cloudflare Web Analytics": free, a JS
   * beacon, no cookies); empty until it is switched on at launch (D88, D89). No GA4, no consent banner. Setting
   * it swaps the privacy and cookie lines that say "no analytics" for the ones that name it.
   */
  analytics: string;
  /** The version that prevails if the Arabic and English texts differ (Arabic by default, D89). */
  prevailingLanguage: "ar" | "en";
  /** True once the owner has given the three pages a final read before launch (D89). Until then they are noindex and out of the sitemap. */
  reviewed: boolean;
}

export const legal: LegalConfig = {
  legalName: "NO TIME", // D89; the licence may read e.g. "NO TIME … L.L.C.": a one-line change (CONTENT_CHECKLIST #8)
  address: { en: "Dubai, United Arab Emirates", ar: "دبي، الإمارات العربية المتحدة" }, // D89
  dataRequestContact: "", // TODO: replace placeholder — CONTENT_CHECKLIST #24
  licence: { en: "", ar: "" }, // TODO: replace placeholder — CONTENT_CHECKLIST #8
  courts: { en: "the courts of Dubai", ar: "محاكم دبي" },
  analytics: "", // set at launch (D88, D89): "Cloudflare Web Analytics"
  prevailingLanguage: "ar",
  reviewed: false, // CONTENT_CHECKLIST #24: true after the owner's final read before launch (D89; no lawyer for now)
};
