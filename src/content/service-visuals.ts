import { baseHidden } from "./media";
import type { Localized } from "./types";

/**
 * The lightweight visual of a service section whose signature module comes in v1.1 (D83, D100):
 * a curated real profile photo where one fits (no faces, no client branding, graded with
 * scripts/grade.mjs) or a registry picture (media.ts). Static, no
 * interactivity. Remove a service's entry when its real module ships (service-visuals.test.ts).
 */
export type ServiceVisual =
  | { kind: "photo"; src: string; width: number; height: number; from: string; alt: Localized<string> }
  /** A registry picture (media.ts, D152): hidden there, the section shows no visual (fill or hide). */
  | { kind: "media"; id: string };

const pic = (id: string): ServiceVisual => ({ kind: "media", id });

export const SERVICE_VISUALS: Record<string, ServiceVisual> = {
  // Creative Production
  photography: pic("cp-photography"),
  // D169: each section its own credited stock still (Rand's photos show once, on Home, About and
  // Work) until her footage, files and kit photos arrive (images-for-rand.md). AI content keeps a
  // neutral still, never a real event photo, which under that title read as AI output (D166).
  "video-production": pic("cp-video"),
  "motion-graphics": pic("cp-motion"),
  "ai-content-creation": pic("cp-ai"),
  "equipment-camera-rental": pic("cp-rental-lights"),
  "set-stage-design": pic("cp-set-stage"),
  // Marketing & Brand
  // Marketing & Brand (D159): stock photographs of the work in context; Social shows a real post.
  "branding-identity": pic("mb-branding"),
  "social-media-management": pic("uae-pro-league-6"),
  "digital-marketing-seo": pic("mb-digital"),
  "content-strategy": pic("mb-content"),
  "public-relations": pic("mb-pr"),
  "paid-media-planning": pic("mb-paid"),
  // Production, Print & Gifts
  // Production, Print & Gifts (D160, D169): stock; NO TIME's own pieces show on Work › Gifts for companies.
  "commercial-large-format-printing": pic("pg-printing"),
  "stand-fabrication-signage": pic("pg-fabrication"),
  "packaging-design": pic("pg-packaging"),
  "corporate-gifts": pic("pg-gifts"),
  "branded-merchandise": pic("pg-merch"),
};

/** A section's visual; a graded copy of a hidden registry photo shows nothing (media.ts `base`). */
export function serviceVisual(slug: string): ServiceVisual | undefined {
  const v = SERVICE_VISUALS[slug];
  return v?.kind === "photo" && baseHidden(v.from) ? undefined : v;
}
