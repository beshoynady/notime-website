# Creative Production: copy deck (EN / AR)

Status: **moved into the data as a draft for Rand's review** (v1 plan, decks task, 2026-11-10), with the clear fixes from [deck-review-2026-11-09.md](deck-review-2026-11-09.md) applied here and in the data. The judgment calls in that review wait for the user; the fact checks are in `docs/review/fact-check.md`. In review mode every block carries its section number.

## Sources and rules

As the Events deck ([category-copy-events.md](category-copy-events.md)):

- **Facts:** only from the 2026 profile ([profile-copy.md](profile-copy.md), p.N) and the approved services ([services-proposal.md](services-proposal.md), D56). No showreel, client names, equipment models, turnaround times or prices.
- **Arabic:** written natively, with notes. Banned phrases and «في الموقع» for on-site are refused by `src/lib/copy-rules.ts`.
- **Numerals:** Roman in English, 01–06 in Arabic (D74).

---

## 1. Category intro

| | Text |
|---|---|
| EN | Photography, video, motion graphics and AI content, with the sets and the equipment behind them. We cover events on the ground, shoot products and food, and take every piece through editing, sound and post-production. |
| AR | تصوير فوتوغرافي وفيديو وموشن جرافيك ومحتوى بالذكاء الاصطناعي، ومعها الديكورات والمعدّات اللازمة. نغطّي الفعاليات في أرض الحدث، ونصوّر المنتجات والأطباق، ونتابع كل عمل حتى المونتاج وتصميم الصوت ومرحلة ما بعد الإنتاج. |

- **Source:** p.25 "FOOD STYLING · PRODUCT · EVENT COVERAGE"; p.14 "Editing, sound design & post-production".
- **Removed:** "the studio" is gone from the category summary too (D77): it now reads "with the sets and equipment to make it" / «ومعها الديكورات والمعدّات». It returns only if the client confirms a studio (question 1).
- **AR note:** «في أرض الحدث» for on the ground, as in the Events copy. «ما بعد الإنتاج» is the standard Arabic term for post-production.

## 2. Opening shot lines (`scenes.creative.*`)

From the storyboard. Four lines over four shots; whether the desktop keeps four or drops one, as Events did (D74, P1), is decided on its animatic.

| Key | EN | AR | AR note |
|---|---|---|---|
| s1 | A black box. Nothing in frame yet. | صندوق أسود، ولا شيء في الكادر بعد. | «الكادر» is the usual Arabic film term for the frame. |
| s2 | Take one. | اللقطة الأولى. | |
| s3 | Every frame is planned before we roll. | كل كادر نخطّط له قبل أن نبدأ التصوير. | Changed from the storyboard's «ندوّر الكاميرا», which is spoken dialect. |
| s4 | **Then, the final frame.** | **ثم يأتي الكادر الأخير.** | |

## 3. Promises and "what we deliver" points

The promise under each H2 is the approved description (D56), unchanged.

### I · Photography (`photography`)

Promise: *Event, product and portrait photography, lit with intent.* / «تصوير الفعاليات والمنتجات والبورتريه، بإضاءة مدروسة.»

| EN | AR | Source · AR note |
|---|---|---|
| Event coverage | تغطية الفعاليات | p.25; p.17 "On-ground coverage & photography". |
| Product photography | تصوير المنتجات | p.25. |
| Food styling and photography | تنسيق الأطباق وتصويرها | p.25 "FOOD STYLING". «تنسيق الأطباق» is the trade term. |
| Portraits | البورتريه | D56. |
| Light planned for each shot | إضاءة مدروسة لكل لقطة | D56 "lit with intent". |

### II · Video production (`video`)

Promise: *From script and shoot to the final edit and colour.* / «من النص والتصوير حتى المونتاج النهائي وتصحيح الألوان.»

| EN | AR | Source · AR note |
|---|---|---|
| Script and shoot | النص والتصوير | D56. |
| Cinematic product and brand films | أفلام سينمائية للمنتجات والعلامات | p.14. |
| Event films and coverage | أفلام الفعاليات وتغطيتها | p.25 "EVENT COVERAGE". |
| Editing and colour | المونتاج وتصحيح الألوان | D56. |
| Sound design and post-production | تصميم الصوت ومرحلة ما بعد الإنتاج | p.14. |

### III · Motion graphics (`motion`)

Promise: *Titles, explainers and screen content that move with purpose.* / «عناوين وفيديوهات شرح ومحتوى للشاشات، بحركة لها هدف.»

| EN | AR | Source · AR note |
|---|---|---|
| Motion graphics and logo animation | موشن جرافيك وتحريك الشعارات | p.14. |
| Titles and explainers | العناوين وفيديوهات الشرح | D56. |
| Short videos and motion for social media | مقاطع قصيرة وموشن جرافيك لمنصات التواصل | p.14, p.17 "reels". «مقاطع قصيرة» rather than the Latin "reels". |
| Screen content for events and stages | محتوى الشاشات للفعاليات والمسارح | D56 "screen content". |

### IV · AI content creation (`ai-content`, the peak)

Promise: *AI-assisted imagery and video, art-directed to the brand.* / «صور وفيديو بمساعدة الذكاء الاصطناعي، بتوجيه فني يناسب العلامة.»

| EN | AR | Source · AR note |
|---|---|---|
| AI video ads and short videos | إعلانات فيديو ومقاطع قصيرة بالذكاء الاصطناعي | p.14 "AI-generated video ads & reels". |
| Cinematic AI video | فيديو سينمائي بالذكاء الاصطناعي | p.14. |
| AI imagery and campaign key visuals | صور بالذكاء الاصطناعي ومرئيات رئيسية للحملات | p.14. «المرئيات الرئيسية» for key visuals. |
| Art direction true to your brand | توجيه فني يلتزم بهويتك | D56. |
| Editing, sound and finishing | المونتاج والصوت واللمسات الأخيرة | p.14. |

### V · Set & stage design (`set-design`)

Promise: *Sets and stages drawn, modelled and built for the camera and the room.* / «ديكورات ومسارح نرسمها ونجسّمها ونبنيها للكاميرا وللمكان.»

| EN | AR | Source · AR note |
|---|---|---|
| Set and stage concepts | فكرة الديكور والمسرح | D56; p.33 "STAGE DESIGN". |
| Drawings and 3D models | الرسومات والنماذج ثلاثية الأبعاد | D56 "drawn, modelled". |
| Sets built for the camera | ديكورات مبنية للكاميرا | D56. |
| Stages built for the room | مسارح مبنية للقاعة | D56 "for the room". |

### VI · Equipment & camera rental (`rental`)

Promise: *Cameras, lenses and lighting, ready for your production.* / «كاميرات وعدسات وإضاءة، جاهزة لإنتاجك.»

| EN | AR | Source · AR note |
|---|---|---|
| Cameras and lenses | الكاميرات والعدسات | D56. |
| Lighting | الإضاءة | D56. |
| Sound | الصوت | D58 (the four rental categories). |
| Stage equipment | معدّات المسرح | D58. No model, brand or quantity is named: the inventory is OQ #22. |

## 4. FAQ

Five entries, each answered from the sources.

| # | EN | AR | Source · AR note |
|---|---|---|---|
| 1 Q | Do you cover events with photo and video? | هل تغطّون الفعاليات بالصور والفيديو؟ | |
| 1 A | Yes. We photograph and film on the ground, then edit the material for your channels. | نعم. نصوّر الفعالية صورًا وفيديو في أرض الحدث، ثم نجهّز المادة بالمونتاج لتناسب قنواتك. | p.25, p.17. |
| 2 Q | Do you make images and video with AI? | هل تصنعون الصور والفيديو بالذكاء الاصطناعي؟ | |
| 2 A | Yes: AI video ads and short videos, cinematic AI video, and AI imagery and key visuals for campaigns, art-directed to your brand. | نعم: إعلانات فيديو ومقاطع قصيرة، وفيديو سينمائي، وصور ومرئيات رئيسية للحملات، كلها بالذكاء الاصطناعي وبتوجيه فني يلتزم بهويتك. | p.14; D56. |
| 3 Q | Do you style and shoot food and products? | هل تنسّقون الأطباق وتصوّرون المنتجات؟ | |
| 3 A | Yes: food styling, product photography and cinematic product films. | نعم: تنسيق الأطباق وتصويرها، وتصوير المنتجات، وأفلام سينمائية للمنتجات. | p.25, p.14. |
| 4 Q | Do you handle editing and sound? | هل تتولّون المونتاج والصوت؟ | |
| 4 A | Yes. We take each video from the script and the shoot to the final edit, colour and sound. | نعم. نتابع كل فيديو من النص والتصوير حتى المونتاج النهائي وتصحيح الألوان والصوت. | D56; p.14. |
| 5 Q | What do you need from me to start? | ماذا تحتاجون مني للبدء؟ | Same pattern as the Events FAQ #6. |
| 5 A | Tell us what you want to make, where it will be shown and when you need it. We'll come back with a treatment and a proposal. | أخبرنا بما تريد صنعه، وأين سيُعرض، ومتى تحتاجه، ونعود إليك بتصوّر وعرض. | No response time is promised. «تصوّر» for treatment. |

## 5. Closing line

| EN | AR | AR note |
|---|---|---|
| Your first take starts here. | لقطتك الأولى تبدأ من هنا. | Answers s2 («اللقطة الأولى»). Hidden on public pages with the quote block until the form works (D74, P6). |

## 6. Questions for the client (CONTENT_CHECKLIST #29)

1. **Studio:** does NO TIME have its own studio space? The summary no longer says so (D77); it returns only on the client's confirmation.
2. **Rental:** which equipment is owned and which is rented in (OQ #22)? Is it rented with or without a crew?
3. **Showreel:** is there a showreel for the video section (CONTENT_CHECKLIST)? Until then the reel module stays a placeholder (never stock or AI).
4. **Usage rights:** who owns the footage and the AI outputs after delivery, and under what licence?
5. **Turnaround:** typical times from shoot to final edit, if they can be stated.
6. **Aerial filming:** is drone filming offered (with permits)? Not mentioned until confirmed.
