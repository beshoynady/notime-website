# Home film · Lighthouse (D174)

2026-11-24 · branch `home-film`, the `072cf3a` production build on port 3100. Mobile, 3 runs, medians (`summary.json`, `raw/`, `scripts/lighthouse.mjs`). Nothing else ran while it measured.

| Page | perf | FCP ms | LCP ms | TBT ms | CLS | a11y / bp / seo |
|---|---|---|---|---|---|---|
| /en first visit | 51 | 1397 | 4824 | 3369 | 0 | 100 / 100 / 92 |
| /en return | 73 | | 1279 | | 0 | |
| /ar first visit | 48 | 1418 | 4973 | 4299 | 0.0004 | 100 / 100 / 92 |
| /ar return | 71 | 766 | 1448 | 2408 | 0 | |

## Against the last home checkpoint (`visual-home`, D156)

- LCP: /en 4643 → 4824 ms (+181), /ar 4840–4903 → 4973 ms (+70 to +133). A run's spread on this machine is 300–400 ms, so the time is level. This was not an interleaved A/B, so treat it as indicative.
- **The LCP element changed.** It was the title text; it is now the opening plate (`img.film-img`, the empty hall, full screen). The title, both lines and both buttons are still painted at first paint (FCP ≈ 1.4 s). The photo is larger than the text, so Chrome names it once it lands. Logged as a decision to confirm (row 85).
- CLS: 0 on /en. /ar has 0.0004 on one first run: the Alexandria swap on the lead and buttons, the same site-wide swap as before (OPEN_QUESTIONS #25).
- TBT is higher than D156's (1507–2248 ms). The film builds a ScrollTrigger for every scene at hydration; the throttled-CPU first run carries that.
