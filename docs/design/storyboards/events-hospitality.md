# I · Events & Hospitality: "The Evening"

**Story in one line:** an empty, dark venue becomes a room full of warm light, ready before the first guest.
**Theme:** category-pages.md §5.1: espresso ground, ivory ink, champagne light; ends on an ivory "morning after" band.
**Prototype:** first (CP7). Animatic route: `/[locale]/lab/events-animatic`.
**Conventions:** [README.md](README.md). Layer slots: [layers.md](layers.md) §I.

---

## Act 1 · Opening (pinned: desktop 2.0 vh, mobile 1.2 vh)

**Shot strip (desktop; owner: GSAP, one scrubbed timeline):**

```
 1 EMPTY ROOM            2 LIGHTS UP             3 DRESSED               4 READY
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│rail ··· dark hall ··│ │rail ··  beam / ···│ │rail florals>  <cndl │ │rail  warm, full     │
│     ····· stage ····│ │     ··(  glow  )····│ │     ▁▁▁ table ▁▁▁▁  │ │     ▁▁▁ table ▁▁▁▁  │
│ I · 6 SERVICES      │ │ I · 6 SERVICES      │ │ I · 6 SERVICES      │ │ I · 6 SERVICES      │
│ EVENTS & HOSPITALITY│ │ EVENTS & HOSPITALITY│ │ EVENTS & HOSPITALITY│ │ EVENTS & HOSPITALITY│
│ It starts with an … │ │ (line 1 holds)      │ │ Tables, flowers …   │ │ Every detail, ready…│
│              skip ↓ │ │              skip ↓ │ │   (glasses, blur)   │ │              skip ↓ │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
   L0 + haze              + L3 glow, beams        + L1 table, L2 ×3       all settled, flicker
```
Mobile (9:16): the chip bar sits under the header; the H1 sits at the bottom third; one line at a time above it.

**Three lines over four shots (D74, P1).** Shot 2 has no line: the first line holds while the lights come up, so each of the three lines reads for about a second at a normal scroll. The shots are timed for the lines (desktop 0 → 0.4 → 0.83 → 1.8 → 2.0 vh): the dressing gets the second line, and the promise lands with the last light key. During shot 1 the service index sits at 40% and comes back on hover, focus or the next shot (D74, P3). In Arabic the eyebrow reads «01 · 6 خدمات» (D74, P4).

### Shot 1 · The empty room

| | |
|---|---|
| **Scroll** | Desktop 0 → 0.4 vh (its line holds to 0.83) · mobile 0 → 0.45 vh (rebalanced within the approved 1.2 vh so the first line holds ≥ 1 s; D75) |
| **Frame** | A dark, empty hall seen from the back. Lights off, only a faint wash at the stage end. The H1 sits low at inline-start, in Montserrat 200; the eyebrow "I · 6 services" sits above it. The rail sits at inline-start (desktop); the chip bar sits under the header (mobile). |
| **Layers** | L0 `ev-open-hall` (overlay at 70%: dusk) · L3 haze (one radial gradient at 4% alpha) |
| **Motion** | L0 scale 1.00 → 1.02; nothing else moves. The page is still on arrival. |
| **Copy** | H1 **Events & Hospitality** / **الفعاليات والضيافة** · line: "It starts with an empty room." / «كل شيء يبدأ بقاعة فارغة.» |
| **Understands** | This is a company that builds events from nothing. |
| **Transition** | Light wipe: a warm gradient rises from the stage end. |
| **Reduced** | (see the still frame at the end of the act) |

```
┌──────────────────────────────────────────────────────────────┐
│ header                                                        │
│ I  Conf…    ░░░░░░░░░░░░░░░ dark hall ░░░░░░░░░░░░░░░░░░░░░░ │
│ II Exhib…   ░░░░░░░░░░░░░░░░░░░ faint stage ▁▁▁ ░░░░░░░░░░░░ │
│ III …       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ …           I · 6 SERVICES                                    │
│             EVENTS & HOSPITALITY                              │
│             It starts with an empty room.      Skip to services ↓ │
└──────────────────────────────────────────────────────────────┘
```

### Shot 2 · Lights up

| | |
|---|---|
| **Scroll** | Desktop 0.4 → 0.83 vh · mobile: none, merged into shot 3 (D70, approved D72) |
| **Frame** | The stage wash comes up first, then the pendant lights, layer by layer. The far end of the hall reads as a stage. |
| **Layers** | L0 `ev-open-hall` (overlay 70% → 40%) · L3 stage glow (champagne radial at 12%, scale 0.6 → 1) · L3 two light beams (CSS gradients, opacity 0 → 0.5, staggered) |
| **Motion** | Glow scale and opacity; beams opacity; L0 scale 1.02 → 1.04 (push-in begins). |
| **Copy** | None: shot 1's line holds (D74, P1; the line "Light first. Then everything else." was dropped). |
| **Understands** | They handle the production, not only the decoration. |
| **Transition** | Push-in into the room. |

### Shot 3 · The room is dressed

| | |
|---|---|
| **Scroll** | Desktop 0.83 → 1.8 vh · mobile 0.45 → 1.05 vh (lights and dressing in one shot, with this shot's line; D70, approved D72) |
| **Frame** | A long dressed table rises into the midground. Florals drift in from the inline-start edge, candles from the inline-end edge, and crystal glasses pass close to the lens, out of focus. |
| **Layers** | L1 `ev-open-table` (rises 8 vh → 0, opacity 0 → 1) · L2 `ev-open-florals` (from −30% inline, depth 1.2) · L2 `ev-open-candles` (from +30% inline, depth 1.0) · L2 `ev-open-glasses` (desktop only, depth 1.3, passes through the bottom corner) |
| **Motion** | Translate and opacity only; each layer's speed comes from its depth. Inline offsets mirror in AR. |
| **Copy** | "Tables, flowers and candlelight, each in place." / «طاولات وزهور وشموع، كلٌّ في مكانه.» |
| **Understands** | The details are handled: décor, styling, hospitality. |
| **Transition** | The light warms. The champagne glow spreads to fill the frame. |

### Shot 4 · Ready

| | |
|---|---|
| **Scroll** | Desktop 1.8 → 2.0 vh, and the promise stays on screen while the scene scrolls away · mobile 1.05 → 1.2 vh |
| **Frame** | The full room in warm light. Every layer has settled. The H1 remains; the promise line is set larger. |
| **Layers** | All layers at rest · L0 overlay 25% · L3 candle points (6–10 small glows, a slow flicker that stops when the act ends) |
| **Copy** | **"Every detail, ready before the first guest."** / **«كل التفاصيل جاهزة قبل وصول أول ضيف.»** |
| **Understands** | The promise: everything is ready before it matters. |
| **Transition** | Curtain: the scene releases and slides up; section I's light source is already glowing below. |

**Mobile:** three shots. Shot 1 is as above; shot 2 merges lights and dressing (the table and one florals cutout, no glasses); shot 3 is "Ready". It uses 3 image layers.

**Reduced-motion still:** the shot-4 frame (room lit, overlay 25%, all layers in place, no candle flicker). Under the H1 the three lines read as one short paragraph:

> It starts with an empty room. Tables, flowers and candlelight, each in place. Every detail, ready before the first guest.

The Arabic still reads the same way, with its three lines.

**Budget (mobile):** `ev-open-hall` 9:16 ~140 KB + `ev-open-table` ~90 KB + `ev-open-florals` ~70 KB = **~300 KB** (estimate; measured at build). Shot-1 eager: the L0 plate only (~140 KB); the others load as the opening starts to scroll.

---

## Act 2 · Service scenes

Every section follows README §6. Below: the one hero motion, the composite or module, and the reading order. A shared signature (§5.1): **each section has its own small light source**, a champagne glow at the section's inline-start that comes on as the section arrives (GSAP, opacity and scale, once).

| # | Service | Hero motion (one) | Composite / module | Reading order |
|---|---|---|---|---|
| I | Conferences & summits | The section's glow comes on | `agenda-timeline`: the day builds slot by slot | numeral → H2 → promise → deliverables → timeline → CTA |
| II | Exhibitions & booths | The stand's floor plate slides into place | `stand-assembly` (L): the stand assembles; pin ≤ 1 vh, desktop only | numeral → H2 → promise → stand (callouts) → deliverables → CTA |
| III | Product launches & activations | A vertical champagne seam draws down the module (the curtain's edge) | `launch-reveal`: countdown and curtain on demand | H2 → promise → reveal → formats → deliverables → CTA |
| IV | Galas & private celebrations | The candle glow lights the gallery | `candle-moodboard` with real celebration photos | H2 → promise → gallery + board → deliverables → CTA |
| V | **Catering & heritage hospitality** (peak) | **The majlis scene** (below) | Majlis scene, then `menu-majlis` | H2 → promise → scene → menu card → deliverables → CTA |
| VI | Stage & technical production | One spot turns on over the H2 | `stage-lights`: four groups and a cue | H2 → promise → stage → deliverables → CTA |

### The majlis scene (section V; desktop: a 0.6 vh pin with two beats; mobile: not pinned; D74, P2)

| | |
|---|---|
| **Frame** | Dusk over open sand; a lit tent at mid-distance; in the foreground, a brass dallah pours Arabic coffee into a small cup. |
| **Layers** | L0 `ev-majlis-dusk` (AI plate: dusk desert, depth 0.15) · L1 `ev-majlis-tent` (real: the desert tent at night, cut out, depth 0.5) · L3 the tent's bloom (a champagne glow behind the tent, opacity and scale) · L2 `ev-majlis-dallah` (real: brass dallah, cut out, depth 1.0) · L2 `ev-majlis-cup` (real: the coffee service, cup cut out, depth 1.1) · L3 the pour (an SVG stroke from spout to cup, drawn by scroll) · L3 steam (3 soft wisps, opacity only) · L3 dusk gradient |
| **Motion** | **Desktop:** the scene scrolls in at dusk, then pins for 0.6 vh under the header with two beats: the coffee pour (0 → 0.3 vh), then the light blooming in the tent as the sky deepens (0.3 → 0.6 vh). **Mobile:** no pin; GSAP scrubs while the scene crosses the viewport: dusk, the pour from 40% to 70% of the crossing, then night and the bloom. |
| **Copy** | Only the section's H2 and promise sit over the scene's lower third. |
| **Understands** | Heritage hospitality is a real speciality, rooted in the region. |
| **Reduced** | The final composed frame: the pour drawn, the tent lit, the steam static, night sky. |
| **RTL** | The dallah sits at inline-end and pours toward inline-start; the composition mirrors. |
| **Budget** | Lazy (loads one viewport ahead). Mobile ~280 KB: plate 9:16 + tent + dallah; the cup merges into the dallah cutout on mobile. |

---

## Act 3 · Closing

1. **Related work:** hidden until real, client-approved projects exist (OQ #17). The curated private-celebration and catering photos are shown in modules without client names (D49). They are not presented as named projects.
2. **FAQ (the ivory "morning after" band):** the page ground turns to ivory as the band arrives (ToneController). `<details>` items come from the copy deck (Task 3.1).
3. **Final CTA with a bookend:**
   - **Visual:** the opening's hall plate returns at a 21:9 crop with full warm light. It's already cached, so it costs no bytes, and it fades under the CTA band's top edge.
   - **Line:** "Tell us the date. We'll ready the room." / «أخبرنا بالموعد، ونجهّز لك القاعة.»
   - **Below:** the quote block (`#quote`), pre-set to this category; the service comes from `?service`.

---

## Beat sheet

| Beat | Where | Intensity | Note |
|---|---|---|---|
| Arrival | Shot 1 | 1 | Still, dark, the H1 alone |
| Build | Shots 2–3 | 3 → 4 | Lights, then the room dresses itself |
| First peak | Shot 4 | 4 | The promise |
| Calm | I Conferences | 2 | A timeline that builds quietly |
| Build | II Exhibitions | 4 | The stand assembles (the page's only service pin) |
| Build | III Launches | 3 | The visitor triggers the reveal |
| Warm | IV Celebrations | 3 | Real photos, candlelight |
| **Peak** | **V Hospitality (majlis)** | **5** | The page's strongest service: the most real material (7 catering and 5 heritage photos) and the most regional story |
| Calm | VI Stage | 2 | A single spot, then the visitor plays the cues |
| Rest | FAQ, ivory band | 1 | Reading, light ground |
| CTA | Bookend | 3 | The lit room returns: "Tell us the date." |

---

## Open items for this page

- **Copy:** every shot line above is a proposal. The category intro, deliverables and FAQ come with the copy deck (Task 3.1).
- **Photos:** the cutout sources are curated profile photos with no identifiable people (D49, profile-inventory). Their quality grades (A/B/C) limit how large a cutout can show; see layers.md.
