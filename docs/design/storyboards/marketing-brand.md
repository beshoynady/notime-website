# III · Marketing & Brand: "The Editorial"

**Story in one line:** a blank ivory page draws its grid, sets its words and images like a magazine spread, and the brand comes alive.
**Theme:** category-pages.md §5.3: ivory ground, espresso type, cocoa rules and folios, champagne highlight band.
**Prototype order:** fourth. Animatic: `/[locale]/lab/editorial-animatic`. **Waits on:** the logo SVG (CONTENT_CHECKLIST #14) for the full mark build.
**Conventions:** [README.md](README.md). Layer slots: [layers.md](layers.md) §III.

---

## Act 1 · Opening (pinned: desktop 2.0 vh, mobile 1.2 vh)

**Shot strip (desktop; owner: GSAP, one scrubbed timeline):**

```
 1 BLANK PAGE            2 THE GRID              3 THE SPREAD            4 ALIVE
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│III / Marketing & Br.│ │III │ │ │ │ │ │ │ │ │ │ │III ┌──image──┐ Hed. │ │III ┌──image──┐ Hed. │
│                     │ │    │ │ │ │ │ │ │ │ │ │ │    │  board  │ ──── │ │    │  board  │▒band▒│
│ MARKETING           │ │ ───┼─┼─┼─┼─┼─┼─┼─┼─ │ │ swatches└────────┘pen│ │                ◐ mark│
│ & BRAND             │ │ First, the grid.    │ │ Then words and …    │ │ And the brand comes…│
│ Every brand starts… │ │                     │ │                     │ │                     │
│              skip ↓ │ │              skip ↓ │ │              skip ↓ │ │              skip ↓ │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
   L0 paper, folio         L3 grid strokes         L1 board, L2 ×2         L3 band, the mark
```

### Shot 1 · A blank page

| | |
|---|---|
| **Scroll** | Desktop 0 → 0.45 vh · mobile 0 → 0.35 vh |
| **Frame** | An ivory page edge to edge, with a folio at the top: "III / Marketing & Brand". The H1 is set huge across the page (static on mobile, D43). |
| **Layers** | L0 `mb-open-paper` (an ivory paper texture, very soft, depth 0.15) · L3 grain |
| **Copy** | H1 **Marketing & Brand** / **التسويق والعلامة التجارية** · "Every brand starts as a blank page." / «كل علامة تبدأ بصفحة بيضاء.» |
| **Understands** | They build brands from the ground up. |
| **Transition** | The grid draws from the folio downward. |

### Shot 2 · The grid

| | |
|---|---|
| **Scroll** | Desktop 0.45 → 0.95 vh · mobile merged with shot 3 |
| **Frame** | 12 thin cocoa column lines draw top to bottom, then two baseline rules. |
| **Layers** | L3 grid (SVG strokes, scroll-drawn) |
| **Copy** | "First, the grid." / «أولًا، الشبكة.» |
| **Understands** | Strategy and structure come before visuals. |
| **Transition** | The cells fill (match cut: empty cells become set blocks). |

### Shot 3 · The spread sets itself

| | |
|---|---|
| **Scroll** | Desktop 0.95 → 1.5 vh · mobile 0.35 → 0.8 vh |
| **Frame** | Headline blocks slide into their columns. A large image drops into a 7-column cell; a paper swatch fan and a brass pen slide in at the edges, out of the grid, as on a real desk. |
| **Layers** | L1 `mb-open-board` (the approved `cat-marketing-brand-4x5` AI image, re-used: no new credits) · L2 `mb-open-swatches` · L2 `mb-open-pen` |
| **Copy** | "Then words and images find their place." / «ثم تجد الكلمات والصور مكانها.» |
| **Understands** | Content, design and layout are one craft. |
| **Transition** | A champagne highlight band sweeps behind the line. |

### Shot 4 · The brand comes alive

| | |
|---|---|
| **Scroll** | Desktop 1.5 → 2.0 vh · mobile 0.8 → 1.2 vh |
| **Frame** | The spread gains colour: the highlight band, NO TIME's own mark settling in a corner (our own brand, so no permission is needed), the folio turning to "III". |
| **Layers** | L3 highlight band · the mark (trimmed PNG until the SVG arrives) |
| **Copy** | **"And the brand comes alive."** / **«وتنبض العلامة بالحياة.»** |
| **Understands** | They make brands that feel alive and consistent. |
| **Transition** | Curtain (a page turn: the spread slides up). |

**Mobile:** three shots (the blank page; the grid and spread merged; alive). Image layers: paper plate, board image.

**Reduced still:** the finished spread with every line as a paragraph.

**Budget (mobile):** paper ~60 KB + board ~110 KB = **~170 KB**.

---

## Act 2 · Service scenes

The signature (§5.3): each section opens like a magazine spread with its own folio. It uses three grid patterns in a fixed rotation (A: image start / text end; B: a full-bleed pull quote; C: three columns).

| # | Service | Hero motion (one) | Module | Grid |
|---|---|---|---|---|
| I | Branding & identity | The construction circle draws | `mark-build` | A |
| II | **Social media management** (peak) | The phone slides up into its column | `phone-feed` | B |
| III | Digital marketing & SEO | The chart axis draws | `example-dashboard` | C |
| IV | Content strategy | The month grid's rules draw | `content-calendar` | A |
| V | Public relations | The headline sets from a line mask (≥ 900px only) | `press-release` | B |
| VI | Media planning | The week columns draw | `flighting-chart` | C |

**Reading order (all):** folio → H2 → promise → module → deliverables → CTA.

## Act 3 · Closing

1. **Related work:** hidden until approved (OQ #17).
   - **Campaign proof (D67), in section II Social:** anonymised by default as "A national sports federation campaign" / «حملة لاتحاد رياضي وطني». It shows the Oregon 26 first-week figures, always with their scope: "first week of the campaign: 487K views · +37.6K new followers · 271K reach" (profile p17). There's no client name, no championship name, no logo and no key visuals.
   - The same `named` flag as the Software case study switches it to the named version (UAE Athletics Federation, World Athletics U20 Championships, Oregon 26) once the client approves.
2. **FAQ.**
3. **Bookend:** the blank page returns with the grid drawn faintly. Line: "Your page is next." / «صفحتك هي التالية.» → the quote block.

## Beat sheet

| Beat | Where | Intensity |
|---|---|---|
| Arrival | Shot 1 | 1 |
| Build | Shots 2–3 | 3 |
| First peak | Shot 4 | 4 |
| Calm | I Branding | 3 |
| **Peak** | **II Social:** the only service with real, scoped figures in the profile (anonymised campaign proof, D67), and the liveliest module | **5** |
| Calm | III–IV | 2 |
| Build | V PR | 3 |
| Calm | VI Media planning | 2 |
| CTA | Bookend | 3 |
