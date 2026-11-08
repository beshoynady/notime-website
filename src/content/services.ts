// The approved list (DECISIONS D56, 2026-11-07): docs/content/services-list.md, from
// services-proposal.md (the five profile services folded into four renamed entries).
// Slugs follow the English titles and are the future page addresses; keep them stable.
import { categories } from "./categories";
import { imageSlots } from "./images";
import type { CategorySlug, Localized, ModuleKey, QuoteType, Service } from "./types";

type Row = [slug: string, title: Localized<string>, summary: Localized<string>];

/**
 * Named deliverables the user confirmed (D71), as the service's "what we deliver" points. Every
 * other service keeps the TODO placeholders until its category's copy deck.
 */
const NAMED_POINTS: Record<string, Localized<string[]>> = {
  "large-format-printing": {
    en: ["Roll-up banners", "Feather flags", "Business cards", "Brochures"],
    ar: ["لافتات رول أب", "أعلام الريشة", "بطاقات العمل", "البروشورات"],
  },
  "corporate-gifts": {
    en: ["Gift sets", "Branded bottles", "Bags", "Notebooks & pens", "Giveaways"],
    ar: ["أطقم الهدايا", "قوارير بهوية العلامة", "الحقائب", "الدفاتر والأقلام", "الهدايا الترويجية"],
  },
};

/**
 * Category-page fields per service (D57): the anchor (docs/content/services-list.md) and the
 * signature module (docs/design/category-pages.md §6). quoteType defaults to the category's.
 */
const PAGE: Record<string, { anchor: string; module: ModuleKey; quoteType?: QuoteType }> = {
  "conferences-summits": { anchor: "conferences", module: "agenda-timeline" },
  "exhibitions-booths": { anchor: "exhibitions", module: "stand-assembly" },
  "product-launches-activations": { anchor: "launches", module: "launch-reveal" },
  "galas-private-celebrations": { anchor: "celebrations", module: "candle-moodboard" },
  "catering-heritage-hospitality": { anchor: "hospitality", module: "menu-majlis" },
  "stage-technical-production": { anchor: "stage", module: "stage-lights" },
  photography: { anchor: "photography", module: "aperture-gallery" },
  "video-production": { anchor: "video", module: "scrub-reel" },
  "motion-graphics": { anchor: "motion", module: "motion-playground" },
  "ai-content-creation": { anchor: "ai-content", module: "idea-to-image" },
  "set-stage-design": { anchor: "set-design", module: "set-model" },
  "equipment-camera-rental": { anchor: "rental", module: "rental-categories" },
  "branding-identity": { anchor: "branding", module: "mark-build" },
  "social-media-management": { anchor: "social", module: "phone-feed" },
  "digital-marketing-seo": { anchor: "digital-marketing", module: "example-dashboard" },
  "content-strategy": { anchor: "content-strategy", module: "content-calendar" },
  "public-relations": { anchor: "pr", module: "press-release" },
  "paid-media-planning": { anchor: "paid-media", module: "campaign-funnel" },
  "large-format-printing": { anchor: "large-format", module: "human-scale" },
  "stand-fabrication-signage": { anchor: "fabrication", module: "build-layers" },
  "packaging-design": { anchor: "packaging", module: "unboxing" },
  "corporate-gifts": { anchor: "gifts", module: "gift-configurator" },
  "online-print-store": { anchor: "print-store", module: "print-order" },
  "branded-merchandise": { anchor: "merchandise", module: "merch-placement" },
  websites: { anchor: "websites", module: "responsive-frames" },
  "mobile-apps": { anchor: "apps", module: "app-screens" },
  "custom-systems": { anchor: "systems", module: "data-flow" },
  "e-commerce": { anchor: "e-commerce", module: "checkout-flow" },
  "ui-ux-design": { anchor: "ux", module: "fidelity-slider" },
  "ai-consulting": { anchor: "ai-consulting", module: "ai-sorter" },
};

const QUOTE_TYPE: Record<CategorySlug, QuoteType> = {
  "events-hospitality": "event",
  "creative-production": "production",
  "marketing-brand": "marketing",
  "production-print-gifts": "print",
  "software-digital": "digital",
};

// TODO: replace placeholder — "what we deliver" points are written per category with its copy
// deck (phase-2 plan, Task 3.1 and later). Four obvious placeholders until then.
const placeholderPoints = (): Localized<string[]> => ({
  en: [1, 2, 3, 4].map((n) => `TODO: what we deliver, point ${n}`),
  ar: [1, 2, 3, 4].map((n) => `TODO: ما نقدّمه، النقطة ${n}`),
});

function group(category: CategorySlug, rows: Row[]): Service[] {
  const cat = categories.find((c) => c.slug === category)!;
  const slot = imageSlots.find((s) => s.id === cat.image)!;
  return rows.map(([slug, title, summary], i) => {
    const page = PAGE[slug];
    if (!page) throw new Error(`No category-page fields for service ${slug}`);
    return {
      slug,
      category,
      order: i + 1,
      title,
      summary,
      // Services share their category image until service-specific images exist.
      image: cat.image,
      imageAlt: slot.alt,
      status: "approved",
      anchor: page.anchor,
      signatureModule: page.module,
      points: NAMED_POINTS[slug] ?? placeholderPoints(),
      relatedWork: [],
      quoteType: page.quoteType ?? QUOTE_TYPE[category],
    };
  });
}

export const services: Service[] = [
  ...group("events-hospitality", [
    [
      "conferences-summits",
      { en: "Conferences & summits", ar: "المؤتمرات والقمم" },
      {
        en: "Programme, venue, speakers and the running of the day, planned as one.",
        ar: "البرنامج والمكان والمتحدثون وإدارة اليوم، في خطة واحدة متكاملة.",
      },
    ],
    [
      "exhibitions-booths",
      { en: "Exhibitions & booths", ar: "المعارض والأجنحة" },
      {
        en: "Stands designed, built and staffed to draw people in.",
        ar: "أجنحة نصمّمها ونبنيها ونديرها لتجذب الزوّار.",
      },
    ],
    [
      "product-launches-activations",
      { en: "Product launches & brand activations", ar: "إطلاق المنتجات وتفعيل العلامات" },
      {
        en: "Launches and brand activations in malls, venues and exhibitions, including technology and robotics experiences.",
        ar: "إطلاقات وتفعيلات للعلامات في المراكز التجارية والقاعات والمعارض، بما فيها تجارب التقنية والروبوتات.",
      },
    ],
    [
      "galas-private-celebrations",
      { en: "Galas & private celebrations", ar: "الحفلات والاحتفالات الخاصة" },
      {
        en: "Galas, weddings, baby receptions and intimate gatherings: theming, décor, florals, keepsakes and the full day.",
        ar: "حفلات وأعراس واستقبالات مواليد وتجمّعات عائلية: الفكرة والديكور والزهور والتذكارات، وتنفيذ اليوم كاملًا.",
      },
    ],
    [
      "catering-heritage-hospitality",
      { en: "Catering & heritage hospitality", ar: "الضيافة والمجالس التراثية" },
      {
        en: "Private and corporate catering, signature desserts and beverages, majlis setups, desert tents and Arabic coffee service.",
        ar: "ضيافة للمناسبات الخاصة والشركات، وحلويات ومشروبات مميّزة، ومجالس وخيام صحراوية وتقديم القهوة العربية.",
      },
    ],
    [
      "stage-technical-production",
      { en: "Stage & technical production", ar: "الإنتاج الفني والتقني للمسرح" },
      {
        en: "Stage, sound, light and screens, rigged and run by one crew.",
        ar: "المسرح والصوت والإضاءة والشاشات، يجهّزها ويديرها فريق واحد.",
      },
    ],
  ]),
  ...group("creative-production", [
    [
      "photography",
      { en: "Photography", ar: "التصوير الفوتوغرافي" },
      {
        en: "Event, product and portrait photography, lit with intent.",
        ar: "تصوير الفعاليات والمنتجات والبورتريه، بإضاءة مدروسة.",
      },
    ],
    [
      "video-production",
      { en: "Video production", ar: "إنتاج الفيديو" },
      {
        en: "From script and shoot to the final edit and colour.",
        ar: "من النص والتصوير حتى المونتاج النهائي وتصحيح الألوان.",
      },
    ],
    [
      "motion-graphics",
      { en: "Motion graphics", ar: "الموشن جرافيك" },
      {
        en: "Titles, explainers and screen content that move with purpose.",
        ar: "عناوين وفيديوهات شرح ومحتوى للشاشات، بحركة لها هدف.",
      },
    ],
    [
      "ai-content-creation",
      { en: "AI content creation", ar: "صناعة المحتوى بالذكاء الاصطناعي" },
      {
        en: "AI-assisted imagery and video, art-directed to the brand.",
        ar: "صور وفيديو بمساعدة الذكاء الاصطناعي، بتوجيه فني يناسب العلامة.",
      },
    ],
    [
      "set-stage-design",
      { en: "Set & stage design", ar: "تصميم الديكور والمسرح" },
      {
        en: "Sets and stages drawn, modelled and built for the camera and the room.",
        ar: "ديكورات ومسارح نرسمها ونجسّمها ونبنيها للكاميرا وللمكان.",
      },
    ],
    [
      "equipment-camera-rental",
      { en: "Equipment & camera rental", ar: "تأجير المعدّات والكاميرات" },
      {
        en: "Cameras, lenses and lighting, ready for your production.",
        ar: "كاميرات وعدسات وإضاءة، جاهزة لإنتاجك.",
      },
    ],
  ]),
  ...group("marketing-brand", [
    [
      "branding-identity",
      { en: "Branding & identity", ar: "الهوية التجارية" },
      {
        en: "Name, mark, voice and system, built to hold together.",
        ar: "الاسم والشعار والنبرة والنظام البصري، متماسكة معًا.",
      },
    ],
    [
      "social-media-management",
      { en: "Social media management", ar: "إدارة وسائل التواصل الاجتماعي" },
      {
        en: "Planned calendars, content and community, week after week.",
        ar: "خطط نشر ومحتوى وتفاعل مع الجمهور، أسبوعًا بعد أسبوع.",
      },
    ],
    [
      "digital-marketing-seo",
      { en: "Digital marketing & SEO", ar: "التسويق الرقمي وSEO" },
      {
        en: "Search, paid media and measurement that show what works.",
        ar: "محركات البحث والإعلانات المدفوعة والقياس، لتعرف ما الذي ينجح.",
      },
    ],
    [
      "content-strategy",
      { en: "Content strategy", ar: "استراتيجية المحتوى" },
      {
        en: "What to say, where and when, written down and agreed.",
        ar: "ماذا نقول، وأين، ومتى، في خطة مكتوبة ومتفق عليها.",
      },
    ],
    [
      "public-relations",
      { en: "Public relations", ar: "العلاقات العامة" },
      {
        en: "Press, media relations and announcements, handled with care.",
        ar: "الصحافة والعلاقات الإعلامية والإعلانات الرسمية، بعناية.",
      },
    ],
    [
      "paid-media-planning",
      { en: "Paid media & media planning (Google & Meta ads)", ar: "الإعلانات المدفوعة وتخطيط الإعلام (Google وMeta)" },
      {
        en: "Google and Meta campaigns, with the channels, budgets and timing behind them matched to the audience.",
        ar: "حملات Google وMeta، ومعها القنوات والميزانيات والتوقيت بما يناسب الجمهور.",
      },
    ],
  ]),
  ...group("production-print-gifts", [
    [
      "large-format-printing",
      { en: "Large-format printing", ar: "الطباعة كبيرة الحجم" },
      {
        en: "Banners, backdrops and wall graphics, printed to scale.",
        ar: "لافتات وخلفيات ورسومات جدارية، مطبوعة بالمقاس الكامل.",
      },
    ],
    [
      "stand-fabrication-signage",
      { en: "Stand fabrication & signage", ar: "تصنيع الأجنحة واللافتات" },
      {
        en: "Exhibition stands, activations and branded spaces, designed, fabricated and installed, with the signage that guides guests.",
        ar: "أجنحة معارض ومساحات تفعيل وبيئات تحمل هوية العلامة، نصمّمها ونصنّعها ونركّبها، مع لافتات ترشد الضيوف.",
      },
    ],
    [
      "packaging-design",
      { en: "Packaging design", ar: "تصميم التغليف" },
      {
        en: "Boxes and wraps that open like part of the brand.",
        ar: "علب وتغليف تُفتح كأنها جزء من العلامة.",
      },
    ],
    [
      "corporate-gifts",
      { en: "Corporate gifts", ar: "هدايا الشركات" },
      {
        en: "Gifts chosen, branded and delivered for clients and teams.",
        ar: "هدايا نختارها ونضع عليها هويتك ونوصلها لعملائك وفريقك.",
      },
    ],
    [
      "online-print-store",
      { en: "Online print store", ar: "متجر الطباعة الإلكتروني" },
      {
        en: "Order approved print items online, on brand every time.",
        ar: "اطلب مطبوعاتك المعتمدة عبر الإنترنت، بهوية ثابتة في كل مرة.",
      },
    ],
    [
      "branded-merchandise",
      { en: "Branded merchandise", ar: "منتجات بهوية العلامة" },
      {
        en: "Apparel and objects carrying the brand with restraint.",
        ar: "ملابس وقطع تحمل العلامة بأناقة وهدوء.",
      },
    ],
  ]),
  ...group("software-digital", [
    [
      "websites",
      { en: "Websites", ar: "المواقع الإلكترونية" },
      {
        en: "Fast, bilingual websites that are easy to keep up to date.",
        ar: "مواقع سريعة بلغتين، يسهل تحديثها.",
      },
    ],
    [
      "mobile-apps",
      { en: "Mobile apps", ar: "تطبيقات الجوّال" },
      {
        en: "iOS and Android apps designed around how people use them.",
        ar: "تطبيقات iOS وAndroid مصمّمة حول طريقة استخدام الناس لها.",
      },
    ],
    [
      "custom-systems",
      { en: "Custom systems", ar: "أنظمة مخصّصة" },
      {
        en: "Internal tools and systems built for the way your team works.",
        ar: "أدوات وأنظمة داخلية مبنية على طريقة عمل فريقك.",
      },
    ],
    [
      "e-commerce",
      { en: "E-commerce", ar: "المتاجر الإلكترونية" },
      {
        en: "Online stores with clear checkout and simple management.",
        ar: "متاجر إلكترونية بدفع واضح وإدارة بسيطة.",
      },
    ],
    [
      "ui-ux-design",
      { en: "UI/UX design", ar: "تصميم الواجهات وتجربة المستخدم" },
      {
        en: "Interfaces researched, prototyped and tested before they are built.",
        ar: "واجهات نبحثها ونجرّب نماذجها ونختبرها قبل بنائها.",
      },
    ],
    [
      "ai-consulting",
      { en: "AI consulting", ar: "استشارات الذكاء الاصطناعي" },
      {
        en: "Where AI helps your work, where it does not, and how to start.",
        ar: "أين يفيد الذكاء الاصطناعي عملك، وأين لا يفيد، وكيف تبدأ.",
      },
    ],
  ]),
];
