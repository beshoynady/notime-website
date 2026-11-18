import type { Localized } from "./types";

/**
 * A hook per service section: one outcome-first line between the H2 and the approved promise
 * ("final push" §3). Keyed by service slug; a service without one shows its promise alone, so the
 * other categories can add theirs without touching the template. Each line rests on the profile or
 * the copy deck (sources noted); no figure, no time promise.
 */
export const SERVICE_HOOKS: Record<string, Localized<string>> = {
  // Events & Hospitality (batch 2). Sources: docs/content/category-copy-events.md, profile-copy.md.
  "conferences-summits": {
    // p.4 (concept to guest experience), p.6 (ceremonies and award nights)
    en: "The whole day on one running order, from the first badge to the closing ceremony.",
    ar: "اليوم كله على برنامج واحد، من أول بطاقة تسجيل حتى حفل الختام.",
  },
  "exhibitions-booths": {
    // p.19, p.21 (design, fabrication, installation, on-site PR); D56 (staffed)
    en: "A stand people step into, drawn, built and staffed by the same team.",
    ar: "جناح يدخله الزوّار، يرسمه ويبنيه ويديره فريق واحد.",
  },
  "product-launches-activations": {
    // p.4 (concept), p.7 (technology and robotics), p.8 (malls, venues, exhibitions)
    en: "The reveal lasts a few seconds. We build everything that leads up to it.",
    ar: "لحظة الكشف ثوانٍ معدودة، ونحن نبني كل ما يسبقها.",
  },
  "galas-private-celebrations": {
    // p.9–p.11 (décor, florals, keepsakes, full on-day production)
    en: "We choose the theme, dress the tables, set the flowers and, if you'd like, prepare a keepsake for every guest.",
    ar: "نختار طابع الأمسية، ونجهّز الطاولات والزهور، ونعدّ تذكارًا تودّعون به ضيوفكم إن أردتم.",
  },
  "catering-heritage-hospitality": {
    // p.31–p.32 (majlis, tents, Arabic coffee, welcome ceremonies, heritage carts)
    en: "Coffee poured the way your guests expect, in a majlis set before they arrive.",
    ar: "قهوة تُصبّ كما يعرفها ضيوفكم، في مجلس جاهز قبل وصولهم.",
  },
  "stage-technical-production": {
    // p.33 (stage, rigging, live sound); D56 ("rigged and run by one crew")
    en: "Sound, light and screens on one cue sheet, run by the crew that rigged them.",
    ar: "الصوت والإضاءة والشاشات على جدول إشارات واحد، يديره الفريق الذي ركّبها.",
  },
  // Creative Production (step 3). Sources: profile p.14 (AI content & motion), category-copy-creative.md.
  photography: {
    // deck: "light planned for each shot"; events, products, food
    en: "Every shot lit on purpose: the room on the night, the product on the table, the dish before it cools.",
    ar: "لكل لقطة إضاءتها المقصودة: القاعة ليلة الحدث، والمنتج على الطاولة، والطبق قبل أن يبرد.",
  },
  "video-production": {
    // p.14 (cinematic films; editing, sound design and post-production)
    en: "One crew from the script to the colour grade, so the film you approved on paper is the film you get.",
    ar: "فريق واحد من كتابة النص حتى تصحيح الألوان، فيصلكم الفيلم كما وافقتم عليه على الورق.",
  },
  "motion-graphics": {
    // p.14 (motion graphics and logo animation); deck (screen content for stages)
    en: "Your logo, your titles and your stage screens, moving in one style.",
    ar: "شعاركم وعناوينكم وشاشات مسرحكم، تتحرّك كلها بأسلوب واحد.",
  },
  "ai-content-creation": {
    // p.14 (AI video ads, AI imagery and key visuals, "produced with AI")
    en: "AI shortens the making. Art direction keeps every frame on brand.",
    ar: "الذكاء الاصطناعي يختصر وقت الإنتاج، والتوجيه الفني يُبقي كل لقطة على هوية علامتكم.",
  },
  "set-stage-design": {
    // deck (drawings and 3D models; sets for the camera, stages for the room)
    en: "Drawn and modelled before anything is built, so the set works for the lens and the stage works for the room.",
    ar: "نرسمه ونجسّمه قبل أن نبنيه، ليخدم الديكور عدسة الكاميرا ويخدم المسرح القاعة.",
  },
  "equipment-camera-rental": {
    // deck (cameras, lenses, lighting, audio); no inventory claim until OQ #22
    en: "Cameras, lenses, lighting and audio for your shoot, booked in one request.",
    ar: "الكاميرات والعدسات والإضاءة والصوت لتصويركم، تحجزونها بطلب واحد.",
  },
  // Marketing & Brand (step 3). Sources: profile p.12–13, p.17, p.19; category-copy-marketing.md.
  "branding-identity": {
    // deck (strategy, naming, identity, tone of voice, guidelines)
    en: "A name, a mark and a voice that still hold together on the hundredth post.",
    ar: "اسم وشعار ونبرة خطاب تبقى متماسكة حتى في المنشور المئة.",
  },
  "social-media-management": {
    // p.17 (daily publishing in Arabic and English); deck (monthly calendar)
    en: "Daily publishing in Arabic and English, from a calendar you have already approved.",
    ar: "نشر يومي بالعربية والإنجليزية، وفق خطة نشر اعتمدتموها مسبقًا.",
  },
  "digital-marketing-seo": {
    // p.15 (SEO & performance, Core Web Vitals, analytics)
    en: "Found in search, fast on a phone, and measured, so the next decision rests on numbers.",
    ar: "ظهور في نتائج البحث، وسرعة على الهاتف، وقياس يجعل قراركم التالي مبنيًا على الأرقام.",
  },
  "content-strategy": {
    // deck (messages per channel, monthly calendar, templates)
    en: "One written plan for what each channel says, so nothing goes out on guesswork.",
    ar: "خطة مكتوبة واحدة لما تقوله كل قناة، فلا يُنشر شيء بالتخمين.",
  },
  "public-relations": {
    // p.19 (stand design, build and on-site PR, and the media coverage that follows)
    en: "From the stand on the show floor to the coverage that follows it.",
    ar: "من الجناح في أرض المعرض إلى التغطية الإعلامية التي تليه.",
  },
  "paid-media-planning": {
    // deck (channels, budgets and timing matched to the audience; performance reporting)
    en: "Budget placed where your audience actually scrolls, and reported in plain numbers.",
    ar: "ميزانيتكم حيث يتصفّح جمهوركم فعلًا، وتقارير بأرقام واضحة.",
  },
  // Production, Print & Gifts (step 3). Sources: profile p.19, p.21–24; category-copy-print.md.
  "commercial-large-format-printing": {
    // deck (business cards to backdrops and wall graphics, printed to scale)
    en: "From a business card to a wall graphic, the same colour and the same brand.",
    ar: "من بطاقة العمل إلى الرسم الجداري، اللون نفسه والهوية نفسها.",
  },
  "stand-fabrication-signage": {
    // p.19 (stand design, build and on-site management)
    en: "Designed, built and installed by the team that planned it.",
    ar: "يصمّمه ويصنّعه ويركّبه الفريق نفسه الذي خطّط له.",
  },
  "packaging-design": {
    // deck (boxes, award and gift-set packaging, dielines)
    en: "The box is the first thing they open, so we design it to feel like the brand.",
    ar: "العلبة أول ما يفتحه ضيوفكم، فنصمّمها لتحمل إحساس العلامة.",
  },
  "corporate-gifts": {
    // profile (gift sets; screen printing, UV, foiling, debossing, laser engraving)
    en: "Chosen for the person, finished in foil, UV, deboss or laser, and delivered.",
    ar: "هدية نختارها لصاحبها، ونمنحها لمستها بالرقائق المعدنية أو UV أو الكبس أو الليزر، ثم نوصلها إليه.",
  },
  "print-ordering": {
    // deck (choose, send artwork or reprint, approve the proof); OQ #23
    en: "Reorder approved print without starting from scratch.",
    ar: "أعيدوا طلب مطبوعاتكم المعتمدة دون أن تبدؤوا من جديد.",
  },
  "branded-merchandise": {
    // deck (apparel, bags, everyday objects; printed or engraved to suit the material)
    en: "Apparel and everyday objects worth keeping, with the logo placed with restraint.",
    ar: "ملابس وأدوات يومية تستحق أن يُحتفظ بها، والشعار عليها بهدوء.",
  },
};

export function serviceHook(slug: string): Localized<string> | undefined {
  return SERVICE_HOOKS[slug];
}
