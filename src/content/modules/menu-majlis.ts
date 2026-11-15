import type { Localized } from "../types";
import { EVENT_PHOTOS } from "./event-photos";

/**
 * Catering & heritage hospitality (category-pages.md §6 I.5): the offering set as a printed menu
 * card, with no price column (no pricing anywhere). The items are the real offering, from the copy
 * deck's points (profile p.26–p.32); nothing on the card is an example, so it carries no label.
 * Two real NO TIME heritage photos sit beside it. The border is original geometry inspired by Sadu
 * weaving (drawn in CSS), not a copy of a specific piece.
 */
export interface MenuSection {
  title: Localized<string>;
  items: Localized<string>[];
}

export const MENU = {
  title: { en: "The hospitality menu", ar: "قائمة الضيافة" },
  subtitle: { en: "Private and corporate occasions", ar: "للمناسبات الخاصة والشركات" },
  sections: [
    {
      title: { en: "The welcome", ar: "الاستقبال" },
      items: [
        { en: "Arabic coffee, poured at the door", ar: "القهوة العربية تُقدَّم عند الباب" },
        { en: "Welcome ceremonies", ar: "مراسم الاستقبال" },
      ],
    },
    {
      title: { en: "The majlis", ar: "المجلس" },
      items: [
        { en: "Majlis setups", ar: "تجهيز المجالس" },
        { en: "Desert tents", ar: "الخيام الصحراوية" },
      ],
    },
    {
      title: { en: "Made in front of guests", ar: "أمام الضيوف" },
      items: [
        { en: "Heritage carts", ar: "العربات التراثية" },
        { en: "Live cooking stations", ar: "محطات الطهي الحيّة" },
      ],
    },
    {
      title: { en: "Desserts and drinks", ar: "الحلويات والمشروبات" },
      items: [
        { en: "Signature desserts", ar: "حلويات مميّزة" },
        { en: "Signature beverages", ar: "مشروبات مميّزة" },
      ],
    },
    {
      title: { en: "The service", ar: "الخدمة" },
      items: [
        { en: "Buffet and table styling", ar: "تنسيق البوفيه والطاولات" },
        { en: "Private service", ar: "الخدمة الخاصة" },
        { en: "Boardroom hospitality", ar: "ضيافة الاجتماعات التنفيذية" },
      ],
    },
  ] satisfies MenuSection[],
  footer: { en: "Composed for each occasion.", ar: "تُعدّ لكل مناسبة على حدة." },
  photos: [EVENT_PHOTOS.cart, EVENT_PHOTOS.coffee],
  photosNote: { en: "From our heritage setups", ar: "من تجهيزاتنا التراثية" },
};
