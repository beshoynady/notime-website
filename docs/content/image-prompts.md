# Image art direction: one entry per slot

Status: **for approval at Checkpoint 4. No image is generated before approval** (Task 15).

- **Slots:** `src/content/images.ts`, 18 slots. `src/content/content.test.ts` checks that every slot has exactly one entry here (`### \`<id>\``) and that the alt texts match.
- **Until a file exists**, each slot renders the designed placeholder (`src/components/ui/ai-placeholder.tsx`), tagged "AI image · placeholder".

## What these images are for

These are **mood images** for categories, process steps and product cards. None of them stands in for a real past project, so none carries the "Illustrative" label (`illustrative: false` everywhere). If a future slot shows an AI image *in place of* a real project, that slot gets `illustrative: true`, and the label appears ("Illustrative" / «صورة توضيحية», CLAUDE.md).

## Real photos: a choice for Checkpoint 4

The 2026 profile gave 32 curated real photos (`docs/content/profile-inventory.md`). Some fit a slot better than any AI image could. Each entry below lists its **real alternative** where one exists.

- Private-celebration, catering and heritage photos carry no client name and no identifiable person, so they could be used now.
- Photos that show a client's brand wait for OQ #17.
- **Size:** all real alternatives are below the 2× delivery size, so they are sharp at 1× only.
- **Recommendation:** use real photos where marked "usable now", and AI for the rest. The real photos are NO TIME's actual work, which matters more than resolution.

## House style (part of every prompt)

> Cinematic still photograph, full-frame camera, 35 mm or 50 mm prime lens, shallow depth of field, low-key warm light with one clear source, soft atmospheric haze, subtle film grain, deep rich shadows, gentle highlights. Palette held to deep espresso brown, cocoa, warm taupe, champagne beige and vanilla ivory. Quiet, unhurried, luxurious. Set in the Gulf (Dubai and the region) through materials and light — brass, linen, marble, sand, palm shade — not through landmarks. No people, or people only as out-of-focus silhouettes or hands.

The palette's hex values are #2E2017, #634731, #BB9A79, #EAD4AB and #F5E9D3. Give them as colour references where the tool accepts them, not as words in the prompt.

## Shared negative prompt

> text, letters, numbers, logos, watermarks, signage with words, brand names, skyline postcards, Burj Khalifa, identifiable faces, portraits, celebrities, crowds facing the camera, flags, national emblems, portraits of rulers, neon, saturated blue or purple light, lens-flare stars, plastic CGI look, 3D render, illustration, cartoon, oversaturated colour, HDR, fisheye distortion, cluttered composition, extra fingers, deformed hands

## Delivery spec (every slot)

- **Size (2× the largest display size):** 4:5 → 1600 × 2000 · 16:9 → 2560 × 1440 · 9:16 → 1440 × 2560.
- **Format:** AVIF (quality ~55) and WebP (quality ~78), sRGB, converted with `sharp`.
- **Path:** `public/images/ai/<slot>.{avif,webp}`.
- **Wiring:** in `images.ts`, set `src: "/images/ai/<slot>.webp"` and a `blurDataURL`. The test refuses any AI `src` outside `/images/ai/`.
- **Checks before wiring:** no text or logos in the frame; no identifiable face; hands correct; colour within the palette; reads at thumbnail size (mega menu tiles are ~200 px wide).

---

## Categories, 4:5 (home category cards, mega menu tiles)

### `cat-events-hospitality-4x5`

- **Page · section:** Home › Categories (card 1); mega menu tile · **Aspect:** 4:5
- **Prompt:** House style. A ballroom set for an evening event, seen from a low angle between two dressed tables: ivory linen, crystal glasses and tall white florals catch candlelight in the foreground. Behind, soft haze and a warm wash of light across an empty stage. Calm, minutes before the doors open.
- **Alt EN:** A warmly lit ballroom set for an evening event, with soft haze and candlelight.
- **Alt AR:** قاعة احتفالات بإضاءة دافئة مهيّأة لأمسية، يلفّها ضباب خفيف وضوء الشموع.
- **Real alternative:** `private-celebrations-2` (white and blue florals with candles, 859 × 1290, crop to 4:5). **Usable now.**

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
- **Prompt:** House style. A dim print workshop: a wide sheet of heavy ivory stock coming off a large-format printer, caught in a pool of warm overhead light. Rolls of paper and a cutting table in shadow behind. The printed surface shows only an abstract warm gradient, no text.
- **Alt EN:** Sheets coming off a large-format printer in a dim print workshop.
- **Alt AR:** أوراق تخرج من طابعة كبيرة الحجم في ورشة طباعة خافتة الإضاءة.
- **Real alternative:** `gifts-2` (sports T-shirt mock-up, 905 × 1019) shows a client brand (OQ #17). Note: the profile's evidence here is **gifts**, not print (reconciliation §1). Consider re-briefing this slot to a gift box being finished by hand.

### `cat-software-digital-4x5`

- **Page · section:** Home › Categories (card 5); mega menu tile · **Aspect:** 4:5
- **Prompt:** House style. A clean desk at night: a laptop half open, its screen glowing softly out of focus in champagne tones; a ceramic cup and a phone face down beside it. A window behind shows only blurred warm city lights, no skyline. Quiet, focused.
- **Alt EN:** A clean workspace at night, a laptop screen glowing softly out of focus.
- **Alt AR:** مساحة عمل مرتّبة ليلًا، وشاشة حاسوب تتوهّج بنعومة خارج التركيز.
- **Real alternative:** `uae-athletics-federation-2` (the federation's app on mobile, 459 × 1048) is real NO TIME work, but small and named (OQ #17).

## Categories, 16:9 (category page headers)

### `cat-events-hospitality-16x9`

- **Page · section:** Services › Events & Hospitality, header · **Aspect:** 16:9
- **Prompt:** House style. A wide view of an event hall from the back: rows of round tables dressed in ivory, low florals and candle clusters in soft focus, leading to a stage washed in warm amber light through haze. Symmetrical, deep perspective, empty of guests.
- **Alt EN:** A wide view of an event stage under warm light, guests' tables in soft focus.
- **Alt AR:** مشهد واسع لمسرح فعالية تحت إضاءة دافئة، وطاولات الضيوف في تركيز ناعم.
- **Real alternative:** `private-celebrations-1` (conservatory hall with lanterns and long tables, 1600 × 1066, crop to 16:9). **Usable now.**

### `cat-creative-production-16x9`

- **Page · section:** Services › Creative Production, header · **Aspect:** 16:9
- **Prompt:** House style. A wide studio frame: two lighting stands with large soft boxes either side of a curved seamless backdrop in warm taupe, a camera on a tripod in the foreground left, slightly out of focus. Haze catches the light. Empty, ready for a shoot.
- **Alt EN:** A wide studio frame with lighting stands and a seamless backdrop in warm tones.
- **Alt AR:** لقطة واسعة لاستوديو بحوامل إضاءة وخلفية متصلة بدرجات دافئة.
- **Real alternative:** `catering-4` (food styling on wooden boards, 1187 × 668), real photography from profile section 11. **Usable now**, but it shows the result, not the studio.

### `cat-marketing-brand-16x9`

- **Page · section:** Services › Marketing & Brand, header · **Aspect:** 16:9
- **Prompt:** House style. A calm studio corner: brand boards pinned to a plaster wall (abstract shapes and swatches in the brand browns and champagne, no text), a long desk below with paper samples and a closed notebook, late-afternoon light raking across the wall from the left.
- **Alt EN:** A calm studio desk with brand boards pinned to a wall in late-afternoon light.
- **Alt AR:** مكتب هادئ ولوحات هوية مثبّتة على الجدار في ضوء آخر النهار.
- **Real alternative:** `uae-pro-league-1` (UAE PL Sponsor's Tournament identity on fabric, 1224 × 664) is real identity work (OQ #17).

### `cat-production-print-gifts-16x9`

- **Page · section:** Services › Production, Print & Gifts, header · **Aspect:** 16:9
- **Prompt:** House style. A print and finishing workshop: stacked rigid gift boxes in black and ivory, some wrapped with champagne ribbon, on a long workbench under warm pendant lamps. A foil-stamping press in soft focus behind. No text or logos on any box.
- **Alt EN:** A print workshop with stacked boxes and wrapped gifts under warm overhead lamps.
- **Alt AR:** ورشة طباعة فيها صناديق مرصوصة وهدايا مغلّفة تحت مصابيح دافئة.
- **Real alternative:** `gifts-1` (gold Dubai-skyline bookmark, 1280 × 719). **Usable now** (no client brand).

### `cat-software-digital-16x9`

- **Page · section:** Services › Software & Digital, header · **Aspect:** 16:9
- **Prompt:** House style. A wide, minimal workspace in warm ambient light: two monitors on a long oak desk showing soft, abstract interface shapes in champagne and taupe (no readable text), a keyboard and a small plant. Evening, one desk lamp, the rest of the room in shadow.
- **Alt EN:** A wide, minimal software workspace with two screens in warm ambient light.
- **Alt AR:** مساحة عمل برمجية واسعة وبسيطة بشاشتين تحت إضاءة محيطة دافئة.
- **Real alternative:** `uae-athletics-federation-1` (uaeathletics.ae home page, 1544 × 965) is real NO TIME work (OQ #17).

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
- **Prompt:** House style. A stage under construction in an exhibition hall: aluminium truss half rigged, light fixtures hanging unlit, a scissor lift in shadow, one work light throwing warm light across the deck. Crew only as distant, out-of-focus silhouettes.
- **Alt EN:** A stage being built in an exhibition hall, frames and lights half rigged.
- **Alt AR:** مسرح قيد التركيب في قاعة معارض، والهياكل والإضاءة نصف مجهّزة.
- **Real alternative:** `private-celebrations-8` (ballroom truss and scaffold setup, 953 × 715, crop to 4:5 = 572 × 715). **Usable now**, small.

### `process-produce-4x5`

- **Page · section:** Home › How we work, step "Produce" · **Aspect:** 4:5
- **Prompt:** House style. Close-up of two hands checking a printed proof under a warm desk lamp: a loupe resting on the sheet, colour bars at its edge, a stack of proofs beside it. The printed image is abstract warm tones, no text.
- **Alt EN:** Hands checking a printed proof under a warm lamp.
- **Alt AR:** يدان تراجعان نسخة مطبوعة تحت مصباح دافئ.
- **Real alternative:** `catering-5` (tiered silver stand carried by a server, 718 × 759) shows production of the day itself rather than print. **Usable now.**

### `process-launch-4x5`

- **Page · section:** Home › How we work, step "Launch" · **Aspect:** 4:5
- **Prompt:** House style. A desert evening setup moments before guests arrive: a low majlis of carpets and cushions on the sand, brass lanterns lit along a path, the last blue of dusk over dunes. Still, expectant, no people.
- **Alt EN:** A desert evening setup with lanterns lit, moments before guests arrive.
- **Alt AR:** تجهيز مسائي في الصحراء والفوانيس مضاءة، قبل وصول الضيوف بلحظات.
- **Real alternative:** `heritage-5` (desert tent at night with carpets, 891 × 668, crop to 4:5 = 534 × 668). **Usable now**, small; matches the alt closely.

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

## Summary for Checkpoint 4

| | Slots |
|---|---|
| Real alternative **usable now** (no client name, no identifiable person) | 7: events 4:5 and 16:9, creative 16:9, print & gifts 16:9, process build, produce (loose fit) and launch |
| Real alternative waiting on a client name (OQ #17) | 4: print & gifts 4:5, software 4:5 and 16:9, marketing 16:9 |
| AI only (no real alternative) | 7: creative 4:5, marketing 4:5, hero fallback ×2, process plan, products ×2 |
| **Total** | **18** |

Every slot also has an AI prompt, so either path stays open.
