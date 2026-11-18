# Copy lines waiting on Rand or the owner

2026-11-18 · branch `copy-rewrite`. The copy rewrite (`docs/review/copy-rewrite/*.json`) is applied except these lines: each one states a fact or a promise nobody has confirmed yet, so it **keeps its current text in both languages** until the answer comes. When Rand answers a question in `docs/review/rand-questions.md`, apply (or drop) the rows that name it, then re-run `scripts/copy-inventory.mjs --dump` to check.

## Count

- **47 lines** wait on Rand (every proposal whose `facts` carries ⚑): 46 existing strings kept as they are, 1 new key not added (`workIndex.closing.body` already exists from the audit fixes, with the same text as the proposal, so nothing is hidden).
- **By fact:** FC#23 12 · FC#1 9 · FC#22 3 · FC#8 2 · R3 2 · FC#14 2 · FC#15 2 · FC#16 2 · FC#17 2 · FC#4 2 · FC#10 1 · FC#9 1 · FC#7 1 · FC#5 1 · FC#6 1 · R9 1 · R4 1 · R5 1 · FC#11 1 · FC#12 1 · FC#13 1.
- **By Rand's question:** Q1 12 · Q2 9 · Q4 2 · Q5 1 · Q6 2 · Q7 2 · Q8 1 · Q9 1 · Q10 2 · Q11 1 · Q12 2 · Q13 1 · Q14 2 · Q15 7 · Q16 3.
- **4 owner items** at the end (not ⚑ rows; the owner decides them).

Columns: **Current** is what ships now (EN, then AR). **Proposed** is the rewrite's line; "(keep)" means that language wouldn't change. **Waits on** is the `facts` cell; **Q** is the question in `rand-questions.md` that answers it.

## About

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `m:aboutPage.metaDescription` | NO TIME is a Dubai house for events, marketing, PR and production. One team carries each idea through strategy, creative, production and delivery, across six markets. | NO TIME دار للفعاليات والتسويق والعلاقات العامة والإنتاج، مقرّها دبي. فريق واحد يتابع كل فكرة من الاستراتيجية إلى الإبداع والإنتاج حتى التنفيذ، في ستة أسواق. | An events, marketing, PR and production house based in Dubai, working across six markets from Saudi Arabia to Egypt. | دار للفعاليات والتسويق والعلاقات العامة والإنتاج، مقرّها دبي، وتعمل في ستة أسواق من السعودية إلى مصر. | p3. ⚑ FC#1 | Q2 |
| `c:principles:principles[six-markets].line` | Based in Dubai, working across the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. | مقرّنا في دبي، ونعمل في الإمارات والسعودية وقطر وعُمان والكويت ومصر. | (keep) | (keep) | ⚑ FC#1 | Q2 |

## Category template

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `m:category.quote.body` | Tell us the date, the place and what you need. One team picks it up and replies within one working day. | أخبرنا بالموعد والمكان وما تحتاجه، ويتسلّم طلبك فريق واحد يرد عليك خلال يوم عمل. | Tell us the date, the place and what you need. We'll reply within one working day. | أخبرونا بالموعد والمكان وما تحتاجون إليه، ونرد عليكم خلال يوم عمل. | ⚑ FC#23 (one working day, site-wide) | Q1 |

## Contact and forms

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `m:contactPage.metaDescription` | Tell us about your event, campaign, production or platform. One team picks it up and replies within one working day. | حدّثنا عن فعاليتك أو حملتك أو إنتاجك أو منصّتك، ويتولّى طلبك فريق واحد يردّ عليك خلال يوم عمل. | Tell us about your event, film, campaign or website. A few lines are enough, and we reply within one working day. | حدّثونا عن فعاليتكم أو فيلمكم أو حملتكم أو موقعكم. تكفي بضعة أسطر، ونرد عليكم خلال يوم عمل. | ⚑ FC#23 | Q1 |
| `m:contactPage.lead` | A few lines are enough to start: the occasion, the date and what you need. One team picks it up and replies within one working day. | بضعة أسطر تكفي للبداية: المناسبة والموعد وما تحتاجه. يتسلّم طلبك فريق واحد، ويرد عليك خلال يوم عمل. | A few lines are enough: the occasion, the date and what you need. We reply within one working day, with our questions or a time to talk. | تكفي بضعة أسطر: المناسبة والموعد وما تحتاجون إليه. نرد عليكم خلال يوم عمل، بأسئلتنا أو بموعد نتحدّث فيه. | ⚑ FC#23 | Q1 |
| `m:contactPage.faq.a1` | Yes. We're based in Dubai and work across the markets on our About page. Put the city in your brief and we'll plan around it. | نعم. مقرّنا في دبي، ونعمل في الأسواق المذكورة في صفحة «من نحن». اذكر المدينة في طلبك، ونخطّط على أساسها. | Yes. We're based in Dubai and work across the markets on our About page. Put the city in your request and we'll plan around it. | نعم. مقرّنا في دبي، ونعمل في الأسواق المذكورة في صفحة «من نحن». اذكروا المدينة في طلبكم، ونخطّط على أساسها. | ⚑ FC#1 | Q2 |
| `m:contactPage.faq.a2` | We reply within one working day. Put your date in the brief, and we'll tell you honestly what can be done by then. | نرد خلال يوم عمل. اذكر موعدك في الطلب، وسنخبرك بصراحة بما يمكن إنجازه قبله. | We reply within one working day. Put your date in the request, and we'll tell you honestly what can be done by then. | نرد عليكم خلال يوم عمل. اذكروا موعدكم في الطلب، وسنخبركم بصراحة بما يمكن إنجازه قبله. | ⚑ FC#23 | Q1 |
| `c:form-copy:formCopy.consultation.micro` | No obligation. We reply within one working day. | دون أي التزام. نرد خلال يوم عمل. | A free 30-minute call, with no obligation. We reply within one working day. | مكالمة مجانية مدتها 30 دقيقة، دون أي التزام. نرد عليكم خلال يوم عمل. | R1 confirmed by the owner (2026-11-17); ⚑ FC#23 | Q1 |
| `c:form-copy:formCopy.consultation.successBody` | We reply within one working day to set a time for the call. | نرد خلال يوم عمل لنحدّد موعد المكالمة. | (keep) | نرد عليكم خلال يوم عمل لنحدّد موعد المكالمة. | ⚑ FC#23 | Q1 |
| `c:form-copy:formCopy.contact.micro` | We reply within one working day. | نرد خلال يوم عمل. | (keep) | (keep) | ⚑ FC#23 | Q1 |
| `c:form-copy:formCopy.contact.successBody` | We reply within one working day, with the questions we need answered or a time to talk. | نرد خلال يوم عمل، بما نحتاج إلى معرفته أو بموعد للحديث. | (keep) | نرد عليكم خلال يوم عمل، بما نحتاج إلى معرفته أو بموعد للحديث. | ⚑ FC#23 | Q1 |

## Creative Production

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `c:categories:categories[creative-production].faq[4].a` | Yes: cameras, lenses, lighting and audio. Tell us what you need and your dates, and we'll confirm availability. | نعم: الكاميرات والعدسات والإضاءة والصوت. أخبرنا بما تحتاجه وبالمواعيد، ونؤكّد لك التوفّر. | (keep) | نعم: الكاميرات والعدسات والإضاءة والصوت. أخبرونا بما تحتاجون إليه وبالمواعيد، ونؤكّد لكم التوفّر. | ⚑ FC#8 (owned or rented; with crew or without) | Q10 |
| `c:categories:categories[creative-production].faq[5].a` | Usage rights are agreed in each proposal, before the shoot starts. | نتّفق على حقوق الاستخدام في كل عرض، قبل بدء التصوير. | (keep) | (keep) | ⚑ FC#10 | Q11 |
| `c:categories:categories[creative-production].faq[7].a` | Tell us what you want to make, where it will be shown and when you need it. We'll come back with a treatment and a proposal. | أخبرنا بما تريد صنعه، وأين سيُعرض، ومتى تحتاجه، ونعود إليك بتصوّر وعرض. | (keep) | أخبرونا بما تريدون صنعه، وأين سيُعرض، ومتى تحتاجون إليه، ونعود إليكم بتصوّر وعرض. | ⚑ R3 (a treatment comes with every proposal) | Q7 |
| `c:services:services[photography].points[3]` | Portraits | البورتريه | (keep) | (keep) | ⚑ FC#9 (portraits) | Q15 |
| `c:services:services[set-stage-design].summary` | Sets and stages drawn, modelled and built for the camera and the room. | ديكورات ومسارح نرسمها ونجسّمها ونبنيها للكاميرا وللمكان. | (keep) | (keep) | ⚑ FC#7 (built in-house or with partners) | Q15 |
| `c:services:services[equipment-camera-rental].summary` | Cameras, lenses and lighting, ready for your production. | كاميرات وعدسات وإضاءة، جاهزة لإنتاجك. | (keep) | كاميرات وعدسات وإضاءة، جاهزة لإنتاجكم. | ⚑ FC#8 | Q10 |

## Events & Hospitality

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `c:categories:categories[events-hospitality].faq[3].a` | We're based in Dubai and work across six markets: the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. For other locations, ask us. | مقرّنا في دبي، ونعمل في ستة أسواق: الإمارات والسعودية وقطر وعُمان والكويت ومصر. ولأي مكان آخر، اسألنا. | (keep) | مقرّنا في دبي، ونعمل في ستة أسواق: الإمارات والسعودية وقطر وعُمان والكويت ومصر. ولأي مكان آخر، اسألونا. | ⚑ FC#1 | Q2 |
| `c:categories:categories[events-hospitality].faq[4].a` | From intimate gatherings to award nights and large corporate and government events. Tell us your guest count and we'll plan around it. | من اللقاءات العائلية الخاصة إلى ليالي الجوائز والفعاليات الكبرى للشركات والجهات الحكومية. أخبرنا بعدد ضيوفك، ونخطّط على أساسه. | (keep) | من اللقاءات العائلية الخاصة إلى ليالي الجوائز والفعاليات الكبرى للشركات والجهات الحكومية. أخبرونا بعدد ضيوفكم، ونخطّط على أساسه. | ⚑ FC#5 | Q8 |
| `c:categories:categories[events-hospitality].faq[5].a` | It depends on the scale of the event. Share your date and we'll confirm availability. | يتوقّف ذلك على حجم المناسبة. أرسل لنا الموعد، ونؤكّد لك إن كان متاحًا. | (keep) → with Rand's numbers: "For a wedding, [placeholder: weeks] ahead is comfortable; for a conference, [placeholder: months]. Share your date and we'll tell you honestly." | يتوقّف ذلك على حجم المناسبة. أرسلوا لنا الموعد، ونؤكّد لكم إن كان متاحًا. | ⚑ FC#6: placeholders never ship | Q9 |
| `c:categories:categories[events-hospitality].faq[7].a` | Tell us the date, the type of event, the city and roughly how many guests. We'll come back with a concept and a proposal. | أخبرنا بالموعد ونوع المناسبة والمدينة والعدد التقريبي للضيوف، ونعود إليك بتصوّر وعرض. | (keep) | أخبرونا بالموعد ونوع المناسبة والمدينة والعدد التقريبي للضيوف، ونعود إليكم بتصوّر وعرض. | ⚑ R3 (a concept comes with every proposal) | Q7 |

## Global

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `m:meta.description` | A Dubai creative house for events, creative production, marketing and digital. One team takes an idea from the first sketch to the day it goes live, across six markets. | دار إبداعية في دبي للفعاليات والإنتاج الإبداعي والتسويق والحلول الرقمية. فريق واحد يرافق الفكرة من أول رسمة حتى يوم إطلاقها، في ستة أسواق. | Events, films, campaigns and websites, planned in Dubai and delivered across the region. Tell us the date and what you need. | فعاليات وأفلام وحملات ومواقع، نخطّط لها من دبي وننفّذها في المنطقة. أخبرونا بالموعد وما تحتاجون إليه. | p3 (Dubai, markets). ⚑ FC#1 (six markets) | Q2 |

## Home

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `m:about.body` | Our base is Dubai, and our work runs across six markets, from Saudi Arabia to Egypt: an airline's pavilion at the Dubai Airshow and a majlis dressed for a heritage welcome. Each idea starts where the brand meets its audience, and one team carries it through strategy, creative, production and delivery. | مقرّنا دبي، وعملنا يمتدّ في ستة أسواق من السعودية إلى مصر: جناح لشركة طيران في معرض دبي للطيران، ومجلس تراثي يستقبل الضيوف. تبدأ كل فكرة من النقطة التي تلتقي فيها العلامة بجمهورها، ثم يتابعها فريق واحد من الاستراتيجية إلى الإبداع والإنتاج، حتى التسليم. | We're based in Dubai and work in six markets, from Saudi Arabia to Egypt. Recent work: an airline's pavilion at the Dubai Airshow and a majlis dressed for a heritage welcome. | مقرّنا دبي، ونعمل في ستة أسواق من السعودية إلى مصر. من أعمالنا الأخيرة: جناح لشركة طيران في معرض دبي للطيران، ومجلس تراثي جُهّز لاستقبال الضيوف. | p3, case studies. ⚑ FC#1 (six markets); ⚑ R9 (the two projects are recent): if Rand doesn't confirm, "Some of our work:" / «من أعمالنا:» | Q2, Q5 |
| `m:about.stats.markets.label` | Markets | أسواق | (keep) | (keep) | ⚑ FC#1 | Q2 |
| `m:process.steps.build.body` | Design, décor, content and the platforms behind them take shape, reviewed with you at every stage. | نُعدّ التصميم والديكور والمحتوى والمنصّات التي تخدمها، ونراجع معك كل مرحلة. | (keep) | نُعدّ التصميم والديكور والمحتوى والمنصّات التي تخدمها، ونراجع معكم كل مرحلة. | ⚑ R4 (a review with the client at every stage) | Q6 |
| `m:process.steps.launch.body` | The doors open, the campaign goes live, and we stay with you through to the final report. | تُفتح الأبواب أو تنطلق الحملة، ونبقى إلى جانبك حتى التقرير الأخير. | (keep) | تُفتح الأبواب أو تنطلق الحملة، ونبقى إلى جانبكم حتى التقرير الأخير. | ⚑ R5 (every project ends with a report); else "…and we stay with you after it." / «ونبقى معكم بعدها.» | Q6 |
| `m:markets.headingLead` | Six markets, | ستة أسواق، | (keep) | (keep) | ⚑ FC#1 | Q2 |

## Legal

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `c:legal:legalDocs[privacy].sections[6].blocks[0].p` | We don't keep a database of form submissions on this website: a submission reaches us as an email. If an enquiry doesn't become a project, we delete it within 12 months of our last contact with you. If it does, we keep the records of our agreement for as long as the applicable law requires. | لا نحتفظ في هذا الموقع بقاعدة بيانات للنماذج المُرسلة، فكل نموذج يصلنا رسالةً بالبريد الإلكتروني. وإذا لم يتحوّل الاستفسار إلى مشروع، نحذفه خلال 12 شهرًا من آخر تواصل بيننا. وإذا تحوّل إلى مشروع، نحتفظ بسجلات الاتفاق للمدة التي يفرضها القانون المعمول به. | (keep) | (plural at apply) | ⚑ FC#22 (Rand reads the legal pages last): deletion within 12 months of the last contact | Q16 |
| `c:legal:legalDocs[terms].sections[8].blocks[0].p` | These terms are governed by the laws of the United Arab Emirates. {courts} have jurisdiction over any dispute arising from them. | تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة، وتختصّ {courts} بالنظر في أي نزاع ينشأ عنها. | (keep) | (keep) | ⚑ FC#22 (Rand reads the legal pages last) | Q16 |
| `c:legal:legalDocs[terms].sections[8].blocks[1].p` | If the Arabic and English versions of these terms differ, the {prevailingLanguage} version prevails. | إذا اختلفت النسختان العربية والإنجليزية من هذه الشروط، تُعتمد النسخة {prevailingLanguage}. | (keep) | (keep) | ⚑ FC#22 (Rand reads the legal pages last) | Q16 |

## /links

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `m:linksPage.eyebrow` | Dubai · six markets | دبي · ستة أسواق | (keep) | (keep) | ⚑ FC#1 | Q2 |
| `m:linksPage.quote.note` | We reply within one working day | نردّ عليك خلال يوم عمل واحد | (keep) | نردّ عليكم خلال يوم عمل واحد | ⚑ FC#23 | Q1 |

## Marketing & Brand

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `c:categories:categories[marketing-brand].faq[1].a` | Yes. We plan the channels, the budget and the timing, run the campaigns, and report on how they performed. | نعم. نخطّط للقنوات والميزانية والتوقيت، وندير الحملات، ونرفع تقارير عن أدائها. | (keep) | (keep) | ⚑ FC#14 (Google and Meta, in whose accounts) | Q12 |
| `c:services:services[branding-identity].points[1]` | Naming | ابتكار الاسم | (keep) | (keep) | ⚑ FC#11 (naming) | Q15 |
| `c:services:services[public-relations].summary` | Press, media relations and announcements, handled with care. | البيانات الصحفية والعلاقات الإعلامية والإعلانات الرسمية، من الصياغة حتى النشر. | Press releases, media relations and announcements, from the first draft to publication. | (keep) | ⚑ FC#12 (press releases, media relations) | Q15 |
| `c:services:services[public-relations].points[3]` | Media coverage after the event | التغطية الإعلامية بعد الحدث | (keep) | (keep) | ⚑ FC#13 (which media have published NO TIME's work) | Q13 |
| `c:services:services[paid-media-planning].summary` | Google and Meta campaigns, with the channels, budgets and timing behind them matched to the audience. | حملات على Google و Meta، نخطّط لقنواتها وميزانياتها وتوقيتها بما يناسب الجمهور. | (keep) | حملات على Google وMeta، نخطّط لقنواتها وميزانياتها وتوقيتها بما يناسب الجمهور. | ⚑ FC#14 | Q12 |

## Production, Print & Gifts

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `c:categories:categories[production-print-gifts].faq[1].a` | Yes. We design, fabricate and install exhibition stands, activations and branded spaces. | نعم. نصمّم أجنحة المعارض ومساحات التفعيل والمساحات بهوية العلامة، ونصنّعها ونركّبها. | (keep) | (keep) | ⚑ FC#15 (in-house or with a partner) | Q15 |
| `c:categories:categories[production-print-gifts].faq[6].a` | Tell us where your order needs to go, and we'll confirm delivery with the proposal. | أخبرنا إلى أين يجب أن يصل طلبك، ونؤكّد لك التوصيل مع العرض. | (keep) | أخبرونا إلى أين يجب أن يصل طلبكم، ونؤكّد لكم التوصيل مع العرض. | ⚑ FC#16 (where, and whether delivery is in the price) | Q14 |
| `c:services:services[stand-fabrication-signage].summary` | Exhibition stands, activations and branded spaces, designed, fabricated and installed, with the signage that guides guests. | أجنحة معارض ومساحات تفعيل ومساحات تحمل هوية العلامة، نصمّمها ونصنّعها ونركّبها، مع لافتات ترشد الضيوف. | (keep) | (keep) | ⚑ FC#15 (fabrication in-house?), FC#17 (wayfinding signage) | Q15 |
| `c:services:services[packaging-design].points[2]` | Structure and dielines | الهيكل وقوالب القصّ | (keep) | (keep) | ⚑ FC#17 (structure and dielines) | Q15 |
| `c:services:services[corporate-gifts].summary` | Gifts chosen, branded and delivered for clients and teams. | هدايا نختارها ونضع عليها هويتك ونوصلها إلى عملائك وفريقك. | (keep) | هدايا نختارها ونضع عليها هويتكم ونوصلها إلى عملائكم وفريقكم. | ⚑ FC#16 (delivery) | Q14 |

## Software & Digital page

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `c:software/page:cta.micro` | No obligation. We reply within one working day. | دون أي التزام. نرد خلال يوم عمل. | A free 30-minute call, with no obligation. We reply within one working day. | مكالمة مجانية مدتها 30 دقيقة، دون أي التزام. نرد عليكم خلال يوم عمل. | R1 confirmed by the owner (2026-11-17); ⚑ FC#23 | Q1 |
| `c:software/page:finalCta.risk` | Request a free 30-min intro call. No obligation. We reply within one working day. | اطلبوا مكالمة تعارف مجانية (30 دقيقة). دون أي التزام. نرد خلال يوم عمل. | (keep) | اطلبوا مكالمة تعارف مجانية (30 دقيقة)، دون أي التزام. نرد عليكم خلال يوم عمل. | ⚑ FC#23; R1 confirmed by the owner (2026-11-17) | Q1 |

## Work

| ID | Current EN | Current AR | Proposed EN | Proposed AR | Waits on | Q |
|---|---|---|---|---|---|---|
| `new:workIndex.closing.body` | Tell us the date and what you need. One team replies within one working day. | أخبرونا بالموعد وما تحتاجون إليه، ويرد عليكم فريق واحد خلال يوم عمل. | Tell us the date and what you need. One team replies within one working day. | أخبرونا بالموعد وما تحتاجون إليه، ويرد عليكم فريق واحد خلال يوم عمل. | ⚑ FC#23 | Q1 |
| `c:work:workItems[airline-exhibition-pavilion].named.summary` | EgyptAir's pavilion: stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market. | جناح مصر للطيران: تصميم الجناح وبناؤه وإدارة العلاقات العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي. | (keep) | (keep) | ⚑ FC#4 | Q4 |
| `c:work:workItems[football-league-events-awards].named.summary` | Full event delivery for the UAE Pro League: tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets. | تنفيذ متكامل لفعاليات دوري المحترفين الإماراتي: هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، إلى جانب محتوى الدوري على وسائل التواصل، وتغليف الجوائز، وأطقم الهدايا. | (keep) | (keep) | ⚑ FC#4 | Q4 |

## Owner items

Not ⚑ rows: these are the owner's to decide.

| # | Item | Where | Current EN | Current AR | Question |
|---|---|---|---|---|---|
| O1 | The `/services` closing promises a reply within one working day | `m:servicesIndex.closing.body` (D135) | Tell us the occasion and the date. One team will shape it with you and reply within one working day. | أخبرونا بالمناسبة والموعد، ويتولّاها معكم فريق واحد يرد عليكم خلال يوم عمل. | The Arabic is our own native wording (D135). Its "one working day" is FC#23, Rand's Q1: if she changes the time, this line changes with the other twelve. Keep the wording? |
| O2 | The Creative hero lead | `m:scenes.creative.s4`, the line under the Creative H1 since N06 | Then the final cut, ready to show. (was: "Then, the final frame.") | ثم النسخة النهائية، جاهزة للعرض. (كان: «ثم يأتي الكادر الأخير.») | Applied from the rewrite (§3: the old line was vague). Does it read as a hero line on its own, now that the scene before it no longer plays? |
| O3 | The Creative service name mentions AI | `c:services:services[ai-content-creation].title` and its summary, points, FAQ answer, and the Software service "AI consulting" | AI content creation | صناعة المحتوى بالذكاء الاصطناعي | The site never mentions AI (CLAUDE.md, D106), but this is the client's real service (D56), so the rewrite kept the name. Keep it, rename it, or drop the service? |
| O4 | The 30-minute call and the one-working-day reply in the kept lines | Kept: `c:software/page:finalCta.risk` ("Request a free 30-min intro call. No obligation. We reply within one working day."), `c:software/page:cta.micro`, `c:form-copy:formCopy.consultation.micro` and the nine other FC#23 rows above | (see the rows) | (see the rows) | The 30 minutes are R1, confirmed by the owner (D122); the line stays as it is only because the same sentence carries FC#23. The one working day is Rand's Q1. Nothing to do unless Q1 changes the time. |
