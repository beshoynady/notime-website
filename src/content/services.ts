// The approved list (DECISIONS D56, 2026-11-07): docs/content/services-list.md, from
// services-proposal.md (the five profile services folded into four renamed entries).
// Slugs follow the English titles and are the future page addresses; keep them stable.
import { categories } from "./categories";
import { imageSlots } from "./images";
import type { CategorySlug, Localized, ModuleKey, QuoteType, Service } from "./types";

type Row = [slug: string, title: Localized<string>, summary: Localized<string>];

/**
 * "What we deliver" points per service: the named deliverables the user confirmed (D71) and each
 * category's copy deck (Events approved; the other four are drafts for Rand's review).
 */
const POINTS: Record<string, Localized<string[]>> = {
  // Events & Hospitality: copy deck docs/content/category-copy-events.md (approved 2026-11-09).
  "conferences-summits": {
    en: ["Programme and running order", "Venue and room layout", "Speaker and guest care", "Event branding on site", "Ceremonies and award nights"],
    ar: ["البرنامج وتسلسل الفقرات", "المكان وتوزيع القاعة", "استقبال المتحدثين ورعاية الضيوف", "تطبيق هوية الحدث في المكان", "حفلات التكريم وليالي الجوائز"],
  },
  "exhibitions-booths": {
    en: ["Stand concept and design", "Fabrication and installation", "Mall and exhibition stands", "Staffing on the stand", "On-site PR management"],
    ar: ["فكرة الجناح وتصميمه", "التصنيع والتركيب", "أجنحة المراكز التجارية والمعارض", "فريق عمل الجناح", "إدارة العلاقات العامة في أرض الحدث"],
  },
  "product-launches-activations": {
    en: ["Launch concept and the reveal", "Brand activations in malls and venues", "Technology and robotics experiences", "Sponsor activations", "Branded environments"],
    ar: ["فكرة الإطلاق ولحظة الكشف", "تفعيل العلامات في المراكز التجارية والقاعات", "تجارب التقنية والروبوتات", "تفعيلات الرعاة", "مساحات بهوية العلامة"],
  },
  "galas-private-celebrations": {
    en: ["Concept decks and theming", "Gala and wedding décor", "Floral design and styling", "Giveaways and keepsakes", "Photobooths and guest moments", "Full on-day production"],
    ar: ["ملف الفكرة واختيار الطابع", "ديكور الحفلات والأعراس", "تصميم الزهور وتنسيق المكان", "الهدايا والتذكارات", "ركن التصوير ولحظات الضيوف", "تنفيذ اليوم كاملًا"],
  },
  "catering-heritage-hospitality": {
    en: ["Majlis setups and desert tents", "Arabic coffee and welcome ceremonies", "Heritage carts and live stations", "Signature desserts and beverages", "Buffet and table styling", "Private service and boardroom hospitality"],
    ar: ["تجهيز المجالس والخيام الصحراوية", "القهوة العربية ومراسم الاستقبال", "العربات التراثية ومحطات الطهي الحية", "حلويات ومشروبات مميّزة", "تنسيق البوفيه والطاولات", "الخدمة الخاصة وضيافة الاجتماعات التنفيذية"],
  },
  "stage-technical-production": {
    en: ["Stage design", "Rigging", "Live sound", "Lighting", "Screens", "Technical setup, run by one crew"],
    ar: ["تصميم المسرح", "تركيب الهياكل وتعليق المعدات", "الصوت المباشر", "الإضاءة", "الشاشات", "تجهيز تقني يديره فريق واحد"],
  },
  "commercial-large-format-printing": {
    en: ["Roll-up banners", "Feather flags", "Business cards", "Brochures", "Backdrops and wall graphics"],
    ar: ["لافتات رول أب", "أعلام الريشة", "بطاقات العمل", "البروشورات", "الخلفيات والرسومات الجدارية"],
  },
  "corporate-gifts": {
    en: ["Gift sets", "Branded bottles", "Bags", "Notebooks & pens", "Giveaways", "Screen printing, UV, foiling, debossing and laser engraving"],
    ar: ["أطقم الهدايا", "زجاجات بهوية العلامة", "الحقائب", "الدفاتر والأقلام", "الهدايا الترويجية", "الطباعة الحريرية، والطباعة بالأشعة فوق البنفسجية، والطباعة بالرقائق المعدنية، والكبس الغائر، والحفر بالليزر"],
  },
  // Creative Production: copy deck docs/content/category-copy-creative.md (draft for Rand's
  // review; v1 decks task, with the clear fixes from deck-review-2026-11-09.md).
  photography: {
    en: ["Event coverage", "Product photography", "Food styling and photography", "Portraits", "Light planned for each shot"],
    ar: ["تغطية الفعاليات", "تصوير المنتجات", "تنسيق الأطباق وتصويرها", "البورتريه", "إضاءة مدروسة لكل لقطة"],
  },
  "video-production": {
    en: ["Script and shoot", "Cinematic product and brand films", "Event films and coverage", "Editing and colour", "Sound design and post-production"],
    ar: ["النص والتصوير", "أفلام سينمائية للمنتجات والعلامات", "أفلام الفعاليات وتغطيتها", "المونتاج وتصحيح الألوان", "تصميم الصوت ومرحلة ما بعد الإنتاج"],
  },
  "motion-graphics": {
    en: ["Motion graphics and logo animation", "Titles and explainers", "Short videos and motion for social media", "Screen content for events and stages"],
    ar: ["موشن جرافيك وتحريك الشعارات", "العناوين وفيديوهات الشرح", "مقاطع قصيرة وموشن جرافيك لمنصات التواصل", "محتوى الشاشات للفعاليات والمسارح"],
  },
  "ai-content-creation": {
    en: ["AI video ads and short videos", "Cinematic AI video", "AI imagery and campaign key visuals", "Art direction true to your brand", "Editing, sound and finishing"],
    ar: ["إعلانات فيديو ومقاطع قصيرة بالذكاء الاصطناعي", "فيديو سينمائي بالذكاء الاصطناعي", "صور بالذكاء الاصطناعي ومرئيات رئيسية للحملات", "توجيه فني يلتزم بهويتك", "المونتاج والصوت واللمسات الأخيرة"],
  },
  "set-stage-design": {
    en: ["Set and stage concepts", "Drawings and 3D models", "Sets built for the camera", "Stages built for the room"],
    ar: ["فكرة الديكور والمسرح", "الرسومات والنماذج ثلاثية الأبعاد", "ديكورات مبنية للكاميرا", "مسارح مبنية للقاعة"],
  },
  "equipment-camera-rental": {
    en: ["Cameras", "Lenses", "Lighting", "Audio"],
    ar: ["الكاميرات", "العدسات", "الإضاءة", "الصوت"],
  },
  // Marketing & Brand: copy deck docs/content/category-copy-marketing.md (draft, as above).
  "branding-identity": {
    en: ["Brand strategy", "Naming", "Logo and visual identity", "Tone of voice", "Brand guidelines"],
    ar: ["استراتيجية العلامة", "ابتكار الاسم", "الشعار والهوية البصرية", "نبرة الخطاب", "دليل الهوية"],
  },
  "social-media-management": {
    en: ["Content strategy and a monthly calendar", "Daily publishing in Arabic and English", "Design, motion and short videos", "On-ground coverage", "Community management", "Paid campaigns and growth"],
    ar: ["استراتيجية المحتوى وخطة نشر شهرية", "نشر يومي بالعربية والإنجليزية", "التصميم والموشن جرافيك والمقاطع القصيرة", "التغطية من أرض الحدث", "إدارة التفاعل مع الجمهور", "حملات مدفوعة ونمو الحسابات"],
  },
  "digital-marketing-seo": {
    en: ["Search engine optimisation", "Site speed and Core Web Vitals", "Analytics and reporting", "Measurement across search and your site"],
    ar: ["تحسين الظهور في محركات البحث", "سرعة الموقع ومؤشرات أداء الويب الأساسية", "التحليلات والتقارير", "قياس النتائج في البحث وعلى موقعك"],
  },
  "content-strategy": {
    en: ["Messages and topics per channel", "A monthly content calendar", "Arabic and English content", "Content systems and templates"],
    ar: ["الرسائل والمواضيع لكل قناة", "خطة محتوى شهرية", "محتوى بالعربية والإنجليزية", "أنظمة المحتوى وقوالبه"],
  },
  "public-relations": {
    en: ["Press releases and announcements", "Media relations", "On-site PR at exhibitions and events", "Media coverage after the event"],
    ar: ["البيانات الصحفية والإعلانات الرسمية", "العلاقات الإعلامية", "العلاقات العامة في أرض المعارض والفعاليات", "التغطية الإعلامية بعد الحدث"],
  },
  "paid-media-planning": {
    en: ["Google Ads campaigns", "Meta campaigns on Facebook and Instagram", "Channel and budget planning", "Campaign timing and flighting", "Performance reporting"],
    ar: ["حملات Google", "حملات Meta على فيسبوك وإنستغرام", "تخطيط القنوات والميزانيات", "توقيت الحملات وجدولتها", "تقارير الأداء"],
  },
  // Production, Print & Gifts: copy deck docs/content/category-copy-print.md (draft, as above;
  // printing and gifts keep the D71 points and add the deck's).
  "stand-fabrication-signage": {
    en: ["Stand design", "Fabrication", "Installation on site", "Activations and branded spaces", "Wayfinding signage"],
    ar: ["تصميم الأجنحة", "التصنيع", "التركيب في أرض الحدث", "مساحات التفعيل والمساحات بهوية العلامة", "لافتات إرشادية للضيوف"],
  },
  "packaging-design": {
    en: ["Custom boxes and wraps", "Packaging for awards and gift sets", "Structure and dielines", "Print-ready artwork"],
    ar: ["علب وتغليف حسب الطلب", "تغليف للجوائز وأطقم الهدايا", "الهيكل وقوالب القصّ", "ملفات جاهزة للطباعة"],
  },
  "online-print-store": {
    en: ["Choose the item and the quantity", "Send your artwork, or ask for a reprint", "Approve the proof before printing", "Printed to brand standard"],
    ar: ["اختر المنتج والكمية", "أرسل التصميم، أو اطلب إعادة طباعة", "اعتمد النسخة التجريبية قبل التنفيذ", "طباعة بمعايير علامتك"],
  },
  "branded-merchandise": {
    en: ["Apparel", "Bags and totes", "Desk and everyday objects", "Printed or engraved, to suit the material"],
    ar: ["الملابس", "الحقائب وحقائب القماش", "أدوات المكتب والاستخدام اليومي", "طباعة أو حفر بما يناسب الخامة"],
  },
  // Software & Digital: copy deck docs/content/category-copy-software.md (draft, as above;
  // exactly 3 deliverables per service, D65).
  websites: {
    en: ["Arabic and English, with full right-to-left layouts", "A content system your team runs", "SEO and speed from day one"],
    ar: ["العربية والإنجليزية، مع دعم كامل للاتجاه من اليمين إلى اليسار", "نظام لإدارة المحتوى يديره فريقك", "الظهور في محركات البحث والسرعة من اليوم الأول"],
  },
  "mobile-apps": {
    en: ["iOS and Android", "Connected to your website", "Arabic and English"],
    ar: ["iOS وAndroid", "مرتبط بموقعك الإلكتروني", "بالعربية والإنجليزية"],
  },
  "custom-systems": {
    en: ["Admin dashboards and analytics", "Roles and permissions", "Integrations with your tools"],
    ar: ["لوحات إدارة وتحليلات", "أدوار وصلاحيات لفريقك", "الربط بأدواتك وأنظمتك"],
  },
  "e-commerce": {
    en: ["Catalogue management", "Checkout and payment integration", "An orders dashboard"],
    ar: ["إدارة المنتجات", "إتمام الشراء وربط بوابات الدفع", "لوحة لمتابعة الطلبات"],
  },
  "ui-ux-design": {
    en: ["User research and flows", "Clickable prototypes", "A design system"],
    ar: ["بحث المستخدمين ومسارات الاستخدام", "نماذج تفاعلية للتجربة", "نظام تصميم"],
  },
  "ai-consulting": {
    en: ["A review of where AI fits your work", "A pilot plan", "Getting your team started"],
    ar: ["مراجعة لمواضع فائدة الذكاء الاصطناعي في عملك", "خطة لتجربة أولى", "تهيئة فريقك للبدء"],
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
  "commercial-large-format-printing": { anchor: "printing", module: "human-scale" },
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
      points: POINTS[slug],
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
        ar: "البرنامج والمكان والمتحدثون وإدارة اليوم، في خطة واحدة.",
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
        ar: "عناوين وفيديوهات شرح ومحتوى للشاشات، بحركة هادفة.",
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
        en: "Search, site speed and measurement that show what works.",
        ar: "محركات البحث وسرعة الموقع والقياس، لتعرف ما الذي ينجح.",
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
        ar: "الصحافة والعلاقات الإعلامية والبيانات الرسمية، نتولّاها بعناية.",
      },
    ],
    [
      "paid-media-planning",
      { en: "Paid media & media planning (Google & Meta ads)", ar: "الإعلانات المدفوعة وتخطيط الإعلام (Google وMeta)" },
      {
        en: "Google and Meta campaigns, with the channels, budgets and timing behind them matched to the audience.",
        ar: "حملات Google وMeta، نخطّط لقنواتها وميزانياتها وتوقيتها بما يناسب الجمهور.",
      },
    ],
  ]),
  ...group("production-print-gifts", [
    [
      "commercial-large-format-printing",
      { en: "Commercial & large-format printing", ar: "الطباعة التجارية وكبيرة الحجم" },
      {
        en: "From business cards and brochures to banners, backdrops and wall graphics, printed to scale.",
        ar: "من بطاقات العمل والبروشورات إلى اللافتات والخلفيات والرسومات الجدارية، مطبوعة بالمقاس المطلوب.",
      },
    ],
    [
      "stand-fabrication-signage",
      { en: "Stand fabrication & signage", ar: "تصنيع الأجنحة واللافتات" },
      {
        en: "Exhibition stands, activations and branded spaces, designed, fabricated and installed, with the signage that guides guests.",
        ar: "أجنحة معارض ومساحات تفعيل ومساحات تحمل هوية العلامة، نصمّمها ونصنّعها ونركّبها، مع لافتات ترشد الضيوف.",
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
        ar: "هدايا نختارها ونضع عليها هويتك ونوصلها إلى عملائك وفريقك.",
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
        ar: "تطبيقات iOS وAndroid مصمّمة وفق طريقة استخدام الناس لها.",
      },
    ],
    [
      "custom-systems",
      { en: "Custom systems", ar: "أنظمة مخصّصة" },
      {
        en: "Internal tools and systems built for the way your team works.",
        ar: "أدوات وأنظمة داخلية نبنيها وفق طريقة عمل فريقك.",
      },
    ],
    [
      "e-commerce",
      { en: "E-commerce", ar: "المتاجر الإلكترونية" },
      {
        en: "Online stores with clear checkout and simple management.",
        ar: "متاجر إلكترونية بخطوات شراء واضحة وإدارة بسيطة.",
      },
    ],
    [
      "ui-ux-design",
      { en: "UI/UX design", ar: "تصميم الواجهات وتجربة المستخدم" },
      {
        en: "Interfaces researched, prototyped and tested before they are built.",
        ar: "واجهات ندرس مستخدميها ونجرّب نماذجها ونختبرها قبل بنائها.",
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
