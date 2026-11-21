# Humanizer pass: proposals for the English copy

تمريرة مهارة humanizer على نصوص الموقع الإنجليزية، **المجموعة (أ)**: العناوين والأسطر الافتتاحية ووصف الخدمات وكتل الدعوة وصفحة «من نحن» ووصف الأعمال. **مقترحات فقط، لم يُطبَّق شيء** على `src/`.
المهارة: humanizer 3.1.0، النسخة التي حمّلتها الجلسة قبل إزالتها؛ المثبّت الآن 4.0.0 وحده. أرقام الأنماط (§) من 3.1.0. المرجع الحاكم فوقها: `docs/review/copy-voice-reference.md`. التاريخ: 2026-11-20.

**العدّ:** نصوص مُرّرت 285 · نصوص تُركت 35 (24 معتمدة أو قرّر المالك إبقاءها، 2 وصف ميتا/SEO، 6 نصوص TODO مؤقتة، 3 أزرار إغلاق ووصف لقارئ الشاشة) · مقترحات 14 (واحد منها ⚑).

## المجموعة (أ)

| المفتاح | النص الحالي | المقترح | النمط الذي التقطته المهارة |
|---|---|---|---|
| ⚑ `messages:about.body` | Our base is Dubai, and our work runs across six markets, from Saudi Arabia to Egypt: an airline's pavilion at the Dubai Airshow and a majlis dressed for a heritage welcome. Each idea starts where the brand meets its audience, and one team carries it through strategy, creative, production and delivery. | Our base is Dubai, and our work runs across six markets, from Saudi Arabia to Egypt. It ranges from an airline's pavilion at the Dubai Airshow to a majlis dressed for a heritage welcome, and the same team stays with each idea from strategy to delivery. | §2 restatement: 2nd sentence repeats about.statement just above it; the colon presents two projects as if they were the markets |
| `service-hooks.ts:SERVICE_HOOKS.exhibitions-booths` | A stand people step into, drawn, built and staffed by the same team. | In a mall or an exhibition hall, with our staff on the stand and PR on site. | §2 restatement: the hook repeats the summary under it (designed/built/staffed, draw people in) |
| `services.ts:services.stage-technical-production.summary` | Stage, sound, light and screens, rigged and run by one crew. | Stage design, rigging, live sound, lighting and screens. | §2 restatement: repeats the hook above it ("rigged and run by one crew") |
| `services.ts:services.photography.summary` | Event, product and portrait photography, lit with intent. | Photography for events, products, food and portraits. | §2 restatement: "lit with intent" repeats the hook's "lit on purpose" |
| `services.ts:services.video-production.summary` | From script and shoot to the final edit and colour. | Brand, product and event films, sound design included. | §2 restatement: same script-to-colour span as the hook above it |
| `services.ts:services.branding-identity.summary` | Name, mark, voice and system, built to hold together. | Brand strategy, naming, visual identity and guidelines. | §2 restatement: "built to hold together" repeats the hook's "still hold together" |
| `service-hooks.ts:SERVICE_HOOKS.content-strategy` | One written plan for what each channel says, so nothing goes out on guesswork. | Topics and templates set in advance, so nothing goes out on guesswork. | §2 restatement: "one written plan for what each channel says" = the summary under it |
| `service-hooks.ts:SERVICE_HOOKS.commercial-large-format-printing` | From a business card to a wall graphic, the same colour and the same brand. | Every piece in the same colour and the same brand, whatever its size. | §2 restatement: "from a business card to a wall graphic" = the summary under it |
| `services.ts:services.packaging-design.summary` | Boxes and wraps that open like part of the brand. | Custom boxes, wraps, and award and gift-set packaging. | §2 restatement: "open like part of the brand" repeats the hook above it |
| `services.ts:services.branded-merchandise.summary` | Apparel and objects carrying the brand with restraint. | Apparel, bags and desk items, printed or engraved. | §2 restatement: "with restraint" repeats the hook above it |
| `principles.ts:principles.one-roof.line` | Strategy, creative, production and delivery, with no handover to another agency on the way. | The team that writes the strategy sees it through to delivery, with no handover to another agency. | §2 restatement + forced list: the same four-stage list as aboutPage.story2 on the same page |
| `software/page.ts:serviceBlocks.websites.outcome` | A site your clients actually use, in Arabic and English. | One site that reads as well in Arabic as it does in English. | §2 restatement: near-copy of the page's H1 (hero.title); §12 "actually" |
| `software/page.ts:ways.title` | After launch, the work keeps going. So do we. | A project with a launch date, or support after it. | §2 dramatic fragment ("So do we."); §20 heading names one of the section's two ways |
| `messages:workCase.ctaBody` | Start with the services this project used. Each page lists what we deliver, and how to reach us. | Start with the services this project used, or tell us the date and what you need. | §25 describes the site ("Each page lists...") instead of the next step |

ملاحظات:
- **⚑ `about.body`:** يبقى كل حقيقة فيه كما هي (دبي، ستة أسواق من السعودية إلى مصر، المشروعان)، ولا يضيف «الأخيرة» (R9). المقترح المعلّق في `copy-pending.md` ما زال قائمًا؛ هذا بديل يحفظ «فريق واحد». أقصر بـ17% لأن الجملة المكرّرة حُذفت.
- **الخطّاف والوصف في صفحات الفئات:** يُعرض الخطّاف (`service-hooks.ts`) تحت عنوان الخدمة مباشرة، ثم الوصف (`services.ts`)، ثم قائمة «ما نقدّمه». في كثير من الخدمات يقول السطران الشيء نفسه. المقترحات تغيّر السطر الأضعف من الاثنين، وتأخذ ما تضيفه من بنود «ما نقدّمه» الموجودة، دون أي ادعاء جديد. الأزواج التي وصفها ⚑ (الديكور والمسرح، المعدّات، تصنيع الأجنحة، الإعلانات المدفوعة، العلاقات العامة، الهدايا) فيها التكرار نفسه، وتُركت حتى تجيب رند.

## المجموعة (ب)

لم تبدأ بعد.

## المجموعة (ج)

لم تبدأ بعد.
