# Photo stories at 4× CPU (decision #31)

`node scripts/scroll-jank.mjs --url=… --sel=… --width=… --runs=3 [--warm]`, production build, Chrome, CPU throttled 4× through CDP, scrolling through the story at 1000 px/s. Medians of 3 runs (raw: `scroll-4x-raw.txt`). Cold = first visit (photos load and decode during the scroll); warm = the photos already decoded, so what's left is the scroll work. Under 33 ms = 30 fps or better. 2026-11-17, after the tone fix (D115).

| Story | Width | Cold: p95 | Cold: > 33 ms | Cold: longest | Warm: p95 | Warm: > 33 ms | Warm: longest |
|---|---|---|---|---|---|---|---|
| Events opening (`.scene-pin`) | 1440 | 33 ms | 6.7% | 100 ms | 33 ms | 1.3% | 34 ms |
| Events opening | 390 | 17 ms | 1.9% | 67 ms | 17 ms | 0% | 17 ms |
| Events, private celebrations stack | 1440 | 33 ms | 2.0% | 67 ms | 17 ms | 0% | 33 ms |
| Events, private celebrations stack | 390 | 17 ms | 2.7% | 50 ms | 17 ms | 0% | 17 ms |
| Home, photo strip | 1440 | 17 ms | 0.5% | 117 ms | 17 ms | 0.5% | 100 ms |
| Home, photo strip (a swipe row) | 390 | 17 ms | 1.4% | 133 ms | 17 ms | 1.4% | 67 ms |
| About, one evening | 1440 | 17 ms | 0.4% | 67 ms | 17 ms | 0% | 33 ms |
| About, one evening | 390 | 17 ms | 0.5% | 50 ms | 17 ms | 0% | 33 ms |
| Print opening (AR) | 1440 | 33 ms | 0.7% | 117 ms | 17 ms | 1.3% | 33 ms |
| Print opening (AR) | 390 | 17 ms | 2.0% | 117 ms | 17 ms | 0% | 33 ms |
| Privacy (no animation, baseline) | 1440 | 17 ms | 0% | 17 ms | 17 ms | 0% | 17 ms |
| Privacy (baseline) | 390 | 17 ms | 0% | 17 ms | 17 ms | 0% | 17 ms |

Before the tone fix, the home strip at 390 (warm) had 26.7% of frames over 33 ms, p95 150 ms: the dark → ivory turn just below it tweened `--page-bg`, an inherited custom property, on `#page-stage`, so every element on the page was re-styled each frame (~90 ms of forced style and layout per frame, long-animation-frame entries). The stage now tweens its own `background-color`: 1.4%, p95 17 ms. The same turn exists on every page.
