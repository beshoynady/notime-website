# Final Lighthouse (mobile, 2026-11-19)

One measurement, as the owner asked (D136): home and `/links`, EN and AR, Lighthouse 13.5.0 default mobile (simulated 4× CPU, slow 4G), 3 runs each, medians; production build of e04012f on this machine, nothing else running (`scripts/lighthouse-pages.mjs`). Every run in the JSON beside this file.

| Page | Perf | A11y | Best practices | SEO | LCP | TBT | CLS | LCP element |
|---|---|---|---|---|---|---|---|---|
| /en | 55 | 100 | 100 | 92 | 4580 ms | 1234 ms | 0 | the H1 (text) |
| /ar | 52 | 100 | 100 | 92 | 4579 ms | 1943 ms | 0 | the H1 (text) |
| /en/links | **100** | 100 | 100 | 61 | 1139 ms | 68 ms | 0 | the lead (text) |
| /ar/links | **100** | 100 | 100 | 61 | 1296 ms | 81 ms | 0 | the lead (text) |

- `/links` passes its bar (≥ 95). Its SEO score is 61 because the page is `noindex` on purpose (a link-in-bio page; it shouldn't compete with the home page in search).
- Home performance is where it was before the audit fixes (50–58 on 2026-11-17): the LCP is text, there is no layout shift, and the cost is JavaScript (TBT). Performance work is v1.1 (D136).
