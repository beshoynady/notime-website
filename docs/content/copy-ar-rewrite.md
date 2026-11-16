# Arabic rewrite: old → new

For the user's review ("final push", 2026-11-11, §2). Each Arabic line is rewritten from the idea, not from the English sentence. Approved anchor lines kept unchanged: «حان وقت / البداية.», «كل ثانية / محسوبة.». EN changes in the same pass are listed under each section's commit, not here.

## Homepage (and the shared header, menu, CTA)

| Key | Old | New | Why |
|---|---|---|---|
| `meta.description` | بيت إبداعي في دبي للفعاليات والإنتاج الإبداعي والتسويق والحلول الرقمية. | بيت إبداعي في دبي للفعاليات والإنتاج الإبداعي والتسويق والحلول الرقمية. فريق واحد يحمل الفكرة من أول رسمة حتى يوم ظهورها، في ستة أسواق. | Was a list of categories; now it says what the reader gets. |
| `hero.lead` **(approved anchor, changed: clearly stronger)** | فعاليات، إنتاج إبداعي، تسويق وحلول رقمية، نخطط لها وننفذها تحت سقف واحد. | فعاليات ومحتوى وحملات ومنصّات رقمية، يخطّط لها بيت واحد ويبنيها ويُطلقها. | Three verbs carry the promise; the old line listed nouns, then «تحت سقف واحد». |
| `hero.cta` | اكتشف خدماتنا | اكتشف ما نصنعه | Matches the new EN; «ما نصنعه» is warmer than «خدماتنا». |
| `about.statement` | بيت إبداعي للفعاليات والعلامات التجارية، ولكل فكرة تقع بينهما. فريق واحد يخطط لها، ويبنيها، ويطبعها، ويطلقها. | بيت إبداعي للفعاليات والعلامات التجارية، ولكل فكرة تولد بينهما. فريق واحد يخطّط لها ويبنيها ويطبعها ويُطلقها. | «تولد» gives the idea life; the verbs run without the comma chain. |
| `about.body` | من دبي، نقدّم الفعاليات والتسويق والعلاقات العامة لعملاء في أسواق محلية وإقليمية وعالمية. نبني كل فكرة عند النقطة التي تلتقي فيها العلامة بجمهورها، ثم نمضي بها حتى النهاية: الاستراتيجية، والإبداع، والإنتاج، والتسليم، تحت سقف واحد. | مقرّنا دبي، وعملنا يمتدّ في ستة أسواق من السعودية إلى مصر: جناح لشركة طيران في معرض دبي للطيران، ومجلس تراثي يستقبل الضيوف، وتطبيق بلغتين لاتحاد رياضي وطني. تبدأ كل فكرة حيث تلتقي العلامة بجمهورها، ثم يحملها فريق واحد عبر الاستراتيجية والإبداع والإنتاج حتى التسليم. | Real projects from the profile instead of a list of services. |
| `categories.headingLead` | خمس حِرَف، | خمسة مجالات، | «حِرَف» reads as handicraft for software and marketing (decisions-to-confirm #12). |
| `categories.headingKey` | وفريق واحد خلفها. | وفريق واحد يقف خلفها. | A verb gives the line its stance. |
| `categories.intro` | كل حرفة قائمة بذاتها، ومعًا تحمل الفعالية أو العلامة من أول فكرة حتى آخر تفصيل. | اطلب مجالًا واحدًا، أو سلّمنا المهمة كاملة. قد يحتاج إطلاق واحد إلى منصّة عرض وفيلم وحملة وعلبة هدايا، وهنا يخطّط لها الفريق نفسه. | A concrete launch replaces the abstract «كل حرفة قائمة بذاتها». |
| `categories.viewServices` | استعرض الخدمات | اطّلع على الخدمات | More natural than «استعرض». |
| `categories.allServices` | كل الخدمات | تصفّح كل الخدمات | A verb for a link. |
| `work.headingKey` | من أولها إلى آخرها. | من الفكرة حتى التسليم. | «من أولها إلى آخرها» was a calque of start to finish. |
| `work.intro` | أعمال لجهات وطنية، من جناح المعرض إلى الشاشة. | جناح لشركة طيران وطنية، وليالي تكريم لدوري كرة قدم، وتطبيق لاتحاد رياضي. نحتفظ بالأسماء إلى أن يأذن لنا أصحابها. | Specific projects; says why names are hidden. |
| `work.viewProject` | استعرض المشروع | تفاصيل المشروع | Natural for a project link. |
| `digital.headingLead` | حلول رقمية، | الفريق الذي يصنع فعاليتك، | New angle (EN): the event team builds the platform. |
| `digital.headingKey` | تبقى تعمل بعد الإطلاق. | يبني منصّتك الرقمية أيضًا. | As above. |
| `digital.intro` | نبني المنصّة الرقمية من أولها إلى آخرها: تجربة المستخدم وأنظمة التصميم، ثم البرمجة وإدارة المحتوى والتحليلات، بالعربية والإنجليزية، وبأداء سريع منذ اليوم الأول. | مواقع وتطبيقات ولوحات تحكم، نصمّمها بالعربية والإنجليزية من أول رسمة، ونبنيها لتفتح بسرعة على الجوّال. ويحدّث فريقك محتواها بنفسه. | Outcomes (Arabic first, fast on a phone, self-updated) instead of a process list. |
| `digital.capabilities.websites.body` | مواقع بلغتين، بنظام لإدارة المحتوى يتولّاه فريقك بنفسه. | مواقع بلغتين، ونظام محتوى يديره فريقك بنفسه. | Shorter, active. |
| `digital.capabilities.apps.body` | لنظامَي iOS وAndroid، ومتصلة بموقعك. | لـ iOS وAndroid، ومتصلة بموقعك. | Tighter. |
| `digital.capabilities.systems.body` | لوحات تحكم وأنظمة إدارة وربط بين الأنظمة، مبنية وفق طريقة عملك. | لوحات تحكم وأنظمة إدارة وربط بين أنظمتك، تُبنى على طريقة عملك. | «تُبنى على» is idiomatic; «مبنية وفق» was stiff. |
| `digital.capabilities.ecommerce.body` | متاجر على الإنترنت، من عرض المنتجات حتى إتمام الشراء. | متاجر على الإنترنت، من عرض المنتج حتى إتمام الطلب. | «إتمام الطلب» is the Gulf shopper's term. |
| `digital.productsIntro` | منتجان من تطويرنا، نعمل عليهما الآن. | منتجان من صنعنا: تسجيل حضور للفعاليات، ونظام للمطاعم في أوقات ذروتها. كلاهما قيد التطوير. | Says what each product is. |
| `process.steps.plan.body` | نبدأ من المهمة والجمهور والموعد، ثم نحدّد الفكرة والميزانية والجدول الزمني. | نبدأ بالمهمة والجمهور والموعد، ثم نثبّت الفكرة والميزانية والجدول. | «نثبّت» is stronger than «نحدّد»; shorter. |
| `process.steps.build.body` | يتشكّل التصميم والديكور والمحتوى والمنصّات التي خلفها، ونراجعها معك في كل مرحلة. | يأخذ التصميم والديكور والمحتوى والمنصّات التي خلفها شكلها، ونراجعها معك في كل مرحلة. | Native verb «يأخذ شكله» for take shape. |
| `process.steps.produce.body` | التصنيع والطباعة والضيافة وفرق العمل، تجتمع في أرض الحدث بإدارة فريق واحد. | تصنيع وطباعة وضيافة وطواقم عمل، تلتقي كلها في أرض الحدث تحت إدارة فريق واحد. | «طواقم» and «تلتقي» read native. |
| `process.steps.launch.body` | تُفتح الأبواب، وتنطلق الحملة، ونبقى معك حتى التقرير الأخير. | تُفتح الأبواب أو تنطلق الحملة، ونبقى إلى جانبك حتى التقرير الأخير. | «إلى جانبك» is warmer than «معك». |
| `markets.headingKey` | ومقرّنا دبي. | وبيتنا في دبي. | «بيت» echoes the creative house. |
| `cta.headingLead` | في بالك موعد؟ | هل حدّدت موعدًا؟ | «في بالك» was dialect. |
| `cta.headingKey` | لنخطط لكل ثانية فيه. | دعنا نخطط لكل ثانية منه. | MSA «دعنا». |
| `cta.body` | أخبرنا بما تخطط له، وسنعود إليك بالخطوات التالية. | أخبرنا بالموعد والفكرة، ونعود إليك بالخطوات التالية. | Concrete: the date and the idea. |
| `cta.bodyInterim` | ابدأ بما تحتاجه. لكل مجال صفحته، وفيها كل خدماته. | ابدأ بما تحتاجه: لكل مجال صفحته، وفيها خدماته كلها. | Colon instead of a full stop; natural word order. |
| `cta.secondary` | تحدّث معنا عبر واتساب | تحدّث إلينا عبر واتساب | «إلينا» is the correct preposition. |
| `megaMenu.headingKey` **(approved anchor, changed)** | خمس حِرَف. | خمسة مجالات. | As categories.headingLead. |
| `megaMenu.intro` | كل ما تحتاجه فعاليتك أو علامتك التجارية، يتولّاه فريق واحد. | كل ما تحتاجه فعاليتك أو علامتك، يتولّاه فريق واحد. | Shorter. |
| `whatsapp.label` | تحدّث معنا عبر واتساب | تحدّث إلينا عبر واتساب | As cta.secondary. |
| `categories.creative.summary` | تصوير وأفلام وموشن ومحتوى بالذكاء الاصطناعي، ومعها الديكورات والمعدّات. | صورة وفيلم وموشن ومحتوى بالذكاء الاصطناعي، ومعها الديكور والمعدّات التي تصنعها. | Natural singular nouns; says what the kit is for. |
| `categories.print.summary` | لافتات وطباعة كبيرة وتغليف وهدايا، تُنفَّذ وفق معايير العلامة. | أجنحة وطباعة وتغليف وهدايا، بلمسات الرقائق المعدنية وUV والحفر والليزر. | Follows the new EN; the finishes from the profile. |
| `categories.software.summary` | مواقع وتطبيقات وأنظمة مخصّصة، تواصل عملها بعد يوم الإطلاق بوقت طويل. | مواقع وتطبيقات وأنظمة تُبنى على مقاسك، وتبقى تعمل بعد الإطلاق بزمن طويل. | «على مقاسك» for custom; «تبقى تعمل» reads native (decisions-to-confirm #12). |
| `work.uaeaf.anonymous` | شريكه الرقمي والإعلامي: إعادة بناء كاملة للموقع الإلكتروني ثنائي اللغة وتطبيق الجوّال المرتبط به، مع إدارة يومية لوسائل التواصل بالعربية والإنجليزية. في الأسبوع الأول من إحدى حملات البطولات: 487 ألف مشاهدة، و‎+37.6 ألف متابع جديد، ووصول بلغ 271 ألفًا. | شريكه الرقمي والإعلامي: أعدنا بناء موقعه بلغتين وتطبيق الجوّال المتصل به، وننشر على منصّاته كل يوم بالعربية والإنجليزية. وفي الأسبوع الأول من إحدى حملات البطولات: 487 ألف مشاهدة، و‎+37.6 ألف متابع جديد، ووصول إلى 271 ألفًا. | Verbs instead of «إعادة بناء كاملة… مع إدارة يومية»; figures and scope unchanged. |
| `work.egyptair.anonymous` | تصميم الجناح وبناؤه وإدارة العلاقات العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي. | صمّمنا الجناح وبنيناه، وأدرنا علاقاته العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي. | Verbs, first person. |
| `work.uaepl.anonymous` | هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، إلى جانب محتوى الدوري على وسائل التواصل، وتغليف الجوائز، وأطقم الهدايا. | هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، ومعها محتوى الدوري على منصّاته، وتغليف الجوائز، وأطقم الهدايا. | «ومعها» replaces the calque «إلى جانب». |

## Software & Digital (batch 2, written natively from the idea; full page log)

Every Arabic line on the page and in the three forms is new, written from the idea in MSA for Gulf business readers, with Western digits. The notes column is left to the reviewer; lines worth a second look:

- `hero.title`: «يستخدمها عملاؤك فعلًا» keeps the English's "actually" as a plain fact, not a boast.
- `cta.discussFor`: «ناقش هذه الخدمة معنا: {service}» keeps the visible text inside the accessible name (WCAG 2.5.3).
- `tiers.cta`: «ناقش معنا مستوى {tier}» because the tier names stay in English (Launch, Grow, Platform).
- `forms.formCopy.states.*`: each failure gives the email address, never a dead end.
- FAQ (categories.ts): «كم تكلفة الموقع أو التطبيق؟» / «تعتمد على حجم المشروع، لذلك لا ننشر أسعارًا. بعد مكالمة التعارف نرسل لك عرضًا بالنطاق والمراحل والتكلفة، ولا يبدأ العمل إلا بعد موافقتك.» and «هل سنتمكّن من تحديث الموقع بأنفسنا؟» / «نعم. نجهّز نظامًا لإدارة المحتوى باللغتين، ونعرّف فريقك على استخدامه عند التسليم.»

| Key | EN idea | AR line |
|---|---|---|
| `caseStudy.eyebrow` | Case study | دراسة حالة |
| `caseStudy.anonymous.client` | A national sports federation | اتحاد رياضي وطني |
| `caseStudy.named.client` | UAE Athletics Federation | الاتحاد الإماراتي لألعاب القوى |
| `caseStudy.named.alt.laptop` | The federation's bilingual website on a laptop. | موقع الاتحاد ثنائي اللغة على شاشة حاسوب محمول. |
| `caseStudy.named.alt.phone` | The federation's website on a phone. | موقع الاتحاد على شاشة هاتف. |
| `caseStudy.title` | A national federation's platform, rebuilt and live. | منصة اتحاد وطني، أعدنا بناءها وهي تعمل الآن. |
| `caseStudy.parts.challenge.label` | Challenge | التحدي |
| `caseStudy.parts.challenge.body` | A full rebuild of the federation's digital platform. | إعادة بناء كاملة للمنصة الرقمية للاتحاد. |
| `caseStudy.parts.approach.label` | Approach | النهج |
| `caseStudy.parts.approach.body` | A modern bilingual website with a complete content management system and a connected mobile app, redesigned from the interface up and fully responsive. As the federation's official digital and media partner, we also publish its social media daily in Arabic and English. | موقع حديث بلغتين، مع نظام كامل لإدارة المحتوى وتطبيق جوّال مرتبط به، أعدنا تصميم واجهته بالكامل ليعمل على كل الشاشات. وبصفتنا الشريك الرقمي والإعلامي الرسمي للاتحاد، ننشر محتواه على وسائل التواصل يوميًا بالعربية والإنجليزية. |
| `caseStudy.parts.built.label` | What we built | ما بنيناه |
| `caseStudy.parts.built.items.0` | Bilingual website | موقع بلغتين |
| `caseStudy.parts.built.items.1` | Mobile app | تطبيق جوّال |
| `caseStudy.parts.built.items.2` | Content management | إدارة المحتوى |
| `caseStudy.parts.built.items.3` | Admin dashboard and analytics | لوحة إدارة وتحليلات |
| `caseStudy.parts.built.items.4` | Arabic and English, SEO and performance | العربية والإنجليزية، والظهور في البحث والأداء |
| `caseStudy.parts.built.modules` | Athletes, clubs, coaches and referees · championships, results and national records · news, media library and live coverage | الرياضيون والأندية والمدربون والحكّام · البطولات والنتائج والأرقام القياسية الوطنية · الأخبار ومكتبة الوسائط والتغطية المباشرة |
| `caseStudy.parts.result.label` | Result | النتيجة |
| `caseStudy.parts.result.body` | All live: the website, the admin panel and the mobile app. | كلها تعمل الآن: الموقع الإلكتروني ولوحة الإدارة وتطبيق الجوّال. |
| `caseStudy.redraw` | Stylised redraw. The client's own screens stay private. | رسم توضيحي مبسّط. شاشات العميل نفسها تبقى خاصة. |
| `caseStudy.visit` | Visit the live site | زُر الموقع المنشور |
| `cta.book` | Book a free 30-min intro call | احجز مكالمة تعارف مجانية (30 دقيقة) |
| `cta.micro` | No obligation. We reply within one working day. | دون أي التزام. نرد خلال يوم عمل. |
| `cta.review` | Get a free website review | احصل على مراجعة مجانية لموقعك |
| `cta.reviewShort` | Free website review | مراجعة مجانية لموقعك |
| `cta.reviewPromise` | Send us your site. Within 3 working days we'll reply with 5 concrete improvements, free. | أرسل لنا موقعك، وخلال 3 أيام عمل نرد عليك بخمسة تحسينات عملية، مجانًا. |
| `cta.work` | See our work | شاهد أعمالنا |
| `cta.discuss` | Discuss this | ناقش هذه الخدمة معنا |
| `cta.discussFor` | Discuss this: {service} | ناقش هذه الخدمة معنا: {service} |
| `eventTech.name` | Event technology | تقنيات الفعاليات |
| `eventTech.eyebrow` | Event technology · our specialty | تقنيات الفعاليات · تخصّصنا |
| `eventTech.title` | Built by people who run events. | تبنيها فرقٌ تدير الفعاليات بنفسها. |
| `eventTech.intro` | We build the event registration system, the app and the results screens, and we're on the floor running the event too. One brief and one team, from the first invitation to the last result on screen. | نبني نظام التسجيل والتطبيق وشاشات النتائج، ونكون في أرض الحدث نديره أيضًا. ملف واحد وفريق واحد، من أول دعوة إلى آخر نتيجة تظهر على الشاشة. |
| `eventTech.items.0.title` | Registration and check-in | التسجيل وتسجيل الحضور |
| `eventTech.items.0.body` | Minute Zero by NO TIME · Coming soon | الدقيقة صفر من NO TIME · قريبًا |
| `eventTech.items.1.title` | Event apps and websites | تطبيقات ومواقع للفعاليات |
| `eventTech.items.1.body` | The agenda, the speakers and live updates. | البرنامج والمتحدثون والتحديثات المباشرة. |
| `eventTech.items.2.title` | Live results and screens | النتائج المباشرة والشاشات |
| `eventTech.items.2.body` | Championships, results and live coverage, as on a national federation's platform. | بطولات ونتائج وتغطية مباشرة، كما في منصة اتحاد وطني. |
| `eventTech.idealFor.0` | Conferences and exhibitions | المؤتمرات والمعارض |
| `eventTech.idealFor.1` | Sports events and championships | الفعاليات الرياضية والبطولات |
| `eventTech.idealFor.2` | Galas with a guest list | الحفلات بقوائم ضيوف |
| `eventTech.receive.0` | Registration and check-in for your guests | التسجيل وتسجيل الحضور لضيوفك |
| `eventTech.receive.1` | An event app or microsite with the agenda and live updates | تطبيق أو موقع مصغّر للفعالية بالبرنامج والتحديثات المباشرة |
| `eventTech.receive.2` | Live results and screens at the venue | نتائج مباشرة وشاشات في مكان الفعالية |
| `eventTech.eventsLink` | See Events & Hospitality | تعرّف على الفعاليات والضيافة |
| `eventTech.counter.label` | Checked in | سجّلوا حضورهم |
| `eventTech.counter.of` | of | من |
| `faqCopy.title` | Straight answers on cost, time and ownership. | إجابات مباشرة عن التكلفة والمدة والملكية. |
| `finalCta.risk` | Book a free 30-min intro call. No obligation. We reply within one working day. | احجز مكالمة تعارف مجانية (30 دقيقة). دون أي التزام. نرد خلال يوم عمل. |
| `finalCta.reviewTitle` | Or start with a free website review | أو ابدأ بمراجعة مجانية لموقعك |
| `hero.title` | Websites and apps your clients actually use, in Arabic and English. | مواقع وتطبيقات يستخدمها عملاؤك فعلًا، بالعربية والإنجليزية. |
| `hero.sub` | The team that runs your events also builds your platform: bilingual websites, iOS and Android apps, dashboards and the systems behind them. Designed and built in Dubai. | الفريق الذي يدير فعالياتك يبني منصّتك أيضًا: مواقع بلغتين، وتطبيقات iOS وAndroid، ولوحات إدارة والأنظمة التي تعمل خلفها. نصمّمها ونطوّرها في دبي. |
| `hero.ui.wire.0` | Header | الترويسة |
| `hero.ui.wire.1` | Hero | الواجهة |
| `hero.ui.wire.2` | Cards | البطاقات |
| `hero.ui.welcome` | Welcome | أهلًا بك |
| `hero.ui.welcomeOther` | أهلًا بك | Welcome |
| `hero.ui.button` | Book a visit | احجز زيارة |
| `hero.ui.states.0` | Default | افتراضي |
| `hero.ui.states.1` | Hover | تمرير |
| `hero.ui.states.2` | Active | نشط |
| `hero.ui.live` | Live | مباشر |
| `hero.ui.example` | Example | مثال |
| `hero.ui.preview` | Preview | معاينة |
| `hero.ui.soon` | Coming soon | قريبًا |
| `problems.title` | An English-only site. A slow page. A vendor who vanished after launch. | موقع بالإنجليزية وحدها، وصفحة بطيئة، ووكالة غابت بعد الإطلاق. |
| `problems.lead` | Sound familiar? Here is how we fix each one. | هل يبدو هذا مألوفًا؟ هكذا نعالج كلًّا منها. |
| `problems.painLabel` | The problem | المشكلة |
| `problems.fixLabel` | How we solve it | كيف نحلّها |
| `problems.items.0.pain` | Your site speaks English. Many of your customers read Arabic first. | موقعك بالإنجليزية، وكثير من عملائك يقرؤون بالعربية أولًا. |
| `problems.items.0.fix` | We build both languages from day one, with full right-to-left layouts and Arabic written natively. | نبني اللغتين من اليوم الأول، مع دعم كامل للاتجاه من اليمين إلى اليسار، وعربية مكتوبة بأسلوبها لا مترجمة. |
| `problems.items.1.pain` | It loads slowly on a phone, and visitors leave before it finishes. | يتأخر تحميله على الهاتف، فيغادر الزوّار قبل أن يكتمل. |
| `problems.items.1.fix` | Every page gets a performance budget, measured against Core Web Vitals before launch. | نحدّد لكل صفحة ميزانية أداء، ونقيسها بمؤشرات Core Web Vitals قبل الإطلاق. |
| `problems.items.2.pain` | Every text change means an email to the agency, then a wait. | كل تعديل في نص يعني رسالة إلى الوكالة، ثم انتظارًا. |
| `problems.items.2.fix` | Your team updates pages, news and images itself, in a content system that works in both languages. | يحدّث فريقك الصفحات والأخبار والصور بنفسه، من نظام لإدارة المحتوى يعمل باللغتين. |
| `problems.items.3.pain` | The agency launched it, then disappeared. | أطلقت الوكالة الموقع ثم اختفت. |
| `problems.items.3.fix` | Support and maintenance after launch are part of the plan, agreed in the proposal. | الدعم والصيانة بعد الإطلاق جزء من الخطة، ونتّفق عليهما في العرض. |
| `problems.items.4.pain` | Registration from one vendor, the app from another, the screens from a third. | التسجيل من مورّد، والتطبيق من آخر، والشاشات من ثالث. |
| `problems.items.4.fix` | One team builds your event technology and runs the event itself. | فريق واحد يبني تقنيات فعاليتك ويدير الفعالية نفسها. |
| `process.title` | You see your project at every stage, not only on launch day. | ترى مشروعك في كل مرحلة، لا يوم الإطلاق وحده. |
| `process.lead` | Five stages. Each one ends with something you can open, test or sign off. | خمس مراحل، تنتهي كلٌّ منها بشيء تفتحه أو تجرّبه أو تعتمده. |
| `process.receive` | You receive | تستلم |
| `process.steps.discover.name` | Discover | نستكشف |
| `process.steps.discover.body` | We learn your goals, your users and your content, and agree the scope. | نتعرّف على أهدافك ومستخدميك ومحتواك، ونتّفق على النطاق. |
| `process.steps.discover.receive` | A scope and a plan with the stages and dates | نطاق العمل وخطة بالمراحل والمواعيد |
| `process.steps.design.name` | Design | نصمّم |
| `process.steps.design.body` | Wireframes first, then the interface in both languages. | نبدأ بالمخططات، ثم الواجهة باللغتين. |
| `process.steps.design.receive` | A clickable prototype you can try yourself | نموذج تفاعلي تجرّبه بنفسك |
| `process.steps.build.name` | Build | نبني |
| `process.steps.build.body` | We develop in short stages you can follow. | نبرمج على مراحل قصيرة تتابعها خطوة بخطوة. |
| `process.steps.build.receive` | A staging link where you see progress at every stage | رابط تجريبي ترى عليه التقدّم في كل مرحلة |
| `process.steps.launch.name` | Launch | نطلق |
| `process.steps.launch.body` | We test speed, both languages and every form, then go live. | نختبر السرعة واللغتين وكل النماذج، ثم نطلق. |
| `process.steps.launch.receive` | A launch checklist we sign off with you | قائمة تحقق للإطلاق نعتمدها معك |
| `process.steps.support.name` | Support | ندعم |
| `process.steps.support.body` | We maintain and improve the product after launch. | نصون المنتج ونطوّره بعد الإطلاق. |
| `process.steps.support.receive` | Updates and improvements on the terms in your proposal | تحديثات وتحسينات وفق ما يتضمّنه العرض |
| `process.notes.0` | Bilingual by default | بلغتين من البداية |
| `process.notes.1` | Performance and SEO built in | الأداء والظهور في محركات البحث جزء من البناء |
| `process.notes.2` | Support & maintenance after launch | الدعم والصيانة بعد الإطلاق |
| `productsCopy.eyebrow` | Our products · Coming soon | منتجاتنا · قريبًا |
| `productsCopy.title` | Two products born at the event door and in the restaurant kitchen. | منتجان وُلدا عند باب الفعالية وفي مطبخ المطعم. |
| `productsCopy.intro` | We're building both from our own event and hospitality work. Register interest and we'll write to you when they're ready. | نطوّرهما من خبرتنا في الفعاليات والضيافة. سجّل اهتمامك، وسنكتب لك حين يصبحان جاهزين. |
| `productsCopy.problem` | The problem | المشكلة |
| `productsCopy.features` | Key features | أبرز الميزات |
| `productsCopy.register` | Register interest | سجّل اهتمامك |
| `productsCopy.registerFor` | Register interest in {product} | سجّل اهتمامك بـ{product} |
| `productsCopy.close` | Close the form | أغلق النموذج |
| `productsCopy.items.minute-zero.problem` | Queues at the door, and no clear picture of who has arrived. | طوابير عند الباب، ولا صورة واضحة لمن وصل. |
| `productsCopy.items.minute-zero.features.0` | QR invitations | دعوات برمز QR |
| `productsCopy.items.minute-zero.features.1` | Check-in at the door from a phone | تسجيل الحضور عند الباب من الهاتف |
| `productsCopy.items.minute-zero.features.2` | Live arrivals for the team | متابعة الوصول لحظة بلحظة لفريقك |
| `productsCopy.items.minute-zero.screens.0` | Check-in dashboard | لوحة الحضور |
| `productsCopy.items.minute-zero.screens.1` | QR scan | مسح الرمز |
| `productsCopy.items.minute-zero.screens.2` | Guest list | قائمة الضيوف |
| `productsCopy.items.peak-hour.problem` | Orders, tables and the kitchen, out of step at the busiest hour. | الطلبات والطاولات والمطبخ، كلٌّ في وادٍ ساعةَ الذروة. |
| `productsCopy.items.peak-hour.features.0` | Table and order management | إدارة الطاولات والطلبات |
| `productsCopy.items.peak-hour.features.1` | Kitchen display | شاشة للمطبخ |
| `productsCopy.items.peak-hour.features.2` | End-of-day summary | ملخص نهاية اليوم |
| `productsCopy.items.peak-hour.screens.0` | Tables | الطاولات |
| `productsCopy.items.peak-hour.screens.1` | Kitchen queue | طلبات المطبخ |
| `productsCopy.items.peak-hour.screens.2` | Daily summary | ملخص اليوم |
| `productsCopy.demo.arrived` | Arrived | وصلوا |
| `productsCopy.demo.expected` | Expected | متوقّع |
| `productsCopy.demo.scan` | Point the camera at the guest's code | وجّه الكاميرا إلى رمز الضيف |
| `productsCopy.demo.valid` | Welcome, guest 112 | أهلًا بالضيف 112 |
| `productsCopy.demo.guests.0` | Guest 101 | الضيف 101 |
| `productsCopy.demo.guests.1` | Guest 102 | الضيف 102 |
| `productsCopy.demo.guests.2` | Guest 103 | الضيف 103 |
| `productsCopy.demo.guests.3` | Guest 104 | الضيف 104 |
| `productsCopy.demo.in` | In | حضر |
| `productsCopy.demo.due` | Due | منتظر |
| `productsCopy.demo.table` | Table | طاولة |
| `productsCopy.demo.free` | Free | متاحة |
| `productsCopy.demo.seated` | Seated | مشغولة |
| `productsCopy.demo.order` | Order | طلب |
| `productsCopy.demo.preparing` | Preparing | قيد التحضير |
| `productsCopy.demo.ready` | Ready | جاهز |
| `productsCopy.demo.covers` | Covers | عدد الضيوف |
| `productsCopy.demo.orders` | Orders | الطلبات |
| `productsCopy.demo.peak` | Busiest hour | ساعة الذروة |
| `proof.title` | Live today: a national federation's platform, and the site you're reading. | يعمل اليوم: منصة اتحاد رياضي وطني، والموقع الذي تقرؤه الآن. |
| `proof.federation.label` | A national sports federation | اتحاد رياضي وطني |
| `proof.federation.line` | Bilingual website, mobile app and content management system, all live. | موقع بلغتين وتطبيق جوّال ونظام لإدارة المحتوى، وكلها تعمل الآن. |
| `proof.federation.link` | Read the case study | اقرأ دراسة الحالة |
| `proof.site.label` | This website | هذا الموقع |
| `proof.site.line` | Designed and built by our team in Arabic and English, with full right-to-left layouts. The screens here are captured from it. | صمّمه فريقنا وبناه بالعربية والإنجليزية، مع دعم كامل للاتجاه من اليمين إلى اليسار. الشاشات هنا ملتقطة منه مباشرة. |
| `proof.site.toggle` | Show the site in | اعرض الموقع بـ |
| `proof.site.english` | English | الإنجليزية |
| `proof.site.arabic` | Arabic | العربية |
| `proof.site.lighthouse` | Mobile Lighthouse, measured on the live site | نتيجة Lighthouse على الجوّال، مقيسة على الموقع المنشور |
| `proof.review.title` | How does your site look on a phone, in Arabic? | كيف يبدو موقعك على الهاتف، وبالعربية؟ |
| `quality.title` | The parts nobody sees, checked on every build. | التفاصيل التي لا يراها أحد، نتحقق منها في كل مشروع. |
| `quality.items.0` | Arabic and English, right-to-left and left-to-right | العربية والإنجليزية، من اليمين إلى اليسار ومن اليسار إلى اليمين |
| `quality.items.1` | Accessibility: keyboard, contrast and screen readers | سهولة الوصول: لوحة المفاتيح والتباين وقارئات الشاشة |
| `quality.items.2` | A performance budget for every page, measured against Core Web Vitals | ميزانية أداء لكل صفحة، نقيسها بمؤشرات Core Web Vitals |
| `quality.items.3` | Security and data protection, designed with the UAE's personal data protection law (PDPL) in mind | الأمان وحماية البيانات، مع مراعاة قانون حماية البيانات الشخصية في الإمارات |
| `quality.stack` | Built with Next.js · React · TypeScript · Node.js · iOS and Android | نبني بـ Next.js · React · TypeScript · Node.js · iOS وAndroid |
| `seo.title` | Website and App Development in Dubai \| NO TIME | تطوير المواقع والتطبيقات في دبي \| NO TIME |
| `seo.description` | Bilingual Arabic–English websites, mobile apps, event registration systems and custom platforms, built in Dubai by the team that also runs events. | مواقع بالعربية والإنجليزية، وتطبيقات جوّال، وأنظمة تسجيل للفعاليات، ومنصّات مخصّصة، يبنيها في دبي الفريق الذي يدير الفعاليات أيضًا. |
| `serviceBlocks.websites.outcome` | A site your clients actually use, in Arabic and English. | موقع يستخدمه عملاؤك فعلًا، بالعربية والإنجليزية. |
| `serviceBlocks.websites.idealFor.0` | Companies selling to Arabic and English speakers | شركات تخاطب عملاء بالعربية والإنجليزية |
| `serviceBlocks.websites.idealFor.1` | Teams that update their content often | فرق تحدّث محتواها باستمرار |
| `serviceBlocks.websites.idealFor.2` | Brands replacing an English-only site | علامات تستبدل موقعًا بالإنجليزية فقط |
| `serviceBlocks.mobile-apps.outcome` | An app on your clients' phones, fed by the same content as your site. | تطبيق على هواتف عملائك، يعرض المحتوى نفسه الذي في موقعك. |
| `serviceBlocks.mobile-apps.idealFor.0` | Services customers book or check often | خدمات يحجزها العملاء أو يتابعونها كثيرًا |
| `serviceBlocks.mobile-apps.idealFor.1` | Membership and loyalty programmes | برامج العضوية والولاء |
| `serviceBlocks.mobile-apps.idealFor.2` | Events with an agenda and live updates | فعاليات ببرنامج وتحديثات مباشرة |
| `serviceBlocks.custom-systems.outcome` | Spreadsheets and email threads, replaced by one system your team runs. | نظام واحد يديره فريقك، بدل جداول البيانات وسلاسل الرسائل. |
| `serviceBlocks.custom-systems.idealFor.0` | Operations that run on spreadsheets | عمليات تُدار بجداول البيانات |
| `serviceBlocks.custom-systems.idealFor.1` | Teams that need roles and approvals | فرق تحتاج إلى أدوار وموافقات |
| `serviceBlocks.custom-systems.idealFor.2` | Businesses connecting several tools | أعمال تربط بين عدة أدوات |
| `serviceBlocks.e-commerce.outcome` | A store where buying takes a few clear steps, and orders are easy to follow. | متجر يتم فيه الشراء بخطوات قليلة وواضحة، وتسهل فيه متابعة الطلبات. |
| `serviceBlocks.e-commerce.idealFor.0` | Retail brands starting to sell online | علامات تجزئة تبدأ البيع عبر الإنترنت |
| `serviceBlocks.e-commerce.idealFor.1` | Shops moving to a store of their own | متاجر تنتقل إلى متجرها الإلكتروني الخاص |
| `serviceBlocks.e-commerce.idealFor.2` | Gift and catering orders | طلبات الهدايا والضيافة |
| `serviceBlocks.ui-ux-design.outcome` | Interfaces people understand the first time they use them. | واجهات يفهمها الناس من أول استخدام. |
| `serviceBlocks.ui-ux-design.idealFor.0` | Products before development starts | منتجات قبل أن تبدأ برمجتها |
| `serviceBlocks.ui-ux-design.idealFor.1` | Apps and sites people leave halfway | تطبيقات ومواقع يتركها المستخدمون في منتصف الطريق |
| `serviceBlocks.ui-ux-design.idealFor.2` | Teams building a design system | فرق تبني نظام تصميم |
| `serviceBlocks.ai-consulting.outcome` | A clear answer on where AI saves your team time, and where it doesn't. | إجابة واضحة عن المواضع التي يوفّر فيها الذكاء الاصطناعي وقت فريقك، وأين لا يفعل. |
| `serviceBlocks.ai-consulting.idealFor.0` | Teams with repetitive written work | فرق لديها أعمال كتابية متكررة |
| `serviceBlocks.ai-consulting.idealFor.1` | Managers asked for an AI plan | مديرون مطلوب منهم خطة للذكاء الاصطناعي |
| `serviceBlocks.ai-consulting.idealFor.2` | Businesses unsure where to start | أعمال لا تعرف من أين تبدأ |
| `services.title` | Six things we build, all in Arabic and English from the first screen. | ستة أشياء نبنيها، وكلها بالعربية والإنجليزية من الشاشة الأولى. |
| `services.lead` | Website, app and system development in Dubai, for businesses in the UAE and across the region. | تطوير المواقع والتطبيقات والأنظمة في دبي، لأعمال في الإمارات وفي أنحاء المنطقة. |
| `services.idealFor` | Ideal for | مناسب لـ |
| `services.receive` | You receive | ما تحصل عليه |
| `services.phases` | Stages | المراحل |
| `sticky.label` | Quick actions | إجراءات سريعة |
| `tiers.title` | Start where your business is today. Grow from there. | ابدأ من حيث يقف عملك اليوم، ثم انمُ منه. |
| `tiers.intro` | Three levels of scope, from a focused website to a platform that keeps growing. | ثلاثة مستويات من النطاق، من موقع مركّز إلى منصّة تواصل النمو. |
| `tiers.note` | Every project is scoped and quoted individually. | نحدّد نطاق كل مشروع ونسعّره على حدة. |
| `tiers.idealFor` | Ideal for | مناسب لـ |
| `tiers.included` | What's included | ما يشمله |
| `tiers.receive` | You receive | تستلم |
| `tiers.cta` | Talk about {tier} | ناقش معنا مستوى {tier} |
| `tiers.items.launch.name` | Launch | الانطلاق |
| `tiers.items.launch.summary` | A focused bilingual website. | موقع مركّز بلغتين. |
| `tiers.items.launch.ideal` | A new business, a new brand, or a site that needs replacing. | عمل جديد، أو علامة جديدة، أو موقع حان وقت استبداله. |
| `tiers.items.launch.included.0` | A website in Arabic and English | موقع بالعربية والإنجليزية |
| `tiers.items.launch.included.1` | Full right-to-left layout | دعم كامل للاتجاه من اليمين إلى اليسار |
| `tiers.items.launch.included.2` | Designed for the phone first | تصميم يبدأ من الهاتف |
| `tiers.items.launch.included.3` | Core SEO and speed setup | إعداد أساسي للظهور في محركات البحث والسرعة |
| `tiers.items.launch.included.4` | Contact and enquiry forms | نماذج التواصل والاستفسارات |
| `tiers.items.launch.receive` | A live site and a handover session for your team | موقع يعمل، وجلسة تسليم لفريقك |
| `tiers.items.grow.name` | Grow | النمو |
| `tiers.items.grow.summary` | Website, content system, SEO and integrations. | موقع ونظام لإدارة المحتوى وظهور في محركات البحث وربط بأدواتك. |
| `tiers.items.grow.ideal` | Teams that publish often and need the site to bring in enquiries. | فرق تنشر باستمرار، وتريد موقعًا يجلب لها الطلبات. |
| `tiers.items.grow.included.0` | Everything in Launch | كل ما يشمله الانطلاق |
| `tiers.items.grow.included.1` | A content system your team runs | نظام لإدارة المحتوى يديره فريقك |
| `tiers.items.grow.included.2` | SEO structure in both languages | بنية للظهور في محركات البحث باللغتين |
| `tiers.items.grow.included.3` | Integrations with your CRM, booking or email tools | الربط بأدوات إدارة العملاء أو الحجز أو البريد |
| `tiers.items.grow.included.4` | News, blog or resources section | قسم للأخبار أو المدونة أو المصادر |
| `tiers.items.grow.included.5` | Performance and search reporting | تقارير عن الأداء والظهور في البحث |
| `tiers.items.grow.receive` | A site your team updates itself, connected to the tools you use | موقع يحدّثه فريقك بنفسه، ومرتبط بالأدوات التي تستخدمها |
| `tiers.items.platform.name` | Platform | المنصّة |
| `tiers.items.platform.summary` | A custom system or app, dashboards and ongoing development. | نظام أو تطبيق مخصّص، ولوحات إدارة، وتطوير مستمر. |
| `tiers.items.platform.ideal` | Businesses whose users, processes or data need more than a website. | أعمال يحتاج مستخدموها أو عملياتها أو بياناتها إلى أكثر من موقع. |
| `tiers.items.platform.included.0` | A custom web platform or mobile app | منصّة ويب أو تطبيق جوّال مخصّص |
| `tiers.items.platform.included.1` | Admin dashboards and analytics | لوحات إدارة وتحليلات |
| `tiers.items.platform.included.2` | Roles and permissions | أدوار وصلاحيات |
| `tiers.items.platform.included.3` | Integrations and APIs | الربط بالأنظمة والواجهات البرمجية |
| `tiers.items.platform.included.4` | Arabic and English from the first screen | العربية والإنجليزية من الشاشة الأولى |
| `tiers.items.platform.included.5` | Ongoing development in stages | تطوير مستمر على مراحل |
| `tiers.items.platform.receive` | A working platform, its documentation and a development roadmap | منصّة تعمل، مع توثيقها وخطة لتطويرها |
| `ways.title` | After launch, the work keeps going. So do we. | بعد الإطلاق يستمر العمل، ونستمر معه. |
| `ways.lead` | Two ways to work with us. | طريقتان للعمل معنا. |
| `ways.items.0.name` | Fixed-scope project | مشروع بنطاق محدّد |
| `ways.items.0.body` | A defined scope, a plan with dates, and a launch. Right for a new site, app or system. | نطاق محدّد وخطة بالمواعيد وإطلاق. يناسب موقعًا أو تطبيقًا أو نظامًا جديدًا. |
| `ways.items.0.points.0` | Scope and plan agreed before work starts | نتّفق على النطاق والخطة قبل بدء العمل |
| `ways.items.0.points.1` | Progress you can see at every stage | تقدّم تراه في كل مرحلة |
| `ways.items.0.points.2` | Launch and handover to your team | الإطلاق والتسليم لفريقك |
| `ways.items.1.name` | Monthly support & growth | دعم وتطوير شهري |
| `ways.items.1.tag` | The natural next step after launch | الخطوة الطبيعية بعد الإطلاق |
| `ways.items.1.body` | After launch we keep the product healthy and moving forward, month by month. | بعد الإطلاق نحافظ على المنتج ونطوّره، شهرًا بعد شهر. |
| `ways.items.1.points.0` | Maintenance and updates | الصيانة والتحديثات |
| `ways.items.1.points.1` | Improvements and new features | تحسينات وميزات جديدة |
| `ways.items.1.points.2` | Content updates | تحديث المحتوى |
| `ways.items.1.points.3` | Monthly reporting | تقارير شهرية |
| `why.title` | One team that plans the event, writes the Arabic and ships the code. | فريق واحد يخطّط للفعالية، ويكتب العربية، ويطلق المنصّة. |
| `why.lead` | Why NO TIME, in five lines. | لماذا NO TIME، في خمسة أسطر. |
| `why.items.0.title` | One team for events and digital | فريق واحد للفعاليات والحلول الرقمية |
| `why.items.0.body` | The people who run your event build its registration, app and screens, so nothing gets lost between vendors. | من يدير فعاليتك يبني تسجيلها وتطبيقها وشاشاتها، فلا يضيع شيء بين الموردين. |
| `why.items.1.title` | Native Arabic and English | عربية وإنجليزية أصيلتان |
| `why.items.1.body` | Arabic is written for Gulf readers, not translated at the end, and every layout mirrors properly. | نكتب العربية لقرّاء الخليج لا نترجمها في النهاية، وكل تصميم ينعكس اتجاهه كما ينبغي. |
| `why.items.2.title` | Performance and SEO built in | الأداء والظهور في البحث جزء من البناء |
| `why.items.2.body` | Speed and search structure are part of the build, and we check them before launch. | السرعة وبنية الظهور في محركات البحث جزء من البناء، ونتحقق منهما قبل الإطلاق. |
| `why.items.3.title` | Support after launch | دعم بعد الإطلاق |
| `why.items.3.body` | We stay after go-live, with maintenance and improvements on agreed terms. | نبقى معك بعد الإطلاق، بالصيانة والتحسينات وفق ما نتّفق عليه. |
| `why.items.4.title` | Progress you can see | تقدّم تراه بعينك |
| `why.items.4.body` | A clickable prototype first, then a staging link you can open at any stage. | نموذج تفاعلي أولًا، ثم رابط تجريبي تفتحه في أي مرحلة. |
| `forms.formCopy.optional` | optional | اختياري |
| `forms.formCopy.sending` | Sending… | جارٍ الإرسال… |
| `forms.formCopy.summaryTitle` | Check these before sending: | راجع ما يلي قبل الإرسال: |
| `forms.formCopy.states.rateLimited` | Too many attempts from this connection. Try again in {minutes} min, or email us at {email}. | محاولات كثيرة من هذا الاتصال. حاول مجددًا بعد {minutes} دقيقة، أو راسلنا على {email}. |
| `forms.formCopy.states.blocked` | We couldn't confirm the request came from a person. Try again, or email us at {email}. | لم نتمكّن من التأكد من أن الطلب مُرسَل من شخص. حاول مجددًا، أو راسلنا على {email}. |
| `forms.formCopy.states.failed` | Your request didn't send because of a problem on our side. Try again, or email us at {email}. | لم يُرسَل طلبك بسبب خلل لدينا. حاول مجددًا، أو راسلنا على {email}. |
| `forms.formCopy.states.another` | Send another request | أرسل طلبًا آخر |
| `forms.formCopy.privacy.text` | We use these details only to reply to you. Resend delivers our email and Cloudflare protects this form from spam. | نستخدم هذه البيانات للرد عليك فقط. توصل خدمة Resend رسائلنا، وتحمي Cloudflare هذا النموذج من الرسائل المزعجة. |
| `forms.formCopy.privacy.link` | Privacy Policy | سياسة الخصوصية |
| `forms.formCopy.honeypot` | Leave this field empty | اترك هذا الحقل فارغًا |
| `forms.formCopy.fields.name` | Your name | اسمك |
| `forms.formCopy.fields.email` | Email | البريد الإلكتروني |
| `forms.formCopy.fields.phone` | Phone or WhatsApp | الهاتف أو واتساب |
| `forms.formCopy.fields.company` | Company | الشركة |
| `forms.formCopy.fields.websiteUrl` | Current website | موقعك الحالي |
| `forms.formCopy.fields.websiteUrlHint` | For example, yourcompany.ae | مثال: yourcompany.ae |
| `forms.formCopy.consultation.project` | Your project | مشروعك |
| `forms.formCopy.consultation.you` | About you | عنك |
| `forms.formCopy.consultation.build` | What do you want to build? | ماذا تريد أن تبني؟ |
| `forms.formCopy.consultation.buildOptions.websites` | A website | موقع إلكتروني |
| `forms.formCopy.consultation.buildOptions.apps` | A mobile app | تطبيق جوّال |
| `forms.formCopy.consultation.buildOptions.systems` | A custom system or dashboard | نظام مخصّص أو لوحة إدارة |
| `forms.formCopy.consultation.buildOptions.e-commerce` | An online store | متجر إلكتروني |
| `forms.formCopy.consultation.buildOptions.ux` | UI/UX design | تصميم الواجهات وتجربة المستخدم |
| `forms.formCopy.consultation.buildOptions.ai-consulting` | AI consulting | استشارات الذكاء الاصطناعي |
| `forms.formCopy.consultation.buildOptions.event-tech` | Event technology | تقنيات الفعاليات |
| `forms.formCopy.consultation.buildOptions.other` | Something else | شيء آخر |
| `forms.formCopy.consultation.tier` | Engagement level | مستوى التعاون |
| `forms.formCopy.consultation.tierNone` | Not sure yet | لم أحدّد بعد |
| `forms.formCopy.consultation.timeline` | When do you want to start? | متى تريد أن تبدأ؟ |
| `forms.formCopy.consultation.timelineOptions.flexible` | I'm flexible | الموعد مرن |
| `forms.formCopy.consultation.timelineOptions.within-3-months` | Within 3 months | خلال 3 أشهر |
| `forms.formCopy.consultation.timelineOptions.urgent` | As soon as possible | في أقرب وقت ممكن |
| `forms.formCopy.consultation.budget` | Budget range | الميزانية التقريبية |
| `forms.formCopy.consultation.budgetNone` | Choose a range | اختر نطاقًا |
| `forms.formCopy.consultation.budgetHint` | It helps us suggest the right scope. It's never a price. | تساعدنا على اقتراح النطاق المناسب، وليست سعرًا. |
| `forms.formCopy.consultation.message` | Tell us a little more | أخبرنا بالمزيد |
| `forms.formCopy.consultation.messageHint` | Who it's for, what it must do, any date that matters. | لمن هو، وما الذي يجب أن يفعله، وأي موعد يهمّك. |
| `forms.formCopy.consultation.submit` | Book a free 30-min intro call | احجز مكالمة تعارف مجانية (30 دقيقة) |
| `forms.formCopy.consultation.micro` | No obligation. We reply within one working day. | دون أي التزام. نرد خلال يوم عمل. |
| `forms.formCopy.consultation.successTitle` | Thanks, {name}. Your request is in. | شكرًا، {name}. وصلنا طلبك. |
| `forms.formCopy.consultation.successBody` | We reply within one working day to set a time for the call. | نرد خلال يوم عمل لنحدّد موعد المكالمة. |
| `forms.formCopy.consultation.prefilled` | We've filled in: {choice}. Change it if you like. | اخترنا لك: {choice}. يمكنك تغييره. |
| `forms.formCopy.review.websiteUrl` | Your website address | عنوان موقعك |
| `forms.formCopy.review.contact` | Email or WhatsApp number | البريد الإلكتروني أو رقم واتساب |
| `forms.formCopy.review.goal` | What's the main goal? | ما هدفك الأساسي؟ |
| `forms.formCopy.review.goalOptions.more-enquiries` | More enquiries | طلبات أكثر |
| `forms.formCopy.review.goalOptions.arabic-version` | An Arabic version | نسخة عربية |
| `forms.formCopy.review.goalOptions.speed` | A faster site | موقع أسرع |
| `forms.formCopy.review.goalOptions.easier-updates` | Easier updates | تحديث أسهل |
| `forms.formCopy.review.goalOptions.other` | Something else | شيء آخر |
| `forms.formCopy.review.message` | Anything we should know? | هل هناك ما يجب أن نعرفه؟ |
| `forms.formCopy.review.submit` | Send my site for review | أرسل موقعي للمراجعة |
| `forms.formCopy.review.successTitle` | Thanks, {name}. Your site is with us. | شكرًا، {name}. وصلنا موقعك. |
| `forms.formCopy.review.successBody` | Within 3 working days we'll reply with 5 concrete improvements, free. | خلال 3 أيام عمل نرد عليك بخمسة تحسينات عملية، مجانًا. |
| `forms.formCopy.interest.message` | What would you use it for? | فيمَ ستستخدمه؟ |
| `forms.formCopy.interest.submit` | Register interest | سجّل اهتمامك |
| `forms.formCopy.interest.successTitle` | Thanks, {name}. You're on the list for {product}. | شكرًا، {name}. سجّلنا اهتمامك بـ{product}. |
| `forms.formCopy.interest.successBody` | We'll write to you when it's ready. | سنكتب لك حين يصبح جاهزًا. |
| `forms.errorMessages.required` | Fill in this field. | املأ هذا الحقل. |
| `forms.errorMessages.email` | Enter an email address like name@company.com. | اكتب بريدًا إلكترونيًا بهذا الشكل: name@company.com |
| `forms.errorMessages.url` | Enter a website address like yourcompany.ae. | اكتب عنوان موقع بهذا الشكل: yourcompany.ae |
| `forms.errorMessages.phone` | Enter the number with digits, spaces or a leading +. | اكتب الرقم بالأرقام، ويمكنك استخدام المسافات أو علامة + في أوله. |
| `forms.errorMessages.contact` | Enter an email address or a phone number. | اكتب بريدًا إلكترونيًا أو رقم هاتف. |
| `forms.errorMessages.tooLong` | This is too long. Shorten it a little. | النص أطول من المسموح، اختصره قليلًا. |
| `forms.errorMessages.invalid` | Check this field and try again. | راجع هذا الحقل وحاول مجددًا. |
| `forms.requiredMessages.name` | Enter your name. | اكتب اسمك. |
| `forms.requiredMessages.email` | Enter your email address. | اكتب بريدك الإلكتروني. |
| `forms.requiredMessages.build` | Choose what you want to build. | اختر ما تريد بناءه. |
| `forms.requiredMessages.timeline` | Choose when you want to start. | اختر متى تريد أن تبدأ. |
| `forms.requiredMessages.websiteUrl` | Enter your website address. | اكتب عنوان موقعك. |
| `forms.requiredMessages.contact` | Enter an email address or a WhatsApp number. | اكتب بريدًا إلكترونيًا أو رقم واتساب. |
| `forms.requiredMessages.goal` | Choose the main goal. | اختر هدفك الأساسي. |

## Events & Hospitality

Batch 2, 2026-11-15. The deck approved on 2026-11-09 (docs/content/category-copy-events.md) already read natively in most lines; those are kept. Changed only where a line was a calque, stiff or leaned on a cliché. EN changes in the same pass: the intro now leads with the outcome ("One team takes your event…") and drops "under one roof" (also in FAQ 2), as on the homepage. New lines (hooks, modules, related work) were written in Arabic from the idea, not from the English.

| Key | Old | New | Why |
|---|---|---|---|
| `categories.events.summary` | مؤتمرات ومعارض وإطلاقات واحتفالات، من أول فكرة حتى آخر ضيف. | مؤتمرات ومعارض وحفلات إطلاق ومناسبات خاصة، من أول فكرة حتى يغادر آخر ضيف. | «إطلاقات» is a calque plural; «حتى يغادر آخر ضيف» gives "the last guest" a moment. |
| `categories.events.intro` | مؤتمرات وقمم، ومعارض، وإطلاقات، وحفلات، وضيافة تراثية. نتولّى كل مناسبة من الفكرة والديكور، مرورًا بالإنتاج، حتى تجربة الضيف يوم الحدث، تحت سقف واحد. | فريق واحد يحمل مناسبتك من الفكرة والديكور، مرورًا بالإنتاج، حتى تجربة الضيف يوم الحدث: مؤتمرات وقمم، ومعارض، وحفلات إطلاق، وحفلات رسمية، وضيافة تراثية. | Outcome first (matches the new EN); «تحت سقف واحد» retired as on the homepage. |
| `categories.events.faq[0].a` | المؤتمرات والقمم، والمعارض، وإطلاق المنتجات وتفعيل العلامات، والحفلات والأعراس والاحتفالات الخاصة، وحفلات التكريم وليالي الجوائز، للشركات والجهات الحكومية والأفراد. | مؤتمرات وقمم، ومعارض، وإطلاق منتجات وتفعيل علامات تجارية، وحفلات رسمية وأعراس ومناسبات خاصة، وحفلات تكريم وليالي جوائز. نعمل للشركات والجهات الحكومية والأفراد. | Indefinite list reads lighter; the clients get their own sentence. |
| `categories.events.faq[1].a` | نعم. الفكرة والديكور والإنتاج وتجربة الضيف عندنا تحت سقف واحد، فيعمل فريق الديكور وفريق الضيافة والفريق التقني وفق خطة واحدة. | نعم. الفكرة والديكور والإنتاج وتجربة الضيف كلها عند فريق واحد، فيعمل فريق الديكور وفريق الضيافة والفريق التقني على خطة واحدة. | Says "one team" instead of the cliché; «على خطة» is more natural than «وفق». |
| `categories.events.faq[2].a` | نعم: تجهيز المجالس والخيام الصحراوية، وتقديم القهوة العربية، والعربات التراثية، ومحطات الطهي الحية، ومراسم الاستقبال. | نعم: نجهّز المجالس والخيام الصحراوية، ونقدّم القهوة العربية، ومعها العربات التراثية، ومحطات طهي أمام الضيوف، ومراسم الاستقبال. | Verbs instead of a chain of verbal nouns; «الحية» was a calque of "live". |
| `categories.events.faq[5].q` | قبل كم من الوقت ينبغي أن أحجز؟ | متى ينبغي أن أحجز؟ | «قبل كم من الوقت» is a calque of "how far ahead". |
| `categories.events.faq[5].a` | يعتمد ذلك على حجم المناسبة. شاركنا الموعد، ونؤكّد لك مدى توفّرنا. | يتوقّف ذلك على حجم المناسبة. أرسل لنا الموعد، ونؤكّد لك إن كان متاحًا. | «مدى توفّرنا» was stiff; a plain yes or no is what the reader wants. |
| `services.conferences-summits.summary` | البرنامج والمكان والمتحدثون وإدارة اليوم، في خطة واحدة. | البرنامج والمكان والمتحدثون وسير اليوم، في خطة واحدة. | «سير اليوم» is the running of the day; «إدارة» reads as administration. |
| `services.conferences-summits.points[1]` | المكان وتوزيع القاعة | اختيار المكان وتوزيع القاعة | A verbal noun says what we do with the venue. |
| `services.conferences-summits.points[3]` | تطبيق هوية الحدث في المكان | هوية الحدث في أرجاء المكان | «تطبيق» was a calque of "applying"; «في أرجاء» says it is everywhere. |
| `services.galas-private-celebrations.summary` | حفلات وأعراس واستقبالات مواليد وتجمّعات عائلية: … | حفلات رسمية وأعراس واستقبال مواليد ولقاءات عائلية خاصة: … | "Galas" are «حفلات رسمية»; «تجمّعات» sounds like a crowd, not an intimate gathering. |
| `services.catering-heritage-hospitality.summary` | ضيافة للمناسبات الخاصة والشركات، وحلويات ومشروبات مميّزة، ومجالس وخيام صحراوية وتقديم القهوة العربية. | ضيافة للمناسبات الخاصة وللشركات، وحلويات ومشروبات بتوقيعنا، ومجالس وخيام صحراوية تُقدَّم فيها القهوة العربية. | «بتوقيعنا» is the Gulf hospitality term for "signature"; «مميّزة» is filler. |
| `services.catering-heritage-hospitality.points[2]` | العربات التراثية ومحطات الطهي الحية | العربات التراثية ومحطات الطهي أمام الضيوف | As FAQ 3. |
| `services.catering-heritage-hospitality.points[3]` | حلويات ومشروبات مميّزة | حلويات ومشروبات بتوقيعنا | As the summary. |
| `services.catering-heritage-hospitality.points[5]` | الخدمة الخاصة وضيافة الاجتماعات التنفيذية | الخدمة الخاصة وضيافة مجالس الإدارة | "Boardroom" is «مجلس الإدارة»; «التنفيذية» was a calque. Same change in the menu module. |
| `scenes.events.s4` | كل التفاصيل جاهزة قبل وصول أول ضيف. | كل تفصيل جاهز قبل أن يصل أول ضيف. | The singular is crisper; the verb carries the arrival. |
| `service-hooks` (6, new) | — | e.g. «لحظة الكشف ثوانٍ معدودة، ونحن نبني كل ما يسبقها.» · «قهوة تُصبّ كما يعرفها ضيوفك، في مجلس جاهز قبل وصولهم.» | One hook per section, written from the idea; sources in service-hooks.ts. |
| `modules.*` (6, new) | — | e.g. «يوم المؤتمر، فقرة بعد فقرة» · «أضئ المسرح» · «جناح يُبنى في ست خطوات» | Module copy in src/content/modules/*.ts; «أمام الضيوف» for "live", never «على الهواء». |
| `modules.stage-lights.note` (new) | شغّل كل مجموعة بنفسك، أو شغّل الإشارات … | تحكّم في كل مجموعة بنفسك، أو شغّل الإشارات … | No repeated verb; «شغّل الإشارات» stays matched to the button. |
| `related-work.title` (new) | — | أعمال نفّذناها لجهات وطنية | Says who the work was for without naming them (D78). |

Kept as approved (native already): the category title, FAQ 1 q, 2 q, 4, 5, 7, 8, the closing «أخبرنا بالموعد، ونجهّز لك القاعة.», scenes s1 and s3, the other service summaries and points.
## Marketing, Creative, Print (step 3: native fixes and the section hooks)

| Key | Old | New | Why |
|---|---|---|---|
| `services.ts` | عناوين وفيديوهات شرح ومحتوى للشاشات، بحركة هادفة. | عناوين وفيديوهات شرح ومحتوى للشاشات، لكل حركة فيها سبب. | «بحركة هادفة» is a calque of "move with purpose"; the new line says it plainly. |
| `services.ts` | الاسم والشعار والنبرة والنظام البصري، متماسكة معًا. | الاسم والشعار ونبرة الخطاب والنظام البصري، في هوية واحدة متماسكة. | The old line ended on a dangling «متماسكة معًا»; the new one names what holds together. |
| `services.ts` | الصحافة والعلاقات الإعلامية والبيانات الرسمية، نتولّاها بعناية. | البيانات الصحفية والعلاقات الإعلامية والإعلانات الرسمية، من الصياغة حتى النشر. | «نتولّاها بعناية» translates "handled with care" and says nothing; the new line gives the span of the work. |
| `categories.ts` | في خطة واحدة تمنح العلامة صوتًا واحدًا. ننشر بالعربية والإنجليزية، ونقيس ما يُنشر، ونرفع عنه التقارير. | في خطة واحدة تتحدث فيها العلامة بصوت واحد. ننشر بالعربية والإنجليزية، ونقيس أداء كل ما يُنشر، ونقدّم عنه تقارير واضحة. | «نرفع عنه التقارير» is a calque of "report on it"; «نقيس أداء… ونقدّم تقارير واضحة» is the Gulf business phrasing. |
| `categories.ts` | أجنحة وطباعة وتغليف وهدايا، بلمسات الرقائق المعدنية وUV والحفر والليزر. | أجنحة وطباعة وتغليف وهدايا، بلمسات نهائية من الرقائق المعدنية وUV والكبس والحفر بالليزر. | «الحفر والليزر» split one method in two and dropped debossing; now the four finishes match the EN. |
| `service-hooks.ts` (18 new) | (none) | One hook per service, written natively in Arabic from the idea (see the file) | The final push §3: an outcome-first line under each H2, as Events has. No figures, no time promises, no client names. |

## Work index and case pages (batch 3, F1: new lines)

Written natively from the idea; Western digits; «في أرض الحدث» for on-site.

| Key | Line | Note |
|---|---|---|
| `workIndex.headingLead` / `headingKey` | أعمال لجهات وطنية، / مشروعًا بعد مشروع. | Says who the work was for without naming them; «مشروعًا بعد مشروع» carries the ledger idea. |
| `workIndex.intro` | جناح في معرض دبي للطيران، وليالي تكريم لدوري كرة قدم، وموقع اتحاد رياضي وتطبيقه ومنصّاته اليومية. يظهر اسم كل عميل حين يوافق على ذكره. | Concrete nouns first; the permission line is a plain statement, not an apology. |
| `workIndex.metaDescription` | مشاريع مختارة من NO TIME Creative House: جناح لشركة طيران وطنية في المعارض، وبطولات دوري كرة قدم وليالي تكريمه، وموقع اتحاد رياضي وتطبيقه ومنصّاته اليومية. | Same three cases, anonymous. |
| `workIndex.filterLabel`, `serviceFacet`, `marketFacet`, `allServices`, `allMarkets` | تصفية الأعمال · الخدمة · السوق · كل الخدمات · كل الأسواق | Standard UI terms. |
| `workIndex.count` | لا مشاريع / مشروع واحد / مشروعان / {count} مشاريع / {count} مشروعًا / {count} مشروع | Full Arabic plural set, Western digits, as `megaMenu.count`. |
| `workIndex.emptyTitle` / `emptyBody` | لا مشروع نعرضه هنا بعد. / لا ننشر إلا عملًا نملك حقائقه، لذلك تكبر هذه الصفحة مشروعًا بعد مشروع. أزل أحد عوامل التصفية، أو تعرّف على ما نقدّمه في هذا المجال. | The empty state explains the honesty rule and gives a direction. |
| `workIndex.showAll` / `exploreServices` | اعرض كل الأعمال / تصفّح خدماتنا | Imperatives that name the result. |
| `workCase.factsLabel`, `client`, `market`, `services`, `onThisPage` | أبرز المعلومات · العميل · السوق · الخدمات · في هذه الصفحة | «أبرز المعلومات» rather than a calque of "key facts". |
| `workCase.scopeTitle` / `scopeIntro` | الخدمات التي قام عليها المشروع / لكل خدمة قسمها الخاص، وفيه ما نقدّمه. | «قام عليها» is the natural verb for what a project rests on. |
| `workCase.next` | المشروع التالي | — |
| `workCase.ctaTitle` / `ctaBody` | تخطّط لمشروع كهذا؟ / ابدأ بالخدمات التي قام عليها هذا المشروع. في كل صفحة ما نقدّمه، وطريقة التواصل معنا. | A question the reader answers with yes; no promise of a reply time beyond D91. |
| `workCase.ctaQuote` / `ctaCategory` | اطلب عرض سعر / تصفّح {category} | Matches `cta.primary`. |
| `work.ts` story facts (3 cases) | دورنا · المنصّة · المعارض · المناسبات; الشريك الرقمي والإعلامي المعتمد; الموقع والتطبيق متاحان للجمهور; تصميم الجناح وبناؤه وعلاقاته العامة; معرض دبي للطيران · سوق السفر العربي; تنفيذ الفعاليات والمحتوى والهدايا; البطولات وليالي التكريم | From case-studies.md, no names. |
| `work.ts` execution leads | نتولّى حضور الاتحاد على الإنترنت كاملًا: المنصّة التي ينشر عليها، والقنوات التي يخاطب بها جمهوره، كل يوم وباللغتين. · من أول رسم حتى أرض المعرض: صمّمنا الجناح، وبنيناه، وأدرنا علاقاته العامة طوال أيام الحدث. · أيام الدوري الكبرى في يد فريق واحد، من هوية البطولة حتى العلب التي تصل فيها الجوائز. | Each lead opens on the outcome, then the span of the work. |
| `work.ts` execution points (15) | e.g. «إعادة بناء كاملة للموقع بلغتين، بنظام لإدارة المحتوى وتطبيق جوّال متصل به» · «العلاقات العامة في أرض الحدث» · «الإنتاج في أرض الحدث، ومنه مراسم ما قبل المباراة» | Profile p5, p13, p16–19, p23–24; verbal nouns kept short. |
| `work.ts` result (sports federation) | الموقع والتطبيق متاحان للجمهور اليوم. وعلى المنصّات، حققت إحدى حملات البطولات في أسبوعها الأول: 487 ألف مشاهدة · ‎+37.6 ألف متابع جديد · 271 ألف وصول للحملة. / حملة بطولة واحدة، في أسبوعها الأول فقط. | The figures never appear without their scope (D67). |

## About (batch 3, F2: new lines)

| Key | Line | Note |
|---|---|---|
| `aboutPage.title` | أفكار تُبنى حيث تلتقي العلامة بجمهورها. | The profile's p3 thesis, said as one clean sentence. |
| `aboutPage.story1` | NO TIME بيت للفعاليات والتسويق والعلاقات العامة، مقرّه دبي، ويعمل لعملاء في أسواق محلية وإقليمية وعالمية. | p3 verbatim in meaning; «بيت» keeps the house idea from D95. |
| `aboutPage.story2` | نبدأ من النقطة التي تلتقي فيها العلامة بجمهورها، ثم نمضي بالفكرة حتى آخرها: الاستراتيجية والإبداع والإنتاج والتنفيذ، بفريق واحد. | «بفريق واحد» replaces the calque «تحت سقف واحد» (D95). |
| `aboutPage.story3` | ولهذا يتّسع عملنا لكل هذا: جناح لشركة طيران في معرض دبي للطيران، ومجلس تراثي يستقبل الضيوف، وليالي تكريم لدوري كرة قدم، وتطبيق بلغتين لاتحاد رياضي وطني. | Real, anonymous examples (work.ts, profile p31–32). |
| `aboutPage.story4` | ومع اسمنا عبارة نلتزم بها: حان وقت البداية. | Echoes the approved hero anchor «حان وقت / البداية.». |
| `aboutPage.seeWork` | شاهد أعمالنا | — |
| `aboutPage.principlesEyebrow` / `principlesTitle` | كيف نعمل / ما لا يتغيّر في أي مشروع. | Unnumbered principles; the title says why there are four. |
| `aboutPage.metaTitle` / `metaDescription` | من نحن / NO TIME بيت للفعاليات والتسويق والعلاقات العامة والإنتاج، مقرّه دبي. فريق واحد يحمل كل فكرة عبر الاستراتيجية والإبداع والإنتاج حتى التنفيذ، في ستة أسواق. | Only the profile's facts (Dubai, six markets). |
| `principles.ts` one-roof title | تحت سقف واحد → بيت واحد | The old title was the calque D95 removed from the hero; «بيت واحد» matches the menu heading «بيت واحد. خمسة مجالات.». The line beneath already says «فريق واحد». |

## Product pages (batch 3, F4: new lines)

| Key | Line | Note |
|---|---|---|
| `productPage.hookMinuteZero` | الدقيقة الأولى عند الباب تحدّد إيقاع الأمسية كلها. | Plays on the name «الدقيقة صفر» without a pun that needs explaining. |
| `productPage.hookPeakHour` | صُمّم للساعة التي تمتلئ فيها الطاولات ولا يحتمل المطبخ فيها الانتظار. | The name's moment, from the floor and the kitchen. |
| `productPage.problemTitle` / `featuresTitle` | المشكلة / ماذا يقدّم | «ماذا يقدّم» reads naturally for a product; «الميزات» stays on the Software page. |
| `productPage.screensNote` | شاشات تصوّرية ببيانات توضيحية. المنتج قيد التطوير، وقد تتغيّر بعض التفاصيل. | Honest status beside the "Preview" tag. |
| `productPage.registerTitle` / `registerBody` / `registerCta` | كن أول من يعرف حين يصبح {product} جاهزًا. / نطوّره من خبرتنا في الفعاليات والضيافة. اترك بياناتك، وسنكتب لك حين يصبح جاهزًا. / سجّل اهتمامك | No date, no scarcity. |
| `productPage.otherProduct` / `softwareLink` / `inDevelopment` | قيد التطوير أيضًا / تعرّف على خدماتنا البرمجية / قيد التطوير | — |
| `product-pages.ts` Minute Zero | القوائم الورقية والازدحام عند الباب يحوّلان الانطباع الأول إلى انتظار. · دعوات برمز QR — يصل كل ضيف رمزه الخاص مع الدعوة. · تسجيل الحضور عند الباب من الهاتف — يمسح فريق الاستقبال كل رمز بالهاتف. · متابعة الوصول لحظة بلحظة — من وصل ومن لم يصل بعد، لحظة بلحظة. · قائمة ضيوف واحدة — قائمة يمكن البحث فيها، فلا يتعطّل الطابور عند اسم. · بالعربية والإنجليزية — الدعوات والشاشات باللغتين. | Features follow the concept screens; drafts for the client (OQ #24). |
| `product-pages.ts` Peak Hour | حين يعمل فريق الصالة والمطبخ من أوراق متفرقة، تفلت الأمور في أكثر الساعات ازدحامًا. · إدارة الطاولات والطلبات — كل طاولة وطلبها على شاشة واحدة. · شاشة للمطبخ — تصل الطلبات إلى المطبخ بالتسلسل، وعلى كلٍّ منها حالته: قيد التحضير أو جاهز. · ملخص نهاية اليوم — عدد الضيوف والطلبات وساعة الذروة، جاهزة عند الإغلاق. · بالعربية والإنجليزية — لفريق الصالة وفريق المطبخ، بأيّ من اللغتين. | «الصالة» is the Gulf restaurant term for the floor. |

## Software page, products block (lead, step 3b)

| Key | Old | New | Why |
|---|---|---|---|
| `productsCopy.more` | (none) | تعرّف على ما سيقدّمه {product} | The link to the new product page; «تعرّف على» is the natural invitation, and «سيقدّمه» keeps the Coming soon status honest. |

## Contact page, forms and emails (lead, step 4)

All new, written natively from the idea (no old line). Keys in `contactPage.*` (messages), `formCopy.contact`, `formCopy.interest.type*` and `src/emails/copy.ts`.

| Key | Line | Note |
|---|---|---|
| `contactPage.title` | أخبرنا بما تخطّط له. | An invitation in the imperative, as Gulf business copy addresses the reader. |
| `contactPage.lead` | بضعة أسطر تكفي للبداية: المناسبة والموعد وما تحتاجه. يتسلّم طلبك فريق واحد، ويرد عليك خلال يوم عمل. | Carries the approved promise «نرد خلال يوم عمل». |
| `contactPage.faq.*` | (five Q/A) | Process only, no figures; «نحدّد نطاق كل مشروع ونسعّره على حدة» is the approved line. |
| `category.quote.body` | أخبرنا بالموعد والمكان وما تحتاجه، ويتسلّم طلبك فريق واحد يرد عليك خلال يوم عمل. | Replaces the "form is on its way" interim line. |
| `category.quote.brief` / `formCopy.contact.submit` | أرسل طلبك | «طلب» rather than «ملخّص» or «بريف»: what a Gulf client calls it. |
| `formCopy.contact.messageHint` | المناسبة أو الهدف، والجمهور، وما تقرّر حتى الآن. تكفي بضعة أسطر. | Lowers the bar to write. |
| `autoReplyCopy.*` | (four bodies) | Only the approved promises (one working day; 3 working days, 5 improvements). |

## D103 follow-up: related work note (leak-scan false positive)

- Old: «نعرضها دون اسم العميل حتى يوافق على ذكره.»
- New: «نعرضها دون ذكر العميل حتى يوافق على تسميته.»
- Why: the old line contains «اسم العميل», the review build's placeholder label, so the production leak scan flagged it. Same meaning.

## M3 gate fixes (D105)

- reel.open: «شاهد العرض» → «شاهد الصور» (it opens photos, not a video).
- process plan: «نبدأ بالمهمة…» → «نبدأ من طلبك…» (stiff for "brief").
- "Google & Meta" in the paid-media description and the Marketing FAQ: the Arabic و glued to a Latin word rendered as "Metaو"; now «Google و Meta» with a space.
- The two service titles: «التسويق الرقمي وSEO» → «التسويق الرقمي وتحسين الظهور في محركات البحث (SEO)»; «الإعلانات المدفوعة وتخطيط الإعلام (Google وMeta)» → «… (إعلانات Google و Meta)». Approved by the user (2026-11-16, #29); services-list.md updated.

## Post-M3 Arabic pass (2026-11-16, D107)

«بيت» was a calque of "house": in Arabic it reads as a home, not a firm. A creative firm is «دار» (as in دار أزياء، دار نشر). The other fixes: «يحمل الفكرة» (calque of "carries the idea"), «دعنا» (calque of "let's"), «يتم» / «بشكل», literal English word order, and «تجربة» where it meant the guest's welcome or a pilot. «تجربة المستخدم» stays: it is the trade term for UX.

| Key | Old | New |
|---|---|---|
| `megaMenu.headingLead/Key` | بيت واحد. خمسة مجالات. | خمس حِرَف، يجمعها سقف واحد. |
| `categories.headingLead/Key` | خمسة مجالات، وفريق واحد يقف خلفها. | خمس حِرَف… يتقنها فريق واحد. |
| `categories.intro` | اطلب مجالًا واحدًا، أو سلّمنا المهمة كاملة. قد يحتاج إطلاق واحد إلى منصّة عرض وفيلم وحملة وعلبة هدايا، وهنا يخطّط لها الفريق نفسه. | اطلب حرفة واحدة، أو اترك لنا المشروع كله. قد يحتاج إطلاقٌ واحد إلى منصّة وفيلم وحملة وعلبة هدايا، وعندنا يخطّط للأربعة فريقٌ واحد. |
| `hero.lead` | …يخطّط لها بيت واحد ويبنيها ويُطلقها. | …يخطّط لها فريق واحد وينفّذها حتى يوم الإطلاق. |
| `meta.description` | بيت إبداعي في دبي… فريق واحد يحمل الفكرة من أول رسمة حتى يوم ظهورها… | دار إبداعية في دبي… فريق واحد يرافق الفكرة من أول رسمة حتى يوم إطلاقها… |
| `about.statement` | بيت إبداعي للفعاليات والعلامات التجارية، ولكل فكرة تولد بينهما. فريق واحد يخطّط لها ويبنيها ويطبعها ويُطلقها. | دار إبداعية للفعاليات والعلامات التجارية، وللأفكار التي تجمع بينهما. فريق واحد يخطّط لها، ويبنيها، ويطبعها، ويُطلقها. |
| `about.body` (last sentence) | تبدأ كل فكرة حيث تلتقي العلامة بجمهورها، ثم يحملها فريق واحد عبر الاستراتيجية والإبداع والإنتاج حتى التسليم. | تبدأ كل فكرة من النقطة التي تلتقي فيها العلامة بجمهورها، ثم يتابعها فريق واحد من الاستراتيجية إلى الإبداع والإنتاج، حتى التسليم. |
| `digital.capabilities.systems.body` | …تُبنى على طريقة عملك. | …مفصّلة على طريقة عملك. |
| `process.headingKey` | وفريق واحد في كل منها. | وفريق واحد من أولها إلى آخرها. |
| `process.steps.build.body` | يأخذ التصميم والديكور والمحتوى والمنصّات التي خلفها شكلها، ونراجعها معك في كل مرحلة. | نُعدّ التصميم والديكور والمحتوى والمنصّات التي تخدمها، ونراجع معك كل مرحلة. |
| `process.steps.produce.body` | تصنيع وطباعة وضيافة وطواقم عمل، تلتقي كلها في أرض الحدث تحت إدارة فريق واحد. | في أرض الحدث يجتمع التصنيع والطباعة والضيافة وطواقم العمل، ويديرها فريق واحد. |
| `markets.headingKey` | وبيتنا في دبي. | ومقرّنا دبي. |
| `cta.headingKey` | دعنا نخطط لكل ثانية منه. | لنخطّط لكل ثانية فيه. |
| `cta.secondary`, `whatsapp.label`, `category.quote.whatsapp` | تحدّث إلينا / معنا عبر واتساب | راسلنا على واتساب (one label everywhere, as on Contact) |
| `aboutPage.metaDescription` | NO TIME بيت… مقرّه دبي. فريق واحد يحمل كل فكرة عبر الاستراتيجية… | NO TIME دار… مقرّها دبي. فريق واحد يتابع كل فكرة من الاستراتيجية إلى الإبداع… |
| `aboutPage.story1` | NO TIME بيت للفعاليات… مقرّه دبي، ويعمل… | NO TIME دار للفعاليات… مقرّها دبي، وتعمل… |
| `contactPage.faq.a3` | فريق واحد يحمل الفكرة… | فريق واحد يتابع الفكرة… |
| `contactPage.metaDescription` | …ويتسلّمه فريق واحد يرد عليك… | …ويتولّى طلبك فريق واحد يردّ عليك… |
| `notFound.body` | أو كُتب العنوان بشكل خاطئ. | أو في العنوان خطأ. |
| `styleguide.colour.headingKey` | وبيت واحد دافئ. | ودفءٌ واحد يجمعها. |
| `styleguide` type lead | …يحمل الفكرةَ فريقٌ واحد… | …يتولّى العمل فريق واحد… |
| principles `one-roof` title / line | بيت واحد · …وتجربة الضيف… | تحت سقف واحد · …واستقبال الضيوف… |
| Events intro, FAQ (categories.ts) | فريق واحد يحمل مناسبتك… حتى تجربة الضيف يوم الحدث · …وتجربة الضيف كلها عند فريق واحد | فريق واحد يرافق مناسبتك… حتى استقبال الضيوف يوم الحدث · …واستقبال الضيوف كلها عند فريق واحد |
| Marketing summary | هوية وتواصل اجتماعي وبحث وعلاقات عامة، تُبقي الحديث قائمًا بعد انتهاء الفعالية. | هوية، وتواصل اجتماعي، وظهور في البحث، وعلاقات عامة، تُبقي الحديث عنك قائمًا بعد الفعالية. |
| Print intro | …ومنتجات بهوية العلامة، تُنتَج بمعايير علامتك. | …ومنتجات تحمل هوية علامتك وتلتزم بمعاييرها. |
| Software summary | …وتبقى تعمل بعد الإطلاق بزمن طويل. | …وتبقى تعمل طويلًا بعد الإطلاق. |
| E-commerce outcome (software/page.ts) | متجر يتم فيه الشراء بخطوات قليلة وواضحة، وتسهل فيه متابعة الطلبات. | متجر يُتمّ فيه العميل شراءه بخطوات قليلة وواضحة، ويتابع طلبه بسهولة. |
| Launches point and body (services.ts) | تجارب التقنية والروبوتات | عروض تفاعلية بالتقنية والروبوتات |
| UI/UX point | نماذج تفاعلية للتجربة | نماذج أولية قابلة للنقر |
| AI consulting point | خطة لتجربة أولى | خطة لمشروع تجريبي أول |

**Kept, to confirm:** «الحلول الرقمية» in the nav and in the approved category title «البرمجيات والحلول الرقمية». It is the term Gulf clients search for, and the title is on the approved list (D56). decisions-to-confirm #30.
