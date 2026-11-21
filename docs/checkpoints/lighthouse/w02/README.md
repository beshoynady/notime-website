# W02: no empty screen while scrolling (D147)

2026-11-20 · branch `visual-pass`. Production builds on one machine, nothing else running.

## Empty-screen survey (`scripts/empty-screens.mjs`)

16 pages × 7 sizes (1440×900, 1366×768, 1280×720, 1024×768, 390×844, 375×667, 360×740), one stop every half screen, rule: at least half of the screen under the header holds detail.

| | Motion | Reduced motion |
|---|---|---|
| Before (own ground only) | 12 stops over 50% (all at 1366×768 and 1280×720; worst 59%) | 10 |
| After D147 | **0** | **0** |

`e2e/empty-screens.spec.ts` (8 pages, EN and AR, desktop and mobile, motion and reduced): 32/32 passed.

## Lighthouse A/B (`ab.json`, 5 runs, medians, mobile)

Before = the 423a732 build (`.next-base`). After = the W02 build.

| Page | perf before → after | LCP ms before → after | CLS |
|---|---|---|---|
| /en | 56 → 56 | 4514 → 4431 | 0 |
| /ar | 53 → 53 | 4593 → 4574 | 0 |
| /en/services/software-digital | 59 → 60 | 4268 → 4200 | 0 |
| /ar/about | 64 → 65 | 4312 → 4287 | 0 |
| /en/links · /ar/links | 100 · 100 | 1293 · 1518 | 0 |

No regression; LCP equal or slightly better on every page.

## axe (`axe.json`)

9 pages (/en, /ar, /en/services, /ar/services/events-hospitality, /en/services/software-digital, /en/work, /ar/about, /en/contact, /ar/products/qr-check-in) at 1440 and 390: no violations.

## Other e2e

ground-switch, category-structure, hero-intro, hero-fit, hero-resize, cards-no-shift, pinned-fit, photo-stories-reduced, locale-switch: all pass. The first run with two workers had 19 hero timeouts at 16 frames a second (machine load); the hero specs re-run alone passed 57/57.
