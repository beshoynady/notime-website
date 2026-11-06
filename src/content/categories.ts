import type { Category } from "./types";

// TODO: replace with approved list — category copy comes from the reference
// prototype draft until docs/content/services-list.md is approved.
export const categories: Category[] = [
  {
    slug: "events-hospitality",
    order: 1,
    title: { en: "Events & Hospitality", ar: "الفعاليات والضيافة" },
    summary: {
      en: "Conferences, exhibitions, launches and celebrations, from the first concept to the last guest.",
      ar: "مؤتمرات ومعارض وإطلاقات واحتفالات، من أول فكرة حتى آخر ضيف.",
    },
    image: "cat-events-hospitality-4x5",
    imageWide: "cat-events-hospitality-16x9",
  },
  {
    slug: "creative-production",
    order: 2,
    title: { en: "Creative Production", ar: "الإنتاج الإبداعي" },
    summary: {
      en: "Photo, film, motion and AI content, with the studio and equipment to make it.",
      ar: "تصوير وأفلام وموشن ومحتوى بالذكاء الاصطناعي، ومعها الاستوديو والمعدّات.",
    },
    image: "cat-creative-production-4x5",
    imageWide: "cat-creative-production-16x9",
  },
  {
    slug: "marketing-brand",
    order: 3,
    title: { en: "Marketing & Brand", ar: "التسويق والعلامة التجارية" },
    summary: {
      en: "Identity, social, search and PR that keep people talking after the event ends.",
      ar: "هوية وتواصل اجتماعي وبحث وعلاقات عامة، تُبقي الحديث قائمًا بعد انتهاء الفعالية.",
    },
    image: "cat-marketing-brand-4x5",
    imageWide: "cat-marketing-brand-16x9",
  },
  {
    slug: "production-print-gifts",
    order: 4,
    title: { en: "Production, Print & Gifts", ar: "الإنتاج والطباعة والهدايا" },
    summary: {
      en: "Signage, large-format print, packaging and gifts, produced to the brand standard.",
      ar: "لافتات وطباعة كبيرة وتغليف وهدايا، تُنفَّذ وفق معايير العلامة.",
    },
    image: "cat-production-print-gifts-4x5",
    imageWide: "cat-production-print-gifts-16x9",
  },
  {
    slug: "software-digital",
    order: 5,
    title: { en: "Software & Digital", ar: "البرمجيات والحلول الرقمية" },
    summary: {
      en: "Websites, apps and custom systems that keep working long after launch day.",
      ar: "مواقع وتطبيقات وأنظمة مخصّصة، تواصل عملها بعد يوم الإطلاق بوقت طويل.",
    },
    image: "cat-software-digital-4x5",
    imageWide: "cat-software-digital-16x9",
  },
];
