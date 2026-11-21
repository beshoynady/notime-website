# Layered image plan (2.5D compositing)

**Status:** draft for the user's review (stop point 1), 2026-11-08. **No image is generated before the category's animatic is approved** (D64). Shared rules: [README.md](README.md) §3.

## Rules

- **Real first.**
  - Cutouts come from the curated profile photos in `public/images/work/` (D49): no identifiable faces, quality grade noted.
  - Real elements composed into a scene are honest as they are. A composite is labelled "Illustrative" / «صورة توضيحية» only if it depicts a specific real project, and none below does.
- **AI layers:**
  - **Prompts:** the house style and the shared negative prompt from [image-prompts.md](../../content/image-prompts.md). Cutout subjects add "isolated subject, centred, on a plain neutral warm-grey background, soft even light, clean edges, nothing else in frame".
  - **Size:** Canva's native generation size only, never upscaled (D51): 16:9 1680 × 944, 9:16 944 × 1680, 4:5 1136 × 1408. A cutout is trimmed to its subject and keeps native pixels.
- **Background removal:**
  - Canva's remove-background tool (the Canva connector has it).
  - Real photos are uploaded to Canva first (`create-upload-url`), then cut out and exported as PNG with alpha.
  - Every cutout is inspected at full size on a checkerboard for halos, fringes and artefacts; failures are redone or dropped.
  - **Fallback for simple shapes** (a box, a lid, a slate): a hand-drawn SVG clip-path over the photo, with no tool.
- **Colour unity:**
  - One grade per category scene, baked into each layer at export by `scripts/grade.mjs`: a sharp `recomb` colour matrix toward espresso/champagne plus a fixed `modulate`.
  - The same matrix applies to real and AI layers. No runtime CSS filter.
- **Formats:**
  - Cutouts: AVIF and WebP with alpha.
  - Plates: AVIF (q≈55) and WebP (q≈78).
  - Paths: `public/images/scenes/<category>/<slot>.{avif,webp}`; a plate's 9:16 file is `<slot>-9x16`. The slots are data in `src/content/scenes/images.ts`, tested one to one against this file. Real-source cutouts keep a note of their source photo in the slot data.
  - Sizes and srcset rules as before: `BrandImage`, native `width`/`height`, srcset capped at native width (D51).
- **Budget per opening:** ≤ 5 image layers and ≤ ~600 KB on mobile. Later shots and mid-page scenes lazy-load one viewport ahead. The build reports the **measured** weight per scene.
- **Alt text:** scene layers are decorative (`alt=""`), because the shot copy carries the meaning in text. The one exception is a layer that shows real work as evidence (marked below).
- **Depth:** the README §3 depth number; `<LayeredScene>` turns it into motion.

---

## I · Events & Hospitality (grade: "Evening", warm espresso shadows, champagne highlights)

| Slot | Scene · level | Aspect / size | Source | Prompt / source note | BG removal | Depth | Alt |
|---|---|---|---|---|---|---|---|
| `ev-open-hall` | Opening · L0 | 16:9 1680 × 944 + 9:16 944 × 1680 | AI | House style. A wide empty banquet hall seen from the back, lights off except a faint warm wash on the stage at the far end, soft haze, bare floor, no tables, no people. Symmetrical, deep perspective, very low detail in the shadows. | none | 0.15 | decorative |
| `ev-open-room` | Opening · L0 (the room, dressed; batch 2) | 16:9 1600 × 900 + 9:16 600 × 1066 (crops of the 1600 × 1066 source, native pixels) | **Real**, `private-celebrations-1` (p9-2, conservatory hall with lanterns and long candlelit tables, 1600 × 1066, A; no people in focus, no branding) | Fades in over the code-drawn hall on the same vanishing point while the room is dressed. Built in v1 instead of the cutouts below (no paid tools); graded with `scripts/grade.mjs`. | none | 0.15 | decorative |
| `ev-open-table` | Opening · L1 (the near tables; D109) | 16:9 1600 × 900 + 9:16 600 × 1066, full-frame with alpha (same crops as `ev-open-room`) | **Real**, `private-celebrations-1` (p9-2, the same room) | The two near table runs, cut along the centre aisle (a real depth edge) with a long soft ramp where they recede; under them the room plate carries a blurred, darker fill, so their drift never reveals a second table. Opens with the room in the mask wipe, then drifts at depth 0.55 with a 0.10 push (the dolly). `scripts` recipe in D109. | Pillow mask (no paid tools) | 0.55 | decorative |
| `ev-open-florals` | Opening · L2 | ~700 × 900 trimmed | **Real**, `private-celebrations-2` (p9-1, white and blue florals with candles, 859 × 1290, A) | The floral arrangement only. The grade warms the blue hydrangeas toward taupe. | Canva remove-background | 1.2 | decorative |
| `ev-open-candles` | Opening · L2 | ~600 × 400 trimmed | **Real**, `private-celebrations-4` (p10-5, candles and hydrangeas on a runner, 811 × 541, B) | The candle cluster. *Fallback:* AI cutout, "a cluster of five ivory pillar candles of different heights, lit, isolated…". | Canva remove-background | 1.0 | decorative |
| `ev-open-glasses` | Opening · L2 (desktop only) | ~500 × 500 trimmed | **Real**, `catering-1` (p28-1, crystal and gold service, 1408 × 794, A) | Two or three crystal glasses, shown large and out of focus near the lens (the softness hides the source's resolution). | Canva remove-background | 1.3 | decorative |
| `ev-majlis-dusk` | Majlis (§V) · L0 | 16:9 + 9:16 | AI | House style. Open desert sand at dusk under a deep espresso-to-champagne sky, low dunes, no structures, no people, no sun disc, very soft. | none | 0.15 | decorative |
| `ev-majlis-tent` | Majlis · L1 | ~800 × 500 trimmed | **Real**, `heritage-5` (p31-1, desert tent at night with carpets, 891 × 668, B) | The tent and its lit interior. | Canva remove-background + manual edge on the canopy | 0.5 | decorative |
| `ev-majlis-dallah` | Majlis · L2 | ~600 × 800 trimmed | **Real**, `heritage-4` (p32-1, heritage cart with brass vessels, 956 × 1275, A) | One brass dallah. The pour is drawn in SVG, not photographed. | Canva remove-background | 1.0 | decorative |
| `ev-majlis-cup` | Majlis · L2 (desktop) | ~300 × 300 trimmed | **Real**, `heritage-2` (p31-3, Arabic coffee service on a carpet, 688 × 516, C) | One small cup. At grade C it's only usable small; *fallback:* AI cutout "a small handleless Arabic coffee cup (finjan), plain ivory porcelain, isolated…". | Canva remove-background | 1.1 | decorative |

**Totals:**
- **Opening, mobile:** 3 layers (hall 9:16, table, florals), ≈ 300 KB estimated.
- **Opening, desktop:** 5 layers, ≈ 450 KB estimated.
- **Majlis:** 3–4 layers, ≈ 280 KB estimated, lazy.
- **AI generations:** 4 (2 plates × 2 aspects), plus up to 2 fallbacks.
- **Background removals:** 7.

## V · Software & Digital

**No image layers.** The opening is drawn in code (README §3, L0–L3 as grid, SVG, HTML, CSS frames).

| Slot | Alt EN | Alt AR |
|---|---|---|

**AI generations:** 0. **Background removals:** 0.

## IV · Production, Print & Gifts (grade: "Workshop", champagne paper, cocoa ink)

| Slot | Scene · level | Aspect / size | Source | Prompt | BG removal | Depth | Alt |
|---|---|---|---|---|---|---|---|
| `pg-open-bench` | Opening · L0 | 16:9 + 9:16 | AI | House style. A dark walnut worktable seen from directly above, bare, warm side light, faint tool marks, nothing on it. | none | 0.15 | decorative |
| `pg-open-paper` + `pg-open-ribbon` | Opening · L2 | from one 4:5 generation, two cutouts | AI | House style, flat lay from above. A small stack of ivory card stock, a sheet of grey board, and a spool of champagne satin ribbon, spaced apart, isolated, on a plain neutral warm-grey background. No text. | Canva remove-background, then split into two files | 1.0 / 1.2 | decorative |
| `pg-open-box-base` + `pg-open-box-lid` | Opening · L1 | from one 4:5 generation, two cutouts | AI | House style. A rigid gift box in deep espresso with its matching lid held a little above it, straight-on view, isolated, on a plain neutral warm-grey background. No logos, text or emblems. | Canva remove-background; the lid is split from the base with a manual SVG mask | 0.5 | decorative |
| `pg-open-gift` | Opening · L2 (desktop; D109) | 1034 × 616 trimmed | **Real**, `gifts-1` (p23-3, gold Dubai-skyline gift, 1280 × 719, A) | The finished gift arrives near the lens as the box closes (shot 4) and drifts faster than the rigs, ending clear of the service rail. Replaces the paper cutout as a layer (the slot stays documented). | rembg `isnet-general-use` with alpha matting; edges checked on espresso and champagne | 0.9 | evidence (alt) |

**Totals:**
- **Opening, mobile:** 3 layers, ≈ 270 KB.
- **AI generations:** 4.
- **Background removals:** 3, giving 4 cutouts.
- **Real gift photos** (`gifts-1`, `gifts-2`) aren't used in the scene: one is a bookmark, the other a client mock-up pending OQ #17.

## III · Marketing & Brand (grade: "Editorial", ivory paper, espresso ink)

| Slot | Scene · level | Aspect / size | Source | Prompt / note | BG removal | Depth | Alt |
|---|---|---|---|---|---|---|---|
| `mb-open-paper` | Opening · L0 | 16:9 + 9:16 | AI | House style. A macro of plain ivory cotton paper filling the frame, soft raking light showing its fibres, no edges, no text. | none | 0.15 | decorative |
| `mb-open-board` | Opening · L1 | existing 4:5 1136 × 1408 | **Re-used** AI image `cat-marketing-brand-4x5` (approved, D50) | No new generation. | none (shown as a rectangle in its grid cell) | 0.5 | decorative |
| `mb-open-swatches` | Opening · L2 | 4:5, trimmed | AI | House style, from above. A fan of colour swatch cards in espresso, cocoa, taupe, champagne and ivory, isolated, on a plain neutral warm-grey background. No text. | Canva remove-background | 1.1 | decorative |
| `mb-open-pen` | Opening · L2 | 4:5, trimmed | AI | House style. A brass fountain pen lying diagonally, isolated, on a plain neutral warm-grey background. No logo. | Canva remove-background | 1.3 | decorative |

**Totals:**
- **Opening, mobile:** 2 layers, ≈ 170 KB.
- **AI generations:** 4.
- **Background removals:** 2.

## II · Creative Production (grade: "Studio", night blacks, a single warm key)

**Superseded (D158, 2026-11-21):** the opening is in photographs and its layers live in the image registry (`src/content/media.ts`): `cp-open-dark` and `cp-open-lit` (one stock studio graded twice, `docs/content/recipes/creative.json`) and Rand's `catering-4` as the frame. No AI generation and no cutout. The drawn studio (slate, letterbox, timecodes, flash) is gone.

---

## Credits plan

| Category | AI generations | With a 50% retry allowance | Background removals | When |
|---|---|---|---|---|
| I Events & Hospitality | 4 (+2 fallbacks) | 6–9 | 7 | After CP-animatic approval, **first** |
| V Software & Digital | 0 | 0 | 0 | — |
| IV Production, Print & Gifts | 4 | 6 | 3 | After its animatic |
| III Marketing & Brand | 4 | 6 | 2 | After its animatic |
| II Creative Production | 3 | 5 | 2 | After its animatic |
| **Total** | **15 (+2)** | **≈ 23–26** | **14** | |

- **Units:** counted in Canva generation calls. Each call returns several candidates. The credit cost per call (and whether remove-background uses credits on this account) is confirmed on the account before the first batch and reported with the Events contact sheet.
- **Cancelled (D67):** `cat-marketing-brand-16x9` and `cat-software-digital-16x9`. The category openings (D64) replace the 16:9 header image. They're removed from the data in Task 2.8.
- **Still pending from before:** `hero-fallback-16x9` and `product-restaurant-system-16x9`, 2 generations (≈ 3 with retries).
- **Grand total:** 17 (+2) generations, ≈ 26–29 with retries, and 14 background removals.
- **Contact sheet for each category** (stop point 3 for Events): every layer at full size, with cutouts on a checkerboard, the graded and ungraded versions side by side, and the measured weight per file.
