# IV · Production, Print & Gifts: "The Workshop"

**Story in one line:** paper, board and ribbon are measured, cut, printed and folded into a finished gift box.
**Theme:** category-pages.md §5.4: champagne ground with paper grain, cocoa ink, dimension lines that measure real things.
**Prototype order:** third. Animatic: `/[locale]/lab/workshop-animatic`. **Waits on:** OQ #23 (print store) for section V only.
**Conventions:** [README.md](README.md). Layer slots: [layers.md](layers.md) §IV.

---

## Act 1 · Opening (pinned: desktop 2.0 vh, mobile 1.2 vh)

**Shot strip (desktop; owner: GSAP, one scrubbed timeline):**

```
 1 RAW MATERIALS         2 MEASURED, CUT         3 PRINTED, FOLDED       4 THE BOX CLOSES
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│rail  [paper] (rbn)  │ │rail ┌┬──dieline──┬┐ │ │rail   ▓▓ ink pass ▓ │ │rail    ┌─lid─┐      │
│      [ board ]      │ │     ││ 240×160×80 ││ │ │      ╱ fold ╲     │ │ │        ↓     ↓      │
│ IV                  │ │     └┴────────────┴┘ │ │     ▕ open box ▏    │ │      [ box +rbn ]   │
│ PRODUCTION, PRINT … │ │ Measured, then cut. │ │ Printed, then …     │ │ Closed, wrapped, … │
│ Paper, board, …     │ │        EXAMPLE      │ │                     │ │                     │
│              skip ↓ │ │              skip ↓ │ │              skip ↓ │ │              skip ↓ │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
   L0 bench, L2 ×2         L3 dieline, dims        L3 ink, L1 SVG net      L1 base + lid, L2 rbn
```

### Shot 1 · Raw materials

| | |
|---|---|
| **Scroll** | Desktop 0 → 0.45 vh · mobile 0 → 0.35 vh |
| **Frame** | A worktable from above: a stack of paper, a sheet of board, a spool of champagne ribbon. The H1 at inline-start. |
| **Layers** | L0 `pg-open-bench` (worktable plate) · L2 `pg-open-paper` (depth 1.0) · L2 `pg-open-ribbon` (depth 1.2) · L3 paper grain (canvas tile, D45) |
| **Motion** | The cutouts settle a few px with depth; L0 still. |
| **Copy** | H1 **Production, Print & Gifts** / **الإنتاج والطباعة والهدايا** · "Paper, board, ribbon." / «ورق، وكرتون، وشريط.» |
| **Understands** | This is physical work, made from real materials. |
| **Transition** | Match cut: a dieline draws over the board. |

### Shot 2 · Measured, then cut

| | |
|---|---|
| **Scroll** | Desktop 0.45 → 0.95 vh · mobile 0.35 → 0.7 vh (merged with shot 3) |
| **Frame** | Thin cocoa strokes draw a gift box's dieline (its flat cutting pattern) on the board. Dimension lines appear: `240 × 160 × 80 MM` (an example box, labelled "Example"). |
| **Layers** | L3 dieline (SVG stroke by scroll) · L3 dimension lines · L0, L2 as before |
| **Copy** | "Measured, then cut." / «نقيس أولًا، ثم نقصّ.» |
| **Understands** | Precision and planning before production. |
| **Transition** | The cut line runs around the dieline; the waste falls away (opacity). |

### Shot 3 · Printed and folded

| | |
|---|---|
| **Scroll** | Desktop 0.95 → 1.5 vh |
| **Frame** | A champagne ink pass sweeps across the flat net (the print), then the panels fold up into an open box (CSS 3D on the SVG panels). |
| **Layers** | L3 ink sweep (gradient mask) · L1 the box net (SVG, code) |
| **Copy** | "Printed, then folded into shape." / «نطبع، ثم نطوي حتى يكتمل الشكل.» |
| **Understands** | Print and production under one roof. |
| **Transition** | Match cut: the folded SVG box becomes the photographed box. |

### Shot 4 · The box closes

| | |
|---|---|
| **Scroll** | Desktop 1.5 → 2.0 vh · mobile 0.7 → 1.2 vh |
| **Frame** | A finished rigid box in deep espresso. Its lid lowers onto it and a champagne ribbon settles across. |
| **Layers** | L1 `pg-open-box-base` · L1 `pg-open-box-lid` (moves down 12 vh → 0) · L2 ribbon (the ribbon cutout, re-used) |
| **Copy** | **"Closed, wrapped, ready to give."** / **«مغلقة ومغلّفة، وجاهزة للإهداء.»** |
| **Understands** | The finished object, ready for a client. |
| **Transition** | Curtain. |

**Mobile:** three shots (raw materials; dieline, print and fold merged; the box closes). Image layers: plate, box base, lid.

**Reduced still:** the closed box with its ribbon on the bench, the dieline drawn faintly beside it, all lines as a paragraph.

**Budget (mobile):** plate ~140 KB + base ~70 KB + lid ~60 KB = **~270 KB**.

---

## Act 2 · Service scenes

The signature (§5.4): every module measures something. Dimension lines appear only in modules, never in text.

| # | Service | Hero motion (one) | Module | Reading order |
|---|---|---|---|---|
| I | Large-format printing | A dimension line extends to the section's full width | `human-scale` | H2 → promise → scale → deliverables → CTA |
| II | Stand fabrication & signage | Registration marks snap to the module's corners | `build-layers` | H2 → promise → layers → deliverables → CTA |
| III | Packaging design | A crease line draws | `unboxing` | H2 → promise → unboxing → deliverables → CTA |
| IV | **Corporate gifts** (peak) | The opening's box returns, lid lifting | `gift-configurator` | H2 → promise → configurator → deliverables → CTA |
| V | Online print store | The three steps slide in like job tickets | `print-order` | H2 → promise → steps → CTA ("Order your print online") |
| VI | Branded merchandise | The "Your mark" tag drops onto the tote | `merch-placement` | H2 → promise → placement → deliverables → CTA |

## Act 3 · Closing

1. **Related work:** hidden until approved (OQ #17). Gifts and packaging for UAE PL are candidates once approved.
2. **FAQ:** champagne band.
3. **Bookend:** the box from shot 4, lid slightly open. Line: "What should we make for you?" / «ماذا نصنع لك؟» → the quote block.

## Beat sheet

| Beat | Where | Intensity |
|---|---|---|
| Arrival | Shot 1 | 1 |
| Build | Shots 2–3 | 3 |
| First peak | Shot 4 | 4 |
| Calm | I Large-format | 2 |
| Build | II Fabrication, III Packaging | 3 |
| **Peak** | **IV Corporate gifts:** the configurator echoes the opening's box, and the profile shows real gift work (UAE PL gift set, pending OQ #17) | **5** |
| Calm | V Print store, VI Merchandise | 2 |
| CTA | Bookend | 3 |
