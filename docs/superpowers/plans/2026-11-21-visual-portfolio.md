# Visual Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (the owner's D93: one agent at a time; the lead implements, one fresh reviewer at the end). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every drawn or demo-style scene with real-photo scenes in depth layers, show Rand's real work, and fix home's first screen, Software's length and the Work page.

**Architecture:** Scenes stay data (`SceneConfig`, `LayeredScene`, `SceneDirector`); their layers point at ids in one new registry, `src/content/media.ts`. Each service section with a scene renders it full-bleed with its heading over the lower third (the majlis pattern), and a gallery strip of Rand's photos under it; the interactive modules and drawings are deleted page by page.

**Tech Stack:** Next.js 16 (read `node_modules/next/dist/docs/` before any Next API), next-intl, GSAP ScrollTrigger + `@gsap/react`, Lenis, Motion, Tailwind logical properties, sharp, rembg (Python), Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-21-visual-portfolio-design.md` (stories: `docs/content/visual-stories.md`; inventories: `docs/content/profile-inventory.md`, `docs/review/graphics-inventory.md`).

## Global Constraints

- Branch `phase-2-services`; commit per step; never merge to main or deploy; never delete an untracked file without asking.
- Honesty (D78): no new claim, number, client name or testimonial; ⚑ lines unchanged; new copy only where a section needs a caption, EN through humanizer, AR native in the plural, logged in `copy-pending.md`.
- Work and case pages use only `source: "rand-profile" | "rand"` images. Stock/AI: no logos, no recognisable people or places.
- Pin at `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`; below 1024 the scene passes; 9:16 art direction switches at 900px; reduced motion = the end frame.
- LCP never worse per page (Lighthouse A/B, `scripts/lighthouse-ab.mjs`, mobile, 5 runs, medians, nothing else running); CLS 0; `/links` ≥ 95; below-the-fold images lazy; masters WebP ≤ 2400px wide, never upscaled (next/image serves AVIF/WebP widths).
- GSAP for scroll, Motion for interaction, never both on one element; Tailwind logical properties only; strings in `src/messages` or localized content.
- W02 (`e2e/empty-screens.spec.ts`) and axe stay green.

## Review Focus

1. A registry entry set `hidden: true` (or with a missing file): its scene ends a beat earlier and its gallery tile closes up; no empty box, no broken `<img>`. Test: Task 1 `media()` returns `undefined`; Task 4 unit `visibleLayers()` drops it; Task 5 e2e hides one id via a test-only env and checks no `img[src=""]` and no zero-size tile.
2. RTL: wipes open from the centre and drifts mirror; the gallery strip scrolls from the inline-start. Test: Task 5 e2e asserts the strip's first tile is at the inline-start edge in `/ar`.
3. Crossing 1024px while scrolled into a pinned scene (rotate a tablet, resize a window): no stuck pin, no doubled spacer. Test: Task 2 e2e resizes 1280 → 1000 mid-pin and checks `document.scrollingElement.scrollHeight` shrinks by the pin and the heading is visible.
4. A deep link to a pinned section (`#hospitality`) lands on its heading, not mid-pin. Test: existing `e2e/anchors*.spec.ts` extended to `#hospitality` and `#stage` (Task 7).
5. A slow phone: the first screen is text and a single plate; no scene image is eager below the fold. Test: Task 8 e2e counts `img[loading=eager]` outside the first viewport = 0.

---

### Task 1: The image registry

**Files:**
- Create: `src/content/media.ts`, `src/content/media.test.ts`, `scripts/images-for-rand.mjs`
- Modify: `src/content/scenes/images.ts` (`getSceneImage` falls back to the registry)

**Interfaces:**
- Produces: `type MediaSource = "rand-profile" | "stock" | "ai" | "rand"`; `interface MediaEntry { id; file: string /* public path of the WebP master */; width; height; mobile?: { file; width; height }; source: MediaSource; credit?: { by: string; url: string; license: "Unsplash License" | "Pexels License" }; from?: string; replace?: boolean; randApproval?: "client-visible" | "faces"; hidden?: boolean; alt: Localized<string> | null; spec: string; grade?: Grade }`; `MEDIA: MediaEntry[]`; `media(id: string): MediaEntry | undefined` (undefined when hidden or absent); `mediaAll(id)` (ignores `hidden`, for tooling).
- `getSceneImage(id)` returns a `SceneImageSlot` built from `media(id)` when the id isn't in `SCENE_IMAGES` (src = file, width, height, mobile, alt).

- [ ] **Step 1: Write the failing tests** in `media.test.ts`: `media("missing")` is undefined; an entry with `hidden: true` is undefined from `media` and defined from `mediaAll`; every entry with `source` stock has `credit.license`; every rand-profile entry has `from`; every entry with `alt !== null` has non-empty `en` and `ar`; ids are unique; every `file` exists under `public/` with the declared `width`×`height` (sharp metadata).
- [ ] **Step 2:** `npx vitest run src/content/media.test.ts`: FAIL (module missing).
- [ ] **Step 3:** Implement `media.ts` with the Events opening entries first (private-celebrations-1 night/day plates, near tables, entrance; moved from `scenes/images.ts` ids `ev-open-room`, `ev-open-table`, keeping those ids) and the `getSceneImage` fallback.
- [ ] **Step 4:** Tests pass; `npx tsc --noEmit` clean.
- [ ] **Step 5:** `scripts/images-for-rand.mjs` writes `docs/content/images-for-rand.md` and `docs/content/images-for-rand/<id>.webp` (240px thumbnails) for every entry with `replace` or `randApproval`, listing where each id is used (grep of `src/`). Run it; commit `feat(media): one image registry`.

### Task 2: Pin from 1024px

**Files:**
- Modify: `src/components/scenes/scene-director.tsx` (matchMedia `desktop: "(min-width: 1024px) and …"`, `mobile: "(max-width: 1023.98px) and …"`), `src/app/globals.css` (the pin reservation queries at 583–591 and 576 from 900 to 1024), `src/lib/scene-math.ts` (export `PIN_MIN_WIDTH = 1024`), `src/components/scenes/layered-scene.css` (any 900 query tied to motion, not art direction)
- Test: `e2e/scene-breakpoint.spec.ts`

- [ ] **Step 1:** Write `e2e/scene-breakpoint.spec.ts`: at 1000×800 `/en/services/events-hospitality` the opening's `.scene-pin` has no pin spacer (`[data-motion="mobile"]` on `.scene`); at 1280×800 it has `data-motion="desktop"`; resize 1280 → 1000 while inside the pin: page height shrinks and `#conferences-title` becomes visible after scrolling 1 screen (Review Focus 3).
- [ ] **Step 2:** Run against a prod build (`PW_BASE_URL=http://localhost:3000`): FAIL at 1000.
- [ ] **Step 3:** Change the queries; keep `SceneImage`'s 899.98px art direction.
- [ ] **Step 4:** Spec passes; `e2e/empty-screens.spec.ts` passes at the seven sizes. Commit `feat(scenes): pin from 1024px (D151)`.

### Task 3: The layer pipeline

**Files:**
- Create: `scripts/scene-layers.mjs`, `scripts/lib/rembg-cut.py`
- Uses: `scripts/grade.mjs` (the category grades), `scripts/stock-search.mjs --get`

**Interfaces:**
- `node scripts/scene-layers.mjs <recipe.json>` where each recipe item is `{ id, src /* raw file */, crop: { aspect: "16:9" | "9:16" | "4:5" | "3:4", focus?: [x, y] }, grade, cut?: "rembg" | { mask: "<png>" }, night?: true, out: "public/images/<folder>/<id>.webp", maxWidth?: 2400 }`; prints the registry stub (`id, file, width, height`) per item.
- `rembg-cut.py <in> <out.png>` (model `isnet-general-use`, alpha matting on) writes an RGBA PNG; run with `python -I`.

- [ ] **Step 1:** Implement both; a recipe at `docs/content/recipes/events.json` (committed; raw stock lands in `assets-inbox/stock/`, gitignored).
- [ ] **Step 2:** Run the Events recipe; check each output's size and that no output is wider than its source crop (the script refuses upscaling: exit 1 with the id).
- [ ] **Step 3:** Commit `feat(scripts): scene layer pipeline`.

### Task 4: Events opening, photo beats

**Files:**
- Modify: `src/content/scenes/events-hospitality.ts` (`EVENTS_OPENING`), `src/components/category/themes/evening.css` (delete `fx-ev-hall`), `src/content/scenes/images.ts` (drop `ev-open-hall`, `ev-open-florals`, `-candles`, `-glasses`), `src/content/media.ts`
- Test: `src/content/scenes/scenes.test.ts`, `e2e/photo-stories-reduced.spec.ts`

**Interfaces:** `visibleLayers(scene: SceneConfig, has: (id: string) => boolean): SceneConfig` in `src/lib/scene-math.ts`: drops image layers whose slot has no visible media and any shot left with no layer starting in it.

- [ ] **Step 1:** Tests: `EVENTS_OPENING` has 4 desktop shots and every image layer's slot resolves in `media`; no layer has `fx: "ev-hall"`; `visibleLayers` with `ev-open-entrance` hidden returns 3 shots (Review Focus 1); `sceneProblems(EVENTS_OPENING)` is empty.
- [ ] **Step 2:** Run: FAIL.
- [ ] **Step 3:** Beats per `visual-stories.md` (night plate L0 → day plate wipes in on shot 1 → near tables on shot 2 → entrance frame enters from the inline-end on shot 3); `LayeredScene` calls `visibleLayers` with `(id) => !!media(id) || !!getSceneImage(id)?.src`.
- [ ] **Step 4:** Tests pass; the reduced still shows the entrance frame. Commit `feat(events): opening in photo beats`.

### Task 5: Section scenes and galleries (Events I–III)

**Files:**
- Create: `src/components/category/service-gallery.tsx` (+ css in `category.css`), `src/content/galleries.ts`
- Modify: `src/content/scenes/events-hospitality.ts` (`EVENTS_CONFERENCES`, `EVENTS_EXHIBITIONS`, `EVENTS_LAUNCHES`, all `mode: "pass"`), `src/content/scenes/index.ts` (`SECTION_SCENES`), `src/components/category/service-section.tsx` (a service with a scene renders no module, no service visual)
- Delete: `src/components/modules/{agenda-timeline,stand-assembly,launch-reveal}/`, their entries in `registry.tsx` and `static-fallbacks.tsx`, `src/content/modules/{agenda-timeline,stand-assembly,launch-reveal}.ts` and the tests that cover only them
- Test: `src/content/galleries.test.ts`, `e2e/service-scenes.spec.ts`

**Interfaces:** `GALLERIES: Record<serviceSlug, string[] /* media ids */>`; `<ServiceGallery ids={string[]} label={string} />` renders the visible ids as a horizontal snap strip (`overflow-x: auto`, `scroll-snap-type: inline mandatory`), 3:4 tiles, `sizes="(min-width: 1024px) 22vw, 70vw"`, lazy; nothing when fewer than 2 are visible.

- [ ] **Step 1:** Tests: every gallery id resolves in `MEDIA`; e2e on `/en` and `/ar` Events: `#conferences`, `#exhibitions`, `#launches` each contain a `.scene` and no `[data-module]`; the AR strip's first tile touches the inline-start (Review Focus 2); with `NEXT_PUBLIC_MEDIA_HIDE=sandoz-1` (test-only env read in `media.ts`) no `img[src=""]` and no tile under 40px wide.
- [ ] **Step 2:** Run: FAIL.
- [ ] **Step 3:** Implement; stock from the Events recipe (`tCFbHdEIUMU`, `ZXx-aoBPYuM`, `kqgC_6j6AaA`, `Z4dBIqRR9j0`, an empty exhibition hall chosen with `stock-search.mjs`), each with its credit in `media.ts`.
- [ ] **Step 4:** Tests pass; `npx vitest run` green. Commit `feat(events): conferences, exhibitions, launches as photo scenes`.

### Task 6: Events IV–VI

**Files:**
- Modify: `src/content/scenes/events-hospitality.ts` (`EVENTS_GALAS` pass, `EVENTS_MAJLIS` rebuilt on heritage-5/-1/-2/-4, pin 0.6vh at ≥ 1024, `EVENTS_STAGE` pin 0.6vh), `service-section.tsx` (no `MajlisArt`, no `PhotoStack` once Galas has its scene + gallery)
- Delete: `src/components/category/majlis-art.tsx`, `fx-mj-*` in `evening.css`, `modules/{candle-moodboard,menu-majlis,stage-lights}/` and their data/tests
- Test: `e2e/anchors*.spec.ts` (`#hospitality`, `#stage`), `e2e/empty-screens.spec.ts`

- [ ] **Step 1:** Extend the anchor spec (Review Focus 4); run: FAIL until the scenes exist.
- [ ] **Step 2:** Implement per the stories; galleries for Galas and Catering.
- [ ] **Step 3:** All Events e2e (`events-*`, `rail-over-scene`, `photo-stories-reduced`, `empty-screens`, `anchors`) pass on a prod build. Commit `feat(events): galas, majlis and stage as photo scenes; modules removed`.

### Task 7: Events verification and log

- [ ] Lighthouse A/B for `/en` and `/ar/services/events-hospitality` against `f086c44`'s build (mobile, 5 runs): LCP median not worse beyond the run spread; CLS 0. Results in `docs/checkpoints/lighthouse/visual-events/`.
- [ ] axe EN/AR 1440/390: 0 serious/critical. Shots before/after `docs/checkpoints/visual/events/` (1440/390, EN/AR) via `scripts/section-shots.mjs`.
- [ ] Review Focus 5: e2e counts eager images below the first viewport = 0.
- [ ] DECISIONS D150–D15x + `decisions-to-confirm.md`; HANDOFF; graphify update of the changed files. Commit.

### Task 8: Home first screen (C1)

**Files:** `src/components/sections/hero/{hero.tsx,hero-scene.tsx,hero-controller.tsx,hero.css}`, `src/content/media.ts`; Test: `e2e/hero-*.spec.ts`, new `e2e/first-screen.spec.ts`
- [ ] Test: at 200ms after `load`, on 1440 and 390, EN and AR: the header nav, the H1 text and both CTAs have `opacity ≥ 0.99` and are in the viewport; the hero plate image has `fetchpriority="high"`; LCP element is the H1 (PerformanceObserver).
- [ ] Implement: the plate (R, private-celebrations-1, graded for AA), header and headline at first paint, the clock's one sweep as a CSS layer behind the text; the intro sequence and its gate removed. Lighthouse A/B on `/en` and `/ar`. Commit.

### Task 9: Home cards and real projects (C4)

**Files:** `src/components/sections/categories/{categories.tsx,category-cards.tsx,category-cards-scroll.tsx}`, `src/components/sections/work/work.tsx`, `src/content/images.ts` → `media.ts`
- [ ] Move the shared types/consts both card files import into `src/components/sections/categories/cards-data.ts` (cycle gone: `npx madge --circular src/components/sections/categories` reports none).
- [ ] Each card's photo from `media` (stories, "Five crafts"); "Real projects" uses the cases' own photos (`randApproval: "client-visible"`). `CaseVisual` no longer used on home. Tests: `e2e/cards-no-shift.spec.ts`, the W02 spec. Commit.

### Tasks 10–12: Creative, Marketing, Print

Same shape as Tasks 4–6 per page (opening beats, section scenes in `mode: "pass"`, galleries, then delete the page's modules and drawings: Creative `motion-playground`, `rental-categories`, drawings `timeline`, `frames`; Marketing `content-calendar`, `press-release`, drawings `mark`, `feed`, `search`, `funnel`; Print `human-scale`, drawings `stand`, `dieline`, `merch`; `print-order` stays). Motion and AI sections show Rand's stills and list her missing files in `images-for-rand.md`. Each page: its e2e, Lighthouse A/B, axe, shots, commit, HANDOFF.

### Task 13: Software (C2)

**Files:** `src/components/software/{service-blocks.tsx,service-visuals.tsx,software-page.tsx,software.css}`, new `src/components/software/service-tabs.tsx`
- [ ] Test: `e2e/software-tabs.spec.ts`: six tabs (`role="tablist"`), arrow keys move focus (RTL reversed), every panel's text is in the HTML (`page.content()` contains each service's summary while its tab is inactive), `?build=` links still open the right panel, `#consult` anchor works; phone page height < 11,500px (half of 23,063).
- [ ] Implement tabs (panels `hidden` but rendered), the drawn visuals replaced by device photos from `media`, long lists in `<details>`. Delete `service-visuals.tsx` drawings. Lighthouse A/B. Commit.

### Task 14: About and products

- [ ] About: photos via `media` only (no visual change beyond reframing). Minute Zero / Peak Hour: screens over a device photo, "Preview" kept. Commit.

### Task 15: Work (C3)

**Files:** `src/content/work.ts`, `src/components/pages/work/{work-index.tsx,work-case.tsx}`, `src/components/pages/case-media.tsx`, new collections in `src/content/work.ts`, `src/components/pages/work/copy-link.tsx`
- [ ] Tests: `work.test.ts`: every image on a Work page has `source` rand-profile or rand; each collection has ≥ 4 visible photos or is hidden; `e2e/work.spec.ts`: each item links to `/work/<slug>`, the copy-link button writes that URL to the clipboard (Motion for the press feedback), the filter row shows at ≥ 6 items.
- [ ] Implement; delete `case-visual.tsx` and its css when unused. Commit.

### Task 16: Close

- [ ] `scripts/images-for-rand.mjs`; full local unit + the changed e2e; push; full CI (`workflow_dispatch`), green run number.
- [ ] Fresh reviewer: `superpowers:requesting-code-review` on the branch since `0c5f668`; fix Critical/Important.
- [ ] Quality gate (CLAUDE.md): design critique, accessibility review, copy check by a fresh agent; fix High/Medium.
- [ ] `docs/report/visual-report.md` (Arabic): per page before/after shots 1440/390 EN/AR (`docs/checkpoints/visual/`), a scroll recording of home and Events, decisions, proposals, skills, Lighthouse before/after, axe, CI run, image counts by source and what needs Rand.
- [ ] PR `phase-2-services` → `main` (not merged); review build + tunnel link from the last commit.
