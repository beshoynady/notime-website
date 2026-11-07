# Homepage copy deck (EN / AR)

Status: **for review at Checkpoint 4.** Live in `src/messages/{en,ar}.json`, guarded by `src/messages/messages.test.ts`:

- same keys in both languages;
- no Latin words in the Arabic outside the allow-list;
- Arabic punctuation;
- the banned phrases;
- every placeholder key tracked in `CONTENT_CHECKLIST.md`;
- the approved anchor lines kept verbatim.

## Sources and rules

- **Facts** come only from the 2026 profile (`profile-copy.md`) and the brief. Nothing else is claimed.
  - **No figures** beyond **6 markets** and **360° integrated**.
  - **Not used:**
    - the profile's "49+ talent network";
    - client names (until OQ #17);
    - press coverage (OQ #19).
  - **Allowed but not used on the homepage:** the Oregon 26 figures (they belong to that project's page).
- **Voice:** calm, exact, confident. Short declarative sentences. Concrete nouns (stands, majlis, dashboards) over adjectives. The time motif from the hero ("Every second is planned.") returns once, in the closing CTA.
- **Banned** (tested): `elevate`, `cutting-edge`, `one-stop`, `unleash`, `الارتقاء بعلامتك`, `متطور جدًا`, `حلول متكاملة شاملة`.
- **Digits:** Western digits everywhere (UI and data). No editorial line on the homepage uses Arabic-Indic digits.
- **Arabic:** written natively, in Modern Standard Arabic, with a light Gulf-friendly register: «في بالك» and «نمضي بها» are used where a fully formal phrase would sound stiff. Every Arabic line has a note below.
- **Placeholders** in messages start with `TODO:`. ICU message syntax reserves `{` `}`, so a literal `{{TODO}}` would throw when next-intl formats it. Docs keep `{{TODO}}`.
- **Headings** use the established lead/key split: the key half is the bold champagne word, as in the hero and the mega menu.

---

## About (`about.*`)

| Key | EN | AR | Why this AR phrasing |
|---|---|---|---|
| eyebrow | About NO TIME | عن NO TIME | «عن» plus the Latin brand name is how Gulf agencies label this section. «من نحن» stays the nav label |
| statement | A creative house for events, brands and the ideas in between. One team plans it, builds it, prints it and launches it. | بيت إبداعي للفعاليات والعلامات التجارية، ولكل فكرة تقع بينهما. فريق واحد يخطط لها، ويبنيها، ويطبعها، ويطلقها. | Reference line (approved prototype), lightly refined. «ولكل فكرة تقع بينهما» reads more naturally than «وكل فكرة بينهما». The verbs take the object pronoun («يخطط لها، ويبنيها…»), as the EN "it" does; bare verbs sounded unfinished in Arabic. The comma-and-«و» rhythm keeps the four beats for the scroll colouring |
| body | Based in Dubai, we deliver events, marketing and PR for clients across local, regional and global markets. We build each idea where the brand meets its audience, then carry it all the way through: strategy, creative, production and delivery, under one roof. | من دبي، نقدّم الفعاليات والتسويق والعلاقات العامة لعملاء في أسواق محلية وإقليمية وعالمية. نبني كل فكرة عند النقطة التي تلتقي فيها العلامة بجمهورها، ثم نمضي بها حتى النهاية: الاستراتيجية، والإبداع، والإنتاج، والتسليم، تحت سقف واحد. | From the profile's About text (p3), first person. «من دبي» opens with the place, as Arabic prefers, instead of «مقرها دبي». «نمضي بها حتى النهاية» carries "carry it all the way through" without the literal «نحملها». «تحت سقف واحد» matches the hero lead |
| stats.markets.value / label | 6 / Markets | 6 / أسواق | Profile figure. Western digit (rule). «أسواق», plural of paucity, is correct after 3–10 |
| stats.integrated.value / label | 360° / Integrated | 360° / دورة عمل كاملة | Profile figure. «متكاملة» alone drifts toward the banned «حلول متكاملة شاملة» cliché. «دورة عمل كاملة» ("a full cycle of work") says what 360° means here |

## Categories (`categories.*`)

Category titles and summaries come from `src/content/categories.ts` (unchanged; see `services-reconciliation.md`).

| Key | EN | AR | Why this AR phrasing |
|---|---|---|---|
| eyebrow | What we do | ما نقدّمه | «ما نقدّمه» ("what we offer") is the natural Arabic section label. «ماذا نفعل» sounds like a question |
| headingLead / headingKey | Five crafts, / one team behind them. | خمس حِرَف، / وفريق واحد خلفها. | Echoes the mega menu's «خمس حِرَف». «خلفها» keeps the image of a team standing behind the work |
| intro | Each craft stands on its own. Together they carry an event or a brand from the first idea to the last detail. | كل حرفة قائمة بذاتها، ومعًا تحمل الفعالية أو العلامة من أول فكرة حتى آخر تفصيل. | One sentence with «ومعًا» flows better in Arabic than two short ones. «من أول… حتى آخر…» is an idiomatic pair |
| viewServices | View services | استعرض الخدمات | Imperative, as in the existing «استعرض الفئة» |
| allServices | See all services | كل الخدمات | Link label; the noun phrase is enough, as on Arabic sites |

## Our Work (`work.*`)

| Key | EN | AR | Why this AR phrasing |
|---|---|---|---|
| eyebrow | Our work | أعمالنا | Same as the nav label |
| headingLead / headingKey | Real projects, / start to finish. | مشاريع حقيقية، / من أولها إلى آخرها. | «من أولها إلى آخرها» is the idiom. «من البداية إلى النهاية» is correct but flat |
| intro | Each project is told the way it was built: the challenge, the idea, the execution and the result. | نروي كل مشروع كما بُني: التحدي، والفكرة، والتنفيذ، والنتيجة. | «نروي» (we narrate) fits a story structure. The four nouns are the same as the labels below |
| labels.challenge | Challenge | التحدي | Standard case-study term in Gulf agency decks |
| labels.idea | Idea | الفكرة | — |
| labels.execution | Execution | التنفيذ | — |
| labels.result | Result | النتيجة | Singular, like the EN |
| illustrativeNote | Images marked "Illustrative" are AI visuals. They stand in for project photos we can't show yet. | الصور التي تحمل وسم «صورة توضيحية» مُنتَجة بالذكاء الاصطناعي، وتحلّ مؤقتًا محل صور مشاريع لا يمكننا عرضها بعد. | Quotes the exact badge text «صورة توضيحية» (CLAUDE.md). «مؤقتًا» makes the stand-in nature explicit. Arabic guillemets, as elsewhere |
| viewProject | View project | استعرض المشروع | Same verb as other links |
| allWork | All work | كل الأعمال | — |
| todo.title | TODO: project title, pending client approval | TODO: عنوان المشروع، بانتظار موافقة العميل | Placeholder (OQ #17). Obvious in both languages |
| todo.summary | TODO: one-line project summary from docs/content/case-studies.md | TODO: سطر تعريفي بالمشروع من ملف دراسات الحالة | Placeholder. The AR avoids the Latin file path (allow-list rule) |

## Services marquee (`marquee.*`)

| Key | EN | AR | Why this AR phrasing |
|---|---|---|---|
| label | All our services | جميع خدماتنا | Accessible name of the marquee region. The service names come from `services.ts` |

## Beyond events: Digital solutions (`digital.*`)

| Key | EN | AR | Why this AR phrasing |
|---|---|---|---|
| eyebrow | Beyond events | ما بعد الفعاليات | Direct and idiomatic. «أبعد من الفعاليات» sounds like a comparison |
| headingLead / headingKey | Digital solutions, / built to keep working. | حلول رقمية، / تبقى تعمل بعد الإطلاق. | "Keep working" becomes «تبقى تعمل بعد الإطلاق», which states the idea concretely. A literal «مبنية لتستمر في العمل» is heavy |
| intro | End-to-end digital builds, from UX and design systems to development, content management and analytics, delivered bilingual and performance-ready. | نبني المنصّة الرقمية من أولها إلى آخرها: تجربة المستخدم وأنظمة التصميم، ثم البرمجة وإدارة المحتوى والتحليلات، بالعربية والإنجليزية، وبأداء سريع منذ اليوم الأول. | From the profile (p15). Arabic needs a verb, hence «نبني». "Bilingual" is named as the two languages. "Performance-ready" becomes «بأداء سريع منذ اليوم الأول»: concrete, no jargon |
| capabilities.websites | Websites — Bilingual sites with a content system your team can run. | المواقع الإلكترونية — مواقع بلغتين، بنظام لإدارة المحتوى يتولّاه فريقك بنفسه. | Avoids the Latin "CMS". «يتولّاه فريقك بنفسه» stresses independence, the point of a CMS |
| capabilities.apps | Mobile apps — iOS and Android, connected to your website. | تطبيقات الجوّال — لنظامَي iOS وAndroid، ومتصلة بموقعك. | Platform names stay Latin (added to the allow-list). «نظامَي» is dual, so it is grammatical |
| capabilities.systems | Internal systems — Dashboards, admin panels and integrations, built around how you work. | الأنظمة الداخلية — لوحات تحكم وأنظمة إدارة وربط بين الأنظمة، مبنية على طريقة عملك. | "Integrations" becomes «ربط بين الأنظمة», the term clients use. «على طريقة عملك» keeps the client-centred end |
| capabilities.ecommerce | E-commerce — Online stores, from the catalogue to the checkout. | المتاجر الإلكترونية — متاجر على الإنترنت، من عرض المنتجات حتى إتمام الشراء. | "Checkout" becomes «إتمام الشراء», the standard e-commerce UI term. E-commerce is in the brief (§7), though not in the profile (reconciliation §1) |
| productsEyebrow | Our products | منتجاتنا | — |
| productsIntro | Two products of our own, in development now. | منتجان من تطويرنا، نعمل عليهما الآن. | Dual «منتجان». «من تطويرنا» means "developed by us". Product names stay in `products.ts` (OQ #5) |
| registerInterest | Register interest | سجّل اهتمامك | Standard pre-launch CTA in Arabic |
| requestDemo | Request a demo | اطلب عرضًا تجريبيًا | «عرض تجريبي» is the common term. «عرضًا توضيحيًا» reads as a presentation |
| viewProduct | View product | تعرّف على المنتج | «تعرّف على» invites rather than commands, which suits a product that is not live yet |

## How we work (`process.*`)

The verbs are plan, build, produce and launch (plan requirement). The Arabic step titles are first-person verbs («نخطط»…), which reads as a promise. Nouns («التخطيط») would read as a manual.

| Key | EN | AR | Why this AR phrasing |
|---|---|---|---|
| eyebrow | How we work | طريقة عملنا | Natural section label |
| headingLead / headingKey | Four steps, / one team throughout. | أربع خطوات، / وفريق واحد في كلٍّ منها. | «في كلٍّ منها» ("in each of them") lands the continuity point. «طوال الوقت» is vague |
| steps.plan | Plan — We start with the brief, the audience and the date, then set the idea, the budget and the timeline. | نخطط — نبدأ من المهمة والجمهور والموعد، ثم نحدّد الفكرة والميزانية والجدول الزمني. | "Brief" becomes «المهمة», the clearest word. The Anglicism «البريف» is avoided. Budget is a planning item, not a price |
| steps.build | Build — Design, décor, content and the platforms behind them take shape, reviewed with you at every stage. | نبني — يتشكّل التصميم والديكور والمحتوى والمنصّات التي خلفها، ونراجعها معك في كل مرحلة. | Splits the participle into a second clause («ونراجعها معك»), which is the natural Arabic order |
| steps.produce | Produce — Fabrication, print, catering and crew come together on site, run by one team. | ننتج — التصنيع والطباعة والضيافة وفرق العمل، تجتمع في الموقع بإدارة فريق واحد. | "Catering" becomes «الضيافة», the broader Gulf term that covers the profile's catering and majlis service |
| steps.launch | Launch — The doors open, the campaign goes live, and we stay with you through to the final report. | نطلق — تُفتح الأبواب، وتنطلق الحملة، ونبقى معك حتى التقرير الأخير. | Three short clauses, the same rhythm as the EN. The final report reflects the profile's "Analytics & reporting" (p12) |

## Markets (`markets.*`)

The UAE comes first (the home base, as in the brief). The profile lists SA / UAE / EG / QA / OM / KU; the order otherwise follows it.

| Key | EN | AR | Why this AR phrasing |
|---|---|---|---|
| eyebrow | Where we work | أين نعمل | Short question-form label, common in Arabic |
| headingLead / headingKey | Six markets, / one base in Dubai. | ستة أسواق، / ومقرّنا دبي. | «ستة» (masculine) with «أسواق». «ومقرّنا دبي» is shorter and prouder than «ومقر واحد في دبي» |
| countries.ae | United Arab Emirates | الإمارات العربية المتحدة | Official short form |
| countries.sa | Saudi Arabia | المملكة العربية السعودية | Official name. «السعودية» alone is informal |
| countries.eg | Egypt | مصر | — |
| countries.qa | Qatar | قطر | — |
| countries.om | Oman | سلطنة عُمان | Official «سلطنة», with a damma on «عُمان» to avoid the reading «عَمّان» (Amman) |
| countries.kw | Kuwait | الكويت | — |

## Final CTA (`cta.*`)

| Key | EN | AR | Why this AR phrasing |
|---|---|---|---|
| headingLead / headingKey | Have a date in mind? / Let's plan every second of it. | في بالك موعد؟ / لنخطط لكل ثانية فيه. | Callback to the hero's «كل ثانية محسوبة». «في بالك موعد؟» is warm, Gulf-natural, and still readable across the region |
| body | Tell us what you're planning, and we'll come back to you with the next steps. | أخبرنا بما تخطط له، وسنعود إليك بالخطوات التالية. | No response-time promise (none is confirmed) |
| primary | Request a quote | اطلب عرض سعر | Identical to the header CTA (consistency). It requests a quote; it shows no pricing |
| secondary | Chat on WhatsApp | تحدّث معنا عبر واتساب | Same wording as the floating button's label |

## Footer (`footer.*`)

| Key | EN | AR | Why this AR phrasing |
|---|---|---|---|
| tagline | Events · Marketing · PR · Production | فعاليات · تسويق · علاقات عامة · إنتاج | The profile's cover line (p1), as nouns without articles, like the EN |
| columns.services | Services | الخدمات | Nav term |
| columns.company | Company | الشركة | — |
| columns.contact | Contact | تواصل معنا | Same as the nav |
| columns.follow | Follow us | تابعنا | — |
| address | Dubai, United Arab Emirates | دبي، الإمارات العربية المتحدة | Profile: "based in Dubai". The street address is pending (checklist #7) |
| legal.privacy | Privacy Policy | سياسة الخصوصية | Standard |
| legal.terms | Terms of Use | شروط الاستخدام | Standard |
| legal.cookies | Cookie Policy | سياسة ملفات تعريف الارتباط | Full standard term. «الكوكيز» is informal |
| licence | TODO: trade licence number · legal entity · issuing authority | TODO: رقم الرخصة التجارية · الكيان القانوني · جهة الإصدار | Placeholder (checklist #8) |
| backToTop | Back to top | العودة إلى الأعلى | Same pattern as «العودة إلى الرئيسية» |

The existing `footer.rights` and `footer.stub` stay. The stub goes when the full footer is built.

---

## Left out on purpose

- **No proof strip** (client logos, "trusted by"): permission is pending (OQ #17), and the brief forbids fakes.
- **No numbers** beyond 6 and 360°. "Years of experience", project counts and team size are not in the profile.
- **No live-work claim** in the Digital section ("the UAEAF site is live"), even though the profile states it. It names a client (OQ #17); it moves into the section once approved.
- **No talent, no pricing, no comparison.**
