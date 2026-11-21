import type { Localized } from "../types";

/**
 * Conferences & summits (category-pages.md §6 I.1): a typical conference day as a timeline that
 * lights slot by slot as it crosses the reading line. Demo data: no real event, labelled "Example".
 * Each slot names what the team handles in it, from the copy deck's points (programme, venue,
 * speaker and guest care, event branding on site, ceremonies). Times are 24-hour, Western digits (D50).
 */
export interface AgendaSlot {
  time: string;
  label: Localized<string>;
  handled: Localized<string>;
}

export const AGENDA = {
  example: true,
  title: { en: "A conference day, slot by slot", ar: "يوم المؤتمر، فقرة بعد فقرة" },
  note: {
    en: "A typical day. Under each slot, what our team runs while it happens.",
    ar: "يوم نموذجي، وتحت كل فقرة ما يتولّاه فريقنا في أثنائها.",
  },
  slots: [
    {
      time: "08:00",
      label: { en: "Registration and welcome coffee", ar: "التسجيل وقهوة الاستقبال" },
      handled: { en: "Badges, check-in desks, the welcome team", ar: "البطاقات ومكاتب التسجيل وفريق الاستقبال" },
    },
    {
      time: "09:00",
      label: { en: "Opening and keynote", ar: "الافتتاح والكلمة الرئيسية" },
      handled: { en: "Stage, sound, the speaker's walk-on", ar: "المسرح والصوت ودخول المتحدث" },
    },
    {
      time: "10:15",
      label: { en: "Panel discussion", ar: "جلسة حوارية" },
      handled: { en: "Microphones, timing cues, the moderator's notes", ar: "الميكروفونات وإشارات الوقت وملاحظات المحاور" },
    },
    {
      time: "11:15",
      label: { en: "Coffee break", ar: "استراحة القهوة" },
      handled: { en: "Hospitality stations, the room turned around", ar: "محطات الضيافة، وإعادة تجهيز القاعة" },
    },
    {
      time: "11:45",
      label: { en: "Breakout sessions", ar: "جلسات متوازية" },
      handled: { en: "Signage, room changes, speaker care", ar: "اللوحات الإرشادية وتنقّل القاعات ورعاية المتحدثين" },
    },
    {
      time: "13:00",
      label: { en: "Lunch", ar: "الغداء" },
      handled: { en: "Catering, table styling, the buffet's service", ar: "الضيافة وتنسيق الطاولات وخدمة البوفيه" },
    },
    {
      time: "15:30",
      label: { en: "Awards and closing", ar: "التكريم والختام" },
      handled: { en: "The ceremony's running order, trophies, photography", ar: "تسلسل الحفل والجوائز والتصوير" },
    },
  ] satisfies AgendaSlot[],
};
