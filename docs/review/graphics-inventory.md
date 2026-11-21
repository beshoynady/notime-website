# Graphics inventory: every drawn visual and interactive scene (2026-11-21)

The owner doesn't want code drawings or demo-style interactive scenes (the stage that lights up from a button on the Events page is the example he gave): they read as a demo, not as a premium house. This lists every one, page by page, with its shot and its name in the code, and what replaces it (the design: `docs/superpowers/specs/2026-11-21-visual-portfolio-design.md`; the stories: `docs/content/visual-stories.md`).

Shots: `docs/review/graphics-inventory/<name>-en-1440.webp`, taken by `node scripts/section-shots.mjs docs/review/graphics-inventory` on the review build (reduced motion, so every scene shows its end frame).

**Kinds:** **drawing** = SVG or CSS lines drawn in code · **interactive** = a module the visitor plays with (buttons, sliders, drag) · **mixed** = a real photo inside a drawn scene · **photo** = real photos only (kept) · **type** = typographic or data, no picture (kept unless noted).

**Fate:** **replace** = a photo scene in layers takes its place, and the old component goes · **photo-up** = already a real photo, only reframed in the new style · **keep** = not a graphic, or functional.

## Home `/`

| Section | Shot | Code | Kind | Fate |
|---|---|---|---|---|
| Hero «IT'S TIME TO START.» | `home-hero` | `sections/hero/hero-scene.tsx`, `hero-clock.tsx`, `hero-hud.tsx`, `hero-controller.tsx` | drawing (clock, particles) + type | **replace** the dark drawn stage with a real photo plate, with the headline, menu and CTA there from the first frame. The clock stays as a small touch (Task C1) |
| Rooms we dressed (strip) | `home-strip` | `sections/photo-story/photo-strip.tsx` | photo | keep |
| About | `home-about` | `sections/about/about.tsx` | type | keep |
| Five crafts (cards) | `home-services` | `sections/categories/categories.tsx`, `category-cards.tsx` | photo + flat colour cards | **photo-up**: every card gets its category's real or stock photo, no flat brown squares (W13) |
| Real projects | `home-work` | `sections/work/work.tsx` → `ui/case-visual.tsx` | **drawing** (line drawings of a pavilion and a stage) | **replace** with the projects' own photos (Task A, C3) |
| Digital (platform) | `home-digital` | `sections/digital/digital.tsx` | product UI mock-ups ("Preview") | photo-up: the product screens sit on a real device photo |
| How we work | `home-process` | `sections/process/process.tsx` | type | keep (one photo per step is an option, not needed) |
| Markets board | `home-markets` | `sections/markets/markets-board.tsx` | type (live clocks) | keep: the clocks are data, and they carry the time idea |

## Events & Hospitality `/services/events-hospitality` (the model page)

| Section | Shot | Code | Kind | Fate |
|---|---|---|---|---|
| Opening | `events-opening` | `scenes/events-hospitality.ts` `EVENTS_OPENING`; the drawn hall `fx-ev-hall` (`category/themes/evening.css`) | **mixed**: a line-drawn hall that a real photo wipes over | **replace** the drawing with a photo plate: empty hall → tables → light → guests |
| I Conferences & summits | `events-conferences` | `modules/agenda-timeline/` | **interactive** (an example agenda you click through) | **replace** with a photo scene (a summit hall set row by row) |
| II Exhibitions & booths | `events-exhibitions` | `modules/stand-assembly/` | **interactive drawing** (a stand built in six steps) | **replace** with a photo scene (a stand in a hall, the stand rises) |
| III Launches & activations | `events-launches` | `modules/launch-reveal/` | **interactive drawing** (a product under a cloth, a button) | **replace** with a photo scene (the dark stage, the reveal) |
| IV Galas & celebrations | `events-celebrations` | `modules/candle-moodboard/` + `photo-stack` | photo + interactive (candles you light) | **photo-up**: the real photos stay, the candle game goes; layered photo scene |
| V Catering & heritage | `events-hospitality` | `category/majlis-art.tsx` (`EVENTS_MAJLIS`, `fx-mj-dusk`, `fx-mj-tent`) + `modules/menu-majlis/` | **drawing** (dunes, tent, dallah pour) + interactive menu | **replace** with the real heritage photos in layers (tent, carts, coffee) |
| VI Stage & technical | `events-stage` | `modules/stage-lights/` | **interactive drawing** (the stage lit from buttons: the owner's example) | **replace** with a photo scene (rig → light → stage live) |

## Creative Production

| Section | Shot | Code | Kind | Fate |
|---|---|---|---|---|
| Opening | `creative-opening` | `scenes/creative-production.ts` (AI slate, camera, real frame) | mixed (photo + AI + drawn) | **replace**: one photo scene, studio dark → light → frame |
| Photography | `creative-photography` | `SERVICE_VISUALS.photography` | photo | photo-up |
| Video | `creative-video` | `category/service-drawings.tsx` `timeline` | **drawing** | **replace** |
| Motion graphics | `creative-motion` | `modules/motion-playground/` | **interactive** (choose an easing) | **replace** |
| AI content | `creative-ai-content` | `service-drawings.tsx` `frames` | **drawing** | **replace** |
| Set & stage design | `creative-set-design` | `SERVICE_VISUALS["set-stage-design"]` | photo | photo-up |
| Equipment rental | `creative-rental` | `modules/rental-categories/` | drawing (icons) + tabs | **replace** |

## Marketing & Brand

| Section | Shot | Code | Kind | Fate |
|---|---|---|---|---|
| Opening | `marketing-opening` | `scenes/marketing-brand.ts` (drawn desk, AI board) | **drawing** + AI | **replace** |
| Branding & identity | `marketing-branding` | `service-drawings.tsx` `mark` | **drawing** | **replace** |
| Social media | `marketing-social` | `service-drawings.tsx` `feed` | **drawing** | **replace** |
| Digital marketing & SEO | `marketing-digital` | `service-drawings.tsx` `search` | **drawing** | **replace** |
| Content strategy | `marketing-content` | `modules/content-calendar/` | **interactive** (an example month) | **replace** |
| PR | `marketing-pr` | `modules/press-release/` | **interactive** (an annotated example release) | **replace** |
| Paid media | `marketing-paid` | `service-drawings.tsx` `funnel` | **drawing** | **replace** |

## Production, Print & Gifts

| Section | Shot | Code | Kind | Fate |
|---|---|---|---|---|
| Opening | `print-opening` | `scenes/production-print-gifts.ts` (AI box, real gift) | mixed | **replace** |
| Printing | `print-printing` | `modules/human-scale/` | **interactive drawing** (sizes beside a figure) | **replace** |
| Stand fabrication | `print-fabrication` | `service-drawings.tsx` `stand` | **drawing** | **replace** |
| Packaging | `print-packaging` | `service-drawings.tsx` `dieline` | **drawing** | **replace** |
| Corporate gifts | `print-gifts` | `SERVICE_VISUALS["corporate-gifts"]` | photo | photo-up |
| Print ordering | `print-ordering` | `modules/print-order/` | functional steps (how ordering works) | keep (it explains a process, not a picture) |
| Merchandise | `print-merchandise` | `service-drawings.tsx` `merch` | **drawing** | **replace** |

## Software & Digital

| Section | Shot | Code | Kind | Fate |
|---|---|---|---|---|
| Hero | `software-hero` | `software/interface-opening.tsx`, `device-frames.tsx` | drawn device frames around the real site | photo-up: the real site on a real device photo |
| Proof «Live today: the site you're reading» | `software-proof` | `software/proof-devices.tsx` | same | photo-up |
| Six services | `software-services` | `software/service-visuals.tsx` | **drawings** (frames, flows, sliders) | **replace** with photos of devices in use; tabs to halve the length (Task C2) |
| Process | `software-process` | `software/process-timeline.tsx` | type | keep |
| Products | `software-products` | `software/product-screens.tsx` | product UI ("Preview") | photo-up: screens on a device photo, "Preview" stays |
| Quality | `software-quality` | `software/` | type | keep |

## About, Work, products

| Page | Shot | Code | Kind | Fate |
|---|---|---|---|---|
| About top | `about-top` | `pages/about/about-page.tsx` | type | keep |
| About «How a room comes together» | `about-room` | `pages/about/about-page.tsx` | photo | keep |
| Work index | `work-index` | `pages/work/work-index.tsx` → `ui/case-visual.tsx` | **drawing** | **replace** with real project photos (Task A, C3) |
| Case study | `work-case` | `pages/work/work-case.tsx`, `pages/case-media.tsx` | **drawing** | **replace** with the project's own photos |
| Minute Zero / Peak Hour | `product-minute-zero` | `pages/product/product-page.tsx`, `software/product-screens.tsx` | product UI ("Preview") | photo-up: screens on a device photo |

## Count

- **Replace:** 29 sections (the home hero, 4 openings, the majlis, 10 interactive modules, 10 drawings, Software's six drawings as one section, the Work line drawings on home, index and case).
- **Photo-up:** 10. **Keep:** 9.
- Components that go once their pages are rebuilt (deleted with their tests, step by step): the 11 interactive modules (`agenda-timeline`, `stand-assembly`, `launch-reveal`, `candle-moodboard`, `menu-majlis`, `stage-lights`, `motion-playground`, `rental-categories`, `content-calendar`, `press-release`, `human-scale`), `majlis-art.tsx`, `service-drawings.tsx`, `case-visual.tsx`, the drawn `fx-*` scene classes, and `software/service-visuals.tsx`. `print-order` stays.
