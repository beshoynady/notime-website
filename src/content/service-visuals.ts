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
  photography: {
    kind: "photo",
    src: "/images/services/svc-photography.webp",
    width: 1188,
    height: 1196,
    from: "catering-6",
    alt: {
      en: "Chilled drinks and white flowers, styled and lit for an event table.",
      ar: "مشروبات باردة وزهور بيضاء، منسّقة ومُضاءة على طاولة إحدى الفعاليات.",
    },
  },
  // Video and Motion (D158): a still from Rand's own shoots until her footage and files arrive
  // (images-for-rand.md); Rental: stock lights on stands until NO TIME's own kit is photographed.
  // AI content: a neutral stock still (a process mapped on a whiteboard), never a real event photo,
  // which under that title read as AI output (the close's gate), until Rand's own work arrives.
  "video-production": pic("catering-2"),
  "motion-graphics": pic("heritage-1"),
  "ai-content-creation": pic("sw-ai"),
  "equipment-camera-rental": pic("cp-rental-lights"),
  "set-stage-design": {
    kind: "photo",
    src: "/images/services/svc-set-stage-design.webp",
    width: 953,
    height: 715,
    from: "private-celebrations-8",
    alt: {
      en: "A stage and its truss going up in a ballroom before an event.",
      ar: "مسرح وهيكله المعدني قيد التركيب في قاعة احتفالات قبل إحدى الفعاليات.",
    },
  },
  // Marketing & Brand
  // Marketing & Brand (D159): stock photographs of the work in context; Social shows a real post.
  "branding-identity": pic("mb-branding"),
  "social-media-management": pic("uae-pro-league-6"),
  "digital-marketing-seo": pic("mb-digital"),
  "content-strategy": pic("mb-content"),
  "public-relations": pic("mb-pr"),
  "paid-media-planning": pic("mb-paid"),
  // Production, Print & Gifts
  // Production, Print & Gifts (D160): NO TIME's own pieces where they exist, stock otherwise.
  "commercial-large-format-printing": pic("pg-printing"),
  "stand-fabrication-signage": pic("pg-fabrication"),
  "packaging-design": pic("uae-pro-league-7"),
  "corporate-gifts": pic("uae-pro-league-5"),
  "branded-merchandise": pic("gifts-2"),
};

/** A section's visual; a graded copy of a hidden registry photo shows nothing (media.ts `base`). */
export function serviceVisual(slug: string): ServiceVisual | undefined {
  const v = SERVICE_VISUALS[slug];
  return v?.kind === "photo" && baseHidden(v.from) ? undefined : v;
}
