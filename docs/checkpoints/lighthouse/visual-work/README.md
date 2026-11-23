# Visual portfolio · Work and the close (Tasks 15–16, D164, D165)

2026-11-23 · branch `phase-2-services`. Production builds on one machine. Nothing else ran while Lighthouse measured.

Before = the `f086c44` build (`.next-base/`, port 3200). After = the close build (port 3000).

## Lighthouse A/B, Work index (`ab.json`, mobile, 5 interleaved runs, medians)

| Page | perf | LCP ms before → after (run spread) | TBT ms | CLS | LCP element (both sides) |
|---|---|---|---|---|---|
| /en/work | 56 → 54 | 4349 → 4634 (4212–4390 · 4388–4969) | 2403 → 2059 | 0 → 0 | `p.wk-intro` |
| /ar/work | 55 → 53 | 4452 → 4691 (1653–4651 · 4647–4922) | 2974 → 2635 | 0.0001 → 0 | `p.wk-intro` |

The LCP stays text. The index now shows six photo cards (7 lazy images, about 25 KB more HTML) where it showed two text cards. The median rises about 250 ms, while TBT falls. a11y, best practices and SEO are unchanged (100 / 100 / 92).

## A collection page (new, after only, 3 runs, medians)

| Page | perf | LCP ms (runs) | CLS | LCP element |
|---|---|---|---|---|
| /en/work/rooms-we-dressed, first photo lazy | 54 | 4777 (4478, 4777, 4919) | 0 | the first gallery photo |
| /ar/work/rooms-we-dressed, first photo lazy | 51 | 5083 (4073, 5285, 5083) | 0.0001 | the first gallery photo |
| /en/work/rooms-we-dressed, first photo priority (D165) | 56 | 4678 (4860, 4326, 4678) | 0 | the first gallery photo |
| /ar/work/rooms-we-dressed, first photo priority (D165) | 52 | 5035 (5647, 5035, 4272) | 0.0001 | the first gallery photo |

The first photo is in the first screen at all seven sizes (1440×900 to 360×740), EN and AR, and it is larger than the H1, so it is the LCP, as Home's hero plate is (D158). It now loads eager with `fetchPriority="high"` and no preload link. The others stay lazy. The change sits inside the run noise. It is the correct loading order, and it doesn't make the photo faster in the lab.

## axe (`axe-all.json`)

46 pages (EN and AR: Home, the services index, the five categories, Work, both cases, the four collections, About, both products, Contact, Links, the three legal pages and the 404) at 1440 and 390: no violations at any impact.

## Empty screens (`scripts/empty-screens.mjs`, 7 sizes, 19 pages, limit 45%)

- With motion: 20 stops over 45%.
- Reduced motion: 14 stops.

There are two kinds:

1. The dark opening of an Events photo scene (the stage before the beam): 53% at 1024×768, 50% at 360×740 and 48% at 390×844. This is the approved storyboard beat.
2. About 378 px between the last service's button and Related work on the four photo category pages (45–47%), and the bottom of `/en/services` at 1366 and 1280 (46–47%). Both are identical on the baseline build, so they predate this branch. The report lists them as proposals.

The e2e gate (50%, `e2e/empty-screens.spec.ts`) passes.
