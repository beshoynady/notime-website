# Visual portfolio · Marketing & Brand (Task 11, D159)

2026-11-22 · branch `phase-2-services`. Production builds on one machine. Nothing else ran while Lighthouse measured; the review server on 3100 stayed idle.

Before = the `f086c44` build (`.next-base/`, port 3200). After = the Task 11 build (port 3000).

## Lighthouse A/B (`ab.json`, `scripts/lighthouse-ab.mjs`, mobile, 5 interleaved runs, medians)

| Page | perf before → after | LCP ms before → after (run spread) | TBT ms | CLS |
|---|---|---|---|---|
| /en/services/marketing-brand | 63 → 63 | 4201 → 4339 (4178–4521 · 4221–4373) | 1003 → 960 | 0.0001 → 0 |
| /ar/services/marketing-brand | 56 → 59 | 4603 → 4446 (4555–4802 · 4355–4585) | 1516 → 1219 | 0.0005 → 0 |

The English LCP moves by +138 ms with overlapping run ranges, and the Arabic one by −157 ms, so there's no regression. TBT drops on both: the calendar and press-release modules are gone. a11y, best practices and SEO are unchanged (100 / 100 / 92).

## Contrast (opening, measured against the darkest pixel behind each line, text hidden)

At 1440 and 390, EN and AR: H1 ≥ 9.88:1, lead ≥ 10.53:1, eyebrow ≥ 5.23:1, breadcrumb ≥ 4.84:1.

## axe (`axe.json`, `scripts/axe.mjs`)

/en and /ar/services/marketing-brand (and /en/services/creative-production after the visual-shape change) at 1440 and 390: no violations.

## Shots

`docs/checkpoints/visual/marketing/{before,after}/`: one WebP per section (opening, branding, social, digital, content, PR, paid), EN and AR, 1440 and 390, reduced motion, from `scripts/section-shots.mjs`. Creative's `after` shots were retaken (Photography and Set & stage now keep their own shape).

## e2e

`marketing-photos` 6 passed (2 skipped by design: phones have no opening frame), `opening` (Marketing) 14 passed, `empty-screens` /en/services/marketing-brand 4 passed (added; its first run caught a too-strong blank-page wash), `creative-photos` and Creative `opening`/`empty-screens` passed again, `overflow` + `cta-bar` 35 passed.
