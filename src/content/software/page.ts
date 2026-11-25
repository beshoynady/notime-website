/**
 * Software & Digital, the sales page (D91; docs/content/software-brief.md). Every line on the
 * page that isn't a shared service field lives here, EN first, the Arabic written natively for
 * Gulf business readers. The services' titles, promises and 3 deliverables stay in services.ts
 * (D56, D65); the FAQ stays on the category (categories.ts) so its FAQPage schema is the same.
 *
 * Honesty (non-negotiable): no invented clients, figures, testimonials, awards, team sizes or
 * certifications. The only response promises are "We reply within one working day." and the
 * website review's "Within 3 working days…" (D91). No prices: the tiers are scope.
 */
import type { Localized } from "../types";

type L = Localized<string>;
const l = (en: string, ar: string): L => ({ en, ar });

/** The page's phases, in order (How we work; the tags on each service). */
export const PHASES = ["discover", "design", "build", "launch", "support"] as const;
export type Phase = (typeof PHASES)[number];

/** The closed CTA copy (D65) and the two approved promises (D91). */
export const cta = {
  book: l("Request a free intro call", "اطلبوا مكالمة تعارف مجانية"),
  micro: l("No obligation. We reply within one working day.", "دون أي التزام. نرد خلال يوم عمل."),
  review: l("Get a free website review", "اطلبوا مراجعة مجانية لموقعكم"),
  reviewShort: l("Free website review", "مراجعة مجانية لموقعكم"),
  reviewPromise: l(
    "Send us your site. Within 3 working days we'll reply with 5 concrete improvements, free.",
    "أرسلوا لنا موقعكم، وخلال 3 أيام عمل نرد عليكم بخمسة تحسينات عملية، مجانًا.",
  ),
  work: l("See our work", "شاهدوا أعمالنا"),
  discuss: l("Discuss this", "ناقشوا هذه الخدمة معنا"),
  discussFor: l("Discuss this: {service}", "ناقشوا هذه الخدمة معنا: {service}"),
};

export const hero = {
  title: l("Websites and apps your clients actually use, in Arabic and English.", "مواقع وتطبيقات يستخدمها عملاؤكم فعلًا، بالعربية والإنجليزية."),
  sub: l(
    "The team that runs your events also builds your platform: bilingual websites, iOS and Android apps, dashboards and the systems behind them. Designed and built in Dubai.",
    "الفريق الذي يدير فعالياتكم يبني منصّتكم أيضًا: مواقع بلغتين، وتطبيقات iOS و Android، ولوحات إدارة والأنظمة التي تعمل خلفها. نصمّمها ونطوّرها في دبي.",
  ),
  /** Labels inside the drawn interface (aria-hidden; a picture of a site). */
  ui: {
    wire: [l("Header", "الترويسة"), l("Hero", "الواجهة"), l("Cards", "البطاقات")],
    welcome: l("Welcome", "أهلًا بكم"),
    welcomeOther: l("أهلًا بكم", "Welcome"),
    button: l("Book a visit", "احجزوا زيارة"),
    states: [l("Default", "افتراضي"), l("Hover", "تمرير"), l("Active", "نشط")],
    live: l("Live", "مباشر"),
    example: l("Example", "مثال"),
    preview: l("Preview", "معاينة"),
    soon: l("In development", "قيد التطوير"),
  },
};

export const proof = {
  title: l("Live today: the site you're reading.", "يعمل اليوم: الموقع الذي تقرؤونه الآن."),
  site: {
    label: l("This website", "هذا الموقع"),
    line: l(
      "Designed and built by our team in Arabic and English, with full right-to-left layouts. The screens here are captured from it.",
      "صمّمه فريقنا وبناه بالعربية والإنجليزية، مع دعم كامل للاتجاه من اليمين إلى اليسار. الشاشات هنا ملتقطة منه مباشرة.",
    ),
    toggle: l("Show the site in", "عرض الموقع بـ"),
    english: l("English", "الإنجليزية"),
    arabic: l("Arabic", "العربية"),
    lighthouse: l("Mobile Lighthouse, measured on the live site", "نتيجة Lighthouse على الجوّال، مقيسة على الموقع المنشور"),
  },
  review: {
    title: l("How does your site look on a phone, in Arabic?", "كيف يبدو موقعكم على الهاتف، وبالعربية؟"),
  },
};

export const problems = {
  title: l("An English-only site. A slow page. A vendor who vanished after launch.", "موقع بالإنجليزية وحدها، وصفحة بطيئة، ووكالة غابت بعد الإطلاق."),
  lead: l("Here is how we fix each one.", "هكذا نعالج كلًّا منها."),
  painLabel: l("The problem", "المشكلة"),
  fixLabel: l("How we solve it", "كيف نحلّها"),
  items: [
    {
      pain: l("Your site speaks English. Many of your customers read Arabic first.", "موقعكم بالإنجليزية، وكثير من عملائكم يقرؤون بالعربية أولًا."),
      fix: l("We build both languages from day one, with full right-to-left layouts and Arabic written natively.", "نبني اللغتين من اليوم الأول، مع دعم كامل للاتجاه من اليمين إلى اليسار، وعربية مكتوبة بأسلوبها لا مترجمة."),
    },
    {
      pain: l("It loads slowly on a phone, and visitors leave before it finishes.", "يتأخر تحميله على الهاتف، فيغادر الزوّار قبل أن يكتمل."),
      fix: l("Every page gets a performance budget, measured against Core Web Vitals before launch.", "نحدّد لكل صفحة ميزانية أداء، ونقيسها بمؤشرات Core Web Vitals قبل الإطلاق."),
    },
    {
      pain: l("Every text change means an email to the agency, then a wait.", "كل تعديل في نص يعني رسالة إلى الوكالة، ثم انتظارًا."),
      fix: l("Your team updates pages, news and images itself, in a content system that works in both languages.", "يحدّث فريقكم الصفحات والأخبار والصور بنفسه، من نظام لإدارة المحتوى يعمل باللغتين."),
    },
    {
      pain: l("The agency launched it, then disappeared.", "أطلقت الوكالة الموقع ثم اختفت."),
      fix: l("Support and maintenance after launch are part of the plan, agreed in the proposal.", "الدعم والصيانة بعد الإطلاق جزء من الخطة، ونتّفق عليهما في العرض."),
    },
    {
      pain: l("Registration from one vendor, the app from another, the screens from a third.", "التسجيل من مورّد، والتطبيق من آخر، والشاشات من ثالث."),
      fix: l("The people who build your event technology also run the event.", "من يبني تقنيات فعاليتكم يدير الفعالية نفسها."),
    },
  ],
};

/** The mini landing block of each service, by service slug (services.ts holds title, promise, deliverables). */
/** `photo` is a registry id (media.ts): the device photograph in the service's tab panel. */
export const serviceBlocks: Record<string, { photo: string; outcome: L; idealFor: L[]; phases: Phase[] }> = {
  websites: {
    photo: "sw-websites",
    outcome: l("A site your clients use, written as well in Arabic as in English.", "موقع يستخدمه عملاؤكم، وعربيّته متقنة كإنجليزيته."),
    idealFor: [
      l("Companies selling to Arabic and English speakers", "شركات تخاطب عملاء بالعربية والإنجليزية"),
      l("Teams that update their content often", "فرق تحدّث محتواها باستمرار"),
      l("Brands replacing an English-only site", "علامات تجارية تستبدل موقعًا بالإنجليزية فقط"),
    ],
    phases: ["discover", "design", "build", "launch", "support"],
  },
  "mobile-apps": {
    photo: "sw-apps",
    outcome: l("An app on your clients' phones, fed by the same content as your site.", "تطبيق على هواتف عملائكم، يعرض المحتوى نفسه الذي في موقعكم."),
    idealFor: [
      l("Services customers book or check often", "خدمات يحجزها العملاء أو يتابعونها كثيرًا"),
      l("Membership and loyalty programmes", "برامج العضوية والولاء"),
      l("Events with an agenda and live updates", "فعاليات ببرنامج وتحديثات مباشرة"),
    ],
    phases: ["discover", "design", "build", "launch", "support"],
  },
  "custom-systems": {
    photo: "sw-systems",
    outcome: l("Spreadsheets and email threads, replaced by one system your team runs.", "نظام واحد يديره فريقكم، بدل جداول البيانات وسلاسل الرسائل."),
    idealFor: [
      l("Operations that run on spreadsheets", "عمليات تُدار بجداول البيانات"),
      l("Teams that need roles and approvals", "فرق تحتاج إلى أدوار وموافقات"),
      l("Businesses connecting several tools", "شركات تربط بين عدة أدوات"),
    ],
    phases: ["discover", "design", "build", "launch", "support"],
  },
  "e-commerce": {
    photo: "sw-ecommerce",
    outcome: l("A store where buying takes a few clear steps, and orders are easy to follow.", "متجر يُتمّ فيه العميل شراءه بخطوات قليلة وواضحة، ويتابع طلبه بسهولة."),
    idealFor: [
      l("Retail brands starting to sell online", "علامات تجارية في التجزئة تبدأ البيع عبر الإنترنت"),
      l("Shops moving to a store of their own", "متاجر تنتقل إلى متجرها الإلكتروني الخاص"),
      l("Gift and catering orders", "طلبات الهدايا والضيافة"),
    ],
    phases: ["discover", "design", "build", "launch", "support"],
  },
  "ui-ux-design": {
    photo: "sw-ux",
    outcome: l("Interfaces people understand the first time they use them.", "واجهات يفهمها الناس من أول استخدام."),
    idealFor: [
      l("Products before development starts", "منتجات قبل أن تبدأ برمجتها"),
      l("Apps and sites people leave halfway", "تطبيقات ومواقع يتركها المستخدمون في منتصف الطريق"),
      l("Teams building a design system", "فرق تبني نظام تصميم"),
    ],
    phases: ["discover", "design"],
  },
  "ai-consulting": {
    photo: "sw-ai",
    outcome: l("A clear answer on where AI saves your team time, and where it doesn't.", "إجابة واضحة عن المواضع التي يوفّر فيها الذكاء الاصطناعي وقت فريقكم، وأين لا يفعل."),
    idealFor: [
      l("Teams with repetitive written work", "فرق لديها أعمال كتابية متكررة"),
      l("Managers asked for an AI plan", "مديرون يُطلب منهم وضع خطة للذكاء الاصطناعي"),
      l("Businesses unsure where to start", "شركات لا تعرف من أين تبدأ"),
    ],
    phases: ["discover", "design", "launch"],
  },
};

export const services = {
  title: l("Six things we build, all in Arabic and English from the first screen.", "ستة أشياء نبنيها، وكلها بالعربية والإنجليزية من الشاشة الأولى."),
  lead: l("Website, app and system development in Dubai, for businesses in the UAE and across the region.", "تطوير المواقع والتطبيقات والأنظمة في دبي، للشركات في الإمارات وفي أنحاء المنطقة."),
  idealFor: l("Ideal for", "مناسب لـ"),
  receive: l("You receive", "ما تحصلون عليه"),
  phases: l("Stages", "المراحل"),
  /** The fold under each panel's deliverables (D161). */
  more: l("Who it suits, and the stages", "لمن تناسب، ومراحل العمل"),
  /** The tab rail's name for screen readers. */
  tabs: l("Our services", "خدماتنا"),
};

/** Event technology: the featured block (wider, darker) where the two worlds meet (D65, D91). */
export const eventTech = {
  anchor: "event-tech",
  photo: "sw-event-tech",
  name: l("Event technology", "تقنيات الفعاليات"),
  eyebrow: l("Event technology · our specialty", "تقنيات الفعاليات · تخصّصنا"),
  title: l("Built by people who run events.", "تبنيها فرقٌ تدير الفعاليات بنفسها."),
  intro: l(
    "We build the event registration system, the app and the results screens, and we're on the floor running the event too. One request, from the first invitation to the last result on screen.",
    "نبني نظام التسجيل والتطبيق وشاشات النتائج، ونكون في موقع الفعالية لإدارتها أيضًا. طلب واحد، من أول دعوة إلى آخر نتيجة تظهر على الشاشة.",
  ),
  items: [
    { title: l("Registration and check-in", "التسجيل وتسجيل الحضور"), body: l("Invitely by NO TIME, our own check-in product (in development)", "«إنفايتلي» من NO TIME، منتجنا لتسجيل الحضور (قيد التطوير)") },
    { title: l("Event apps and websites", "تطبيقات ومواقع للفعاليات"), body: l("The agenda, the speakers and live updates.", "البرنامج والمتحدثون والتحديثات المباشرة.") },
    {
      title: l("Live results and screens", "النتائج المباشرة والشاشات"),
      body: l("Championships, results and live coverage, on screen as they happen.", "بطولات ونتائج وتغطية مباشرة، تظهر على الشاشات لحظة حدوثها."),
    },
  ],
  idealFor: [
    l("Conferences and exhibitions", "المؤتمرات والمعارض"),
    l("Sports events and championships", "الفعاليات الرياضية والبطولات"),
    l("Galas with a guest list", "الحفلات بقوائم ضيوف"),
  ],
  receive: [
    l("Registration and check-in for your guests", "التسجيل وتسجيل الحضور لضيوفكم"),
    l("An event app or microsite with the agenda and live updates", "تطبيق أو موقع مصغّر للفعالية بالبرنامج والتحديثات المباشرة"),
    l("Live results and screens at the venue", "نتائج مباشرة وشاشات في مكان الفعالية"),
  ],
  phases: ["discover", "design", "build", "launch", "support"] as Phase[],
  eventsLink: l("See Events & Hospitality", "استعراض الفعاليات والضيافة"),
};

export const process = {
  anchor: "how-we-work",
  title: l("You see your project at every stage, not only on launch day.", "ترون مشروعكم في كل مرحلة، لا يوم الإطلاق وحده."),
  lead: l("Five stages. Each one ends with something you can open, test or sign off.", "خمس مراحل، تنتهي كلٌّ منها بشيء تفتحونه أو تجرّبونه أو تعتمدونه."),
  receive: l("You receive", "تستلمون"),
  steps: {
    discover: {
      name: l("Discover", "نستكشف"),
      body: l("We learn your goals, your users and your content, and agree the scope.", "نتعرّف على أهدافكم ومستخدميكم ومحتواكم، ونتّفق على النطاق."),
      receive: l("A scope and a plan with the stages and dates", "نطاق العمل وخطة بالمراحل والمواعيد"),
    },
    design: {
      name: l("Design", "نصمّم"),
      body: l("Wireframes first, then the interface in both languages.", "نبدأ بالمخططات، ثم الواجهة باللغتين."),
      receive: l("A clickable prototype you can try yourself", "نموذج تفاعلي تجرّبونه بأنفسكم"),
    },
    build: {
      name: l("Build", "نبني"),
      body: l("We develop in short stages you can follow.", "نبرمج على مراحل قصيرة تتابعونها خطوة بخطوة."),
      receive: l("A staging link where you see progress at every stage", "رابط تجريبي ترون عليه التقدّم في كل مرحلة"),
    },
    launch: {
      name: l("Launch", "نطلق"),
      body: l("We test speed, both languages and every form, then go live.", "نختبر السرعة واللغتين وكل النماذج، ثم نطلق."),
      receive: l("A launch checklist we sign off with you", "قائمة تحقق للإطلاق نعتمدها معكم"),
    },
    support: {
      name: l("Support", "ندعم"),
      body: l("We maintain and improve the product after launch.", "نصون المنتج ونطوّره بعد الإطلاق."),
      receive: l("Updates and improvements on the terms in your proposal", "تحديثات وتحسينات وفق ما يتضمّنه العرض"),
    },
  } satisfies Record<Phase, { name: L; body: L; receive: L }>,
  notes: [
    l("Bilingual by default", "بلغتين من البداية"),
    l("Performance and SEO built in", "الأداء والظهور في محركات البحث جزء من البناء"),
    l("Support & maintenance after launch", "الدعم والصيانة بعد الإطلاق"),
  ],
};

export const TIER_IDS = ["launch", "grow", "platform"] as const;
export const tiers = {
  anchor: "engagement",
  title: l("Start where your business is today. Grow from there.", "ابدؤوا من حيث يقف عملكم اليوم، ثم توسّعوا منه."),
  intro: l("Three levels of scope, from a focused website to a platform that keeps growing.", "ثلاثة مستويات من النطاق، من موقع مركّز إلى منصّة تواصل النمو."),
  note: l("We price each project once we understand it.", "نسعّر كل مشروع بعد أن نفهمه."),
  idealFor: l("Ideal for", "مناسب لـ"),
  included: l("What's included", "ما يشمله"),
  receive: l("You receive", "تستلمون"),
  cta: l("Talk about {tier}", "ناقشوا معنا مستوى {tier}"),
  items: {
    launch: {
      name: l("Launch", "الانطلاق"),
      summary: l("A focused bilingual website.", "موقع مركّز بلغتين."),
      ideal: l("A new business, a new brand, or a site that needs replacing.", "نشاط تجاري جديد، أو علامة تجارية جديدة، أو موقع حان وقت استبداله."),
      included: [
        l("A website in Arabic and English", "موقع بالعربية والإنجليزية"),
        l("Full right-to-left layout", "دعم كامل للاتجاه من اليمين إلى اليسار"),
        l("Designed for the phone first", "تصميم يبدأ من الهاتف"),
        l("Core SEO and speed setup", "إعداد أساسي للظهور في محركات البحث والسرعة"),
        l("Contact and enquiry forms", "نماذج التواصل والاستفسارات"),
      ],
      receive: l("A live site and a handover session for your team", "موقع يعمل، وجلسة تسليم لفريقكم"),
    },
    grow: {
      name: l("Grow", "النمو"),
      summary: l("Website, content system, SEO and integrations.", "موقع ونظام لإدارة المحتوى وظهور في محركات البحث وربط بأدواتكم."),
      ideal: l("Teams that publish often and need the site to bring in enquiries.", "فرق تنشر باستمرار، وتريد موقعًا يجلب لها الطلبات."),
      included: [
        l("Everything in Launch", "كل ما يشمله الانطلاق"),
        l("A content system your team runs", "نظام لإدارة المحتوى يديره فريقكم"),
        l("SEO structure in both languages", "بنية للظهور في محركات البحث باللغتين"),
        l("Integrations with your CRM, booking or email tools", "الربط بأدوات إدارة العملاء أو الحجز أو البريد"),
        l("News, blog or resources section", "قسم للأخبار أو المدونة أو المصادر"),
        l("Performance and search reporting", "تقارير عن الأداء والظهور في البحث"),
      ],
      receive: l("A site your team updates itself, connected to the tools you use", "موقع يحدّثه فريقكم بنفسه، ومرتبط بالأدوات التي تستخدمونها"),
    },
    platform: {
      name: l("Platform", "المنصّة"),
      summary: l("A custom system or app, dashboards and ongoing development.", "نظام أو تطبيق مخصّص، ولوحات إدارة، وتطوير مستمر."),
      ideal: l("Businesses whose users, processes or data need more than a website.", "شركات يحتاج مستخدموها أو عملياتها أو بياناتها إلى أكثر من موقع."),
      included: [
        l("A custom web platform or mobile app", "منصّة ويب أو تطبيق جوّال مخصّص"),
        l("Admin dashboards and analytics", "لوحات إدارة وتحليلات"),
        l("Roles and permissions", "أدوار وصلاحيات"),
        l("Integrations and APIs", "الربط بالأنظمة والواجهات البرمجية"),
        l("Arabic and English from the first screen", "العربية والإنجليزية من الشاشة الأولى"),
        l("Ongoing development in stages", "تطوير مستمر على مراحل"),
      ],
      receive: l("A working platform, its documentation and a development roadmap", "منصّة تعمل، مع توثيقها وخطة لتطويرها"),
    },
  },
};

export const ways = {
  anchor: "ways-to-work",
  title: l("Built for launch day, supported after it.", "نبنيه ليوم الإطلاق، ونبقى معه بعده."),
  lead: l("Two ways to work with us.", "طريقتان للعمل معنا."),
  items: [
    {
      id: "project",
      name: l("Fixed-scope project", "مشروع بنطاق محدّد"),
      body: l("A defined scope, a plan with dates, and a launch. Right for a new site, app or system.", "نطاق محدّد وخطة بالمواعيد وإطلاق. يناسب موقعًا أو تطبيقًا أو نظامًا جديدًا."),
      points: [
        l("Scope and plan agreed before work starts", "نتّفق على النطاق والخطة قبل بدء العمل"),
        l("Progress you can see at every stage", "تقدّم ترونه في كل مرحلة"),
        l("Launch and handover to your team", "الإطلاق والتسليم لفريقكم"),
      ],
    },
    {
      id: "support",
      name: l("Monthly support & growth", "دعم وتطوير شهري"),
      tag: l("The natural next step after launch", "الخطوة الطبيعية بعد الإطلاق"),
      body: l("After launch we keep the product healthy and moving forward, month by month.", "بعد الإطلاق نحافظ على المنتج ونطوّره، شهرًا بعد شهر."),
      points: [
        l("Maintenance and updates", "الصيانة والتحديثات"),
        l("Improvements and new features", "تحسينات وميزات جديدة"),
        l("Content updates", "تحديث المحتوى"),
        l("Regular reports", "تقارير دورية"),
      ],
    },
  ],
};

export const why = {
  anchor: "why-no-time",
  title: l("One team that plans the event, writes the Arabic and ships the code.", "فريق واحد يخطّط للفعالية، ويكتب العربية، ويطلق المنصّة."),
  lead: l("Why NO TIME, in five lines.", "لماذا NO TIME، في خمسة أسطر."),
  items: [
    {
      title: l("Events and digital under one roof", "الفعاليات والحلول الرقمية تحت سقف واحد"),
      body: l("The people who run your event build its registration, app and screens, so nothing gets lost between vendors.", "من يدير فعاليتكم يبني تسجيلها وتطبيقها وشاشاتها، فلا يضيع شيء بين الموردين."),
    },
    {
      title: l("Native Arabic and English", "عربية وإنجليزية أصيلتان"),
      body: l("Arabic is written for readers in the region, not translated at the end, and every layout mirrors properly.", "نكتب العربية لقرّاء المنطقة لا نترجمها في النهاية، وكل تصميم ينعكس اتجاهه كما ينبغي."),
    },
    {
      title: l("Performance and SEO built in", "الأداء والظهور في البحث جزء من البناء"),
      body: l("Speed and search structure are part of the build, and we check them before launch.", "السرعة وبنية الظهور في محركات البحث جزء من البناء، ونتحقق منهما قبل الإطلاق."),
    },
    {
      title: l("Support after launch", "دعم بعد الإطلاق"),
      body: l("We stay after go-live, with maintenance and improvements on agreed terms.", "نبقى معكم بعد الإطلاق، بالصيانة والتحسينات وفق ما نتّفق عليه."),
    },
    {
      title: l("Progress you can see", "تقدّم ترونه بأعينكم"),
      body: l("A clickable prototype first, then a staging link you can open at any stage.", "نموذج تفاعلي أولًا، ثم رابط تجريبي تفتحونه في أي مرحلة."),
    },
  ],
};

export const productsCopy = {
  anchor: "products",
  eyebrow: l("Our products · in development", "منتجاتنا · قيد التطوير"),
  title: l("Two products born at the event door and in the restaurant kitchen.", "منتجان وُلدا عند باب الفعالية وفي مطبخ المطعم."),
  intro: l("We're building both from our own event and hospitality work. Register interest and we'll write to you when they're ready.", "نطوّرهما من خبرتنا في الفعاليات والضيافة. سجّلوا اهتمامكم، وسنراسلكم حين يصبحان جاهزين."),
  problem: l("The problem", "المشكلة"),
  features: l("Key features", "أبرز الميزات"),
  register: l("Register interest", "سجّلوا اهتمامكم"),
  registerFor: l("Register interest in {product}", "سجّلوا اهتمامكم بـ{product}"),
  close: l("Close the form", "إغلاق النموذج"),
  more: l("See what {product} will do", "اكتشفوا ما ستقدّمه «{product}»"),
  items: {
    "invitely": {
      slug: "qr-check-in",
      problem: l("Queues at the door, and no clear picture of who has arrived.", "طوابير عند الباب، ولا صورة واضحة لمن وصل."),
      features: [
        l("QR invitations", "دعوات برمز QR"),
        l("Check-in at the door from a phone", "تسجيل الحضور عند الباب من الهاتف"),
        l("Live arrivals for the team", "متابعة الوصول لحظة بلحظة لفريقكم"),
      ],
      screens: [l("Check-in dashboard", "لوحة الحضور"), l("QR scan", "مسح الرمز"), l("Guest list", "قائمة الضيوف")],
    },
    "smart-menu": {
      slug: "restaurant-system",
      problem: l("Orders, tables and the kitchen, out of step at the busiest hour.", "الطلبات والطاولات والمطبخ، كلٌّ في وادٍ ساعةَ الذروة."),
      features: [
        l("Table and order management", "إدارة الطاولات والطلبات"),
        l("Kitchen display", "شاشة للمطبخ"),
        l("End-of-day summary", "ملخص نهاية اليوم"),
      ],
      screens: [l("Tables", "الطاولات"), l("Kitchen queue", "طلبات المطبخ"), l("Daily summary", "ملخص اليوم")],
    },
  },
  /** Example data inside the concept screens (always labelled "Example"). */
  demo: {
    arrived: l("Arrived", "وصلوا"),
    expected: l("Expected", "متوقّع"),
    scan: l("Point the camera at the guest's code", "وجّهوا الكاميرا إلى رمز الضيف"),
    valid: l("Welcome, guest 112", "أهلًا بالضيف 112"),
    guests: [l("Guest 101", "الضيف 101"), l("Guest 102", "الضيف 102"), l("Guest 103", "الضيف 103"), l("Guest 104", "الضيف 104")],
    in: l("In", "حضر"),
    due: l("Due", "منتظر"),
    table: l("Table", "طاولة"),
    free: l("Free", "متاحة"),
    seated: l("Seated", "مشغولة"),
    order: l("Order", "طلب"),
    preparing: l("Preparing", "قيد التحضير"),
    ready: l("Ready", "جاهز"),
    covers: l("Covers", "عدد الضيوف"),
    orders: l("Orders", "الطلبات"),
    peak: l("Busiest hour", "ساعة الذروة"),
  },
};

export const quality = {
  anchor: "quality",
  title: l("We test the site automatically before every update.", "نختبر الموقع آليًا قبل كل تحديث."),
  items: [
    l("Arabic and English, right-to-left and left-to-right", "العربية والإنجليزية، من اليمين إلى اليسار ومن اليسار إلى اليمين"),
    l("Accessibility: keyboard, contrast and screen readers", "سهولة الوصول: لوحة المفاتيح والتباين وقارئات الشاشة"),
    l("A performance budget for every page, measured against Core Web Vitals", "ميزانية أداء لكل صفحة، نقيسها بمؤشرات Core Web Vitals"),
    l("Security and data protection, planned into the build", "الأمان وحماية البيانات، ضمن خطة البناء من البداية"),
  ],
  stack: l("Built with Next.js · React · TypeScript · Node.js · iOS and Android", "نبني بـ Next.js · React · TypeScript · Node.js · iOS و Android"),
};

export const finalCta = {
  risk: l(
    "Request a free 30-min intro call. No obligation. We reply within one working day.",
    "اطلبوا مكالمة تعارف مجانية (30 دقيقة). دون أي التزام. نرد خلال يوم عمل.",
  ),
  reviewAnchor: "website-review",
  /** The two ways in, as tabs (D161): the intro call first, the review second. */
  tabs: l("Two ways to start", "طريقتان للبدء"),
  book: l("Request a free call", "اطلبوا مكالمة مجانية"),
};

export const faqCopy = {
  title: l("Straight answers on cost, time and ownership.", "إجابات مباشرة عن التكلفة والمدة والملكية."),
};

export const sticky = {
  label: l("Quick actions", "إجراءات سريعة"),
  /** Shorter than `cta.book`: both buttons fit one line each at 390 px in both locales. */
  book: l("Request a free call", "اطلبوا مكالمة مجانية"),
};

export const seo = {
  title: l("Website and App Development in Dubai | NO TIME", "تطوير المواقع والتطبيقات في دبي | NO TIME"),
  description: l(
    "Bilingual Arabic–English websites, mobile apps, event registration systems and custom platforms, built in Dubai by the team that also runs events.",
    "مواقع بالعربية والإنجليزية، وتطبيقات جوّال، وأنظمة تسجيل للفعاليات، ومنصّات مخصّصة، يبنيها في دبي الفريق الذي يدير الفعاليات أيضًا.",
  ),
};
