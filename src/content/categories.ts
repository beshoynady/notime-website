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
      ar: "مؤتمرات ومعارض وحفلات إطلاق ومناسبات خاصة، من أول فكرة حتى يغادر آخر ضيف.",
    },
    // Search wording (copy rewrite): people search "event management Dubai"; the card and the H1 keep the title and summary.
    metaTitle: { en: "Events & hospitality in Dubai", ar: "تنظيم الفعاليات والضيافة في دبي" },
    metaDescription: {
      en: "Conferences, stands, launches, weddings and majlis hospitality, planned in Dubai and run on the day by the same team, until the last guest leaves.",
      ar: "مؤتمرات وأجنحة معارض وحفلات إطلاق وأعراس ومجالس ضيافة، نخطّط لها من دبي ويديرها الفريق نفسه يوم الحدث حتى يغادر آخر ضيف.",
    },
    image: "cat-events-hospitality-4x5",
    photo: "card-events",
    theme: "evening",
    // Copy deck docs/content/category-copy-events.md (approved 2026-11-09).
    intro: {
      en: "Conferences, stands, launches, galas and heritage welcomes. One team draws the concept, dresses the room, runs the stage and looks after your guests on the day.",
      ar: "مؤتمرات وأجنحة وحفلات إطلاق وحفلات رسمية واستقبال تراثي. فريق واحد يضع الفكرة، ويجهّز القاعة، ويدير المسرح، ويهتمّ بضيوفكم يوم الحدث.",
    },
    faq: [
      {
        q: { en: "Which events do you run?", ar: "ما أنواع الفعاليات التي تنظّمونها؟" },
        a: { en: "Conferences and summits, exhibitions, product launches and brand activations, galas, weddings and private celebrations, and ceremonies and award nights, for companies, government entities and private clients.", ar: "مؤتمرات وقمم، ومعارض، وإطلاق منتجات وتفعيل علامات تجارية، وحفلات رسمية وأعراس ومناسبات خاصة، وحفلات تكريم وتوزيع جوائز. نعمل للشركات والجهات الحكومية والأفراد." },
      },
      {
        q: { en: "Can one team handle the décor, the catering and the stage?", ar: "هل يتولى فريق واحد الديكور والضيافة والمسرح؟" },
        a: { en: "Yes. Concept, décor, production and guest experience sit with one team, so the décor, the hospitality and the technical crew work to one plan.", ar: "نعم. الفكرة والديكور والإنتاج واستقبال الضيوف كلها عند فريق واحد، فيعمل فريق الديكور وفريق الضيافة والفريق التقني على خطة واحدة." },
      },
      {
        q: { en: "Do you offer heritage hospitality?", ar: "هل تقدّمون الضيافة التراثية؟" },
        a: { en: "Yes: majlis setups, desert tents, Arabic coffee service, heritage carts, live stations and welcome ceremonies.", ar: "نعم: نجهّز المجالس والخيام الصحراوية، ونقدّم القهوة العربية، ومعها العربات التراثية، ومحطات طهي أمام الضيوف، ومراسم الاستقبال." },
      },
      {
        q: { en: "Where do you work?", ar: "أين تعملون؟" },
        a: { en: "We're based in Dubai and work across six markets: the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. For other locations, ask us.", ar: "مقرّنا في دبي، ونعمل في ستة أسواق: الإمارات والسعودية وقطر وعُمان والكويت ومصر. ولأي مكان آخر، اسألونا." },
      },
      // D78 fills (#28), approved 2026-11-09: general but true, no numbers or promised times.
      {
        q: { en: "How many guests can you host?", ar: "كم ضيفًا يمكنكم استقبالُه؟" },
        a: { en: "From intimate gatherings to award nights and large corporate and government events. Tell us your guest count and we'll plan around it.", ar: "من اللقاءات العائلية الخاصة إلى ليالي الجوائز والفعاليات الكبرى للشركات والجهات الحكومية. أخبرونا بعدد ضيوفكم، ونخطّط على أساسه." },
      },
      {
        q: { en: "How far ahead should I book?", ar: "متى ينبغي أن نحجز؟" },
        a: { en: "It depends on the scale of the event. Share your date and we'll confirm availability.", ar: "يتوقّف ذلك على حجم المناسبة. أرسلوا لنا الموعد، ونؤكّد لكم إن كان متاحًا." },
      },
      {
        q: { en: "Can you photograph and film the event?", ar: "هل تصوّرون الفعالية؟" },
        a: { en: "Yes. Event coverage is part of our Creative Production services: photography and video, from the shoot to the final edit.", ar: "نعم. تغطية الفعاليات جزء من خدمات الإنتاج الإبداعي لدينا: التصوير الفوتوغرافي والفيديو، من التصوير حتى المونتاج النهائي." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون منّا للبدء؟" },
        a: { en: "Tell us the date, the type of event, the city and roughly how many guests. We'll come back with a concept and a proposal.", ar: "أخبرونا بالموعد ونوع المناسبة والمدينة والعدد التقريبي للضيوف، ونعود إليكم بتصوّر وعرض." },
      },
    ],
    closing: { en: "Tell us the date. We'll ready the room.", ar: "أخبرونا بالموعد، ونجهّز لكم القاعة." },
  },
  {
    slug: "creative-production",
    order: 2,
    title: { en: "Creative Production", ar: "الإنتاج الإبداعي" },
    summary: {
      en: "Photo, film, motion and AI content, with the sets and equipment to make it.",
      ar: "صورة وفيلم وموشن ومحتوى بالذكاء الاصطناعي، ومعها الديكور والمعدّات التي تصنعها.",
    },
    image: "cat-creative-production-4x5",
    photo: "card-creative",
    theme: "studio",
    intro: { en: "Photography, video, motion graphics and AI content, with the sets and the equipment behind them. We cover events on the ground, shoot products and food, and take every piece through editing, sound and post-production.", ar: "تصوير فوتوغرافي وفيديو وموشن جرافيك ومحتوى بالذكاء الاصطناعي، ومعها الديكورات والمعدّات اللازمة. نغطّي الفعاليات في أرض الحدث، ونصوّر المنتجات والأطباق، ونتابع كل عمل حتى المونتاج وتصميم الصوت ومرحلة ما بعد الإنتاج." },
    // Copy deck draft for Rand's review (v1 decks task) + the D78 FAQ fills; clear fixes applied.
    faq: [
      {
        q: { en: "Do you cover events with photo and video?", ar: "هل تغطّون الفعاليات بالصور والفيديو؟" },
        a: { en: "Yes. We photograph and film on the ground, then edit the material for your channels.", ar: "نعم. نصوّر الفعالية صورًا وفيديو في أرض الحدث، ثم نجهّز المادة بالمونتاج لتناسب قنواتكم." },
      },
      {
        q: { en: "Do you make images and video with AI?", ar: "هل تصنعون الصور والفيديو بالذكاء الاصطناعي؟" },
        a: { en: "Yes: AI video ads and short videos, cinematic AI video, and AI imagery and key visuals for campaigns, art-directed to your brand.", ar: "نعم: إعلانات فيديو ومقاطع قصيرة، وفيديو سينمائي، وصور ومرئيات رئيسية للحملات، كلها بالذكاء الاصطناعي وبتوجيه فني يلتزم بهويتكم." },
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
        q: { en: "Can I rent equipment?", ar: "هل يمكننا استئجار المعدّات؟" },
        a: { en: "Yes: cameras, lenses, lighting and audio. Tell us what you need and your dates, and we'll confirm availability.", ar: "نعم: الكاميرات والعدسات والإضاءة والصوت. أخبرونا بما تحتاجون إليه وبالمواعيد، ونؤكّد لكم التوفّر." },
      },
      {
        q: { en: "Who owns the photos and videos after delivery?", ar: "لمن تعود ملكية الصور والفيديوهات بعد التسليم؟" },
        a: { en: "Usage rights are agreed in each proposal, before the shoot starts.", ar: "نتّفق على حقوق الاستخدام في كل عرض، قبل بدء التصوير." },
      },
      {
        q: { en: "How long does editing take?", ar: "كم يستغرق المونتاج؟" },
        a: { en: "It depends on the length and the kind of edit. We agree the schedule with you in the proposal.", ar: "يعتمد ذلك على مدة العمل ونوع المونتاج، ونتّفق معكم على الجدول الزمني في العرض." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون منّا للبدء؟" },
        a: { en: "Tell us what you want to make, where it will be shown and when you need it. We'll come back with a treatment and a proposal.", ar: "أخبرونا بما تريدون صنعه، وأين سيُعرض، ومتى تحتاجون إليه، ونعود إليكم بتصوّر وعرض." },
      },
    ],
    closing: { en: "Your first take starts here.", ar: "لقطتكم الأولى تبدأ من هنا." },
  },
  {
    slug: "marketing-brand",
    order: 3,
    title: { en: "Marketing & Brand", ar: "التسويق والعلامة التجارية" },
    summary: {
      en: "Identity, social, search and PR that keep people talking after the event ends.",
      ar: "هوية، وتواصل اجتماعي، وظهور في البحث، وعلاقات عامة، تُبقي الحديث عنكم قائمًا بعد الفعالية.",
    },
    image: "cat-marketing-brand-4x5",
    photo: "uae-pro-league-3",
    theme: "editorial",
    intro: { en: "Brand strategy and identity, social media, search, PR and paid media, planned together so the brand speaks with one voice. We publish in Arabic and English, measure what runs, and report on it.", ar: "استراتيجية العلامة التجارية وهويتها، ووسائل التواصل الاجتماعي، ومحركات البحث، والعلاقات العامة، والإعلانات المدفوعة، في خطة واحدة تتحدث فيها العلامة بصوت واحد. ننشر بالعربية والإنجليزية، ونقيس أداء كل ما يُنشر، ونقدّم عنه تقارير واضحة." },
    // Copy deck draft for Rand's review (v1 decks task) + the D78 FAQ fills; clear fixes applied.
    faq: [
      {
        q: { en: "Do you publish in Arabic and English?", ar: "هل تنشرون بالعربية والإنجليزية؟" },
        a: { en: "Yes. We write and publish in both languages, and each language is written natively, not translated word for word.", ar: "نعم. نكتب وننشر باللغتين، ونكتب كل لغة بأسلوبها، لا بترجمة حرفية." },
      },
      {
        q: { en: "Do you run Google and Meta ads?", ar: "هل تديرون إعلانات على Google و Meta؟" },
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
        a: { en: "We agree the reporting rhythm with you at the start, to match the plan and its campaigns.", ar: "نتّفق معكم على مواعيد التقارير منذ البداية، بما يناسب الخطة وحملاتها." },
      },
      {
        q: { en: "Is there a minimum term?", ar: "هل هناك مدة تعاقد دنيا؟" },
        a: { en: "The term is set in each proposal, to fit the plan.", ar: "تُحدَّد مدة التعاقد في كل عرض، بما يناسب الخطة." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون منّا للبدء؟" },
        a: { en: "Your goals, your audience, the channels you use today, and your brand guidelines if you have them. We'll come back with a plan and a proposal.", ar: "أهدافكم وجمهوركم والقنوات التي تستخدمونها الآن، ودليل هويتكم إن وُجد، ونعود إليكم بخطة وعرض." },
      },
    ],
    closing: { en: "Your page is next.", ar: "صفحتكم هي التالية." },
  },
  {
    slug: "production-print-gifts",
    order: 4,
    title: { en: "Production, Print & Gifts", ar: "الإنتاج والطباعة والهدايا" },
    summary: {
      en: "Stands, print, packaging and gifts, finished in foil, UV, deboss or laser.",
      ar: "أجنحة وطباعة وتغليف وهدايا، بلمسات نهائية من الرقائق المعدنية و UV والكبس والحفر بالليزر.",
    },
    image: "cat-production-print-gifts-4x5",
    photo: "card-print",
    theme: "workshop",
    intro: { en: "Stands and signage, commercial and large-format print, packaging, corporate gifts and merchandise, produced to brand standard. We design, fabricate and install, and finish each gift with the branding method that suits it.", ar: "أجنحة ولافتات، وطباعة تجارية وكبيرة الحجم، وتغليف، وهدايا للشركات، ومنتجات تحمل هوية علامتكم التجارية وتلتزم بمعاييرها. نصمّم ونصنّع ونركّب، ونختار لكل هدية طريقة الطباعة أو الحفر التي تليق بها." },
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
      // Hidden (D120, D123): there's no online store; ordering is a request through the contact form.
      {
        hidden: true,
        q: { en: "Can I order prints online?", ar: "هل يمكنني طلب المطبوعات عبر الإنترنت؟" },
        a: { en: "Yes. Tell us the item and the quantity, send your artwork, and we'll confirm the details and the proof with you before printing.", ar: "نعم. أخبرونا بالمنتج والكمية وأرسلوا التصميم، ونؤكّد معكم التفاصيل والنسخة التجريبية قبل التنفيذ." },
      },
      {
        q: { en: "Do you make packaging for gifts and awards?", ar: "هل تصمّمون تغليفًا للهدايا والجوائز؟" },
        a: { en: "Yes: custom boxes and wraps for gift sets and awards.", ar: "نعم: علب وتغليف حسب الطلب لأطقم الهدايا والجوائز." },
      },
      {
        q: { en: "Is there a minimum quantity?", ar: "هل هناك حدّ أدنى للكمية؟" },
        a: { en: "It depends on the item and the branding method. Tell us what you need, and we'll advise on quantities.", ar: "يعتمد ذلك على المنتج وطريقة الطباعة أو الحفر. أخبرونا بما تحتاجون إليه، ونقترح عليكم الكميات المناسبة." },
      },
      {
        q: { en: "How long does production take?", ar: "كم يستغرق التنفيذ؟" },
        a: { en: "It depends on the item, the quantity and the finish. Share your deadline and we'll confirm what's possible.", ar: "يعتمد ذلك على المنتج والكمية والتشطيب. شاركونا الموعد المطلوب، ونؤكّد لكم ما يمكن تنفيذه." },
      },
      {
        q: { en: "Do you deliver?", ar: "هل توصلون الطلبات؟" },
        a: { en: "Tell us where your order needs to go, and we'll confirm delivery with the proposal.", ar: "أخبرونا إلى أين يجب أن يصل طلبكم، ونؤكّد لكم التوصيل مع العرض." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون منّا للبدء؟" },
        a: { en: "The item, the quantity, the sizes, your deadline, and your artwork or logo files. We'll come back with options and a proposal.", ar: "المنتج والكمية والمقاسات والموعد المطلوب، وملفات التصميم أو الشعار، ونعود إليكم بخيارات وعرض." },
      },
    ],
    closing: { en: "What should we make for you?", ar: "ماذا نصنع لكم؟" },
  },
  {
    slug: "software-digital",
    order: 5,
    title: { en: "Software & Digital", ar: "البرمجيات والحلول الرقمية" },
    summary: {
      en: "Websites, apps and custom systems that keep working long after launch day.",
      ar: "مواقع وتطبيقات وأنظمة تُبنى على مقاسكم، وتبقى تعمل طويلًا بعد الإطلاق.",
    },
    image: "cat-software-digital-4x5",
    photo: "card-software",
    theme: "interface",
    intro: { en: "Websites, mobile apps, custom systems and online stores, designed and built in Arabic and English. We take each one from UX and design systems to development, content management and analytics, and build it to load fast.", ar: "مواقع إلكترونية وتطبيقات جوّال وأنظمة مخصّصة ومتاجر إلكترونية، نصمّمها ونبنيها بالعربية والإنجليزية. نتولّى كلًّا منها من تجربة المستخدم وأنظمة التصميم إلى البرمجة وإدارة المحتوى والتحليلات، ونبنيها لتعمل بسرعة." },
    // Copy deck draft for Rand's review (v1 decks task) + the D78 FAQ fills; clear fixes applied.
    faq: [
      {
        q: { en: "How long does a project take?", ar: "كم يستغرق المشروع؟" },
        a: { en: "It depends on the scope. After the intro call we send a plan with the steps and the dates for your project, and you see progress at every stage.", ar: "يعتمد ذلك على حجم المشروع. بعد مكالمة التعارف نرسل لكم خطة بالمراحل والمواعيد الخاصة بمشروعكم، وترون التقدّم في كل مرحلة." },
      },
      // Software brief (D91): the FAQ answers cost and "can we update it ourselves?"; integrations
      // and event tech moved to the page's own blocks (services, Grow tier, the event-tech band).
      {
        q: { en: "How much does a website or an app cost?", ar: "كم تكلفة الموقع أو التطبيق؟" },
        a: { en: "It depends on the scope, so we don't publish prices. After the intro call we send a proposal with the scope, the stages and the cost, and work starts only when you agree to it.", ar: "تعتمد على حجم المشروع، لذلك لا ننشر أسعارًا. بعد مكالمة التعارف نرسل لكم عرضًا بالنطاق والمراحل والتكلفة، ولا يبدأ العمل إلا بعد موافقتكم." },
      },
      {
        q: { en: "Is the Arabic as good as the English?", ar: "هل تكون النسخة العربية بجودة الإنجليزية نفسها؟" },
        a: { en: "Yes. We design and build in both languages from the start, with full right-to-left layouts, not a translation added at the end.", ar: "نعم. نصمّم ونبني باللغتين من البداية، مع دعم كامل للاتجاه من اليمين إلى اليسار، لا بترجمة تُضاف في النهاية." },
      },
      {
        q: { en: "Will we be able to update the site ourselves?", ar: "هل سنتمكّن من تحديث الموقع بأنفسنا؟" },
        a: { en: "Yes. We set up a content system in both languages and show your team how to use it at handover.", ar: "نعم. نجهّز نظامًا لإدارة المحتوى باللغتين، ونعرّف فريقكم على استخدامه عند التسليم." },
      },
      {
        q: { en: "Do you support the product after launch?", ar: "هل تقدّمون الدعم بعد الإطلاق؟" },
        a: { en: "Yes. Support and maintenance after launch are part of how we work, and their scope is agreed in the proposal.", ar: "نعم. الدعم والصيانة بعد الإطلاق جزء من طريقة عملنا، ونتّفق على نطاقهما في العرض." },
      },
      {
        q: { en: "Who owns the code and the content?", ar: "لمن تعود ملكية الكود والمحتوى؟" },
        a: { en: "Ownership and licensing are set out in each proposal, before work starts.", ar: "تُحدَّد الملكية والترخيص في كل عرض، قبل بدء العمل." },
      },
      {
        q: { en: "What do you need from me to start?", ar: "ماذا تحتاجون منّا للبدء؟" },
        a: { en: "A few lines on what you want to build and who it's for. Request a free intro call, and we'll take it from there.", ar: "بضعة أسطر عمّا تريدون بناءه ولمن. اطلبوا مكالمة تعارف مجانية، ونتابع معكم الخطوات التالية." },
      },
    ],
    closing: { en: "Your idea is the next line.", ar: "فكرتكم هي السطر التالي." },
  },
];
