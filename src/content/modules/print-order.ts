import type { Localized } from "../types";

/**
 * The print-order module (category-pages.md §6, IV.23; section V, Online print store; v1 plan
 * A8): "Order your print online" as the steps of a request through the quote form (D58, D78).
 * No cart, no basket, no quantities to pick, no prices, nothing that looks like checkout. The
 * service's points already list the four steps; the tickets show them, in other words.
 */
export interface OrderStep {
  id: "item" | "artwork" | "proof" | "print";
  title: Localized<string>;
  line: Localized<string>;
}

export const ORDER_STEPS: OrderStep[] = [
  {
    id: "item",
    title: { en: "The item", ar: "المنتج" },
    line: {
      en: "Business cards, letterheads, brochures or roll-ups: tell us what you need, and how many.",
      ar: "بطاقات عمل أو ورق مراسلات أو بروشورات أو لافتات رول أب: أخبرنا بما تحتاجه وبالكمية.",
    },
  },
  {
    id: "artwork",
    title: { en: "Your artwork", ar: "التصميم" },
    line: {
      en: "Send print-ready files, or ask for a reprint of an item you've printed with us.",
      ar: "أرسل ملفات جاهزة للطباعة، أو اطلب إعادة طباعة قطعة طبعتها معنا من قبل.",
    },
  },
  {
    id: "proof",
    title: { en: "The proof", ar: "النسخة التجريبية" },
    line: {
      en: "You see a proof first. Nothing goes to print until you approve it.",
      ar: "تصلك نسخة تجريبية أولًا، ولا يُطبع شيء قبل أن تعتمدها.",
    },
  },
  {
    id: "print",
    title: { en: "To brand standard", ar: "بمعايير علامتك" },
    line: {
      en: "Printed to match your brand, and the proof you approved.",
      ar: "طباعة تطابق هوية علامتك والنسخة التي اعتمدتها.",
    },
  },
];

export const PRINT_ORDER_COPY = {
  title: { en: "How a print order works", ar: "كيف يسير طلب الطباعة" },
  /** The steps' accessible name (the visible numbers are decorative). */
  step: { en: "Step {n} of {total}", ar: "الخطوة {n} من {total}" },
  /** The request CTA, shown only once the contact page is live (QUOTE_LINK.live, D83). */
  cta: { en: "Order your print online", ar: "اطلب مطبوعاتك عبر الإنترنت" },
} satisfies Record<string, Localized<string>>;
