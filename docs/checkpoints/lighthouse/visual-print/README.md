# Visual portfolio · Production, Print & Gifts (Task 12, D160)

2026-11-22 · branch `phase-2-services`. Production builds on one machine. Nothing else ran while Lighthouse measured; the review server on 3100 stayed idle.

Before = the `f086c44` build (`.next-base/`, port 3200). After = the Task 12 build (port 3000).

## Lighthouse A/B (`ab.json`, `scripts/lighthouse-ab.mjs`, mobile, 5 interleaved runs, medians)

| Page | perf before → after | LCP ms before → after (run spread) | TBT ms | CLS |
|---|---|---|---|---|
| /en/services/production-print-gifts | 63 → 60 | 4378 → 4640 (4320–4696 · 4464–4746) | 932 → 1037 | 0.0002 → 0.0001 |
| /ar/services/production-print-gifts | 58 → 54 | 4580 → 4921 (4524–4698 · 4743–4971) | 1171 → 1619 | 0.0016 → 0.0014 |

A second run (3 interleaved, not kept) gave EN 4427 → 4624 (one after-run at 3478), AR 4497 → 4943, TBT 984 → 945 and 978 → 1035, so the TBT rise in the first run was noise and the simulated Arabic LCP rise repeats.

**Why the simulated LCP rises while the page paints sooner.** The LCP element changed: before, it was the drawn ribbon (`div.scene-light.fx-ws-ribbon`); now it's the H1, as the project rule asks (LCP is text). In a real browser (Playwright, Chrome, 412×823 at DPR 1.75, CPU ×4, `PerformanceObserver`), the observed LCP is:

| Page | before | after |
|---|---|---|
| /ar/services/production-print-gifts | 1928 ms (the drawing) | 1088 ms (H1, at first paint) |
| /en/services/production-print-gifts | – | 936 ms (H1, at first paint) |
| /ar/services/marketing-brand (reference) | – | 1008 ms (H1, at first paint) |

The H1 paints at FCP, with no hydration warnings and no CSS or JS gate on it. Lighthouse's simulated LCP (Lantern) places the text candidate after the whole simulated main thread and the late Montserrat request, which is why every category page reports about 4.3–4.9 s. That's a lab-model effect; the real paint is earlier. It's left to Task 16 (performance, after M3), with this note as the evidence. a11y, best practices and SEO are unchanged (100 / 100 / 92).

## Contrast (opening, measured against the darkest pixel behind each line, text hidden)

At 1440 and 390, EN and AR: H1 ≥ 9.69:1, lead ≥ 6.25:1, eyebrow ≥ 5.22:1, breadcrumb ≥ 4.98:1. The first measure caught the EN breadcrumbs at 3.96:1 over the press's dark top; the workshop overlay gained a short ivory band from the top.

## axe (`axe.json`, `scripts/axe.mjs`)

/en and /ar/services/production-print-gifts at 1440 and 390: no violations.

## Shots

`docs/checkpoints/visual/print/{before,after}/`: one WebP per section (opening, printing, fabrication, packaging, gifts, ordering, merchandise), EN and AR, 1440 and 390, reduced motion, from `scripts/section-shots.mjs`.

## e2e

`print-photos`, `opening`, `category-modules`, `photo-stories-reduced` and `pin-build-scroll` filtered to Print: 30 passed, 4 skipped (phones have no opening frame); `empty-screens` /ar/services/production-print-gifts 4 passed (added); `overflow` + `anchor-scroll` 36 passed.
