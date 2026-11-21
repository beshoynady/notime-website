# axe-core on the nine pages (2026-11-19)

Build: production `npm run build` of `2ae25bd` (Turnstile test keys, as e2e), served on port 3000.
Rules: WCAG 2.0/2.1 A and AA (`scripts/axe.mjs`), Chrome, 1440×900 and 390×844 (touch).
Pages, EN and AR: `/`, `/services`, `/services/events-hospitality`, `/services/software-digital`, `/work`, `/work/football-league-events-awards`, `/about`, `/contact`, `/links`.

| Pass | Runs | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|---|
| As loaded (`before.json`) | 36 | 0 | 0 | 0 | 0 |
| Reduced motion, every section in its final state (`reduced.json`) | 36 | 0 | 0 | 0 | 0 |

No fix was needed, so there is no "after" run: before and after are both 0. The second pass exists because a section still waiting for its scroll reveal can escape the contrast rule; under reduced motion nothing waits.

Command: `MSYS_NO_PATHCONV=1 node scripts/axe.mjs http://localhost:3000 /en /en/services … /ar/links --out=docs/checkpoints/final/axe/before.json`
