# The brand fonts swap in one step (D149)

2026-11-20 · `phase-2-services`. Before = the 423a732 build (`.next-base`), after = D149. Mobile, interleaved, medians. The machine was slower than for W02 (benchmark index ~1100–1300 against ~1540), so compare the two sides, not with `../w02`.

| Page | perf before → after | LCP ms before → after | CLS |
|---|---|---|---|
| /en | 50 → 51 | 4606 → 4517 | 0 |
| /ar | 47 → 47 | 4787 → 4700 | 0 |
| /en/services/software-digital | 57 → 62 | 4049 → 3553 | 0 |
| /ar/about (5 runs) | 58 → 58 | 4412 → 4490 | 0 |
| /ar/about (8 runs, `ab-ar-about.json`) | 55 → 57 | 4591 → 4429 | 0 |
| /en/links | 100 | 1291 | 0 |

The 5-run +78 ms on /ar/about was inside the spread (4308–4442 against 4256–4602); the 8-run check came out −162 ms. No regression.
