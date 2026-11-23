# Visual portfolio · About and the product pages (Task 14, D162)

2026-11-22 · branch `phase-2-services`. Production builds on one machine. Nothing else ran while Lighthouse measured.

Before = the `f086c44` build (`.next-base/`, port 3200). After = the Task 14 build (port 3000).

## Lighthouse A/B (`ab.json`, mobile, 5 interleaved runs, medians)

| Page | perf | LCP ms before → after (run spread) | LCP element (both sides) |
|---|---|---|---|
| /en/products/minute-zero | 61 → 61 | 3916 → 4175 (1778–4311 · 2201–4216) | `p.sw-lead` |
| /ar/products/peak-hour | 59 → 58 | 4153 → 4282 (3552–4732 · 4230–4558) | `p.pp-hook` |
| /en/about | 58 → 58 | 4454 → 4427 | `h1#ab-title` |
| /ar/about | 56 → 55 | 4285 → 4542 (4136–5332 · 1745–4906) | `h1#ab-title` |

The LCP element is the same text on both sides in every run. The runs split into two modes (about 1.7–2.2 s and about 4 s), and the medians move with how many runs land in the fast one, so the after medians sit inside the before spread. CLS is 0, and a11y, best practices and SEO are unchanged (100 / 100 / 92).

**First attempt, not kept:** the photo behind the hero's concept screens. It became the LCP on both pages, and the median rose about 500 ms (4003 → 4517, 4232 → 4647) against the plan's "LCP never worse". A CSS or pseudo-element background counts the same in Chrome (measured). So the photo moved to the problem section below the first screen. On laptops it starts where the words start, after a plain espresso lead-in, because the band's top shows in the first screen at 1024–1536 px. A 1920×1080 screen still sees about 170 px of it.

## Contrast (problem band, glyph boxes, text hidden, darkest-to-brightest pixel behind)

At 1440 and 390, EN and AR, Minute Zero and Peak Hour: label ≥ 5.24:1, problem line ≥ 5.14:1, detail ≥ 5.79:1 (in ivory over the photo).

## axe (`axe.json`)

/en and /ar About, Minute Zero and Peak Hour at 1440 and 390: no violations.

## Shots

`docs/checkpoints/visual/about-products/{before,after}/`: About (top, the evening story) and both product pages, EN and AR, 1440 and 390, reduced motion.

## e2e

`empty-screens`, `overflow`, `photo-stories-reduced` and `products`, filtered to About, the products and the stories: 16 passed. The product form spec needs the Turnstile test secret at **runtime** (`TURNSTILE_SECRET_KEY=… npx next start`). Without it, a production build fails closed (D66), on the baseline too.
