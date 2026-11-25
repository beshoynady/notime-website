# Home film · Lighthouse (D174, D176)

2026-11-24 · branch `home-film`, production builds on port 3100. Mobile, 3 runs, medians (`summary.json`, `raw/`, `scripts/lighthouse.mjs`). Nothing else ran while it measured.

## Final (the scenes' motion built on the first move, D176)

| Page | perf | FCP ms | LCP ms | TBT ms | Speed Index ms | CLS | LCP element |
|---|---|---|---|---|---|---|---|
| /en first visit | 56 | 1397 | 4516 | 1866 | 3034 | 0 | the H1 |
| /en return | 83 | 829 | 1129 | 702 | 903 | 0 | the H1 |
| /ar first visit | 54 | 1389 | 4608 | 2339 | 3081 | 0 | the H1 |
| /ar return | 78 | 871 | 1231 | 991 | 936 | 0 | the H1 |

a11y / best practices / SEO: 100 / 100 / 92 on all four. The H1 is the LCP in all 12 runs.

## Against the last home checkpoint (`visual-home`, D156) and the first film build

| | D156 hero | film, motion at hydration (`072cf3a`) | film, final |
|---|---|---|---|
| /en LCP | 4643 (the H1) | 4824 (the plate) | **4516 (the H1)** |
| /ar LCP | 4840–4903 (the H1) | 4973 (the plate) | **4608 (the H1)** |
| /en TBT | 1507 | 3369 | 1866 |
| /ar TBT | 2045–2248 | 4299 | 2339 |
| CLS | 0 / 0 | 0 / 0.0004 | 0 / 0 |

- The first film build measured every scene's ScrollTriggers at hydration: 4 s of Style & Layout on a throttled CPU, and the opening plate, transformed by GSAP after it had painted, was reported as a new and larger LCP. Building the motion on the first scroll, key or touch, with the dolly's first frame set in CSS, fixes both.
- LCP is 130–230 ms ahead of D156, about half a run's spread (300–400 ms): level or slightly better, with no regression. TBT is within 200–400 ms of D156. These are not interleaved A/B runs.
