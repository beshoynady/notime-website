# Lighthouse before / after, same machine, interleaved (2026-11-17)

The user's request 1. **Before** = 1852177 (the commit before the final pass), **after** = eedb8e3 (HEAD), both production builds (`NEXT_PUBLIC_ENABLE_LAB=1`) served side by side on this machine (ports 3010 and 3000). `/links` didn't exist at 1852177; its "before" is the React page at 691c033 (port 3020), and per the user its bar is a fixed number (90+ on mobile), not this comparison.

Mobile, Lighthouse 13.5.0 default (simulated 4× CPU, slow 4G). For each run and each page: before, then after, so machine drift hits both alike (`scripts/lighthouse-ab.mjs`, 3 runs, medians; every row in `rows.json`). Times in ms, JS in KB transferred, bench = the machine's benchmark index during the run.

| Page | Side | perf | a11y | bp | seo | fcp | lcp | tbt | cls | si | jsKB | bench |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /en | before | 50 | 100 | 100 | 92 | 2032 | 4417 | 1399 | 0 | 6527 | 319 | 1429 |
| /en | after | 56 | 100 | 100 | 92 | 1545 | 4497 | 1153 | 0 | 4675 | 320 | 1518 |
| /en/services/events-hospitality | before | 56 | 100 | 100 | 92 | 2021 | 4953 | 1189 | 0 | 3541 | 381 | 1483 |
| /en/services/events-hospitality | after | 55 | 100 | 100 | 92 | 1720 | 4598 | 1646 | 0 | 3321 | 323 | 1489 |
| /en/services/creative-production | before | 56 | 100 | 100 | 92 | 1857 | 4781 | 1271 | 0 | 3554 | 381 | 1515 |
| /en/services/creative-production | after | 59 | 100 | 100 | 92 | 1501 | 4648 | 1531 | 0 | 3469 | 323 | 1533 |
| /en/services/marketing-brand | before | 63 | 96 | 100 | 92 | 1859 | 4451 | 843 | 0 | 2730 | 381 | 1531 |
| /en/services/marketing-brand | after | 62 | 96 | 100 | 92 | 1498 | 4153 | 1566 | 0 | 2712 | 323 | 1541 |
| /en/services/production-print-gifts | before | 61 | 100 | 100 | 92 | 1849 | 4780 | 856 | 0 | 3281 | 381 | 1514 |
| /en/services/production-print-gifts | after | 57 | 100 | 100 | 92 | 1531 | 4620 | 1445 | 0.0001 | 3328 | 323 | 1535 |
| /en/services/software-digital | before | 54 | 92 | 100 | 92 | 2007 | 4649 | 1821 | 0 | 3672 | 381 | 1517 |
| /en/services/software-digital | after | 58 | 92 | 100 | 92 | 1786 | 4155 | 1940 | 0 | 2682 | 376 | 1367 |
| /en/links | before | 74 | 100 | 100 | 61 | 1266 | 3925 | 721 | 0 | 2393 | 386 | 1526 |
| /en/links | after | 100 | 100 | 100 | 61 | 615 | 1228 | 47 | 0 | 623 | 0 | 1497 |
| /ar | before | 58 | 100 | 100 | 92 | 1434 | 4513 | 1064 | 0 | 5129 | 319 | 1511 |
| /ar | after | 55 | 100 | 100 | 92 | 1705 | 4358 | 1563 | 0 | 5023 | 320 | 1509 |
| /ar/services/events-hospitality | before | 54 | 100 | 100 | 92 | 2028 | 5135 | 1172 | 0 | 3545 | 381 | 1533 |
| /ar/services/events-hospitality | after | 54 | 100 | 100 | 92 | 2000 | 4596 | 1815 | 0 | 3407 | 323 | 1542 |
| /ar/services/creative-production | before | 57 | 100 | 100 | 92 | 1893 | 4896 | 1172 | 0 | 3552 | 381 | 1521 |
| /ar/services/creative-production | after | 53 | 100 | 100 | 92 | 1555 | 4930 | 1695 | 0.0059 | 3716 | 323 | 1192 |
| /ar/services/marketing-brand | before | 56 | 96 | 100 | 92 | 1878 | 4652 | 1320 | 0 | 3216 | 381 | 1242 |
| /ar/services/marketing-brand | after | 57 | 96 | 100 | 92 | 1512 | 4286 | 1822 | 0 | 3227 | 323 | 1115 |
| /ar/services/production-print-gifts | before | 57 | 100 | 100 | 92 | 1887 | 4913 | 991 | 0 | 3831 | 381 | 1346 |
| /ar/services/production-print-gifts | after | 53 | 100 | 100 | 92 | 1733 | 4472 | 2988 | 0 | 3791 | 323 | 1131 |
| /ar/services/software-digital | before | 52 | 92 | 100 | 92 | 1995 | 4899 | 4542 | 0 | 4413 | 381 | 1043 |
| /ar/services/software-digital | after | 51 | 92 | 100 | 92 | 2123 | 4770 | 2899 | 0 | 3992 | 376 | 1191 |
| /ar/links | before | 61 | 100 | 100 | 61 | 1132 | 4095 | 1353 | 0 | 2581 | 386 | 1119 |
| /ar/links | after | 98 | 100 | 100 | 61 | 732 | 1308 | 170 | 0 | 992 | 0 | 1025 |

## Reading it

- **Performance is flat:** 50–63 before, 51–62 after. D111's "46–58 → 54–62" compared runs on different days (benchmark ~1030 vs ~1520); measured side by side, most of that gain was the machine.
- **Better:** FCP on 11 of 12 pages (about −300 ms; the inlined CSS), LCP on 10 of 12 (−100 to −540 ms), Speed Index on the home page (−1.85 s EN), JS on the four category pages (381 → 323 KB: Software's forms off them).
- **Worse:** TBT on the category pages (+250 to +2000 ms; Print AR is the outlier): the photo stories added in this pass (D109) set up more scroll work on load. Closing that is the v1.1 performance pass (scroll setup after idle, fewer client islands).
- CLS 0 everywhere (0.006 at most).
- Accessibility and best practices are the same on both sides. Accessibility 92/96 on Software and Marketing: `aria-required` on the chip fieldsets and two contrast misses (in both builds; fixed after this run). SEO 92 is the canonical pointing to notimehub.com while the test runs on localhost; it passes on the real domain. `/links` SEO 61 is its `noindex`, on purpose.
