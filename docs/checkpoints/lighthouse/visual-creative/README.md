# Visual portfolio · Creative Production (Task 10, D158)

2026-11-21 · branch `phase-2-services`. Production builds on one machine. Nothing else ran while Lighthouse measured; the review server on 3100 stayed idle.

Before = the `f086c44` build (`.next-base/`, port 3200). After = the Task 10 build (port 3000).

## Lighthouse A/B (`ab.json`, `scripts/lighthouse-ab.mjs`, mobile, 5 interleaved runs, medians)

| Page | perf before → after | LCP ms before → after (run spread) | TBT ms | CLS |
|---|---|---|---|---|
| /en/services/creative-production | 51 → 50 | 4588 → 4789 (3886–4862 · 4776–5065) | 4576 → 3788 | 0 → 0 |
| /ar/services/creative-production | 48 → 52 | 4929 → 4843 (4678–5434 · 4655–4962) | 4342 → 2647 | 0 → 0.0005 |

The English LCP moves by +201 ms and the Arabic one by −86 ms, both inside a run spread of about 1 s, so there's no regression. TBT drops on both: the motion playground and the rental module are gone. The Arabic CLS of 0.0005 is the site-wide Alexandria fallback swap (OPEN_QUESTIONS #25), under the 0.002 Arabic limit. a11y, best practices and SEO are unchanged (100 / 100 / 92).

## axe (`axe.json`, `scripts/axe.mjs`)

/en and /ar/services/creative-production at 1440 and 390: no violations.

## Shots

`docs/checkpoints/visual/creative/{before,after}/`: one WebP per section (opening, photography, video, motion, AI content, set design, rental), EN and AR, 1440 and 390, reduced motion (each scene's end frame), from `scripts/section-shots.mjs`.

## e2e

`creative-photos` 6 passed (2 skipped by design: phones have no opening frame), `opening` (Creative) 14 passed, `empty-screens` /ar/services/creative-production 4 passed (added to the list), `overflow` + `anchor-scroll` 36 passed.
