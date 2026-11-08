# Category pages: design spec

**Status:** for approval (2026-11-08). Docs only; no product code until approved.
**Decision:** DECISIONS D57. Five designed category pages replace the one-template-per-service plan. Each service is a section on its category page, with one signature module.
**Plan:** [docs/plans/phase-2-services.md](../plans/phase-2-services.md) · **Services:** [docs/content/services-list.md](../content/services-list.md) (approved, D56) · **Images:** [docs/content/image-prompts.md](../content/image-prompts.md), section "Category pages (D57)".

Contents:

1. [Rules every page and module follows](#1-rules-every-page-and-module-follows)
2. [Routes, anchors, navigation](#2-routes-anchors-navigation)
3. [Data model](#3-data-model)
4. [Page skeleton (shared)](#4-page-skeleton-shared)
5. [The five themes](#5-the-five-themes)
6. [Service → module mapping (all 30)](#6-service--module-mapping-all-30)
7. [Effort, build order, performance risks](#7-effort-build-order-performance-risks)
8. [SEO](#8-seo)
9. [Open items](#9-open-items)

---

## 1. Rules every page and module follows

These come from CLAUDE.md and the user's brief (2026-11-07). The module specs below assume them and do not repeat them.

- **Honest content.**
  - No invented figures, clients, results, outlets or testimonials.
  - Demo data is visibly labelled **"Example" / «مثال»**.
  - An AI image that stands in for a real project is labelled **"Illustrative" / «صورة توضيحية»**.
  - An image from the AI content service itself is labelled **"AI-generated example" / «مثال مولَّد بالذكاء الاصطناعي»**.
  - No pricing anywhere, including demo stores and catalogues.
- **One motion owner per element.**
  - GSAP (ScrollTrigger) for scroll-driven modules.
  - Motion for direct interaction (click, tap, drag, hover, layout).
  - A module that needs both gets two layers (wrapper and inner), one library each.
- **Reduced motion.** Every module has a static, complete fallback that still explains the service: the final state, all items visible, nothing moving. Interactive controls that don't depend on motion (filters, toggles, sliders) keep working under reduced motion. Only movement is removed.
- **Mobile and touch.** Cursor-driven demos become scroll-driven or tap-driven. Nothing relies on hover alone.
- **RTL.**
  - Timelines, sliders, flows, carousels and before/after splits mirror: "start" is inline-start.
  - Western digits everywhere (D50).
  - Directional icons flip.
- **Accessibility.**
  - Keyboard operable, with a visible focus state.
  - Every state change is announced in one `aria-live="polite"` region per module.
  - Anything that moves on its own for more than 5 seconds (feed scroll, running timecode, pattern loops) has a pause button, and stops on focus or under reduced motion (WCAG 2.2.2).
  - Drag always has a button or keyboard alternative (WCAG 2.5.7).
  - Range sliders are native `<input type="range">` with `aria-valuetext`.
  - Charts carry a text summary and a table alternative.
  - Touch targets are at least 44 × 44 px.
- **Performance.**
  - Each module is its own client component, loaded with `next/dynamic` when its section comes within about one viewport.
  - Until then, the server-rendered static fallback is shown. It is the reduced-motion state, so there is no layout shift when the module mounts: the module reserves the same box.
  - Loops and tickers pause off-screen (ScrollTrigger `onToggle` or IntersectionObserver) and when the tab is hidden.
  - Nothing heavy above the fold.
  - No new animation, chart or 3D library: SVG, CSS, GSAP and Motion only (both are already in the bundle).
  - Target: Lighthouse mobile 90+ in every category, the same as the homepage.
- **Strings** live in `src/messages/{en,ar}.json` (UI) or the localized fields of `src/content/` (service content). Arabic is written natively.

Source for the accessibility and motion rules: the `ui-ux-pro-max` skill's built-in quick reference (`reduced-motion`, `auto-rotation-controls`, `dragging-alternative`, `focus-not-obscured`, `excessive-motion`, `interruptible`, `layout-shift-avoid`, `data-table`, `screen-reader-summary`). Its search database could not run on this machine (no Python interpreter), so no database matches were used.

---

## 2. Routes, anchors, navigation

| Route | What it is |
|---|---|
| `/[locale]/services` | Overview: the five categories with all 30 services, each linking to its category page and anchor. |
| `/[locale]/services/[category]` | One designed page per category. Slugs: `events-hospitality`, `creative-production`, `marketing-brand`, `production-print-gifts`, `software-digital`. Built with `generateStaticParams` (5 × 2 locales), fully static. |
| `/[locale]/services/[category]#<anchor>` | A service section. Anchors are short, stable and identical in EN and AR (listed in `services-list.md`), e.g. `/en/services/events-hospitality#conferences`. |

**Arriving at an anchor** uses the anchor utility built after CP6 (D53). It handles in-page links, menu links, deep links and cross-page links with Lenis, offset under the header, and moves focus to the section's H2. Category pages add one requirement: on mobile, the sticky chip bar sits under the header, so the landing offset becomes header plus chip bar. The utility will measure every element marked `data-anchor-offset` (header and chip bar), not the header alone (plan task 2.3).

**Navigation changes:**

- **Mega menu:**
  - Category titles and "View category" link to `/services/<category>`.
  - Each service links to `/services/<category>#<anchor>`.
  - "All 30 services" links to `/services`.
- **Mobile menu:** the same links. The category summary row gets a "View category" link inside each accordion.
- **Homepage category cards:** each links to its category page. "See all services" links to `/services`.
- **Hero CTA "Explore our services":** stays on `/#services` (the homepage section), which lands precisely (D53).
- **Quote buttons** pass the service: `?service=<anchor>` (e.g. `/en/services/events-hospitality?service=conferences#quote`).
  - **On the same page,** the click is handled in place: `history.replaceState` updates the query, the form's service field is set, and the anchor utility scrolls to `#quote`. No navigation, and the page stays static.
  - **From another page,** a normal navigation happens. The form reads `?service` on mount (a client island under Suspense, so the page stays static), and the anchor utility lands on `#quote`. Its effect re-runs when the search params change.
- **Breadcrumbs** on category pages: Home › Services › Category.

**Standalone service pages later (not built):** the user plans standalone SEO pages for the services people search for most. Candidates (D57, extended in D71): event management, exhibition stand design, exhibition stand contractor, corporate gifts Dubai, roll-up banner printing, Google Ads / Meta Ads, SEO; and for Software & Digital, the four in its storyboard (website development Dubai, mobile app development UAE, event registration system, bilingual Arabic English website). The data model allows them without changing components:

- The service `slug` stays the permanent id and the future path (`/services/<category>/<slug>`, or a keyword path).
- A future `src/content/landings.ts` would map a search intent to one or more services, e.g. "exhibition stand design" → `exhibitions-booths` + `stand-fabrication-signage`.
- When a standalone page exists, the category section links to it ("Full guide") and keeps its anchor. The category page stays canonical for the section, and the standalone page for its own URL, so there is no duplicate content.

---

## 3. Data model

These types extend `src/content/types.ts` (typed, CMS-ready: a later Sanity migration swaps the data source, not the components).

```ts
type CategoryTheme = "evening" | "studio" | "editorial" | "workshop" | "interface";

interface Category {
  // existing: slug, order, title, summary, image (4:5), imageWide (16:9, the page hero)
  theme: CategoryTheme;
  /** Page intro under the H1 (2–3 sentences). */
  intro: Localized<string>;
  /** FAQPage content: 4–6 per category. Answers state process, never numbers we can't stand behind. */
  faq: { q: Localized<string>; a: Localized<string> }[];
}

type ModuleKey =
  | "agenda-timeline" | "stand-assembly" | "launch-reveal" | "candle-moodboard" | "menu-majlis" | "stage-lights"
  | "aperture-gallery" | "scrub-reel" | "motion-playground" | "idea-to-image" | "set-model" | "rental-categories"
  | "mark-build" | "phone-feed" | "example-dashboard" | "content-calendar" | "press-release" | "campaign-funnel"
  | "human-scale" | "build-layers" | "unboxing" | "gift-configurator" | "print-order" | "merch-placement"
  | "responsive-frames" | "app-screens" | "data-flow" | "checkout-flow" | "fidelity-slider" | "ai-sorter";

type QuoteType = "event" | "production" | "marketing" | "print" | "digital"; // drives the form's field set

interface Service {
  // existing: slug (permanent id, future standalone path), category, order, title, summary, image, imageAlt, status
  /** Section id on the category page; same in EN and AR. Unique site-wide. */
  anchor: string;
  signatureModule: ModuleKey;
  /** "What we deliver": 4–6 points. */
  points: Localized<string[]>;
  /** Slugs of real work items (from the future src/content/work.ts). Empty until the client confirms (OQ #17). */
  relatedWork: string[];
  quoteType: QuoteType;
}
```

Module data (agenda rows, catalogue items, feed posts, dashboard series) lives with the module, in `src/content/modules/<key>.ts`, localized, with `example: true` on any demo data so the "Example" label is rendered from data and can't be forgotten. A unit test enforces that every module data file with demo data sets the flag.

Tests to add:

- anchors unique and kebab-case;
- 4–6 points per service in both locales, same count;
- every `signatureModule` registered;
- every `relatedWork` slug resolves;
- FAQ count 4–6 per category;
- module demo data flagged.

---

## 4. Page skeleton (shared)

Every category page has the same six parts. Themes change the look and the motion, not the structure.

```
┌ header (fixed, tone from the theme) ─────────────────────────────────────────┐
│ 1  HERO        eyebrow "II · Creative Production" · H1 · intro · hero image  │
│                (imageWide) · breadcrumbs                                      │
├───────────────┬──────────────────────────────────────────────────────────────┤
│ 2  INDEX      │ 3  SERVICE SECTIONS (×6)                                     │
│   (sticky     │   ┌ section#conferences ───────────────────────────────────┐ │
│    rail,      │   │ numeral I · H2 · intro (summary + 1 line)              │ │
│    desktop)   │   │ "What we deliver": 4–6 points                          │ │
│   I   Conf…   │   │ SIGNATURE MODULE (reserved box, static fallback)       │ │
│   II  Exhib…  │   │ Related work (real only; hidden while empty)           │ │
│   III Launch… │   │ Quote CTA → ?service=conferences#quote                 │ │
│   …           │   └────────────────────────────────────────────────────────┘ │
├───────────────┴──────────────────────────────────────────────────────────────┤
│ 4  RELATED WORK (category level; real only; AI images labelled Illustrative) │
│ 5  FAQ (accordion; FAQPage JSON-LD)                                          │
│ 6  CTA + QUOTE FORM #quote (pre-set to the category; service from ?service)  │
└ footer ──────────────────────────────────────────────────────────────────────┘
```

**Mobile (< 900px):**

```
header
chip bar (sticky under the header, scrolls sideways inside itself):
 [ I Conferences ][ II Exhibitions ][ III Launches ] →
hero, then sections stacked; the module sits full-bleed inside its section
```

**Service index:**

- **Desktop:** a side rail in the inline-start column (the left in EN, the right in AR). It is sticky at `top: header + 24px` and lists numerals I–VI with short titles.
- **Mobile:** a chip bar under the header, scrolling sideways inside itself (never the page).
- **Scrollspy:** ScrollTrigger computes the active section, using the same numeric zones as ToneController (D41). Motion animates the active indicator (a `layoutId` underline or bar). One library each: ScrollTrigger holds state only, Motion moves the indicator. On mobile, the active chip is brought into view with `container.scrollTo`, never `scrollIntoView`, so the page doesn't jump.
- **Links** are plain anchor links, so the anchor utility handles them (D53).
- **Markup:** `<nav aria-label="Services in this category">`; the active link carries `aria-current="location"`.
- **Reduced motion:** the indicator snaps.
- **RTL:** numerals keep their order; the rail and the chip scroll mirror.

**Sections:**

- **Parts:** an H2 (the service title), then the intro: the approved summary plus one line of context.
- **"What we deliver":** a `<ul>` of 4–6 points.
- **Module region:** `role="group"` labelled by the H2.
- **Related work:** a related-work row.
- **Quote:** a ButtonLink to the quote form for this service.
- **Spacing:** sections sit about 1.2 viewports apart on desktop, so a module has room to scrub without pinning the whole page. **No section pins for longer than 1 viewport.**

**Related work** shows only real, client-approved projects (OQ #17).

- While none is approved, the row and the category-level block are hidden, not faked.
- An AI image that stands in for a real project carries the "Illustrative" label (from the image slot data).

**FAQ** uses `<details>`/`<summary>` (it works without JS), with answers written from the profile and the process copy. Where an answer needs a fact only the client has, it is a `TODO:` key in CONTENT_CHECKLIST, not a guess.

**CTA and quote form** (`#quote`) are pre-set to the category, with the service from `?service`. The form pipeline (Server Actions, Resend, Turnstile; brief §9) is its own task. Until it ships, this block shows the WhatsApp and email fallback from `src/config/contact.ts`. Those contact details are still missing from the client, so they show as placeholders.

---

## 5. The five themes

Each theme uses only the brand palette (espresso `#2E2017`, cocoa `#634731`, taupe `#BB9A79`, champagne `#EAD4AB`, ivory `#F5E9D3`, plus the existing `--color-night #0D0805`) and the brand faces (Montserrat EN, Alexandria AR). No new typefaces: the themes differ in weight, scale, spacing, structure and motion.

Themes are CSS custom properties on `<main data-theme="…">` (`--theme-ground`, `--theme-ink`, `--theme-accent`, `--theme-line`, motion duration tokens), plus `data-tone` on sections so ToneController keeps the header readable.

Each theme takes one deliberate risk, named below. Everything around it stays quiet.

### 5.1 Events & Hospitality: "The Evening"

| | |
|---|---|
| **Ground and ink** | Espresso ground (`#2E2017`), deepening to night at the page edges; ivory text; champagne for keys and numerals; light as champagne radial glows at 8–14% alpha. `data-tone="dark"` throughout, ending on an ivory FAQ/CTA "morning after" band. |
| **Type** | Montserrat 200 for display (large, airy, like candlelit signage), 500 for keys. Eyebrows tracked 0.24em. Arabic: Alexandria 300 display, 500 keys, line-height 1.5. |
| **Layout** | Wide frames: images at 21:9 crops, generous margins, one column of text at 52ch. |
| **Motion** | Slow: reveals 1.2–1.6s, `expo.out`. Light blooms (glow opacity and scale, never filter blur on large areas). Timelines that build. |
| **Hero** | The real hall photo (`cat-events-hospitality-16x9`, D49) starts at dusk (dark overlay at 70%). As the visitor scrolls the first 60vh, the "lights come up": the overlay falls to 25% and a warm glow blooms from the stage area (GSAP scrub, transform and opacity only). The H1 is set in Montserrat 200: "Events & Hospitality". Reduced motion: lights already up. |
| **Signature (risk)** | The whole page is lit like a room: each service section has its own small light source (a glow) that comes on as the section arrives, and the index rail's active numeral is a lit candle point. The risk is a page that is mostly dark; the FAQ and form end in ivory, so reading-heavy parts stay light. |
| **Index** | Rail numerals in champagne; the active item gets a 6px glowing dot (Motion). |

### 5.2 Creative Production: "The Studio"

| | |
|---|---|
| **Ground and ink** | Black-box studio: night (`#0D0805`) ground, ivory text, taupe for technical labels, champagne only for the active take. `data-tone="dark"`. |
| **Type** | Montserrat 300 for display; captions and technical labels in uppercase 0.66rem, tracked 0.2em, with tabular numerals (timecode `TC 00:00:12:04`, lens `50MM`, `F/2.0`). Arabic captions: Alexandria 400; technical values stay Latin and Western digits. |
| **Layout** | Every image sits in a frame with corner registration marks; section dividers are a film-edge strip (CSS repeating gradient, perforations); images are letterboxed to 2.39:1. |
| **Motion** | Cuts: content swaps in one frame (no crossfade) with a 120ms ivory flash line. Focus pulls: a small element goes from soft to sharp (blur on that element only, at most 400px wide). Scrub frames. |
| **Hero** | A 2.39:1 letterboxed frame of the creative production 16:9 image (real photo, D49), with a running timecode in the corner and a slate line: "II · Creative Production · Take 1". On scroll the letterbox bars open to full frame (scale on the bars, GSAP). The timecode pauses off-screen and has a pause button. Reduced motion: open frame, static timecode. |
| **Signature (risk)** | Timecode as navigation: each section's eyebrow is its timecode in (`TC 00:01:00:00`, `TC 00:02:00:00` …), and the index rail reads like an edit decision list. The risk is that it reads as gimmick; it stays restricted to eyebrows and the rail. |
| **Index** | An edit decision list: the numeral, the take title and the timecode; the active row is highlighted like a selected clip. |

### 5.3 Marketing & Brand: "The Editorial"

| | |
|---|---|
| **Ground and ink** | Ivory ground (`#F5E9D3`), espresso text, cocoa rules and folios, a champagne highlight band behind pull quotes. `data-tone="light"`. |
| **Type** | Type-led: headings at large scale with weight contrast (Montserrat 800 key against 300 lead, the established lead/key split), pull quotes at 2.4rem / 300, folio numbers like a magazine ("19 / Marketing & Brand"). Arabic: Alexandria 700/300 contrast, generous leading. |
| **Layout** | A 12-column magazine grid where each section breaks it differently (image left/text right, then a full-bleed pull quote, then three columns). Not dense columns and hairlines everywhere: large photography and white space carry it. |
| **Motion** | Type-led reveals (line masks; SplitText only at ≥ 900px, as on the homepage, D43/D44). Layout shifts (Motion `layout`) when a module changes state. Counters only for real figures: "6 markets", "360°" (profile). |
| **Hero** | A masthead: the H1 "Marketing & Brand" set huge across the grid, an issue line ("Issue III", the category numeral), and the 16:9 image (`cat-marketing-brand-16x9`, AI, labelled Illustrative if it stands in for a project) placed off-grid under it. The H1 lines rise from masks on desktop; on mobile the H1 is static from first paint (the LCP rule, D43). |
| **Signature (risk)** | Each service section opens like a magazine spread with its own folio and a different grid break; the risk is inconsistency, so the six spreads use only three grid patterns, in a fixed rotation. |
| **Index** | A table of contents: folio number, then title, with dotted leaders on desktop. The active entry is set in bold. |

### 5.4 Production, Print & Gifts: "The Workshop"

| | |
|---|---|
| **Ground and ink** | Champagne ground (`#EAD4AB`) with a paper grain (a 128px tile, as in the hero grain, D45), cocoa ink, espresso for headings, taupe for technical lines. `data-tone="light"`. |
| **Type** | Montserrat 600 for headings (a printer's sturdy weight); measurements and specs in tabular numerals, e.g. `3000 × 2400 MM`, `350 GSM`. Arabic: Alexandria 600; measurements stay in Western digits. |
| **Layout** | Print structure as true structural devices: crop marks at image corners, registration targets on section dividers, dimension lines that measure real things in the modules (a banner's height, a box's size). |
| **Motion** | Assembly: parts slide or fold into place (transform only). Unboxing. Scale changes. Tactile easing (`power3.out`, shorter: 0.6–0.9s). |
| **Hero** | The print & gifts 16:9 image (real photo, D49) with a dieline (the flat cutting pattern of a gift box) drawing itself over it in thin cocoa strokes (SVG stroke, GSAP), then the box folds into an isometric box beside the H1. Reduced motion: the folded box, the dieline drawn. |
| **Signature (risk)** | Every module measures something: dimension lines with real units appear in each section (banner size, box size, merchandise print area). The risk is clutter; dimension lines are drawn only in modules, never in text. |
| **Index** | A job ticket: numbered tabs with a cut edge (CSS clip-path); the active tab is pulled forward. |

### 5.5 Software & Digital: "The Interface"

| | |
|---|---|
| **Ground and ink** | Ivory ground with a subtle 8px grid (taupe lines at 10% alpha), espresso device frames, champagne for active UI states, cocoa for secondary text. `data-tone="light"`. |
| **Type** | Montserrat 500 for headings, UI labels at 0.78rem / 500 like a product interface, state names in small caps tracked 0.12em (`DEFAULT · HOVER · ACTIVE`). Arabic: Alexandria 500; each UI demo also runs in Arabic, mirrored. |
| **Layout** | Device frames (laptop, phone) drawn in CSS. Every UI inside is real HTML, not a screenshot, so it is crisp, accessible and translatable. |
| **Motion** | UI state changes (Motion). Flows that draw (SVG stroke, GSAP). Cursor-driven demos on desktop (a demo cursor or the visitor's pointer); on touch they become tap-driven or scroll-driven. |
| **Hero** | A laptop and phone pair showing a bilingual site that mirrors when the visitor toggles EN ⇄ AR inside the frame (Motion `layout`). It shows the RTL skill in one gesture. The H1 sits beside it. Reduced motion: the toggle switches instantly. The page's own language toggle is separate and unchanged. |
| **Signature (risk)** | The page works like an interface: each section's module has visible state labels, and the visitor's actions change them. The risk is that it feels like a product page; the product cards (QR check-in, restaurant system, "Coming soon") are kept out of the modules so demos are never mistaken for products. |
| **Index** | A segmented control or tab bar, with the active segment filled in champagne. |

---

## 6. Service → module mapping (all 30)

Format per module:

- **Shows:** what it shows.
- **Interaction:** what the visitor does.
- **Owner:** motion owner.
- **Reduced:** the reduced-motion fallback.
- **Data:** the data needed.
- **Content:** real vs example.
- **Effort:** S (≤ 0.5 day), M (1–2 days), L (3+ days).
- ⚠ marks a performance risk (see §7).

### I. Events & Hospitality ("The Evening")

**1. Conferences & summits** · `#conferences` · `agenda-timeline` · M
- **Shows:** a day's agenda (registration, keynote, panels, breaks, close) as a vertical timeline that builds as the visitor scrolls, each slot lighting up as it reaches the line.
- **Owner:** GSAP scrub; no pin.
- **Reduced:** the full agenda, all slots lit.
- **Data:** 6–8 slots with times and labels. **Content:** "Example", a typical day, no real event named.

**2. Exhibitions & booths** · `#exhibitions` · `stand-assembly` · L ⚠
- **Shows:** an isometric SVG stand that assembles in layers as the visitor scrolls: floor, walls, counter, lighting, graphics and screen.
- **Owner:** GSAP scrub; a short pin of at most 1 viewport on desktop, none on mobile, where the layers simply stack in view.
- **Reduced:** the assembled stand with numbered callouts.
- **Data:** about 6 SVG layer groups and callout labels. **Content:** a generic stand (no client branding), labelled "Example".

**3. Product launches & brand activations** · `#launches` · `launch-reveal` · M
- **Shows:** a "Start the reveal" button runs a 5-second countdown (5 → 0) and opens a curtain on a product plinth (an AI image, labelled "AI-generated example"), plus three activation formats (mall, venue, exhibition) as chips the visitor can switch.
- **Owner:** Motion (user-triggered); the countdown is announced in `aria-live` at the start and end only.
- **Reduced:** the curtain is open, with no countdown.
- **Data:** 1 image and the 3 formats. **Content:** "Example". No real product, and no real date to count to.

**4. Galas & private celebrations** · `#celebrations` · `candle-moodboard` · M ⚠
- **Shows:** a candlelit gallery of real private-celebration photos (shown without client names, D49) beside a mood board: a palette, a florals note and a keepsake. The visitor switches between 3 moods (Gala, Wedding, Intimate), and the board re-flows.
- **Owner:** Motion `layout` for the board; a GSAP glow on entry.
- **Reduced:** the first mood, static.
- **Data:** 3 moods × (3 swatches from the brand palette, 2–3 photos, a 1-line note). **Content:** the photos are real; the moods are labelled "Example".

**5. Catering & heritage hospitality** · `#hospitality` · `menu-majlis` · M
- **Shows:** a menu-style layout (as a printed menu card): catering, signature desserts and drinks, majlis and tent setups, Arabic coffee service, framed by a Sadu-inspired geometric border and a dallah (coffee pot) line drawing that draws in.
- **Owner:** GSAP (stroke draw on scroll entry); no loop.
- **Reduced:** drawn.
- **Data:** the menu sections and items from the profile's catering pages. **Content:** real offering, with no prices (a menu with no price column). The ornament is original geometry, not a copy of a specific Sadu piece.

**6. Stage & technical production** · `#stage` · `stage-lights` · M
- **Shows:** a stage drawn in SVG with 4 light groups (wash, spots, back light, screen). The visitor toggles each group, and a "Show" button runs a 4-step cue sequence.
- **Owner:** Motion (toggles, cue sequence).
- **Reduced:** toggles still work, with instant on/off and no fades.
- **Live region:** "Spots on, 2 of 4 groups".
- **Data:** the 4 groups and cue names. **Content:** "Example" rig. No stock photos (the p33 photos are possibly stock, OQ #21).

### II. Creative Production ("The Studio")

**7. Photography** · `#photography` · `aperture-gallery` · M ⚠
- **Shows:** a full-bleed gallery of real event and product photos. An aperture slider (f/1.4 to f/16) changes the depth-of-field look on the active photo, using two pre-rendered layers (sharp and soft) crossfading, never a live blur on the full image.
- **Owner:** Motion (slider); prev/next with buttons and arrow keys.
- **Reduced:** the slider works, with instant changes.
- **Data:** 4–6 real photos, each with a pre-blurred variant. **Content:** real. Only photos with no identifiable faces until consent is given (OQ #18).

**8. Video production** · `#video` · `scrub-reel` · M ⚠
- **Shows:** a strip of 8–12 frames from the showreel that scrubs as the visitor scrolls (frame sequence, not video seeking), with a "Play the reel" button that loads the video only on click.
- **Owner:** GSAP (scrub); the `<video>` loads on demand.
- **Reduced:** a single poster frame and the Play button.
- **Data:** the showreel and frames. **Content:** real. The showreel is missing (CONTENT_CHECKLIST #1), so until it arrives the module shows the designed placeholder with no play button. It is never filled with stock or AI footage.

**9. Motion graphics** · `#motion` · `motion-playground` · S
- **Shows:** a title card ("Every second is planned.") that the visitor animates by choosing an easing (Linear, Ease out, Spring, the brand's Expo) and pressing Play. A small curve diagram shows the chosen easing.
- **Owner:** Motion.
- **Reduced:** the curves and the final title, no movement; the choices still describe each curve in text.
- **Data:** 4 easings. **Content:** the brand's own line.

**10. AI content creation** · `#ai-content` · `idea-to-image` · M
- **Shows:** a before/after slider: on the inline-start side the brief as text (the idea), on the inline-end side the art-directed AI image. 3 examples to switch between.
- **Owner:** Motion (drag), with a native range input underneath for keyboard and screen readers.
- **Reduced:** the slider works, with no easing.
- **Data:** 3 briefs and 3 AI images. **Content:** labelled "AI-generated example". The briefs are real prompts from `image-prompts.md` (house style), so the example is honest about the process.

**11. Set & stage design** · `#set-design` · `set-model` · M
- **Shows:** three cuts of one set: a pencil sketch (an SVG line drawing), a white-card model (an AI photo), and the lit set (an AI photo, labelled "Illustrative"). Scroll cuts between them, Studio style, with timecode.
- **Owner:** GSAP (scroll cut points; no pin).
- **Reduced:** three frames side by side (stacked on mobile).
- **Data:** 1 SVG and 2 AI images. **Content:** "Example".

**12. Equipment & camera rental** · `#rental` · `rental-categories` · S
- **Shows:** four equipment categories (**Camera, Lighting, Sound, Stage**), not a catalogue (user, 2026-11-08). Each card has a line drawing, the category name and one line on what it covers.
- **Event equipment (D71, only if the client confirms, OQ #22):** LED screens and kiosks would join as two more cards (audio and lighting are already Sound and Lighting). Not shown until confirmed.
- **Interaction:** selecting a card (a toggle button with `aria-pressed`) lifts it and reveals its line. "Ask about availability" opens the quote form with `?service=rental` and the chosen category in the message.
- **Owner:** Motion.
- **Reduced:** all four lines visible; selection still works, instantly.
- **Data:** the 4 categories. **Content:** categories only: **no models, brand names, quantities or prices** until a real inventory exists (OQ #22). Once it arrives, the module can grow into a catalogue under its own spec.

### III. Marketing & Brand ("The Editorial")

**13. Branding & identity** · `#branding` · `mark-build` · M
- **Shows:** NO TIME's own mark built from its construction grid (circle, letterforms, then the final mark), then laid out on a brand board (palette, type pair, voice line). It uses our own brand, so no client permission is needed.
- **Owner:** GSAP (scroll, stroke draw and layout).
- **Reduced:** the finished brand board.
- **Data:** the mark as SVG (**needs the logo SVG**, CONTENT_CHECKLIST #14; until then the module uses the trimmed PNG for the board and skips the construction drawing).
- **Content:** real.

**14. Social media management** · `#social` · `phone-feed` · M ⚠
- **Shows:** a phone mockup with a feed of 6 example posts that scrolls slowly on its own, plus a "This week" calendar strip beside it (Mon–Sun, a post per day).
- **Owner:** CSS transform loop, paused off-screen, on hover or focus, and with a pause button; Motion for the calendar.
- **Reduced:** a still feed showing the first 3 posts.
- **Data:** 6 square images (AI) and captions. **Content:** "Example". No real handles, likes or follower counts.

**15. Digital marketing & SEO** · `#digital-marketing` · `example-dashboard` · M
- **Shows:** an animated dashboard: sessions over 12 weeks (a line), a channel split (bars), and a search position trend. It builds on scroll entry. A tab switches between Search, Paid and Social.
- **Owner:** GSAP (draw on entry); Motion (tabs).
- **Reduced:** drawn, with tabs still working.
- **Data:** example series. **Content:** labelled **"Example data"** in the chart title and the table caption. The text summary and table alternative follow the chart rules. No percentages presented as results.

**16. Content strategy** · `#content-strategy` · `content-calendar` · M
- **Shows:** an editorial month grid colour-coded by content pillar (3–4 pillars, in palette tones and patterns, not colour alone). The visitor filters by pillar or channel.
- **Owner:** Motion `layout`.
- **Reduced:** the full grid, with filters working instantly.
- **Data:** 4 pillars and about 16 entries. **Content:** "Example".

**17. Public relations** · `#pr` · `press-release` · M
- **Shows:** a newspaper-style layout after profile p.19, but the "story" is the anatomy of a press release: headline, dateline, lead, quote, boilerplate, media contact. Each part is annotated on hover, focus or tap.
- **Owner:** Motion (annotations); GSAP for the type-led entry.
- **Reduced:** all annotations visible.
- **Data:** an example release. **Content:** "Example". **No outlet names, logos or clippings** until the client confirms which actually published (OQ #19).

**18. Paid media & media planning (Google & Meta ads)** · `#paid-media` · `campaign-funnel` · M (D71; replaces `flighting-chart`)
- **Shows:** a campaign funnel: four stages (Reach, Clicks, Leads, Customers) as bars that narrow as they draw in, with the channel that feeds each stage beside it. A toggle switches the platform (Google Ads, Meta Ads, Both) and the stages re-flow; a second row shows the plan behind it (channels across the weeks of one flight).
- **Owner:** GSAP (draw on entry); Motion `layout` (re-flow on toggle).
- **Reduced:** the static funnel, with the toggle working instantly.
- **Data:** example campaigns × 3 (one per toggle position). **Content:** labelled **"Example data"** in the module's title and the table caption. Stage sizes are relative widths only: no numbers, budgets, costs, rates or results, and no client names. The table alternative lists stage → channel per platform.

### IV. Production, Print & Gifts ("The Workshop")

**19. Large-format printing** · `#large-format` · `human-scale` · S
- **Shows:** a 1.8 m human silhouette beside a backdrop that grows on scroll through 3 sizes (roll-up 0.85 × 2 m, backdrop 3 × 2.4 m, wall 6 × 3 m), with dimension lines and labels.
- **Owner:** GSAP (scale on scroll).
- **Reduced:** three sizes side by side.
- **Data:** the 3 formats. **Content:** standard industry sizes, labelled "Example sizes" (they are not claims about NO TIME's machines).

**20. Stand fabrication & signage** · `#fabrication` · `build-layers` · M
- **Shows:** an exploded section through a stand wall: frame, panel, finish wrap, LED, graphic and wayfinding sign. The visitor steps through the layers (Next/Previous buttons and a scroll option), each with a one-line note.
- **Owner:** Motion (steps).
- **Live region:** "Layer 3 of 6: finish wrap".
- **Reduced:** all layers shown apart, labelled.
- **Data:** 6 layers. **Content:** a generic build ("Example"). It differs from #2, which shows a whole stand assembling: this shows the build itself.

**21. Packaging design** · `#packaging` · `unboxing` · M ⚠
- **Shows:** a box (layered SVG or 3 AI stills) that unboxes on scroll: lid lifts, tissue opens, the product is revealed.
- **Owner:** GSAP scrub; no pin, or at most 1 viewport on desktop.
- **Reduced:** the open box.
- **Data:** SVG layers (preferred) or 3 images. **Content:** "Example", no client packaging until approved (OQ #17).

**22. Corporate gifts** · `#gifts` · `gift-configurator` · M
- **Shows:** a gift box configurator with box finish (espresso, cocoa, ivory), ribbon (champagne, taupe, none), insert (notebook, pen, dates) and an "Add a name tag" text field. A live SVG preview updates.
- **Owner:** Motion (preview transitions).
- **Inputs:** native radio groups. **Live region:** "Cocoa box, champagne ribbon, notebook".
- **Reduced:** instant updates.
- **Data:** the options. **Content:** "Example", no prices. "Ask for this gift" opens the quote form with `?service=gifts` and the chosen options in the message.

**23. Online print store** · `#print-store` · `print-order` · S
- **Shows:** **"Order your print online" / «اطلب مطبوعاتك عبر الإنترنت»** through the quote form, not a store (user, 2026-11-08). Three steps explain how an order works:
  1. Tell us the item (business cards, roll-up, letterhead…).
  2. Send your artwork or reuse your approved files.
  3. We print and deliver.
- **Interaction:** the main button opens the quote form with `?service=print-store`.
- **No cart, no basket, no quantities, no prices**, and nothing that looks like checkout.
- **Owner:** Motion (the steps reveal in turn on entry; a tap on a step expands its line).
- **Reduced:** the three steps side by side, all open.
- **Data:** 3 steps and a few example item types. **Content:** real process copy. If the client later confirms a live store (OQ #23), the button can point to it instead.

**24. Branded merchandise** · `#merchandise` · `merch-placement` · S
- **Shows:** 4 objects (tote, cap, tee, bottle) in line drawings. The visitor moves a "Your mark" placeholder between placements (chest, sleeve, side) and switches tone-on-tone or contrast. A dimension line shows the print area.
- **Owner:** Motion.
- **Reduced:** instant.
- **Data:** 4 objects × 2–3 placements. **Content:** "Example".

### V. Software & Digital ("The Interface")

**25. Websites** · `#websites` · `responsive-frames` · M
- **Shows:** one small website in HTML inside laptop, tablet and phone frames; a width control reflows it live. An EN ⇄ AR toggle mirrors it.
- **Owner:** Motion (`layout`); the width control is a native range input.
- **Reduced:** instant reflow.
- **Data:** a mini site (a heading, a nav, 3 cards). **Content:** "Example" site for a fictional café, labelled.

**26. Mobile apps** · `#apps` · `app-screens` · M
- **Shows:** a phone with a working 3-tab app (Home, Bookings, Profile), switched by tapping the tab bar. A toggle shows the iOS or Android conventions (navigation, back gesture hint).
- **Owner:** Motion.
- **Reduced:** instant tab switches.
- **Data:** 3 screens. **Content:** "Example". It must not look like the QR check-in or restaurant products: different subject and no product names.

**27. Custom systems** · `#systems` · `data-flow` · M
- **Shows:** a data-flow diagram that draws itself on scroll: inputs (forms, sheets, devices), then the system (rules, records), then outputs (dashboards, alerts, exports). Hovering, focusing or tapping a node highlights its connections.
- **Owner:** GSAP (stroke draw); Motion (highlight).
- **Reduced:** drawn.
- **Data:** about 9 nodes and edges. **Content:** a generic architecture ("Example"). A text list alternative is provided.

**28. E-commerce** · `#e-commerce` · `checkout-flow` · M
- **Shows:** a phone-frame shop: product card, add to cart, a 2-step checkout (details, confirm). The visitor clicks through it.
- **Owner:** Motion.
- **Reduced:** instant.
- **Data:** 3 example products. **Content:** "Example". **No prices**: the totals line shows "Total —" with the "Example" label.

**29. UI/UX design** · `#ux` · `fidelity-slider` · S
- **Shows:** one screen at three fidelities: wireframe (grey blocks), prototype (real layout, no colour), final (brand UI). A segmented control or slider morphs between them.
- **Owner:** Motion `layout`.
- **Reduced:** three states side by side.
- **Data:** 1 screen in 3 states. **Content:** "Example".

**30. AI consulting** · `#ai-consulting` · `ai-sorter` · S
- **Shows:** 8 example tasks (e.g. "Summarise meeting notes", "Approve a refund") that the visitor sorts into "AI helps" or "Keep it human" with two buttons on each card. Each sort reveals a one-line reason. It answers the description: where AI helps, where it doesn't, and how to start.
- **Owner:** Motion.
- **Live region:** "Moved to AI helps. 3 left".
- **Reduced:** instant moves.
- **Data:** 8 tasks with reasons. **Content:** "Example". No claims about savings.

---

## 7. Effort, build order, performance risks

### Effort per category

| Category | S | M | L | Modules |
|---|---|---|---|---|
| I Events & Hospitality | 0 | 5 | 1 | agenda-timeline M, stand-assembly **L**, launch-reveal M, candle-moodboard M, menu-majlis M, stage-lights M |
| II Creative Production | 2 | 4 | 0 | aperture-gallery M, scrub-reel M, motion-playground S, idea-to-image M, set-model M, rental-categories S |
| III Marketing & Brand | 0 | 6 | 0 | mark-build M, phone-feed M, example-dashboard M, content-calendar M, press-release M, campaign-funnel M |
| IV Production, Print & Gifts | 3 | 3 | 0 | human-scale S, build-layers M, unboxing M, gift-configurator M, print-order S, merch-placement S |
| V Software & Digital | 2 | 4 | 0 | responsive-frames M, app-screens M, data-flow M, checkout-flow M, fidelity-slider S, ai-sorter S |
| **Total** | **7** | **22** | **1** | 30 |

In days: about 3.5 (S) + 22–44 (M) + 3–5 (L), so 30–55 working days for modules, plus the shared page infrastructure (routes, data, index, themes, SEO, menus: about 6–8 days) and per-category theming (1–2 days each).

### Build order (the user's)

1. **Shared infrastructure** (no visible category yet): routes, data model and tests, the module loader, theme tokens, the index and scrollspy, the anchor offset for the chip bar, menu and link updates, SEO and sitemap.
2. **Events & Hospitality prototype:** theme, hero and all 6 modules. **Then the user's approval** (CP7): theme, skeleton, module quality, Lighthouse. Rand has delegated design decisions to the user, who may show the prototype to Rand as a courtesy.
3. **The other four categories**, one at a time, each ending in a checkpoint. Suggested order: Production, Print & Gifts (3 S modules, quick); Software & Digital (strategic priority, brief §7); Marketing & Brand; Creative Production last (it waits on the showreel and real photos).

### Performance risks (⚠)

| Module | Risk | Mitigation |
|---|---|---|
| stand-assembly | Many SVG paths moving in a scrubbed, pinned timeline | Under 150 paths; animate layer groups (transform/opacity) only; pin desktop only, at most 1 viewport; no pin on mobile. |
| candle-moodboard | Several photos plus layout animation | `BrandImage` with srcset capped at native width (D51), lazy; Motion `layout` only on the board, not the images. |
| aperture-gallery | Blur is expensive on large images | Pre-rendered soft variants (sharp at build time), crossfade opacity; never CSS `filter: blur` on the full image. |
| scrub-reel | Frame sequences are heavy | At most 12 frames at 640px AVIF, loaded on approach; the video only on "Play" (`preload="none"`). |
| phone-feed | A continuous loop costs frames | CSS transform loop on one element; paused off-screen, on hover or focus, with the tab hidden or under reduced motion. |
| unboxing | Large images or many layers scrubbed | SVG layers preferred; if images are used, 3 stills crossfading, not a sequence. |
| *All pages* | 6 modules per page add JS | One `next/dynamic` chunk per module; a module mounts only within about one viewport; no shared heavy library. A per-page budget check (the Lighthouse script) runs in the checkpoint. |

---

## 8. SEO

- **Headings:** one H1 per page (the category), and every service an H2 with substantial text (intro plus 4–6 points; about 120–200 words per section), so each anchor has real content behind it.
- **Metadata per category and locale:** title, description, canonical, and hreflang alternates (en, ar, x-default). The OG image is generated per category with `opengraph-image.tsx` (ImageResponse with the brand palette, the category numeral and the title), in EN and AR.
- **JSON-LD per category page:**
  - `ItemList` of `Service` items. Each has `@id` = page URL + `#anchor`, `name`, `description`, `provider` → the Organization `@id`, and `url` = page URL + anchor. No `areaServed` or ratings until confirmed.
  - `FAQPage` from the category FAQ. Google shows FAQ rich results only for a few sites now, but the markup is still valid and describes the page.
  - `BreadcrumbList`: Home › Services › Category.
- **Overview page `/services`:** an `ItemList` of the 5 categories, and a BreadcrumbList.
- **Sitemap** (`src/app/sitemap.ts`, the `PAGES` list): add `/services` and the 5 category pages, per locale with hreflang alternates. That makes 6 new pages × 2 locales = 12 new entries. Anchors are not sitemap entries.
- Check with the `nextjs-seo` skill during the build.

---

## 9. Open items

New items for OPEN_QUESTIONS and CONTENT_CHECKLIST; only the client can answer them:

- **Equipment inventory:** which cameras, lenses and lights NO TIME rents out. Until then, example categories only.
- **Online print store:** does it exist today, or is it planned? The module and copy depend on it.
- **Showreel:** already CONTENT_CHECKLIST #1; the video module waits on it.

Still open from before (unchanged): client names and logos (#17), photo consent (#18), press outlets (#19), the role in government portals (#20), original photos (#21), contact details (CONTENT_CHECKLIST #7), and the logo SVG and dark version (#12, CONTENT_CHECKLIST #14).
