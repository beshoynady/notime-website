# Self-audit B10: scene layers' `sizes` (2026-11-20)

The category scenes' image layers asked for `50vw` (any layer but the ground), whatever their box. A layer
whose box spans 84% of the screen got a file up to 2.5x smaller than it shows. `layerSizes(box)`
(`src/lib/scene-math.ts`, tested) now derives `sizes` from the layer's inline insets.

Gate (D137): `scripts/lighthouse-ab.mjs`, mobile, interleaved, 5 runs, medians. Before = e91ba8a
(the parent: every other self-audit fix, without B10), built to `.next-before` on :3300; after =
e91ba8a + B10 on :3000. Nothing else ran. Rows: `ab.json`.

| Page | LCP before | LCP after | Δ | run-to-run spread (before / after) | CLS |
|---|---|---|---|---|---|
| /ar/services/creative-production (LCP = the scene image) | 4691 | 4801 | +110 | 521 / 73 | 0 / 0 |
| /en/services/creative-production | 4449 | 4459 | +10 | 289 / 250 | 0 / 0 |
| /en/services/events-hospitality | 4900 | 4949 | +49 | 852 / 383 | 0 / 0 |
| /ar/services/marketing-brand | 4614 | 4543 | −71 | 200 / 415 | 0 / 0 |

Every difference is inside the spread, so B10 stays (D137's rule). Creative AR, where the larger file is
the LCP element itself, is the one to watch: +110 ms median, on a page that spread 521 ms before.
