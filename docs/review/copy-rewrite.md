# Copy rewrite: the site's words, page by page

2026-11-17. Method: `docs/review/copy-voice-reference.md` (the voice, the banned words, the rules per kind of text). Inputs: `copy-proposals.md`, `ux-audit.md`, the company profile's own wording (`docs/content/profile-copy.md`), the open facts (`docs/review/fact-check.md`).

**Status: the owner's decisions on D-C1 to D-C8 are applied (2026-11-17).** What's still open:
- the owner's answers on the software promises (list below);
- Rand's answers to `docs/review/rand-questions.md`.

Nothing in `src/` changes until then. The changes go in on a separate branch after the audit fixes (`audit-fixes`) are merged, with tests and EN/AR screenshots.

**How Rand reviews.** Rand doesn't read this table. She answers the questions, then reads the Arabic on the preview link after the apply. Before that link reaches her, every ⚑ line she hasn't confirmed goes back to its current text. Where the current text makes the same claim, the line stays as it is today, so she still sees it on the link and can strike it. She reads the legal pages last (there's no separate legal reviewer).

**Generated, not hand-copied.** `scripts/copy-inventory.mjs` reads every string in `src/messages/{en,ar}.json` and the localized fields in `src/content/`, so no string is missed. The proposals are in `docs/review/copy-rewrite/*.json`, one file per page; the same files drive the apply step. To rebuild this page:

```
node --no-warnings --import ./scripts/lib/alias.mjs scripts/copy-inventory.mjs --render docs/review/copy-rewrite docs/review/copy-rewrite.md --head=docs/review/copy-rewrite/_head.md
```

**Count: 1,470 strings. 433 proposals (14 of them new keys), 4 lines hidden, 74 lines marked ⚑.** A row with an empty Rule column is kept as it is.

**Already decided, not reopened here:** N09 (30 services), N13 (Request a free intro call), N15 (the short privacy line), N16 (the closing blocks), N18 (the Arabic fixes); the N05/N06 copy in the approved audit-fixes design; the three samples (approved 2026-11-17).

## Rules that apply to every page

The voice and choices 1 and 2 were approved with the samples. Owner rules 1 to 8 came with that approval. On D-C1 the owner replaced rule 2 with the button rule below.

| # | Rule | How it's applied in the table |
|---|---|---|
| Choice 1 | "One team" once per page | Kept where it explains something (About, the FAQ "Can one team handle…", category intros); elsewhere replaced by who replies, when and with what |
| Choice 2 | "Request", not "brief", for visitors | Contact page, forms, FAQ answers, success messages. The team's email can keep "Brief" |
| 1 | Arabic: the plural address (أنتم) everywhere, forms, errors and success messages included | Every Arabic string that addresses the visitor, the legal bodies included (D-C4). If Rand prefers the singular, the whole site goes back to it |
| 2 (D-C1) | **Arabic buttons by role.** Form and system buttons use the verbal noun («إرسال الطلب», «التالي», «إعادة المحاولة»). Marketing calls to action use the plural command («اطلبوا عرض سعر», «اطلبوا مكالمة تعارف مجانية», «خطّطوا لفعاليتكم معنا») | **Marketing:** contact, quote, call, WhatsApp, planning, registering interest, seeing the work, discussing a service. **Form or system:** form submits, copy, close, open the menu, play/pause, the module controls, skip links. **Navigation inside the site** (browse the services, show all, product details, read the case study): the verbal noun. Titles and eyebrows aren't buttons («طلب عرض سعر» as the contact page's title). Text links keep the plural command (D-C2). One exception, at the owner's request: the consultation form's submit is one of the six approved buttons, so it reads «اطلبوا مكالمة تعارف مجانية (30 دقيقة)» |
| 3 | "Across the region" / «في المنطقة», not "the Gulf" | The markets reach Egypt. Applied in every meta description and body line |
| 4 | Home lead: "Events, films, campaigns and websites, from the first idea to launch day." | Video production is one of the 30 services, so "films" is accurate |
| 5 | About statement (AR): «نصنع الفكرة في النقطة التي تلتقي فيها العلامة بجمهورها…» | Rand's own sentence (p3), as the owner wrote it |
| 6 | Galas: the keepsake is a promise | Made optional: "…and, if you'd like, prepare a keepsake for every guest." / «…ونعدّ تذكارًا تودّعون به ضيوفكم إن أردتم.» |
| 7 | Errors say what's needed, field by field | Email, phone, contact, URL and length each have their own message; the generic one is only the fallback. `tooLong` shows `{max}` (a small code change at apply time). The blocked state uses the owner's text. The phone field follows D-C3 |
| 8 | Scan for banned words and unmarked promises | Done on the text each string would ship with (the proposal, or the current text where it's kept). Result below |

## How to read the tables

- **ID:** `m:<key>` is a key in `src/messages`; `c:<file>:<path>` is a field in `src/content/<file>.ts`; `new:<key>` is a key to add.
- **Rule** cites the guide (§2 voice, §3 banned, §4 per kind of text, §5 Arabic), an owner rule (1–8), a choice (1–2), an owner decision (D-C1–D-C8) or an approved decision (N05–N18).
- **(keep)** in a proposed column: that language stays as it is. **(hide)**: the line doesn't render.
- **Facts:** the source a line rests on (`p3` = profile page 3). **⚑:** the line states a fact or a promise that must be confirmed before launch. `FC#n` is row n of `fact-check.md`; `R1`–`R9` are promises found in this rewrite (below).

## Rule 8 scan (2026-11-17)

- **Banned words (§3, EN and AR): 0.** One false alarm cleared: «رحلة» inside «مرحلة».
- **Banned shapes (§3: "we don't just X", «لا نكتفي بـ», «ليس مجرد», em-dash asides): 0.**
- **Promises without a ⚑: 0.** The scan matched reply times, durations, "free", "every stage / project / proposal" and their Arabic forms. Seven matches aren't promises (a pricing method, terms set in each proposal, a form option "Within 3 months", a demo label) and stay unmarked. Seven promises that weren't marked are marked now.
- **Singular address left in Arabic (rule 1): 0** outside the legal bodies (D-C4). Eight were found and fixed.

## The owner's decisions (2026-11-17)

| # | Decision | Applied as |
|---|---|---|
| D-C1 | Rejected as proposed; the button rule above replaces it | 36 marketing buttons in the plural command, the six approved ones included; the rest keep the verbal noun |
| D-C2 | Accepted | Text links and headings keep the plural command |
| D-C3 | Accepted, changed: see "The phone field" below | New keys `errorMessages.phoneCode`, `formCopy.fields.phoneHint`, `formCopy.review.contactHint`; `errorMessages.phone` reworded |
| D-C4 | Accepted. There's no legal reviewer: Rand reads the legal pages last | 37 legal rows move to the plural at apply time, with no other change of wording |
| D-C5 | Accepted, then superseded by D-C1 for the button | «أهلًا بكم»; the drawn site's button «احجزوا زيارة» (a call to action) |
| D-C6 | Accepted, EN "In development" | `hero.ui.soon`: "In development" / «قيد التطوير» |
| D-C7 | Accepted | At apply time: delete `common.comingSoon`, `megaMenu.inDevelopment`, `category.modulePending`, `category.quote.contactPending` if nothing public renders them |
| D-C8 | Accepted | The new keys as listed in the tables |
| R6 | The online print store isn't built, so its lines are hidden | The "Order your print online" button only links to the contact form (`/contact?service=print-store`): there's no catalogue, cart or checkout. Hidden: the Print FAQ "Can I order prints online?" (question and answer), the service's summary, and the module's button. The module's four steps stay: they describe a request that does work |

### The phone field (D-C3, for the apply step)

A pure function in `src/lib/forms/`, test-first (forms and validation are high-risk logic, D82):

- **Accept** a number that starts with `+` or `00`. Remove spaces, dashes and brackets, then turn a leading `00` into `+`.
- **Reject with `phoneCode`** ("Include the country code, e.g. +971.") a number that starts with `0` and isn't `00`, or that starts with a digit with no `+`. A number like `971501234567` is ambiguous, so it's treated as missing its code (our call).
- **Reject with `phone`** ("Use digits only, e.g. +971 50 123 4567.") anything else that isn't 8 to 15 digits after the `+`, with a first digit of 1–9 (E.164).
- **Store and send** the number in E.164 (`+971501234567`): the team's email and the WhatsApp reply use it.
- **Show the example** under the field from the start (`phoneHint`), before any error. The review form's "Email or WhatsApp" field shows both shapes (`contactHint`) and applies the same rules when the value isn't an email.

## Software promises: the owner decides (not Rand)

The owner asked for R1, R2 and R7 here. Our call: R8 and the software rows of `fact-check.md` belong here too, since the owner answers for the software side. Say if any of them should go to Rand.

| # | The promise | Lines |
|---|---|---|
| R1 | The intro call is free and lasts 30 minutes | 5: the software page's call to action, closing line and sticky bar; the Software & Digital FAQ; the consultation form's button |
| R2 | The website review is free, comes within 3 working days, and lists 5 improvements | 5: the software page (4), the review form's success message |
| R7 | Every support plan includes a monthly report | 1: the software page, "Ways to work with us" |
| R8 | The quality checks run on every build | 1: the software page's quality title |
| FC#18 | NO TIME is the federation's official digital and media partner, and everything listed is live at launch | 2: the software page's case study |
| FC#19 | Event apps, live results and screens built for clients other than the federation | 1: the software page |
| FC#20 | Online stores and AI consulting are services we sell, and which payment gateways | 2: the Software & Digital services |
| FC#21 | The stack shown: Next.js, React, TypeScript, Node.js, iOS and Android | 1: the software page |
| FC#22 | "Security and data protection, with the UAE personal data law in mind" | 1: the software page's quality list |
| FC#24 | Support after launch; the client sees progress at every stage | 7: the software page, the Software & Digital FAQ |

## For Rand

The questions are in `docs/review/rand-questions.md`: 15 short questions in Arabic, the most important first. They cover FC#1, FC#4–FC#17, FC#22 (the legal pages), FC#23, and R3, R4, R5 and R9.

---


## Global: header, menus, footer, WhatsApp, 404

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:meta.title` | NO TIME Creative House | NO TIME Creative House | keep |  |  |  |
| `m:meta.description` | A Dubai creative house for events, creative production, marketing and digital. One team takes an idea from the first sketch to the day it goes live, across six markets. | دار إبداعية في دبي للفعاليات والإنتاج الإبداعي والتسويق والحلول الرقمية. فريق واحد يرافق الفكرة من أول رسمة حتى يوم إطلاقها، في ستة أسواق. | §4: a list of four, then "one team" (choice 1); 170 chars, cut in results. Owner: "the region", not "the Gulf" (the markets reach Egypt) | Events, films, campaigns and websites, planned in Dubai and delivered across the region. Tell us the date and what you need. | فعاليات وأفلام وحملات ومواقع، نخطّط لها من دبي وننفّذها في المنطقة. أخبرونا بالموعد وما تحتاجون إليه. | p3 (Dubai, markets). ⚑ FC#1 (six markets) |
| `m:brand.name` | NO TIME | NO TIME | keep |  |  |  |
| `m:brand.tagline` | Creative House | Creative House | keep |  |  |  |
| `m:brand.homeLabel` | NO TIME Creative House — home | NO TIME Creative House — الصفحة الرئيسية | §3 em-dash aside (it's read aloud as "dash") | NO TIME Creative House, home | NO TIME Creative House، الصفحة الرئيسية |  |
| `m:brand.logoAlt` | NO TIME Creative House | NO TIME Creative House | keep |  |  |  |
| `m:common.skipToContent` | Skip to content | انتقل إلى المحتوى | D-C1 (owner): a form, system or navigation button, so the verbal noun: controls in the neutral verbal noun | (keep) | الانتقال إلى المحتوى |  |
| `m:common.preview` | Preview | معاينة | keep |  |  |  |
| `m:common.comingSoon` | Coming soon | قريبًا | Fixed principle: no "coming soon" control. Check where it renders at apply time; delete the key if nothing public uses it | (delete if unused) | (delete if unused) |  |
| `m:common.example` | Example | مثال | keep |  |  |  |
| `m:nav.label` | Main | القائمة الرئيسية | keep |  |  |  |
| `m:nav.services` | Services | الخدمات | keep |  |  |  |
| `m:nav.work` | Work | أعمالنا | keep |  |  |  |
| `m:nav.digital` | Digital Solutions | الحلول الرقمية | keep |  |  |  |
| `m:nav.about` | About | من نحن | keep |  |  |  |
| `m:nav.contact` | Contact | تواصل معنا | Owner rule 1: plural address | (keep) | تواصلوا معنا |  |
| `m:header.quote` | Request a quote | اطلب عرض سعر | D-C1 (owner): a marketing call to action, so the plural command | (keep) | اطلبوا عرض سعر |  |
| `m:langToggle.label` | Language | اللغة | keep |  |  |  |
| `m:langToggle.en` | EN | EN | keep |  |  |  |
| `m:langToggle.ar` | ع | ع | keep |  |  |  |
| `m:langToggle.enName` | English | English | keep |  |  |  |
| `m:langToggle.arName` | العربية | العربية | keep |  |  |  |
| `m:megaMenu.eyebrow` | Services | الخدمات | keep |  |  |  |
| `m:megaMenu.headingLead` | One house. | خمس حِرَف، | keep |  |  |  |
| `m:megaMenu.headingKey` | Five crafts. | يجمعها سقف واحد. | keep |  |  |  |
| `m:megaMenu.intro` | Everything an event or a brand needs, delivered by one team. | كل ما تحتاجه فعاليتك أو علامتك، يتولّاه فريق واحد. | Choice 1: "one team" in the menu is on every page. Say what the visitor can do instead | Book one service, or hand us the whole event. | اطلبوا خدمة واحدة، أو اتركوا لنا المناسبة كلها. |  |
| `m:megaMenu.count` | {count, plural, one {# service} other {# services}} | {count, plural, zero {لا خدمات} one {خدمة واحدة} two {خدمتان} few {{count} خدمات} many {{count} خدمة} other {{count} خدمة}} | keep |  |  |  |
| `m:megaMenu.viewCategory` | View category | استعرض الفئة | §4 CTA: "view category" names our structure, not what they get; owner rule 2 (AR) | See the services | استعراض الخدمات |  |
| `m:megaMenu.inDevelopment` | In development | قيد التطوير | Fixed principle: no "in development" label in public. Check at apply time; delete if no public category uses it | (delete if unused) | (delete if unused) |  |
| `m:megaMenu.allServices` | All {count} services | جميع الخدمات ({count}) | keep |  |  |  |
| `m:mobileMenu.open` | Open menu | افتح القائمة | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | فتح القائمة |  |
| `m:mobileMenu.close` | Close menu | أغلق القائمة | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | إغلاق القائمة |  |
| `m:mobileMenu.services` | Services | الخدمات | keep |  |  |  |
| `m:whatsapp.label` | Chat with us on WhatsApp | راسلنا على واتساب | D-C1 (owner): a marketing call to action, so the plural command | (keep) | راسلونا على واتساب |  |
| `m:whatsapp.pending` | WhatsApp · number pending | واتساب · الرقم قريبًا | keep |  |  |  |
| `m:whatsapp.prefill` | Hello NO TIME, I'd like to talk about a project. | مرحبًا NO TIME، أودّ الحديث معكم عن مشروع. | keep |  |  |  |
| `m:whatsapp.prefillFrom` | Hello NO TIME, I found you through {channel} and I'd like to talk about a project. | مرحبًا NO TIME، وصلتكم من {channel}، وأودّ الحديث معكم عن مشروع. | keep |  |  |  |
| `m:whatsapp.channels.instagram` | Instagram | إنستغرام | keep |  |  |  |
| `m:whatsapp.channels.linkedin` | LinkedIn | لينكدإن | keep |  |  |  |
| `m:whatsapp.channels.facebook` | Facebook | فيسبوك | keep |  |  |  |
| `m:whatsapp.channels.tiktok` | TikTok | تيك توك | keep |  |  |  |
| `m:whatsapp.channels.snapchat` | Snapchat | سناب شات | keep |  |  |  |
| `m:whatsapp.channels.x` | X | منصّة إكس | keep |  |  |  |
| `m:whatsapp.channels.youtube` | YouTube | يوتيوب | keep |  |  |  |
| `m:whatsapp.channels.google` | Google | جوجل | keep |  |  |  |
| `m:whatsapp.channels.print` | a printed QR code | رمز QR مطبوع | keep |  |  |  |
| `m:footer.rights` | © {year} NO TIME Creative House. | © {year} NO TIME Creative House. | keep |  |  |  |
| `m:footer.tagline` | Events · Marketing · PR · Production | فعاليات · تسويق · علاقات عامة · إنتاج | keep |  |  |  |
| `m:footer.columns.services` | Services | الخدمات | keep |  |  |  |
| `m:footer.columns.company` | Company | الشركة | keep |  |  |  |
| `m:footer.columns.contact` | Contact | تواصل معنا | Owner rule 1 | (keep) | تواصلوا معنا |  |
| `m:footer.columns.follow` | Follow us | تابعنا | Owner rule 1 | (keep) | تابعونا |  |
| `m:footer.address` | Dubai, United Arab Emirates | دبي، الإمارات العربية المتحدة | keep |  |  |  |
| `m:footer.legal.privacy` | Privacy Policy | سياسة الخصوصية | keep |  |  |  |
| `m:footer.legal.terms` | Terms of Use | شروط الاستخدام | keep |  |  |  |
| `m:footer.legal.cookies` | Cookie Policy | سياسة ملفات تعريف الارتباط | keep |  |  |  |
| `m:footer.backToTop` | Back to top | العودة إلى الأعلى | keep |  |  |  |
| `m:footer.credits` | Image credits | مصادر الصور | keep |  |  |  |
| `m:footer.legalNav` | Legal | روابط قانونية | keep |  |  |  |
| `m:notFound.title` | This page doesn't exist. | هذه الصفحة غير موجودة. | keep |  |  |  |
| `m:notFound.back` | Back to home | العودة إلى الرئيسية | keep |  |  |  |
| `m:notFound.body` | The link may be out of date, or the address mistyped. Start from what we do, or go back home. | ربما تغيّر الرابط، أو في العنوان خطأ. ابدأ من خدماتنا، أو عُد إلى الرئيسية. | Owner rule 1 (AR plural); EN keep | (keep) | ربما تغيّر الرابط، أو في العنوان خطأ. ابدؤوا من خدماتنا، أو عودوا إلى الرئيسية. |  |
| `m:notFound.services` | See our services | تصفّح خدماتنا | D-C1 (owner): a form, system or navigation button, so the verbal noun: «تصفّح» reads as a singular command; a verbal noun that can't | (keep) | استعراض خدماتنا |  |
| `new:meta.homeTitle` | (new) | (new) | SEO: the home title names no service. A new key: `meta.title` is also the template every other title ends with, so it stays | NO TIME Creative House · Events and marketing in Dubai | NO TIME Creative House · فعاليات وتسويق في دبي | p1, p3 |

## Home

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:hero.titleLine1` | IT'S TIME | حان وقت | keep |  |  |  |
| `m:hero.title.create.line2` | TO CREATE. | الإبداع. | keep |  |  |  |
| `m:hero.title.create.label` | It's time to create. | حان وقت الإبداع. | keep |  |  |  |
| `m:hero.title.start.line2` | TO START. | البداية. | keep |  |  |  |
| `m:hero.title.start.label` | It's time to start. | حان وقت البداية. | keep |  |  |  |
| `m:hero.lead` | Events, creative production, marketing and digital solutions, planned and delivered by one house. | فعاليات ومحتوى وحملات ومنصّات رقمية، يخطّط لها فريق واحد وينفّذها حتى يوم الإطلاق. | §4 lead: a category list that any agency could use. Owner's line (2026-11-17); films stay: Video production is one of the 30 services | Events, films, campaigns and websites, from the first idea to launch day. | فعاليات وأفلام وحملات ومواقع، من أول فكرة حتى يوم الإطلاق. | services data (video-production) |
| `m:hero.cta` | See what we make | اكتشف ما نصنعه | D-C1 (owner): a marketing call to action, so the plural command | Plan your event | خطّطوا لفعاليتكم معنا |  |
| `m:hero.beatLead` | Every second | كل ثانية | N05: the beat becomes the eyebrow `hero.eyebrow`, same words | Every second is planned. (as hero.eyebrow) | كل ثانية محسوبة. (as hero.eyebrow) |  |
| `m:hero.beatKey` | is planned. | محسوبة. | N05: merged into `hero.eyebrow` | (delete) | (delete) |  |
| `m:hud.scene` | Scene 01 — NO TIME | المشهد 01 — NO TIME | §3 em dash; decorative HUD, aria-hidden | Scene 01 · NO TIME | المشهد 01 · NO TIME |  |
| `m:hud.coords` | 25.2048° N · 55.2708° E | 25.2048° N · 55.2708° E | keep |  |  |  |
| `m:hud.scroll` | Scroll | مرّر | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | للأسفل |  |
| `m:hud.city` | Dubai | دبي | keep |  |  |  |
| `m:about.eyebrow` | About NO TIME | عن NO TIME | keep |  |  |  |
| `m:about.statement` | A creative house for events, brands and the ideas in between. One team plans it, builds it, prints it and launches it. | دار إبداعية للفعاليات والعلامات التجارية، وللأفكار التي تجمع بينهما. فريق واحد يخطّط لها، ويبنيها، ويطبعها، ويُطلقها. | §3: "the ideas in between" says nothing; four verbs in a row. Rand's own sentence (p3), lightly edited; AR as the owner wrote it | We build ideas where a brand meets its audience, then carry them all the way: strategy, creative, production and delivery, under one roof. | نصنع الفكرة في النقطة التي تلتقي فيها العلامة بجمهورها، ثم نرافقها حتى النهاية: الاستراتيجية والإبداع والإنتاج والتسليم، تحت سقف واحد. | p3 (Rand's wording) |
| `m:about.body` | Our base is Dubai, and our work runs across six markets, from Saudi Arabia to Egypt: an airline's pavilion at the Dubai Airshow, a majlis dressed for a heritage welcome, a bilingual app for a national sports federation. Each idea starts where the brand meets its audience, and one team carries it through strategy, creative, production and delivery. | مقرّنا دبي، وعملنا يمتدّ في ستة أسواق من السعودية إلى مصر: جناح لشركة طيران في معرض دبي للطيران، ومجلس تراثي يستقبل الضيوف، وتطبيق بلغتين لاتحاد رياضي وطني. تبدأ كل فكرة من النقطة التي تلتقي فيها العلامة بجمهورها، ثم يتابعها فريق واحد من الاستراتيجية إلى الإبداع والإنتاج، حتى التسليم. | Keeps the three real projects (§1 specifics). The last sentence repeated the statement | We're based in Dubai and work in six markets, from Saudi Arabia to Egypt. Recent work: an airline's pavilion at the Dubai Airshow, a majlis dressed for a heritage welcome, and a bilingual app for a national sports federation. | مقرّنا دبي، ونعمل في ستة أسواق من السعودية إلى مصر. من أعمالنا الأخيرة: جناح لشركة طيران في معرض دبي للطيران، ومجلس تراثي جُهّز لاستقبال الضيوف، وتطبيق بلغتين لاتحاد رياضي وطني. | p3, case studies. ⚑ FC#1 (six markets); ⚑ R9 (the three projects are recent): if Rand doesn't confirm, "Some of our work:" / «من أعمالنا:» |
| `m:about.stats.markets.value` | 6 | 6 | keep |  |  |  |
| `m:about.stats.markets.label` | Markets | أسواق | keep | (keep) | (keep) | ⚑ FC#1 |
| `m:about.stats.integrated.value` | 360° | 360° | N09 (approved): the count comes from the services data | 30 | 30 |  |
| `m:about.stats.integrated.label` | Integrated | دورة عمل كاملة | N09 (approved) | Services | خدمة |  |
| `m:categories.eyebrow` | What we do | ما نقدّمه | keep |  |  |  |
| `m:categories.headingLead` | Five crafts, | خمس حِرَف… | keep |  |  |  |
| `m:categories.headingKey` | one team behind them. | يتقنها فريق واحد. | keep |  |  |  |
| `m:categories.intro` | Book one, or hand us the whole brief. A launch can need a stage, a film, a campaign and a gift box, and here the same people plan all four. | اطلب حرفة واحدة، أو اترك لنا المشروع كله. قد يحتاج إطلاقٌ واحد إلى منصّة وفيلم وحملة وعلبة هدايا، وعندنا يخطّط للأربعة فريقٌ واحد. | Choice 2 ("brief"); owner rule 1 (AR plural) | Book one, or hand us the whole project. A launch can need a stage, a film, a campaign and a gift box, and here the same people plan all four. | اطلبوا حرفة واحدة، أو اتركوا لنا المشروع كله. قد يحتاج إطلاقٌ واحد إلى منصّة وفيلم وحملة وعلبة هدايا، وعندنا يخطّط للأربعة الفريقُ نفسه. |  |
| `m:categories.viewServices` | See the services | اطّلع على الخدمات | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | استعراض الخدمات |  |
| `m:categories.allServices` | See all services | تصفّح كل الخدمات | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | استعراض كل الخدمات |  |
| `m:services.meta.title` | Services | الخدمات | SEO: "Services" alone matches no search; name what's inside | Services: events, film, marketing, print and digital | خدماتنا: فعاليات وإنتاج وتسويق وطباعة وحلول رقمية |  |
| `m:services.meta.description` | Every NO TIME service in one place, across five categories: events and hospitality, creative production, marketing and brand, production, print and gifts, and software and digital. | جميع خدماتنا في مكان واحد، ضمن خمس فئات: الفعاليات والضيافة، والإنتاج الإبداعي، والتسويق والعلامة التجارية، والإنتاج والطباعة والهدايا، والبرمجيات والحلول الرقمية. | SEO: 190 chars of category names, cut in results; one concrete line instead | Thirty services in five categories, from conferences and weddings to films, campaigns, print and websites. Find yours, or ask us. | ثلاثون خدمة في خمس فئات، من المؤتمرات والأعراس إلى الأفلام والحملات والطباعة والمواقع. اختاروا ما تحتاجون إليه، أو اسألونا. | services data (30, N09) |
| `m:services.eyebrow` | Services | الخدمات | keep |  |  |  |
| `m:services.headingLead` | Everything we make, | كل ما نصنعه، | keep |  |  |  |
| `m:services.headingKey` | in one place. | في مكان واحد. | keep |  |  |  |
| `m:services.intro` | Five categories, each with its own page. Open a category to see how we work in it, or go straight to a service. | خمس فئات، ولكل فئة صفحتها. افتح الفئة لترى كيف نعمل فيها، أو انتقل مباشرةً إلى الخدمة التي تريدها. | Owner rule 1 (AR plural); EN keep | (keep) | خمس فئات، ولكل فئة صفحتها. افتحوا الفئة لتروا كيف نعمل فيها، أو انتقلوا مباشرةً إلى الخدمة التي تريدونها. |  |
| `m:services.listLabel` | Service categories | فئات الخدمات | keep |  |  |  |
| `m:work.eyebrow` | Our work | أعمالنا | keep |  |  |  |
| `m:work.headingLead` | Real projects, | مشاريع حقيقية، | keep |  |  |  |
| `m:work.headingKey` | start to finish. | من الفكرة حتى التسليم. | keep |  |  |  |
| `m:work.intro` | An airline's pavilion, a football league's award nights, a federation's app. The names stay private until each client says yes. | جناح لشركة طيران وطنية، وليالي تكريم لدوري كرة قدم، وتطبيق لاتحاد رياضي. نحتفظ بالأسماء إلى أن يأذن لنا أصحابها. | keep |  |  |  |
| `m:work.labels.challenge` | Challenge | التحدي | keep |  |  |  |
| `m:work.labels.idea` | Idea | الفكرة | keep |  |  |  |
| `m:work.labels.execution` | Execution | التنفيذ | keep |  |  |  |
| `m:work.labels.result` | Result | النتيجة | keep |  |  |  |
| `m:work.viewProject` | View project | تفاصيل المشروع | keep |  |  |  |
| `m:work.allWork` | All work | كل الأعمال | keep |  |  |  |
| `m:work.todo.title` | TODO: project title, pending client approval | TODO: عنوان المشروع، بانتظار موافقة العميل | keep |  |  |  |
| `m:work.todo.summary` | TODO: one-line project summary from docs/content/case-studies.md | TODO: سطر تعريفي بالمشروع من ملف دراسات الحالة | keep |  |  |  |
| `m:work.spansLabel` | Services in this project | خدمات هذا المشروع | keep |  |  |  |
| `m:marquee.label` | All our services | جميع خدماتنا | keep |  |  |  |
| `m:marquee.pause` | Pause the services list | أوقف شريط الخدمات | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | إيقاف شريط الخدمات |  |
| `m:marquee.play` | Play the services list | شغّل شريط الخدمات | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | تشغيل شريط الخدمات |  |
| `m:digital.eyebrow` | Beyond events | ما بعد الفعاليات | keep |  |  |  |
| `m:digital.headingLead` | The team behind your event | الفريق الذي يصنع فعاليتك، | Owner rule 1 | (keep) | الفريق الذي يصنع فعاليتكم، |  |
| `m:digital.headingKey` | builds your platform too. | يبني منصّتك الرقمية أيضًا. | Owner rule 1 | (keep) | يبني منصّتكم الرقمية أيضًا. |  |
| `m:digital.intro` | Websites, apps and dashboards, designed in Arabic and English from the first sketch and built to load fast on a phone. Your team updates the content itself. | مواقع وتطبيقات ولوحات تحكم، نصمّمها بالعربية والإنجليزية من أول رسمة، ونبنيها لتفتح بسرعة على الجوّال. ويحدّث فريقك محتواها بنفسه. | Owner rule 1 (AR); EN keep: concrete (two languages, phones, your team edits) | (keep) | مواقع وتطبيقات ولوحات تحكم، نصمّمها بالعربية والإنجليزية من أول رسمة، ونبنيها لتفتح بسرعة على الجوّال. ويحدّث فريقكم محتواها بنفسه. |  |
| `m:digital.capabilities.websites.title` | Websites | المواقع الإلكترونية | keep |  |  |  |
| `m:digital.capabilities.websites.body` | Bilingual sites with a content system your team runs. | مواقع بلغتين، ونظام محتوى يديره فريقك بنفسه. | Owner rule 1 | (keep) | مواقع بلغتين، ونظام محتوى يديره فريقكم بنفسه. |  |
| `m:digital.capabilities.apps.title` | Mobile apps | تطبيقات الجوّال | keep |  |  |  |
| `m:digital.capabilities.apps.body` | iOS and Android, connected to your website. | لأجهزة iOS و Android، ومتصلة بموقعك. | Owner rule 1; and «و Android» → «وAndroid» (N18 rule) | (keep) | لأجهزة iOS وAndroid، ومتصلة بموقعكم. |  |
| `m:digital.capabilities.systems.title` | Internal systems | الأنظمة الداخلية | keep |  |  |  |
| `m:digital.capabilities.systems.body` | Dashboards, admin panels and integrations, built around how you work. | لوحات تحكم وأنظمة إدارة وربط بين أنظمتك، مفصّلة على طريقة عملك. | Owner rule 1 | (keep) | لوحات تحكم وأنظمة إدارة وربط بين أنظمتكم، مفصّلة على طريقة عملكم. |  |
| `m:digital.capabilities.ecommerce.title` | E-commerce | المتاجر الإلكترونية | keep |  |  |  |
| `m:digital.capabilities.ecommerce.body` | Online stores, from the catalogue to the checkout. | متاجر على الإنترنت، من عرض المنتج حتى إتمام الطلب. | keep |  |  |  |
| `m:digital.productsEyebrow` | Our products | منتجاتنا | keep |  |  |  |
| `m:digital.productsIntro` | Two products of our own: check-in for events, and a system for restaurants at their busiest. Both in development. | منتجان من صنعنا: تسجيل حضور للفعاليات، ونظام للمطاعم في أوقات ذروتها. كلاهما قيد التطوير. | keep |  |  |  |
| `m:digital.registerInterest` | Register interest | سجّل اهتمامك | D-C1 (owner): a marketing call to action, so the plural command | (keep) | سجّلوا اهتمامكم |  |
| `m:digital.requestDemo` | Request a demo | اطلب عرضًا تجريبيًا | D-C1 (owner): a marketing call to action, so the plural command | (keep) | اطلبوا عرضًا تجريبيًا |  |
| `m:digital.viewProduct` | View product | تعرّف على المنتج | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | تفاصيل المنتج |  |
| `m:digital.explore` | Explore Software & Digital | اكتشف البرمجيات والحلول الرقمية | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | استكشاف البرمجيات والحلول الرقمية |  |
| `m:process.eyebrow` | How we work | طريقة عملنا | keep |  |  |  |
| `m:process.headingLead` | Four steps, | أربع خطوات، | keep |  |  |  |
| `m:process.headingKey` | one team throughout. | وفريق واحد من أولها إلى آخرها. | Choice 1: "one team" is already in this page's Categories heading | one plan. | وخطة واحدة. |  |
| `m:process.steps.plan.title` | Plan | نخطط | keep |  |  |  |
| `m:process.steps.plan.body` | We start with the brief, the audience and the date, then set the idea, the budget and the timeline. | نبدأ من طلبك والجمهور والموعد، ثم نثبّت الفكرة والميزانية والجدول. | Choice 2 ("brief"); owner rule 1 | We start with what you need, the audience and the date, then fix the idea, the budget and the timeline. | نبدأ بما تحتاجون إليه وبالجمهور والموعد، ثم نثبّت الفكرة والميزانية والجدول. |  |
| `m:process.steps.build.title` | Build | نبني | keep |  |  |  |
| `m:process.steps.build.body` | Design, décor, content and the platforms behind them take shape, reviewed with you at every stage. | نُعدّ التصميم والديكور والمحتوى والمنصّات التي تخدمها، ونراجع معك كل مرحلة. | Owner rule 1 (AR); EN keep. A promise (a review at every stage) | (keep) | نُعدّ التصميم والديكور والمحتوى والمنصّات التي تخدمها، ونراجع معكم كل مرحلة. | ⚑ R4 (a review with the client at every stage) |
| `m:process.steps.produce.title` | Produce | ننتج | keep |  |  |  |
| `m:process.steps.produce.body` | Fabrication, print, catering and crew come together on site, run by one team. | في أرض الحدث يجتمع التصنيع والطباعة والضيافة وطواقم العمل، ويديرها فريق واحد. | Choice 1 | Fabrication, print, catering and crew come together on site, on one schedule. | في موقع الحدث يجتمع التصنيع والطباعة والضيافة وطواقم العمل، على جدول واحد. |  |
| `m:process.steps.launch.title` | Launch | نطلق | keep |  |  |  |
| `m:process.steps.launch.body` | The doors open, the campaign goes live, and we stay with you through to the final report. | تُفتح الأبواب أو تنطلق الحملة، ونبقى إلى جانبك حتى التقرير الأخير. | Owner rule 1 (AR). A promise (a final report on every project) | (keep) | تُفتح الأبواب أو تنطلق الحملة، ونبقى إلى جانبكم حتى التقرير الأخير. | ⚑ R5 (every project ends with a report); else "…and we stay with you after it." / «ونبقى معكم بعدها.» |
| `m:markets.eyebrow` | Where we work | أين نعمل | keep |  |  |  |
| `m:markets.headingLead` | Six markets, | ستة أسواق، | keep | (keep) | (keep) | ⚑ FC#1 |
| `m:markets.headingKey` | one base in Dubai. | ومقرّنا دبي. | keep |  |  |  |
| `m:markets.countries.ae` | United Arab Emirates | الإمارات العربية المتحدة | keep |  |  |  |
| `m:markets.countries.sa` | Saudi Arabia | المملكة العربية السعودية | keep |  |  |  |
| `m:markets.countries.eg` | Egypt | مصر | keep |  |  |  |
| `m:markets.countries.qa` | Qatar | قطر | keep |  |  |  |
| `m:markets.countries.om` | Oman | سلطنة عُمان | keep |  |  |  |
| `m:markets.countries.kw` | Kuwait | الكويت | keep |  |  |  |
| `m:markets.base` | Our base | مقرّنا | keep |  |  |  |
| `m:markets.localTime` | Local time | التوقيت المحلي | keep |  |  |  |
| `m:cta.headingLead` | Have a date in mind? | هل حدّدت موعدًا؟ | §3: a question headline answered by the next line | Pick the date. | حدّدوا الموعد، |  |
| `m:cta.headingKey` | Let's plan every second of it. | لنخطّط لكل ثانية فيه. | Pairs with the new lead | We'll plan every second of it. | ونخطّط لكل ثانية فيه. |  |
| `m:cta.body` | Tell us the date and the idea, and we'll come back with the next steps. | أخبرنا بالموعد والفكرة، ونعود إليك بالخطوات التالية. | Owner rule 1 (AR) | (keep) | أخبرونا بالموعد والفكرة، ونعود إليكم بالخطوات التالية. |  |
| `m:cta.primary` | Request a quote | اطلب عرض سعر | D-C1 (owner): a marketing call to action, so the plural command | (keep) | اطلبوا عرض سعر |  |
| `m:cta.secondary` | Chat on WhatsApp | راسلنا على واتساب | D-C1 (owner): a marketing call to action, so the plural command | (keep) | راسلونا على واتساب |  |
| `m:cta.bodyInterim` | Start with what you need. Each craft has its own page, with every service inside it. | ابدأ بما تحتاجه: لكل مجال صفحته، وفيها خدماته كلها. | Owner rule 1 (AR) | (keep) | ابدؤوا بما تحتاجون إليه: لكل مجال صفحته، وفيها خدماته كلها. |  |
| `m:reel.open` | See the photos | شاهد الصور | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | مشاهدة الصور |  |
| `m:reel.title` | Showreel | عرض الأعمال | keep |  |  |  |
| `m:reel.description` | Photographs from our events, one after another: dressed tables, florals, hospitality and a heritage setting. | صور من فعالياتنا تتوالى: طاولات مزيّنة، وتنسيقات زهور، وضيافة، وأجواء تراثية. | keep |  |  |  |
| `m:reel.close` | Close the reel | إغلاق العرض | keep |  |  |  |
| `m:reel.pause` | Pause the reel | إيقاف العرض مؤقتًا | keep |  |  |  |
| `m:reel.play` | Play the reel | تشغيل العرض | keep |  |  |  |
| `m:reel.previous` | Previous | السابقة | keep |  |  |  |
| `m:reel.next` | Next | التالية | keep |  |  |  |
| `m:reel.frame` | {n} / {total} | {n} / {total} | keep |  |  |  |
| `new:hero.ctaWork` | (new) | (new) | D-C1 (owner): a marketing call to action, so the plural command | See our work | شاهدوا أعمالنا |  |

## Category pages: shared template

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:category.breadcrumb` | Breadcrumb | مسار التنقل | keep |  |  |  |
| `m:category.indexLabel` | Services in this category | خدمات هذه الفئة | keep |  |  |  |
| `m:category.deliverTitle` | What we deliver | ما نقدّمه | keep |  |  |  |
| `m:category.quoteCta` | Request a quote | اطلب عرض سعر | D-C1 (owner): a marketing call to action, so the plural command | (keep) | اطلبوا عرض سعر |  |
| `m:category.quoteCtaFor` | Request a quote for {service} | اطلب عرض سعر لخدمة {service} | D-C1 (owner): a marketing call to action, so the plural command | (keep) | اطلبوا عرض سعر لخدمة {service} |  |
| `m:category.faqEyebrow` | Questions | أسئلة | keep |  |  |  |
| `m:category.faqHeading` | Common questions | أسئلة شائعة | keep |  |  |  |
| `m:category.quote.eyebrow` | Request a quote | اطلب عرض سعر | A title, not a button: the noun reads right | (keep) | طلب عرض سعر |  |
| `m:category.quote.body` | Tell us the date, the place and what you need. One team picks it up and replies within one working day. | أخبرنا بالموعد والمكان وما تحتاجه، ويتسلّم طلبك فريق واحد يرد عليك خلال يوم عمل. | Choice 1: on a category page this was the 4th "one team"; owner rule 1 | Tell us the date, the place and what you need. We'll reply within one working day. | أخبرونا بالموعد والمكان وما تحتاجون إليه، ونرد عليكم خلال يوم عمل. | ⚑ FC#23 (one working day, site-wide) |
| `m:category.quote.service` | Service: {service} | الخدمة: {service} | keep |  |  |  |
| `m:category.quote.whatsapp` | Chat on WhatsApp | راسلنا على واتساب | D-C1 (owner): a marketing call to action, so the plural command | (keep) | راسلونا على واتساب |  |
| `m:category.quote.email` | Email us | راسلنا بالبريد الإلكتروني | D-C1 (owner): a marketing call to action, so the plural command | (keep) | راسلونا بالبريد الإلكتروني |  |
| `m:category.quote.contactPending` | Our contact details will appear here soon. | ستظهر بيانات التواصل هنا قريبًا. | Fixed principle (no "soon"): the email is set, so this shouldn't render. Delete if no path shows it | (delete if unused) | (delete if unused) |  |
| `m:category.quote.prefill` | Hello NO TIME, I'd like a quote for {service}. | مرحبًا NO TIME، أودّ طلب عرض سعر لخدمة {service}. | keep |  |  |  |
| `m:category.quote.brief` | Send a brief | أرسل طلبك | D-C1 (owner): a marketing call to action, so the plural command | Send a request | أرسلوا طلبكم |  |
| `m:category.modulePending` | Interactive preview in design | معاينة تفاعلية قيد التصميم | Fixed principle: no "in design" label in public. Delete if every public module is built | (delete if unused) | (delete if unused) |  |
| `m:category.skip` | Skip to services | انتقل إلى الخدمات | N06 (approved): "Go to the services"; AR by owner rule 2 | Go to the services | الانتقال إلى الخدمات |  |
| `m:scenes.draft.s1` | TODO: shot 1 line | TODO: سطر اللقطة 1 | keep |  |  |  |
| `m:scenes.draft.s2` | TODO: shot 2 line | TODO: سطر اللقطة 2 | keep |  |  |  |
| `m:scenes.draft.s3` | TODO: shot 3 line | TODO: سطر اللقطة 3 | keep |  |  |  |
| `m:scenes.draft.s4` | TODO: shot 4 line | TODO: سطر اللقطة 4 | keep |  |  |  |

## Category: events-hospitality

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:scenes.events.s1` | It starts with an empty room. | تبدأ الحكاية بقاعة فارغة. | AR: «الحكاية» is the "stories" cliché (§1) | (keep) | تبدأ كل مناسبة بقاعة فارغة. |  |
| `m:scenes.events.s3` | Tables, flowers and candlelight, each in place. | طاولات وزهور وشموع، كلٌّ في مكانه. | keep |  |  |  |
| `m:scenes.events.s4` | Every detail, ready before the first guest. | كل تفصيل جاهز قبل أن يصل أول ضيف. | §3 "every detail" is abstract; after N06 this line leads the hero, so it should show the room | The room is ready before the first guest walks in. | القاعة جاهزة قبل أن يدخل أول ضيف. | p4 |
| `c:categories:categories[events-hospitality].title` | Events & Hospitality | الفعاليات والضيافة | keep |  |  |  |
| `c:categories:categories[events-hospitality].summary` | Conferences, exhibitions, launches and celebrations, from the first concept to the last guest. | مؤتمرات ومعارض وحفلات إطلاق ومناسبات خاصة، من أول فكرة حتى يغادر آخر ضيف. | keep |  |  |  |
| `c:categories:categories[events-hospitality].intro` | One team takes your event from the concept and the décor through production to the guest's experience on the day: conferences and summits, exhibitions, launches, galas and heritage hospitality. | فريق واحد يرافق مناسبتك من الفكرة والديكور والإنتاج حتى استقبال الضيوف يوم الحدث: مؤتمرات وقمم، ومعارض، وحفلات إطلاق، وحفلات رسمية، وضيافة تراثية. | §4: one 33-word sentence, the list at the end. What, then who does what | Conferences, stands, launches, galas and heritage welcomes. One team draws the concept, dresses the room, runs the stage and looks after your guests on the day. | مؤتمرات وأجنحة وحفلات إطلاق وحفلات رسمية واستقبال تراثي. فريق واحد يضع الفكرة، ويجهّز القاعة، ويدير المسرح، ويهتمّ بضيوفكم يوم الحدث. | p4 "concept · décor · production · guest experience" |
| `c:categories:categories[events-hospitality].faq[0].q` | Which events do you run? | ما أنواع الفعاليات التي تنظّمونها؟ | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[0].a` | Conferences and summits, exhibitions, product launches and brand activations, galas, weddings and private celebrations, and ceremonies and award nights, for companies, government entities and private clients. | مؤتمرات وقمم، ومعارض، وإطلاق منتجات وتفعيل علامات تجارية، وحفلات رسمية وأعراس ومناسبات خاصة، وحفلات تكريم وليالي جوائز. نعمل للشركات والجهات الحكومية والأفراد. | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[1].q` | Can one team handle the décor, the catering and the stage? | هل يتولى فريق واحد الديكور والضيافة والمسرح؟ | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[1].a` | Yes. Concept, décor, production and guest experience sit with one team, so the décor, the hospitality and the technical crew work to one plan. | نعم. الفكرة والديكور والإنتاج واستقبال الضيوف كلها عند فريق واحد، فيعمل فريق الديكور وفريق الضيافة والفريق التقني على خطة واحدة. | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[2].q` | Do you offer heritage hospitality? | هل تقدّمون الضيافة التراثية؟ | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[2].a` | Yes: majlis setups, desert tents, Arabic coffee service, heritage carts, live stations and welcome ceremonies. | نعم: نجهّز المجالس والخيام الصحراوية، ونقدّم القهوة العربية، ومعها العربات التراثية، ومحطات طهي أمام الضيوف، ومراسم الاستقبال. | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[3].q` | Where do you work? | أين تعملون؟ | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[3].a` | We're based in Dubai and work across six markets: the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. For other locations, ask us. | مقرّنا في دبي، ونعمل في ستة أسواق: الإمارات والسعودية وقطر وعُمان والكويت ومصر. ولأي مكان آخر، اسألنا. | Owner rule 1 (AR); EN keep | (keep) | مقرّنا في دبي، ونعمل في ستة أسواق: الإمارات والسعودية وقطر وعُمان والكويت ومصر. ولأي مكان آخر، اسألونا. | ⚑ FC#1 |
| `c:categories:categories[events-hospitality].faq[4].q` | How many guests can you host? | كم ضيفًا يمكنكم استقبالُه؟ | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[4].a` | From intimate gatherings to award nights and large corporate and government events. Tell us your guest count and we'll plan around it. | من اللقاءات العائلية الخاصة إلى ليالي الجوائز والفعاليات الكبرى للشركات والجهات الحكومية. أخبرنا بعدد ضيوفك، ونخطّط على أساسه. | Owner rule 1 (AR); EN keep | (keep) | من اللقاءات العائلية الخاصة إلى ليالي الجوائز والفعاليات الكبرى للشركات والجهات الحكومية. أخبرونا بعدد ضيوفكم، ونخطّط على أساسه. | ⚑ FC#5 |
| `c:categories:categories[events-hospitality].faq[5].q` | How far ahead should I book? | متى ينبغي أن أحجز؟ | Owner rule 1 (AR) | (keep) | متى ينبغي أن نحجز؟ |  |
| `c:categories:categories[events-hospitality].faq[5].a` | It depends on the scale of the event. Share your date and we'll confirm availability. | يتوقّف ذلك على حجم المناسبة. أرسل لنا الموعد، ونؤكّد لك إن كان متاحًا. | A real lead time is the specific the guide asks for; until Rand gives one, today's line (AR plural) | (keep) → with Rand's numbers: "For a wedding, [placeholder: weeks] ahead is comfortable; for a conference, [placeholder: months]. Share your date and we'll tell you honestly." | يتوقّف ذلك على حجم المناسبة. أرسلوا لنا الموعد، ونؤكّد لكم إن كان متاحًا. | ⚑ FC#6: placeholders never ship |
| `c:categories:categories[events-hospitality].faq[6].q` | Can you photograph and film the event? | هل تصوّرون الفعالية؟ | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[6].a` | Yes. Event coverage is part of our Creative Production services: photography and video, from the shoot to the final edit. | نعم. تغطية الفعاليات جزء من خدمات الإنتاج الإبداعي لدينا: التصوير الفوتوغرافي والفيديو، من التصوير حتى المونتاج النهائي. | keep |  |  |  |
| `c:categories:categories[events-hospitality].faq[7].q` | What do you need from me to start? | ماذا تحتاجون مني للبدء؟ | Owner rule 1 (AR) | (keep) | ماذا تحتاجون منّا للبدء؟ |  |
| `c:categories:categories[events-hospitality].faq[7].a` | Tell us the date, the type of event, the city and roughly how many guests. We'll come back with a concept and a proposal. | أخبرنا بالموعد ونوع المناسبة والمدينة والعدد التقريبي للضيوف، ونعود إليك بتصوّر وعرض. | Owner rule 1 (AR); EN keep. A promise (a concept with the proposal) | (keep) | أخبرونا بالموعد ونوع المناسبة والمدينة والعدد التقريبي للضيوف، ونعود إليكم بتصوّر وعرض. | ⚑ R3 (a concept comes with every proposal) |
| `c:categories:categories[events-hospitality].closing` | Tell us the date. We'll ready the room. | أخبرنا بالموعد، ونجهّز لك القاعة. | Owner rule 1 (AR); EN keep | (keep) | أخبرونا بالموعد، ونجهّز لكم القاعة. |  |
| `c:services:services[conferences-summits].title` | Conferences & summits | المؤتمرات والقمم | keep |  |  |  |
| `c:services:services[conferences-summits].summary` | Programme, venue, speakers and the running of the day, planned as one. | البرنامج والمكان والمتحدثون وسير اليوم، في خطة واحدة. | keep |  |  |  |
| `c:services:services[conferences-summits].imageAlt` | White roses and blue hydrangeas on a dressed table, lit by candles. | ورود بيضاء وزهور كوبية زرقاء على طاولة مزيّنة، تضيئها الشموع. | keep |  |  |  |
| `c:services:services[conferences-summits].points[0]` | Programme and running order | البرنامج وتسلسل الفقرات | keep |  |  |  |
| `c:services:services[conferences-summits].points[1]` | Venue and room layout | اختيار المكان وتوزيع القاعة | keep |  |  |  |
| `c:services:services[conferences-summits].points[2]` | Speaker and guest care | استقبال المتحدثين ورعاية الضيوف | keep |  |  |  |
| `c:services:services[conferences-summits].points[3]` | Event branding on site | هوية الحدث في أرجاء المكان | keep |  |  |  |
| `c:services:services[conferences-summits].points[4]` | Ceremonies and award nights | حفلات التكريم وليالي الجوائز | keep |  |  |  |
| `c:services:services[exhibitions-booths].title` | Exhibitions & booths | المعارض والأجنحة | keep |  |  |  |
| `c:services:services[exhibitions-booths].summary` | Stands designed, built and staffed to draw people in. | أجنحة نصمّمها ونبنيها ونديرها لتجذب الزوّار. | keep |  |  |  |
| `c:services:services[exhibitions-booths].points[0]` | Stand concept and design | فكرة الجناح وتصميمه | keep |  |  |  |
| `c:services:services[exhibitions-booths].points[1]` | Fabrication and installation | التصنيع والتركيب | keep |  |  |  |
| `c:services:services[exhibitions-booths].points[2]` | Mall and exhibition stands | أجنحة المراكز التجارية والمعارض | keep |  |  |  |
| `c:services:services[exhibitions-booths].points[3]` | Staffing on the stand | فريق عمل الجناح | keep |  |  |  |
| `c:services:services[exhibitions-booths].points[4]` | On-site PR management | إدارة العلاقات العامة في أرض الحدث | keep |  |  |  |
| `c:services:services[product-launches-activations].title` | Product launches & brand activations | إطلاق المنتجات وتفعيل العلامات | keep |  |  |  |
| `c:services:services[product-launches-activations].summary` | Launches and brand activations in malls, venues and exhibitions, including technology and robotics experiences. | إطلاقات وتفعيلات للعلامات في المراكز التجارية والقاعات والمعارض، ومعها عروض تفاعلية بالتقنية والروبوتات. | keep |  |  |  |
| `c:services:services[product-launches-activations].points[0]` | Launch concept and the reveal | فكرة الإطلاق ولحظة الكشف | keep |  |  |  |
| `c:services:services[product-launches-activations].points[1]` | Brand activations in malls and venues | تفعيل العلامات في المراكز التجارية والقاعات | keep |  |  |  |
| `c:services:services[product-launches-activations].points[2]` | Technology and robotics experiences | عروض تفاعلية بالتقنية والروبوتات | keep |  |  |  |
| `c:services:services[product-launches-activations].points[3]` | Sponsor activations | تفعيلات الرعاة | keep |  |  |  |
| `c:services:services[product-launches-activations].points[4]` | Branded environments | مساحات بهوية العلامة | keep |  |  |  |
| `c:services:services[galas-private-celebrations].title` | Galas & private celebrations | الحفلات والاحتفالات الخاصة | keep |  |  |  |
| `c:services:services[galas-private-celebrations].summary` | Galas, weddings, baby receptions and intimate gatherings: theming, décor, florals, keepsakes and the full day. | حفلات رسمية وأعراس واستقبال مواليد ولقاءات عائلية خاصة: الفكرة والديكور والزهور والتذكارات، وتنفيذ اليوم كاملًا. | keep |  |  |  |
| `c:services:services[galas-private-celebrations].points[0]` | Concept decks and theming | ملف الفكرة واختيار الطابع | keep |  |  |  |
| `c:services:services[galas-private-celebrations].points[1]` | Gala and wedding décor | ديكور الحفلات والأعراس | keep |  |  |  |
| `c:services:services[galas-private-celebrations].points[2]` | Floral design and styling | تصميم الزهور وتنسيق المكان | keep |  |  |  |
| `c:services:services[galas-private-celebrations].points[3]` | Giveaways and keepsakes | الهدايا والتذكارات | keep |  |  |  |
| `c:services:services[galas-private-celebrations].points[4]` | Photobooths and guest moments | ركن التصوير ولحظات الضيوف | keep |  |  |  |
| `c:services:services[galas-private-celebrations].points[5]` | Full on-day production | تنفيذ اليوم كاملًا | keep |  |  |  |
| `c:services:services[catering-heritage-hospitality].title` | Catering & heritage hospitality | الضيافة والمجالس التراثية | keep |  |  |  |
| `c:services:services[catering-heritage-hospitality].summary` | Private and corporate catering, signature desserts and beverages, majlis setups, desert tents and Arabic coffee service. | ضيافة للمناسبات الخاصة وللشركات، وحلويات ومشروبات بتوقيعنا، ومجالس وخيام صحراوية تُقدَّم فيها القهوة العربية. | keep |  |  |  |
| `c:services:services[catering-heritage-hospitality].points[0]` | Majlis setups and desert tents | تجهيز المجالس والخيام الصحراوية | keep |  |  |  |
| `c:services:services[catering-heritage-hospitality].points[1]` | Arabic coffee and welcome ceremonies | القهوة العربية ومراسم الاستقبال | keep |  |  |  |
| `c:services:services[catering-heritage-hospitality].points[2]` | Heritage carts and live stations | العربات التراثية ومحطات الطهي أمام الضيوف | keep |  |  |  |
| `c:services:services[catering-heritage-hospitality].points[3]` | Signature desserts and beverages | حلويات ومشروبات بتوقيعنا | keep |  |  |  |
| `c:services:services[catering-heritage-hospitality].points[4]` | Buffet and table styling | تنسيق البوفيه والطاولات | keep |  |  |  |
| `c:services:services[catering-heritage-hospitality].points[5]` | Private service and boardroom hospitality | الخدمة الخاصة وضيافة مجالس الإدارة | keep |  |  |  |
| `c:services:services[stage-technical-production].title` | Stage & technical production | الإنتاج الفني والتقني للمسرح | keep |  |  |  |
| `c:services:services[stage-technical-production].summary` | Stage, sound, light and screens, rigged and run by one crew. | المسرح والصوت والإضاءة والشاشات، يجهّزها ويديرها فريق واحد. | keep |  |  |  |
| `c:services:services[stage-technical-production].points[0]` | Stage design | تصميم المسرح | keep |  |  |  |
| `c:services:services[stage-technical-production].points[1]` | Rigging | تركيب الهياكل وتعليق المعدات | keep |  |  |  |
| `c:services:services[stage-technical-production].points[2]` | Live sound | الصوت المباشر | keep |  |  |  |
| `c:services:services[stage-technical-production].points[3]` | Lighting | الإضاءة | keep |  |  |  |
| `c:services:services[stage-technical-production].points[4]` | Screens | الشاشات | keep |  |  |  |
| `c:services:services[stage-technical-production].points[5]` | Technical setup, run by one crew | تجهيز تقني يديره فريق واحد | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.conferences-summits` | The whole day on one running order, from the first badge to the closing ceremony. | اليوم كله على برنامج واحد، من أول بطاقة تسجيل حتى حفل الختام. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.exhibitions-booths` | A stand people step into, drawn, built and staffed by the same team. | جناح يدخله الزوّار، يرسمه ويبنيه ويديره فريق واحد. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.product-launches-activations` | The reveal lasts a few seconds. We build everything that leads up to it. | لحظة الكشف ثوانٍ معدودة، ونحن نبني كل ما يسبقها. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.galas-private-celebrations` | An evening guests remember, from the first flower to the last keepsake. | أمسية تبقى في ذاكرة ضيوفك، من أول زهرة حتى آخر تذكار. | §3: "an evening guests remember" is "unforgettable" in other words. Owner: the keepsake is offered, not promised | We choose the theme, dress the tables, set the flowers and, if you'd like, prepare a keepsake for every guest. | نختار طابع الأمسية، ونجهّز الطاولات والزهور، ونعدّ تذكارًا تودّعون به ضيوفكم إن أردتم. | p9–p11 (theming, décor, florals, keepsakes) |
| `c:service-hooks:SERVICE_HOOKS.catering-heritage-hospitality` | Coffee poured the way your guests expect, in a majlis set before they arrive. | قهوة تُصبّ كما يعرفها ضيوفك، في مجلس جاهز قبل وصولهم. | Owner rule 1 (AR); EN keep | (keep) | قهوة تُصبّ كما يعرفها ضيوفكم، في مجلس جاهز قبل وصولهم. |  |
| `c:service-hooks:SERVICE_HOOKS.stage-technical-production` | Sound, light and screens on one cue sheet, run by the crew that rigged them. | الصوت والإضاءة والشاشات على جدول إشارات واحد، يديره الفريق الذي ركّبها. | keep |  |  |  |
| `c:photo-stories:PRIVATE_STACK.label` | Private celebrations | المناسبات الخاصة | keep |  |  |  |
| `c:photo-stories:PRIVATE_STACK.lead` | A wedding, an engagement, a family evening? Tell us the date and the guest count, and we'll carry it from the first sketch to the last candle. | زفاف أو خطوبة أو أمسية عائلية؟ أخبرنا بالموعد وعدد الضيوف، ونتولّى كل شيء من أول تصوّر حتى آخر شمعة. | §3: a question answered by the next line; owner rule 1 | Weddings, engagements, family evenings. Tell us the date and the guest count, and we'll carry it from the first sketch to the last candle. | أعراس وخطوبات وأمسيات عائلية. أخبرونا بالموعد وعدد الضيوف، ونتولّى كل شيء من أول تصوّر حتى آخر شمعة. | p11 (full on-day production) |
| `c:photo-stories:PRIVATE_STACK.cta` | Plan your celebration | خطّط لمناسبتك معنا | D-C1 (owner): a marketing call to action, so the plural command | (keep) | خطّطوا لمناسبتكم معنا |  |
| `c:photo-stories:PRIVATE_STACK.whatsapp` | Message us on WhatsApp | راسلنا على واتساب | D-C1 (owner): a marketing call to action, so the plural command | (keep) | راسلونا على واتساب |  |
| `c:photo-stories:PRIVATE_STACK.prefill` | Hello NO TIME, I'm planning a private celebration and would like to talk it through. | مرحبًا NO TIME، أخطّط لمناسبة خاصة وأودّ أن نتحدّث عنها. | keep |  |  |  |
| `c:photo-stories:PRIVATE_STACK.cards[0].caption` | The table, in your colours | طاولتك، بألوانك | Owner rule 1 | (keep) | طاولتكم، بألوانكم |  |
| `c:photo-stories:PRIVATE_STACK.cards[1].caption` | A reception to remember | استقبال يبقى في الذاكرة | §3 ("to remember" = unforgettable) | The welcome at the door | الاستقبال عند المدخل |  |
| `c:photo-stories:PRIVATE_STACK.cards[2].caption` | Outdoors, after sunset | في الهواء الطلق، بعد الغروب | keep |  |  |  |
| `c:photo-stories:PRIVATE_STACK.cards[3].caption` | A keepsake for every guest | تذكار لكل ضيف | Owner: a keepsake for every guest reads as a promise | Keepsakes for the guests | تذكارات للضيوف |  |
| `c:photo-stories:ROOM_STORY.eyebrow` | From our events | من فعالياتنا | keep |  |  |  |
| `c:photo-stories:ROOM_STORY.title` | Every detail passes through the same team. | كل تفصيلة تمرّ على الفريق نفسه. | Choice 1: the intro on this page already says it | How a room comes together. | هكذا تكتمل القاعة. |  |
| `c:photo-stories:ROOM_STORY.beats[0].title` | The rig goes up. | يُنصب المسرح. | keep |  |  |  |
| `c:photo-stories:ROOM_STORY.beats[0].body` | Truss, sound and light, built and tested by our crew before anything else enters the room. | الهياكل والصوت والإضاءة، يركّبها طاقمنا ويختبرها قبل أن يدخل القاعة أي شيء آخر. | keep |  |  |  |
| `c:photo-stories:ROOM_STORY.beats[1].title` | The room is dressed. | تكتمل القاعة. | keep |  |  |  |
| `c:photo-stories:ROOM_STORY.beats[1].body` | Tables, lanterns, florals and candlelight, set to one plan and one colour story. | الطاولات والفوانيس والزهور وضوء الشموع، على مخطّط واحد وألوان متناغمة. | keep |  |  |  |
| `c:photo-stories:ROOM_STORY.beats[2].title` | The welcome is ready. | الضيافة جاهزة. | keep |  |  |  |
| `c:photo-stories:ROOM_STORY.beats[2].body` | Arabic coffee, heritage carts and the menu, served in front of the guests. | القهوة العربية وعربات الضيافة التراثية وقائمة الطعام، تُقدَّم أمام الضيوف. | keep |  |  |  |
| `c:photo-stories:ROOM_STORY.beats[3].title` | The doors open. | تُفتح الأبواب. | keep |  |  |  |
| `c:photo-stories:ROOM_STORY.beats[3].body` | The team that planned the evening runs it, until the last guest leaves. | الفريق الذي خطّط للأمسية يديرها بنفسه، حتى يغادر آخر ضيف. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.rig.alt` | A ballroom stage with its truss going up before an event. | مسرح قاعة احتفالات وهيكله المعدني قيد التركيب قبل الفعالية. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.hall.alt` | A glass-roofed hall set with long candlelit tables under woven lanterns. | قاعة بسقف زجاجي، بطاولات طويلة على ضوء الشموع تحت فوانيس منسوجة. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.table.alt` | A long dining table laid with crystal, candles and low florals. | طاولة عشاء طويلة بالكريستال والشموع وتنسيقات زهور منخفضة. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.cart.alt` | A carved heritage cart with brass coffee pots and dates. | عربة ضيافة تراثية منقوشة، عليها دلال نحاسية وتمر. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.florals.alt` | White roses and blue hydrangeas on a dressed table, lit by candles. | ورود بيضاء وزهور كوبية زرقاء على طاولة مزيّنة، تضيئها الشموع. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.buffet.alt` | A buffet styled with crystal and gold service. | بوفيه منسّق بأوانٍ من الكريستال والذهبي. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.tent.alt` | A desert tent at night, its floor laid with carpets. | خيمة في الصحراء ليلًا، أرضها مفروشة بالسجاد. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.terrace.alt` | A terrace with a white floral installation among palms. | شرفة يتوسّطها تنسيق زهور أبيض بين أشجار النخيل. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.dessert.alt` | A reception dessert table with a silver candelabra. | طاولة حلويات لحفل استقبال، يتوسّطها شمعدان فضي. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.runner.alt` | Candles and hydrangeas along a table runner. | شموع وزهور كوبية على امتداد مفرش الطاولة. | keep |  |  |  |
| `c:photo-stories:STORY_PHOTOS.keepsake.alt` | A bouquet wrapped as a keepsake for guests. | باقة زهور مغلّفة تذكارًا للضيوف. | keep |  |  |  |
| `c:photo-stories:STRIP.eyebrow` | From our events | من فعالياتنا | keep |  |  |  |
| `c:photo-stories:STRIP.title` | Rooms we dressed, tables we set. | قاعات جهّزناها، وطاولات نسّقناها. | keep |  |  |  |
| `c:photo-stories:STRIP.frames[0].caption` | Gala dinner | عشاء احتفالي | keep |  |  |  |
| `c:photo-stories:STRIP.frames[1].caption` | Heritage hospitality | ضيافة تراثية | keep |  |  |  |
| `c:photo-stories:STRIP.frames[2].caption` | Table styling | تنسيق الطاولات | keep |  |  |  |
| `c:photo-stories:STRIP.frames[3].caption` | Stage and technical | المسرح والتجهيزات الفنية | keep |  |  |  |
| `c:photo-stories:STRIP.frames[4].caption` | Florals and décor | الزهور والديكور | keep |  |  |  |
| `c:photo-stories:STRIP.frames[5].caption` | Desert majlis | مجلس في الصحراء | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.title` | A conference day, slot by slot | يوم المؤتمر، فقرة بعد فقرة | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.note` | A typical day. Under each slot, what our team runs while it happens. | يوم نموذجي، وتحت كل فقرة ما يتولّاه فريقنا في أثنائها. | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[0].label` | Registration and welcome coffee | التسجيل وقهوة الاستقبال | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[0].handled` | Badges, check-in desks, the welcome team | البطاقات ومكاتب التسجيل وفريق الاستقبال | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[1].label` | Opening and keynote | الافتتاح والكلمة الرئيسية | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[1].handled` | Stage, sound, the speaker's walk-on | المسرح والصوت ودخول المتحدث | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[2].label` | Panel discussion | جلسة حوارية | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[2].handled` | Microphones, timing cues, the moderator's notes | الميكروفونات وإشارات الوقت وملاحظات المحاور | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[3].label` | Coffee break | استراحة القهوة | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[3].handled` | Hospitality stations, the room turned around | محطات الضيافة، وإعادة تجهيز القاعة | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[4].label` | Breakout sessions | جلسات متوازية | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[4].handled` | Signage, room changes, speaker care | اللوحات الإرشادية وتنقّل القاعات ورعاية المتحدثين | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[5].label` | Lunch | الغداء | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[5].handled` | Catering, table styling, the buffet's service | الضيافة وتنسيق الطاولات وخدمة البوفيه | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[6].label` | Awards and closing | التكريم والختام | keep |  |  |  |
| `c:modules/agenda-timeline:AGENDA.slots[6].handled` | The ceremony's running order, trophies, photography | تسلسل الحفل والجوائز والتصوير | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.title` | Set the mood | اختر الأجواء | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | اختيار الأجواء |  |
| `c:modules/candle-moodboard:MOODBOARD.note` | Photos from NO TIME events. The three moods are examples of where a concept deck starts. | صور من فعاليات نظّمتها NO TIME، والأجواء الثلاث أمثلة على بداية ملف الفكرة. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moodsLabel` | Mood | الأجواء | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.paletteLabel` | Palette | الألوان | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.floralsLabel` | Florals | الزهور | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.keepsakeLabel` | Keepsake | التذكار | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.status` | {mood}: {line} | {mood}: {line} | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].label` | Gala | حفل رسمي | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].line` | Long tables, low light, a room that glows from the centre. | طاولات طويلة وإضاءة خافتة، وقاعة يشعّ نورها من وسطها. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].swatches[0].name` | Espresso | بنّي داكن | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].swatches[1].name` | Champagne | شمبانيا | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].swatches[2].name` | Taupe | رملي | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].florals` | Low runners of hydrangea between candles | زهور كوبية منخفضة على امتداد الطاولة بين الشموع | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].keepsake` | A printed menu with each guest's name | قائمة طعام مطبوعة باسم كل ضيف | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].photos[0].alt` | A glass-roofed hall set with long candlelit tables under woven lanterns. | قاعة بسقف زجاجي، بطاولات طويلة على ضوء الشموع تحت فوانيس منسوجة. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].photos[1].alt` | Candles and hydrangeas along a table runner. | شموع وزهور كوبية على امتداد مفرش الطاولة. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[gala].photos[2].alt` | A buffet styled with crystal and gold service. | بوفيه منسّق بأوانٍ من الكريستال والذهبي. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[wedding].label` | Wedding | زفاف | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[wedding].line` | White florals, candlelight and an entrance guests remember. | زهور بيضاء وضوء شموع، ومدخل يبقى في ذاكرة الضيوف. | §3 ("an entrance guests remember") | White florals, candlelight and an entrance dressed in roses. | زهور بيضاء وضوء شموع، ومدخل تزيّنه الورود. |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[wedding].swatches[0].name` | Ivory | عاجي | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[wedding].florals` | White roses and tall arrangements at the entrance | ورود بيضاء وتنسيقات عالية عند المدخل | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[wedding].keepsake` | A wrapped bouquet for each guest | باقة مغلّفة لكل ضيف | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[wedding].photos[0].alt` | White roses and blue hydrangeas on a dressed table, lit by candles. | ورود بيضاء وزهور كوبية زرقاء على طاولة مزيّنة، تضيئها الشموع. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[wedding].photos[1].alt` | An entrance arrangement of white flowers and candles on a marble floor. | تنسيق زهور بيضاء وشموع عند المدخل، على أرضية رخامية. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[wedding].photos[2].alt` | A bouquet wrapped as a keepsake for guests. | باقة زهور مغلّفة تذكارًا للضيوف. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[intimate].label` | Intimate | عائلي | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[intimate].line` | A small gathering, a dessert table, a terrace at dusk. | لقاء صغير، وطاولة حلويات، وشرفة عند الغروب. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[intimate].swatches[1].name` | Cocoa | كاكاو | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[intimate].florals` | One white installation, open air | تنسيق أبيض واحد في الهواء الطلق | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[intimate].keepsake` | Boxed sweets to take home | علب حلوى يأخذها الضيوف معهم | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[intimate].photos[0].alt` | A reception dessert table with a silver candelabra. | طاولة حلويات لحفل استقبال، يتوسّطها شمعدان فضي. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[intimate].photos[1].alt` | A terrace with a white floral installation among palms. | شرفة يتوسّطها تنسيق زهور أبيض بين أشجار النخيل. | keep |  |  |  |
| `c:modules/candle-moodboard:MOODBOARD.moods[intimate].photos[2].alt` | A dessert table dressed with florals. | طاولة حلويات مزيّنة بالزهور. | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.title` | The moment of the reveal | لحظة الكشف | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.note` | Start the reveal, then switch the setting. Every format leads to the same five seconds. | ابدأ الكشف، ثم بدّل المكان. كل صيغة تقود إلى الثواني الخمس نفسها. | Owner rule 1 (AR); EN keep | (keep) | ابدؤوا الكشف، ثم بدّلوا المكان. كل صيغة تقود إلى الثواني الخمس نفسها. |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.start` | Start the reveal | ابدأ الكشف | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | بدء الكشف |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.skip` | Skip the countdown | تخطَّ العدّ التنازلي | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | تخطّي العدّ التنازلي |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.reset` | Close the curtain | أسدل الستارة | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | إسدال الستارة |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.productLabel` | Your product | منتجك | Owner rule 1 | (keep) | منتجكم |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.formatsLabel` | Setting | المكان | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.formats[mall].label` | Mall | مركز تجاري | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.formats[mall].line` | A stage in the atrium, seen from every level. | منصة في البهو، تراها كل الطوابق. | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.formats[venue].label` | Venue | قاعة | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.formats[venue].line` | A seated room, lights down, one spot on the plinth. | قاعة بمقاعدها، والأضواء خافتة إلا بقعة واحدة على المنصة. | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.formats[exhibition].label` | Exhibition | معرض | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.formats[exhibition].line` | A stand built around the reveal, with visitors gathered at the front. | جناح مبني حول لحظة الكشف، والزوّار يتجمّعون أمامه. | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.status.start` | The reveal starts in 5 seconds. | يبدأ الكشف بعد 5 ثوانٍ. | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.status.done` | Revealed. | تمّ الكشف. | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.status.closed` | Curtain closed. | أُسدلت الستارة. | keep |  |  |  |
| `c:modules/launch-reveal:LAUNCH_REVEAL.status.format` | Setting: {format}. {line} | المكان: {format}. {line} | keep |  |  |  |
| `c:modules/menu-majlis:MENU.title` | The hospitality menu | قائمة الضيافة | keep |  |  |  |
| `c:modules/menu-majlis:MENU.subtitle` | Private and corporate occasions | للمناسبات الخاصة والشركات | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[0].title` | The welcome | الاستقبال | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[0].items[0]` | Arabic coffee, poured at the door | القهوة العربية تُقدَّم عند الباب | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[0].items[1]` | Welcome ceremonies | مراسم الاستقبال | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[1].title` | The majlis | المجلس | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[1].items[0]` | Majlis setups | تجهيز المجالس | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[1].items[1]` | Desert tents | الخيام الصحراوية | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[2].title` | Made in front of guests | أمام الضيوف | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[2].items[0]` | Heritage carts | العربات التراثية | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[2].items[1]` | Live cooking stations | محطات الطهي الحيّة | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[3].title` | Desserts and drinks | الحلويات والمشروبات | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[3].items[0]` | Signature desserts | حلويات مميّزة | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[3].items[1]` | Signature beverages | مشروبات مميّزة | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[4].title` | The service | الخدمة | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[4].items[0]` | Buffet and table styling | تنسيق البوفيه والطاولات | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[4].items[1]` | Private service | الخدمة الخاصة | keep |  |  |  |
| `c:modules/menu-majlis:MENU.sections[4].items[2]` | Boardroom hospitality | ضيافة مجالس الإدارة | keep |  |  |  |
| `c:modules/menu-majlis:MENU.footer` | Composed for each occasion. | تُعدّ لكل مناسبة على حدة. | keep |  |  |  |
| `c:modules/menu-majlis:MENU.photosNote` | From our heritage setups | من تجهيزاتنا التراثية | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.title` | Light the stage | أضئ المسرح | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | إضاءة المسرح |  |
| `c:modules/stage-lights:STAGE_LIGHTS.note` | An example rig in four groups. Switch each one, or run the cues as the crew would on the night. | منظومة إضاءة نموذجية من أربع مجموعات. تحكّم في كل مجموعة بنفسك، أو شغّل الإشارات كما يفعل الفريق ليلة الحدث. | Owner rule 1 (AR); EN keep | (keep) | منظومة إضاءة نموذجية من أربع مجموعات. تحكّموا في كل مجموعة بأنفسكم، أو شغّلوا الإشارات كما يفعل الفريق ليلة الحدث. |  |
| `c:modules/stage-lights:STAGE_LIGHTS.groupsLabel` | Light groups | مجموعات الإضاءة | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.groups[wash].label` | Wash | الإضاءة العامة | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.groups[spots].label` | Spots | الإضاءة المركّزة | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.groups[back].label` | Back light | الإضاءة الخلفية | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.groups[screen].label` | Screen | الشاشة | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.cues[0].label` | Walk-in: the wash comes up | دخول الضيوف: الإضاءة العامة | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.cues[1].label` | Screen up | تشغيل الشاشة | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.cues[2].label` | Back light for the stage | الإضاءة الخلفية للمسرح | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.cues[3].label` | Spot on the speaker | الإضاءة المركّزة على المتحدث | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.run` | Run the cues | شغّل الإشارات | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | تشغيل الإشارات |  |
| `c:modules/stage-lights:STAGE_LIGHTS.stop` | Stop the cues | أوقف الإشارات | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | إيقاف الإشارات |  |
| `c:modules/stage-lights:STAGE_LIGHTS.status.on` | {group} on, {n} of {total} groups | {group}: تعمل، {n} من {total} مجموعات | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.status.off` | {group} off, {n} of {total} groups | {group}: متوقفة، {n} من {total} مجموعات | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.status.start` | Cue sequence running | تسلسل الإشارات يعمل | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.status.cue` | Cue {n} of {total}: {cue} | الإشارة {n} من {total}: {cue} | keep |  |  |  |
| `c:modules/stage-lights:STAGE_LIGHTS.status.stopped` | Cues stopped | توقّفت الإشارات | keep |  |  |  |
| `c:modules/stand-assembly:STAND.title` | A stand, built in six steps | جناح يُبنى في ست خطوات | keep |  |  |  |
| `c:modules/stand-assembly:STAND.note` | An example stand, assembled in the order our crew builds it. | جناح نموذجي يُركَّب بالترتيب الذي يبنيه به فريقنا. | keep |  |  |  |
| `c:modules/stand-assembly:STAND.stepLabel` | Step {n} of {total} | الخطوة {n} من {total} | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[floor].label` | Raised floor | الأرضية المرتفعة | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[floor].line` | Levelled, with the cabling run underneath. | مستوية، وتمرّ التمديدات من تحتها. | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[walls].label` | Walls | الجدران | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[walls].line` | Built in the workshop, assembled on the floor. | تُصنع في الورشة، وتُركَّب في أرض المعرض. | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[counter].label` | Counter | منصة الاستقبال | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[counter].line` | Where the stand team meets visitors. | حيث يلتقي فريق الجناح بالزوّار. | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[lighting].label` | Lighting | الإضاءة | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[lighting].line` | A header beam and downlights on the counter. | عارضة علوية وإضاءة موجّهة نحو منصة الاستقبال. | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[graphics].label` | Graphics | التصاميم المطبوعة | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[graphics].line` | Printed panels in the brand's identity. | ألواح مطبوعة بهوية العلامة. | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[screen].label` | Screen | الشاشة | keep |  |  |  |
| `c:modules/stand-assembly:STAND.parts[screen].line` | Content made to be read across the aisle. | محتوى يُقرأ من الممر المقابل. | keep |  |  |  |
| `new:c:categories:categories[events-hospitality].metaTitle` | (new) | (new) | SEO: people search "event management Dubai" / «تنظيم فعاليات دبي». A new field: the card title and the H1 stay | Events & hospitality in Dubai | تنظيم الفعاليات والضيافة في دبي | p3 |
| `new:c:categories:categories[events-hospitality].metaDescription` | (new) | (new) | SEO: the card summary (95 chars, no place) is also the meta today. A new field; the card keeps its line | Conferences, stands, launches, weddings and majlis hospitality, planned in Dubai and run on the day by the same team, until the last guest leaves. | مؤتمرات وأجنحة معارض وحفلات إطلاق وأعراس ومجالس ضيافة، نخطّط لها من دبي ويديرها الفريق نفسه يوم الحدث حتى يغادر آخر ضيف. | p4–p11, p31 |

## Category: creative-production

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:scenes.creative.s1` | A black box. Nothing in frame yet. | مساحة سوداء، ولا شيء في الكادر بعد. | keep |  |  |  |
| `m:scenes.creative.s2` | Take one. | اللقطة الأولى. | keep |  |  |  |
| `m:scenes.creative.s3` | Every frame is planned before we roll. | كل كادر نخطّط له قبل أن نبدأ التصوير. | keep |  |  |  |
| `m:scenes.creative.s4` | Then, the final frame. | ثم يأتي الكادر الأخير. | §3 vague; after N06 this line leads the hero | Then the final cut, ready to show. | ثم النسخة النهائية، جاهزة للعرض. |  |
| `c:categories:categories[creative-production].title` | Creative Production | الإنتاج الإبداعي | keep |  |  |  |
| `c:categories:categories[creative-production].summary` | Photo, film, motion and AI content, with the sets and equipment to make it. | صورة وفيلم وموشن ومحتوى بالذكاء الاصطناعي، ومعها الديكور والمعدّات التي تصنعها. | keep |  |  |  |
| `c:categories:categories[creative-production].intro` | Photography, video, motion graphics and AI content, with the sets and the equipment behind them. We cover events on the ground, shoot products and food, and take every piece through editing, sound and post-production. | تصوير فوتوغرافي وفيديو وموشن جرافيك ومحتوى بالذكاء الاصطناعي، ومعها الديكورات والمعدّات اللازمة. نغطّي الفعاليات في أرض الحدث، ونصوّر المنتجات والأطباق، ونتابع كل عمل حتى المونتاج وتصميم الصوت ومرحلة ما بعد الإنتاج. | keep |  |  |  |
| `c:categories:categories[creative-production].faq[0].q` | Do you cover events with photo and video? | هل تغطّون الفعاليات بالصور والفيديو؟ | keep |  |  |  |
| `c:categories:categories[creative-production].faq[0].a` | Yes. We photograph and film on the ground, then edit the material for your channels. | نعم. نصوّر الفعالية صورًا وفيديو في أرض الحدث، ثم نجهّز المادة بالمونتاج لتناسب قنواتك. | Owner rule 1 (AR) | (keep) | نعم. نصوّر الفعالية صورًا وفيديو في أرض الحدث، ثم نجهّز المادة بالمونتاج لتناسب قنواتكم. |  |
| `c:categories:categories[creative-production].faq[1].q` | Do you make images and video with AI? | هل تصنعون الصور والفيديو بالذكاء الاصطناعي؟ | keep |  |  |  |
| `c:categories:categories[creative-production].faq[1].a` | Yes: AI video ads and short videos, cinematic AI video, and AI imagery and key visuals for campaigns, art-directed to your brand. | نعم: إعلانات فيديو ومقاطع قصيرة، وفيديو سينمائي، وصور ومرئيات رئيسية للحملات، كلها بالذكاء الاصطناعي وبتوجيه فني يلتزم بهويتك. | Owner rule 1 | (keep) | نعم: إعلانات فيديو ومقاطع قصيرة، وفيديو سينمائي، وصور ومرئيات رئيسية للحملات، كلها بالذكاء الاصطناعي وبتوجيه فني يلتزم بهويتكم. |  |
| `c:categories:categories[creative-production].faq[2].q` | Do you style and shoot food and products? | هل تنسّقون الأطباق وتصوّرون المنتجات؟ | keep |  |  |  |
| `c:categories:categories[creative-production].faq[2].a` | Yes: food styling, product photography and cinematic product films. | نعم: تنسيق الأطباق وتصويرها، وتصوير المنتجات، وأفلام سينمائية للمنتجات. | keep |  |  |  |
| `c:categories:categories[creative-production].faq[3].q` | Do you handle editing and sound? | هل تتولّون المونتاج والصوت؟ | keep |  |  |  |
| `c:categories:categories[creative-production].faq[3].a` | Yes. We take each video from the script and the shoot to the final edit, colour and sound. | نعم. نتابع كل فيديو من النص والتصوير حتى المونتاج النهائي وتصحيح الألوان والصوت. | keep |  |  |  |
| `c:categories:categories[creative-production].faq[4].q` | Can I rent equipment? | هل يمكنني استئجار المعدّات؟ | Owner rule 1 (AR) | (keep) | هل يمكننا استئجار المعدّات؟ |  |
| `c:categories:categories[creative-production].faq[4].a` | Yes: cameras, lenses, lighting and audio. Tell us what you need and your dates, and we'll confirm availability. | نعم: الكاميرات والعدسات والإضاءة والصوت. أخبرنا بما تحتاجه وبالمواعيد، ونؤكّد لك التوفّر. | Owner rule 1 (AR) | (keep) | نعم: الكاميرات والعدسات والإضاءة والصوت. أخبرونا بما تحتاجون إليه وبالمواعيد، ونؤكّد لكم التوفّر. | ⚑ FC#8 (owned or rented; with crew or without) |
| `c:categories:categories[creative-production].faq[5].q` | Who owns the photos and videos after delivery? | لمن تعود ملكية الصور والفيديوهات بعد التسليم؟ | keep |  |  |  |
| `c:categories:categories[creative-production].faq[5].a` | Usage rights are agreed in each proposal, before the shoot starts. | نتّفق على حقوق الاستخدام في كل عرض، قبل بدء التصوير. | keep | (keep) | (keep) | ⚑ FC#10 |
| `c:categories:categories[creative-production].faq[6].q` | How long does editing take? | كم يستغرق المونتاج؟ | keep |  |  |  |
| `c:categories:categories[creative-production].faq[6].a` | It depends on the length and the kind of edit. We agree the schedule with you in the proposal. | يعتمد ذلك على مدة العمل ونوع المونتاج، ونتّفق معك على الجدول الزمني في العرض. | Owner rule 1 (AR) | (keep) | يعتمد ذلك على مدة العمل ونوع المونتاج، ونتّفق معكم على الجدول الزمني في العرض. |  |
| `c:categories:categories[creative-production].faq[7].q` | What do you need from me to start? | ماذا تحتاجون مني للبدء؟ | Owner rule 1 (AR) | (keep) | ماذا تحتاجون منّا للبدء؟ |  |
| `c:categories:categories[creative-production].faq[7].a` | Tell us what you want to make, where it will be shown and when you need it. We'll come back with a treatment and a proposal. | أخبرنا بما تريد صنعه، وأين سيُعرض، ومتى تحتاجه، ونعود إليك بتصوّر وعرض. | Owner rule 1 (AR); EN keep. A promise (a treatment with the proposal) | (keep) | أخبرونا بما تريدون صنعه، وأين سيُعرض، ومتى تحتاجون إليه، ونعود إليكم بتصوّر وعرض. | ⚑ R3 (a treatment comes with every proposal) |
| `c:categories:categories[creative-production].closing` | Your first take starts here. | لقطتك الأولى تبدأ من هنا. | Owner rule 1 (AR) | (keep) | لقطتكم الأولى تبدأ من هنا. |  |
| `c:services:services[photography].title` | Photography | التصوير الفوتوغرافي | keep |  |  |  |
| `c:services:services[photography].summary` | Event, product and portrait photography, lit with intent. | تصوير الفعاليات والمنتجات والبورتريه، بإضاءة مدروسة. | keep |  |  |  |
| `c:services:services[photography].imageAlt` | A film studio set with a camera on a dolly and a single warm key light. | موقع تصوير في استوديو، كاميرا على عربة وضوء رئيسي دافئ واحد. | keep |  |  |  |
| `c:services:services[photography].points[0]` | Event coverage | تغطية الفعاليات | keep |  |  |  |
| `c:services:services[photography].points[1]` | Product photography | تصوير المنتجات | keep |  |  |  |
| `c:services:services[photography].points[2]` | Food styling and photography | تنسيق الأطباق وتصويرها | keep |  |  |  |
| `c:services:services[photography].points[3]` | Portraits | البورتريه | keep | (keep) | (keep) | ⚑ FC#9 (portraits) |
| `c:services:services[photography].points[4]` | Light planned for each shot | إضاءة مدروسة لكل لقطة | keep |  |  |  |
| `c:services:services[video-production].title` | Video production | إنتاج الفيديو | keep |  |  |  |
| `c:services:services[video-production].summary` | From script and shoot to the final edit and colour. | من النص والتصوير حتى المونتاج النهائي وتصحيح الألوان. | keep |  |  |  |
| `c:services:services[video-production].points[0]` | Script and shoot | النص والتصوير | keep |  |  |  |
| `c:services:services[video-production].points[1]` | Cinematic product and brand films | أفلام سينمائية للمنتجات والعلامات | keep |  |  |  |
| `c:services:services[video-production].points[2]` | Event films and coverage | أفلام الفعاليات وتغطيتها | keep |  |  |  |
| `c:services:services[video-production].points[3]` | Editing and colour | المونتاج وتصحيح الألوان | keep |  |  |  |
| `c:services:services[video-production].points[4]` | Sound design and post-production | تصميم الصوت ومرحلة ما بعد الإنتاج | keep |  |  |  |
| `c:services:services[motion-graphics].title` | Motion graphics | الموشن جرافيك | keep |  |  |  |
| `c:services:services[motion-graphics].summary` | Titles, explainers and screen content that move with purpose. | عناوين وفيديوهات شرح ومحتوى للشاشات، لكل حركة فيها سبب. | §3: "move with purpose" is a phrase any studio uses; say what it's for | Titles, explainers and screen content, moving in your brand's style. | عناوين وفيديوهات شرح ومحتوى للشاشات، تتحرّك بأسلوب علامتكم. |  |
| `c:services:services[motion-graphics].points[0]` | Motion graphics and logo animation | موشن جرافيك وتحريك الشعارات | keep |  |  |  |
| `c:services:services[motion-graphics].points[1]` | Titles and explainers | العناوين وفيديوهات الشرح | keep |  |  |  |
| `c:services:services[motion-graphics].points[2]` | Short videos and motion for social media | مقاطع قصيرة وموشن جرافيك لمنصات التواصل | keep |  |  |  |
| `c:services:services[motion-graphics].points[3]` | Screen content for events and stages | محتوى الشاشات للفعاليات والمسارح | keep |  |  |  |
| `c:services:services[ai-content-creation].title` | AI content creation | صناعة المحتوى بالذكاء الاصطناعي | keep |  |  |  |
| `c:services:services[ai-content-creation].summary` | AI-assisted imagery and video, art-directed to the brand. | صور وفيديو بمساعدة الذكاء الاصطناعي، بتوجيه فني يناسب العلامة. | keep |  |  |  |
| `c:services:services[ai-content-creation].points[0]` | AI video ads and short videos | إعلانات فيديو ومقاطع قصيرة بالذكاء الاصطناعي | keep |  |  |  |
| `c:services:services[ai-content-creation].points[1]` | Cinematic AI video | فيديو سينمائي بالذكاء الاصطناعي | keep |  |  |  |
| `c:services:services[ai-content-creation].points[2]` | AI imagery and campaign key visuals | صور بالذكاء الاصطناعي ومرئيات رئيسية للحملات | keep |  |  |  |
| `c:services:services[ai-content-creation].points[3]` | Art direction true to your brand | توجيه فني يلتزم بهويتك | Owner rule 1 (AR) | (keep) | توجيه فني يلتزم بهويتكم |  |
| `c:services:services[ai-content-creation].points[4]` | Editing, sound and finishing | المونتاج والصوت واللمسات الأخيرة | keep |  |  |  |
| `c:services:services[set-stage-design].title` | Set & stage design | تصميم الديكور والمسرح | keep |  |  |  |
| `c:services:services[set-stage-design].summary` | Sets and stages drawn, modelled and built for the camera and the room. | ديكورات ومسارح نرسمها ونجسّمها ونبنيها للكاميرا وللمكان. | keep | (keep) | (keep) | ⚑ FC#7 (built in-house or with partners) |
| `c:services:services[set-stage-design].points[0]` | Set and stage concepts | فكرة الديكور والمسرح | keep |  |  |  |
| `c:services:services[set-stage-design].points[1]` | Drawings and 3D models | الرسومات والنماذج ثلاثية الأبعاد | keep |  |  |  |
| `c:services:services[set-stage-design].points[2]` | Sets built for the camera | ديكورات مبنية للكاميرا | keep |  |  |  |
| `c:services:services[set-stage-design].points[3]` | Stages built for the room | مسارح مبنية للقاعة | keep |  |  |  |
| `c:services:services[equipment-camera-rental].title` | Equipment & camera rental | تأجير المعدّات والكاميرات | keep |  |  |  |
| `c:services:services[equipment-camera-rental].summary` | Cameras, lenses and lighting, ready for your production. | كاميرات وعدسات وإضاءة، جاهزة لإنتاجك. | Owner rule 1 (AR) | (keep) | كاميرات وعدسات وإضاءة، جاهزة لإنتاجكم. | ⚑ FC#8 |
| `c:services:services[equipment-camera-rental].points[0]` | Cameras | الكاميرات | keep |  |  |  |
| `c:services:services[equipment-camera-rental].points[1]` | Lenses | العدسات | keep |  |  |  |
| `c:services:services[equipment-camera-rental].points[2]` | Lighting | الإضاءة | keep |  |  |  |
| `c:services:services[equipment-camera-rental].points[3]` | Audio | الصوت | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.photography` | Every shot lit on purpose: the room on the night, the product on the table, the dish before it cools. | لكل لقطة إضاءتها المقصودة: القاعة ليلة الحدث، والمنتج على الطاولة، والطبق قبل أن يبرد. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.video-production` | One crew from the script to the colour grade, so the film you approved on paper is the film you get. | فريق واحد من كتابة النص حتى تصحيح الألوان، فيصلك الفيلم كما وافقت عليه على الورق. | Owner rule 1 (AR); EN keep | (keep) | فريق واحد من كتابة النص حتى تصحيح الألوان، فيصلكم الفيلم كما وافقتم عليه على الورق. |  |
| `c:service-hooks:SERVICE_HOOKS.motion-graphics` | Your logo, your titles and your stage screens, moving in one style. | شعارك وعناوينك وشاشات مسرحك، تتحرّك كلها بأسلوب واحد. | Owner rule 1 (AR); EN keep | (keep) | شعاركم وعناوينكم وشاشات مسرحكم، تتحرّك كلها بأسلوب واحد. |  |
| `c:service-hooks:SERVICE_HOOKS.ai-content-creation` | AI shortens the making. Art direction keeps every frame on brand. | الذكاء الاصطناعي يختصر وقت الإنتاج، والتوجيه الفني يُبقي كل لقطة على هوية علامتك. | Owner rule 1 (AR); EN keep | (keep) | الذكاء الاصطناعي يختصر وقت الإنتاج، والتوجيه الفني يُبقي كل لقطة على هوية علامتكم. |  |
| `c:service-hooks:SERVICE_HOOKS.set-stage-design` | Drawn and modelled before anything is built, so the set works for the lens and the stage works for the room. | نرسمه ونجسّمه قبل أن نبنيه، ليخدم الديكور عدسة الكاميرا ويخدم المسرح القاعة. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.equipment-camera-rental` | Cameras, lenses, lighting and audio for your shoot, booked in one request. | الكاميرات والعدسات والإضاءة والصوت لتصويرك، تحجزها بطلب واحد. | Owner rule 1 (AR); EN keep | (keep) | الكاميرات والعدسات والإضاءة والصوت لتصويركم، تحجزونها بطلب واحد. |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.title` | Every second is planned. | كل ثانية محسوبة. | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.cardLabel` | Title card | بطاقة العنوان | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.legend` | Choose an easing | اختر منحنى الحركة | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | اختيار منحنى الحركة |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.play` | Play | تشغيل | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.playing` | Playing with | التشغيل بمنحنى | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.reduced` | Motion is reduced on this device, so the card shows its final frame. The curve shows how it would move. | الحركة مخفّفة على هذا الجهاز، لذا تظهر البطاقة في إطارها الأخير، ويبيّن المنحنى كيف كانت ستتحرك. | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.easings[linear].name` | Linear | خطّي | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.easings[linear].line` | The same speed from the first frame to the last. Even, and a little mechanical. | السرعة نفسها من أول إطار إلى آخره. حركة منتظمة، فيها شيء من الآلية. | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.easings[ease-out].name` | Ease out | تباطؤ تدريجي | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.easings[ease-out].line` | Starts quickly, then slows into place. | تبدأ سريعة، ثم تهدأ حتى تستقر في مكانها. | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.easings[spring].name` | Spring | نابض | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.easings[spring].line` | Passes the mark, then settles back. Lively, so use it sparingly. | تتجاوز موضعها قليلًا ثم ترتدّ إليه. حيوية، فالأفضل أن تُستخدم باعتدال. | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.easings[expo].name` | Expo | أُسّي | keep |  |  |  |
| `c:modules/motion-playground:MOTION_PLAYGROUND.easings[expo].line` | The curve this site moves on: a quick start and a long, quiet landing. | المنحنى الذي يتحرك به هذا الموقع: انطلاقة سريعة ووصول طويل هادئ. | keep |  |  |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.hint` | Choose what your production needs. | اختر ما يحتاجه إنتاجك. | Owner rule 1 | (keep) | اختاروا ما يحتاج إليه إنتاجكم. |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.selected` | Selected: | اخترت: | Owner rule 1 | (keep) | اخترتم: |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.separator` | ,  | ،  | keep |  |  |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.cta` | Ask for availability | اسأل عن التوفّر | D-C1 (owner): a marketing call to action, so the plural command | (keep) | اسألوا عن التوفّر |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.categories[cameras].name` | Cameras | الكاميرات | keep |  |  |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.categories[cameras].line` | Camera bodies for photo and video. | كاميرات للتصوير الفوتوغرافي والفيديو. | keep |  |  |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.categories[lenses].name` | Lenses | العدسات | keep |  |  |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.categories[lenses].line` | Glass to match the shot, from wide to close. | عدسات تناسب كل لقطة، من الواسعة إلى القريبة. | keep |  |  |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.categories[lighting].name` | Lighting | الإضاءة | keep |  |  |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.categories[lighting].line` | Light to shape every scene. | إضاءة تصنع ملامح كل مشهد. | keep |  |  |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.categories[audio].name` | Audio | الصوت | keep |  |  |  |
| `c:modules/rental-categories:RENTAL_CATEGORIES.categories[audio].line` | Clean sound, on set or at the event. | تسجيل صوت نقي، أثناء التصوير أو في الفعالية. | keep |  |  |  |

## Category: marketing-brand

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:scenes.marketing.s1` | Every brand starts on a blank page. | تبدأ العلامة من صفحة بيضاء. | keep |  |  |  |
| `m:scenes.marketing.s2` | First, the grid. | أولًا، شبكة التصميم. | keep |  |  |  |
| `m:scenes.marketing.s3` | Then words and images find their place. | ثم تجد الكلمات والصور مكانها. | keep |  |  |  |
| `m:scenes.marketing.s4` | And the brand comes alive. | وتنبض العلامة بالحياة. | §3: "comes alive" is a stock phrase; after N06 this line leads the hero | And the brand is ready to post. | وتصبح العلامة جاهزة للنشر. |  |
| `c:categories:categories[marketing-brand].title` | Marketing & Brand | التسويق والعلامة التجارية | keep |  |  |  |
| `c:categories:categories[marketing-brand].summary` | Identity, social, search and PR that keep people talking after the event ends. | هوية، وتواصل اجتماعي، وظهور في البحث، وعلاقات عامة، تُبقي الحديث عنك قائمًا بعد الفعالية. | Owner rule 1 (AR); EN keep | (keep) | هوية، وتواصل اجتماعي، وظهور في البحث، وعلاقات عامة، تُبقي الحديث عنكم قائمًا بعد الفعالية. |  |
| `c:categories:categories[marketing-brand].intro` | Brand strategy and identity, social media, search, PR and paid media, planned together so the brand speaks with one voice. We publish in Arabic and English, measure what runs, and report on it. | استراتيجية العلامة وهويتها، ووسائل التواصل الاجتماعي، ومحركات البحث، والعلاقات العامة، والإعلانات المدفوعة، في خطة واحدة تتحدث فيها العلامة بصوت واحد. ننشر بالعربية والإنجليزية، ونقيس أداء كل ما يُنشر، ونقدّم عنه تقارير واضحة. | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[0].q` | Do you publish in Arabic and English? | هل تنشرون بالعربية والإنجليزية؟ | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[0].a` | Yes. We write and publish in both languages, and each language is written natively, not translated word for word. | نعم. نكتب وننشر باللغتين، ونكتب كل لغة بأسلوبها، لا بترجمة حرفية. | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[1].q` | Do you run Google and Meta ads? | هل تديرون إعلانات على Google و Meta؟ | N18 rule (the «و» joined to the Latin word) | (keep) | هل تديرون إعلانات على Google وMeta؟ |  |
| `c:categories:categories[marketing-brand].faq[1].a` | Yes. We plan the channels, the budget and the timing, run the campaigns, and report on how they performed. | نعم. نخطّط للقنوات والميزانية والتوقيت، وندير الحملات، ونرفع تقارير عن أدائها. | keep | (keep) | (keep) | ⚑ FC#14 (Google and Meta, in whose accounts) |
| `c:categories:categories[marketing-brand].faq[2].q` | Can one team handle the identity, the content and the ads? | هل يتولى فريق واحد الهوية والمحتوى والإعلانات؟ | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[2].a` | Yes. Strategy, identity, content, social media, PR and paid media sit under one roof and follow one plan. | نعم. الاستراتيجية والهوية والمحتوى ووسائل التواصل والعلاقات العامة والإعلانات المدفوعة عندنا تحت سقف واحد، وتسير وفق خطة واحدة. | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[3].q` | How do you report results? | كيف تعرضون النتائج؟ | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[3].a` | With analytics and a written report: what ran, who it reached and what worked. | بالتحليلات وتقرير مكتوب: ما الذي نُشر، ومن وصل إليه، وما الذي نجح. | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[4].q` | How often do you report? | كم مرة ترفعون التقارير؟ | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[4].a` | We agree the reporting rhythm with you at the start, to match the plan and its campaigns. | نتّفق معك على مواعيد التقارير منذ البداية، بما يناسب الخطة وحملاتها. | Owner rule 1 (AR) | (keep) | نتّفق معكم على مواعيد التقارير منذ البداية، بما يناسب الخطة وحملاتها. |  |
| `c:categories:categories[marketing-brand].faq[5].q` | Is there a minimum term? | هل هناك مدة تعاقد دنيا؟ | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[5].a` | The term is set in each proposal, to fit the plan. | تُحدَّد مدة التعاقد في كل عرض، بما يناسب الخطة. | keep |  |  |  |
| `c:categories:categories[marketing-brand].faq[6].q` | What do you need from me to start? | ماذا تحتاجون مني للبدء؟ | Owner rule 1 (AR) | (keep) | ماذا تحتاجون منّا للبدء؟ |  |
| `c:categories:categories[marketing-brand].faq[6].a` | Your goals, your audience, the channels you use today, and your brand guidelines if you have them. We'll come back with a plan and a proposal. | أهدافك وجمهورك والقنوات التي تستخدمها الآن، ودليل هويتك إن وُجد، ونعود إليك بخطة وعرض. | Owner rule 1 (AR); EN keep | (keep) | أهدافكم وجمهوركم والقنوات التي تستخدمونها الآن، ودليل هويتكم إن وُجد، ونعود إليكم بخطة وعرض. |  |
| `c:categories:categories[marketing-brand].closing` | Your page is next. | صفحتك هي التالية. | Owner rule 1 (AR) | (keep) | صفحتكم هي التالية. |  |
| `c:services:services[branding-identity].title` | Branding & identity | الهوية التجارية | keep |  |  |  |
| `c:services:services[branding-identity].summary` | Name, mark, voice and system, built to hold together. | الاسم والشعار ونبرة الخطاب والنظام البصري، في هوية واحدة متماسكة. | keep |  |  |  |
| `c:services:services[branding-identity].imageAlt` | Brand material laid out on a desk: paper samples, swatches and a closed notebook. | مواد هوية على مكتب: عيّنات ورق ودرجات ألوان ودفتر مغلق. | keep |  |  |  |
| `c:services:services[branding-identity].points[0]` | Brand strategy | استراتيجية العلامة | keep |  |  |  |
| `c:services:services[branding-identity].points[1]` | Naming | ابتكار الاسم | keep | (keep) | (keep) | ⚑ FC#11 (naming) |
| `c:services:services[branding-identity].points[2]` | Logo and visual identity | الشعار والهوية البصرية | keep |  |  |  |
| `c:services:services[branding-identity].points[3]` | Tone of voice | نبرة الخطاب | keep |  |  |  |
| `c:services:services[branding-identity].points[4]` | Brand guidelines | دليل الهوية | keep |  |  |  |
| `c:services:services[social-media-management].title` | Social media management | إدارة وسائل التواصل الاجتماعي | keep |  |  |  |
| `c:services:services[social-media-management].summary` | Planned calendars, content and community, week after week. | خطط نشر ومحتوى وتفاعل مع الجمهور، أسبوعًا بعد أسبوع. | keep |  |  |  |
| `c:services:services[social-media-management].points[0]` | Content strategy and a monthly calendar | استراتيجية المحتوى وخطة نشر شهرية | keep |  |  |  |
| `c:services:services[social-media-management].points[1]` | Daily publishing in Arabic and English | نشر يومي بالعربية والإنجليزية | keep |  |  |  |
| `c:services:services[social-media-management].points[2]` | Design, motion and short videos | التصميم والموشن جرافيك والمقاطع القصيرة | keep |  |  |  |
| `c:services:services[social-media-management].points[3]` | On-ground coverage | التغطية من أرض الحدث | keep |  |  |  |
| `c:services:services[social-media-management].points[4]` | Community management | إدارة التفاعل مع الجمهور | keep |  |  |  |
| `c:services:services[social-media-management].points[5]` | Paid campaigns and growth | حملات مدفوعة ونمو الحسابات | keep |  |  |  |
| `c:services:services[digital-marketing-seo].title` | Digital marketing & SEO | التسويق الرقمي وتحسين الظهور في محركات البحث (SEO) | keep |  |  |  |
| `c:services:services[digital-marketing-seo].summary` | Search, site speed and measurement that show what works. | محركات البحث وسرعة الموقع والقياس، لتعرف ما الذي ينجح. | Owner rule 1 (AR) | (keep) | محركات البحث وسرعة الموقع والقياس، لتعرفوا ما الذي ينجح. |  |
| `c:services:services[digital-marketing-seo].points[0]` | Search engine optimisation | تحسين الظهور في محركات البحث | keep |  |  |  |
| `c:services:services[digital-marketing-seo].points[1]` | Site speed and Core Web Vitals | سرعة الموقع ومؤشرات أداء الويب الأساسية | keep |  |  |  |
| `c:services:services[digital-marketing-seo].points[2]` | Analytics and reporting | التحليلات والتقارير | keep |  |  |  |
| `c:services:services[digital-marketing-seo].points[3]` | Measurement across search and your site | قياس النتائج في البحث وعلى موقعك | Owner rule 1 | (keep) | قياس النتائج في البحث وعلى موقعكم |  |
| `c:services:services[content-strategy].title` | Content strategy | استراتيجية المحتوى | keep |  |  |  |
| `c:services:services[content-strategy].summary` | What to say, where and when, written down and agreed. | ماذا نقول، وأين، ومتى، في خطة مكتوبة ومتفق عليها. | keep |  |  |  |
| `c:services:services[content-strategy].points[0]` | Messages and topics per channel | الرسائل والمواضيع لكل قناة | keep |  |  |  |
| `c:services:services[content-strategy].points[1]` | A monthly content calendar | خطة محتوى شهرية | keep |  |  |  |
| `c:services:services[content-strategy].points[2]` | Arabic and English content | محتوى بالعربية والإنجليزية | keep |  |  |  |
| `c:services:services[content-strategy].points[3]` | Content systems and templates | أنظمة المحتوى وقوالبه | keep |  |  |  |
| `c:services:services[public-relations].title` | Public relations | العلاقات العامة | keep |  |  |  |
| `c:services:services[public-relations].summary` | Press, media relations and announcements, handled with care. | البيانات الصحفية والعلاقات الإعلامية والإعلانات الرسمية، من الصياغة حتى النشر. | §3: "handled with care" is filler; the AR already says what happens | Press releases, media relations and announcements, from the first draft to publication. | (keep) | ⚑ FC#12 (press releases, media relations) |
| `c:services:services[public-relations].points[0]` | Press releases and announcements | البيانات الصحفية والإعلانات الرسمية | keep |  |  |  |
| `c:services:services[public-relations].points[1]` | Media relations | العلاقات الإعلامية | keep |  |  |  |
| `c:services:services[public-relations].points[2]` | On-site PR at exhibitions and events | العلاقات العامة في أرض المعارض والفعاليات | keep |  |  |  |
| `c:services:services[public-relations].points[3]` | Media coverage after the event | التغطية الإعلامية بعد الحدث | keep | (keep) | (keep) | ⚑ FC#13 (which media have published NO TIME's work) |
| `c:services:services[paid-media-planning].title` | Paid media & media planning (Google & Meta ads) | الإعلانات المدفوعة وتخطيط الإعلام (إعلانات Google و Meta) | N18 (approved) | (keep) | الإعلانات المدفوعة وتخطيط الإعلام (Google وMeta) |  |
| `c:services:services[paid-media-planning].summary` | Google and Meta campaigns, with the channels, budgets and timing behind them matched to the audience. | حملات على Google و Meta، نخطّط لقنواتها وميزانياتها وتوقيتها بما يناسب الجمهور. | N18 rule (AR) | (keep) | حملات على Google وMeta، نخطّط لقنواتها وميزانياتها وتوقيتها بما يناسب الجمهور. | ⚑ FC#14 |
| `c:services:services[paid-media-planning].points[0]` | Google Ads campaigns | حملات Google | keep |  |  |  |
| `c:services:services[paid-media-planning].points[1]` | Meta campaigns on Facebook and Instagram | حملات Meta على فيسبوك وإنستغرام | keep |  |  |  |
| `c:services:services[paid-media-planning].points[2]` | Channel and budget planning | تخطيط القنوات والميزانيات | keep |  |  |  |
| `c:services:services[paid-media-planning].points[3]` | Campaign timing and flighting | توقيت الحملات وجدولتها | keep |  |  |  |
| `c:services:services[paid-media-planning].points[4]` | Performance reporting | تقارير الأداء | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.branding-identity` | A name, a mark and a voice that still hold together on the hundredth post. | اسم وشعار ونبرة خطاب تبقى متماسكة حتى في المنشور المئة. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.social-media-management` | Daily publishing in Arabic and English, from a calendar you have already approved. | نشر يومي بالعربية والإنجليزية، وفق خطة نشر اعتمدتها مسبقًا. | Owner rule 1 (AR) | (keep) | نشر يومي بالعربية والإنجليزية، وفق خطة نشر اعتمدتموها مسبقًا. |  |
| `c:service-hooks:SERVICE_HOOKS.digital-marketing-seo` | Found in search, fast on a phone, and measured, so the next decision rests on numbers. | ظهور في نتائج البحث، وسرعة على الهاتف، وقياس يجعل قرارك التالي مبنيًا على الأرقام. | Owner rule 1 (AR) | (keep) | ظهور في نتائج البحث، وسرعة على الهاتف، وقياس يجعل قراركم التالي مبنيًا على الأرقام. |  |
| `c:service-hooks:SERVICE_HOOKS.content-strategy` | One written plan for what each channel says, so nothing goes out on guesswork. | خطة مكتوبة واحدة لما تقوله كل قناة، فلا يُنشر شيء بالتخمين. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.public-relations` | From the stand on the show floor to the coverage that follows it. | من الجناح في أرض المعرض إلى التغطية الإعلامية التي تليه. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.paid-media-planning` | Budget placed where your audience actually scrolls, and reported in plain numbers. | ميزانيتك حيث يتصفّح جمهورك فعلًا، وتقارير بأرقام واضحة. | Owner rule 1 (AR) | (keep) | ميزانيتكم حيث يتصفّح جمهوركم فعلًا، وتقارير بأرقام واضحة. |  |
| `c:modules/content-calendar:CALENDAR.title` | A month of content, planned | شهر من المحتوى، بخطة واضحة | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.note` | A sample plan for a fictional brand. Filter by pillar or channel, then choose a day to see the post. | خطة نموذجية لعلامة افتراضية. صفِّها حسب المحور أو القناة، ثم اختر يومًا لترى المنشور. | Owner rule 1 (AR) | (keep) | خطة نموذجية لعلامة افتراضية. صفّوها حسب المحور أو القناة، ثم اختاروا يومًا لتروا المنشور. |  |
| `c:modules/content-calendar:CALENDAR.filters.pillar` | Pillar | المحور | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.filters.channel` | Channel | القناة | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.filters.all` | All | الكل | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.detail.pillar` | Pillar | المحور | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.detail.channel` | Channel | القناة | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.detail.format` | Format | الصيغة | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.detail.lang` | Language | اللغة | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.caption` | Sample content calendar, {month} | تقويم محتوى نموذجي، {month} | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.empty` | No post matches both filters. Choose another pillar or channel. | لا يوجد منشور يطابق الاختيارين. اختر محورًا أو قناة أخرى. | Owner rule 1 (AR) | (keep) | لا يوجد منشور يطابق الاختيارين. اختاروا محورًا أو قناة أخرى. |  |
| `c:modules/content-calendar:CALENDAR.pillars[launch].label` | Launches and news | إطلاقات وأخبار | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.pillars[craft].label` | Behind the scenes | خلف الكواليس | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.pillars[guide].label` | Tips and how-tos | نصائح وإرشادات | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.pillars[community].label` | Community | مع الجمهور | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.channels[instagram].label` | Instagram | إنستغرام | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.channels[linkedin].label` | LinkedIn | لينكدإن | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.channels[newsletter].label` | Newsletter | النشرة البريدية | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.channels[blog].label` | Blog | المدوّنة | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.formats.reel` | Reel | ريل | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.formats.stories` | Stories | قصص | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.formats.post` | Post | منشور | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.formats.carousel` | Carousel | منشور بعدّة صور | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.formats.article` | Article | مقال | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.formats.email` | Email | رسالة بريدية | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e01].topic` | First look at the new season | نظرة أولى على الموسم الجديد | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e02].topic` | A guide for first-time users | دليل لمن يجرّب لأول مرة | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e03].topic` | A morning in the studio | صباح في الاستوديو | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e04].topic` | Your questions, answered | أسئلتكم وإجاباتها | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e05].topic` | What's new this month | جديد هذا الشهر | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e06].topic` | Care tips, one slide each | نصائح العناية، نصيحة في كل صورة | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e07].topic` | How the new packaging was designed | كيف صُمّمت العبوة الجديدة | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e08].topic` | Customers share their favourite pick | العملاء يختارون مفضّلهم | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e09].topic` | The launch announcement | إعلان الإطلاق | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e10].topic` | Common mistakes, and how to avoid them | أخطاء شائعة وكيف تتجنّبها | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e11].topic` | Packing day, behind the scenes | يوم التغليف من خلف الكواليس | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e12].topic` | A conversation with a customer | حوار مع أحد العملاء | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e13].topic` | The full range in one post | المجموعة كاملة في منشور واحد | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e14].topic` | A short glossary for beginners | مصطلحات أساسية للمبتدئين | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e15].topic` | The month in pictures | الشهر بالصور | keep |  |  |  |
| `c:modules/content-calendar:CALENDAR.entries[e16].topic` | Thank you to this month's community | شكرًا لجمهور هذا الشهر | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.title` | Anatomy of a press release | مكوّنات البيان الصحفي | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.hint` | Choose a numbered part to see what it does. | اختر جزءًا مرقّمًا لتعرف دوره. | Owner rule 1 (AR) | (keep) | اختاروا جزءًا مرقّمًا لتعرفوا دوره. |  |
| `c:modules/press-release:PRESS_RELEASE.notesLabel` | What each part does | دور كل جزء | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.kicker` | For immediate release | للنشر الفوري | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.headline` | A local coffee brand opens its first flagship, with the roastery in full view | علامة قهوة محلية تفتتح متجرها الرئيسي الأول، والمحمصة أمام الزوار | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.standfirst` | The new space brings roasting, tasting and a menu in Arabic and English into one room. | تجمع المساحة الجديدة التحميص والتذوّق وقائمة بالعربية والإنجليزية في مكان واحد. | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.dateline` | Dubai, {date} | دبي، {date} | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.lead` | A local coffee brand today opened its first flagship store, where visitors watch the beans being roasted before they order. The store serves a menu written in Arabic and English and hosts tasting sessions every week. | افتتحت علامة قهوة محلية اليوم متجرها الرئيسي الأول، حيث يشاهد الزوار تحميص البن قبل أن يطلبوا قهوتهم. ويقدّم المتجر قائمة مكتوبة بالعربية والإنجليزية، ويستضيف جلسات تذوّق كل أسبوع. | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.body` | The space is built around the roaster, which sits behind glass at the centre of the room. Seating runs along both sides, and a counter at the back sells beans to take home. | صُمّمت المساحة حول آلة التحميص التي تتوسّط المكان خلف واجهة زجاجية، وتمتد المقاعد على جانبيها، ويبيع ركن في آخر المتجر البن لمن يريد أن يأخذه معه. | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.quote` | “We wanted people to see where their coffee comes from, and to stay a while,” said the brand’s founder. | قال مؤسس العلامة: «أردنا أن يرى الناس من أين تأتي قهوتهم، وأن يجلسوا عندنا قليلًا». | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.end` | ### | — انتهى — | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.aboutTitle` | About the brand | عن العلامة | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.about` | The brand is a fictional coffee roaster, created for this example. It roasts in small batches and serves its coffee in one city. | العلامة محمصة قهوة افتراضية أُنشئت لهذا المثال، تحمّص البن بكميات صغيرة وتقدّم قهوتها في مدينة واحدة. | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.contactTitle` | Media contact | للتواصل الإعلامي | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.release.contactName` | Press office | المكتب الإعلامي | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[headline].name` | Headline | العنوان | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[headline].note` | The news in one line, for an editor who decides in seconds. A short line under it adds the detail. | الخبر في سطر واحد، لمحرّر يقرّر في ثوانٍ. ويضيف سطر قصير تحته التفاصيل. | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[dateline].name` | Dateline | المكان والتاريخ | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[dateline].note` | Where the news comes from, and the day it is released. | من أين يأتي الخبر، وفي أي يوم صدر. | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[lead].name` | Lead and body | المقدّمة والمتن | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[lead].note` | The first paragraph answers who, what, when, where and why. The rest adds detail, most important first. | تجيب الفقرة الأولى عن: من، وماذا، ومتى، وأين، ولماذا. وتضيف بقية الفقرات التفاصيل، الأهم فالأهم. | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[quote].name` | Quote | الاقتباس | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[quote].note` | A named spokesperson says what the facts can’t: the reason behind the news. | متحدّث معروف يقول ما لا تقوله الوقائع: السبب وراء الخبر. | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[boilerplate].name` | Boilerplate | النبذة التعريفية | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[boilerplate].note` | A standard paragraph about the company that closes every release, word for word. | فقرة ثابتة عن الشركة تُختم بها كل البيانات، بالنص نفسه. | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[contact].name` | Media contact | جهة التواصل الإعلامي | keep |  |  |  |
| `c:modules/press-release:PRESS_RELEASE.parts[contact].note` | Who journalists reach for interviews, images and follow-up questions. | من يتواصل معه الصحفيون لطلب مقابلة أو صور أو أسئلة إضافية. | keep |  |  |  |

## Category: production-print-gifts

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:scenes.print.s1` | Paper, board, ribbon. | ورق، وكرتون، وشريط. | keep |  |  |  |
| `m:scenes.print.s2` | Measured, then cut. | نقيس أولًا، ثم نقصّ. | keep |  |  |  |
| `m:scenes.print.s3` | Printed, then folded into shape. | نطبع، ثم نطوي حتى يكتمل الشكل. | keep |  |  |  |
| `m:scenes.print.s4` | Closed, wrapped, ready to give. | مغلقة ومغلّفة، وجاهزة للإهداء. | keep |  |  |  |
| `c:categories:categories[production-print-gifts].title` | Production, Print & Gifts | الإنتاج والطباعة والهدايا | keep |  |  |  |
| `c:categories:categories[production-print-gifts].summary` | Stands, print, packaging and gifts, finished in foil, UV, deboss or laser. | أجنحة وطباعة وتغليف وهدايا، بلمسات نهائية من الرقائق المعدنية و UV والكبس والحفر بالليزر. | N18 rule (AR: «و» joined to the Latin word) | (keep) | أجنحة وطباعة وتغليف وهدايا، بلمسات نهائية من الرقائق المعدنية وUV والكبس والحفر بالليزر. |  |
| `c:categories:categories[production-print-gifts].intro` | Stands and signage, commercial and large-format print, packaging, corporate gifts and merchandise, produced to brand standard. We design, fabricate and install, and finish each gift with the branding method that suits it. | أجنحة ولافتات، وطباعة تجارية وكبيرة الحجم، وتغليف، وهدايا للشركات، ومنتجات تحمل هوية علامتك وتلتزم بمعاييرها. نصمّم ونصنّع ونركّب، ونختار لكل هدية طريقة الطباعة أو الحفر التي تليق بها. | Owner rule 1 (AR); EN keep | (keep) | أجنحة ولافتات، وطباعة تجارية وكبيرة الحجم، وتغليف، وهدايا للشركات، ومنتجات تحمل هوية علامتكم وتلتزم بمعاييرها. نصمّم ونصنّع ونركّب، ونختار لكل هدية طريقة الطباعة أو الحفر التي تليق بها. |  |
| `c:categories:categories[production-print-gifts].faq[0].q` | Which branding methods do you use? | ما طرق الطباعة والحفر التي تستخدمونها؟ | keep |  |  |  |
| `c:categories:categories[production-print-gifts].faq[0].a` | Screen printing, UV printing, foiling, debossing and laser engraving, chosen to suit each item. | الطباعة الحريرية، والطباعة بالأشعة فوق البنفسجية، والطباعة بالرقائق المعدنية، والكبس الغائر، والحفر بالليزر، ونختار منها ما يناسب كل قطعة. | keep |  |  |  |
| `c:categories:categories[production-print-gifts].faq[1].q` | Do you install the stands you build? | هل تركّبون الأجنحة التي تصنعونها؟ | keep |  |  |  |
| `c:categories:categories[production-print-gifts].faq[1].a` | Yes. We design, fabricate and install exhibition stands, activations and branded spaces. | نعم. نصمّم أجنحة المعارض ومساحات التفعيل والمساحات بهوية العلامة، ونصنّعها ونركّبها. | keep | (keep) | (keep) | ⚑ FC#15 (in-house or with a partner) |
| `c:categories:categories[production-print-gifts].faq[2].q` | Can I order prints online? | هل يمكنني طلب المطبوعات عبر الإنترنت؟ | Hidden: the claim needs a feature that doesn't exist | (hide) | (hide) | R6: the online store isn't built (ordering is a request through the contact form), so the line is hidden (owner, 2026-11-17) |
| `c:categories:categories[production-print-gifts].faq[2].a` | Yes. Tell us the item and the quantity, send your artwork, and we'll confirm the details and the proof with you before printing. | نعم. أخبرنا بالمنتج والكمية وأرسل التصميم، ونؤكّد معك التفاصيل والنسخة التجريبية قبل التنفيذ. | Hidden: the claim needs a feature that doesn't exist | (hide) | (hide) | R6: the online store isn't built (ordering is a request through the contact form), so the line is hidden (owner, 2026-11-17) |
| `c:categories:categories[production-print-gifts].faq[3].q` | Do you make packaging for gifts and awards? | هل تصمّمون تغليفًا للهدايا والجوائز؟ | keep |  |  |  |
| `c:categories:categories[production-print-gifts].faq[3].a` | Yes: custom boxes and wraps for gift sets and awards. | نعم: علب وتغليف حسب الطلب لأطقم الهدايا والجوائز. | keep |  |  |  |
| `c:categories:categories[production-print-gifts].faq[4].q` | Is there a minimum quantity? | هل هناك حدّ أدنى للكمية؟ | keep |  |  |  |
| `c:categories:categories[production-print-gifts].faq[4].a` | It depends on the item and the branding method. Tell us what you need, and we'll advise on quantities. | يعتمد ذلك على المنتج وطريقة الطباعة أو الحفر. أخبرنا بما تحتاجه، ونقترح عليك الكميات المناسبة. | Owner rule 1 (AR) | (keep) | يعتمد ذلك على المنتج وطريقة الطباعة أو الحفر. أخبرونا بما تحتاجون إليه، ونقترح عليكم الكميات المناسبة. |  |
| `c:categories:categories[production-print-gifts].faq[5].q` | How long does production take? | كم يستغرق التنفيذ؟ | keep |  |  |  |
| `c:categories:categories[production-print-gifts].faq[5].a` | It depends on the item, the quantity and the finish. Share your deadline and we'll confirm what's possible. | يعتمد ذلك على المنتج والكمية والتشطيب. شاركنا الموعد المطلوب، ونؤكّد لك ما يمكن تنفيذه. | Owner rule 1 (AR) | (keep) | يعتمد ذلك على المنتج والكمية والتشطيب. شاركونا الموعد المطلوب، ونؤكّد لكم ما يمكن تنفيذه. |  |
| `c:categories:categories[production-print-gifts].faq[6].q` | Do you deliver? | هل توصلون الطلبات؟ | keep |  |  |  |
| `c:categories:categories[production-print-gifts].faq[6].a` | Tell us where your order needs to go, and we'll confirm delivery with the proposal. | أخبرنا إلى أين يجب أن يصل طلبك، ونؤكّد لك التوصيل مع العرض. | Owner rule 1 (AR) | (keep) | أخبرونا إلى أين يجب أن يصل طلبكم، ونؤكّد لكم التوصيل مع العرض. | ⚑ FC#16 (where, and whether delivery is in the price) |
| `c:categories:categories[production-print-gifts].faq[7].q` | What do you need from me to start? | ماذا تحتاجون مني للبدء؟ | Owner rule 1 (AR) | (keep) | ماذا تحتاجون منّا للبدء؟ |  |
| `c:categories:categories[production-print-gifts].faq[7].a` | The item, the quantity, the sizes, your deadline, and your artwork or logo files. We'll come back with options and a proposal. | المنتج والكمية والمقاسات والموعد المطلوب، وملفات التصميم أو الشعار، ونعود إليك بخيارات وعرض. | Owner rule 1 (AR) | (keep) | المنتج والكمية والمقاسات والموعد المطلوب، وملفات التصميم أو الشعار، ونعود إليكم بخيارات وعرض. |  |
| `c:categories:categories[production-print-gifts].closing` | What should we make for you? | ماذا نصنع لك؟ | Owner rule 1 (AR) | (keep) | ماذا نصنع لكم؟ |  |
| `c:services:services[commercial-large-format-printing].title` | Commercial & large-format printing | الطباعة التجارية وكبيرة الحجم | keep |  |  |  |
| `c:services:services[commercial-large-format-printing].summary` | From business cards and brochures to banners, backdrops and wall graphics, printed to scale. | من بطاقات العمل والبروشورات إلى اللافتات والخلفيات والرسومات الجدارية، مطبوعة بالمقاس المطلوب. | keep |  |  |  |
| `c:services:services[commercial-large-format-printing].imageAlt` | Hands tying a champagne ribbon on a dark corporate gift box. | يدان تعقدان شريطًا بلون الشمبانيا على علبة هدايا داكنة. | keep |  |  |  |
| `c:services:services[commercial-large-format-printing].points[0]` | Roll-up banners | لافتات رول أب | keep |  |  |  |
| `c:services:services[commercial-large-format-printing].points[1]` | Feather flags | أعلام الريشة | keep |  |  |  |
| `c:services:services[commercial-large-format-printing].points[2]` | Business cards | بطاقات العمل | keep |  |  |  |
| `c:services:services[commercial-large-format-printing].points[3]` | Brochures | البروشورات | keep |  |  |  |
| `c:services:services[commercial-large-format-printing].points[4]` | Backdrops and wall graphics | الخلفيات والرسومات الجدارية | keep |  |  |  |
| `c:services:services[stand-fabrication-signage].title` | Stand fabrication & signage | تصنيع الأجنحة واللافتات | keep |  |  |  |
| `c:services:services[stand-fabrication-signage].summary` | Exhibition stands, activations and branded spaces, designed, fabricated and installed, with the signage that guides guests. | أجنحة معارض ومساحات تفعيل ومساحات تحمل هوية العلامة، نصمّمها ونصنّعها ونركّبها، مع لافتات ترشد الضيوف. | keep | (keep) | (keep) | ⚑ FC#15 (fabrication in-house?), FC#17 (wayfinding signage) |
| `c:services:services[stand-fabrication-signage].points[0]` | Stand design | تصميم الأجنحة | keep |  |  |  |
| `c:services:services[stand-fabrication-signage].points[1]` | Fabrication | التصنيع | keep |  |  |  |
| `c:services:services[stand-fabrication-signage].points[2]` | Installation on site | التركيب في أرض الحدث | keep |  |  |  |
| `c:services:services[stand-fabrication-signage].points[3]` | Activations and branded spaces | مساحات التفعيل والمساحات بهوية العلامة | keep |  |  |  |
| `c:services:services[stand-fabrication-signage].points[4]` | Wayfinding signage | لافتات إرشادية للضيوف | keep |  |  |  |
| `c:services:services[packaging-design].title` | Packaging design | تصميم التغليف | keep |  |  |  |
| `c:services:services[packaging-design].summary` | Boxes and wraps that open like part of the brand. | علب وتغليف تُفتح كأنها جزء من العلامة. | keep |  |  |  |
| `c:services:services[packaging-design].points[0]` | Custom boxes and wraps | علب وتغليف حسب الطلب | keep |  |  |  |
| `c:services:services[packaging-design].points[1]` | Packaging for awards and gift sets | تغليف للجوائز وأطقم الهدايا | keep |  |  |  |
| `c:services:services[packaging-design].points[2]` | Structure and dielines | الهيكل وقوالب القصّ | keep | (keep) | (keep) | ⚑ FC#17 (structure and dielines) |
| `c:services:services[packaging-design].points[3]` | Print-ready artwork | ملفات جاهزة للطباعة | keep |  |  |  |
| `c:services:services[corporate-gifts].title` | Corporate gifts | هدايا الشركات | keep |  |  |  |
| `c:services:services[corporate-gifts].summary` | Gifts chosen, branded and delivered for clients and teams. | هدايا نختارها ونضع عليها هويتك ونوصلها إلى عملائك وفريقك. | Owner rule 1 (AR) | (keep) | هدايا نختارها ونضع عليها هويتكم ونوصلها إلى عملائكم وفريقكم. | ⚑ FC#16 (delivery) |
| `c:services:services[corporate-gifts].points[0]` | Gift sets | أطقم الهدايا | keep |  |  |  |
| `c:services:services[corporate-gifts].points[1]` | Branded bottles | زجاجات بهوية العلامة | keep |  |  |  |
| `c:services:services[corporate-gifts].points[2]` | Bags | الحقائب | keep |  |  |  |
| `c:services:services[corporate-gifts].points[3]` | Notebooks & pens | الدفاتر والأقلام | keep |  |  |  |
| `c:services:services[corporate-gifts].points[4]` | Giveaways | الهدايا الترويجية | keep |  |  |  |
| `c:services:services[corporate-gifts].points[5]` | Screen printing, UV, foiling, debossing and laser engraving | الطباعة الحريرية، والطباعة بالأشعة فوق البنفسجية، والطباعة بالرقائق المعدنية، والكبس الغائر، والحفر بالليزر | keep |  |  |  |
| `c:services:services[online-print-store].title` | Online print store | متجر الطباعة الإلكتروني | keep |  |  |  |
| `c:services:services[online-print-store].summary` | Order approved print items online, on brand every time. | اطلب مطبوعاتك المعتمدة عبر الإنترنت، بهوية ثابتة في كل مرة. | Hidden: the claim needs a feature that doesn't exist | (hide) | (hide) | R6: the online store isn't built (ordering is a request through the contact form), so the line is hidden (owner, 2026-11-17) |
| `c:services:services[online-print-store].points[0]` | Choose the item and the quantity | اختر المنتج والكمية | Owner rule 1 (AR) | (keep) | اختاروا المنتج والكمية |  |
| `c:services:services[online-print-store].points[1]` | Send your artwork, or ask for a reprint | أرسل التصميم، أو اطلب إعادة طباعة | Owner rule 1 (AR) | (keep) | أرسلوا التصميم، أو اطلبوا إعادة الطباعة |  |
| `c:services:services[online-print-store].points[2]` | Approve the proof before printing | اعتمد النسخة التجريبية قبل التنفيذ | Owner rule 1 (AR) | (keep) | اعتمدوا النسخة التجريبية قبل التنفيذ |  |
| `c:services:services[online-print-store].points[3]` | Printed to brand standard | طباعة بمعايير علامتك | Owner rule 1 (AR) | (keep) | طباعة بمعايير علامتكم |  |
| `c:services:services[branded-merchandise].title` | Branded merchandise | منتجات بهوية العلامة | keep |  |  |  |
| `c:services:services[branded-merchandise].summary` | Apparel and objects carrying the brand with restraint. | ملابس وقطع تحمل العلامة بأناقة وهدوء. | keep |  |  |  |
| `c:services:services[branded-merchandise].points[0]` | Apparel | الملابس | keep |  |  |  |
| `c:services:services[branded-merchandise].points[1]` | Bags and totes | الحقائب وحقائب القماش | keep |  |  |  |
| `c:services:services[branded-merchandise].points[2]` | Desk and everyday objects | أدوات المكتب والاستخدام اليومي | keep |  |  |  |
| `c:services:services[branded-merchandise].points[3]` | Printed or engraved, to suit the material | طباعة أو حفر بما يناسب الخامة | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.commercial-large-format-printing` | From a business card to a wall graphic, the same colour and the same brand. | من بطاقة العمل إلى الرسم الجداري، اللون نفسه والهوية نفسها. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.stand-fabrication-signage` | Designed, built and installed by the team that planned it. | يصمّمه ويصنّعه ويركّبه الفريق نفسه الذي خطّط له. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.packaging-design` | The box is the first thing they open, so we design it to feel like the brand. | العلبة أول ما يفتحه ضيفك، فنصمّمها لتحمل إحساس العلامة. | Owner rule 1 (AR); EN keep | (keep) | العلبة أول ما يفتحه ضيوفكم، فنصمّمها لتحمل إحساس العلامة. |  |
| `c:service-hooks:SERVICE_HOOKS.corporate-gifts` | Chosen for the person, finished in foil, UV, deboss or laser, and delivered. | هدية نختارها لصاحبها، ونمنحها لمستها بالرقائق المعدنية أو UV أو الكبس أو الليزر، ثم نوصلها إليه. | keep |  |  |  |
| `c:service-hooks:SERVICE_HOOKS.online-print-store` | Reorder approved print without starting the brief again. | أعد طلب مطبوعاتك المعتمدة دون أن تبدأ من جديد. | Choice 2 ("brief"); owner rule 1 | Reorder approved print without starting from scratch. | أعيدوا طلب مطبوعاتكم المعتمدة دون أن تبدؤوا من جديد. |  |
| `c:service-hooks:SERVICE_HOOKS.branded-merchandise` | Apparel and everyday objects worth keeping, with the logo placed with restraint. | ملابس وأدوات يومية تستحق أن يُحتفظ بها، والشعار عليها بهدوء. | keep |  |  |  |
| `c:modules/human-scale:HUMAN_SCALE_COPY.title` | Typical formats, drawn to scale | مقاسات شائعة بمقياسها الحقيقي | keep |  |  |  |
| `c:modules/human-scale:HUMAN_SCALE_COPY.note` | Common sizes for comparison, beside a 1.8 m figure. Each job is printed at the size it needs. | مقاسات شائعة للمقارنة، بجانب شخص طوله 1.8 م. ونطبع كل عمل بالمقاس الذي يحتاجه. | keep |  |  |  |
| `c:modules/human-scale:HUMAN_SCALE_COPY.choose` | Choose a format | اختر مقاسًا | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | اختيار المقاس |  |
| `c:modules/human-scale:HUMAN_SCALE_COPY.unit` | mm | مم | keep |  |  |  |
| `c:modules/human-scale:HUMAN_SCALE_COPY.metre` | m | م | keep |  |  |  |
| `c:modules/human-scale:HUMAN_SCALE_COPY.figure` | 1.8 m | 1.8 م | keep |  |  |  |
| `c:modules/human-scale:HUMAN_SCALE_COPY.power` | ×{n} | ×{n} | keep |  |  |  |
| `c:modules/human-scale:HUMAN_SCALE_COPY.announce` | {name}: {size} mm, {basis}, drawn to scale beside a 1.8 m figure. | {name}: {size} مم، {basis}، مرسومة بمقياسها الحقيقي بجانب شخص طوله 1.8 م. | keep |  |  |  |
| `c:modules/human-scale:SCALE_FORMATS[card].name` | Business card | بطاقة العمل | keep |  |  |  |
| `c:modules/human-scale:SCALE_FORMATS[card].basis` | A common card size | مقاس شائع لبطاقات العمل | keep |  |  |  |
| `c:modules/human-scale:SCALE_FORMATS[brochure].name` | Brochure | البروشور | keep |  |  |  |
| `c:modules/human-scale:SCALE_FORMATS[brochure].basis` | ISO A4 | مقاس A4 القياسي | keep |  |  |  |
| `c:modules/human-scale:SCALE_FORMATS[rollup].name` | Roll-up banner | لافتة الرول أب | keep |  |  |  |
| `c:modules/human-scale:SCALE_FORMATS[rollup].basis` | A common roll-up size | مقاس شائع للافتات الرول أب | keep |  |  |  |
| `c:modules/human-scale:SCALE_FORMATS[backdrop].name` | Backdrop | الخلفية | keep |  |  |  |
| `c:modules/human-scale:SCALE_FORMATS[backdrop].basis` | A common event backdrop size | مقاس شائع لخلفيات الفعاليات | keep |  |  |  |
| `c:modules/print-order:ORDER_STEPS[item].title` | The item | المنتج | keep |  |  |  |
| `c:modules/print-order:ORDER_STEPS[item].line` | Business cards, letterheads, brochures or roll-ups: tell us what you need, and how many. | بطاقات عمل أو ورق مراسلات أو بروشورات أو لافتات رول أب: أخبرنا بما تحتاجه وبالكمية. | Owner rule 1 (AR) | (keep) | بطاقات عمل أو ورق مراسلات أو بروشورات أو لافتات رول أب: أخبرونا بما تحتاجون إليه وبالكمية. |  |
| `c:modules/print-order:ORDER_STEPS[artwork].title` | Your artwork | التصميم | keep |  |  |  |
| `c:modules/print-order:ORDER_STEPS[artwork].line` | Send print-ready files, or ask for a reprint of an item you've printed with us. | أرسل ملفات جاهزة للطباعة، أو اطلب إعادة طباعة قطعة طبعتها معنا من قبل. | Owner rule 1 (AR) | (keep) | أرسلوا ملفات جاهزة للطباعة، أو اطلبوا إعادة طباعة قطعة طبعتموها معنا من قبل. |  |
| `c:modules/print-order:ORDER_STEPS[proof].title` | The proof | النسخة التجريبية | keep |  |  |  |
| `c:modules/print-order:ORDER_STEPS[proof].line` | You see a proof first. Nothing goes to print until you approve it. | تصلك نسخة تجريبية أولًا، ولا يُطبع شيء قبل أن تعتمدها. | Owner rule 1 (AR) | (keep) | تصلكم نسخة تجريبية أولًا، ولا يُطبع شيء قبل أن تعتمدوها. |  |
| `c:modules/print-order:ORDER_STEPS[print].title` | To brand standard | بمعايير علامتك | Owner rule 1 (AR) | (keep) | بمعايير علامتكم |  |
| `c:modules/print-order:ORDER_STEPS[print].line` | Printed to match your brand, and the proof you approved. | طباعة تطابق هوية علامتك والنسخة التي اعتمدتها. | Owner rule 1 (AR) | (keep) | طباعة تطابق هوية علامتكم والنسخة التي اعتمدتموها. |  |
| `c:modules/print-order:PRINT_ORDER_COPY.title` | How a print order works | كيف يسير طلب الطباعة | keep |  |  |  |
| `c:modules/print-order:PRINT_ORDER_COPY.step` | Step {n} of {total} | الخطوة {n} من {total} | keep |  |  |  |
| `c:modules/print-order:PRINT_ORDER_COPY.cta` | Order your print online | اطلب مطبوعاتك عبر الإنترنت | Hidden: the claim needs a feature that doesn't exist | (hide) | (hide) | R6: the online store isn't built (ordering is a request through the contact form), so the line is hidden (owner, 2026-11-17) |

## Category: software-digital

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:scenes.software.s1` | Every platform starts with a cursor. | كل منصّة تبدأ بمؤشّر. | keep |  |  |  |
| `m:scenes.software.s2` | Lines become a layout. | تتحوّل السطور إلى تصميم. | keep |  |  |  |
| `m:scenes.software.s3` | The layout becomes a working product. | ويصير التصميم منتجًا يعمل. | keep |  |  |  |
| `m:scenes.software.s4` | From idea to a live product. | من الفكرة إلى منتج يستخدمه الناس. | keep |  |  |  |
| `c:categories:categories[software-digital].title` | Software & Digital | البرمجيات والحلول الرقمية | keep |  |  |  |
| `c:categories:categories[software-digital].summary` | Websites, apps and custom systems that keep working long after launch day. | مواقع وتطبيقات وأنظمة تُبنى على مقاسك، وتبقى تعمل طويلًا بعد الإطلاق. | Owner rule 1 (AR); EN keep | (keep) | مواقع وتطبيقات وأنظمة تُبنى على مقاسكم، وتبقى تعمل طويلًا بعد الإطلاق. |  |
| `c:categories:categories[software-digital].intro` | Websites, mobile apps, custom systems and online stores, designed and built in Arabic and English. We take each one end to end, from UX and design systems to development, content management and analytics, and build it to load fast. | مواقع إلكترونية وتطبيقات جوّال وأنظمة مخصّصة ومتاجر إلكترونية، نصمّمها ونبنيها بالعربية والإنجليزية. نتولّى كلًّا منها من البداية إلى النهاية: من تجربة المستخدم وأنظمة التصميم إلى البرمجة وإدارة المحتوى والتحليلات، ونبنيها لتعمل بسرعة. | §3 banned: "end to end" | Websites, mobile apps, custom systems and online stores, designed and built in Arabic and English. We take each one from UX and design systems to development, content management and analytics, and build it to load fast. | مواقع إلكترونية وتطبيقات جوّال وأنظمة مخصّصة ومتاجر إلكترونية، نصمّمها ونبنيها بالعربية والإنجليزية. نتولّى كلًّا منها من تجربة المستخدم وأنظمة التصميم إلى البرمجة وإدارة المحتوى والتحليلات، ونبنيها لتعمل بسرعة. |  |
| `c:categories:categories[software-digital].faq[0].q` | How long does a project take? | كم يستغرق المشروع؟ | keep |  |  |  |
| `c:categories:categories[software-digital].faq[0].a` | It depends on the scope. After the intro call we send a plan with the steps and the dates for your project, and you see progress at every stage. | يعتمد ذلك على حجم المشروع. بعد مكالمة التعارف نرسل لك خطة بالمراحل والمواعيد الخاصة بمشروعك، وترى التقدّم في كل مرحلة. | Owner rule 1 (AR); EN keep | (keep) | يعتمد ذلك على حجم المشروع. بعد مكالمة التعارف نرسل لكم خطة بالمراحل والمواعيد الخاصة بمشروعكم، وترون التقدّم في كل مرحلة. | ⚑ FC#24 |
| `c:categories:categories[software-digital].faq[1].q` | How much does a website or an app cost? | كم تكلفة الموقع أو التطبيق؟ | keep |  |  |  |
| `c:categories:categories[software-digital].faq[1].a` | It depends on the scope, so we don't publish prices. After the intro call we send a proposal with the scope, the stages and the cost, and work starts only when you agree to it. | تعتمد على حجم المشروع، لذلك لا ننشر أسعارًا. بعد مكالمة التعارف نرسل لك عرضًا بالنطاق والمراحل والتكلفة، ولا يبدأ العمل إلا بعد موافقتك. | Owner rule 1 (AR); EN keep | (keep) | تعتمد على حجم المشروع، لذلك لا ننشر أسعارًا. بعد مكالمة التعارف نرسل لكم عرضًا بالنطاق والمراحل والتكلفة، ولا يبدأ العمل إلا بعد موافقتكم. |  |
| `c:categories:categories[software-digital].faq[2].q` | Is the Arabic as good as the English? | هل تكون النسخة العربية بجودة الإنجليزية نفسها؟ | keep |  |  |  |
| `c:categories:categories[software-digital].faq[2].a` | Yes. We design and build in both languages from the start, with full right-to-left layouts, not a translation added at the end. | نعم. نصمّم ونبني باللغتين من البداية، مع دعم كامل للاتجاه من اليمين إلى اليسار، لا بترجمة تُضاف في النهاية. | keep |  |  |  |
| `c:categories:categories[software-digital].faq[3].q` | Will we be able to update the site ourselves? | هل سنتمكّن من تحديث الموقع بأنفسنا؟ | keep |  |  |  |
| `c:categories:categories[software-digital].faq[3].a` | Yes. We set up a content system in both languages and show your team how to use it at handover. | نعم. نجهّز نظامًا لإدارة المحتوى باللغتين، ونعرّف فريقك على استخدامه عند التسليم. | Owner rule 1 (AR) | (keep) | نعم. نجهّز نظامًا لإدارة المحتوى باللغتين، ونعرّف فريقكم على استخدامه عند التسليم. |  |
| `c:categories:categories[software-digital].faq[4].q` | Do you support the product after launch? | هل تقدّمون الدعم بعد الإطلاق؟ | keep |  |  |  |
| `c:categories:categories[software-digital].faq[4].a` | Yes. Support and maintenance after launch are part of how we work, and their scope is agreed in the proposal. | نعم. الدعم والصيانة بعد الإطلاق جزء من طريقة عملنا، ونتّفق على نطاقهما في العرض. | keep | (keep) | (keep) | ⚑ FC#24 |
| `c:categories:categories[software-digital].faq[5].q` | Who owns the code and the content? | لمن تعود ملكية الكود والمحتوى؟ | keep |  |  |  |
| `c:categories:categories[software-digital].faq[5].a` | Ownership and licensing are set out in each proposal, before work starts. | تُحدَّد الملكية والترخيص في كل عرض، قبل بدء العمل. | keep |  |  |  |
| `c:categories:categories[software-digital].faq[6].q` | What do you need from me to start? | ماذا تحتاجون مني للبدء؟ | Owner rule 1 (AR) | (keep) | ماذا تحتاجون منّا للبدء؟ |  |
| `c:categories:categories[software-digital].faq[6].a` | A few lines on what you want to build and who it's for. Book a free 30-min intro call, and we'll take it from there. | بضعة أسطر عمّا تريد بناءه ولمن. احجز مكالمة تعارف مجانية (30 دقيقة)، ونتابع معك الخطوات التالية. | N13 (approved): "Request a free intro call", no "30-min"; owner rule 1 | A few lines on what you want to build and who it's for. Request a free intro call, and we'll take it from there. | بضعة أسطر عمّا تريدون بناءه ولمن. اطلبوا مكالمة تعارف مجانية، ونتابع معكم الخطوات التالية. | ⚑ R1 (the intro call is free, 30 minutes) |
| `c:categories:categories[software-digital].closing` | Your idea is the next line. | فكرتك هي السطر التالي. | Owner rule 1 (AR) | (keep) | فكرتكم هي السطر التالي. |  |
| `c:services:services[websites].title` | Websites | المواقع الإلكترونية | keep |  |  |  |
| `c:services:services[websites].summary` | Fast, bilingual websites that are easy to keep up to date. | مواقع سريعة بلغتين، يسهل تحديثها. | keep |  |  |  |
| `c:services:services[websites].imageAlt` | A clean workspace at night, a laptop screen glowing softly out of focus. | مساحة عمل مرتّبة ليلًا، وشاشة حاسوب تتوهّج بنعومة خارج التركيز. | keep |  |  |  |
| `c:services:services[websites].points[0]` | Arabic and English, with full right-to-left layouts | العربية والإنجليزية، مع دعم كامل للاتجاه من اليمين إلى اليسار | keep |  |  |  |
| `c:services:services[websites].points[1]` | A content system your team runs | نظام لإدارة المحتوى يديره فريقك | Owner rule 1 (AR) | (keep) | نظام لإدارة المحتوى يديره فريقكم |  |
| `c:services:services[websites].points[2]` | SEO and speed from day one | الظهور في محركات البحث والسرعة من اليوم الأول | keep |  |  |  |
| `c:services:services[mobile-apps].title` | Mobile apps | تطبيقات الجوّال | keep |  |  |  |
| `c:services:services[mobile-apps].summary` | iOS and Android apps designed around how people use them. | تطبيقات iOS و Android مصمّمة وفق طريقة استخدام الناس لها. | N18 rule (AR) | (keep) | تطبيقات iOS وAndroid مصمّمة وفق طريقة استخدام الناس لها. |  |
| `c:services:services[mobile-apps].points[0]` | iOS and Android | iOS و Android | N18 rule (AR) | (keep) | iOS وAndroid |  |
| `c:services:services[mobile-apps].points[1]` | Connected to your website | مرتبط بموقعك الإلكتروني | Owner rule 1 (AR) | (keep) | مرتبط بموقعكم الإلكتروني |  |
| `c:services:services[mobile-apps].points[2]` | Arabic and English | بالعربية والإنجليزية | keep |  |  |  |
| `c:services:services[custom-systems].title` | Custom systems | أنظمة مخصّصة | keep |  |  |  |
| `c:services:services[custom-systems].summary` | Internal tools and systems built for the way your team works. | أدوات وأنظمة داخلية نبنيها وفق طريقة عمل فريقك. | Owner rule 1 (AR) | (keep) | أدوات وأنظمة داخلية نبنيها وفق طريقة عمل فريقكم. |  |
| `c:services:services[custom-systems].points[0]` | Admin dashboards and analytics | لوحات إدارة وتحليلات | keep |  |  |  |
| `c:services:services[custom-systems].points[1]` | Roles and permissions | أدوار وصلاحيات لفريقك | Owner rule 1 (AR) | (keep) | أدوار وصلاحيات لفريقكم |  |
| `c:services:services[custom-systems].points[2]` | Integrations with your tools | الربط بأدواتك وأنظمتك | Owner rule 1 (AR) | (keep) | الربط بأدواتكم وأنظمتكم |  |
| `c:services:services[e-commerce].title` | E-commerce | المتاجر الإلكترونية | keep |  |  |  |
| `c:services:services[e-commerce].summary` | Online stores with clear checkout and simple management. | متاجر إلكترونية بخطوات شراء واضحة وإدارة بسيطة. | keep |  |  |  |
| `c:services:services[e-commerce].points[0]` | Catalogue management | إدارة المنتجات | keep |  |  |  |
| `c:services:services[e-commerce].points[1]` | Checkout and payment integration | إتمام الشراء وربط بوابات الدفع | keep | (keep) | (keep) | ⚑ FC#20 (which payment gateways) |
| `c:services:services[e-commerce].points[2]` | An orders dashboard | لوحة لمتابعة الطلبات | keep |  |  |  |
| `c:services:services[ui-ux-design].title` | UI/UX design | تصميم الواجهات وتجربة المستخدم | keep |  |  |  |
| `c:services:services[ui-ux-design].summary` | Interfaces researched, prototyped and tested before they are built. | واجهات ندرس مستخدميها ونجرّب نماذجها ونختبرها قبل بنائها. | keep |  |  |  |
| `c:services:services[ui-ux-design].points[0]` | User research and flows | بحث المستخدمين ومسارات الاستخدام | keep |  |  |  |
| `c:services:services[ui-ux-design].points[1]` | Clickable prototypes | نماذج أولية قابلة للنقر | keep |  |  |  |
| `c:services:services[ui-ux-design].points[2]` | A design system | نظام تصميم | keep |  |  |  |
| `c:services:services[ai-consulting].title` | AI consulting | استشارات الذكاء الاصطناعي | keep |  |  |  |
| `c:services:services[ai-consulting].summary` | Where AI helps your work, where it does not, and how to start. | أين يفيد الذكاء الاصطناعي عملك، وأين لا يفيد، وكيف تبدأ. | Owner rule 1 (AR) | (keep) | أين يفيد الذكاء الاصطناعي عملكم، وأين لا يفيد، وكيف تبدؤون. | ⚑ FC#20 (what the consulting covers) |
| `c:services:services[ai-consulting].points[0]` | A review of where AI fits your work | مراجعة لمواضع فائدة الذكاء الاصطناعي في عملك | Owner rule 1 (AR) | (keep) | مراجعة لمواضع فائدة الذكاء الاصطناعي في عملكم |  |
| `c:services:services[ai-consulting].points[1]` | A pilot plan | خطة لمشروع تجريبي أول | keep |  |  |  |
| `c:services:services[ai-consulting].points[2]` | Getting your team started | تهيئة فريقك للبدء | Owner rule 1 (AR) | (keep) | تهيئة فريقكم للبدء |  |

## Category modules (demo data)

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `c:modules/event-photos:EVENT_PHOTOS.cart.alt` | A heritage cart set with brass dallahs and vessels. | عربة تراثية عليها دلال وأوانٍ نحاسية. | keep |  |  |  |
| `c:modules/event-photos:EVENT_PHOTOS.coffee.alt` | Arabic coffee service laid out on a carpet. | أدوات تقديم القهوة العربية مصفوفة على سجّادة. | keep |  |  |  |

## Software & Digital page

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `c:software/page:caseStudy.eyebrow` | Case study | دراسة حالة | keep |  |  |  |
| `c:software/page:caseStudy.anonymous.client` | A national sports federation | اتحاد رياضي وطني | keep |  |  |  |
| `c:software/page:caseStudy.named.client` | UAE Athletics Federation | الاتحاد الإماراتي لألعاب القوى | keep |  |  |  |
| `c:software/page:caseStudy.named.alt.laptop` | The federation's bilingual website on a laptop. | موقع الاتحاد ثنائي اللغة على شاشة حاسوب محمول. | keep |  |  |  |
| `c:software/page:caseStudy.named.alt.phone` | The federation's website on a phone. | موقع الاتحاد على شاشة هاتف. | keep |  |  |  |
| `c:software/page:caseStudy.title` | A national federation's platform, rebuilt and live. | منصة اتحاد وطني، أعدنا بناءها وهي تعمل الآن. | keep |  |  |  |
| `c:software/page:caseStudy.parts.challenge.label` | Challenge | التحدي | keep |  |  |  |
| `c:software/page:caseStudy.parts.challenge.body` | A full rebuild of the federation's digital platform. | إعادة بناء كاملة للمنصة الرقمية للاتحاد. | keep |  |  |  |
| `c:software/page:caseStudy.parts.approach.label` | Approach | النهج | keep |  |  |  |
| `c:software/page:caseStudy.parts.approach.body` | A modern bilingual website with a complete content management system and a connected mobile app, redesigned from the interface up and fully responsive. As the federation's official digital and media partner, we also publish its social media daily in Arabic and English. | موقع حديث بلغتين، مع نظام كامل لإدارة المحتوى وتطبيق جوّال مرتبط به، أعدنا تصميم واجهته بالكامل ليعمل على كل الشاشات. وبصفتنا الشريك الرقمي والإعلامي الرسمي للاتحاد، ننشر محتواه على وسائل التواصل يوميًا بالعربية والإنجليزية. | keep | (keep) | (keep) | ⚑ FC#18 (official partner at launch) |
| `c:software/page:caseStudy.parts.built.label` | What we built | ما بنيناه | keep |  |  |  |
| `c:software/page:caseStudy.parts.built.items[0]` | Bilingual website | موقع بلغتين | keep |  |  |  |
| `c:software/page:caseStudy.parts.built.items[1]` | Mobile app | تطبيق جوّال | keep |  |  |  |
| `c:software/page:caseStudy.parts.built.items[2]` | Content management | إدارة المحتوى | keep |  |  |  |
| `c:software/page:caseStudy.parts.built.items[3]` | Admin dashboard and analytics | لوحة إدارة وتحليلات | keep |  |  |  |
| `c:software/page:caseStudy.parts.built.items[4]` | Arabic and English, SEO and performance | العربية والإنجليزية، والظهور في البحث والأداء | keep |  |  |  |
| `c:software/page:caseStudy.parts.built.modules` | Athletes, clubs, coaches and referees · championships, results and national records · news, media library and live coverage | الرياضيون والأندية والمدربون والحكّام · البطولات والنتائج والأرقام القياسية الوطنية · الأخبار ومكتبة الوسائط والتغطية المباشرة | keep |  |  |  |
| `c:software/page:caseStudy.parts.result.label` | Result | النتيجة | keep |  |  |  |
| `c:software/page:caseStudy.parts.result.body` | All live: the website, the admin panel and the mobile app. | كلها تعمل الآن: الموقع الإلكتروني ولوحة الإدارة وتطبيق الجوّال. | keep | (keep) | (keep) | ⚑ FC#18 (all live at launch) |
| `c:software/page:caseStudy.redraw` | Stylised redraw. The client's own screens stay private. | رسم توضيحي مبسّط. شاشات العميل نفسها تبقى خاصة. | keep |  |  |  |
| `c:software/page:caseStudy.visit` | Visit the live site | زُر الموقع المنشور | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | زيارة الموقع |  |
| `c:software/page:cta.book` | Book a free 30-min intro call | احجز مكالمة تعارف مجانية (30 دقيقة) | D-C1 (owner): a marketing call to action, so the plural command | Request a free intro call | اطلبوا مكالمة تعارف مجانية | ⚑ R1 (the intro call is free, 30 minutes) |
| `c:software/page:cta.micro` | No obligation. We reply within one working day. | دون أي التزام. نرد خلال يوم عمل. | keep | (keep) | (keep) | ⚑ FC#23 |
| `c:software/page:cta.review` | Get a free website review | احصل على مراجعة مجانية لموقعك | D-C1 (owner): a marketing call to action, so the plural command | (keep) | اطلبوا مراجعة مجانية لموقعكم | ⚑ R2 (the website review: free, 3 working days, 5 improvements) |
| `c:software/page:cta.reviewShort` | Free website review | مراجعة مجانية لموقعك | Owner rule 1 | (keep) | مراجعة مجانية لموقعكم | ⚑ R2 (the website review: free, 3 working days, 5 improvements) |
| `c:software/page:cta.reviewPromise` | Send us your site. Within 3 working days we'll reply with 5 concrete improvements, free. | أرسل لنا موقعك، وخلال 3 أيام عمل نرد عليك بخمسة تحسينات عملية، مجانًا. | Owner rule 1 (AR); EN keep: the kind of specific promise §1 asks for | (keep) | أرسلوا لنا موقعكم، وخلال 3 أيام عمل نرد عليكم بخمسة تحسينات عملية، مجانًا. | ⚑ R2 (the website review: free, 3 working days, 5 improvements) |
| `c:software/page:cta.work` | See our work | شاهد أعمالنا | D-C1 (owner): a marketing call to action, so the plural command | (keep) | شاهدوا أعمالنا |  |
| `c:software/page:cta.discuss` | Discuss this | ناقش هذه الخدمة معنا | D-C1 (owner): a marketing call to action, so the plural command | (keep) | ناقشوا هذه الخدمة معنا |  |
| `c:software/page:cta.discussFor` | Discuss this: {service} | ناقش هذه الخدمة معنا: {service} | D-C1 (owner): a marketing call to action, so the plural command | (keep) | ناقشوا هذه الخدمة معنا: {service} |  |
| `c:software/page:eventTech.name` | Event technology | تقنيات الفعاليات | keep |  |  |  |
| `c:software/page:eventTech.eyebrow` | Event technology · our specialty | تقنيات الفعاليات · تخصّصنا | keep |  |  |  |
| `c:software/page:eventTech.title` | Built by people who run events. | تبنيها فرقٌ تدير الفعاليات بنفسها. | keep |  |  |  |
| `c:software/page:eventTech.intro` | We build the event registration system, the app and the results screens, and we're on the floor running the event too. One brief and one team, from the first invitation to the last result on screen. | نبني نظام التسجيل والتطبيق وشاشات النتائج، ونكون في أرض الحدث نديره أيضًا. ملف واحد وفريق واحد، من أول دعوة إلى آخر نتيجة تظهر على الشاشة. | Choice 1 ("one team" stays in this page's main promise, `why.title`); choice 2 ("brief") | We build the event registration system, the app and the results screens, and we're on the floor running the event too. One request, from the first invitation to the last result on screen. | نبني نظام التسجيل والتطبيق وشاشات النتائج، ونكون في أرض الحدث نديره أيضًا. طلب واحد، من أول دعوة إلى آخر نتيجة تظهر على الشاشة. |  |
| `c:software/page:eventTech.items[0].title` | Registration and check-in | التسجيل وتسجيل الحضور | keep |  |  |  |
| `c:software/page:eventTech.items[0].body` | Minute Zero by NO TIME · Coming soon | الدقيقة صفر من NO TIME · قريبًا | Fixed principle: no "coming soon". Say what it is and where it stands | Minute Zero by NO TIME, our own check-in product (in development) | «الدقيقة صفر» من NO TIME، منتجنا لتسجيل الحضور (قيد التطوير) |  |
| `c:software/page:eventTech.items[1].title` | Event apps and websites | تطبيقات ومواقع للفعاليات | keep |  |  |  |
| `c:software/page:eventTech.items[1].body` | The agenda, the speakers and live updates. | البرنامج والمتحدثون والتحديثات المباشرة. | keep |  |  |  |
| `c:software/page:eventTech.items[2].title` | Live results and screens | النتائج المباشرة والشاشات | keep |  |  |  |
| `c:software/page:eventTech.items[2].body` | Championships, results and live coverage, as on a national federation's platform. | بطولات ونتائج وتغطية مباشرة، كما في منصة اتحاد وطني. | keep | (keep) | (keep) | ⚑ FC#19 (built for clients other than the federation?) |
| `c:software/page:eventTech.idealFor[0]` | Conferences and exhibitions | المؤتمرات والمعارض | keep |  |  |  |
| `c:software/page:eventTech.idealFor[1]` | Sports events and championships | الفعاليات الرياضية والبطولات | keep |  |  |  |
| `c:software/page:eventTech.idealFor[2]` | Galas with a guest list | الحفلات بقوائم ضيوف | keep |  |  |  |
| `c:software/page:eventTech.receive[0]` | Registration and check-in for your guests | التسجيل وتسجيل الحضور لضيوفك | Owner rule 1 | (keep) | التسجيل وتسجيل الحضور لضيوفكم |  |
| `c:software/page:eventTech.receive[1]` | An event app or microsite with the agenda and live updates | تطبيق أو موقع مصغّر للفعالية بالبرنامج والتحديثات المباشرة | keep |  |  |  |
| `c:software/page:eventTech.receive[2]` | Live results and screens at the venue | نتائج مباشرة وشاشات في مكان الفعالية | keep |  |  |  |
| `c:software/page:eventTech.eventsLink` | See Events & Hospitality | تعرّف على الفعاليات والضيافة | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | استعراض الفعاليات والضيافة |  |
| `c:software/page:eventTech.counter.label` | Checked in | سجّلوا حضورهم | keep |  |  |  |
| `c:software/page:eventTech.counter.of` | of | من | keep |  |  |  |
| `c:software/page:faqCopy.title` | Straight answers on cost, time and ownership. | إجابات مباشرة عن التكلفة والمدة والملكية. | keep |  |  |  |
| `c:software/page:finalCta.risk` | Book a free 30-min intro call. No obligation. We reply within one working day. | احجز مكالمة تعارف مجانية (30 دقيقة). دون أي التزام. نرد خلال يوم عمل. | D-C1 (owner): the line opens with the call to action, so the plural command; N13 wording | (keep) | اطلبوا مكالمة تعارف مجانية (30 دقيقة)، دون أي التزام. نرد عليكم خلال يوم عمل. | ⚑ FC#23; ⚑ R1 (the intro call is free, 30 minutes) |
| `c:software/page:finalCta.reviewTitle` | Or start with a free website review | أو ابدأ بمراجعة مجانية لموقعك | Owner rule 1 | (keep) | أو ابدؤوا بمراجعة مجانية لموقعكم | ⚑ R2 (the website review: free, 3 working days, 5 improvements) |
| `c:software/page:hero.title` | Websites and apps your clients actually use, in Arabic and English. | مواقع وتطبيقات يستخدمها عملاؤك فعلًا، بالعربية والإنجليزية. | Owner rule 1 (AR); EN keep | (keep) | مواقع وتطبيقات يستخدمها عملاؤكم فعلًا، بالعربية والإنجليزية. |  |
| `c:software/page:hero.sub` | The team that runs your events also builds your platform: bilingual websites, iOS and Android apps, dashboards and the systems behind them. Designed and built in Dubai. | الفريق الذي يدير فعالياتك يبني منصّتك أيضًا: مواقع بلغتين، وتطبيقات iOS و Android، ولوحات إدارة والأنظمة التي تعمل خلفها. نصمّمها ونطوّرها في دبي. | Owner rule 1 (AR), N18 rule; EN keep | (keep) | الفريق الذي يدير فعالياتكم يبني منصّتكم أيضًا: مواقع بلغتين، وتطبيقات iOS وAndroid، ولوحات إدارة والأنظمة التي تعمل خلفها. نصمّمها ونطوّرها في دبي. |  |
| `c:software/page:hero.ui.wire[0]` | Header | الترويسة | keep |  |  |  |
| `c:software/page:hero.ui.wire[1]` | Hero | الواجهة | keep |  |  |  |
| `c:software/page:hero.ui.wire[2]` | Cards | البطاقات | keep |  |  |  |
| `c:software/page:hero.ui.welcome` | Welcome | أهلًا بك | Owner rule 1 (the drawn interface too: one voice on the site) | (keep) | أهلًا بكم |  |
| `c:software/page:hero.ui.welcomeOther` | أهلًا بك | Welcome | Owner rule 1 (this key holds the Arabic shown on the English page) | أهلًا بكم | (keep) |  |
| `c:software/page:hero.ui.button` | Book a visit | احجز زيارة | D-C1 (owner): the drawn site's call to action, so the plural command (replaces D-C5's «حجز زيارة») | (keep) | احجزوا زيارة |  |
| `c:software/page:hero.ui.states[0]` | Default | افتراضي | keep |  |  |  |
| `c:software/page:hero.ui.states[1]` | Hover | تمرير | keep |  |  |  |
| `c:software/page:hero.ui.states[2]` | Active | نشط | keep |  |  |  |
| `c:software/page:hero.ui.live` | Live | مباشر | keep |  |  |  |
| `c:software/page:hero.ui.example` | Example | مثال | keep |  |  |  |
| `c:software/page:hero.ui.preview` | Preview | معاينة | keep |  |  |  |
| `c:software/page:hero.ui.soon` | Coming soon | قريبًا | Fixed principle: no "coming soon" (it renders as the badge on both product cards) | In development | قيد التطوير |  |
| `c:software/page:problems.title` | An English-only site. A slow page. A vendor who vanished after launch. | موقع بالإنجليزية وحدها، وصفحة بطيئة، ووكالة غابت بعد الإطلاق. | keep |  |  |  |
| `c:software/page:problems.lead` | Sound familiar? Here is how we fix each one. | هل يبدو هذا مألوفًا؟ هكذا نعالج كلًّا منها. | §3: a question answered by the next line | Here is how we fix each one. | هكذا نعالج كلًّا منها. |  |
| `c:software/page:problems.painLabel` | The problem | المشكلة | keep |  |  |  |
| `c:software/page:problems.fixLabel` | How we solve it | كيف نحلّها | keep |  |  |  |
| `c:software/page:problems.items[0].pain` | Your site speaks English. Many of your customers read Arabic first. | موقعك بالإنجليزية، وكثير من عملائك يقرؤون بالعربية أولًا. | Owner rule 1 | (keep) | موقعكم بالإنجليزية، وكثير من عملائكم يقرؤون بالعربية أولًا. |  |
| `c:software/page:problems.items[0].fix` | We build both languages from day one, with full right-to-left layouts and Arabic written natively. | نبني اللغتين من اليوم الأول، مع دعم كامل للاتجاه من اليمين إلى اليسار، وعربية مكتوبة بأسلوبها لا مترجمة. | keep |  |  |  |
| `c:software/page:problems.items[1].pain` | It loads slowly on a phone, and visitors leave before it finishes. | يتأخر تحميله على الهاتف، فيغادر الزوّار قبل أن يكتمل. | keep |  |  |  |
| `c:software/page:problems.items[1].fix` | Every page gets a performance budget, measured against Core Web Vitals before launch. | نحدّد لكل صفحة ميزانية أداء، ونقيسها بمؤشرات Core Web Vitals قبل الإطلاق. | keep |  |  |  |
| `c:software/page:problems.items[2].pain` | Every text change means an email to the agency, then a wait. | كل تعديل في نص يعني رسالة إلى الوكالة، ثم انتظارًا. | keep |  |  |  |
| `c:software/page:problems.items[2].fix` | Your team updates pages, news and images itself, in a content system that works in both languages. | يحدّث فريقك الصفحات والأخبار والصور بنفسه، من نظام لإدارة المحتوى يعمل باللغتين. | Owner rule 1 | (keep) | يحدّث فريقكم الصفحات والأخبار والصور بنفسه، من نظام لإدارة المحتوى يعمل باللغتين. |  |
| `c:software/page:problems.items[3].pain` | The agency launched it, then disappeared. | أطلقت الوكالة الموقع ثم اختفت. | keep |  |  |  |
| `c:software/page:problems.items[3].fix` | Support and maintenance after launch are part of the plan, agreed in the proposal. | الدعم والصيانة بعد الإطلاق جزء من الخطة، ونتّفق عليهما في العرض. | keep | (keep) | (keep) | ⚑ FC#24 |
| `c:software/page:problems.items[4].pain` | Registration from one vendor, the app from another, the screens from a third. | التسجيل من مورّد، والتطبيق من آخر، والشاشات من ثالث. | keep |  |  |  |
| `c:software/page:problems.items[4].fix` | One team builds your event technology and runs the event itself. | فريق واحد يبني تقنيات فعاليتك ويدير الفعالية نفسها. | Choice 1 | The people who build your event technology also run the event. | من يبني تقنيات فعاليتكم يدير الفعالية نفسها. |  |
| `c:software/page:process.title` | You see your project at every stage, not only on launch day. | ترى مشروعك في كل مرحلة، لا يوم الإطلاق وحده. | Owner rule 1 (AR); EN keep | (keep) | ترون مشروعكم في كل مرحلة، لا يوم الإطلاق وحده. | ⚑ FC#24 |
| `c:software/page:process.lead` | Five stages. Each one ends with something you can open, test or sign off. | خمس مراحل، تنتهي كلٌّ منها بشيء تفتحه أو تجرّبه أو تعتمده. | Owner rule 1 | (keep) | خمس مراحل، تنتهي كلٌّ منها بشيء تفتحونه أو تجرّبونه أو تعتمدونه. |  |
| `c:software/page:process.receive` | You receive | تستلم | Owner rule 1 | (keep) | تستلمون |  |
| `c:software/page:process.steps.discover.name` | Discover | نستكشف | keep |  |  |  |
| `c:software/page:process.steps.discover.body` | We learn your goals, your users and your content, and agree the scope. | نتعرّف على أهدافك ومستخدميك ومحتواك، ونتّفق على النطاق. | Owner rule 1 | (keep) | نتعرّف على أهدافكم ومستخدميكم ومحتواكم، ونتّفق على النطاق. |  |
| `c:software/page:process.steps.discover.receive` | A scope and a plan with the stages and dates | نطاق العمل وخطة بالمراحل والمواعيد | keep |  |  |  |
| `c:software/page:process.steps.design.name` | Design | نصمّم | keep |  |  |  |
| `c:software/page:process.steps.design.body` | Wireframes first, then the interface in both languages. | نبدأ بالمخططات، ثم الواجهة باللغتين. | keep |  |  |  |
| `c:software/page:process.steps.design.receive` | A clickable prototype you can try yourself | نموذج تفاعلي تجرّبه بنفسك | Owner rule 1 | (keep) | نموذج تفاعلي تجرّبونه بأنفسكم |  |
| `c:software/page:process.steps.build.name` | Build | نبني | keep |  |  |  |
| `c:software/page:process.steps.build.body` | We develop in short stages you can follow. | نبرمج على مراحل قصيرة تتابعها خطوة بخطوة. | Owner rule 1 | (keep) | نبرمج على مراحل قصيرة تتابعونها خطوة بخطوة. |  |
| `c:software/page:process.steps.build.receive` | A staging link where you see progress at every stage | رابط تجريبي ترى عليه التقدّم في كل مرحلة | Owner rule 1 | (keep) | رابط تجريبي ترون عليه التقدّم في كل مرحلة | ⚑ FC#24 |
| `c:software/page:process.steps.launch.name` | Launch | نطلق | keep |  |  |  |
| `c:software/page:process.steps.launch.body` | We test speed, both languages and every form, then go live. | نختبر السرعة واللغتين وكل النماذج، ثم نطلق. | keep |  |  |  |
| `c:software/page:process.steps.launch.receive` | A launch checklist we sign off with you | قائمة تحقق للإطلاق نعتمدها معك | Owner rule 1 | (keep) | قائمة تحقق للإطلاق نعتمدها معكم |  |
| `c:software/page:process.steps.support.name` | Support | ندعم | keep |  |  |  |
| `c:software/page:process.steps.support.body` | We maintain and improve the product after launch. | نصون المنتج ونطوّره بعد الإطلاق. | keep |  |  |  |
| `c:software/page:process.steps.support.receive` | Updates and improvements on the terms in your proposal | تحديثات وتحسينات وفق ما يتضمّنه العرض | keep |  |  |  |
| `c:software/page:process.notes[0]` | Bilingual by default | بلغتين من البداية | keep |  |  |  |
| `c:software/page:process.notes[1]` | Performance and SEO built in | الأداء والظهور في محركات البحث جزء من البناء | keep |  |  |  |
| `c:software/page:process.notes[2]` | Support & maintenance after launch | الدعم والصيانة بعد الإطلاق | keep |  |  |  |
| `c:software/page:productsCopy.eyebrow` | Our products · Coming soon | منتجاتنا · قريبًا | Fixed principle: no "coming soon" | Our products · in development | منتجاتنا · قيد التطوير |  |
| `c:software/page:productsCopy.title` | Two products born at the event door and in the restaurant kitchen. | منتجان وُلدا عند باب الفعالية وفي مطبخ المطعم. | keep |  |  |  |
| `c:software/page:productsCopy.intro` | We're building both from our own event and hospitality work. Register interest and we'll write to you when they're ready. | نطوّرهما من خبرتنا في الفعاليات والضيافة. سجّل اهتمامك، وسنكتب لك حين يصبحان جاهزين. | Owner rule 1 (AR); EN keep | (keep) | نطوّرهما من خبرتنا في الفعاليات والضيافة. سجّلوا اهتمامكم، وسنكتب لكم حين يصبحان جاهزين. |  |
| `c:software/page:productsCopy.problem` | The problem | المشكلة | keep |  |  |  |
| `c:software/page:productsCopy.features` | Key features | أبرز الميزات | keep |  |  |  |
| `c:software/page:productsCopy.register` | Register interest | سجّل اهتمامك | D-C1 (owner): a marketing call to action, so the plural command | (keep) | سجّلوا اهتمامكم |  |
| `c:software/page:productsCopy.registerFor` | Register interest in {product} | سجّل اهتمامك بـ{product} | D-C1 (owner): a marketing call to action, so the plural command | (keep) | سجّلوا اهتمامكم بـ{product} |  |
| `c:software/page:productsCopy.close` | Close the form | أغلق النموذج | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | إغلاق النموذج |  |
| `c:software/page:productsCopy.more` | See what {product} will do | تعرّف على ما سيقدّمه {product} | N18 (approved): gender agreement and «» around the name; a text link, so the plural command (owner rule 1) | (keep) | اكتشفوا ما ستقدّمه «{product}» |  |
| `c:software/page:productsCopy.items.minute-zero.problem` | Queues at the door, and no clear picture of who has arrived. | طوابير عند الباب، ولا صورة واضحة لمن وصل. | keep |  |  |  |
| `c:software/page:productsCopy.items.minute-zero.features[0]` | QR invitations | دعوات برمز QR | keep |  |  |  |
| `c:software/page:productsCopy.items.minute-zero.features[1]` | Check-in at the door from a phone | تسجيل الحضور عند الباب من الهاتف | keep |  |  |  |
| `c:software/page:productsCopy.items.minute-zero.features[2]` | Live arrivals for the team | متابعة الوصول لحظة بلحظة لفريقك | Owner rule 1 | (keep) | متابعة الوصول لحظة بلحظة لفريقكم |  |
| `c:software/page:productsCopy.items.minute-zero.screens[0]` | Check-in dashboard | لوحة الحضور | keep |  |  |  |
| `c:software/page:productsCopy.items.minute-zero.screens[1]` | QR scan | مسح الرمز | keep |  |  |  |
| `c:software/page:productsCopy.items.minute-zero.screens[2]` | Guest list | قائمة الضيوف | keep |  |  |  |
| `c:software/page:productsCopy.items.peak-hour.problem` | Orders, tables and the kitchen, out of step at the busiest hour. | الطلبات والطاولات والمطبخ، كلٌّ في وادٍ ساعةَ الذروة. | keep |  |  |  |
| `c:software/page:productsCopy.items.peak-hour.features[0]` | Table and order management | إدارة الطاولات والطلبات | keep |  |  |  |
| `c:software/page:productsCopy.items.peak-hour.features[1]` | Kitchen display | شاشة للمطبخ | keep |  |  |  |
| `c:software/page:productsCopy.items.peak-hour.features[2]` | End-of-day summary | ملخص نهاية اليوم | keep |  |  |  |
| `c:software/page:productsCopy.items.peak-hour.screens[0]` | Tables | الطاولات | keep |  |  |  |
| `c:software/page:productsCopy.items.peak-hour.screens[1]` | Kitchen queue | طلبات المطبخ | keep |  |  |  |
| `c:software/page:productsCopy.items.peak-hour.screens[2]` | Daily summary | ملخص اليوم | keep |  |  |  |
| `c:software/page:productsCopy.demo.arrived` | Arrived | وصلوا | keep |  |  |  |
| `c:software/page:productsCopy.demo.expected` | Expected | متوقّع | keep |  |  |  |
| `c:software/page:productsCopy.demo.scan` | Point the camera at the guest's code | وجّه الكاميرا إلى رمز الضيف | keep |  |  |  |
| `c:software/page:productsCopy.demo.valid` | Welcome, guest 112 | أهلًا بالضيف 112 | keep |  |  |  |
| `c:software/page:productsCopy.demo.guests[0]` | Guest 101 | الضيف 101 | keep |  |  |  |
| `c:software/page:productsCopy.demo.guests[1]` | Guest 102 | الضيف 102 | keep |  |  |  |
| `c:software/page:productsCopy.demo.guests[2]` | Guest 103 | الضيف 103 | keep |  |  |  |
| `c:software/page:productsCopy.demo.guests[3]` | Guest 104 | الضيف 104 | keep |  |  |  |
| `c:software/page:productsCopy.demo.in` | In | حضر | keep |  |  |  |
| `c:software/page:productsCopy.demo.due` | Due | منتظر | keep |  |  |  |
| `c:software/page:productsCopy.demo.table` | Table | طاولة | keep |  |  |  |
| `c:software/page:productsCopy.demo.free` | Free | متاحة | keep |  |  |  |
| `c:software/page:productsCopy.demo.seated` | Seated | مشغولة | keep |  |  |  |
| `c:software/page:productsCopy.demo.order` | Order | طلب | keep |  |  |  |
| `c:software/page:productsCopy.demo.preparing` | Preparing | قيد التحضير | keep |  |  |  |
| `c:software/page:productsCopy.demo.ready` | Ready | جاهز | keep |  |  |  |
| `c:software/page:productsCopy.demo.covers` | Covers | عدد الضيوف | keep |  |  |  |
| `c:software/page:productsCopy.demo.orders` | Orders | الطلبات | keep |  |  |  |
| `c:software/page:productsCopy.demo.peak` | Busiest hour | ساعة الذروة | keep |  |  |  |
| `c:software/page:proof.title` | Live today: a national federation's platform, and the site you're reading. | يعمل اليوم: منصة اتحاد رياضي وطني، والموقع الذي تقرؤه الآن. | Owner rule 1 | (keep) | يعمل اليوم: منصة اتحاد رياضي وطني، والموقع الذي تقرؤونه الآن. |  |
| `c:software/page:proof.federation.label` | A national sports federation | اتحاد رياضي وطني | keep |  |  |  |
| `c:software/page:proof.federation.line` | Bilingual website, mobile app and content management system, all live. | موقع بلغتين وتطبيق جوّال ونظام لإدارة المحتوى، وكلها تعمل الآن. | keep |  |  |  |
| `c:software/page:proof.federation.link` | Read the case study | اقرأ دراسة الحالة | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | قراءة دراسة الحالة |  |
| `c:software/page:proof.site.label` | This website | هذا الموقع | keep |  |  |  |
| `c:software/page:proof.site.line` | Designed and built by our team in Arabic and English, with full right-to-left layouts. The screens here are captured from it. | صمّمه فريقنا وبناه بالعربية والإنجليزية، مع دعم كامل للاتجاه من اليمين إلى اليسار. الشاشات هنا ملتقطة منه مباشرة. | keep |  |  |  |
| `c:software/page:proof.site.toggle` | Show the site in | اعرض الموقع بـ | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | عرض الموقع بـ |  |
| `c:software/page:proof.site.english` | English | الإنجليزية | keep |  |  |  |
| `c:software/page:proof.site.arabic` | Arabic | العربية | keep |  |  |  |
| `c:software/page:proof.site.lighthouse` | Mobile Lighthouse, measured on the live site | نتيجة Lighthouse على الجوّال، مقيسة على الموقع المنشور | keep |  |  |  |
| `c:software/page:proof.review.title` | How does your site look on a phone, in Arabic? | كيف يبدو موقعك على الهاتف، وبالعربية؟ | Owner rule 1 | (keep) | كيف يبدو موقعكم على الهاتف، وبالعربية؟ |  |
| `c:software/page:quality.title` | The parts nobody sees, checked on every build. | التفاصيل التي لا يراها أحد، نتحقق منها في كل مشروع. | keep | (keep) | (keep) | ⚑ R8 (the quality checks run on every build) |
| `c:software/page:quality.items[0]` | Arabic and English, right-to-left and left-to-right | العربية والإنجليزية، من اليمين إلى اليسار ومن اليسار إلى اليمين | keep |  |  |  |
| `c:software/page:quality.items[1]` | Accessibility: keyboard, contrast and screen readers | سهولة الوصول: لوحة المفاتيح والتباين وقارئات الشاشة | keep |  |  |  |
| `c:software/page:quality.items[2]` | A performance budget for every page, measured against Core Web Vitals | ميزانية أداء لكل صفحة، نقيسها بمؤشرات Core Web Vitals | keep |  |  |  |
| `c:software/page:quality.items[3]` | Security and data protection, designed with the UAE's personal data protection law (PDPL) in mind | الأمان وحماية البيانات، مع مراعاة قانون حماية البيانات الشخصية في الإمارات | keep | (keep) | (keep) | ⚑ FC#22 (Rand reads the legal pages last) |
| `c:software/page:quality.stack` | Built with Next.js · React · TypeScript · Node.js · iOS and Android | نبني بـ Next.js · React · TypeScript · Node.js · iOS و Android | N18 rule (AR) | (keep) | نبني بـ Next.js · React · TypeScript · Node.js · iOS وAndroid | ⚑ FC#21 |
| `c:software/page:seo.title` | Website and App Development in Dubai \| NO TIME | تطوير المواقع والتطبيقات في دبي \| NO TIME | keep |  |  |  |
| `c:software/page:seo.description` | Bilingual Arabic–English websites, mobile apps, event registration systems and custom platforms, built in Dubai by the team that also runs events. | مواقع بالعربية والإنجليزية، وتطبيقات جوّال، وأنظمة تسجيل للفعاليات، ومنصّات مخصّصة، يبنيها في دبي الفريق الذي يدير الفعاليات أيضًا. | keep |  |  |  |
| `c:software/page:serviceBlocks.websites.outcome` | A site your clients actually use, in Arabic and English. | موقع يستخدمه عملاؤك فعلًا، بالعربية والإنجليزية. | Owner rule 1 | (keep) | موقع يستخدمه عملاؤكم فعلًا، بالعربية والإنجليزية. |  |
| `c:software/page:serviceBlocks.websites.idealFor[0]` | Companies selling to Arabic and English speakers | شركات تخاطب عملاء بالعربية والإنجليزية | keep |  |  |  |
| `c:software/page:serviceBlocks.websites.idealFor[1]` | Teams that update their content often | فرق تحدّث محتواها باستمرار | keep |  |  |  |
| `c:software/page:serviceBlocks.websites.idealFor[2]` | Brands replacing an English-only site | علامات تستبدل موقعًا بالإنجليزية فقط | keep |  |  |  |
| `c:software/page:serviceBlocks.mobile-apps.outcome` | An app on your clients' phones, fed by the same content as your site. | تطبيق على هواتف عملائك، يعرض المحتوى نفسه الذي في موقعك. | Owner rule 1 | (keep) | تطبيق على هواتف عملائكم، يعرض المحتوى نفسه الذي في موقعكم. |  |
| `c:software/page:serviceBlocks.mobile-apps.idealFor[0]` | Services customers book or check often | خدمات يحجزها العملاء أو يتابعونها كثيرًا | keep |  |  |  |
| `c:software/page:serviceBlocks.mobile-apps.idealFor[1]` | Membership and loyalty programmes | برامج العضوية والولاء | keep |  |  |  |
| `c:software/page:serviceBlocks.mobile-apps.idealFor[2]` | Events with an agenda and live updates | فعاليات ببرنامج وتحديثات مباشرة | keep |  |  |  |
| `c:software/page:serviceBlocks.custom-systems.outcome` | Spreadsheets and email threads, replaced by one system your team runs. | نظام واحد يديره فريقك، بدل جداول البيانات وسلاسل الرسائل. | Owner rule 1 | (keep) | نظام واحد يديره فريقكم، بدل جداول البيانات وسلاسل الرسائل. |  |
| `c:software/page:serviceBlocks.custom-systems.idealFor[0]` | Operations that run on spreadsheets | عمليات تُدار بجداول البيانات | keep |  |  |  |
| `c:software/page:serviceBlocks.custom-systems.idealFor[1]` | Teams that need roles and approvals | فرق تحتاج إلى أدوار وموافقات | keep |  |  |  |
| `c:software/page:serviceBlocks.custom-systems.idealFor[2]` | Businesses connecting several tools | أعمال تربط بين عدة أدوات | keep |  |  |  |
| `c:software/page:serviceBlocks.e-commerce.outcome` | A store where buying takes a few clear steps, and orders are easy to follow. | متجر يُتمّ فيه العميل شراءه بخطوات قليلة وواضحة، ويتابع طلبه بسهولة. | keep |  |  |  |
| `c:software/page:serviceBlocks.e-commerce.idealFor[0]` | Retail brands starting to sell online | علامات تجزئة تبدأ البيع عبر الإنترنت | keep |  |  |  |
| `c:software/page:serviceBlocks.e-commerce.idealFor[1]` | Shops moving to a store of their own | متاجر تنتقل إلى متجرها الإلكتروني الخاص | keep |  |  |  |
| `c:software/page:serviceBlocks.e-commerce.idealFor[2]` | Gift and catering orders | طلبات الهدايا والضيافة | keep |  |  |  |
| `c:software/page:serviceBlocks.ui-ux-design.outcome` | Interfaces people understand the first time they use them. | واجهات يفهمها الناس من أول استخدام. | keep |  |  |  |
| `c:software/page:serviceBlocks.ui-ux-design.idealFor[0]` | Products before development starts | منتجات قبل أن تبدأ برمجتها | keep |  |  |  |
| `c:software/page:serviceBlocks.ui-ux-design.idealFor[1]` | Apps and sites people leave halfway | تطبيقات ومواقع يتركها المستخدمون في منتصف الطريق | keep |  |  |  |
| `c:software/page:serviceBlocks.ui-ux-design.idealFor[2]` | Teams building a design system | فرق تبني نظام تصميم | keep |  |  |  |
| `c:software/page:serviceBlocks.ai-consulting.outcome` | A clear answer on where AI saves your team time, and where it doesn't. | إجابة واضحة عن المواضع التي يوفّر فيها الذكاء الاصطناعي وقت فريقك، وأين لا يفعل. | Owner rule 1 | (keep) | إجابة واضحة عن المواضع التي يوفّر فيها الذكاء الاصطناعي وقت فريقكم، وأين لا يفعل. |  |
| `c:software/page:serviceBlocks.ai-consulting.idealFor[0]` | Teams with repetitive written work | فرق لديها أعمال كتابية متكررة | keep |  |  |  |
| `c:software/page:serviceBlocks.ai-consulting.idealFor[1]` | Managers asked for an AI plan | مديرون مطلوب منهم خطة للذكاء الاصطناعي | keep |  |  |  |
| `c:software/page:serviceBlocks.ai-consulting.idealFor[2]` | Businesses unsure where to start | أعمال لا تعرف من أين تبدأ | keep |  |  |  |
| `c:software/page:services.title` | Six things we build, all in Arabic and English from the first screen. | ستة أشياء نبنيها، وكلها بالعربية والإنجليزية من الشاشة الأولى. | keep |  |  |  |
| `c:software/page:services.lead` | Website, app and system development in Dubai, for businesses in the UAE and across the region. | تطوير المواقع والتطبيقات والأنظمة في دبي، لأعمال في الإمارات وفي أنحاء المنطقة. | keep |  |  |  |
| `c:software/page:services.idealFor` | Ideal for | مناسب لـ | keep |  |  |  |
| `c:software/page:services.receive` | You receive | ما تحصل عليه | Owner rule 1 | (keep) | ما تحصلون عليه |  |
| `c:software/page:services.phases` | Stages | المراحل | keep |  |  |  |
| `c:software/page:sticky.label` | Quick actions | إجراءات سريعة | keep |  |  |  |
| `c:software/page:sticky.book` | Book a free intro call | احجز مكالمة مجانية | D-C1 (owner): a marketing call to action, so the plural command | Request a free call | اطلبوا مكالمة مجانية | ⚑ R1 (the intro call is free, 30 minutes) |
| `c:software/page:tiers.title` | Start where your business is today. Grow from there. | ابدأ من حيث يقف عملك اليوم، ثم انمُ منه. | Owner rule 1 (AR); EN keep | (keep) | ابدؤوا من حيث يقف عملكم اليوم، ثم توسّعوا منه. |  |
| `c:software/page:tiers.intro` | Three levels of scope, from a focused website to a platform that keeps growing. | ثلاثة مستويات من النطاق، من موقع مركّز إلى منصّة تواصل النمو. | keep |  |  |  |
| `c:software/page:tiers.note` | Every project is scoped and quoted individually. | نحدّد نطاق كل مشروع ونسعّره على حدة. | Corporate register (§2), as the Contact FAQ | We price each project once we understand it. | نسعّر كل مشروع بعد أن نفهمه. |  |
| `c:software/page:tiers.idealFor` | Ideal for | مناسب لـ | keep |  |  |  |
| `c:software/page:tiers.included` | What's included | ما يشمله | keep |  |  |  |
| `c:software/page:tiers.receive` | You receive | تستلم | Owner rule 1 | (keep) | تستلمون |  |
| `c:software/page:tiers.cta` | Talk about {tier} | ناقش معنا مستوى {tier} | D-C1 (owner): a marketing call to action, so the plural command | (keep) | ناقشوا معنا مستوى {tier} |  |
| `c:software/page:tiers.items.launch.name` | Launch | الانطلاق | keep |  |  |  |
| `c:software/page:tiers.items.launch.summary` | A focused bilingual website. | موقع مركّز بلغتين. | keep |  |  |  |
| `c:software/page:tiers.items.launch.ideal` | A new business, a new brand, or a site that needs replacing. | عمل جديد، أو علامة جديدة، أو موقع حان وقت استبداله. | keep |  |  |  |
| `c:software/page:tiers.items.launch.included[0]` | A website in Arabic and English | موقع بالعربية والإنجليزية | keep |  |  |  |
| `c:software/page:tiers.items.launch.included[1]` | Full right-to-left layout | دعم كامل للاتجاه من اليمين إلى اليسار | keep |  |  |  |
| `c:software/page:tiers.items.launch.included[2]` | Designed for the phone first | تصميم يبدأ من الهاتف | keep |  |  |  |
| `c:software/page:tiers.items.launch.included[3]` | Core SEO and speed setup | إعداد أساسي للظهور في محركات البحث والسرعة | keep |  |  |  |
| `c:software/page:tiers.items.launch.included[4]` | Contact and enquiry forms | نماذج التواصل والاستفسارات | keep |  |  |  |
| `c:software/page:tiers.items.launch.receive` | A live site and a handover session for your team | موقع يعمل، وجلسة تسليم لفريقك | Owner rule 1 | (keep) | موقع يعمل، وجلسة تسليم لفريقكم |  |
| `c:software/page:tiers.items.grow.name` | Grow | النمو | keep |  |  |  |
| `c:software/page:tiers.items.grow.summary` | Website, content system, SEO and integrations. | موقع ونظام لإدارة المحتوى وظهور في محركات البحث وربط بأدواتك. | Owner rule 1 | (keep) | موقع ونظام لإدارة المحتوى وظهور في محركات البحث وربط بأدواتكم. |  |
| `c:software/page:tiers.items.grow.ideal` | Teams that publish often and need the site to bring in enquiries. | فرق تنشر باستمرار، وتريد موقعًا يجلب لها الطلبات. | keep |  |  |  |
| `c:software/page:tiers.items.grow.included[0]` | Everything in Launch | كل ما يشمله الانطلاق | keep |  |  |  |
| `c:software/page:tiers.items.grow.included[1]` | A content system your team runs | نظام لإدارة المحتوى يديره فريقك | Owner rule 1 | (keep) | نظام لإدارة المحتوى يديره فريقكم |  |
| `c:software/page:tiers.items.grow.included[2]` | SEO structure in both languages | بنية للظهور في محركات البحث باللغتين | keep |  |  |  |
| `c:software/page:tiers.items.grow.included[3]` | Integrations with your CRM, booking or email tools | الربط بأدوات إدارة العملاء أو الحجز أو البريد | keep |  |  |  |
| `c:software/page:tiers.items.grow.included[4]` | News, blog or resources section | قسم للأخبار أو المدونة أو المصادر | keep |  |  |  |
| `c:software/page:tiers.items.grow.included[5]` | Performance and search reporting | تقارير عن الأداء والظهور في البحث | keep |  |  |  |
| `c:software/page:tiers.items.grow.receive` | A site your team updates itself, connected to the tools you use | موقع يحدّثه فريقك بنفسه، ومرتبط بالأدوات التي تستخدمها | Owner rule 1 | (keep) | موقع يحدّثه فريقكم بنفسه، ومرتبط بالأدوات التي تستخدمونها |  |
| `c:software/page:tiers.items.platform.name` | Platform | المنصّة | keep |  |  |  |
| `c:software/page:tiers.items.platform.summary` | A custom system or app, dashboards and ongoing development. | نظام أو تطبيق مخصّص، ولوحات إدارة، وتطوير مستمر. | keep |  |  |  |
| `c:software/page:tiers.items.platform.ideal` | Businesses whose users, processes or data need more than a website. | أعمال يحتاج مستخدموها أو عملياتها أو بياناتها إلى أكثر من موقع. | keep |  |  |  |
| `c:software/page:tiers.items.platform.included[0]` | A custom web platform or mobile app | منصّة ويب أو تطبيق جوّال مخصّص | keep |  |  |  |
| `c:software/page:tiers.items.platform.included[1]` | Admin dashboards and analytics | لوحات إدارة وتحليلات | keep |  |  |  |
| `c:software/page:tiers.items.platform.included[2]` | Roles and permissions | أدوار وصلاحيات | keep |  |  |  |
| `c:software/page:tiers.items.platform.included[3]` | Integrations and APIs | الربط بالأنظمة والواجهات البرمجية | keep |  |  |  |
| `c:software/page:tiers.items.platform.included[4]` | Arabic and English from the first screen | العربية والإنجليزية من الشاشة الأولى | keep |  |  |  |
| `c:software/page:tiers.items.platform.included[5]` | Ongoing development in stages | تطوير مستمر على مراحل | keep |  |  |  |
| `c:software/page:tiers.items.platform.receive` | A working platform, its documentation and a development roadmap | منصّة تعمل، مع توثيقها وخطة لتطويرها | keep |  |  |  |
| `c:software/page:ways.title` | After launch, the work keeps going. So do we. | بعد الإطلاق يستمر العمل، ونستمر معه. | keep |  |  |  |
| `c:software/page:ways.lead` | Two ways to work with us. | طريقتان للعمل معنا. | keep |  |  |  |
| `c:software/page:ways.items[project].name` | Fixed-scope project | مشروع بنطاق محدّد | keep |  |  |  |
| `c:software/page:ways.items[project].body` | A defined scope, a plan with dates, and a launch. Right for a new site, app or system. | نطاق محدّد وخطة بالمواعيد وإطلاق. يناسب موقعًا أو تطبيقًا أو نظامًا جديدًا. | keep |  |  |  |
| `c:software/page:ways.items[project].points[0]` | Scope and plan agreed before work starts | نتّفق على النطاق والخطة قبل بدء العمل | keep |  |  |  |
| `c:software/page:ways.items[project].points[1]` | Progress you can see at every stage | تقدّم تراه في كل مرحلة | Owner rule 1 | (keep) | تقدّم ترونه في كل مرحلة | ⚑ FC#24 |
| `c:software/page:ways.items[project].points[2]` | Launch and handover to your team | الإطلاق والتسليم لفريقك | Owner rule 1 | (keep) | الإطلاق والتسليم لفريقكم |  |
| `c:software/page:ways.items[support].name` | Monthly support & growth | دعم وتطوير شهري | keep |  |  |  |
| `c:software/page:ways.items[support].tag` | The natural next step after launch | الخطوة الطبيعية بعد الإطلاق | keep |  |  |  |
| `c:software/page:ways.items[support].body` | After launch we keep the product healthy and moving forward, month by month. | بعد الإطلاق نحافظ على المنتج ونطوّره، شهرًا بعد شهر. | keep |  |  |  |
| `c:software/page:ways.items[support].points[0]` | Maintenance and updates | الصيانة والتحديثات | keep |  |  |  |
| `c:software/page:ways.items[support].points[1]` | Improvements and new features | تحسينات وميزات جديدة | keep |  |  |  |
| `c:software/page:ways.items[support].points[2]` | Content updates | تحديث المحتوى | keep |  |  |  |
| `c:software/page:ways.items[support].points[3]` | Monthly reporting | تقارير شهرية | keep | (keep) | (keep) | ⚑ R7 (a monthly report in every support plan) |
| `c:software/page:why.title` | One team that plans the event, writes the Arabic and ships the code. | فريق واحد يخطّط للفعالية، ويكتب العربية، ويطلق المنصّة. | keep |  |  |  |
| `c:software/page:why.lead` | Why NO TIME, in five lines. | لماذا NO TIME، في خمسة أسطر. | keep |  |  |  |
| `c:software/page:why.items[0].title` | One team for events and digital | فريق واحد للفعاليات والحلول الرقمية | Choice 1 (`why.title` above already says it) | Events and digital under one roof | الفعاليات والحلول الرقمية تحت سقف واحد |  |
| `c:software/page:why.items[0].body` | The people who run your event build its registration, app and screens, so nothing gets lost between vendors. | من يدير فعاليتك يبني تسجيلها وتطبيقها وشاشاتها، فلا يضيع شيء بين الموردين. | Owner rule 1 | (keep) | من يدير فعاليتكم يبني تسجيلها وتطبيقها وشاشاتها، فلا يضيع شيء بين الموردين. |  |
| `c:software/page:why.items[1].title` | Native Arabic and English | عربية وإنجليزية أصيلتان | keep |  |  |  |
| `c:software/page:why.items[1].body` | Arabic is written for Gulf readers, not translated at the end, and every layout mirrors properly. | نكتب العربية لقرّاء الخليج لا نترجمها في النهاية، وكل تصميم ينعكس اتجاهه كما ينبغي. | Owner: "the region", not "the Gulf" (the markets reach Egypt) | Arabic is written for readers in the region, not translated at the end, and every layout mirrors properly. | نكتب العربية لقرّاء المنطقة لا نترجمها في النهاية، وكل تصميم ينعكس اتجاهه كما ينبغي. |  |
| `c:software/page:why.items[2].title` | Performance and SEO built in | الأداء والظهور في البحث جزء من البناء | keep |  |  |  |
| `c:software/page:why.items[2].body` | Speed and search structure are part of the build, and we check them before launch. | السرعة وبنية الظهور في محركات البحث جزء من البناء، ونتحقق منهما قبل الإطلاق. | keep |  |  |  |
| `c:software/page:why.items[3].title` | Support after launch | دعم بعد الإطلاق | keep |  |  |  |
| `c:software/page:why.items[3].body` | We stay after go-live, with maintenance and improvements on agreed terms. | نبقى معك بعد الإطلاق، بالصيانة والتحسينات وفق ما نتّفق عليه. | Owner rule 1 | (keep) | نبقى معكم بعد الإطلاق، بالصيانة والتحسينات وفق ما نتّفق عليه. | ⚑ FC#24 |
| `c:software/page:why.items[4].title` | Progress you can see | تقدّم تراه بعينك | Owner rule 1 | (keep) | تقدّم ترونه بأعينكم |  |
| `c:software/page:why.items[4].body` | A clickable prototype first, then a staging link you can open at any stage. | نموذج تفاعلي أولًا، ثم رابط تجريبي تفتحه في أي مرحلة. | Owner rule 1 | (keep) | نموذج تفاعلي أولًا، ثم رابط تجريبي تفتحونه في أي مرحلة. |  |

## Work and case studies

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:workIndex.metaTitle` | Our work | أعمالنا | SEO: "Our work" alone matches no search | Our work: events, stands and digital | أعمالنا: فعاليات وأجنحة وحلول رقمية |  |
| `m:workIndex.metaDescription` | Selected projects by NO TIME Creative House: an airline's exhibition pavilion, a football league's tournaments and award nights, and a sports federation's website, app and daily channels. | مشاريع مختارة من NO TIME Creative House: جناح لشركة طيران وطنية في المعارض، وبطولات دوري كرة قدم وليالي تكريمه، وموقع اتحاد رياضي وتطبيقه ومنصّاته اليومية. | SEO: 190 chars, cut in results | An airline's pavilion at the Dubai Airshow, a football league's award nights, and a sports federation's website and app: what we did on each. | جناح لشركة طيران في معرض دبي للطيران، وليالي تكريم لدوري كرة قدم، وموقع اتحاد رياضي وتطبيقه: ما الذي قدّمناه في كل منها. | case studies (anonymous) |
| `m:workIndex.metaFiltered` | Our work: {filter} | أعمالنا: {filter} | keep |  |  |  |
| `m:workIndex.eyebrow` | Our work | أعمالنا | keep |  |  |  |
| `m:workIndex.headingLead` | Work for national organisations, | أعمال لجهات وطنية، | keep |  |  |  |
| `m:workIndex.headingKey` | shown project by project. | مشروعًا بعد مشروع. | keep |  |  |  |
| `m:workIndex.intro` | A pavilion at the Dubai Airshow, a football league's award nights, a federation's website, app and daily channels. Each client's name appears once they approve it. | جناح في معرض دبي للطيران، وليالي تكريم لدوري كرة قدم، وموقع اتحاد رياضي وتطبيقه ومنصّاته اليومية. يظهر اسم كل عميل حين يوافق على ذكره. | keep |  |  |  |
| `m:workIndex.filterLabel` | Filter the work | تصفية الأعمال | keep |  |  |  |
| `m:workIndex.serviceFacet` | Service | الخدمة | keep |  |  |  |
| `m:workIndex.marketFacet` | Market | السوق | keep |  |  |  |
| `m:workIndex.allServices` | All services | كل الخدمات | keep |  |  |  |
| `m:workIndex.allMarkets` | All markets | كل الأسواق | keep |  |  |  |
| `m:workIndex.count` | {count, plural, =0 {No projects} one {# project} other {# projects}} | {count, plural, zero {لا مشاريع} one {مشروع واحد} two {مشروعان} few {{count} مشاريع} many {{count} مشروعًا} other {{count} مشروع}} | keep |  |  |  |
| `m:workIndex.emptyTitle` | No project to show here yet. | لا مشروع نعرضه هنا بعد. | keep |  |  |  |
| `m:workIndex.emptyBody` | We list only work we can back with facts, so this page grows one project at a time. Clear a filter, or see what we do in this area. | لا ننشر إلا عملًا نملك حقائقه، لذلك تكبر هذه الصفحة مشروعًا بعد مشروع. أزل أحد عوامل التصفية، أو تعرّف على ما نقدّمه في هذا المجال. | Owner rule 1 (AR); EN keep | (keep) | لا ننشر إلا عملًا نملك حقائقه، لذلك تكبر هذه الصفحة مشروعًا بعد مشروع. أزيلوا أحد عوامل التصفية، أو تعرّفوا على ما نقدّمه في هذا المجال. |  |
| `m:workIndex.showAll` | Show all work | اعرض كل الأعمال | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | عرض كل الأعمال |  |
| `m:workIndex.exploreServices` | Explore our services | تصفّح خدماتنا | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | استعراض خدماتنا |  |
| `m:workCase.factsLabel` | Key facts | أبرز المعلومات | keep |  |  |  |
| `m:workCase.client` | Client | العميل | keep |  |  |  |
| `m:workCase.market` | Market | السوق | keep |  |  |  |
| `m:workCase.services` | Services | الخدمات | keep |  |  |  |
| `m:workCase.onThisPage` | On this page | في هذه الصفحة | keep |  |  |  |
| `m:workCase.scopeTitle` | The services behind it | الخدمات التي قام عليها المشروع | keep |  |  |  |
| `m:workCase.scopeIntro` | Each one has its own section, with what we deliver. | لكل خدمة قسمها الخاص، وفيه ما نقدّمه. | keep |  |  |  |
| `m:workCase.next` | Next project | المشروع التالي | keep |  |  |  |
| `m:workCase.ctaTitle` | Planning something like this? | تخطّط لمشروع كهذا؟ | N16 (approved) EN; AR by owner rule 1 (was «تخطّط»): confirm | (keep) | تخطّطون لمشروع كهذا؟ |  |
| `m:workCase.ctaBody` | Start with the services this project used. Each page lists what we deliver, and how to reach us. | ابدأ بالخدمات التي قام عليها هذا المشروع. في كل صفحة ما نقدّمه، وطريقة التواصل معنا. | Owner rule 1 (AR); EN keep | (keep) | ابدؤوا بالخدمات التي قام عليها هذا المشروع. في كل صفحة ما نقدّمه، وطريقة التواصل معنا. |  |
| `m:workCase.ctaQuote` | Request a quote | اطلب عرض سعر | D-C1 (owner): a marketing call to action, so the plural command | (keep) | اطلبوا عرض سعر |  |
| `m:workCase.ctaCategory` | Explore {category} | تصفّح {category} | D-C1 (owner): a marketing call to action, so the plural command | (keep) | استكشفوا {category} |  |
| `c:work:workItems[sports-federation-digital-partner].anonymous.label` | A national sports federation | اتحاد رياضي وطني | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].anonymous.summary` | Its digital and media partner: we rebuilt the bilingual website and its connected app, and publish to its channels every day in Arabic and English. One championship campaign, first week: 487K views, +37.6K new followers, 271K reach. | شريكه الرقمي والإعلامي: أعدنا بناء موقعه بلغتين وتطبيق الجوّال المتصل به، وننشر على منصّاته كل يوم بالعربية والإنجليزية. وفي الأسبوع الأول من إحدى حملات البطولات: 487 ألف مشاهدة، و37.6 ألف متابع جديد، ووصول إلى 271 ألفًا. | keep | (keep) | (keep) | ⚑ FC#4 + the figures: the client agrees to their publication |
| `c:work:workItems[sports-federation-digital-partner].named.label` | UAE Athletics Federation | الاتحاد الإماراتي لألعاب القوى | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].named.summary` | The federation's appointed digital and media partner: a full rebuild of the bilingual website and the connected mobile app, plus daily social media in Arabic and English. First week of the Oregon 26 campaign: 487K views, +37.6K new followers, 271K reach. | الشريك الرقمي والإعلامي المعتمد للاتحاد: إعادة بناء كاملة للموقع الإلكتروني ثنائي اللغة وتطبيق الجوّال المرتبط به، مع إدارة يومية لوسائل التواصل بالعربية والإنجليزية. في الأسبوع الأول من حملة أوريغون 26: 487 ألف مشاهدة، و37.6 ألف متابع جديد، ووصول بلغ 271 ألفًا. | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.facts[0].label` | Our role | دورنا | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.facts[0].value` | Appointed digital and media partner | الشريك الرقمي والإعلامي المعتمد | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.facts[1].label` | Platform | المنصّة | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.facts[1].value` | Website and app, live | الموقع والتطبيق متاحان للجمهور | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.execution.lead` | We run the federation's whole online presence: the platform it publishes on, and the channels it speaks through, every day, in both languages. | نتولّى حضور الاتحاد على الإنترنت كاملًا: المنصّة التي ينشر عليها، والقنوات التي يخاطب بها جمهوره، كل يوم وباللغتين. | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.execution.points[0]` | A full rebuild of the bilingual website, with a complete CMS and a connected mobile app | إعادة بناء كاملة للموقع بلغتين، بنظام لإدارة المحتوى وتطبيق جوّال متصل به | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.execution.points[1]` | Sections for athletes, clubs, coaches and referees, and for championships, results and national records | أقسام للرياضيين والأندية والمدربين والحكّام، وللبطولات والنتائج والأرقام القياسية الوطنية | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.execution.points[2]` | News, a media library and live coverage, run from an admin dashboard with analytics | الأخبار ومكتبة الوسائط والتغطية المباشرة، تُدار كلها من لوحة تحكم مزوّدة بالتحليلات | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.execution.points[3]` | A content strategy and a monthly calendar, published every day in Arabic and English | استراتيجية محتوى وخطة نشر شهرية، ونشر يومي بالعربية والإنجليزية | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.execution.points[4]` | On-ground coverage and photography, motion graphics, reels and AI video | تغطية وتصوير في أرض الحدث، وموشن جرافيك، ومقاطع ريلز وفيديو بالذكاء الاصطناعي | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.execution.points[5]` | Paid campaigns and community growth, with championship key visuals, some made with AI | حملات مدفوعة وتنمية لجمهور الحسابات، وتصاميم رئيسية للبطولات أُنتج بعضها بالذكاء الاصطناعي | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.result.lead` | The website and the app are live. On social, one championship campaign drew this in its first week: | الموقع والتطبيق متاحان للجمهور اليوم. وعلى المنصّات، حققت إحدى حملات البطولات في أسبوعها الأول: | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.result.figures[0].value` | 487K | 487 ألف | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.result.figures[0].label` | views | مشاهدة | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.result.figures[1].value` | +37.6K | ‎+37.6 ألف | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.result.figures[1].label` | new followers | متابع جديد | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.result.figures[2].value` | 271K | 271 ألف | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.result.figures[2].label` | campaign reach | وصول للحملة | keep |  |  |  |
| `c:work:workItems[sports-federation-digital-partner].story.result.scope` | One championship campaign, first week only. | حملة بطولة واحدة، في أسبوعها الأول فقط. | keep: the honest scope line the figures need | (keep) | (keep) | ⚑ FC#4 |
| `c:work:workItems[airline-exhibition-pavilion].anonymous.label` | A national airline | شركة طيران وطنية | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].anonymous.summary` | Stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market. | صمّمنا الجناح وبنيناه، وأدرنا علاقاته العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي. | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].named.label` | EgyptAir | مصر للطيران | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].named.summary` | EgyptAir's pavilion: stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market. | جناح مصر للطيران: تصميم الجناح وبناؤه وإدارة العلاقات العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي. | keep (shows only with the client's written approval) | (keep) | (keep) | ⚑ FC#4 |
| `c:work:workItems[airline-exhibition-pavilion].story.facts[0].label` | Our role | دورنا | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].story.facts[0].value` | Stand design, build and on-site PR | تصميم الجناح وبناؤه وعلاقاته العامة | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].story.facts[1].label` | Shows | المعارض | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].story.facts[1].value` | Dubai Airshow · Arabian Travel Market | معرض دبي للطيران · سوق السفر العربي | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].story.execution.lead` | From the first drawing to the show floor: we designed the stand, built it, and ran its PR while the doors were open. | من أول رسم حتى أرض المعرض: صمّمنا الجناح، وبنيناه، وأدرنا علاقاته العامة طوال أيام الحدث. | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].story.execution.points[0]` | Stand design | تصميم الجناح | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].story.execution.points[1]` | Stand build | بناء الجناح | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].story.execution.points[2]` | PR on the show floor | العلاقات العامة في أرض الحدث | keep |  |  |  |
| `c:work:workItems[airline-exhibition-pavilion].story.execution.points[3]` | The media coverage that follows | التغطية الإعلامية التي تليه | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].anonymous.label` | A national football league | دوري كرة قدم وطني | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].anonymous.summary` | Tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets. | هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، ومعها محتوى الدوري على منصّاته، وتغليف الجوائز، وأطقم الهدايا. | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].named.label` | UAE Pro League | رابطة دوري المحترفين الإماراتي | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].named.summary` | Full event delivery for the UAE Pro League: tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets. | تنفيذ متكامل لفعاليات دوري المحترفين الإماراتي: هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، إلى جانب محتوى الدوري على وسائل التواصل، وتغليف الجوائز، وأطقم الهدايا. | keep (shows only with the client's written approval) | (keep) | (keep) | ⚑ FC#4 |
| `c:work:workItems[football-league-events-awards].story.facts[0].label` | Our role | دورنا | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].story.facts[0].value` | Event delivery, content and gifts | تنفيذ الفعاليات والمحتوى والهدايا | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].story.facts[1].label` | Occasions | المناسبات | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].story.facts[1].value` | Tournaments and award nights | البطولات وليالي التكريم | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].story.execution.lead` | The league's big days in one team's hands, from the tournament identity to the boxes the awards arrive in. | أيام الدوري الكبرى في يد فريق واحد، من هوية البطولة حتى العلب التي تصل فيها الجوائز. | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].story.execution.points[0]` | Tournament branding, including a sponsors' tournament identity | هوية البطولات، ومنها هوية بطولة للرعاة | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].story.execution.points[1]` | On-ground production, including a pre-match ceremony | الإنتاج في أرض الحدث، ومنه مراسم ما قبل المباراة | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].story.execution.points[2]` | Award ceremonies and sponsor activations | حفلات التكريم وتفعيلات الرعاة | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].story.execution.points[3]` | Social content for the league: fan zone and round-result posts | محتوى الدوري على منصّاته: منشورات منطقة المشجعين ونتائج الجولات | keep |  |  |  |
| `c:work:workItems[football-league-events-awards].story.execution.points[4]` | Award packaging and a branded corporate gift set | تغليف الجوائز، وطقم هدايا مؤسسية يحمل هوية الدوري | keep |  |  |  |
| `new:workIndex.closing.title` | (new) | (new) | N16 (approved, copy §7.1): reuses `workCase.ctaTitle`, below | (= workCase.ctaTitle) | (= workCase.ctaTitle) |  |
| `new:workIndex.closing.body` | (new) | (new) | N16 (approved) EN; AR by owner rule 1 | Tell us the date and what you need. One team replies within one working day. | أخبرونا بالموعد وما تحتاجون إليه، ويرد عليكم فريق واحد خلال يوم عمل. | ⚑ FC#23 |

## About

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:aboutPage.metaTitle` | About us | من نحن | SEO: "About us" says nothing in a result | About NO TIME, a creative house in Dubai | عن NO TIME، دار إبداعية في دبي |  |
| `m:aboutPage.metaDescription` | NO TIME is a Dubai house for events, marketing, PR and production. One team carries each idea through strategy, creative, production and delivery, across six markets. | NO TIME دار للفعاليات والتسويق والعلاقات العامة والإنتاج، مقرّها دبي. فريق واحد يتابع كل فكرة من الاستراتيجية إلى الإبداع والإنتاج حتى التنفيذ، في ستة أسواق. | Choice 1 ("one team" stays in the page, not in every snippet) | An events, marketing, PR and production house based in Dubai, working across six markets from Saudi Arabia to Egypt. | دار للفعاليات والتسويق والعلاقات العامة والإنتاج، مقرّها دبي، وتعمل في ستة أسواق من السعودية إلى مصر. | p3. ⚑ FC#1 |
| `m:aboutPage.title` | Ideas built where a brand meets its audience. | أفكار تُبنى حيث تلتقي العلامة بجمهورها. | keep |  |  |  |
| `m:aboutPage.story1` | NO TIME is an events, marketing and PR house based in Dubai, working for clients in local, regional and global markets. | NO TIME دار للفعاليات والتسويق والعلاقات العامة، مقرّها دبي، وتعمل لعملاء في أسواق محلية وإقليمية وعالمية. | keep: Rand's own sentence (p3) | (keep) | (keep) | p3 |
| `m:aboutPage.story2` | We start at the exact point where a brand meets its audience, then carry the idea all the way: strategy, creative, production and delivery, by one team. | نبدأ من النقطة التي تلتقي فيها العلامة بجمهورها، ثم نمضي بالفكرة حتى آخرها: الاستراتيجية والإبداع والإنتاج والتنفيذ، بفريق واحد. | keep: Rand's own sentence (p3); this is where "one team" belongs | (keep) | (keep) | p3 |
| `m:aboutPage.story3` | That's why the work spans so much: an airline's pavilion at the Dubai Airshow, a majlis dressed for a heritage welcome, award nights for a football league, a bilingual app for a national sports federation. | ولهذا يتّسع عملنا لكل هذا: جناح لشركة طيران في معرض دبي للطيران، ومجلس تراثي يستقبل الضيوف، وليالي تكريم لدوري كرة قدم، وتطبيق بلغتين لاتحاد رياضي وطني. | keep |  |  |  |
| `m:aboutPage.story4` | Our name comes with a line we keep: it's time to start. | ومع اسمنا عبارة نلتزم بها: حان وقت البداية. | keep |  |  |  |
| `m:aboutPage.seeWork` | See the work | شاهد أعمالنا | D-C1 (owner): a marketing call to action, so the plural command | (keep) | شاهدوا أعمالنا |  |
| `m:aboutPage.principlesEyebrow` | How we work | كيف نعمل | keep |  |  |  |
| `m:aboutPage.principlesTitle` | What stays the same on every project. | ما لا يتغيّر في أي مشروع. | keep |  |  |  |
| `c:principles:principles[one-roof].title` | Under one roof | تحت سقف واحد | keep |  |  |  |
| `c:principles:principles[one-roof].line` | Strategy, creative, production and delivery, carried through by one team. | الاستراتيجية والإبداع والإنتاج والتنفيذ، يتولّاها فريق واحد حتى النهاية. | Choice 1: the story above already says "one team"; give the reason instead | Strategy, creative, production and delivery, with no handover to another agency on the way. | الاستراتيجية والإبداع والإنتاج والتنفيذ، دون أن ينتقل العمل إلى جهة أخرى في الطريق. |  |
| `c:principles:principles[concept-to-guest].title` | From the concept to the guest | من الفكرة إلى الضيف | keep |  |  |  |
| `c:principles:principles[concept-to-guest].line` | Concept, décor, production and the guest experience, planned as one. | الفكرة والديكور والإنتاج واستقبال الضيوف، في خطة واحدة. | keep |  |  |  |
| `c:principles:principles[bilingual].title` | Arabic and English, natively | بالعربية والإنجليزية، كلٌّ بأسلوبه | keep |  |  |  |
| `c:principles:principles[bilingual].line` | Every word written in each language on its own terms, never translated word for word. | نكتب كل كلمة بلغتها وبأسلوبها، لا بترجمة حرفية. | keep |  |  |  |
| `c:principles:principles[six-markets].title` | Six markets, one standard | ستة أسواق، ومعيار واحد | keep |  |  |  |
| `c:principles:principles[six-markets].line` | Based in Dubai, working across the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. | مقرّنا في دبي، ونعمل في الإمارات والسعودية وقطر وعُمان والكويت ومصر. | keep | (keep) | (keep) | ⚑ FC#1 |

## Products

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:productPage.inDevelopment` | In development | قيد التطوير | keep |  |  |  |
| `m:productPage.hookMinuteZero` | The first minute at the door sets the tone for the whole evening. | الدقيقة الأولى عند الباب تحدّد إيقاع الأمسية كلها. | keep |  |  |  |
| `m:productPage.hookPeakHour` | Built for the hour when every table is full and the kitchen can't wait. | صُمّم للساعة التي تمتلئ فيها الطاولات ولا يحتمل المطبخ فيها الانتظار. | keep |  |  |  |
| `m:productPage.problemTitle` | The problem | المشكلة | keep |  |  |  |
| `m:productPage.featuresTitle` | What it does | ماذا يقدّم | keep |  |  |  |
| `m:productPage.screensTitle` | Concept screens | شاشات تصوّرية | keep |  |  |  |
| `m:productPage.screensNote` | Concept screens with example data. The product is in development, so details may change. | شاشات تصوّرية ببيانات توضيحية. المنتج قيد التطوير، وقد تتغيّر بعض التفاصيل. | keep |  |  |  |
| `m:productPage.registerTitle` | Be the first to hear when {product} is ready. | كن أول من يعرف حين يصبح {product} جاهزًا. | Owner rule 1; and N18's agreement: both product names are feminine («الدقيقة صفر»، «ساعة الذروة») | (keep) | كونوا أول من يعرف حين تصبح «{product}» جاهزة. |  |
| `m:productPage.registerBody` | We're building it from our own event and hospitality work. Leave your details and we'll write to you when it's ready. | نطوّره من خبرتنا في الفعاليات والضيافة. اترك بياناتك، وسنكتب لك حين يصبح جاهزًا. | Owner rule 1 (AR); EN keep | (keep) | نطوّره من خبرتنا في الفعاليات والضيافة. اتركوا بياناتكم، وسنكتب لكم حين يصبح جاهزًا. |  |
| `m:productPage.registerCta` | Register interest | سجّل اهتمامك | D-C1 (owner): a marketing call to action, so the plural command | (keep) | سجّلوا اهتمامكم |  |
| `m:productPage.otherProduct` | Also in development | قيد التطوير أيضًا | keep |  |  |  |
| `m:productPage.softwareLink` | See our software services | تعرّف على خدماتنا البرمجية | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | استعراض خدماتنا البرمجية |  |
| `c:product-pages:productPages.minute-zero.problemDetail` | Paper lists and a crowded door turn the first impression into a wait. | القوائم الورقية والازدحام عند الباب يحوّلان الانطباع الأول إلى انتظار. | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[0].title` | QR invitations | دعوات برمز QR | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[0].line` | Each guest receives a personal code with the invitation. | يصل كل ضيف رمزه الخاص مع الدعوة. | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[1].title` | Check-in at the door from a phone | تسجيل الحضور عند الباب من الهاتف | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[1].line` | The team at the door scans each code with a phone. | يمسح فريق الاستقبال كل رمز بالهاتف. | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[2].title` | Live arrivals for the team | متابعة الوصول لحظة بلحظة | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[2].line` | Who has arrived and who is still due, as it happens. | من وصل ومن لم يصل بعد، لحظة بلحظة. | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[3].title` | One guest list | قائمة ضيوف واحدة | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[3].line` | A guest list you can search, so a name never holds up the queue. | قائمة يمكن البحث فيها، فلا يتعطّل الطابور عند اسم. | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[4].title` | Arabic and English | بالعربية والإنجليزية | keep |  |  |  |
| `c:product-pages:productPages.minute-zero.features[4].line` | Invitations and screens in both languages. | الدعوات والشاشات باللغتين. | keep |  |  |  |
| `c:product-pages:productPages.peak-hour.problemDetail` | When the floor and the kitchen work from different slips of paper, the busiest hour is when things slip. | حين يعمل فريق الصالة والمطبخ من أوراق متفرقة، تفلت الأمور في أكثر الساعات ازدحامًا. | keep |  |  |  |
| `c:product-pages:productPages.peak-hour.features[0].title` | Table and order management | إدارة الطاولات والطلبات | keep |  |  |  |
| `c:product-pages:productPages.peak-hour.features[0].line` | Every table and its order on one screen. | كل طاولة وطلبها على شاشة واحدة. | keep |  |  |  |
| `c:product-pages:productPages.peak-hour.features[1].title` | Kitchen display | شاشة للمطبخ | keep |  |  |  |
| `c:product-pages:productPages.peak-hour.features[1].line` | Orders reach the kitchen in sequence, marked preparing or ready. | تصل الطلبات إلى المطبخ بالتسلسل، وعلى كلٍّ منها حالته: قيد التحضير أو جاهز. | keep |  |  |  |
| `c:product-pages:productPages.peak-hour.features[2].title` | End-of-day summary | ملخص نهاية اليوم | keep |  |  |  |
| `c:product-pages:productPages.peak-hour.features[2].line` | Covers, orders and the busiest hour, ready at closing. | عدد الضيوف والطلبات وساعة الذروة، جاهزة عند الإغلاق. | keep |  |  |  |
| `c:product-pages:productPages.peak-hour.features[3].title` | Arabic and English | بالعربية والإنجليزية | keep |  |  |  |
| `c:product-pages:productPages.peak-hour.features[3].line` | For the floor team and the kitchen, in either language. | لفريق الصالة وفريق المطبخ، بأيّ من اللغتين. | keep |  |  |  |
| `c:products:products[qr-check-in].name` | Minute Zero | الدقيقة صفر | keep |  |  |  |
| `c:products:products[qr-check-in].descriptor` | QR event check-in | تسجيل دخول الفعاليات بالـ QR | keep |  |  |  |
| `c:products:products[qr-check-in].summary` | Guests check in at the door with a QR code; the team sees arrivals as they happen. | يسجّل الضيوف دخولهم عند الباب برمز QR، ويرى الفريق الحضور لحظة بلحظة. | keep |  |  |  |
| `c:products:products[restaurant-system].name` | Peak Hour | ساعة الذروة | keep |  |  |  |
| `c:products:products[restaurant-system].descriptor` | Restaurant management | نظام إدارة المطاعم | keep |  |  |  |
| `c:products:products[restaurant-system].summary` | Orders, tables and the kitchen in one system, built for busy service. | الطلبات والطاولات والمطبخ في نظام واحد، مصمّم لأوقات الذروة. | keep |  |  |  |

## Contact and forms

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:contactPage.metaTitle` | Contact: send us a brief | تواصل معنا: أرسل طلبك | A title, not a button: the noun reads right; SEO: the action people search | Request a quote | طلب عرض سعر |  |
| `m:contactPage.metaDescription` | Tell us about your event, campaign, production or platform. One team picks it up and replies within one working day. | حدّثنا عن فعاليتك أو حملتك أو إنتاجك أو منصّتك، ويتولّى طلبك فريق واحد يردّ عليك خلال يوم عمل. | Approved sample; AR by owner rule 1 | Tell us about your event, film, campaign or website. A few lines are enough, and we reply within one working day. | حدّثونا عن فعاليتكم أو فيلمكم أو حملتكم أو موقعكم. تكفي بضعة أسطر، ونرد عليكم خلال يوم عمل. | ⚑ FC#23 |
| `m:contactPage.eyebrow` | Contact | تواصل معنا | Owner rule 1 (the page's name, as the menu) | (keep) | تواصلوا معنا |  |
| `m:contactPage.title` | Tell us what you're planning. | أخبرنا بما تخطّط له. | Approved sample: keep EN; AR by owner rule 1 | (keep) | أخبرونا بما تخطّطون له. |  |
| `m:contactPage.lead` | A few lines are enough to start: the occasion, the date and what you need. One team picks it up and replies within one working day. | بضعة أسطر تكفي للبداية: المناسبة والموعد وما تحتاجه. يتسلّم طلبك فريق واحد، ويرد عليك خلال يوم عمل. | Approved sample; AR by owner rule 1 | A few lines are enough: the occasion, the date and what you need. We reply within one working day, with our questions or a time to talk. | تكفي بضعة أسطر: المناسبة والموعد وما تحتاجون إليه. نرد عليكم خلال يوم عمل، بأسئلتنا أو بموعد نتحدّث فيه. | ⚑ FC#23 |
| `m:contactPage.formTitle` | Send us a brief | أرسل لنا طلبك | A title, not a button: the noun reads right | Request a quote | طلب عرض سعر |  |
| `m:contactPage.directTitle` | Prefer to write directly? | تفضّل المراسلة مباشرة؟ | Approved sample (§3 question headline); AR by owner rule 1 | Or write to us directly | أو راسلونا مباشرة |  |
| `m:contactPage.emailLabel` | Email | البريد الإلكتروني | keep |  |  |  |
| `m:contactPage.copy` | Copy the address | انسخ العنوان | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | نسخ العنوان |  |
| `m:contactPage.copied` | Copied | نُسخ | keep |  |  |  |
| `m:contactPage.whatsapp` | Message us on WhatsApp | راسلنا على واتساب | D-C1 (owner): a marketing call to action, so the plural command | (keep) | راسلونا على واتساب |  |
| `m:contactPage.base` | Based in Dubai | مقرّنا دبي | keep |  |  |  |
| `m:contactPage.faqEyebrow` | Before you write | قبل أن تكتب لنا | Owner rule 1 | (keep) | قبل أن تكتبوا لنا |  |
| `m:contactPage.faqTitle` | Questions we're asked first | أسئلة تصلنا أولًا | keep |  |  |  |
| `m:contactPage.faq.q1` | Do you work outside the UAE? | هل تعملون خارج الإمارات؟ | keep |  |  |  |
| `m:contactPage.faq.a1` | Yes. We're based in Dubai and work across the markets on our About page. Put the city in your brief and we'll plan around it. | نعم. مقرّنا في دبي، ونعمل في الأسواق المذكورة في صفحة «من نحن». اذكر المدينة في طلبك، ونخطّط على أساسها. | Owner rule 1 (AR); EN: "brief" → "request" (choice 2) | Yes. We're based in Dubai and work across the markets on our About page. Put the city in your request and we'll plan around it. | نعم. مقرّنا في دبي، ونعمل في الأسواق المذكورة في صفحة «من نحن». اذكروا المدينة في طلبكم، ونخطّط على أساسها. | ⚑ FC#1 |
| `m:contactPage.faq.q2` | How quickly do you reply, and can you work to a tight date? | ما سرعة ردّكم، وهل تلتزمون بموعد قريب؟ | keep |  |  |  |
| `m:contactPage.faq.a2` | We reply within one working day. Put your date in the brief, and we'll tell you honestly what can be done by then. | نرد خلال يوم عمل. اذكر موعدك في الطلب، وسنخبرك بصراحة بما يمكن إنجازه قبله. | Owner rule 1 (AR); EN: "brief" → "request" (choice 2) | We reply within one working day. Put your date in the request, and we'll tell you honestly what can be done by then. | نرد عليكم خلال يوم عمل. اذكروا موعدكم في الطلب، وسنخبركم بصراحة بما يمكن إنجازه قبله. | ⚑ FC#23 |
| `m:contactPage.faq.q3` | Can one team handle it from strategy to delivery? | هل يتولّى فريق واحد العمل من الاستراتيجية حتى التسليم؟ | keep |  |  |  |
| `m:contactPage.faq.a3` | Yes, that's how we work: one team carries the idea through strategy, creative, production and delivery, so nothing is lost between suppliers. | نعم، وهكذا نعمل: فريق واحد يتابع الفكرة من الاستراتيجية إلى الإبداع والإنتاج والتسليم، فلا يضيع شيء بين الموردين. | Approved sample: keep; this is where "one team" belongs on this page (choice 1) | (keep) | (keep) | p3 |
| `m:contactPage.faq.q4` | What do you need from us to prepare a proposal? | ماذا تحتاجون منّا لإعداد العرض؟ | keep |  |  |  |
| `m:contactPage.faq.a4` | The occasion or goal, the date, the place, the audience, and a budget range if you have one. We ask the rest on a short call. Every project is scoped and quoted individually. | المناسبة أو الهدف، والموعد، والمكان، والجمهور، ونطاق الميزانية إن توفّر. ونسأل عن الباقي في مكالمة قصيرة. نحدّد نطاق كل مشروع ونسعّره على حدة. | Approved sample (last sentence: corporate register, §2); AR by owner rule 1 | The occasion or goal, the date, the place, the audience, and a budget range if you have one. We ask the rest on a short call. We price each project once we understand it. | المناسبة أو الهدف، والموعد، والمكان، والجمهور، ونطاق الميزانية إن توفّر. ونسألكم عن الباقي في مكالمة قصيرة. نسعّر كل مشروع بعد أن نفهمه. |  |
| `m:contactPage.faq.q5` | Do you work in Arabic and English? | هل تعملون بالعربية والإنجليزية؟ | keep |  |  |  |
| `m:contactPage.faq.a5` | Yes. We write, design and publish in both, and each language is written natively, not translated word for word. | نعم. نكتب ونصمّم وننشر باللغتين، ونكتب كل لغة بأسلوبها، لا بترجمة حرفية. | keep |  |  |  |
| `c:form-copy:errorMessages.required` | Fill in this field. | املأ هذا الحقل. | Owner rule 1 (AR); fallback when a field has no message of its own | (keep) | املؤوا هذا الحقل. |  |
| `c:form-copy:errorMessages.email` | Enter an email address like name@company.com. | اكتب بريدًا إلكترونيًا بهذا الشكل: name@company.com | Owner rule 7 (one message per field, saying what's needed) | Enter an email like name@company.com. | اكتبوا البريد الإلكتروني بهذا الشكل: name@company.com |  |
| `c:form-copy:errorMessages.url` | Enter a website address like yourcompany.ae. | اكتب عنوان موقع بهذا الشكل: yourcompany.ae | Owner rule 1 (AR); EN keep (already says what's needed) | (keep) | اكتبوا عنوان الموقع بهذا الشكل: yourcompany.ae |  |
| `c:form-copy:errorMessages.phone` | Enter the number with digits, spaces or a leading +. | اكتب الرقم بالأرقام، ويمكنك استخدام المسافات أو علامة + في أوله. | D-C3 (owner): letters or a wrong length; a number with no country code has its own message (`phoneCode`) | Use digits only, e.g. +971 50 123 4567. | اكتبوا الرقم بالأرقام فقط، مثل ‎+971 50 123 4567. |  |
| `c:form-copy:errorMessages.contact` | Enter an email address or a phone number. | اكتب بريدًا إلكترونيًا أو رقم هاتف. | Owner rule 7: say both shapes that work | Enter an email like name@company.com, or a number with the country code, e.g. +971. | اكتبوا بريدًا إلكترونيًا مثل name@company.com، أو رقمًا مع رمز الدولة مثل ‎+971. |  |
| `c:form-copy:errorMessages.tooLong` | This is too long. Shorten it a little. | النص أطول من المسموح، اختصره قليلًا. | Owner rule 7. Needs `{max}` passed from the schema (a small code change at apply time) | Keep it under {max} characters. | الحد الأقصى لعدد الأحرف: {max} |  |
| `c:form-copy:errorMessages.invalid` | Check this field and try again. | راجع هذا الحقل وحاول مجددًا. | Owner rule 7: stays only as the fallback for a field with no message of its own (today: an unknown product or option) | Something in this field doesn't fit. Check it and try again. | في هذا الحقل ما لا يناسب. راجعوه وحاولوا مرة أخرى. |  |
| `c:form-copy:formCopy.optional` | optional | اختياري | keep |  |  |  |
| `c:form-copy:formCopy.sending` | Sending… | جارٍ الإرسال… | keep |  |  |  |
| `c:form-copy:formCopy.summaryTitle` | Check these before sending: | راجع ما يلي قبل الإرسال: | Owner rule 1 | (keep) | راجعوا ما يلي قبل الإرسال: |  |
| `c:form-copy:formCopy.states.rateLimited` | Too many attempts from this connection. Try again in {minutes} min, or email us at {email}. | محاولات كثيرة من هذا الاتصال. حاول مجددًا بعد {minutes}، أو راسلنا على {email}. | Owner rule 1 (AR); EN keep | (keep) | محاولات كثيرة من هذا الاتصال. حاولوا مرة أخرى بعد {minutes}، أو راسلونا على {email}. |  |
| `c:form-copy:formCopy.states.blocked` | We couldn't confirm the request came from a person. Try again, or email us at {email}. | لم نتمكّن من التأكد من أن الطلب مُرسَل من شخص. حاول مجددًا، أو راسلنا على {email}. | Owner rule 7 (the owner's text) | The security check didn't load. Try again, or email us at {email}. | لم يكتمل التحقق الأمني. حاولوا مرة أخرى أو راسلونا على {email}. |  |
| `c:form-copy:formCopy.states.failed` | Your request didn't send because of a problem on our side. Try again, or email us at {email}. | لم يُرسَل طلبك بسبب خلل لدينا. حاول مجددًا، أو راسلنا على {email}. | Owner rule 1 (AR); EN keep | (keep) | لم يُرسَل طلبكم بسبب خلل لدينا. حاولوا مرة أخرى، أو راسلونا على {email}. |  |
| `c:form-copy:formCopy.states.another` | Send another request | أرسل طلبًا آخر | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | إرسال طلب آخر |  |
| `c:form-copy:formCopy.privacy.text` | We use these details only to reply to you. Resend delivers our email and Cloudflare protects this form from spam. | نستخدم هذه البيانات للرد عليك فقط. توصل خدمة Resend رسائلنا، وتحمي Cloudflare هذا النموذج من الرسائل المزعجة. | N15 (approved): first sentence; AR by owner rule 1. The vendor sentence stays (the legal page names them too) | We use your details only to reply to you. Resend delivers our email and Cloudflare protects this form from spam. | نستخدم بياناتكم للرد عليكم فقط. توصل خدمة Resend رسائلنا، وتحمي Cloudflare هذا النموذج من الرسائل المزعجة. |  |
| `c:form-copy:formCopy.privacy.link` | Privacy Policy | سياسة الخصوصية | keep |  |  |  |
| `c:form-copy:formCopy.honeypot` | Leave this field empty | اترك هذا الحقل فارغًا | Owner rule 1 (screen readers can reach it) | (keep) | اتركوا هذا الحقل فارغًا |  |
| `c:form-copy:formCopy.fields.name` | Your name | اسمك | Owner rule 1: a label with no pronoun reads cleaner in the plural form | (keep) | الاسم |  |
| `c:form-copy:formCopy.fields.email` | Email | البريد الإلكتروني | keep |  |  |  |
| `c:form-copy:formCopy.fields.phone` | Phone or WhatsApp | الهاتف أو واتساب | keep |  |  |  |
| `c:form-copy:formCopy.fields.company` | Company | الشركة | keep |  |  |  |
| `c:form-copy:formCopy.fields.websiteUrl` | Current website | موقعك الحالي | Owner rule 1 | (keep) | موقعكم الحالي |  |
| `c:form-copy:formCopy.fields.websiteUrlHint` | For example, yourcompany.ae | مثال: yourcompany.ae | keep |  |  |  |
| `c:form-copy:formCopy.consultation.project` | Your project | مشروعك | Owner rule 1 | (keep) | مشروعكم |  |
| `c:form-copy:formCopy.consultation.you` | About you | عنك | Owner rule 1 | (keep) | عنكم |  |
| `c:form-copy:formCopy.consultation.build` | What do you want to build? | ماذا تريد أن تبني؟ | Owner rule 1 | (keep) | ماذا تريدون أن تبنوا؟ |  |
| `c:form-copy:formCopy.consultation.buildOptions.websites` | A website | موقع إلكتروني | keep |  |  |  |
| `c:form-copy:formCopy.consultation.buildOptions.apps` | A mobile app | تطبيق جوّال | keep |  |  |  |
| `c:form-copy:formCopy.consultation.buildOptions.systems` | A custom system or dashboard | نظام مخصّص أو لوحة إدارة | keep |  |  |  |
| `c:form-copy:formCopy.consultation.buildOptions.e-commerce` | An online store | متجر إلكتروني | keep |  |  |  |
| `c:form-copy:formCopy.consultation.buildOptions.ux` | UI/UX design | تصميم الواجهات وتجربة المستخدم | keep |  |  |  |
| `c:form-copy:formCopy.consultation.buildOptions.ai-consulting` | AI consulting | استشارات الذكاء الاصطناعي | keep: a service name the client sells (not about how the site's images were made, D106) | (keep) | (keep) |  |
| `c:form-copy:formCopy.consultation.buildOptions.event-tech` | Event technology | تقنيات الفعاليات | keep |  |  |  |
| `c:form-copy:formCopy.consultation.buildOptions.other` | Something else | شيء آخر | keep |  |  |  |
| `c:form-copy:formCopy.consultation.tier` | Engagement level | مستوى التعاون | keep |  |  |  |
| `c:form-copy:formCopy.consultation.tierNone` | Not sure yet | لم أحدّد بعد | Owner rule 1 (an option the user picks, in the plural voice) | (keep) | لم نحدّد بعد |  |
| `c:form-copy:formCopy.consultation.timeline` | When do you want to start? | متى تريد أن تبدأ؟ | Owner rule 1 | (keep) | متى تريدون أن تبدؤوا؟ |  |
| `c:form-copy:formCopy.consultation.timelineOptions.flexible` | I'm flexible | الموعد مرن | EN: the option speaks as the user ("I"), the others don't | Flexible | (keep) |  |
| `c:form-copy:formCopy.consultation.timelineOptions.within-3-months` | Within 3 months | خلال 3 أشهر | keep |  |  |  |
| `c:form-copy:formCopy.consultation.timelineOptions.urgent` | As soon as possible | في أقرب وقت ممكن | keep |  |  |  |
| `c:form-copy:formCopy.consultation.budget` | Budget range | الميزانية التقريبية | keep |  |  |  |
| `c:form-copy:formCopy.consultation.budgetNone` | Choose a range | اختر نطاقًا | Owner rule 1 | (keep) | اختاروا نطاقًا |  |
| `c:form-copy:formCopy.consultation.budgetHint` | It helps us suggest the right scope. It's never a price. | تساعدنا على اقتراح النطاق المناسب، وليست سعرًا. | keep |  |  |  |
| `c:form-copy:formCopy.consultation.message` | Tell us a little more | أخبرنا بالمزيد | Owner rule 1 | (keep) | أخبرونا بالمزيد |  |
| `c:form-copy:formCopy.consultation.messageHint` | Who it's for, what it must do, any date that matters. | لمن هو، وما الذي يجب أن يفعله، وأي موعد يهمّك. | Owner rule 1 | (keep) | لمن هو، وما الذي يجب أن يفعله، وأي موعد يهمّكم. |  |
| `c:form-copy:formCopy.consultation.submit` | Book a free 30-min intro call | احجز مكالمة تعارف مجانية (30 دقيقة) | D-C1 (owner): one of the six approved buttons, back to the plural command as the owner asked, although it submits a form | Book a free 30-min intro call | اطلبوا مكالمة تعارف مجانية (30 دقيقة) | ⚑ R1 (the intro call is free, 30 minutes) |
| `c:form-copy:formCopy.consultation.micro` | No obligation. We reply within one working day. | دون أي التزام. نرد خلال يوم عمل. | keep | (keep) | (keep) | ⚑ FC#23 |
| `c:form-copy:formCopy.consultation.successTitle` | Thanks, {name}. Your request is in. | شكرًا، {name}. وصلنا طلبك. | Choice 2, as the contact form | Thanks, {name}. We have your request. | شكرًا، {name}. وصلنا طلبكم. |  |
| `c:form-copy:formCopy.consultation.successBody` | We reply within one working day to set a time for the call. | نرد خلال يوم عمل لنحدّد موعد المكالمة. | Owner rule 1 (AR); EN keep | (keep) | نرد عليكم خلال يوم عمل لنحدّد موعد المكالمة. | ⚑ FC#23 |
| `c:form-copy:formCopy.consultation.prefilled` | We've filled in: {choice}. Change it if you like. | اخترنا لك: {choice}. يمكنك تغييره. | Owner rule 1 | (keep) | اخترنا لكم: {choice}. يمكنكم تغييره. |  |
| `c:form-copy:formCopy.review.websiteUrl` | Your website address | عنوان موقعك | Owner rule 1 | (keep) | عنوان موقعكم |  |
| `c:form-copy:formCopy.review.contact` | Email or WhatsApp number | البريد الإلكتروني أو رقم واتساب | keep |  |  |  |
| `c:form-copy:formCopy.review.goal` | What's the main goal? | ما هدفك الأساسي؟ | Owner rule 1 | (keep) | ما هدفكم الأساسي؟ |  |
| `c:form-copy:formCopy.review.goalOptions.more-enquiries` | More enquiries | طلبات أكثر | keep |  |  |  |
| `c:form-copy:formCopy.review.goalOptions.arabic-version` | An Arabic version | نسخة عربية | keep |  |  |  |
| `c:form-copy:formCopy.review.goalOptions.speed` | A faster site | موقع أسرع | keep |  |  |  |
| `c:form-copy:formCopy.review.goalOptions.easier-updates` | Easier updates | تحديث أسهل | keep |  |  |  |
| `c:form-copy:formCopy.review.goalOptions.other` | Something else | شيء آخر | keep |  |  |  |
| `c:form-copy:formCopy.review.message` | Anything we should know? | هل هناك ما يجب أن نعرفه؟ | Owner rule 1 (AR); EN keep | (keep) | هل هناك ما يجب أن نعرفه؟ |  |
| `c:form-copy:formCopy.review.submit` | Send my site for review | أرسل موقعي للمراجعة | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | إرسال الموقع للمراجعة |  |
| `c:form-copy:formCopy.review.successTitle` | Thanks, {name}. Your site is with us. | شكرًا، {name}. وصلنا موقعك. | Owner rule 1 (AR); EN keep | (keep) | شكرًا، {name}. وصلنا موقعكم. |  |
| `c:form-copy:formCopy.review.successBody` | Within 3 working days we'll reply with 5 concrete improvements, free. | خلال 3 أيام عمل نرد عليك بخمسة تحسينات عملية، مجانًا. | Owner rule 1 (AR); EN keep. A promise with a number in it | (keep) | خلال 3 أيام عمل نرد عليكم بخمسة تحسينات عملية، مجانًا. | ⚑ R2 (the website review: free, 3 working days, 5 improvements) |
| `c:form-copy:formCopy.interest.message` | What would you use it for? | فيمَ ستستخدمه؟ | Owner rule 1 | (keep) | فيمَ ستستخدمونه؟ |  |
| `c:form-copy:formCopy.interest.submit` | Register interest | سجّل اهتمامك | D-C1 (owner): a form, system or navigation button, so the verbal noun | (keep) | تسجيل الاهتمام |  |
| `c:form-copy:formCopy.interest.successTitle` | Thanks, {name}. You're on the list for {product}. | شكرًا، {name}. سجّلنا اهتمامك بـ{product}. | Owner rule 1 (AR); EN keep | (keep) | شكرًا، {name}. سجّلنا اهتمامكم بـ{product}. |  |
| `c:form-copy:formCopy.interest.successBody` | We'll write to you when it's ready. | سنكتب لك حين يصبح جاهزًا. | Owner rule 1 (AR); EN keep | (keep) | سنكتب لكم حين يصبح جاهزًا. |  |
| `c:form-copy:formCopy.interest.type` | What do you run? | ما الذي تديره؟ | Owner rule 1 | (keep) | ما الذي تديرونه؟ |  |
| `c:form-copy:formCopy.interest.typeOptions.event` | Events | فعاليات | keep |  |  |  |
| `c:form-copy:formCopy.interest.typeOptions.restaurant` | A restaurant or café | مطعم أو مقهى | keep |  |  |  |
| `c:form-copy:formCopy.interest.typeOptions.other` | Something else | شيء آخر | keep |  |  |  |
| `c:form-copy:formCopy.contact.project` | Your project | مشروعك | Owner rule 1 | (keep) | مشروعكم |  |
| `c:form-copy:formCopy.contact.you` | How we reach you | كيف نتواصل معك | Owner rule 1 | (keep) | كيف نتواصل معكم |  |
| `c:form-copy:formCopy.contact.service` | What do you need? | ما الذي تحتاجه؟ | Approved sample: keep EN; AR by owner rule 1 | (keep) | ما الذي تحتاجون إليه؟ |  |
| `c:form-copy:formCopy.contact.serviceNone` | Not sure yet, or several things | لم أحدّد بعد، أو أكثر من خدمة | Approved sample: keep EN; AR by owner rule 1 (the option speaks as the user) | (keep) | لم نحدّد بعد، أو أكثر من خدمة |  |
| `c:form-copy:formCopy.contact.prefilled` | Selected: {choice}. Change it if you need something else. | اخترنا لك: {choice}. غيّره إن كنت تحتاج شيئًا آخر. | Owner rule 1 | (keep) | اخترنا لكم: {choice}. غيّروه إن كنتم تحتاجون شيئًا آخر. |  |
| `c:form-copy:formCopy.contact.timeline` | When is it? | متى موعده؟ | Approved sample (reads as an event's date; N10 shows the event date separately); AR by owner rule 1 | When do you need it? | متى تحتاجون إليه؟ |  |
| `c:form-copy:formCopy.contact.city` | City or country | المدينة أو الدولة | keep |  |  |  |
| `c:form-copy:formCopy.contact.cityHint` | Where the event or the work takes place. | حيث تُقام الفعالية أو يُنفَّذ العمل. | keep |  |  |  |
| `c:form-copy:formCopy.contact.message` | Tell us about it | حدّثنا عنه | Approved sample: keep EN; AR by owner rule 1 | (keep) | حدّثونا عنه |  |
| `c:form-copy:formCopy.contact.messageHint` | The occasion or goal, the audience, and anything already decided. A few lines are enough. | المناسبة أو الهدف، والجمهور، وما تقرّر حتى الآن. تكفي بضعة أسطر. | keep |  |  |  |
| `c:form-copy:formCopy.contact.submit` | Send the brief | أرسل الطلب | Approved sample (choice 2) + owner rule 2 | Send my request | إرسال الطلب |  |
| `c:form-copy:formCopy.contact.micro` | We reply within one working day. | نرد خلال يوم عمل. | keep | (keep) | (keep) | ⚑ FC#23 |
| `c:form-copy:formCopy.contact.successTitle` | Thanks, {name}. Your brief is with us. | شكرًا، {name}. وصلنا طلبك. | Approved sample (choice 2); AR by owner rule 1 | Thanks, {name}. We have your request. | شكرًا، {name}. وصلنا طلبكم. |  |
| `c:form-copy:formCopy.contact.successBody` | We reply within one working day, with the questions we need answered or a time to talk. | نرد خلال يوم عمل، بما نحتاج إلى معرفته أو بموعد للحديث. | Approved sample: keep EN; AR by owner rule 1 | (keep) | نرد عليكم خلال يوم عمل، بما نحتاج إلى معرفته أو بموعد للحديث. | ⚑ FC#23 |
| `c:form-copy:requiredMessages.name` | Enter your name. | اكتب اسمك. | Owner rule 1 | (keep) | اكتبوا اسمكم. |  |
| `c:form-copy:requiredMessages.email` | Enter your email address. | اكتب بريدك الإلكتروني. | Owner rule 1 | (keep) | اكتبوا بريدكم الإلكتروني. |  |
| `c:form-copy:requiredMessages.build` | Choose what you want to build. | اختر ما تريد بناءه. | Owner rule 1 | (keep) | اختاروا ما تريدون بناءه. |  |
| `c:form-copy:requiredMessages.timeline` | Choose when you want to start. | اختر متى تريد أن تبدأ. | Owner rule 1 | (keep) | اختاروا متى تريدون أن تبدؤوا. |  |
| `c:form-copy:requiredMessages.websiteUrl` | Enter your website address. | اكتب عنوان موقعك. | Owner rule 1 | (keep) | اكتبوا عنوان موقعكم. |  |
| `c:form-copy:requiredMessages.contact` | Enter an email address or a WhatsApp number. | اكتب بريدًا إلكترونيًا أو رقم واتساب. | Owner rule 1 | (keep) | اكتبوا بريدًا إلكترونيًا أو رقم واتساب. |  |
| `c:form-copy:requiredMessages.goal` | Choose the main goal. | اختر هدفك الأساسي. | Owner rule 1 | (keep) | اختاروا هدفكم الأساسي. |  |
| `c:form-copy:requiredMessages.message` | Tell us a little about the project. | اكتب لنا بضعة أسطر عن مشروعك. | Owner rule 1 | (keep) | اكتبوا لنا بضعة أسطر عن مشروعكم. |  |
| `c:forms:budgetBands.events[0].label` | Under AED 50,000 | أقل من 50,000 درهم | keep |  |  |  |
| `c:forms:budgetBands.events[1].label` | AED 50,000–150,000 | 50,000–150,000 درهم | keep |  |  |  |
| `c:forms:budgetBands.events[2].label` | AED 150,000–500,000 | 150,000–500,000 درهم | keep |  |  |  |
| `c:forms:budgetBands.events[3].label` | AED 500,000–1,000,000 | 500,000–1,000,000 درهم | keep |  |  |  |
| `c:forms:budgetBands.events[4].label` | Over AED 1,000,000 | أكثر من 1,000,000 درهم | keep |  |  |  |
| `c:forms:budgetBands.events[5].label` | Prefer not to say | أفضّل عدم التحديد | Owner rule 1 (an option the user picks, in the plural voice) | (keep) | نفضّل عدم التحديد |  |
| `c:forms:budgetBands.software[0].label` | Under AED 25,000 | أقل من 25,000 درهم | keep |  |  |  |
| `c:forms:budgetBands.software[1].label` | AED 25,000–75,000 | 25,000–75,000 درهم | keep |  |  |  |
| `c:forms:budgetBands.software[2].label` | AED 75,000–150,000 | 75,000–150,000 درهم | keep |  |  |  |
| `c:forms:budgetBands.software[3].label` | AED 150,000–300,000 | 150,000–300,000 درهم | keep |  |  |  |
| `c:forms:budgetBands.software[4].label` | Over AED 300,000 | أكثر من 300,000 درهم | keep |  |  |  |
| `new:formCopy.contact.eventDate` | (new) | (new) | N10 (approved, copy §9.1): shows only for an Events service or ?category=events-hospitality | Event date (roughly) | تاريخ المناسبة (تقريبًا) |  |
| `new:formCopy.contact.eventDateNone` | (new) | (new) | N10: the month select's empty option | Not set yet | لم نحدّده بعد |  |
| `new:formCopy.contact.guests` | (new) | (new) | N10 (approved, copy §9.1) | Number of guests | عدد الضيوف |  |
| `new:formCopy.contact.guestsNone` | (new) | (new) | N10: the guest select's empty option | Not sure yet | لم نحدّد بعد |  |
| `new:formCopy.contact.guestBands` | (new) | (new) | N10 (GUEST_BANDS in the plan, Task 7); numerals follow the locale rule already in use | Under 50 · 50–150 · 150–500 · 500–1,000 · Over 1,000 | أقل من 50 · 50–150 · 150–500 · 500–1,000 · أكثر من 1,000 |  |
| `new:errorMessages.phoneCode` | (new) | (new) | D-C3 (owner): a number that starts with 0, or with neither + nor 00 | Include the country code, e.g. +971. | أضيفوا رمز الدولة، مثل ‎+971. |  |
| `new:formCopy.fields.phoneHint` | (new) | (new) | D-C3 (owner): shown under the field from the start, before any error | For example, +971 50 123 4567 | مثال: ‎+971 50 123 4567 |  |
| `new:formCopy.review.contactHint` | (new) | (new) | D-C3: the review form's "Email or WhatsApp" field takes a number too, so it shows both shapes | For example, name@company.com or +971 50 123 4567 | مثال: name@company.com أو ‎+971 50 123 4567 |  |

## /links

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:linksPage.metaTitle` | Links | روابط سريعة | keep |  |  |  |
| `m:linksPage.metaDescription` | NO TIME Creative House in one tap: request a quote, see the work, plan an event or a private celebration, or start a website or an app. | NO TIME Creative House بلمسة واحدة: اطلب عرض سعر، شاهد أعمالنا، خطّط لفعالية أو مناسبة خاصة، أو ابدأ موقعك أو تطبيقك. | Owner rule 1 (AR); EN keep | (keep) | NO TIME Creative House بلمسة واحدة: اطلبوا عرض سعر، وشاهدوا أعمالنا، وخطّطوا لفعالية أو مناسبة خاصة، أو ابدؤوا موقعكم أو تطبيقكم. |  |
| `m:linksPage.eyebrow` | Dubai · six markets | دبي · ستة أسواق | keep | (keep) | (keep) | ⚑ FC#1 |
| `m:linksPage.title` | It's time to start. | حان وقت البداية. | keep |  |  |  |
| `m:linksPage.lead` | Events, production, marketing, print and software, from one senior team. | فعاليات وإنتاج وتسويق وطباعة وبرمجيات، بفريق واحد من أصحاب الخبرة. | "senior" is a claim about the team's experience that nothing on the site backs yet | Events, production, marketing, print and software, from one team in Dubai. | فعاليات وإنتاج وتسويق وطباعة وبرمجيات، من فريق واحد في دبي. | If Rand confirms the team's experience, "senior" can come back with the fact behind it (her bio) |
| `m:linksPage.listLabel` | Quick links | روابط سريعة | keep |  |  |  |
| `m:linksPage.whatsapp.title` | Message us on WhatsApp | راسلنا على واتساب | D-C1 (owner): a marketing call to action, so the plural command | (keep) | راسلونا على واتساب |  |
| `m:linksPage.whatsapp.note` | The quickest way to reach the team | أسرع طريق إلى الفريق | keep |  |  |  |
| `m:linksPage.quote.title` | Request a quote | اطلب عرض سعر | D-C1 (owner): a marketing call to action, so the plural command | (keep) | اطلبوا عرض سعر |  |
| `m:linksPage.quote.note` | We reply within one working day | نردّ عليك خلال يوم عمل واحد | Owner rule 1 | (keep) | نردّ عليكم خلال يوم عمل واحد | ⚑ FC#23 |
| `m:linksPage.work.title` | See our work | شاهد أعمالنا | D-C1 (owner): a marketing call to action, so the plural command | (keep) | شاهدوا أعمالنا |  |
| `m:linksPage.work.note` | Pavilions, award nights, platforms | أجنحة معارض، ليالي تكريم، منصّات رقمية | keep |  |  |  |
| `m:linksPage.celebrations.title` | Events & private celebrations | الفعاليات والمناسبات الخاصة | keep |  |  |  |
| `m:linksPage.celebrations.note` | Galas, weddings and family evenings | حفلات رسمية وأعراس وأمسيات عائلية | keep |  |  |  |
| `m:linksPage.software.title` | Websites, apps & software | المواقع والتطبيقات والبرمجيات | keep |  |  |  |
| `m:linksPage.software.note` | Built in Arabic and English | بالعربية والإنجليزية من الأساس | keep |  |  |  |
| `m:linksPage.email` | Or write to us | أو راسلنا على البريد | Owner rule 1 | (keep) | أو راسلونا على البريد |  |
| `c:links:BREADCRUMB_LABELS.home` | Home | الرئيسية | keep |  |  |  |
| `c:links:BREADCRUMB_LABELS.services` | Services | الخدمات | keep |  |  |  |
| `c:links:BREADCRUMB_LABELS.work` | Work | أعمالنا | keep |  |  |  |
| `c:links:BREADCRUMB_LABELS.about` | About | من نحن | keep |  |  |  |
| `c:links:BREADCRUMB_LABELS.contact` | Contact | تواصل معنا | Owner rule 1 (the page's name, as the menu) | (keep) | تواصلوا معنا |  |

## Legal and credits

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `m:legal.eyebrow` | Legal | قانوني | keep |  |  |  |
| `m:legal.updated` | Last updated: | آخر تحديث: | keep |  |  |  |
| `m:legal.contents` | On this page | في هذه الصفحة | keep |  |  |  |
| `m:legal.description.privacy` | What personal data NO TIME Creative House collects through this website, why, who processes it, and your rights. | البيانات الشخصية التي يجمعها NO TIME Creative House عبر هذا الموقع، وسبب جمعها، ومن يعالجها، وحقوقك. | Owner rule 1 (AR; the search snippet of the page); EN keep | (keep) | البيانات الشخصية التي يجمعها NO TIME Creative House عبر هذا الموقع، وسبب جمعها، ومن يعالجها، وحقوقكم. |  |
| `m:legal.description.terms` | The terms that apply when you use the NO TIME Creative House website. | الشروط التي تسري عند استخدامك موقع NO TIME Creative House. | Owner rule 1 (AR); EN keep | (keep) | الشروط التي تسري عند استخدامكم موقع NO TIME Creative House. |  |
| `m:legal.description.cookies` | The cookies and similar storage this website uses, and your choices. | ملفات تعريف الارتباط وأدوات التخزين المشابهة التي يستخدمها هذا الموقع، وخياراتك. | Owner rule 1 (AR); EN keep | (keep) | ملفات تعريف الارتباط وأدوات التخزين المشابهة التي يستخدمها هذا الموقع، وخياراتكم. |  |
| `m:credits.eyebrow` | Credits | المصادر | keep |  |  |  |
| `m:credits.title` | Image credits | مصادر الصور | keep |  |  |  |
| `m:credits.description` | The photographers whose licensed images appear on the NO TIME Creative House website. | المصوّرون الذين تظهر صورهم المرخّصة على موقع NO TIME Creative House. | keep |  |  |  |
| `m:credits.intro` | Some photographs on this site are used under the Pexels and Unsplash licences. They are graded and cropped to the site's palette. Thank you to the photographers below. | نستخدم بعض الصور في هذا الموقع وفق ترخيص Pexels وترخيص Unsplash، بعد ضبط ألوانها وقصّها لتناسب ألوان الموقع. شكرًا للمصوّرين أدناه. | keep |  |  |  |
| `m:credits.on` | on {source} | على {source} | keep |  |  |  |
| `c:legal:legalDocs[privacy].title` | Privacy Policy | سياسة الخصوصية | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[0].heading` | Who we are | من نحن | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[0].blocks[0].p` | This website is run by NO TIME Creative House, based in Dubai, United Arab Emirates. In this policy, “we” and “us” mean NO TIME Creative House. | يدير هذا الموقعَ NO TIME Creative House، ومقرّه دبي، الإمارات العربية المتحدة. ويُقصد بكلمة «نحن» في هذه السياسة NO TIME Creative House. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[0].blocks[1].p` | Our registered legal entity is {legalName}, {address}. | كياننا القانوني المسجّل: {legalName}، {address}. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[0].blocks[2].p` | For any question about your personal data, contact us at {dataRequestContact}. | لأي سؤال عن بياناتك الشخصية، تواصل معنا عبر {dataRequestContact}. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[1].heading` | What this policy covers | نطاق هذه السياسة | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[1].blocks[0].p` | This policy explains what personal data we collect through this website, why, who processes it for us, how long we keep it, and the rights you have. It doesn't cover other websites we link to. | توضّح هذه السياسة البيانات الشخصية التي نجمعها عبر هذا الموقع، وسبب جمعها، ومن يعالجها نيابةً عنّا، ومدة احتفاظنا بها، والحقوق التي تملكها. ولا تشمل المواقع الأخرى التي نضع روابطها. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[2].heading` | What we collect | البيانات التي نجمعها | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[2].blocks[0].p` | What you send us. When you use a form on this site (a consultation request, a quote request, or registering interest in a product), we receive what you enter: your name, your email address and/or WhatsApp number, your company if you give it, the service or product you're asking about, a budget range if you choose one, your message, and the details the form asks for (for example an event date, a city, a guest count, items and quantities, or rental dates). | ما ترسله إلينا. عند استخدامك أحد نماذج الموقع (طلب استشارة، أو طلب عرض سعر، أو تسجيل اهتمامك بأحد منتجاتنا)، يصلنا ما تكتبه: اسمك، وبريدك الإلكتروني و/أو رقم واتساب، واسم شركتك إن ذكرته، والخدمة أو المنتج الذي تسأل عنه، ونطاق الميزانية إن اخترته، ورسالتك، والتفاصيل التي يطلبها النموذج (مثل موعد المناسبة، أو المدينة، أو عدد الضيوف، أو المنتجات والكميات، أو مواعيد الاستئجار). | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[2].blocks[1].p` | Technical data. Like any website, our hosting provider processes your IP address and basic browser information to deliver pages and keep the site secure. When you submit a form, Cloudflare Turnstile checks that the request comes from a person and not an automated program, and we use your IP address for a short time to limit repeated submissions. A form also tells us how you reached the site (a link's campaign tag, the site you came from and your first page on ours), so we know which post or link brought you. | البيانات التقنية. كأي موقع إلكتروني، يعالج مزوّد الاستضافة عنوان IP الخاص بك ومعلومات أساسية عن متصفحك، لعرض الصفحات والحفاظ على أمن الموقع. وعند إرسال أي نموذج، تتحقّق خدمة Cloudflare Turnstile من أن الطلب صادر عن شخص لا عن برنامج آلي، ونستخدم عنوان IP لفترة قصيرة للحدّ من تكرار الإرسال. ويخبرنا النموذج كذلك كيف وصلت إلى الموقع (وسم الحملة في الرابط، والموقع الذي جئت منه، وأول صفحة زرتها عندنا)، لنعرف المنشور أو الرابط الذي أوصلك إلينا. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[2].blocks[2].p` | Your language choice. One cookie remembers whether you're reading in English or Arabic. See the [Cookie Policy](/cookies). | اختيار اللغة. ملف تعريف ارتباط واحد يتذكّر هل تتصفّح بالعربية أم بالإنجليزية. راجع [سياسة ملفات تعريف الارتباط](/cookies). | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[2].blocks[3].p` | Visit statistics. We count visits with {analytics}, a service that uses no cookies. It records totals such as pages viewed, the site a visit came from, the country and the type of device, without building a profile of you or following you to other sites, so we don't ask for consent. | إحصاءات الزيارات. نحصي الزيارات عبر {analytics}، وهي خدمة لا تستخدم ملفات تعريف الارتباط. تسجّل أرقامًا إجمالية مثل الصفحات التي شوهدت، والموقع الذي جاءت منه الزيارة، والبلد، ونوع الجهاز، دون أن تكوّن ملفًا عنك أو تتبعك إلى مواقع أخرى، لذلك لا نطلب موافقتك. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[2].blocks[4].p` | What we don't do. We don't use analytics or advertising trackers, and we don't sell or rent your data. If we ever add analytics, we'll update this policy first. | ما لا نفعله. لا نستخدم أدوات تحليل أو تتبّع إعلاني، ولا نبيع بياناتك ولا نؤجّرها. وإذا أضفنا أدوات تحليل يومًا ما، فسنحدّث هذه السياسة أولًا. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[2].blocks[5].p` | What we don't do. We don't use advertising trackers, and we don't sell or rent your data. | ما لا نفعله. لا نستخدم أدوات تتبّع إعلاني، ولا نبيع بياناتك ولا نؤجّرها. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[3].heading` | Why we use it | لماذا نستخدم بياناتك | Owner rule 1 (a heading in the page's contents list) | (keep) | لماذا نستخدم بياناتكم |  |
| `c:legal:legalDocs[privacy].sections[3].blocks[0].list[0].text` | To answer your request: to reply, to understand what you need, and to prepare a proposal. We use your data because you asked us to, as a step before a possible agreement with you. | للردّ على طلبك: لنتواصل معك، ونفهم ما تحتاجه، ونعدّ لك عرضًا. نستخدم بياناتك لأنك طلبت منّا ذلك، تمهيدًا لاتفاق محتمل بيننا. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[3].blocks[0].list[1].text` | To keep the site and its forms safe: to block spam and abuse. | لحماية الموقع ونماذجه: لمنع الرسائل المزعجة وإساءة الاستخدام. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[3].blocks[1].p` | We don't use your data for marketing, and we don't make decisions about you by automated means alone. | لا نستخدم بياناتك لأغراض تسويقية، ولا نتّخذ بشأنك قرارات تعتمد على المعالجة الآلية وحدها. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[4].heading` | Who processes it for us | من يعالج بياناتك نيابةً عنّا | Owner rule 1 (a heading in the page's contents list) | (keep) | من يعالج بياناتكم نيابةً عنّا |  |
| `c:legal:legalDocs[privacy].sections[4].blocks[0].p` | We use a small number of service providers, who process data only to provide their service to us: | نستعين بعدد محدود من مزوّدي الخدمات، ولا يعالج أيٌّ منهم البيانات إلا لتقديم خدمته لنا: | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[4].blocks[1].list[0].text` | Hostinger hosts the website. | Hostinger لاستضافة الموقع. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[4].blocks[1].list[1].text` | {analytics} counts visits in totals, without cookies. | {analytics} لإحصاء الزيارات إجمالًا، دون ملفات تعريف ارتباط. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[4].blocks[1].list[2].text` | Cloudflare (Turnstile) checks form submissions for automated abuse. | Cloudflare (خدمة Turnstile) لفحص النماذج المُرسلة والتصدّي لإساءة الاستخدام الآلية. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[4].blocks[1].list[3].text` | Resend delivers form submissions to our inbox and, where it applies, a confirmation to you. | Resend لإيصال النماذج المُرسلة إلى بريدنا، وإرسال رسالة تأكيد إليك حين ينطبق ذلك. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[4].blocks[1].list[4].text` | WhatsApp (Meta): if you message us on WhatsApp, your number and messages are handled by WhatsApp, under Meta's own terms and privacy policy. | واتساب (Meta): إذا راسلتنا عبر واتساب، فإن رقمك ورسائلك تعالجها خدمة واتساب وفق شروط Meta وسياسة الخصوصية الخاصة بها. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[4].blocks[2].p` | We may also disclose data where the law requires it. | وقد نُفصح عن البيانات حين يُلزمنا القانون بذلك. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[5].heading` | Data outside the UAE | معالجة البيانات خارج الإمارات | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[5].blocks[0].p` | These providers may process data outside the United Arab Emirates, including in the United States. We rely on their contractual and technical safeguards for personal data, and we use only what each service needs. | قد يعالج هؤلاء المزوّدون البيانات خارج دولة الإمارات العربية المتحدة، ومن ذلك الولايات المتحدة. ونعتمد على ضماناتهم التعاقدية والتقنية لحماية البيانات الشخصية، ولا نستخدم إلا ما تحتاجه كل خدمة. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[6].heading` | How long we keep it | مدة الاحتفاظ بالبيانات | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[6].blocks[0].p` | We don't keep a database of form submissions on this website: a submission reaches us as an email. If an enquiry doesn't become a project, we delete it within 12 months of our last contact with you. If it does, we keep the records of our agreement for as long as the applicable law requires. | لا نحتفظ في هذا الموقع بقاعدة بيانات للنماذج المُرسلة، فكل نموذج يصلنا رسالةً بالبريد الإلكتروني. وإذا لم يتحوّل الاستفسار إلى مشروع، نحذفه خلال 12 شهرًا من آخر تواصل بيننا. وإذا تحوّل إلى مشروع، نحتفظ بسجلات الاتفاق للمدة التي يفرضها القانون المعمول به. | Owner rule 1: plural at apply, no change of wording. Keep the commitment: the company must be able to keep it | (keep) | (plural at apply) | ⚑ FC#22 (Rand reads the legal pages last): deletion within 12 months of the last contact |
| `c:legal:legalDocs[privacy].sections[7].heading` | Your rights | حقوقك | Owner rule 1 (a heading in the page's contents list) | (keep) | حقوقكم |  |
| `c:legal:legalDocs[privacy].sections[7].blocks[0].p` | Under the UAE Personal Data Protection Law, you can ask us to: | بموجب قانون حماية البيانات الشخصية في دولة الإمارات، يحقّ لك أن تطلب منّا: | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[7].blocks[1].list[0].text` | tell you what personal data we hold about you and give you a copy; | إطلاعك على البيانات الشخصية التي نحتفظ بها عنك وتزويدك بنسخة منها؛ | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[7].blocks[1].list[1].text` | correct data that is inaccurate or incomplete; | تصحيح البيانات غير الدقيقة أو غير المكتملة؛ | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[7].blocks[1].list[2].text` | delete your data, or restrict how we use it; | حذف بياناتك، أو تقييد استخدامنا لها؛ | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[7].blocks[1].list[3].text` | stop using your data, where the law allows you to object; | التوقّف عن استخدام بياناتك، حيث يجيز لك القانون الاعتراض؛ | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[7].blocks[1].list[4].text` | withdraw your consent, where we rely on it. | سحب موافقتك، حين نعتمد عليها. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[7].blocks[2].p` | To make a request, contact {dataRequestContact}. We may ask you to confirm your identity first. | لتقديم طلب، تواصل معنا عبر {dataRequestContact}، وقد نطلب منك تأكيد هويتك أولًا. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[7].blocks[3].p` | If you're not satisfied with our answer, you can complain to the UAE Data Office. | وإن لم يُرضِك ردّنا، يمكنك تقديم شكوى إلى مكتب الإمارات للبيانات. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[8].heading` | Security | أمن البيانات | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[8].blocks[0].p` | We protect your data with reasonable technical and organisational measures: encrypted connections (HTTPS), limited access, and providers that secure the data they process. No method of transmission over the internet is completely secure. | نحمي بياناتك بإجراءات تقنية وتنظيمية معقولة: اتصال مشفّر (HTTPS)، وصلاحيات وصول محدودة، ومزوّدون يؤمّنون البيانات التي يعالجونها. ولا توجد وسيلة نقل عبر الإنترنت آمنة تمامًا. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[privacy].sections[9].heading` | Children | الأطفال | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[9].blocks[0].p` | This website is meant for businesses and adults. We don't knowingly collect data from anyone under 18. | هذا الموقع موجّه إلى الشركات والبالغين، ولا نجمع عن علمٍ بيانات أي شخص دون 18 عامًا. | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[10].heading` | Changes | التعديلات | keep |  |  |  |
| `c:legal:legalDocs[privacy].sections[10].blocks[0].p` | We may update this policy. The date at the top shows the latest version. | قد نحدّث هذه السياسة، ويوضّح التاريخ في أعلاها أحدث نسخة. | keep |  |  |  |
| `c:legal:legalDocs[terms].title` | Terms of Use | شروط الاستخدام | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[0].heading` | About these terms | عن هذه الشروط | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[0].blocks[0].p` | These terms apply to your use of this website, run by NO TIME Creative House, Dubai, United Arab Emirates. By using the site, you accept them. If you don't, please don't use the site. | تسري هذه الشروط على استخدامك لهذا الموقع، الذي يديره NO TIME Creative House في دبي، الإمارات العربية المتحدة. وباستخدامك الموقع فإنك توافق عليها، وإن لم توافق عليها فنرجو ألّا تستخدمه. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[terms].sections[0].blocks[1].p` | Our registered legal entity is {legalName}, {address}. | كياننا القانوني المسجّل: {legalName}، {address}. | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[1].heading` | What the site is for | الغرض من الموقع | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[1].blocks[0].p` | The site describes our services and lets you contact us. Its content is general information, not an offer. The scope, timing and terms of any work are set only in a written proposal or agreement between you and us. | يعرّف الموقع بخدماتنا ويتيح لك التواصل معنا. ومحتواه معلومات عامة، لا عرضٌ ملزِم. أمّا نطاق أي عمل وموعده وشروطه، فلا تُحدَّد إلا في عرض أو اتفاق مكتوب بيننا وبينك. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[terms].sections[2].heading` | Images, examples and previews | الصور والأمثلة والمعاينات | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[2].blocks[0].p` | Demonstration data is labelled “Example”, and early product screens are labelled “Preview”. Neither shows a real result, a real client or a real event. | بيانات العرض التوضيحي تحمل عبارة «مثال»، وشاشات المنتجات الأولية تحمل عبارة «معاينة». ولا يعرض أيٌّ منهما نتيجة حقيقية، ولا عميلًا حقيقيًا، ولا حدثًا حقيقيًا. | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[2].blocks[1].p` | Our work is shown with the project’s own photos once the client approves, and otherwise with a drawing of the work, never with a stand-in photo. | نعرض أعمالنا بصور المشروع نفسه بعد موافقة العميل، وإلا فبرسم يصوّر العمل، ولا نضع مكانها صورة بديلة أبدًا. | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[3].heading` | Intellectual property | الملكية الفكرية | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[3].blocks[0].p` | The site's text, design, graphics, code and the NO TIME name and logo belong to us or to those who licensed them to us. Other names, logos and marks that appear on the site belong to their owners. You may view and share links to our pages, but you may not copy, reproduce or reuse the content for commercial purposes without our written permission. | نصوص الموقع وتصميمه ورسومه وبرمجته، واسم NO TIME وشعارها، ملكٌ لنا أو لمن رخّصها لنا. وتعود الأسماء والشعارات والعلامات الأخرى الظاهرة على صفحات الموقع إلى أصحابها. يمكنك تصفّح صفحاتنا ومشاركة روابطها، لكن لا يجوز نسخ المحتوى أو إعادة إنتاجه أو استخدامه لأغراض تجارية دون إذن مكتوب منّا. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[terms].sections[4].heading` | Using the forms | استخدام النماذج | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[4].blocks[0].p` | When you use a form, please give accurate information and only your own contact details, or those you're authorised to share. Don't send anything unlawful, harmful or unrelated to your request. We use what you send as our [Privacy Policy](/privacy) describes. | عند استخدامك أي نموذج، نرجو أن تقدّم معلومات صحيحة، وألّا تذكر إلا بيانات الاتصال الخاصة بك أو تلك التي يحقّ لك مشاركتها. ولا ترسل ما هو مخالف للقانون، أو ضار، أو لا يتعلّق بطلبك. ونستخدم ما ترسله وفق ما توضّحه [سياسة الخصوصية](/privacy). | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[terms].sections[5].heading` | Acceptable use | الاستخدام المقبول | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[5].blocks[0].p` | Don't misuse the site: don't try to break into it, overload it, scrape it in bulk, send automated submissions, or interfere with how it works for others. | لا تُسئ استخدام الموقع: لا تحاول اختراقه أو إثقاله بالطلبات، ولا تنسخ محتواه آليًا بكميات كبيرة، ولا ترسل نماذج آلية، ولا تعطّل عمله على الآخرين. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[terms].sections[6].heading` | Links to other sites | روابط المواقع الأخرى | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[6].blocks[0].p` | Links to other websites are there for convenience. We don't control those sites and aren't responsible for their content or their privacy practices. | نضع روابط بعض المواقع الأخرى تسهيلًا عليك، لكننا لا نتحكّم فيها، ولا نتحمّل مسؤولية محتواها أو ممارساتها في الخصوصية. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[terms].sections[7].heading` | Liability | المسؤولية | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[7].blocks[0].p` | We work to keep the site accurate and available, but we provide it “as is”, without guarantees that it is complete, error-free or always available. To the extent the law allows, we are not liable for any loss that results from using the site or relying on its content. Nothing in these terms limits liability that the law does not allow us to limit. | نحرص على دقّة الموقع وإتاحته، لكننا نقدّمه «كما هو»، دون ضمان اكتماله أو خلوّه من الأخطاء أو إتاحته في كل وقت. وفي الحدود التي يسمح بها القانون، لا نتحمّل المسؤولية عن أي خسارة تنتج عن استخدام الموقع أو الاعتماد على محتواه. ولا يحدّ أي بند في هذه الشروط من مسؤولية لا يجيز القانون الحدّ منها. | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[8].heading` | Governing law and language | القانون الحاكم واللغة | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[8].blocks[0].p` | These terms are governed by the laws of the United Arab Emirates. {courts} have jurisdiction over any dispute arising from them. | تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة، وتختصّ {courts} بالنظر في أي نزاع ينشأ عنها. | keep: {courts}: Rand | (keep) | (keep) | ⚑ FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[terms].sections[8].blocks[1].p` | If the Arabic and English versions of these terms differ, the {prevailingLanguage} version prevails. | إذا اختلفت النسختان العربية والإنجليزية من هذه الشروط، تُعتمد النسخة {prevailingLanguage}. | keep: {prevailingLanguage}: Rand | (keep) | (keep) | ⚑ FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[terms].sections[9].heading` | Changes | التعديلات | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[9].blocks[0].p` | We may update these terms. The date at the top shows the latest version. | قد نحدّث هذه الشروط، ويوضّح التاريخ في أعلاها أحدث نسخة. | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[10].heading` | Contact | التواصل | keep |  |  |  |
| `c:legal:legalDocs[terms].sections[10].blocks[0].p` | Questions about these terms: {dataRequestContact}. | للأسئلة عن هذه الشروط: {dataRequestContact}. | keep |  |  |  |
| `c:legal:legalDocs[cookies].title` | Cookie Policy | سياسة ملفات تعريف الارتباط | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[0].heading` | What cookies are | ما ملفات تعريف الارتباط | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[0].blocks[0].p` | Cookies are small text files a website stores in your browser. Similar technologies, such as your browser's session storage, keep small pieces of information on your device in the same way. | ملفات تعريف الارتباط (الكوكيز) ملفات نصية صغيرة يحفظها الموقع في متصفحك. وتعمل تقنيات مشابهة، مثل تخزين الجلسة في متصفحك، بالطريقة نفسها، فتحفظ معلومات صغيرة على جهازك. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[1].heading` | What we use | ما نستخدمه | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[0].p` | We use only what the site needs to work. We don't use analytics, advertising or social media cookies. | لا نستخدم إلا ما يحتاجه الموقع ليعمل، ولا نستخدم ملفات تعريف ارتباط للتحليل أو الإعلانات أو وسائل التواصل الاجتماعي. | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[1].p` | We use only what the site needs to work, and no analytics, advertising or social media cookies. Our visit statistics ({analytics}) use no cookies at all. | لا نستخدم إلا ما يحتاجه الموقع ليعمل، ولا نستخدم ملفات تعريف ارتباط للتحليل أو الإعلانات أو وسائل التواصل الاجتماعي. أما إحصاءات الزيارات لدينا ({analytics}) فلا تستخدم أي ملفات تعريف ارتباط. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.head[0]` | Name | الاسم | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.head[1]` | Type | النوع | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.head[2]` | What it does | وظيفته | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.head[3]` | How long | مدته | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[0][0]` | NEXT_LOCALE | NEXT_LOCALE | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[0][1]` | Cookie, set by this site | ملف تعريف ارتباط يضعه هذا الموقع | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[0][2]` | Remembers whether you're reading in English or Arabic. | يتذكّر هل تتصفّح بالعربية أم بالإنجليزية. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[0][3]` | Until you close your browser | حتى تغلق المتصفح | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[1][0]` | nt-intro | nt-intro | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[1][1]` | Session storage (not a cookie) | تخزين الجلسة (ليس ملف تعريف ارتباط) | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[1][2]` | Remembers that you've seen the home page's opening animation, so it plays only once. | يتذكّر أنك شاهدت الحركة الافتتاحية في الصفحة الرئيسية، فلا تُعرض إلا مرة واحدة. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[1][3]` | Until you close the tab | حتى تغلق التبويب | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[2][0]` | nt-lead | nt-lead | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[2][1]` | Session storage (not a cookie) | تخزين الجلسة (ليس ملف تعريف ارتباط) | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[2][2]` | Notes how you reached the site (the campaign tag in the link, the site you came from and your first page), so a form you send tells us which post or link brought you. It leaves your device only with a form you submit. | يسجّل كيف وصلت إلى الموقع (وسم الحملة في الرابط، والموقع الذي جئت منه، وأول صفحة زرتها)، ليخبرنا النموذج الذي ترسله بالمنشور أو الرابط الذي أوصلك إلينا. لا يغادر جهازك إلا مع نموذج ترسله. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[1].blocks[2].table.rows[2][3]` | Until you close the tab | حتى تغلق التبويب | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[1].blocks[3].p` | On our forms, Cloudflare Turnstile runs a check in your browser to tell people from automated programs. How Cloudflare processes that data is described in Cloudflare's privacy policy. | في نماذج الموقع، تُجري خدمة Cloudflare Turnstile فحصًا في متصفحك للتمييز بين الأشخاص والبرامج الآلية. وتوضّح سياسة الخصوصية لدى Cloudflare كيفية معالجتها لهذه البيانات. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[2].heading` | Your choices | خياراتك | Owner rule 1 (a heading in the page's contents list) | (keep) | خياراتكم |  |
| `c:legal:legalDocs[cookies].sections[2].blocks[0].p` | These items are needed for the site to work as designed, so we don't ask for consent to use them. You can block or delete cookies in your browser settings. The site still works without them, but it may not remember your language. | هذه العناصر لازمة ليعمل الموقع كما صُمّم، لذلك لا نطلب موافقتك على استخدامها. ويمكنك حظر ملفات تعريف الارتباط أو حذفها من إعدادات متصفحك. سيظل الموقع يعمل دونها، لكنه قد لا يتذكّر لغتك. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[2].blocks[1].p` | If we ever add optional cookies, we'll ask for your consent first and update this policy. | وإذا أضفنا يومًا ملفات تعريف ارتباط اختيارية، فسنطلب موافقتك أولًا ونحدّث هذه السياسة. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |
| `c:legal:legalDocs[cookies].sections[3].heading` | More information | لمزيد من المعلومات | keep |  |  |  |
| `c:legal:legalDocs[cookies].sections[3].blocks[0].p` | See our [Privacy Policy](/privacy) for how we handle personal data. | راجع [سياسة الخصوصية](/privacy) لمعرفة كيفية تعاملنا مع البيانات الشخصية. | Owner rule 1: the address moves to the plural at apply time, with no change of wording; Rand reads the legal pages last | (keep) | (plural at apply) | FC#22 (Rand reads the legal pages last) |

## Image alt text

| ID | Current EN | Current AR | Rule | Proposed EN | Proposed AR | Facts |
|---|---|---|---|---|---|---|
| `c:images:imageSlots[cat-events-hospitality-16x9].alt` | A glass-roofed hall set with long candlelit tables under red lanterns. | قاعة بسقف زجاجي مهيّأة بطاولات طويلة على ضوء الشموع، تحت فوانيس حمراء. | keep |  |  |  |
| `c:images:imageSlots[cat-creative-production-16x9].alt` | Food styling for a shoot: plated desserts on wooden boards beside palm leaves. | تنسيق طعام لجلسة تصوير: حلويات مصفوفة على ألواح خشبية بجانب سعف النخيل. | keep |  |  |  |
| `c:images:imageSlots[cat-production-print-gifts-16x9].alt` | A gold bookmark cut in the shape of the Dubai skyline. | فاصل كتاب ذهبي مقصوص على شكل أفق دبي. | keep |  |  |  |
| `c:images:imageSlots[hero-fallback-16x9].alt` | Stage lights cutting through warm haze over an empty venue. | أضواء مسرح تشقّ ضبابًا دافئًا فوق قاعة خالية. | keep |  |  |  |
| `c:images:imageSlots[hero-fallback-9x16].alt` | A tall frame of stage light rays falling through haze. | إطار طولي لأشعة ضوء مسرح تنساب عبر الضباب. | keep |  |  |  |
| `c:images:imageSlots[process-plan-4x5].alt` | A planning table with floor plans, a pencil and a cup of Arabic coffee. | طاولة تخطيط عليها مخططات القاعة وقلم وفنجان قهوة عربية. | keep |  |  |  |
| `c:images:imageSlots[process-build-4x5].alt` | A ballroom during setup, with truss and scaffolding going up. | قاعة احتفالات أثناء التجهيز، والهياكل المعدنية والسقالات قيد التركيب. | keep |  |  |  |
| `c:images:imageSlots[process-produce-4x5].alt` | A server carrying a tiered silver stand of desserts. | نادل يحمل حاملًا فضيًا من عدة طبقات عليه حلويات. | keep |  |  |  |
| `c:images:imageSlots[process-launch-4x5].alt` | A desert tent at night, its carpets laid out for guests. | خيمة صحراوية ليلًا، وسجّادها مفروش لاستقبال الضيوف. | keep |  |  |  |
| `c:images:imageSlots[product-qr-check-in-16x9].alt` | An event entrance at dusk with a softly lit check-in point, out of focus. | مدخل فعالية عند الغروب ونقطة تسجيل مضاءة بنعومة خارج التركيز. | keep |  |  |  |
| `c:images:imageSlots[product-restaurant-system-16x9].alt` | A restaurant pass at service time, warm lights and plates in soft focus. | منضدة تقديم في مطعم وقت الخدمة، أضواء دافئة وأطباق في تركيز ناعم. | keep |  |  |  |
| `c:images:imageSlots[notime-website-home-en].alt` | The NO TIME homepage in English, on a laptop screen. | الصفحة الرئيسية لموقع NO TIME بالإنجليزية على شاشة حاسوب محمول. | keep |  |  |  |
| `c:images:imageSlots[notime-website-home-ar].alt` | The NO TIME homepage in Arabic, laid out right to left. | الصفحة الرئيسية لموقع NO TIME بالعربية، بتخطيط من اليمين إلى اليسار. | keep |  |  |  |
| `c:images:imageSlots[notime-website-category-en].alt` | A NO TIME service page in English, on a phone. | صفحة خدمات من موقع NO TIME بالإنجليزية على شاشة هاتف. | keep |  |  |  |
| `c:images:imageSlots[notime-website-category-ar].alt` | A NO TIME service page in Arabic, on a phone. | صفحة خدمات من موقع NO TIME بالعربية على شاشة هاتف. | keep |  |  |  |
