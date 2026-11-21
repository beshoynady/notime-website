# Batch 2 · Software & Digital: judgment calls and the Arabic log

Branch `worktree-agent-a0db117a116600633`, built on `phase-2-services` 4593f13. One line per call, each with a recommendation. The lead moves the confirmed ones into DECISIONS.md and decisions-to-confirm.md, and the Arabic log into docs/content/copy-ar-rewrite.md.

## Judgment calls (recommendation: confirm all unless noted)

1. **Own page, not the shared template.** Software renders `SoftwarePage` (an early return in `CategoryView`; the lab keeps the template), because the brief's 14 sections don't fit the template's opening and index. Confirm.
2. **The H1 is the outcome headline** ("Websites and apps your clients actually use, in Arabic and English."); "Software & Digital" sits in the eyebrow and the breadcrumb. The brief's outcome-first headline wins over the storyboard's category H1. Confirm.
3. **Its own SEO title and description** ("Website and App Development in Dubai | NO TIME"), set only for this slug in the category route's `generateMetadata`. Confirm.
4. **The opening pins on desktop only** (2.0 viewport heights); on mobile it plays unpinned as the stage crosses (the D74 precedent), so the H1 and both CTAs fit at 390. Confirm.
5. **Event technology is a featured band after the six services**, not a seventh service (D65 keeps six); it prefills `build=event-tech` and links to Events & Hospitality. Confirm.
6. **Deliverables reveal on hover, focus-within, or as the block crosses the viewport's middle** (desktop with a pointer only), so visitors who never hover still see them. Always visible on touch, below 900 px and under reduced motion, as the 2026-11-11 spec asks. Confirm.
7. **The problem section is drawn as a diff** (− the problem, + what we do), the Interface theme's own vernacular. Confirm.
8. **The FAQ swaps two questions:** "Can you connect…" and "Do you build technology for events?" become "How much does a website or an app cost?" and "Will we be able to update the site ourselves?" (the brief's objections; integrations and event tech have their own blocks). Still 7, FAQPage schema unchanged. Confirm.
9. **The website review form has its own section** (`#website-review`) right after `#consult`. The three entry points (after the proof strip, in the final CTA, in the sticky bar) all land there. Confirm.
10. **Prefill clicks don't rewrite the URL** (that would make AnchorScroll re-land); they push to a small client store and scroll to `#consult`. The URL alone (`?build=apps&tier=grow#consult`) still prefills on load. Confirm.
11. **Proof screenshots:** the homepage in the laptop and Creative Production at 390 px in the phone, with an EN/AR toggle. Captured from this site; registered as real slots `notime-website-{home,category}-{en,ar}`. Retake them at M2 after the final copy lands. Confirm.
12. **The Lighthouse line stays off** (`SOFTWARE_FLAGS.lighthouseProof = false`); it shows only when every score is 90 or more on a production measurement. Confirm.
13. Withdrawn (D121).
14. **Label-only eyebrows removed** per the hook standard; they stay only where they carry information (Case study, Our products · Coming soon, Event technology). Confirm.
15. **The sticky mobile bar** shows after the opening, hides over `#consult` and `#website-review` and while a text field has focus, and hides the WhatsApp button while it shows (WhatsApp is unconfigured anyway, D78). Confirm.
16. **Tooling (no decision):** in a worktree with a junctioned node_modules, Turbopack needs `turbopack.root` set to the main checkout (a local, uncommitted edit). `--webpack` is not an alternative: Tailwind runs only through the Turbopack loader, so webpack serves the page unstyled.

## Found outside my area (shared code, not changed)

- **`components/layout/custom-cursor.tsx` adds 37 px of horizontal scroll in Arabic** once the mouse moves (its dot is `start-0`, so in RTL it starts at the right edge and is then translated by the pointer's x). Seen on this page at 1440 and 390 in AR; reduced motion hides it. Fix: position it with `left-0` on purpose (pointer coordinates are physical) or `inset-inline-start` with a mirrored x. Lead to apply.
- **Dev-only console errors on every category page** (not new): "Next.js encountered URL data during prerendering" from `resolve()` in the category route, and a hydration attribute mismatch above the page. Both also appear on /services/creative-production.

## Proposed contract change (D92, lead to decide)

- **`interestSchema`: add an optional `type`** (event or restaurant) so the interest form can ask what the storyboard asks. Until then the visitor writes it in the message field. Recommendation: add it at step 5.

## Skills used, and what each changed

- **copywriting:** the outcome H1, a hook line per section, the specifics from profile-copy.md and case-studies.md, no claim without a source.
- **marketing-psychology:** risk reversal in the final CTA (no obligation, one working day), the free review as a reciprocity offer, three engagement levels with no prices.
- **cro:** one primary CTA (the intro call) repeated at each decision point, the review as the only secondary one, a sticky mobile bar, the form's project questions before the personal ones.
- **frontend-design:** the Interface theme's signature (visible state labels, DEFAULT → ACTIVE), the diff for PAS, the code-drawn devices.
- **ui-ux-pro-max:** 44 px targets, the error summary that takes focus, visible labels, no hover-only content.
- **design:ux-copy:** the per-code error messages, the failure states with the email fallback, the button labels that name the outcome ("Send my site for review").
- **framer-motion-animator:** the proof toggle's crossfade and light, the interest disclosure, the hover sweep; reduced motion moves nothing.
- **gsap-framer-scroll-animation:** the opening pin and scrub, the stroke draws, the process rail that fills from inline-start (mirrored in RTL), the event counter.
- **nextjs-seo:** the title and description for the five search intents, H2s that carry them, Service, FAQPage and BreadcrumbList JSON-LD, internal links to Events and Work.

## Software: the Arabic log (EN idea → AR line)

Every Arabic line on the page and in the three forms is new, written from the idea in MSA for Gulf business readers, with Western digits. The notes column is left to the reviewer; lines worth a second look:

- `hero.title`: «يستخدمها عملاؤك فعلًا» keeps the English's "actually" as a plain fact, not a boast.
- `cta.discussFor`: «ناقش هذه الخدمة معنا: {service}» keeps the visible text inside the accessible name (WCAG 2.5.3).
- `tiers.cta`: «ناقش معنا مستوى {tier}» because the tier names stay in English (Launch, Grow, Platform).
- `forms.formCopy.states.*`: each failure gives the email address, never a dead end.
- FAQ (categories.ts): «كم تكلفة الموقع أو التطبيق؟» / «تعتمد على حجم المشروع، لذلك لا ننشر أسعارًا. بعد مكالمة التعارف نرسل لك عرضًا بالنطاق والمراحل والتكلفة، ولا يبدأ العمل إلا بعد موافقتك.» and «هل سنتمكّن من تحديث الموقع بأنفسنا؟» / «نعم. نجهّز نظامًا لإدارة المحتوى باللغتين، ونعرّف فريقك على استخدامه عند التسليم.»

| Key | EN idea | AR line |
|---|---|---|
| `caseStudy.eyebrow` | Case study | دراسة حالة |
| `caseStudy.parts.challenge.label` | Challenge | التحدي |
| `caseStudy.parts.approach.label` | Approach | النهج |
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
| `eventTech.items.2.body` | Championships, results and live coverage, on screen as they happen. | بطولات ونتائج وتغطية مباشرة، تظهر على الشاشات لحظة حدوثها. |
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
| `proof.title` | Live today: the site you're reading. | يعمل اليوم: الموقع الذي تقرؤه الآن. |
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
