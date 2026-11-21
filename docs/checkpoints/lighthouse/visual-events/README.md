# Visual portfolio · Events (Tasks 2–6, D150–D155)

2026-11-21 · branch `phase-2-services`. Production builds on one machine. Nothing else ran while Lighthouse measured; the review server on 3100 stayed idle.

Before = the `f086c44` build (the commit before the mandate, built into `.next-base/`). After = `b5863b2` (Events I–VI as photo scenes, the hero film on a laptop, the work strips).

## Lighthouse A/B (`ab.json`, `scripts/lighthouse-ab.mjs`, mobile, 5 interleaved runs, medians)

| Page | perf before → after | LCP ms before → after (run spread) | TBT ms | CLS |
|---|---|---|---|---|
| /en | 51 → 51 | 4485 → 4537 (4057–4608 · 4300–4766) | 1754 → 1844 | 0 → 0 |
| /ar/services/events-hospitality | 51 → 53 | 5001 → 5018 (4594–5142 · 4747–5077) | 2382 → 1804 | 0.0013 → 0.0013 |

LCP moves by +52 ms and +17 ms, well inside a run spread of about 500 ms, so there's no regression. The Events CLS of 0.0013 is the same on the `f086c44` build, so it was already there and this work doesn't add to it. a11y, best practices and SEO are unchanged (100 / 100 / 92).

## axe (`axe.json`, `scripts/axe.mjs`)

/en, /ar, /en/services/events-hospitality and /ar/services/events-hospitality at 1440 and 390: no violations.

## Shots

`docs/checkpoints/visual/events/{before,after}/`: one WebP per section (opening, I–VI), EN and AR, 1440 and 390, reduced motion (each scene's end frame), from `scripts/section-shots.mjs`. The header in the middle of some shots is how the tool captures the fixed header in a full-page clip, the same on both sides.

## Review Focus

- 4: deep links to `#hospitality` and `#stage` (pinned scenes) land on the H2: `e2e/service-scenes.spec.ts`.
- 5: no eager image below the first screen: `e2e/eager-fold.spec.ts`. It found one, the footer logo (eager in every page's footer). It's now lazy, and only the header logo stays eager.

## e2e (Task 6)

service-scenes, events-animatic, category-modules, category-index, photo-stories-reduced, overflow, header-autohide, opening, pinned-fit: all pass after two fixes. The rail over a scene is now reachable by Tab (it used to be `visibility: hidden`). The mobile majlis test now skips laptop-only beats.
