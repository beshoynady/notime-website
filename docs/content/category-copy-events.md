# Events & Hospitality: copy deck (EN / AR)

Status: **approved** by the user on 2026-11-09, with the changes below applied (Task 3.1). It is live in `src/content/categories.ts` (intro, FAQ, closing line), `src/content/services.ts` (points, and the Conferences promise) and `src/messages/{en,ar}.json` (shot lines).

**Changes at approval (AR unless noted):** «في الموقع» replaced where it meant on-site (two points, and the homepage's `process.produce.body`); «متكاملة» dropped from the Conferences promise; the rigging point reworded; the intro's «نأخذ … وكل ذلك» became «نتولّى …»; s1 became «تبدأ الحكاية بقاعة فارغة.»; the speaker-care point reworded; FAQ #6 added (EN and AR).

## Sources and rules

- **Facts** come only from the 2026 profile ([profile-copy.md](profile-copy.md), pages cited as p.N) and the approved services list ([services-proposal.md](services-proposal.md), D56). Nothing else is claimed: no years, counts, client names, guest numbers, lead times or prices.
- **Not used:** the talent pages (p.30, p.34–37), "DJ" as a booking (p.33 is read as live sound only), the press clippings (OQ #19), named clients (OQ #17).
- **Voice** (as the homepage deck): calm, exact, short declarative sentences, concrete nouns over adjectives. The Evening's story (an empty room made ready) is told by the opening; this copy states what is delivered.
- **Arabic:** written natively in Modern Standard Arabic with a light Gulf-friendly register, not translated word for word. Arabic punctuation (، ؟), no Latin words, numbers written as words here (no digits needed). Each Arabic line has a note.
- **Banned** (tested in messages): `elevate`, `cutting-edge`, `one-stop`, `unleash`, `الارتقاء بعلامتك`, `متطور جدًا`, `حلول متكاملة شاملة`, and «متكامل» as filler. «في الموقع» is not used for on-site: write «في المكان» or «في أرض الحدث» (`src/lib/copy-rules.ts`, tested on messages and content). None appear.
- **Numerals:** the section numerals are Roman in English and 01–06 in Arabic (D74).

---

## 1. Category intro (`Category.intro`)

Shown after the opening, before the services (D73). Two sentences.

| | Text |
|---|---|
| EN | Conferences and summits, exhibitions, launches, galas and heritage hospitality. We take each one from the concept and the décor through production to the guest's experience on the day, under one roof. |
| AR | مؤتمرات وقمم، ومعارض، وإطلاقات، وحفلات، وضيافة تراثية. نتولّى كل مناسبة من الفكرة والديكور، مرورًا بالإنتاج، حتى تجربة الضيف يوم الحدث، تحت سقف واحد. |

- **Source:** p.4 "CONCEPT · DÉCOR · PRODUCTION · GUEST EXPERIENCE"; p.3 "under one roof".
- **AR note:** «تحت سقف واحد» is the natural Arabic idiom for "under one roof". «مناسبة» (occasion) covers both corporate events and private celebrations, where «فعالية» would sound corporate only. «مرورًا بـ» carries the "through" of the English without a list of prepositions.

## 2. Opening shot lines (`scenes.events.*`)

Three lines over four shots (D74, P1). Line 2 of the storyboard ("Light first. Then everything else.") was dropped.

| Key | EN | AR | AR note |
|---|---|---|---|
| s1 | It starts with an empty room. | تبدأ الحكاية بقاعة فارغة. | The user's line: «الحكاية» frames the opening as a story told in shots. One line at 390. |
| s3 | Tables, flowers and candlelight, each in place. | طاولات وزهور وشموع، كلٌّ في مكانه. | «كلٌّ في مكانه» keeps the English's final beat; «ضوء الشموع» was too long for one line at 390. |
| s4 | **Every detail, ready before the first guest.** | **كل التفاصيل جاهزة قبل وصول أول ضيف.** | The promise. «قبل وصول أول ضيف» names the moment (arrival), which "before the first guest" implies. |

- **Source:** the storyboard; the claim in s4 is the brand's promise, not a figure.

## 3. Service promises and "what we deliver" points

The **promise** under each H2 is the service's approved description (D56). One edit at approval: the Arabic Conferences promise drops «متكاملة». The **points** are new: 4–6 per service, the same count in both languages (tested).

### I · Conferences & summits (`conferences`)

Promise: *Programme, venue, speakers and the running of the day, planned as one.* / «البرنامج والمكان والمتحدثون وإدارة اليوم، في خطة واحدة.»

| EN | AR | Source · AR note |
|---|---|---|
| Programme and running order | البرنامج وتسلسل الفقرات | D56 description. «تسلسل الفقرات» is the events term for a running order. |
| Venue and room layout | المكان وتوزيع القاعة | D56 description. |
| Speaker and guest care | استقبال المتحدثين ورعاية الضيوف | D56 ("speakers"), p.4 ("guest experience"). |
| Event branding on site | تطبيق هوية الحدث في المكان | p.5 "tournament branding … on-ground production". «في المكان», not «في الموقع», which reads as "on the website". |
| Ceremonies and award nights | حفلات التكريم وليالي الجوائز | p.6. «ليالي الجوائز» is used in Gulf event listings; «حفلات التكريم» covers ceremonies. |

### II · Exhibitions & booths (`exhibitions`)

Promise: *Stands designed, built and staffed to draw people in.* / «أجنحة نصمّمها ونبنيها ونديرها لتجذب الزوّار.»

| EN | AR | Source · AR note |
|---|---|---|
| Stand concept and design | فكرة الجناح وتصميمه | p.19 "stand design", p.21. |
| Fabrication and installation | التصنيع والتركيب | p.21 "design, fabrication and installation of exhibition stands". |
| Mall and exhibition stands | أجنحة المراكز التجارية والمعارض | p.8. «المراكز التجارية» rather than «المولات», which is colloquial. |
| Staffing on the stand | فريق عمل الجناح | D56 description ("staffed"). |
| On-site PR management | إدارة العلاقات العامة في أرض الحدث | p.19 "on-site PR management". «في أرض الحدث» for on-site. |

### III · Product launches & brand activations (`launches`)

Promise: *Launches and brand activations in malls, venues and exhibitions, including technology and robotics experiences.* / «إطلاقات وتفعيلات للعلامات في المراكز التجارية والقاعات والمعارض، بما فيها تجارب التقنية والروبوتات.»

| EN | AR | Source · AR note |
|---|---|---|
| Launch concept and the reveal | فكرة الإطلاق ولحظة الكشف | p.4 "concept". «لحظة الكشف» names the moment the product is shown. |
| Brand activations in malls and venues | تفعيل العلامات في المراكز التجارية والقاعات | p.8. |
| Technology and robotics experiences | تجارب التقنية والروبوتات | p.7. |
| Sponsor activations | تفعيلات الرعاة | p.5 "sponsor activation". |
| Branded environments | مساحات بهوية العلامة | p.21 "activations and branded environments". «مساحات» reads better than a literal «بيئات». |

### IV · Galas & private celebrations (`celebrations`)

Promise: *Galas, weddings, baby receptions and intimate gatherings: theming, décor, florals, keepsakes and the full day.* / «حفلات وأعراس واستقبالات مواليد وتجمّعات عائلية: الفكرة والديكور والزهور والتذكارات، وتنفيذ اليوم كاملًا.»

| EN | AR | Source · AR note |
|---|---|---|
| Concept decks and theming | ملف الفكرة واختيار الطابع | p.11. «الطابع» for "theme", the word used for party themes in Arabic. |
| Gala and wedding décor | ديكور الحفلات والأعراس | p.9. |
| Floral design and styling | تصميم الزهور وتنسيق المكان | p.10. "Styling" is the space, so «تنسيق المكان». |
| Giveaways and keepsakes | الهدايا والتذكارات | p.11. |
| Photobooths and guest moments | ركن التصوير ولحظات الضيوف | p.11. «ركن التصوير» is the usual Arabic for a photobooth. |
| Full on-day production | تنفيذ اليوم كاملًا | p.11. Same words as the promise, on purpose. |

### V · Catering & heritage hospitality (`hospitality`, the peak)

Promise: *Private and corporate catering, signature desserts and beverages, majlis setups, desert tents and Arabic coffee service.* / «ضيافة للمناسبات الخاصة والشركات، وحلويات ومشروبات مميّزة، ومجالس وخيام صحراوية وتقديم القهوة العربية.»

| EN | AR | Source · AR note |
|---|---|---|
| Majlis setups and desert tents | تجهيز المجالس والخيام الصحراوية | p.31. |
| Arabic coffee and welcome ceremonies | القهوة العربية ومراسم الاستقبال | p.31, p.32. |
| Heritage carts and live stations | العربات التراثية ومحطات الطهي الحية | p.32. «محطات الطهي الحية» says what a live station is. |
| Signature desserts and beverages | حلويات ومشروبات مميّزة | p.27. |
| Buffet and table styling | تنسيق البوفيه والطاولات | p.27, p.28. «البوفيه» is standard in Arabic menus. |
| Private service and boardroom hospitality | الخدمة الخاصة وضيافة الاجتماعات التنفيذية | p.26, p.29 "executive boardroom hospitality". |

### VI · Stage & technical production (`stage`)

Promise: *Stage, sound, light and screens, rigged and run by one crew.* / «المسرح والصوت والإضاءة والشاشات، يجهّزها ويديرها فريق واحد.»

| EN | AR | Source · AR note |
|---|---|---|
| Stage design | تصميم المسرح | p.33. |
| Rigging | تركيب الهياكل وتعليق المعدات | p.33. No common single Arabic word; this names what the crew does. |
| Live sound | الصوت المباشر | p.33 "live sound". DJ booking is talent and is not offered on the site. |
| Lighting | الإضاءة | D56 description. |
| Screens | الشاشات | D56 description. Which screens are owned or rented is OQ #22, so no type is named. |
| Technical setup, run by one crew | تجهيز تقني يديره فريق واحد | p.10 "technical setup"; D56 "run by one crew". |

## 4. FAQ (`Category.faq`)

Six entries, each answered from the sources or needing no client fact. The questions that need the client's facts are **not** answered here; they are listed in CONTENT_CHECKLIST #28.

| # | EN | AR | Source · AR note |
|---|---|---|---|
| 1 Q | Which events do you run? | ما أنواع الفعاليات التي تنظّمونها؟ | |
| 1 A | Conferences and summits, exhibitions, product launches and brand activations, galas, weddings and private celebrations, and ceremonies and award nights, for companies, government entities and private clients. | المؤتمرات والقمم، والمعارض، وإطلاق المنتجات وتفعيل العلامات، والحفلات والأعراس والاحتفالات الخاصة، وحفلات التكريم وليالي الجوائز، للشركات والجهات الحكومية والأفراد. | p.6 "CORPORATE & GOVERNMENT", p.9, p.11; D56. «الجهات الحكومية» is the usual Gulf term. |
| 2 Q | Can one team handle the décor, the catering and the stage? | هل يتولى فريق واحد الديكور والضيافة والمسرح؟ | |
| 2 A | Yes. Concept, décor, production and guest experience sit under one roof, so the décor, the hospitality and the technical crew work to one plan. | نعم. الفكرة والديكور والإنتاج وتجربة الضيف عندنا تحت سقف واحد، فيعمل فريق الديكور وفريق الضيافة والفريق التقني وفق خطة واحدة. | p.3, p.4. The Arabic repeats «فريق» so the three teams read as distinct. |
| 3 Q | Do you offer heritage hospitality? | هل تقدّمون الضيافة التراثية؟ | |
| 3 A | Yes: majlis setups, desert tents, Arabic coffee service, heritage carts, live stations and welcome ceremonies. | نعم: تجهيز المجالس والخيام الصحراوية، وتقديم القهوة العربية، والعربات التراثية، ومحطات الطهي الحية، ومراسم الاستقبال. | p.31, p.32. |
| 4 Q | Where do you work? | أين تعملون؟ | |
| 4 A | We're based in Dubai and work across six markets: the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. | مقرّنا في دبي، ونعمل في ستة أسواق: الإمارات والسعودية وقطر وعُمان والكويت ومصر. | p.1, p.3, back cover (SA / UAE / EG / QA / OM / KU). The number is written as a word, so no digit choice arises. |
| 5 Q | Can you photograph and film the event? | هل تصوّرون الفعالية؟ | |
| 5 A | Yes. Event coverage is part of our Creative Production services: photography and video, from the shoot to the final edit. | نعم. تغطية الفعاليات جزء من خدمات الإنتاج الإبداعي لدينا: التصوير الفوتوغرافي والفيديو، من التصوير حتى المونتاج النهائي. | p.25 "EVENT COVERAGE"; D56 (video: "from script and shoot to the final edit"). «هل تصوّرون» covers photo and video in one verb. |
| 6 Q | What do you need from me to start? | ماذا تحتاجون مني للبدء؟ | Added at approval. |
| 6 A | Tell us the date, the type of event, the city and roughly how many guests. We'll come back with a concept and a proposal. | أخبرنا بالموعد ونوع المناسبة والمدينة والعدد التقريبي للضيوف، ونعود إليك بتصوّر وعرض. | No response time is promised. |

## 5. Closing line (`Category.closing`)

The quote block's H2. **The block is hidden on public pages until the quote form works (D74, P6)**, so this line shows only on the lab route for now.

| EN | AR | AR note |
|---|---|---|
| Tell us the date. We'll ready the room. | أخبرنا بالموعد، ونجهّز لك القاعة. | «نجهّز لك» makes the promise personal, as "we'll ready the room" is addressed to the visitor. It answers s1 («قاعة فارغة»). |

## 6. Questions for the client (CONTENT_CHECKLIST #28)

Not answered on the page until the client gives the facts:

1. How far ahead should a client get in touch for a conference, a gala or a wedding? (lead times)
2. Is there a minimum or maximum guest count for catering and heritage hospitality?
3. Beyond the six markets, do you travel for events, and who arranges permits and venue approvals?
4. Which stage, sound, lighting and screen equipment is owned, and which is rented in? (OQ #22)
5. Are menus and dietary options (for example vegetarian or allergy-aware) offered as standard?
