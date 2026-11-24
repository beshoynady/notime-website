# Home film: storyboard checkpoint (2026-11-24)

"The night of the event": one pinned stage, the camera moves through it, the copy changes beside it. The stills are mock-ups at 1440×810 (`ar-f*.jpg`, `en-f*.jpg`). The final grade gets baked into the files with sharp, and the layers move by scroll.

| # | Beat (menu name) | Line (AR / EN draft) | Layers: back · middle · front | Plate source |
|---|---|---|---|---|
| 0 | Opening: the empty hall | H1, lead and both CTAs as today, visible at first paint | hall · tables (crop) · dust and light | Rand's hall `ev-open-night` (profile p9-2) |
| 1 | الفعاليات والضيافة / Events & Hospitality | نُضيء القاعة ونجهّز المسرح قبل أن يصل أول ضيف. / We light the hall and set the stage before the first guest walks in. | dark hall · trusses · the beams fade up | `ev-stage-beams`, Unsplash sol7vhs8Pdg (Kevin Yudhistira Alloni) |
| 2 | الإنتاج الإبداعي / Creative Production | نصوّر الليلة كما تستحق أن تُروى، من أول لقطة حتى آخر مونتاج. / We film the night the way it should be told, from the first shot to the final cut. | studio dark · cinema camera · viewfinder lines, REC and a timecode counting down | **new** Unsplash DZN-fKvIUFU (Brady Rogers) |
| 3 | التسويق والعلامة التجارية / Marketing & Brand | حملتكم على كل شاشة: قبل الحدث، وفي ليلته، وبعده. / Your campaign on every screen: before the night, on it, and after. | hall · blank wall · the wall lights up with our own line | **new** Unsplash elEIyWEj-bM (National Asian Culture Center) |
| 4 | الطباعة والهدايا / Print & Gifts | هدية تحمل اسم علامتكم عند كل مقعد، وبطاقة مطبوعة باسم كل ضيف. / A gift with your brand's name at every seat, and a printed card for every guest. | table from above · the blank card · the gift box slides in | **new** Unsplash HBv9rQ8Vtqo (micheile henderson) + the existing gift cut-out `hero-obj-print` |
| 5 | البرمجيات والحلول الرقمية / Software & Digital | تسجيل الضيوف رقميًا، وشاشات تعمل في موعدها. / Guests check in digitally, and the screens go live on time. | hands and tablet · the screen glows · a sweep of light | `sw-event-tech` (stock, already credited) |
| 6 | Finale: guests arrive, zero | يصل الضيوف، والساعة عند الصفر. ← «حان وقت البداية.» + CTA | lit path · lanterns · the dial reaches 00:00 | `pp-minute-zero` (stock, already credited) |

All new photos are under the Unsplash License. They go into `media.ts`, `credits.json` and `docs/content/temporary-images.md`. There's no Replicate token, so nothing is generated.

## Calls I made (go into DECISIONS)

1. The film replaces the current hero and the categories card grid, because each beat already links to its category page. The rest of the homepage follows the film unchanged.
2. Desktop (≥1024px): one pin of about 450svh, with a crossfade or mask wipe between beats. The plate dollies in slowly while the middle and front layers move faster to give depth.
3. Phones: no pin. Each beat is a short sticky panel with a scroll-linked crossfade, using 9:16 crops at about 750px wide.
4. Reduced motion: the seven final frames, stacked.
5. Weight: about 7 × 120 KB AVIF on desktop and 7 × 60 KB on phones, plus the cut-outs. Within the 1.5 MB phone budget.
6. Rand's hall opens the film as well as the Events page. That's a second use of the same photo, logged as an exception.
7. The English menu name becomes "Print & Gifts" to match «الطباعة والهدايا». The URL slug stays the same.
8. The beat lines are new copy. They go to Rand in `copy-pending.md`.
