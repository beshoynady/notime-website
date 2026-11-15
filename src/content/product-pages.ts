import type { Localized } from "./types";

/**
 * The product pages (v1 plan F4): `/products/minute-zero` and `/products/peak-hour`. The id is the
 * product's id in the forms contract (`PRODUCTS`, src/lib/forms/schemas.ts); the name, descriptor
 * and summary come from products.ts, the problem line and the screens from the Software page's
 * products block (software/page.ts), so the two never disagree.
 *
 * Features: drafts the client confirms (OQ #24), as on the Software page. Each one is what the
 * concept screens show or what the summary says; no capacity, price, date or integration claims.
 * Both products are "Coming soon" until they launch.
 */
export type ProductId = "minute-zero" | "peak-hour";

export interface ProductPage {
  id: ProductId;
  /** The other product, for "Also in development". */
  other: ProductId;
  /** One line under the problem: what it costs the client today. */
  problemDetail: Localized<string>;
  features: { title: Localized<string>; line: Localized<string> }[];
}

export const productPages: Record<ProductId, ProductPage> = {
  "minute-zero": {
    id: "minute-zero",
    other: "peak-hour",
    problemDetail: {
      en: "Paper lists and a crowded door turn the first impression into a wait.",
      ar: "القوائم الورقية والازدحام عند الباب يحوّلان الانطباع الأول إلى انتظار.",
    },
    features: [
      { title: { en: "QR invitations", ar: "دعوات برمز QR" }, line: { en: "Each guest receives a personal code with the invitation.", ar: "يصل كل ضيف رمزه الخاص مع الدعوة." } },
      { title: { en: "Check-in at the door from a phone", ar: "تسجيل الحضور عند الباب من الهاتف" }, line: { en: "The team at the door scans each code with a phone.", ar: "يمسح فريق الاستقبال كل رمز بالهاتف." } },
      { title: { en: "Live arrivals for the team", ar: "متابعة الوصول لحظة بلحظة" }, line: { en: "Who has arrived and who is still due, as it happens.", ar: "من وصل ومن لم يصل بعد، لحظة بلحظة." } },
      { title: { en: "One guest list", ar: "قائمة ضيوف واحدة" }, line: { en: "A guest list you can search, so a name never holds up the queue.", ar: "قائمة يمكن البحث فيها، فلا يتعطّل الطابور عند اسم." } },
      { title: { en: "Arabic and English", ar: "بالعربية والإنجليزية" }, line: { en: "Invitations and screens in both languages.", ar: "الدعوات والشاشات باللغتين." } },
    ],
  },
  "peak-hour": {
    id: "peak-hour",
    other: "minute-zero",
    problemDetail: {
      en: "When the floor and the kitchen work from different slips of paper, the busiest hour is when things slip.",
      ar: "حين يعمل فريق الصالة والمطبخ من أوراق متفرقة، تفلت الأمور في أكثر الساعات ازدحامًا.",
    },
    features: [
      { title: { en: "Table and order management", ar: "إدارة الطاولات والطلبات" }, line: { en: "Every table and its order on one screen.", ar: "كل طاولة وطلبها على شاشة واحدة." } },
      { title: { en: "Kitchen display", ar: "شاشة للمطبخ" }, line: { en: "Orders reach the kitchen in sequence, marked preparing or ready.", ar: "تصل الطلبات إلى المطبخ بالتسلسل، وعلى كلٍّ منها حالته: قيد التحضير أو جاهز." } },
      { title: { en: "End-of-day summary", ar: "ملخص نهاية اليوم" }, line: { en: "Covers, orders and the busiest hour, ready at closing.", ar: "عدد الضيوف والطلبات وساعة الذروة، جاهزة عند الإغلاق." } },
      { title: { en: "Arabic and English", ar: "بالعربية والإنجليزية" }, line: { en: "For the floor team and the kitchen, in either language.", ar: "لفريق الصالة وفريق المطبخ، بأيّ من اللغتين." } },
    ],
  },
};

export const PRODUCT_IDS = Object.keys(productPages) as ProductId[];
