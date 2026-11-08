# II · Creative Production: "The Studio"

**Story in one line:** a black box, a slate, a camera pushing in, and one frame developing into the final image.
**Theme:** category-pages.md §5.2: a night ground, ivory text, taupe technical labels, champagne for the active take; timecode as navigation.
**Prototype order:** fifth. Animatic: `/[locale]/lab/studio-animatic`. **Waits on:** the showreel (CONTENT_CHECKLIST #1), the equipment inventory (OQ #22) and photo consent (OQ #18).
**Conventions:** [README.md](README.md). Layer slots: [layers.md](layers.md) §II.

---

## Act 1 · Opening (pinned: desktop 2.0 vh, mobile 1.2 vh)

**Shot strip (desktop; owner: GSAP, one scrubbed timeline):**

```
 1 BLACK BOX             2 SLATE                 3 PUSH-IN               4 THE FRAME DEVELOPS
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│▀▀▀▀▀▀ letterbox ▀▀▀▀│ │▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀│ │▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀│ │▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀│
│rail      ( pool )   │ │rail ╱╱╱ stick snaps │ │rail   [cam]→ dolly  │ │rail ░▒▓ real photo ▓│
│ CREATIVE PRODUCTION │ │ [ II · CP · TAKE 1 ]│ │                     │ │ Then, the final …   │
│ A black box. …      │ │ Take one.           │ │ Every frame is …    │ │                     │
│TC 00:00:00:00 skip ↓│ │TC 00:00:04:12 skip ↓│ │TC 00:00:09:02 skip ↓│ │TC 00:00:12:04 skip ↓│
│▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄│ │▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄│ │▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄│ │▄▄▄▄▄ (bars open) ▄▄▄│
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
   L0 studio, L3 pool      L2 slate + stick        L1 camera, push         L1 real frame
```

### Shot 1 · Black box

| | |
|---|---|
| **Scroll** | Desktop 0 → 0.45 vh · mobile 0 → 0.35 vh |
| **Frame** | A night-dark studio. One work light makes a soft pool on the floor. The timecode reads `TC 00:00:00:00`. The H1 at inline-start. Letterbox bars frame the shot at 2.39:1. |
| **Layers** | L0 `cp-open-studio` (an empty studio with a seamless backdrop) · L3 work-light pool (radial) · L3 letterbox bars (code) |
| **Copy** | H1 **Creative Production** / **الإنتاج الإبداعي** · "A black box. Nothing in frame yet." / «صندوق أسود، ولا شيء في الكادر بعد.» |
| **Understands** | A studio; everything is about to be made. |
| **Transition** | Cut, with a 120 ms ivory flash line. |

### Shot 2 · Slate

| | |
|---|---|
| **Scroll** | Desktop 0.45 → 0.9 vh · mobile 0.35 → 0.6 vh |
| **Frame** | A clapperboard fills the lower third. Its stick snaps shut (rotation). The slate's text is HTML over a blank board: "II · Creative Production · Take 1". |
| **Layers** | L2 `cp-open-slate` (a blank slate, cut out; the stick is a separate layer, `cp-open-slate-stick`) |
| **Copy** | "Take one." / «اللقطة الأولى.» |
| **Understands** | They shoot: production is in-house. |
| **Transition** | Cut. |

### Shot 3 · Push-in

| | |
|---|---|
| **Scroll** | Desktop 0.9 → 1.45 vh · mobile 0.6 → 0.9 vh |
| **Frame** | A camera on a dolly in the midground pushes toward the backdrop. The timecode runs with scroll. |
| **Layers** | L1 `cp-open-camera` (a camera on a dolly, cut out; depth 0.6, scale 1.0 → 1.25) · L0 scale 1.0 → 1.06 |
| **Copy** | "Every frame is planned before we roll." / «نخطّط لكل كادر قبل أن ندوّر الكاميرا.» |
| **Understands** | Pre-production discipline. |
| **Transition** | Match cut: the camera's frame lines become the edges of the final frame. |

### Shot 4 · The frame develops

| | |
|---|---|
| **Scroll** | Desktop 1.45 → 2.0 vh · mobile 0.9 → 1.2 vh |
| **Frame** | One real photograph develops in the letterbox, from a dark amber state to the final grade (an overlay fades: opacity only, no filter on the image). |
| **Layers** | L1 `cp-open-frame` = the real `catering-4` (profile p25, Photography: dessert boards, food styling) |
| **Copy** | **"Then, the final frame."** / **«ثم يأتي الكادر الأخير.»** |
| **Understands** | Real output: this is their photography. |
| **Transition** | The letterbox bars open to full frame, then the curtain. |

**Mobile:** three shots (black box; slate; the frame develops). The push-in is dropped. Image layers: plate, slate, frame.

**Reduced still:** the developed frame in open letterbox, the timecode static, all lines as a paragraph.

**Budget (mobile):** plate ~120 KB + slate ~50 KB + frame ~110 KB = **~280 KB**.

**Honesty:**
- Only one frame develops, and it's a photo the profile places under Photography.
- No AI image is presented as NO TIME's shoot.

---

## Act 2 · Service scenes

The signature (§5.2): each eyebrow is its timecode in (`TC 00:01:00:00` …), and the rail reads like an edit decision list.

| # | Service | Hero motion (one) | Module |
|---|---|---|---|
| I | Photography | The aperture blades open | `aperture-gallery` |
| II | Video production | A film-edge strip runs past once | `scrub-reel` (placeholder until the showreel arrives; never stock or AI) |
| III | Motion graphics | The title card's easing curve draws | `motion-playground` |
| IV | **AI content creation** (peak) | The brief's text types in, then the slider handle appears | `idea-to-image` |
| V | Set & stage design | A pencil line draws the set | `set-model` |
| VI | Equipment & camera rental | The four category cards cut in | `rental-categories` |

**Reading order (all):** timecode eyebrow → H2 → promise → module → deliverables → CTA.

## Act 3 · Closing

1. **Related work:** hidden until approved (OQ #17). The Oregon 26 key visuals (p14) are candidates once rights clear.
2. **FAQ.**
3. **Bookend:** the slate returns, marked "Take 2". Line: "Your take one starts here." / «لقطتك الأولى تبدأ من هنا.» → the quote block.

## Beat sheet

| Beat | Where | Intensity |
|---|---|---|
| Arrival | Shot 1 | 1 |
| Build | Shots 2–3 | 3 → 4 |
| First peak | Shot 4 | 4 |
| Calm | I Photography | 2 |
| Build | II Video, III Motion | 3 |
| **Peak** | **IV AI content creation:** NO TIME's AI production is real (profile p14, p17), and the before/after slider is the most distinctive module | **5** |
| Calm | V Set design, VI Rental | 2 |
| CTA | Bookend | 3 |
