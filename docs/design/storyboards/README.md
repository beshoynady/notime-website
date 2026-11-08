# Category storyboards: shared conventions

**Status:** draft for the user's review (stop point 1), 2026-11-08. Decisions: DECISIONS D64 (cinematic pages), D65 (Software & Digital), D66 (forms).

One storyboard per category, written like a film script, plus [layers.md](layers.md), the layer and image plan. The themes in [category-pages.md](../category-pages.md) §5 still apply: these storyboards set the story and the timing. The module specs in §6 are unchanged unless a storyboard says so.

| Category | Storyboard | Theme | Prototype order |
|---|---|---|---|
| I Events & Hospitality | [events-hospitality.md](events-hospitality.md) | The Evening | 1st (CP7) |
| V Software & Digital | [software-digital.md](software-digital.md) | The Interface | 2nd (CP8) |
| IV Production, Print & Gifts | [production-print-gifts.md](production-print-gifts.md) | The Workshop | 3rd |
| III Marketing & Brand | [marketing-brand.md](marketing-brand.md) | The Editorial | 4th |
| II Creative Production | [creative-production.md](creative-production.md) | The Studio | 5th (waits on the showreel and photos) |

---

## 1. The page in three acts

```
ACT 1  OPENING      3–4 shots, pinned. Desktop ≤ 2.0 vh of scroll, mobile ≤ 1.2 vh.
ACT 2  SERVICES     six service scenes, plain scroll (a module may pin ≤ 1 vh, desktop only).
ACT 3  CLOSING      related work (real only) → FAQ → final CTA with a bookend line.
```

**vh** in this folder means one viewport height of scroll distance. "Pinned 2.0 vh" means the scene stays in place while the visitor scrolls two screens' worth, and the shots play against that scroll (GSAP scrub). The scroll is never hijacked: the page moves only as fast as the visitor scrolls, and scrolling back plays the film backwards.

## 2. Always on, from the first frame

- **Service index:**
  - **Desktop:** the rail sits at inline-start over the opening, on a scrim tuned to the theme, and stays sticky down the page (Task 2.3's rail, now visible from the first frame).
  - **Mobile:** the chip bar sits under the header from the first frame.
  - Choosing a service lands on it through the anchor utility (D53) and leaves the opening in its end state.
- **"Skip to services" / «انتقل إلى الخدمات»:**
  - A quiet text button with a down arrow at the opening's bottom, at inline-end.
  - In the DOM it comes right after the H1, so it's the first stop for keyboard users after the header.
  - It lands on the first service's H2.
  - It hides once the opening has scrolled past.
- **H1:**
  - It's the category title, set in text, visible in the first paint, and the page's LCP element.
  - On mobile it never moves, masks or splits (D43). On desktop it may rise from a line mask at load, as on the homepage.
- **Shot copy:**
  - All shot lines are in the DOM from the start, as one `<p>` per shot inside the opening, in reading order. Screen readers read them as a short paragraph.
  - Visually, one line shows at a time.

## 3. Layers

| Level | What | Built from | Motion range (over the whole opening) |
|---|---|---|---|
| **L0** plate | the space: soft, wide, low detail | one image, 16:9 desktop / 9:16 mobile | depth 0.15: drifts ~2 vh, push 0.06 (scale 1.00 → 1.06) |
| **L1** midground | the main subject | one or two images (cutouts or crops) | depth 0.5: ~7 vh, push 0.10 |
| **L2** foreground | cutouts with alpha | 1–3 images | depth 1.0–1.3: 14–18 vh, may enter from outside the frame |
| **L3** atmosphere | light, haze, particles, grain, lines | code only: CSS gradients, SVG, the canvas grain (D45) | opacity and scale; never `filter: blur` on large areas |

- **Depth** is a single number per layer. `<LayeredScene>` turns it into vertical drift over the scene's progress (y = −depth × 14 vh × progress), with a per-layer `push` for scale (pure function, unit-tested: `layerTransform`). Horizontal drift multiplies by `dir` (1 in EN, −1 in AR), so parallax mirrors in Arabic. Vertical drift doesn't mirror.
- **Moving properties:** only transform and opacity on image layers. L3 glows animate opacity and scale.
- **Budget per opening:** ≤ 5 image layers, ≤ ~600 KB on mobile. Shot-1 layers load eagerly only when they fit the budget; later shots load on approach. Each storyboard reports its estimate; the build reports the measured weight.
- **Colour unity:** one grade per scene, baked into every layer's file at export (`scripts/grade.mjs`, a sharp colour matrix), so real and AI layers match with no runtime filter.

## 4. Motion grammar

| Transition | What it is | Use |
|---|---|---|
| **Cut** | the next shot replaces this one within 1 frame; an ivory flash line ≤ 120 ms | The Studio |
| **Match cut** | a shape in shot A becomes a shape in shot B (a cursor becomes a caret, a dieline becomes a box) | The Workshop, The Interface |
| **Push-in** | L1 and L2 scale up faster than L0, as if the camera moves forward | all |
| **Light wipe** | an L3 gradient sweeps across and leaves the next shot lit | The Evening |
| **Curtain** | the pinned scene releases and slides up as Act 2 scrolls in; the index stays | end of every opening |

- **Owners:** GSAP owns the opening, the section entrances and every scroll-driven piece. Motion owns direct interaction inside modules. Never both on one element (CLAUDE.md).
- **Section entrance:** one hero motion at most, then a stagger of the H2 → promise → deliverables → CTA (80 ms apart, the theme's reveal duration). It plays once, on entry.
- **Reduced motion:** the opening is one composed still (the end frame of the last shot, with the H1 and every shot line visible as a short paragraph). No pin. The index and skip control work the same. Each service section shows its final state.
- **Off-screen:** any loop (a cursor blink, a glow flicker, particles) stops off-screen and on a hidden tab. Anything that would move longer than 5 s gets a pause control (none is planned).

## 5. Rhythm

Each storyboard has a beat sheet with intensity from 1 (calm) to 5 (peak), following the user's curve: calm → build → peak → calm → CTA. The peak goes on the category's strongest service: the one with the most real evidence or the most distinctive module. The service order (I–VI) stays as approved (D56). The rhythm comes from choreography, not from reordering.

## 6. Every service section contains

1. A numeral and an **H2** (the service title).
2. **One-line promise:** the approved summary, tightened to one line.
3. **Deliverables:** 4–6 concrete points (Software & Digital: 3, D65).
4. **The signature module** (category-pages.md §6), in its reserved box (Task 2.4).
5. **Related work:** real, client-approved work only. The row is hidden while there is none (OQ #17).
6. **Quote CTA,** pre-filled with this service (`?service=<anchor>#quote`). Software & Digital uses the consultation CTA (D65).

## 7. Copy rules

- Shot copy is at most about 8 words per shot, written in English first, then natively in Arabic (not translated word for word).
- No invented clients, figures, outlets or equipment. Demo content is labelled "Example" / «مثال».
- Banned in Software & Digital copy (user): "cutting-edge", "innovative solutions", "digital transformation". The same goes for every page.
- Every shot line in these storyboards is a proposal for the user's review. It goes into the copy deck of its category (Task 3.1 and the equivalents) once approved.
