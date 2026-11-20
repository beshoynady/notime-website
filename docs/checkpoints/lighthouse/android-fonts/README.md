# Android fallbacks (D145): Lighthouse before/after

Gate (D137): `scripts/lighthouse-ab.mjs`, mobile, interleaved, 5 runs, medians. Before = 423a732 (built into `.next-base`), after = the D145 working tree (with D146). Nothing else ran during the measurement.

| Page | perf before → after | LCP before → after | Δ LCP | LCP spread (before / after) | CLS |
|---|---|---|---|---|---|
| /en | 48 → 48 | 4694 → 4651 | −43 | 1300 / 393 | 0 |
| /ar | 45 → 44 | 4758 → 4926 | +168 | 2395 / 352 | 0 |
| /en/services/software-digital | 53 → 57 | 4139 → 3906 | −233 | 1561 / 1037 | 0 |
| /ar/about | 55 → 54 | 4567 → 4671 | +104 | 400 / 474 | 0 |
| /en/links | — → 100 | — → 1300 | | — / 121 | 0 |
| /ar/links | — → 99 | — → 1512 | | — / 20 | 0 |

Every LCP difference is inside the run-to-run spread, so nothing got worse. The home's absolute score (48) is below the 52–55 of earlier days on both sides alike: the machine was slower in this session (benchmark index about 1,100–1,200), not the change. Raw rows: `ab.json`.
