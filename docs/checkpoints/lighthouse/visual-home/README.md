# Visual portfolio · Home first screen (Task 8, D156)

2026-11-21 · branch `phase-2-services`. Production builds on one machine; nothing else ran while Lighthouse measured.

Before = the `f086c44` build (`.next-base/`, port 3200). After = this task's build (port 3000).

## Lighthouse A/B (`ab.json`, `ab-ar.json`, `scripts/lighthouse-ab.mjs`, mobile, 5 interleaved runs, medians)

| Page | perf | LCP ms (run spread) | TBT ms | Speed Index ms | CLS |
|---|---|---|---|---|---|
| /en | 49 → 55 | 4714 → 4643 (4466–4839 · 4495–4842) | 2079 → 1507 | 5932 → 3420 | 0 → 0 |
| /ar (run 1) | 50 → 52 | 4616 → 4903 (4534–4760 · 4759–4950) | 2309 → 2045 | 5795 → 3722 | 0 → 0 |
| /ar (run 2, alone) | 47 → 52 | 4725 → 4840 (4584–4888 · 4624–5186) | 2734 → 2248 | 6160 → 3740 | 0 → 0 |

- LCP is the title text on both sides. English is level. Arabic is 115–287 ms later, about the size of a run's spread (300–400 ms). In run 1 the "after" side also ran on a 13% slower machine (benchmark index 1118 against 1282).
- Speed Index falls by 2.1–2.5 s on both: the first screen is all there at first paint instead of behind the intro's shutters.
- The first A/B of this task measured /en LCP at 5546 ms (+915). Chrome was reporting the title again, slightly larger, once the scroll pin was built at hydration. The pin is now built on the first scroll, key or touch (D156), and `e2e/first-screen.spec.ts` checks on a 4x-throttled CPU that no title LCP entry arrives after hydration.
- a11y, best practices and SEO are unchanged (100 / 100 / 92).

## axe (`axe.json`, `scripts/axe.mjs`)

/en and /ar at 1440 and 390: no violations.

## Contrast over the photo

The brightest pixel behind each line, with the text hidden (1440 and 390, EN and AR), against the line's own colour: the eyebrow is at least 5.2:1 and the title at least 5.4:1. The lead is at least 5.9:1 and the ghost button at least 8.4:1.

## Layout shift

The font swap (D149) is on screen now that nothing covers it. The title has its own fallback faces matched to its two lines (`hero.css`), and English measures 0 at 1440. Arabic measures 0.0012, from the lead and the buttons, which swap from the site-wide Alexandria faces; that is the same on every Arabic page (OPEN_QUESTIONS #25).

## Shots

`docs/checkpoints/visual/home/{before,after}/`: the first screen at 200 ms after `load` and at 4.5 s, EN and AR, 1440 and 390, on a first visit. At 200 ms the "before" side is the closed shutters (an empty screen); the "after" side is the complete first screen.
