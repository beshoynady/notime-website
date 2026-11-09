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
    // Copy deck docs/content/category-copy-events.md (approved 2026-11-09).
    intro: {
      en: "Conferences and summits, exhibitions, launches, galas and heritage hospitality. We take each one from the concept and the décor through production to the guest's experience on the day, under one roof.",
      ar: "مؤتمرات وقمم، ومعارض، وإطلاقات، وحفلات، وضيافة تراثية. نتولّى كل مناسبة من الفكرة والديكور، مرورًا بالإنتاج، حتى تجربة الضيف يوم الحدث، تحت سقف واحد.",
    },
    faq: [
      {
        q: { en: "Which events do you run?", ar: "ما أنواع الفعاليات التي تنظّمونها؟" },
        a: { en: "Conferences and summits, exhibitions, product launches and brand activations, galas, weddings and private celebrations, and ceremonies and award nights, for companies, government entities and private clients.", ar: "المؤتمرات والقمم، والمعارض، وإطلاق المنتجات وتفعيل العلامات، والحفلات والأعراس والاحتفالات الخاصة، وحفلات التكريم وليالي الجوائز، للشركات والجهات الحكومية والأفراد." },
      },
      {
        q: { en: "Can one team handle the décor, the catering and the stage?", ar: "هل يتولى فريق واحد الديكور والضيافة والمسرح؟" },
        a: { en: "Yes. Concept, décor, production and guest experience sit under one roof, so the décor, the hospitality and the technical crew work to one plan.", ar: "نعم. الفكرة والديكور والإنتاج وتجربة الضيف عندنا تحت سقف واحد، فيعمل فريق الديكور وفريق الضيافة والفريق التقني وفق خطة واحدة." },
      },
      {
        q: { en: "Do you offer heritage hospitality?", ar: "هل تقدّمون الضيافة التراثية؟" },
        a: { en: "Yes: majlis setups, desert tents, Arabic coffee service, heritage carts, live stations and welcome ceremonies.", ar: "نعم: تجهيز المجالس والخيام الصحراوية، وتقديم القهوة العربية، والعربات التراثية، ومحطات الطهي الحية، ومراسم الاستقبال." },
      },
      {
        q: { en: "Where do you work?", ar: "أين تعملون؟" },
        a: { en: "We're based in Dubai and work across six markets: the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt.", ar: "مقرّنا في دبي، ونعمل في ستة أسواق: الإمارات والسعودية وقطر وعُمان والكويت ومصر." },
      },
      {
        q: { en: "Can you photograph and film the event?", ar: "هل تصوّرون الفعالية؟" },
        a: { en: "Yes. Event coverage is part of our Creative Production services: photography and video, from the shoot to the final edit.", ar: "نعم. تغطية الفعاليات جزء من خدمات الإنتاج الإبداعي لدينا: التصوير الفوتوغرافي والفيديو، من التصوير حتى المونتاج النهائي." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون مني للبدء؟" },
        a: { en: "Tell us the date, the type of event, the city and roughly how many guests. We'll come back with a concept and a proposal.", ar: "أخبرنا بالموعد ونوع المناسبة والمدينة والعدد التقريبي للضيوف، ونعود إليك بتصوّر وعرض." },
      },
    ],
    closing: { en: "Tell us the date. We'll ready the room.", ar: "أخبرنا بالموعد، ونجهّز لك القاعة." },
  },
  {
    slug: "creative-production",
    order: 2,
    title: { en: "Creative Production", ar: "الإنتاج الإبداعي" },
    summary: {
      en: "Photo, film, motion and AI content, with the sets and equipment to make it.",
      ar: "تصوير وأفلام وموشن ومحتوى بالذكاء الاصطناعي، ومعها الديكورات والمعدّات.",
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
