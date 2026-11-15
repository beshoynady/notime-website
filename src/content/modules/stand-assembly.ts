import type { Localized } from "../types";

/**
 * Exhibitions & booths (category-pages.md §6 I.2): an isometric stand that assembles as the visitor
 * scrolls: floor, walls, counter, lighting, graphics, screen. A generic stand with no client
 * branding, labelled "Example". The steps are numbered because they are the build order.
 */
export type StandPartId = "floor" | "walls" | "counter" | "lighting" | "graphics" | "screen";

export const STAND = {
  example: true,
  title: { en: "A stand, built in six steps", ar: "جناح يُبنى في ست خطوات" },
  note: {
    en: "An example stand, assembled in the order our crew builds it.",
    ar: "جناح نموذجي يُركَّب بالترتيب الذي يبنيه به فريقنا.",
  },
  stepLabel: { en: "Step {n} of {total}", ar: "الخطوة {n} من {total}" },
  parts: [
    { id: "floor", label: { en: "Raised floor", ar: "الأرضية المرتفعة" }, line: { en: "Levelled, with the cabling run underneath.", ar: "مستوية، وتمرّ التمديدات من تحتها." } },
    { id: "walls", label: { en: "Walls", ar: "الجدران" }, line: { en: "Built in the workshop, assembled on the floor.", ar: "تُصنع في الورشة، وتُركَّب في أرض المعرض." } },
    { id: "counter", label: { en: "Counter", ar: "منصة الاستقبال" }, line: { en: "Where the stand team meets visitors.", ar: "حيث يلتقي فريق الجناح بالزوّار." } },
    { id: "lighting", label: { en: "Lighting", ar: "الإضاءة" }, line: { en: "A header beam and downlights on the counter.", ar: "عارضة علوية وإضاءة موجّهة نحو منصة الاستقبال." } },
    { id: "graphics", label: { en: "Graphics", ar: "التصاميم المطبوعة" }, line: { en: "Printed panels in the brand's identity.", ar: "ألواح مطبوعة بهوية العلامة." } },
    { id: "screen", label: { en: "Screen", ar: "الشاشة" }, line: { en: "Content made to be read across the aisle.", ar: "محتوى يُقرأ من الممر المقابل." } },
  ] satisfies { id: StandPartId; label: Localized<string>; line: Localized<string> }[],
};
