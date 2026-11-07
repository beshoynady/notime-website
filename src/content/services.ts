// The approved list (DECISIONS D56, 2026-11-07): docs/content/services-list.md, from
// services-proposal.md (the five profile services folded into four renamed entries).
// Slugs follow the English titles and are the future page addresses; keep them stable.
import { categories } from "./categories";
import { imageSlots } from "./images";
import type { CategorySlug, Localized, Service } from "./types";

type Row = [slug: string, title: Localized<string>, summary: Localized<string>];

function group(category: CategorySlug, rows: Row[]): Service[] {
  const cat = categories.find((c) => c.slug === category)!;
  const slot = imageSlots.find((s) => s.id === cat.image)!;
  return rows.map(([slug, title, summary], i) => ({
    slug,
    category,
    order: i + 1,
    title,
    summary,
    // Services share their category image until service-specific images exist.
    image: cat.image,
    imageAlt: slot.alt,
    status: "approved",
  }));
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
      "media-planning",
      { en: "Media planning", ar: "تخطيط الإعلام" },
      {
        en: "Channels, budgets and timing matched to the audience.",
        ar: "القنوات والميزانيات والتوقيت، بما يناسب الجمهور.",
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
