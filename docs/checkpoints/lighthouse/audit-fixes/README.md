# Lighthouse, audit fixes (mobile, interleaved A/B, same machine)

Lighthouse default mobile (simulated 4× CPU, slow 4G); `scripts/lighthouse-ab.mjs` runs before then after for each run and page, so machine drift hits both sides alike. Medians; every run in the JSON beside this file. Rule (owner, 2026-11-18): if LCP or CLS gets worse than the run-to-run spread, the causing change is cancelled on that page.

## Task 11 (N05, home hero), the stop-point gate

**1. e19404f (before the audit fixes) vs 08f1eee (Tasks 0–11), 3 runs** (`home.json`):

| Page | LCP before | LCP after | Δ | CLS after |
|---|---|---|---|---|
| /en | 4557 | 4560 | +3 | 0 |
| /ar | 4471 | 4681 | +210 | 0 |

The /ar change sits outside the spread recorded on 2026-11-17 (124 ms) but inside this run's own before-side spread (435 ms). Both sides here include Tasks 0–10 as well, so the run doesn't say which change caused it.

**2. Task 11 alone: c679067 (Tasks 0–10) vs 08f1eee (+ Task 11), 5 runs** (`home-task11-isolated.json`):

| Page | LCP before (runs) | LCP after (runs) | Median Δ | CLS |
|---|---|---|---|---|
| /ar | 4478, 4703, 5026, 4926, 5150 → **4926** | 4703, 4703, 4841, 4907, 4970 → **4841** | **−85** | 0 / 0 |
| /en | 4503, 4531, 5136, 4649, 5433 → **4649** | 4605, 4663, 4751, 5049, 4673 → **4673** | **+24** | 0 / 0 |

Spread (max − min): /ar before 672, after 267; /en before 930, after 444. The machine was loaded in places (benchmark index 565–1481), and the interleaving shares that load between the sides.

**Decision:** Task 11 passes. On its own it doesn't worsen LCP (−85 ms on /ar, +24 ms on /en, both well inside the spread), and CLS stays 0. The LCP element is the H1 text on every run. Kept.

**Carried to Task 15:** home JS transferred went from 320 KB (e19404f) to 376 KB (c679067), so Tasks 0–10 added about 56 KB to the home page. Task 11 adds none (376 KB on both sides). Find the source before the final measurement.
