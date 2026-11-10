# Fill or hide: items for the user's review (D78)

Status: **approved by the user (2026-11-09)** and moved into the data (v1 plan, Task A5, 2026-11-10): names and lockups in `src/content/products.ts`, bands in `src/content/forms.ts`, the Events FAQ in `src/content/categories.ts` (the other categories' fills go in with their copy decks), principles in `src/content/principles.ts`, work in `src/content/work.ts` with flags in `src/config/work.ts` (the airline is "A national airline"; Arabian Travel Market kept). The text below is the record of what was proposed. Under the "fill or hide" policy (D78), each block below is either filled with honest content now or hidden until the real data exists. Nothing here goes into the data files until the user approves it. Arabic is written natively, with Western digits (D50). The copy rules (`src/lib/copy-rules.ts`) apply.

Contents: 1. Form pipeline: what D66 leaves open · 2. Product names (A2) · 3. Budget bands (A3) · 4. FAQ fills (A1) · 5. How we work (A6) · 6. Anonymised work (A9) · 7. Legal drafts (A4, separate files)

---

## 1. Form pipeline (Task 4.2): what D66 leaves open

D66 fixes the pipeline (Server Action → Zod → Turnstile + honeypot → rate limit → Resend + auto-reply). Rate limit and Turnstile are built and tested (`src/lib/forms/`). These points are open; each has a recommendation.

| # | Open point | Recommendation |
|---|---|---|
| F1 | **Fields.** D66 names the forms, not their fields. | **Consultation:** name\*, email or WhatsApp\* (at least one), company, service (pre-selected from `?service=`), budget band (optional, §3), message\*. **Register interest:** name\*, email\*, company, product (hidden, preset), message. **Quote** (needed now for rental "Ask for availability" and "Order your print online"): the consultation fields plus one group per quote type, defined in data: event (date, city, guest count as free text), print (item, quantity, sizes, deadline), rental (categories, dates), production, marketing, digital (none extra). |
| F2 | **Sender address.** Resend sends to any recipient only from a verified domain. Until the domain exists (CONTENT_CHECKLIST #9), it sends only to the account owner's own address. | The team notification works now (to `CONTACT_TO_EMAIL`). The **auto-reply is skipped, not failed**, until a `MAIL_FROM` on a verified domain is set; the success message never promises an email until then. |
| F3 | **Storage.** | **Email only, no database.** Nothing is stored on our side; the privacy policy says so. |
| F4 | **Consent.** | **A notice under each form, no checkbox**: the data is used only to answer the request. No marketing opt-in (there is no newsletter). |
| F5 | **The general contact form.** Policy B hides phone, email and WhatsApp until `contact.ts` is filled, so the form is the only channel. | A **`/[locale]/contact` page** with the consultation form (service optional), linked from the header CTA and the footer. Category pages keep their own quote block. |
| F6 | **WhatsApp number check.** | International format, 7–15 digits, optional `+`, spaces allowed; no country picker (no new dependency). |

---

## 2. Product names (A2)

Three options per product: short, brand-aligned and readable in both languages. The first two options of each product follow NO TIME's own theme, time. Each name had a quick web search for an app, product or company with the same name in the same field (2026-11-09). **A quick search is not a trademark clearance:** before launch, the chosen names need a search of the UAE Ministry of Economy trademark register and WIPO's Global Brand Database.

Names searched and **dropped** because they are taken in the same field: *Hudoor* (attendance apps, including Abu Dhabi Customs' "Hudhoor"), *DoorList* (a QR event check-in app), *Sufra* (a restaurant tech company in Oman and others), *Tawla* (a restaurant POS in Kuwait).

### QR event check-in

| Option | EN | AR | Why | Search result |
|---|---|---|---|---|
| **1 (recommended)** | **Minute Zero** | **الدقيقة صفر** | The moment the doors open. Time is the brand's own word, and the product is about that minute. | No product found with this name. |
| 2 | First Guest | أول ضيف | Echoes the Events copy ("ready before the first guest"). | No product found. |
| 3 | Welcome Hour | ساعة الاستقبال | Warm, hospitality register; the time theme again. | No product found. |

### Restaurant management system

| Option | EN | AR | Why | Search result |
|---|---|---|---|---|
| **1 (recommended)** | **Peak Hour** | **ساعة الذروة** | Names the problem it solves ("orders, tables and the kitchen, out of step at the busiest hour"). Pairs with Minute Zero. | No product found. The phrase is common in restaurant articles, so it's harder to protect and to rank for on its own. |
| 2 | Maeda | مائدة | The Arabic for a set table; short and warm in both languages. | No restaurant system found. One app called "Maeda Restaurant" exists (a single restaurant's app, no details). |
| 3 | NO TIME Table | طاولة نو تايم | Inside the brand, so no clash; "timetable" as a pun in English only. | Uses the company's own name. |

---

## 3. Budget bands (A3)

AED, Western digits, optional field, and "Prefer not to say" is always last. They describe the **visitor's** budget, not NO TIME's prices: no price is stated anywhere. Separate bands for events and for software, as asked.

| Events (consultation and event quote) | AR | Software & Digital (consultation and digital quote) | AR |
|---|---|---|---|
| Under AED 50,000 | أقل من 50,000 درهم | Under AED 25,000 | أقل من 25,000 درهم |
| AED 50,000–150,000 | 50,000–150,000 درهم | AED 25,000–75,000 | 25,000–75,000 درهم |
| AED 150,000–500,000 | 150,000–500,000 درهم | AED 75,000–150,000 | 75,000–150,000 درهم |
| AED 500,000–1,000,000 | 500,000–1,000,000 درهم | AED 150,000–300,000 | 150,000–300,000 درهم |
| Over AED 1,000,000 | أكثر من 1,000,000 درهم | Over AED 300,000 | أكثر من 300,000 درهم |
| Prefer not to say | أفضّل عدم التحديد | Prefer not to say | أفضّل عدم التحديد |

- **The other quote types** (production, marketing, print) have no budget field, to keep those forms short. Your call if you want one.
- The general contact form (F5) shows the events bands, or the software bands once the visitor picks a digital service.

---

## 4. FAQ fills (A1, CONTENT_CHECKLIST #28–#32)

Each answer is general but true: no numbers, no promised times, and nothing the profile doesn't support. Where an honest general answer isn't possible, the topic is **hidden** (listed at the end of each category).

**Count:** the spec allows 4–6 FAQ entries per category; Events already has 6. **Proposal: raise the cap to 8** (each entry is useful to visitors and to search; FAQPage JSON-LD has no limit). If you prefer to keep 6, the "swap" column says which entry each fill would replace.

### Events & Hospitality (#28)

| Q EN | Q AR | A EN | A AR | Swap (if cap stays 6) |
|---|---|---|---|---|
| How far ahead should I book? | متى ينبغي أن أحجز؟ | It depends on the scale of the event. Share your date and we'll confirm availability. | يعتمد ذلك على حجم المناسبة. شاركنا الموعد، ونؤكّد لك مدى توفّرنا. | "Can you photograph and film the event?" |
| How many guests can you host? | كم ضيفًا يمكنكم استقبال؟ | From intimate gatherings to award nights and large corporate and government events. Tell us your guest count and we'll plan around it. | من اللقاءات العائلية الخاصة إلى ليالي الجوائز والفعاليات الكبرى للشركات والجهات الحكومية. أخبرنا بعدد ضيوفك، ونخطّط على أساسه. | "Do you offer heritage hospitality?" |
| *Extends the existing "Where do you work?" answer:* | | We're based in Dubai and work across six markets: the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. For other locations, ask us. | مقرّنا في دبي، ونعمل في ستة أسواق: الإمارات والسعودية وقطر وعُمان والكويت ومصر. ولأي مكان آخر، اسألنا. | (an edit, not a new entry) |

- **Sources:** p.11 "INTIMATE GATHERINGS"; p.6 "CEREMONIES · AWARD NIGHTS · CORPORATE & GOVERNMENT"; the six markets, p.3 and the back cover (p.38).
- **Hidden until real:** who arranges permits and venue approvals; whether stage, sound and lighting equipment is owned or rented in; standard menus and dietary options.

### Creative Production (#29)

| Q EN | Q AR | A EN | A AR |
|---|---|---|---|
| Can I rent equipment? | هل يمكنني استئجار المعدّات؟ | Yes: cameras, lenses, lighting, audio, and stage and screen equipment. Tell us what you need and your dates, and we'll confirm availability. | نعم: الكاميرات والعدسات والإضاءة والصوت ومعدّات المسرح والشاشات. أخبرنا بما تحتاجه وبالمواعيد، ونؤكّد لك التوفّر. |
| Who owns the photos and videos after delivery? | لمن تعود ملكية الصور والفيديوهات بعد التسليم؟ | Usage rights are agreed in each proposal, before the shoot starts. | نتّفق على حقوق الاستخدام في كل عرض، قبل بدء التصوير. |
| How long does editing take? | كم يستغرق المونتاج؟ | It depends on the length and the kind of edit. We agree the schedule with you in the proposal. | يعتمد ذلك على مدة العمل ونوع المونتاج، ونتّفق معك على الجدول الزمني في العرض. |

- **Hidden until real:** a studio (D77), drone filming, crew with rental, model names (A7: categories only).

### Marketing & Brand (#30)

| Q EN | Q AR | A EN | A AR |
|---|---|---|---|
| How often do you report? | كم مرة ترفعون التقارير؟ | We agree the reporting rhythm with you at the start, to match the plan and its campaigns. | نتّفق معك على مواعيد التقارير منذ البداية، بما يناسب الخطة وحملاتها. |
| Is there a minimum term? | هل هناك مدة تعاقد دنيا؟ | The term is set in each proposal, to fit the plan. | تُحدَّد مدة التعاقد في كل عرض، بما يناسب الخطة. |

- **Hidden until real:** whose ad accounts campaigns run in; naming with trademark or domain checks; press outlets (OQ #19).

### Production, Print & Gifts (#31)

| Q EN | Q AR | A EN | A AR |
|---|---|---|---|
| Is there a minimum quantity? | هل هناك حدّ أدنى للكمية؟ | It depends on the item and the branding method. Tell us what you need, and we'll advise on quantities. | يعتمد ذلك على المنتج وطريقة الطباعة أو الحفر. أخبرنا بما تحتاجه، ونقترح عليك الكميات المناسبة. |
| How long does production take? | كم يستغرق التنفيذ؟ | It depends on the item, the quantity and the finish. Share your deadline and we'll confirm what's possible. | يعتمد ذلك على المنتج والكمية والتشطيب. شاركنا الموعد المطلوب، ونؤكّد لك ما يمكن تنفيذه. |
| Do you deliver? | هل توصلون الطلبات؟ | Tell us where your order needs to go, and we'll confirm delivery with the proposal. | أخبرنا إلى أين يجب أن يصل طلبك، ونؤكّد لك التوصيل مع العرض. |

- **Hidden until real:** in-house or partner production; the largest print size; sustainable materials.

### Software & Digital (#32)

| Q EN | Q AR | A EN | A AR |
|---|---|---|---|
| Do you support the product after launch? | هل تقدّمون الدعم بعد الإطلاق؟ | Yes. Support and maintenance after launch are part of how we work, and their scope is agreed in the proposal. | نعم. الدعم والصيانة بعد الإطلاق جزء من طريقة عملنا، ونتّفق على نطاقهما في العرض. |
| How long does a project take? | كم يستغرق المشروع؟ | It depends on the scope. We share a timeline with the proposal, and you see progress at every stage. | يعتمد ذلك على نطاق العمل. نرسل الجدول الزمني مع العرض، وترى التقدّم في كل مرحلة. |
| Who owns the code and the content? | لمن تعود ملكية الكود والمحتوى؟ | Ownership and licensing are set out in each proposal, before work starts. | تُحدَّد الملكية والترخيص في كل عرض، قبل بدء العمل. |

- **Source:** support, D77 (the user's commercial decision; no response times or SLA). "You see progress at every stage" follows the process steps in the deck (§6); drop it if you'd rather not commit to it.
- **Hidden until real:** hosting; payment gateways; AI consulting scope; the case study's starting point and results.

---

## 5. How we work: our principles (A6, replaces the team / founder section)

Four principles, each from the profile's own claims. No people. The team section returns only with real photos and bios (CONTENT_CHECKLIST #2, #3).

| # | Title EN | Line EN | Title AR | Line AR | Source |
|---|---|---|---|---|---|
| 1 | Under one roof | Strategy, creative, production and delivery, carried through by one team. | تحت سقف واحد | الاستراتيجية والإبداع والإنتاج والتنفيذ، يتولّاها فريق واحد حتى النهاية. | p.3 "strategy, creative, production and delivery, under one roof" |
| 2 | From the concept to the guest | Concept, décor, production and the guest experience, planned as one. | من الفكرة إلى الضيف | الفكرة والديكور والإنتاج وتجربة الضيف، في خطة واحدة. | p.4 "CONCEPT · DÉCOR · PRODUCTION · GUEST EXPERIENCE" |
| 3 | Arabic and English, natively | Every word written in each language on its own terms, never translated word for word. | بالعربية والإنجليزية، كلٌّ بأسلوبه | نكتب كل كلمة بلغتها وبأسلوبها، لا بترجمة حرفية. | p.15 "Full bilingual RTL–LTR builds"; p.17 "Daily publishing in Arabic & English" |
| 4 | Six markets, one standard | Based in Dubai, working across the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. | ستة أسواق، ومعيار واحد | مقرّنا في دبي، ونعمل في الإمارات والسعودية وقطر وعُمان والكويت ومصر. | p.3 "6 MARKETS"; back cover (p.38) |

- The heading: "How we work" / «طريقة عملنا». No numbers as decoration: the principles aren't a sequence, so they carry no 01–04 markers.

---

## 6. Anonymised work (A9)

Real facts from `case-studies.md`, no names, logos or URLs. Each item has a config flag (`named: false` by default) that switches every text and image to the named version once permission arrives (OQ #17). Photos: only those without identifiable people (OQ #18) and without the client's logo in frame.

| Key | Label EN | Label AR | Summary EN | Summary AR | Facts from |
|---|---|---|---|---|---|
| `uaeaf` | A national sports federation | اتحاد رياضي وطني | Its digital and media partner: a full rebuild of the bilingual website and the connected mobile app, plus daily social media in Arabic and English. First week of one championship campaign: 487K views, +37.6K new followers, 271K reach. | شريكه الرقمي والإعلامي: إعادة بناء كاملة للموقع الإلكتروني ثنائي اللغة وتطبيق الجوّال المرتبط به، مع إدارة يومية لوسائل التواصل بالعربية والإنجليزية. في الأسبوع الأول من إحدى حملات البطولات: 487 ألف مشاهدة، و‎+37.6 ألف متابع جديد، ووصول بلغ 271 ألفًا. | p.16–18; figures with their scope (D67) |
| `egyptair` | A regional airline at Dubai Airshow | شركة طيران إقليمية في معرض دبي للطيران | Stand design, build and on-site PR at the Dubai Airshow and Arabian Travel Market. | تصميم الجناح وبناؤه وإدارة العلاقات العامة في أرض الحدث، في معرض دبي للطيران وسوق السفر العربي. | p.19 (press coverage stays out, OQ #19) |
| `uaepl` | A national football league | دوري كرة قدم وطني | Tournament branding, on-ground production, award ceremonies and sponsor activations, with the league's social content, award packaging and gift sets. | هوية البطولات، والإنتاج في أرض الحدث، وحفلات التكريم، وتفعيلات الرعاة، إلى جانب محتوى الدوري على وسائل التواصل، وتغليف الجوائز، وأطقم الهدايا. | p.5, p.13, p.23–24 |

- **Your label for EgyptAir** is "a regional airline". EgyptAir is Egypt's national carrier; "a national airline" / «شركة طيران وطنية» is more accurate. Your call.
- "Arabian Travel Market" is the full name of ATM (p.19 says "ATM"); keep or drop.

---

## 7. Legal drafts (A4)

Separate files, EN and native AR: [privacy.md](legal/privacy.md) · [terms.md](legal/terms.md) · [cookies.md](legal/cookies.md). The open items are listed at the top of each file.
