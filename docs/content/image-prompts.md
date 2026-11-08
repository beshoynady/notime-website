# Image art direction: one entry per slot

Status: prompts approved at Checkpoint 4. Generation started after Checkpoint 5 (D50).

## Generation status (D50)

Masters are PNG exports from the Canva folder "NO TIME – Website AI", design "NO TIME – Website AI images". The "native · <slot>" pages (12–18) are each exactly the image's size, so the export is 1:1. Pages 2–11 are the first, upscaled exports and are superseded (D51). Each image is inspected at full size (quadrants at 1:1) before `scripts/convert-ai.mjs` converts it.

| Slot | Status | Note |
|---|---|---|
| `cat-creative-production-4x5` | wired | |
| `cat-marketing-brand-4x5` | wired | |
| `cat-production-print-gifts-4x5` | wired | Gift box re-brief. Back lid corner slightly soft, out of focus. |
| `cat-software-digital-4x5` | wired | Key legends illegible, phone screen blank. |
| `hero-fallback-9x16` | wired | |
| `process-plan-4x5` | wired | Plans and ruler show lines and ticks only. |
| `product-qr-check-in-16x9` | wired | Tablet screen blank. |
| `cat-marketing-brand-16x9` | rejected | Small pseudo-text mark on a pinned sheet. Regenerate. |
| `cat-software-digital-16x9` | rejected | Pseudo-text on the screens and a badge on a bezel. Regenerate. |
| `hero-fallback-16x9` | rejected | A see-through pillar right of the beam (the palm and arch show through it). Regenerate. |
| `product-restaurant-system-16x9` | not generated | Canva credit quota ran out. |

The 4 open slots wait for the Canva credits to renew, so the style stays consistent; no other generator (D51). Until then they render the designed placeholder. If the credits have not renewed within a few days, the user generates them from this file and drops them in by slot id.

- **Slots:** `src/content/images.ts`, 18 slots. `src/content/content.test.ts` checks that every slot has exactly one entry here (`### \`<id>\``) and that the alt texts match.
- **Until a file exists**, each slot renders the designed placeholder (`src/components/ui/ai-placeholder.tsx`), tagged "AI image · placeholder".

## What these images are for

These are **mood images** for categories, process steps and product cards. None of them stands in for a real past project, so none carries the "Illustrative" label (`illustrative: false` everywhere). If a future slot shows an AI image *in place of* a real project, that slot gets `illustrative: true`, and the label appears ("Illustrative" / «صورة توضيحية», CLAUDE.md).

## Real photos (decided at Checkpoint 4, D49)

The 2026 profile gave 32 curated real photos (`docs/content/profile-inventory.md`).

- **7 slots use a real photo now.** They carry no client name and no identifiable person. Their prompt is kept as a fallback only.
- **4 slots get an AI image** until the client named in their real photo approves (OQ #17). Then they swap to the photo.
- **7 slots are AI only.**
- **Size:** the real photos are below the 2× delivery size, so they are sharp at 1× only. The user accepted that: they are NO TIME's actual work.
- **Never used anywhere:** the page-7 AI image (generator watermark, portraits of the UAE President).

## House style (part of every prompt)

> Cinematic still photograph, full-frame camera, 35 mm or 50 mm prime lens, shallow depth of field, low-key warm light with one clear source, soft atmospheric haze, subtle film grain, deep rich shadows, gentle highlights. Palette held to deep espresso brown, cocoa, warm taupe, champagne beige and vanilla ivory. Quiet, unhurried, luxurious. Set in the Gulf (Dubai and the region) through materials and light — brass, linen, marble, sand, palm shade — not through landmarks. No people, or people only as out-of-focus silhouettes or hands.

The palette's hex values are #2E2017, #634731, #BB9A79, #EAD4AB and #F5E9D3. Give them as colour references where the tool accepts them, not as words in the prompt.

## Shared negative prompt

> text, letters, numbers, logos, watermarks, signage with words, brand names, skyline postcards, Burj Khalifa, identifiable faces, portraits, celebrities, crowds facing the camera, flags, national emblems, portraits of rulers, neon, saturated blue or purple light, lens-flare stars, plastic CGI look, 3D render, illustration, cartoon, oversaturated colour, HDR, fisheye distortion, cluttered composition, extra fingers, deformed hands

## Delivery spec (every slot)

- **Size: Canva's native generation size, never upscaled (D51):** 4:5 → 1136 × 1408 · 16:9 → 1680 × 944 · 9:16 → 944 × 1680. Record `width`/`height` on the slot. `BrandImage` caps the srcset at that width, so no screen requests more pixels than the file has. The 16:9 hero image is only a fallback (the hero is canvas), so 1680 px is enough.
- **Format:** AVIF (quality ~55) and WebP (quality ~78), sRGB, converted with `sharp`.
- **Path:** `public/images/ai/<slot>.{avif,webp}`.
- **Wiring:** in `images.ts`, set `src: "/images/ai/<slot>.webp"`, `width`, `height` and a `blurDataURL` (all printed by `scripts/convert-ai.mjs`). The test refuses any AI `src` outside `/images/ai/`.
- **Checks before wiring:** no text or logos in the frame; no identifiable face; hands correct; colour within the palette; reads at thumbnail size (mega menu tiles are ~200 px wide).

---

## Categories, 4:5 (home category cards, mega menu tiles)

### `cat-events-hospitality-4x5`

- **Page · section:** Home › Categories (card 1); mega menu tile · **Aspect:** 4:5
- **Prompt (fallback only):** House style. A ballroom set for an evening event, seen from a low angle between two dressed tables: ivory linen, crystal glasses and tall white florals catch candlelight in the foreground. Behind, soft haze and a warm wash of light across an empty stage. Calm, minutes before the doors open.
- **Alt EN:** White roses and blue hydrangeas on a dressed table, lit by candles.
- **Alt AR:** ورود بيضاء وزهور كوبية زرقاء على طاولة مزيّنة، تضيئها الشموع.
- **In use: real photo** `/images/work/private-celebrations/private-celebrations-2.webp` (D49). Was: `private-celebrations-2` (white and blue florals with candles, 859 × 1290, crop to 4:5).

### `cat-creative-production-4x5`

- **Page · section:** Home › Categories (card 2); mega menu tile · **Aspect:** 4:5
- **Prompt:** House style. A film camera on a dolly in a dark studio, three-quarter view from behind the camera, one warm key light falling on a seamless taupe backdrop beyond. Cables coiled neatly on the floor, a faint beam through haze. No operator in frame.
- **Alt EN:** A film studio set with a camera on a dolly and a single warm key light.
- **Alt AR:** موقع تصوير في استوديو، كاميرا على عربة وضوء رئيسي دافئ واحد.
- **Real alternative:** none in the profile (the AI key visuals and athlete photos are client work, pending rights).

### `cat-marketing-brand-4x5`

- **Page · section:** Home › Categories (card 3); mega menu tile · **Aspect:** 4:5
- **Prompt:** House style. Overhead view of brand material on a dark walnut desk: textured paper samples in ivory and champagne, a fan of colour swatches in the brand browns, a closed linen notebook, a brass pen. Late-afternoon light through a window blind lays soft stripes across the desk. No visible text on any item.
- **Alt EN:** Brand material laid out on a desk: paper samples, swatches and a closed notebook.
- **Alt AR:** مواد هوية على مكتب: عيّنات ورق ودرجات ألوان ودفتر مغلق.
- **Real alternative:** none without a client brand.

### `cat-production-print-gifts-4x5`

- **Page · section:** Home › Categories (card 4); mega menu tile · **Aspect:** 4:5
- **Prompt:** House style. A corporate gift box being prepared by hand on a dark walnut worktable: a rigid deep-espresso box with its lid set aside, ivory tissue paper folded inside, and two hands at the edge of the frame tying a champagne satin ribbon. Warm low-key light from one side, the rest of the workshop in shadow. No logos, text or emblems on the box, lid, ribbon or tissue.
- **Alt EN:** Hands tying a champagne ribbon on a dark corporate gift box.
- **Alt AR:** يدان تعقدان شريطًا بلون الشمبانيا على علبة هدايا داكنة.
- **Re-briefed at Checkpoint 5 (D50):** from a print workshop to a hand-prepared gift box, because the profile's evidence for this category is gifts, not print (reconciliation §1). The first print-workshop image was dropped.
- **Real alternative:** the UAE Pro League gift photos: `uae-pro-league-5` (gift set, 1280 × 882) and the PU gift box on p24-1 (needs a clean original without the baked-in carousel badge, OQ #21). Client brand, so OQ #17.
- **Now:** AI image until the client approves; marked `// TODO: swap to real photo after approval` in `images.ts` (D49).

### `cat-software-digital-4x5`

- **Page · section:** Home › Categories (card 5); mega menu tile · **Aspect:** 4:5
- **Prompt:** House style. A clean desk at night: a laptop half open, its screen glowing softly out of focus in champagne tones; a ceramic cup and a phone face down beside it. A window behind shows only blurred warm city lights, no skyline. Quiet, focused.
- **Alt EN:** A clean workspace at night, a laptop screen glowing softly out of focus.
- **Alt AR:** مساحة عمل مرتّبة ليلًا، وشاشة حاسوب تتوهّج بنعومة خارج التركيز.
- **Real alternative:** `uae-athletics-federation-2` (the federation's app on mobile, 459 × 1048) is real NO TIME work, but small and named (OQ #17).
- **Now:** AI image until the client approves; marked `// TODO: swap to real photo after approval` in `images.ts` (D49).

## Categories, 16:9 (category page headers)

### `cat-events-hospitality-16x9`

- **Page · section:** Services › Events & Hospitality, header · **Aspect:** 16:9
- **Prompt (fallback only):** House style. A wide view of an event hall from the back: rows of round tables dressed in ivory, low florals and candle clusters in soft focus, leading to a stage washed in warm amber light through haze. Symmetrical, deep perspective, empty of guests.
- **Alt EN:** A glass-roofed hall set with long candlelit tables under red lanterns.
- **Alt AR:** قاعة بسقف زجاجي مهيّأة بطاولات طويلة على ضوء الشموع، تحت فوانيس حمراء.
- **In use: real photo** `/images/work/private-celebrations/private-celebrations-1.webp` (D49). Was: `private-celebrations-1` (conservatory hall with lanterns and long tables, 1600 × 1066, crop to 16:9).

### `cat-creative-production-16x9`

- **Page · section:** Services › Creative Production, header · **Aspect:** 16:9
- **Prompt (fallback only):** House style. A wide studio frame: two lighting stands with large soft boxes either side of a curved seamless backdrop in warm taupe, a camera on a tripod in the foreground left, slightly out of focus. Haze catches the light. Empty, ready for a shoot.
- **Alt EN:** Food styling for a shoot: plated desserts on wooden boards beside palm leaves.
- **Alt AR:** تنسيق طعام لجلسة تصوير: حلويات مصفوفة على ألواح خشبية بجانب سعف النخيل.
- **In use: real photo** `/images/work/catering/catering-4.webp` (D49). Was: `catering-4` (food styling on wooden boards, 1187 × 668), real photography from profile section 11.

### `cat-marketing-brand-16x9`

- **Page · section:** Services › Marketing & Brand, header · **Aspect:** 16:9
- **Prompt:** House style. A calm studio corner: brand boards pinned to a plaster wall (abstract shapes and swatches in the brand browns and champagne, no text), a long desk below with paper samples and a closed notebook, late-afternoon light raking across the wall from the left.
- **Alt EN:** A calm studio desk with brand boards pinned to a wall in late-afternoon light.
- **Alt AR:** مكتب هادئ ولوحات هوية مثبّتة على الجدار في ضوء آخر النهار.
- **Real alternative:** `uae-pro-league-1` (UAE PL Sponsor's Tournament identity on fabric, 1224 × 664) is real identity work (OQ #17).
- **Now:** AI image until the client approves; marked `// TODO: swap to real photo after approval` in `images.ts` (D49).

### `cat-production-print-gifts-16x9`

- **Page · section:** Services › Production, Print & Gifts, header · **Aspect:** 16:9
- **Prompt (fallback only):** House style. A print and finishing workshop: stacked rigid gift boxes in black and ivory, some wrapped with champagne ribbon, on a long workbench under warm pendant lamps. A foil-stamping press in soft focus behind. No text or logos on any box.
- **Alt EN:** A gold bookmark cut in the shape of the Dubai skyline.
- **Alt AR:** فاصل كتاب ذهبي مقصوص على شكل أفق دبي.
- **In use: real photo** `/images/work/gifts/gifts-1.webp` (D49). Was: `gifts-1` (gold Dubai-skyline bookmark, 1280 × 719).

### `cat-software-digital-16x9`

- **Page · section:** Services › Software & Digital, header · **Aspect:** 16:9
- **Prompt:** House style. A wide, minimal workspace in warm ambient light: two monitors on a long oak desk showing soft, abstract interface shapes in champagne and taupe (no readable text), a keyboard and a small plant. Evening, one desk lamp, the rest of the room in shadow.
- **Alt EN:** A wide, minimal software workspace with two screens in warm ambient light.
- **Alt AR:** مساحة عمل برمجية واسعة وبسيطة بشاشتين تحت إضاءة محيطة دافئة.
- **Real alternative:** `uae-athletics-federation-1` (uaeathletics.ae home page, 1544 × 965) is real NO TIME work (OQ #17).
- **Now:** AI image until the client approves; marked `// TODO: swap to real photo after approval` in `images.ts` (D49).

## Hero fallback (only if the canvas scene is ever replaced by media)

The hero today is code-driven (canvas, clock, shutters; D43–D45) and uses neither slot. They exist for a possible video or still fallback.

### `hero-fallback-16x9`

- **Page · section:** Home › Hero (fallback only) · **Aspect:** 16:9
- **Prompt:** House style. Stage light rays cutting down through thick warm haze over an empty venue, seen from the floor. Dark espresso surroundings, the beams champagne-gold, dust motes visible. Strong negative space in the centre for the title.
- **Alt EN:** Stage lights cutting through warm haze over an empty venue.
- **Alt AR:** أضواء مسرح تشقّ ضبابًا دافئًا فوق قاعة خالية.
- **Real alternative:** none.

### `hero-fallback-9x16`

- **Page · section:** Home › Hero, mobile (fallback only) · **Aspect:** 9:16
- **Prompt:** House style. A tall frame of stage light rays falling from above through warm haze, beams converging toward the lower third, dark surroundings, dust motes. Clear space in the middle third for the title.
- **Alt EN:** A tall frame of stage light rays falling through haze.
- **Alt AR:** إطار طولي لأشعة ضوء مسرح تنساب عبر الضباب.
- **Real alternative:** none.

## How we work, 4:5 (one per step)

### `process-plan-4x5`

- **Page · section:** Home › How we work, step "Plan" · **Aspect:** 4:5
- **Prompt:** House style. Overhead view of a planning table: printed venue floor plans with pencil marks, a scale ruler, a pencil, and a small cup of Arabic coffee with a brass dallah just in frame. Soft daylight from one side. The plans show lines and shapes only, no readable text.
- **Alt EN:** A planning table with floor plans, a pencil and a cup of Arabic coffee.
- **Alt AR:** طاولة تخطيط عليها مخططات القاعة وقلم وفنجان قهوة عربية.
- **Real alternative:** none.

### `process-build-4x5`

- **Page · section:** Home › How we work, step "Build" · **Aspect:** 4:5
- **Prompt (fallback only):** House style. A stage under construction in an exhibition hall: aluminium truss half rigged, light fixtures hanging unlit, a scissor lift in shadow, one work light throwing warm light across the deck. Crew only as distant, out-of-focus silhouettes.
- **Alt EN:** A ballroom during setup, with truss and scaffolding going up.
- **Alt AR:** قاعة احتفالات أثناء التجهيز، والهياكل المعدنية والسقالات قيد التركيب.
- **In use: real photo** `/images/work/private-celebrations/private-celebrations-8.webp` (D49). Was: `private-celebrations-8` (ballroom truss and scaffold setup, 953 × 715, crop to 4:5 = 572 × 715).

### `process-produce-4x5`

- **Page · section:** Home › How we work, step "Produce" · **Aspect:** 4:5
- **Prompt (fallback only):** House style. Close-up of two hands checking a printed proof under a warm desk lamp: a loupe resting on the sheet, colour bars at its edge, a stack of proofs beside it. The printed image is abstract warm tones, no text.
- **Alt EN:** A server carrying a tiered silver stand of desserts.
- **Alt AR:** نادل يحمل حاملًا فضيًا من عدة طبقات عليه حلويات.
- **In use: real photo** `/images/work/catering/catering-5.webp` (D49). Was: `catering-5` (tiered silver stand carried by a server, 718 × 759) shows production of the day itself rather than print.

### `process-launch-4x5`

- **Page · section:** Home › How we work, step "Launch" · **Aspect:** 4:5
- **Prompt (fallback only):** House style. A desert evening setup moments before guests arrive: a low majlis of carpets and cushions on the sand, brass lanterns lit along a path, the last blue of dusk over dunes. Still, expectant, no people.
- **Alt EN:** A desert tent at night, its carpets laid out for guests.
- **Alt AR:** خيمة صحراوية ليلًا، وسجّادها مفروش لاستقبال الضيوف.
- **In use: real photo** `/images/work/heritage/heritage-5.webp` (D49). Was: `heritage-5` (desert tent at night with carpets, 891 × 668, crop to 4:5 = 534 × 668).

## Products, 16:9 (Digital solutions product cards; product page headers)

These are concept backgrounds behind the products' "Preview" screens. The screens themselves are product UI, not photos.

### `product-qr-check-in-16x9`

- **Page · section:** Home › Digital solutions, product card 1; product page header · **Aspect:** 16:9
- **Prompt:** House style. An event entrance at dusk, out of focus: a softly lit check-in podium with a tablet on a stand, ivory florals either side, warm path lights leading in. The tablet screen is blank warm light. No people, no QR code drawn.
- **Alt EN:** An event entrance at dusk with a softly lit check-in point, out of focus.
- **Alt AR:** مدخل فعالية عند الغروب ونقطة تسجيل مضاءة بنعومة خارج التركيز.
- **Real alternative:** none.

### `product-restaurant-system-16x9`

- **Page · section:** Home › Digital solutions, product card 2; product page header · **Aspect:** 16:9
- **Prompt:** House style. A restaurant pass at service time, in soft focus: plated dishes under warm heat lamps, a brass bell, a ticket rail with blank tickets, the kitchen glowing behind. Movement suggested only by blur, no faces.
- **Alt EN:** A restaurant pass at service time, warm lights and plates in soft focus.
- **Alt AR:** منضدة تقديم في مطعم وقت الخدمة، أضواء دافئة وأطباق في تركيز ناعم.
- **Real alternative:** none.

---

## Category pages (D57): heroes and module visuals

Added 2026-11-08 for the five designed category pages (`docs/design/category-pages.md`). **Status: not generated.** Generation waits for Canva credits (D51). Until a file exists, each slot shows the designed placeholder, and each module shows its static, complete fallback.

### Heroes: the existing 16:9 slots

Each category page hero uses its category's `imageWide` slot. No new hero slots.

| Page | Slot | State |
|---|---|---|
| Events & Hospitality (The Evening) | `cat-events-hospitality-16x9` | Real photo (D49) |
| Creative Production (The Studio) | `cat-creative-production-16x9` | Real photo (D49), letterboxed to 2.39:1 by the theme |
| Marketing & Brand (The Editorial) | `cat-marketing-brand-16x9` | AI, rejected in the CP5 inspection; regenerate when credits renew |
| Production, Print & Gifts (The Workshop) | `cat-production-print-gifts-16x9` | Real photo (D49) |
| Software & Digital (The Interface) | `cat-software-digital-16x9` | AI, rejected in the CP5 inspection; regenerate when credits renew. The Interface hero is mostly HTML device frames, so this image is secondary there |

### Module visuals (AI)

Only modules that need a photograph get a slot. Everything else is drawn in SVG or built in HTML (agenda, stand, stage, menu border, catalogue line drawings, gift box, merchandise, dieline, devices, diagrams), or uses real photos (photography gallery, celebrations mood board) or the showreel (video module). Every image below is demo content: it carries **"AI-generated example" / «مثال مولَّد بالذكاء الاصطناعي»** (idea-to-image), or **"Example" / «مثال»** with **"Illustrative" / «صورة توضيحية»** where it could be read as a project.

Native sizes as in the delivery spec: 4:5 → 1136 × 1408, 16:9 → 1680 × 944. For 1:1, record Canva's native size at generation, never upscaled (D51).

#### `mod-launch-plinth-4x5`

- **Page · section:** Events & Hospitality › #launches (launch-reveal) · **Aspect:** 4:5
- **Prompt:** House style. A single plinth of travertine stone under one soft top light in a dark room, a draped champagne cloth half pulled away from an unbranded sculptural object, haze, nothing else in frame.
- **Alt EN:** A stone plinth under a single light, its cloth half drawn back. · **Alt AR:** منصّة حجرية تحت ضوء واحد، وقد انسحب عنها نصف الغطاء.
- **Label:** Example · Illustrative.

#### `mod-set-model-16x9`

- **Page · section:** Creative Production › #set-design (set-model, frame 2) · **Aspect:** 16:9
- **Prompt:** House style. A white-card architectural model of a stage set on a cutting mat: arches, steps and a backdrop wall in plain white card, a small scale figure, a desk lamp as the single warm light source, shallow depth of field.
- **Alt EN:** A white-card model of a stage set lit by a desk lamp. · **Alt AR:** مجسّم من الورق الأبيض لديكور مسرح، تحت ضوء مصباح مكتب.
- **Label:** Example.

#### `mod-set-lit-16x9`

- **Page · section:** Creative Production › #set-design (set-model, frame 3) · **Aspect:** 16:9
- **Prompt:** House style. The same set built full size and lit for camera: arches, steps and a backdrop wall in warm plaster tones, haze, one amber key light, a camera dolly track in the soft foreground, empty of people.
- **Alt EN:** A built stage set with arches and steps under amber light. · **Alt AR:** ديكور مسرح منفَّذ بأقواس ودرجات تحت ضوء كهرماني.
- **Label:** Example · Illustrative.

#### `mod-idea-1-4x5`, `mod-idea-2-4x5`, `mod-idea-3-4x5`

- **Page · section:** Creative Production › #ai-content (idea-to-image) · **Aspect:** 4:5
- **Prompts:** these are the module's content: each prompt is shown beside its image as "the idea".
  1. House style. A dallah coffee pot and two finjan cups on a brass tray, steam rising, dark wood behind.
  2. House style. A desert majlis tent at blue hour, low cushions and lanterns, the dunes soft behind.
  3. House style. A perfume bottle (unbranded) on raw stone with a single beam of light crossing it.
- **Alt:** each one restates its prompt in one sentence, in EN and AR.
- **Label:** AI-generated example.

#### `mod-feed-1-1x1` … `mod-feed-6-1x1`

- **Page · section:** Marketing & Brand › #social (phone-feed) · **Aspect:** 1:1 · six posts for a fictional café feed.
- **Prompts:** house style for each:
  1. Latte art on a stone counter, top-down.
  2. A pastry tray under morning light.
  3. Hands (no faces) pouring coffee.
  4. Café chairs in late sun.
  5. A takeaway cup on a car dashboard at dusk.
  6. Coffee beans spilling from a kraft bag.
- **Alt:** a short description of each post, in EN and AR.
- **Label:** Example. No handles, likes or follower counts in the UI.

**Module visuals total:** 12 new slots (1 + 2 + 3 + 6), plus the 2 rejected heroes to regenerate.

---

## Summary

| | Slots |
|---|---|
| **Real photo in use** (D49) | 7: events 4:5 and 16:9, creative 16:9, print & gifts 16:9, process build, produce and launch |
| **AI now**, real photo after the client approves (OQ #17) | 4: print & gifts 4:5, software 4:5 and 16:9, marketing 16:9 |
| **AI only** | 7: creative 4:5, marketing 4:5, hero fallback ×2, process plan, products ×2 |
| **Total** | **18** |

That leaves 11 slots to generate. The first 3 go to the user for review before the rest (D49).
