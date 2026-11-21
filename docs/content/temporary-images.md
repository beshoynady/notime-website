# Images on the site: each slot and its source (D106)

Updated 2026-11-16. This list stays in the repo. The site itself never says how an image was made.

**The rule (D106):** no AI or stock photo may appear on a Work card, a case study, or anything presented as a real NO TIME project. Those use only the project's own photos (once the client approves) or a drawing made in code. AI images are only used as mood images for the categories.

**Before launch, or as soon as the material arrives:** replace every temporary image below with a real NO TIME photo ([hostinger-deploy.md](../launch/hostinger-deploy.md) §0).

## Rendered on the site

| Where | Slot | Source | Temporary? |
|---|---|---|---|
| Home category cards, mega menu | `cat-events-hospitality-4x5` | Real profile photo (`private-celebrations-2`) | No |
| Home category cards, mega menu | `cat-creative-production-4x5` | AI mood image (Canva master, D50/D51; log in `image-prompts.md`) | **Yes** |
| Home category cards, mega menu | `cat-marketing-brand-4x5` | AI mood image | **Yes** |
| Home category cards, mega menu | `cat-production-print-gifts-4x5` | AI mood image | **Yes** |
| Home category cards, mega menu | `cat-software-digital-4x5` | AI mood image | **Yes** |
| Software proof strip | `notime-website-home-{en,ar}`, `notime-website-category-{en,ar}` | Real screenshots of this site | No (retake after the final polish) |
| Events opening, shot "the room" | `ev-open-room` (+ 9:16) | Real profile photo, graded (`private-celebrations-1`) | No |
| Creative opening, the developing frame | `cp-open-frame` | Real profile photo, graded (`catering-4`) | No |
| Work cards, case pages, related work (anonymised cases) | none | Code drawing `CaseVisual`: airline pavilion = `stand`, league = `stage` | Until the client approves the name and photos |
| Named cases (private celebrations, catering, heritage, gifts) | the project's photos | Real profile photos under `public/images/work/` | No |
| Every other scene layer (Events hall and majlis, Print bench, Marketing board, Creative studio, Software) | `src: null` | Nothing renders; the scene's code drawing is the visual | Real or graded files can be added later (`scenes/images.ts`) |
| Home hero, category openings, service sections | none | Code-driven scenes and drawings (`ServiceDrawing`, the decorative patterns) | No |

## In the data, not rendered yet

These slots exist for later use. Nothing on the site shows them today.

| Slot | Source |
|---|---|
| `hero-fallback-16x9` | none (`src: null`); only used if the code hero is ever replaced by media |
| `hero-fallback-9x16` | AI image |
| `cat-*-16x9` (events, creative, print) | Real profile photos |
| `process-plan-4x5` | AI image |
| `process-build-4x5`, `process-produce-4x5`, `process-launch-4x5` | Real profile photos |
| `product-qr-check-in-16x9` | AI image |
| `product-restaurant-system-16x9` | none (`src: null`) |

The product pages show concept screens drawn in code with the "Preview" label. Demo data in the service modules carries the "Example" label.

## Where the generation log lives

- Prompts, the grade and the inspection notes: [image-prompts.md](image-prompts.md).
- AI files: `public/images/ai/` (kept apart from `public/images/work/`). Originals and sidecars: `raw/ai/` (not committed).
