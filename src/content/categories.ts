import type { Category } from "./types";

// Titles and summaries: the reference prototype's copy, kept with the approved services (D56).
// Theme, intro and FAQ: category pages (D57, docs/design/category-pages.md).

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
        a: { en: "We're based in Dubai and work across six markets: the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. For other locations, ask us.", ar: "مقرّنا في دبي، ونعمل في ستة أسواق: الإمارات والسعودية وقطر وعُمان والكويت ومصر. ولأي مكان آخر، اسألنا." },
      },
      // D78 fills (#28), approved 2026-11-09: general but true, no numbers or promised times.
      {
        q: { en: "How many guests can you host?", ar: "كم ضيفًا يمكنكم استقبالُه؟" },
        a: { en: "From intimate gatherings to award nights and large corporate and government events. Tell us your guest count and we'll plan around it.", ar: "من اللقاءات العائلية الخاصة إلى ليالي الجوائز والفعاليات الكبرى للشركات والجهات الحكومية. أخبرنا بعدد ضيوفك، ونخطّط على أساسه." },
      },
      {
        q: { en: "How far ahead should I book?", ar: "قبل كم من الوقت ينبغي أن أحجز؟" },
        a: { en: "It depends on the scale of the event. Share your date and we'll confirm availability.", ar: "يعتمد ذلك على حجم المناسبة. شاركنا الموعد، ونؤكّد لك مدى توفّرنا." },
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
    intro: { en: "Photography, video, motion graphics and AI content, with the sets and the equipment behind them. We cover events on the ground, shoot products and food, and take every piece through editing, sound and post-production.", ar: "تصوير فوتوغرافي وفيديو وموشن جرافيك ومحتوى بالذكاء الاصطناعي، ومعها الديكورات والمعدّات اللازمة. نغطّي الفعاليات في أرض الحدث، ونصوّر المنتجات والأطباق، ونتابع كل عمل حتى المونتاج وتصميم الصوت ومرحلة ما بعد الإنتاج." },
    // Copy deck draft for Rand's review (v1 decks task) + the D78 FAQ fills; clear fixes applied.
    faq: [
      {
        q: { en: "Do you cover events with photo and video?", ar: "هل تغطّون الفعاليات بالصور والفيديو؟" },
        a: { en: "Yes. We photograph and film on the ground, then edit the material for your channels.", ar: "نعم. نصوّر الفعالية صورًا وفيديو في أرض الحدث، ثم نجهّز المادة بالمونتاج لتناسب قنواتك." },
      },
      {
        q: { en: "Do you make images and video with AI?", ar: "هل تصنعون الصور والفيديو بالذكاء الاصطناعي؟" },
        a: { en: "Yes: AI video ads and short videos, cinematic AI video, and AI imagery and key visuals for campaigns, art-directed to your brand.", ar: "نعم: إعلانات فيديو ومقاطع قصيرة، وفيديو سينمائي، وصور ومرئيات رئيسية للحملات، كلها بالذكاء الاصطناعي وبتوجيه فني يلتزم بهويتك." },
      },
      {
        q: { en: "Do you style and shoot food and products?", ar: "هل تنسّقون الأطباق وتصوّرون المنتجات؟" },
        a: { en: "Yes: food styling, product photography and cinematic product films.", ar: "نعم: تنسيق الأطباق وتصويرها، وتصوير المنتجات، وأفلام سينمائية للمنتجات." },
      },
      {
        q: { en: "Do you handle editing and sound?", ar: "هل تتولّون المونتاج والصوت؟" },
        a: { en: "Yes. We take each video from the script and the shoot to the final edit, colour and sound.", ar: "نعم. نتابع كل فيديو من النص والتصوير حتى المونتاج النهائي وتصحيح الألوان والصوت." },
      },
      {
        q: { en: "Can I rent equipment?", ar: "هل يمكنني استئجار المعدّات؟" },
        a: { en: "Yes: cameras, lenses, lighting and sound. Tell us what you need and your dates, and we'll confirm availability.", ar: "نعم: الكاميرات والعدسات والإضاءة والصوت. أخبرنا بما تحتاجه وبالمواعيد، ونؤكّد لك التوفّر." },
      },
      {
        q: { en: "Who owns the photos and videos after delivery?", ar: "لمن تعود ملكية الصور والفيديوهات بعد التسليم؟" },
        a: { en: "Usage rights are agreed in each proposal, before the shoot starts.", ar: "نتّفق على حقوق الاستخدام في كل عرض، قبل بدء التصوير." },
      },
      {
        q: { en: "How long does editing take?", ar: "كم يستغرق المونتاج؟" },
        a: { en: "It depends on the length and the kind of edit. We agree the schedule with you in the proposal.", ar: "يعتمد ذلك على مدة العمل ونوع المونتاج، ونتّفق معك على الجدول الزمني في العرض." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون مني للبدء؟" },
        a: { en: "Tell us what you want to make, where it will be shown and when you need it. We'll come back with a treatment and a proposal.", ar: "أخبرنا بما تريد صنعه، وأين سيُعرض، ومتى تحتاجه، ونعود إليك بتصوّر وعرض." },
      },
    ],
    closing: { en: "Your first take starts here.", ar: "لقطتك الأولى تبدأ من هنا." },
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
    intro: { en: "Brand strategy and identity, social media, search, PR and paid media, planned together so the brand speaks with one voice. We publish in Arabic and English, measure what runs, and report on it.", ar: "استراتيجية العلامة وهويتها، ووسائل التواصل الاجتماعي، ومحركات البحث، والعلاقات العامة، والإعلانات المدفوعة، في خطة واحدة تمنح العلامة صوتًا واحدًا. ننشر بالعربية والإنجليزية، ونقيس ما يُنشر، ونرفع عنه التقارير." },
    // Copy deck draft for Rand's review (v1 decks task) + the D78 FAQ fills; clear fixes applied.
    faq: [
      {
        q: { en: "Do you publish in Arabic and English?", ar: "هل تنشرون بالعربية والإنجليزية؟" },
        a: { en: "Yes. We write and publish in both languages, and each language is written natively, not translated word for word.", ar: "نعم. نكتب وننشر باللغتين، ونكتب كل لغة بأسلوبها، لا بترجمة حرفية." },
      },
      {
        q: { en: "Do you run Google and Meta ads?", ar: "هل تديرون إعلانات Google وMeta؟" },
        a: { en: "Yes. We plan the channels, the budget and the timing, run the campaigns, and report on how they performed.", ar: "نعم. نخطّط للقنوات والميزانية والتوقيت، وندير الحملات، ونرفع تقارير عن أدائها." },
      },
      {
        q: { en: "Can one team handle the identity, the content and the ads?", ar: "هل يتولى فريق واحد الهوية والمحتوى والإعلانات؟" },
        a: { en: "Yes. Strategy, identity, content, social media, PR and paid media sit under one roof and follow one plan.", ar: "نعم. الاستراتيجية والهوية والمحتوى ووسائل التواصل والعلاقات العامة والإعلانات المدفوعة عندنا تحت سقف واحد، وتسير وفق خطة واحدة." },
      },
      {
        q: { en: "How do you report results?", ar: "كيف تعرضون النتائج؟" },
        a: { en: "With analytics and a written report: what ran, who it reached and what worked.", ar: "بالتحليلات وتقرير مكتوب: ما الذي نُشر، ومن وصل إليه، وما الذي نجح." },
      },
      {
        q: { en: "How often do you report?", ar: "كم مرة ترفعون التقارير؟" },
        a: { en: "We agree the reporting rhythm with you at the start, to match the plan and its campaigns.", ar: "نتّفق معك على مواعيد التقارير منذ البداية، بما يناسب الخطة وحملاتها." },
      },
      {
        q: { en: "Is there a minimum term?", ar: "هل هناك مدة تعاقد دنيا؟" },
        a: { en: "The term is set in each proposal, to fit the plan.", ar: "تُحدَّد مدة التعاقد في كل عرض، بما يناسب الخطة." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون مني للبدء؟" },
        a: { en: "Your goals, your audience, the channels you use today, and your brand guidelines if you have them. We'll come back with a plan and a proposal.", ar: "أهدافك وجمهورك والقنوات التي تستخدمها الآن، ودليل هويتك إن وُجد، ونعود إليك بخطة وعرض." },
      },
    ],
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
    intro: { en: "Stands and signage, commercial and large-format print, packaging, corporate gifts and merchandise, produced to brand standard. We design, fabricate and install, and finish each gift with the branding method that suits it.", ar: "أجنحة ولافتات، وطباعة تجارية وكبيرة الحجم، وتغليف، وهدايا للشركات، ومنتجات بهوية العلامة، تُنتَج بمعايير علامتك. نصمّم ونصنّع ونركّب، ونختار لكل هدية طريقة الطباعة أو الحفر التي تليق بها." },
    // Copy deck draft for Rand's review (v1 decks task) + the D78 FAQ fills; clear fixes applied.
    faq: [
      {
        q: { en: "Which branding methods do you use?", ar: "ما طرق الطباعة والحفر التي تستخدمونها؟" },
        a: { en: "Screen printing, UV printing, foiling, debossing and laser engraving, chosen to suit each item.", ar: "الطباعة الحريرية، والطباعة بالأشعة فوق البنفسجية، والطباعة بالرقائق المعدنية، والكبس الغائر، والحفر بالليزر، ونختار منها ما يناسب كل قطعة." },
      },
      {
        q: { en: "Do you install the stands you build?", ar: "هل تركّبون الأجنحة التي تصنعونها؟" },
        a: { en: "Yes. We design, fabricate and install exhibition stands, activations and branded spaces.", ar: "نعم. نصمّم أجنحة المعارض ومساحات التفعيل والمساحات بهوية العلامة، ونصنّعها ونركّبها." },
      },
      {
        q: { en: "Can I order prints online?", ar: "هل يمكنني طلب المطبوعات عبر الإنترنت؟" },
        a: { en: "Yes. Send your order through the form on this page, and we'll confirm the details and the proof with you before printing.", ar: "نعم. أرسل طلبك عبر النموذج في هذه الصفحة، ونؤكّد معك التفاصيل والنسخة التجريبية قبل التنفيذ." },
      },
      {
        q: { en: "Do you make packaging for gifts and awards?", ar: "هل تصمّمون تغليفًا للهدايا والجوائز؟" },
        a: { en: "Yes: custom boxes and wraps for gift sets and awards.", ar: "نعم: علب وتغليف حسب الطلب لأطقم الهدايا والجوائز." },
      },
      {
        q: { en: "Is there a minimum quantity?", ar: "هل هناك حدّ أدنى للكمية؟" },
        a: { en: "It depends on the item and the branding method. Tell us what you need, and we'll advise on quantities.", ar: "يعتمد ذلك على المنتج وطريقة الطباعة أو الحفر. أخبرنا بما تحتاجه، ونقترح عليك الكميات المناسبة." },
      },
      {
        q: { en: "How long does production take?", ar: "كم يستغرق التنفيذ؟" },
        a: { en: "It depends on the item, the quantity and the finish. Share your deadline and we'll confirm what's possible.", ar: "يعتمد ذلك على المنتج والكمية والتشطيب. شاركنا الموعد المطلوب، ونؤكّد لك ما يمكن تنفيذه." },
      },
      {
        q: { en: "Do you deliver?", ar: "هل توصلون الطلبات؟" },
        a: { en: "Tell us where your order needs to go, and we'll confirm delivery with the proposal.", ar: "أخبرنا إلى أين يجب أن يصل طلبك، ونؤكّد لك التوصيل مع العرض." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون مني للبدء؟" },
        a: { en: "The item, the quantity, the sizes, your deadline, and your artwork or logo files. We'll come back with options and a proposal.", ar: "المنتج والكمية والمقاسات والموعد المطلوب، وملفات التصميم أو الشعار، ونعود إليك بخيارات وعرض." },
      },
    ],
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
    intro: { en: "Websites, mobile apps, custom systems and online stores, designed and built in Arabic and English. We take each one end to end, from UX and design systems to development, content management and analytics, and build it to load fast.", ar: "مواقع إلكترونية وتطبيقات جوّال وأنظمة مخصّصة ومتاجر إلكترونية، نصمّمها ونبنيها بالعربية والإنجليزية. نتولّى كلًّا منها من البداية إلى النهاية: من تجربة المستخدم وأنظمة التصميم إلى البرمجة وإدارة المحتوى والتحليلات، ونبنيها لتعمل بسرعة." },
    // Copy deck draft for Rand's review (v1 decks task) + the D78 FAQ fills; clear fixes applied.
    faq: [
      {
        q: { en: "How long does a website take?", ar: "كم يستغرق بناء موقع إلكتروني؟" },
        a: { en: "It depends on the scope. After the intro call we send a plan with the steps and the dates for your project.", ar: "يعتمد ذلك على حجم المشروع. بعد مكالمة التعارف نرسل لك خطة بالمراحل والمواعيد الخاصة بمشروعك." },
      },
      {
        q: { en: "Is the Arabic as good as the English?", ar: "هل تكون النسخة العربية بجودة الإنجليزية نفسها؟" },
        a: { en: "Yes. We design and build in both languages from the start, with full right-to-left layouts, not a translation added at the end.", ar: "نعم. نصمّم ونبني باللغتين من البداية، مع دعم كامل للاتجاه من اليمين إلى اليسار، لا بترجمة تُضاف في النهاية." },
      },
      {
        q: { en: "Can you connect to the systems we already use?", ar: "هل يمكنكم الربط بالأنظمة التي نستخدمها؟" },
        a: { en: "Yes. We integrate with your tools through APIs and data feeds.", ar: "نعم. نربط المنصّة بأدواتك عبر الواجهات البرمجية وتبادل البيانات." },
      },
      {
        q: { en: "Do you build technology for events?", ar: "هل تبنون تقنيات للفعاليات؟" },
        a: { en: "Yes: event apps and websites, and live results and screens. Our QR check-in product is coming soon.", ar: "نعم: تطبيقات ومواقع للفعاليات، ونتائج مباشرة وشاشات. ويصدر قريبًا منتجنا لتسجيل الحضور برمز QR." },
      },
      {
        q: { en: "Do you support the product after launch?", ar: "هل تقدّمون الدعم بعد الإطلاق؟" },
        a: { en: "Yes. Support and maintenance after launch are part of how we work, and their scope is agreed in the proposal.", ar: "نعم. الدعم والصيانة بعد الإطلاق جزء من طريقة عملنا، ونتّفق على نطاقهما في العرض." },
      },
      {
        q: { en: "How long does a project take?", ar: "كم يستغرق المشروع؟" },
        a: { en: "It depends on the scope. We share a timeline with the proposal, and you see progress at every stage.", ar: "يعتمد ذلك على نطاق العمل. نرسل الجدول الزمني مع العرض، وترى التقدّم في كل مرحلة." },
      },
      {
        q: { en: "Who owns the code and the content?", ar: "لمن تعود ملكية الكود والمحتوى؟" },
        a: { en: "Ownership and licensing are set out in each proposal, before work starts.", ar: "تُحدَّد الملكية والترخيص في كل عرض، قبل بدء العمل." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون مني للبدء؟" },
        a: { en: "A few lines on what you want to build and who it's for. Book a free 30-min intro call, and we'll take it from there.", ar: "بضعة أسطر عمّا تريد بناءه ولمن. احجز مكالمة تعارف مجانية (30 دقيقة)، ونتابع معك الخطوات التالية." },
      },
    ],
    closing: { en: "Your idea is the next blinking cursor.", ar: "فكرتك هي المؤشّر الذي يومض الآن." },
  },
];
