# Visual portfolio · Software & Digital (Task 13, D161)

2026-11-22 · branch `phase-2-services`. Production builds on one machine. Nothing else ran while Lighthouse measured; the review server on 3100 stayed idle.

Before = the `f086c44` build (`.next-base/`, port 3200). After = the Task 13 build (port 3000).

## Phone length (390×844, `document.documentElement.scrollHeight`)

| Page | before | after |
|---|---|---|
| /en/services/software-digital | 23,154 px | 11,382 px |
| /ar/services/software-digital | 22,722 px | 11,085 px |

Under half on both. The six services are one tab set, and the closing has two tabs: the intro call and the website review. On a phone, the problems, steps, tiers, ways, reasons, products and event items are sideways snap rows, and the optional details fold away. `e2e/software-tabs.spec.ts` keeps the phone page under 11,500 px.

## Lighthouse A/B (`ab.json`, `scripts/lighthouse-ab.mjs`, mobile, 5 interleaved runs, medians)

| Page | perf before → after | FCP ms | LCP ms | TBT ms | CLS |
|---|---|---|---|---|---|
| /en/services/software-digital | 56 → 57 | 2017 → 1833 | 4265 → 4306 | 2088 → 1868 | 0 → 0 |
| /ar/services/software-digital | 51 → 54 | 2560 → 1945 | 4426 → 4372 | 3106 → 2865 | 0 → 0 |

LCP is flat, and FCP and TBT are lower, because the drawn service visuals and their draw loop are gone. JS is 407 → 405 KB. a11y, best practices and SEO are unchanged (100 / 100 / 92). The high TBT was there before and is left to Task 16.

## axe (`axe.json`, `scripts/axe.mjs`)

/en and /ar/services/software-digital at 1440 and 390: no violations. The new sideways rows with no focusable content get `tabIndex=0` and a label (scrollable-region-focusable).

## Bug found on the way (reduced motion, phone)

In reduced motion the document was 1,284 px wide at 390. The cause: the problem cards' screen-reader labels (`.sr-only`, absolutely positioned) had no positioned ancestor. They anchored to the page and escaped the row's horizontal clip. With motion on, GSAP's transforms on the cards formed a containing block and hid it. The fix: `position: relative` on the shared phone-row rule. `empty-screens` caught it.

## Shots

`docs/checkpoints/visual/software/{before,after}/` holds one WebP per section (hero, proof, problems, services, process, products, quality, tiers, ways, closing) in EN and AR at 1440 and 390, in reduced motion, from `scripts/section-shots.mjs`. Before, the closing section is the old review card (`.sw-review`).

## e2e

`software-tabs`: 18 passed, 2 skipped (the phone-length check runs on the phone only). On the final build, `empty-screens`, `overflow`, `software-tabs` and `category-structure` (filtered): 119 passed, 76 skipped. One failure: overflow /ar/services/events-hospitality at 360, a 30 s `page.evaluate` timeout in an hour-long run. It passed alone in 4.3 s, so it's a flake from machine load, not an overflow.
