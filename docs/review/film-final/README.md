# Home film · final shots (D174–D176)

Production build of branch `home-film` (2026-11-24).

- `shots/{ar,en}-{1366x768,1440x900,390x844}-s{0..6}.jpg`: every scene once it has settled (s0 = the first screen, s6 = the finale).
- `film-scroll-{ar,en}-1440.gif`: one scroll through the whole film at 1440×900 (frames shot at half scale, 46 frames).

## Checks on this build

- Nothing cut off at any scene at 1366×768, 1280×720, 1440×900, 390×844 and 375×667, in both AR and EN (the film-check script and `e2e/film.spec.ts`).
- Images on a phone (390×844, DPR 3, the whole home page scrolled): /en 256 KB, /ar 324 KB. The cap is 1.5 MB.

## Photos and licenses

All stock is under the [Unsplash License](https://unsplash.com/license) and credited in `src/content/media.ts`. The recipes are in `docs/content/recipes/home-film.json`.

| Scene | Photo | Photographer |
|---|---|---|
| 0 Opening, 3 Marketing | [elEIyWEj-bM](https://unsplash.com/photos/elEIyWEj-bM) empty hall | National Asian Culture Center |
| 1 Events | [sol7vhs8Pdg](https://unsplash.com/photos/sol7vhs8Pdg) beams on a truss, confetti taken out | Kevin Yudhistira Alloni |
| 2 Creative | [kbd1oAf-9Ms](https://unsplash.com/photos/kbd1oAf-9Ms) cinema camera, backlit, no brand | Jakob Owens |
| 4 Print & Gifts | [gUfRIiyltf0](https://unsplash.com/photos/gUfRIiyltf0) gift on a gold charger | Nathan Mullet |
| 5 Software & Digital | [MLLmIskI6LU](https://unsplash.com/photos/MLLmIskI6LU) the lit way in, blurred | Joshua Ferrer |
| 6 Finale | `p9-2`, the dressed hall | NO TIME (Rand's profile photo) |

The campaign screens, the phone, the name card, the viewfinder, the check-in tablet and the dial are drawn in code, with real localized text and «مثال» / "Example" on demo data. None of them shows a logo.
