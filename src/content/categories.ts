import type { Category, Localized } from "./types";

// Titles and summaries: the reference prototype's copy, kept with the approved services (D56).
// Theme, intro and FAQ: category pages (D57, docs/design/category-pages.md).

// TODO: replace placeholder — each category's intro and FAQ are written with its copy deck
// (phase-2 plan, Task 3.1 and later). Obvious placeholders until then.
const placeholderIntro = (): Localized<string> => ({
  en: "TODO: category intro, two or three sentences.",
  ar: "TODO: مقدمة الفئة، جملتان أو ثلاث.",
});
const placeholderFaq = (): Category["faq"] =>
  [1, 2, 3, 4].map((n) => ({
    q: { en: `TODO: question ${n}`, ar: `TODO: السؤال ${n}` },
    a: { en: `TODO: answer ${n}`, ar: `TODO: الإجابة ${n}` },
  }));

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
    theme: "evening",
    intro: placeholderIntro(),
    faq: placeholderFaq(),
    // Draft from the storyboard (Act 3), pending approval with the copy deck.
    closing: { en: "Tell us the date. We'll ready the room.", ar: "أخبرنا بالموعد، ونجهّز لك القاعة." },
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
    theme: "studio",
    intro: placeholderIntro(),
    faq: placeholderFaq(),
    // Draft from the storyboard (Act 3), pending approval with the copy deck.
    closing: { en: "Your take one starts here.", ar: "لقطتك الأولى تبدأ من هنا." },
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
    theme: "editorial",
    intro: placeholderIntro(),
    faq: placeholderFaq(),
    // Draft from the storyboard (Act 3), pending approval with the copy deck.
    closing: { en: "Your page is next.", ar: "صفحتك هي التالية." },
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
    theme: "workshop",
    intro: placeholderIntro(),
    faq: placeholderFaq(),
    // Draft from the storyboard (Act 3), pending approval with the copy deck.
    closing: { en: "What should we make for you?", ar: "ماذا نصنع لك؟" },
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
    theme: "interface",
    intro: placeholderIntro(),
    faq: placeholderFaq(),
    // Draft from the storyboard (Act 3), pending approval with the copy deck.
    closing: { en: "Your idea is the next blinking cursor.", ar: "فكرتك هي المؤشّر الذي يومض الآن." },
  },
];
