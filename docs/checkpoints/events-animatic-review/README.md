# Events animatic: independent review (2026-11-08, D73)

Lab route `/[locale]/lab/events-animatic`, production build with `NEXT_PUBLIC_ENABLE_LAB=1`.

- **2A:** a fresh reviewer that never saw the storyboard or the build history. It used headless Chrome at 1440×900 (wheel) and 390×844 (touch), EN and AR, and applied design-critique, ui-ux-pro-max and accessibility-review.
- **2B:** an intent check against the storyboard and the Evening theme (frontend-design).
- **Numbers:** medians of 3 runs, 5 for CLS, all on a local machine. Their scripts stay outside the repo.

## Findings

| # | Issue | Evidence | Sev | Fix | Owner | Status |
|---|---|---|---|---|---|---|
| 1 | The page ground turned one pin length early. Stage read as ivory on ivory, the FAQ as espresso on espresso. | Ground ivory at y 7978–8760 (desktop) while Stage's text was ivory. The offset equals the 1800px pin. | High | ToneController's zones refresh last (`refreshPriority: -1`). They only read layout, so every pin's spacing is in place before they measure. | GSAP | Fixed; e2e red/green |
| 2 | The majlis didn't read as the peak. | A 882×760 card in the column, covering at most 52% of the screen, against the opening's 100%. | High | Full bleed, one screen tall (viewport minus header and chip bar); the H2 stays on the column line. | CSS | Fixed: 1440×832, 92% |
| 3 | Mobile findability failed. | Catering chip at x = 940 on a 390px screen: 3–5 actions, up to 4.6 s. | High | An "all services" toggle (44px) at the chip bar's inline-start opens the same six links as rows. | Motion/React + CSS | Fixed: 2 actions, 1.4 s |
| 4 | Opening lines were too brief to read. | Desktop normal pace: 0.40–0.57 s per line; 26% of the pin had no fully legible line (two 0.08 vh fades). | High | Lines cross-fade over 0.06 vh centred on the shot boundary. The pin and shot ranges are unchanged. | GSAP | Improved (see table below). The rest needs a shot-list call (P1). |
| 5 | Frame drops in the opening. | 19.6% of frames over 18 ms at 4× CPU (baseline 0.4%). | Med | Layers are promoted only while the scene's trigger is active (`data-live`), and only boxes that tween. | CSS/GSAP | Fixed: 1.0% |
| 6 | Index landing on Catering showed the heading far down, with the intro below the fold. | Heading 702px below the header; intro below the fold. | Med | Solved by #2: the scene fills the screen under the bars, and the H2 and promise sit in its lower third, above the fold. The WhatsApp button keeps clear (96px end padding on mobile). | CSS | Fixed |
| 7 | Chips too short for touch. | 38.5px | Med | `min-block-size: 44px` on the chips. The chip bar is now 61px, one token (`--scene-top-extra`). | CSS | Fixed |
| 8 | Breadcrumb hit areas too small. | 15px tall | Med | 44px hit area through padding and a matching negative margin, so the line doesn't move. | CSS | Fixed |
| 9 | Language toggle under 44px. | Bounding box 35.8px | — | Not an issue: its `::before` extends the hit area by 7px on each side (49.8px). | — | No change |
| 10 | Rail numerals failed contrast. | 3.76:1 at 10.9px | Low | Numerals in the theme accent at full opacity (spec §5.1: champagne). | CSS | Fixed |
| 11 | Promise not set larger (storyboard shot 4). | All lines the same size | Med (intent) | The last line is larger, and the cell reserves two lines so a wrap or font swap can't move the H1. | CSS | Fixed |
| 12 | Category intro (a TODO placeholder) competed with the shot line in the frame. | Not in the storyboard frames | Med (intent) | With a scene, the intro follows the opening. Same copy, same DOM position relative to the skip control. | Layout | Fixed |
| 13 | All scrubbed tweens were linear. | `ease: none` throughout | Low (intent) | Entrances `power2.out`, light keys `sine.inOut`. | GSAP | Fixed |
| 14 | The index overlaps the opening from frame 0, so the first beat is busy. | Rail over the scene; in the animatic it collides with box labels | Med | D64 requires the index from the first frame. | — | Proposal P3 |
| 15 | The quote block has no action. | No link or button | High | Contact details missing (CONTENT_CHECKLIST #7); form pipeline is Task 4.2. | content | Proposal P6 |
| 16 | Roman numerals read as alef «ا» in Arabic. | I–VI in the index, eyebrow and sections | Low | Theme and convention call. | content | Proposal P4 |
| 17 | The eyebrow's "I ·" means nothing to a visitor. | "I · 6 SERVICES" | Low | Copy and convention call. | content | Proposal P5 |
| 18 | A focused heading shows no focus ring after a landing. | `outline: none` (D53, by design) | Low | `tabindex=-1` headings aren't interactive. | — | Proposal P7 |
| 19 | AR LCP about 0.6–0.75 s later than EN. | Font swap re-times the H1 | Low | Known and accepted (D45, D49). Task 16 subsets Alexandria. | — | No change |
| 20 | Live-build intent not in the animatic yet. | No light-wipe transition between shots 1 and 2, no glow hand-off to section I, no candle flicker or "candle point" on the active rail item; the glasses box ends under the skip control; the majlis tent box sits under the rail on desktop. | — | Task 3.2 (live layers and cutout placement). | GSAP/CSS | Task 3.2 |

## Before → after

| Measure | Before | After |
|---|---|---|
| Pin length | 1800px = 2.00 vh desktop · 1013px = 1.20 vh mobile | unchanged (at the limit) |
| Time to clear the opening, normal pace (100px / 120 ms) | desktop 2.41 s · mobile 1.50 s | desktop 2.34 s · mobile ≈ same (touch timing noisy, 1.9–2.5 s under load) |
| Time to clear the opening, slow pace (100px / 300 ms) | desktop 5.58 s | desktop 5.61 s |
| Line dwell at full opacity, normal pace, lines 1–3 | desktop 0.40–0.57 s | desktop 0.52–0.62 s |
| Line dwell, slow pace, lines 1–3 | desktop 1.02–1.15 s | desktop 1.25–1.38 s |
| Pin with no fully legible line | 470 of 1800px (26%) | ≈ 160 of 1800px (9%), only inside the cross-fades |
| Catering via the index | desktop 1 action, 1.35 s · mobile 3 actions, 2.84 s | desktop 1 action, 1.35 s · mobile 2 actions, 1.40 s (EN), 1.45 s (AR) |
| Catering via skip, then index | desktop 2 actions, 2.84 s · mobile 4–5 actions, 4.3–5.3 s | desktop 2 actions, 2.85 s · mobile: the toggle is 2 actions from anywhere |
| Focus after a landing | `H2#hospitality-title` | unchanged |
| Majlis size and coverage | 882×760, 52% max (mobile 72%) | 1440×832, 92% |
| Frames over 18 ms in the opening, 4× CPU | desktop 19.6%, p95 33.5 ms · mobile 5.7% | desktop 1.0%, p95 16.8 ms · mobile 1.7–2.5%, p95 16.8 ms |
| Long tasks in the opening | desktop 2 (103 ms total) · mobile 0 | desktop 0–1 · mobile 0 |
| LCP element | H1 (EN, AR, both widths) | H1 (EN, AR, both widths) |
| LCP time, cold, localhost | 372 / 1148 / 384 / 912 ms (desktop EN / desktop AR / mobile EN / mobile AR) | 468 / 1200 / 444 / 1016 ms. Within run-to-run noise on this machine; ranges overlap. |
| CLS, full scroll (desktop EN / desktop AR / mobile EN / mobile AR) | 0 (max 0.0005) / 0.0015 / 0 / 0 | 0.0005 / 0.0012 / 0 / 0 (one AR mobile run 0.0038). The 0.0005 is the header nav and the skip link's text width at font swap; the H1 no longer moves. |
| Touch targets under 44px (mobile) | chips (38.5), breadcrumbs (15), language toggle* | language toggle* only. *Its hit area is 49.8px through `::before`. |
| Reduced motion | still composition, all four lines readable, no pin | unchanged (pass) |
| Keyboard | 13 Tabs to skip; index after skip; FAQ reachable; visible focus | unchanged on desktop; on mobile one more stop (the toggle) before the chips |

## Screenshots

- `01-ground-stage-desktop-en.png`: Stage, ivory on ivory → espresso ground.
- `02-majlis-peak-desktop-en.png`: the majlis as a card in the column → full bleed, landed from the index.
- `03-mobile-index-en.png`: chip bar with Catering off screen → the toggle open with all six.
- `04-opening-promise-desktop-en.png`: end of the pin → the promise set larger, the intro out of the frame.
