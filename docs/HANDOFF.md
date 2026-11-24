# Session handoff: finishing the site, phases 1–5 (from 2026-11-18)

Read `CLAUDE.md`, `AGENTS.md` and `PRODUCT.md` first. Decisions: `docs/DECISIONS.md` (latest D124; new ones from D125).

## Now: the countdown hero (2026-11-24, D173)

- The owner chose A ("countdown to zero") with C's gold dial engraving. Built as the Home `Hero` on branch `hero-options` (commit c03f73c), PR to main.
  - Five cut-out objects (`hero-obj-*`, media.ts), made by `scripts/hero-objects.mjs` from credited Unsplash photos (no Replicate token, no generation budget).
  - Desktop: a 150svh pin. Phones: one gathering on load. Reduced motion: the end state.
  - The hall (p9-2) is only in the Events opening now; `KEPT` is empty.
  - The lab route, options B and C, the HUD and the letterbox are gone.
- Checked locally on a production build: typecheck, lint, 497 unit tests, the hero, fit, first-screen, locale-switch, pin, CTA-bar, home-photos and Home empty-screen specs.
- **Next:** merge after the fast CI, wait for the Vercel deploy, then send the owner 1440 and 390 shots and a short GIF from production.

## Before: hero options (2026-11-23, late)

- Three prototypes compared in `docs/review/hero-options/` (A countdown, B cinematic loop, C the dial).

## Before: images done, README done (2026-11-23, late night)

**Status.** `main` is at the README merge (PR #7, 5395e0b). Preview for Rand (public, no login): https://notime-website-ashen.vercel.app/ar; `docs/content/rand-images-message.md` links it. The CLS investigation, long e2e runs and Lighthouse are still paused by the owner.

**Images, one photograph per place (D169–D172), all merged:**
- PRs:
  - #3 Home, About, Work.
  - #4 Events.
  - #5 Creative and Print (2 Unsplash + 8 Pexels, downloaded from each photo page under the Pexels License; the Pexels key in `.env.local` is a placeholder).
  - #6 Stage beams (D172).
- `src/content/photo-slots.test.ts`: `PENDING` is empty. The only repeat is the named Events-opening hall, approved by the owner.
- New images by source:
  - Rand's profile: 7 alternates.
  - Unsplash: 20 (5 cards and menu, 12 Events, 2 Creative, 1 stage beams).
  - Pexels: 8.
  - AI: none (no key).
- U49 and U50 (the two new Home strip captions) are in `copy-pending.md` for Rand.
- **Full e2e:**
  - The Events phone empty-screen failure (since #3) is fixed by D172.
  - The last full run (45257020199) has one failure: the known `events-animatic` desktop pin-offset flake (90.45px), now on events-stage. It is logged in `docs/e2e-flakes.md` and stays deferred by the owner until after Rand's review.

**Repo (PR #7):**
- README with screenshots (`docs/readme/`, from `scripts/readme-shots.mjs`; re-run at launch for notimehub.com), a PR template, and repo description, website and topics set with `gh`.
- The repo is **public** (the owner thought private; not changed, flagged to the owner).
- The social preview has no API: upload `docs/readme/social-preview.jpg` by hand (Settings → General → Social preview).
- At launch: README's production line and the repo's website go to notimehub.com; the LinkedIn link is still to come.

## Before: PR #2 launch prep (2026-11-23; merged)

**Status 2026-11-23 (evening): the four launch-prep tasks are done; PR #2 is ready, not merged (the owner merges).** Branch `phase-2-services`, code head `a2c2fff`. (1) The CLS 1.0 on Home is fixed (D168): How we work's pin wrapper switched display block ↔ flex on each ScrollTrigger refresh; `.process-pin` is flex now, `pinSpacing: true`; evidence recorder `e2e/cls-recorder.ts` stays in `cls.spec`; 52 consecutive load runs pass, no retries. (2) Confirm rows 70–74 confirmed by the owner; Work shows only Rand's photos (all 28 `rand-profile`, nothing replaced); row 73 confirmed as built (removing the sepia needs its own word). (3) UAE Arabic pass on the pages done before the rule: U33–U47 changed, U48 proposed (`docs/review/copy-pending.md`, 46 lines in all); Home and Events needed nothing outside ⚑ lines. (4) WhatsApp message for Rand: `docs/content/rand-images-message.md`. Full CI on the PR: see the PR description for the run. Preview: review build of `a2c2fff` on 3100 behind https://gary-farms-rays-potter.trycloudflare.com/ar (restart both after a reboot, then update the message's link). **Next:** the owner sends the message and merges PR #2; then `docs/launch/checklist.md` steps 1–6 and 8–11.

## Before: the visual portfolio mandate (2026-11-21, authoritative)

**Status 2026-11-23: all 16 tasks done; the close is finished.** Report `docs/report/visual-report.md` (Arabic) with the rulings appendix `docs/report/visual-rulings.md`; decisions D150–D167, confirm rows 70–74. PR #2 phase-2-services → main open, not merged: https://github.com/beshoynady/notime-website/pull/2. Full CI green: run 45127805783 on `2ae3d14` (705 passed, 1 first-time flaky logged in `docs/e2e-flakes.md`). Preview: review build `2ae3d14` on port 3100 behind https://define-brad-exciting-priest.trycloudflare.com/ar (`docs/review/tunnel.md`; restart both after a reboot, then send the new link). **Next:** Rand's answers to `docs/content/images-for-rand.md` and confirm rows 70–74; the 12 wanted photos; then merge on the owner's word. Local e2e needs the server env in memory `prod-server-turnstile-runtime` (MAIL_SINK, MAIL_FROM, Turnstile secret; PW_BASE_URL). `cls.spec` measures the Arial-less (Android) path on Linux or with `E2E_WITHOUT_ARIAL=1` (D167).

The owner's Arabic mandate «تحويل الموقع إلى معرض أعمال بصري»: photo layers instead of code drawings on every page, one image registry, the home first screen, Software's length, Work. Spec `docs/superpowers/specs/2026-11-21-visual-portfolio-design.md`, plan `docs/superpowers/plans/2026-11-21-visual-portfolio.md` (16 tasks), inline execution with the ledger `.superpowers/sdd/2026-11-21-visual-portfolio/progress.md` (gitignored; trust it over memory). Branch `phase-2-services`; no merge into main, no deploy; ends with a PR (not merged) and `docs/report/visual-report.md` (Arabic).

**Done:** Task 1 registry `src/content/media.ts` (c0e742e) · Task 3 layer pipeline `scripts/scene-layers.mjs` + recipes (72164a7) · Tasks 2+4 pin from 1024px and the Events opening as a photo film, mode "hero" (1e6686a; D150–D154) · Task 5 Events I–III as photo scenes + work strips (299a628) · Task 6 Events IV–VI (Galas pass, majlis and stage pin 0.6 vh), every Events module, the drawn majlis and the Galas photo stack removed, the rail fades over scenes but stays reachable (b5863b2; D155) · Task 7 Events verification: Lighthouse A/B vs f086c44 inside the spread, axe clean, shots `docs/checkpoints/visual/events/`, `e2e/eager-fold.spec.ts` (the footer logo is lazy now) — `docs/checkpoints/lighthouse/visual-events/README.md`.
**Owner add-on (2026-11-21):** ui-ux-pro-max installed at user scope from nextlevelbuilder/ui-ux-pro-max-skill; run `docs/review/ui-ux-checklist.md` on each page before its commit (brand colours and fonts never change; suggestions go to the report's proposals only).
Task 8 Home first screen (D156): Rand's hall as the plate, no intro, header and CTAs at first paint, the pin built on first intent (it was re-reporting the title as LCP), title-only fallback faces (`hero.css`); Lighthouse/axe/shots `docs/checkpoints/lighthouse/visual-home/README.md`. Also an Events fix found by `empty-screens.spec`: a phone-only frame of the ceremony in Launches (III).
Task 9 Home cards and Real projects (D157, 6efae1d): `Category.photo` and `WorkItem.cover` from the registry, `MediaImage`, the duotone 0px box fixed (layered position), card scrim deeper (≥ 5.3:1). Software's card and the "Rooms we dressed" tile wait for C2 / C3 (ledger rulings).
/simplify over Home done (ad672e9; skips and the CLS flake investigation in the ledger and `docs/e2e-flakes.md`).
Task 10 Creative (D158, f49b0ac): studio opening film (stock night → lit → Rand's dessert boards in a frame, laptop), Rand's photos on video/motion/AI, stock LED panels on rental, strips on photography/set design; motion playground, rental module, timeline/frames drawings removed; fx shared in `layered-scene.css`. `docs/checkpoints/lighthouse/visual-creative/README.md`.
**Owner, 2026-11-21 (mid-run):** /simplify runs ONCE at the close over all new pages (not per page); the independent code review stays at the close. Approved: Software's temporary home card, "Rooms we dressed" → Work. CLS flake: keep the logging, report the cause in the final report if it recurs. Preview: refresh after Creative, then after every two pages.
Task 11 Marketing (D159, 6c0c2a8): desk opening (wash → clean → the league's result post in a frame, laptop), Social = the league's feed whole, stock on the other five; calendar and press-release modules and four drawings removed; section photos keep their own shape when portrait/square; `crop.scale` in scene-layers. `docs/checkpoints/lighthouse/visual-marketing/README.md`.
Task 12 Print (D160, 97a7ca0): materials → press → the gold skyline gift in a frame (laptop); the client's own pieces on packaging/gifts/merch, stock on printing/fabrication, a strip of two real stands; human-scale module and dieline/merch drawings removed (`stand` stays for Work until C3); `curate-profile.mjs` crops per file; workshop overlay top band for AA. Simulated LCP reads higher but the real H1 paints at FCP (`docs/checkpoints/lighthouse/visual-print/README.md`).
Preview refreshed 2026-11-22 (ba85f1a, same link).
Task 13 Software (D161): six services as one tab set (`service-tabs.tsx`, WAI-ARIA, mirrored arrows; `scrollToAnchor` fires `anchor:reveal` so links open their panel), device photos (stock `sw-*`) instead of the drawings, the call and the review as two closing tabs, phone rows and folds; phone length 23,154 → 11,382 EN (`e2e/software-tabs.spec.ts`). Reduced-motion overflow fixed at the root (`.sr-only` labels escaping the rows' clip). `docs/checkpoints/lighthouse/visual-software/README.md`.
Task 14 About and products (D162, fe67025): story photos from the registry; the products' problem section over a photograph (in the hero it was the LCP, +500 ms); `docs/checkpoints/lighthouse/visual-about-products/README.md`.
**Owner, 2026-11-22: Arabic first, UAE market (D163)**: new copy in Arabic first; existing Arabic on each page worked on tuned to the UAE market, meaning and facts unchanged, logged in copy-pending.md "Arabic for the UAE market" (U1–U8 so far); rules in `copy-voice-reference.md` §8; the report counts them with 10 before/after examples.
**Owner, 2026-11-22: speed mode to the end of the pages**: per page only typecheck + ESLint + unit + build + one AR shot at 1440 and 390 + commit; everything heavy (full e2e, empty screens at 7 sizes, Lighthouse A/B, axe, ui-ux-pro-max, simplify, code review, full shots + video, the UAE-Arabic review of the pages finished before D163) runs once at the close. A big error needing a section rebuilt at the close: tell the owner first. Local prod server: start with `TURNSTILE_SECRET_KEY=<test secret> npx next start` or form specs fail closed.
Preview refreshed 2026-11-22 (5831ff6, new link).
Task 15 Work (D164): the cases show their own cover photo (Work, case page, Related work; `case-visual` deleted); four collections of Rand's photos at `/work/<slug>` (`workCollections`, `workCards()`; hide below 4 visible photos); filters back at 6 entries; Copy link (`copy-link.tsx`, Motion, hidden without JS); Home's third tile = Rooms we dressed; Work Arabic U9–U15. `e2e/work.spec.ts` rewritten, runs at the close. **Next:** refresh the preview, then 16 close (the ledger's Task 15 notes: collection-page LCP). OPEN_QUESTIONS #25 waits for Task 16.
**Deleted with the owner's approval (2026-11-21):** the old `~/.claude/skills/ui-ux-pro-max`, `.next/cache/images`, `src/graphify-out/` (root `graphify-out/` kept). `.next-base/` is approved for deletion after the last A/B (Task 16).
**Servers (2026-11-23):** only 3100 runs (review build `2ae3d14`, `.next-review`) behind the quick tunnel above; 3000 is stopped; `.next-base` (the f086c44 "before" build) was deleted after the last A/B, as approved.

## Now: the owner's mandate of 2026-11-20 (review, fix, creative pass)

Four phases (the owner's message of 2026-11-20): **1** cut-off sections fixed on `phase-2-services`; **2** self-audit on a new branch `visual-pass` (from the last commit): `docs/review/self-audit.md`, scores per page × three lenses (art director, senior front-end, UX/conversion), notes split into bugs (fix now, one commit each) / weaknesses / opportunities (don't build), compare with nqshmedia.com/ar-ae and `docs/review/benchmark.md`; then **stop** and send the scores, the bug count, top 5 weaknesses, top 5 opportunities; **3** brainstorming with the owner, one question at a time in plain Arabic, 2–3 options each with mockups, home → Events → other categories → Work → global; design doc in `docs/superpowers/specs/` for approval; **4** plan and build only after approval. Limits: Lighthouse mobile not below today (home 52–55, /links ≥ 95), CLS 0; no cut section at any of the seven sizes; axe clean; honesty (D78); no merge to main.

**Current step (2026-11-20):** Phase 1 done (46fedb8, D140). **Phase 2 done on `visual-pass`:** `docs/review/self-audit.md` (72769e0; scores AD 6.7 / FE 7.0 / UX 6.2; 12 bugs, 14 weaknesses, 8 opportunities) and all twelve bugs fixed, one commit each with a test: B04 002ce19, B05+B06 90cf315, B09 e47a1f2, B03 b84bbec, B07+B08 92d2b7b, B01 433d94c, B11 fa07a7e, B12 3cdedc5, B02 e91ba8a (font fallbacks per weight/caps/Arabic, Latin Alexandria preloaded first; D141), B10 53f61ef (Lighthouse A/B in `docs/checkpoints/lighthouse/self-audit-b10/`, all inside the spread). Follow-ups: /links' inlined faces (725d23b, Lighthouse /links median 100 EN / 99 AR), the late-swap check skips without local Arial (Linux CI, like Android: D141's limit). CI full 44714566217 green (e2e 576 passed, 0 failed, 0 flaky; unit 517/517). Decisions D141–D144, to confirm #50–53. **Next:** send the owner the phase-2 report (Arabic: scores, 12 fixed, top 5 W, top 5 O) and wait; then phase 3 (brainstorming). Queued after the report: the owner's extra task (humanizer skill on the English copy, results only in `docs/review/humanizer-pass.md`, nothing applied before approval).

**Before phase 3 (the owner, 2026-11-20, after the phase-2 report):** (1) the empty band under a closed card on the phone home: fixed, the title rides down into the fold (D146, 1e6522b); #50 (the /services dark block) left as is, ask again in phase 3. (2) Android fallbacks matched to Roboto / Noto Naskh Arabic (D145, d295326), `e2e/android-font.spec.ts` imitates a Pixel; Lighthouse A/B in `docs/checkpoints/lighthouse/android-fonts/` (all inside the spread; home 48 both sides, slow machine). (3) **Next: W02 empty screens are a bug**: fix every empty viewport at the seven sizes, motion and reduced, plus an e2e that scrolls each page and checks every screen has content. (4) `.next-before/` deleted (approved). (5) Then the humanizer task (docs/review/humanizer-pass.md only). Then phase 3, one question at a time: home first screen → Software length → layer images/motion → Work → home interactive glimpse.

**Before launch (the owner, 2026-11-20, latest; authoritative):** humanizer group (b) and the phase-3 brainstorm wait until after launch. Done: W02 (D147, 78b0656: no screen over half empty at 7 sizes × 16 pages, motion and reduced; `e2e/empty-screens.spec.ts`, `scripts/empty-screens.mjs`); copy, humanizer group (a) and the crew claims (D148, ef63b1a; Rand reviews `copy-pending.md` H1–H17; question 17 added, PDF reprinted); shots `docs/checkpoints/copy-a/`; launch steps `docs/launch/checklist.md` (1f7c22a); `phase-2-services` fast-forwarded to `visual-pass` (bug and copy fixes only; #55 asks the owner to confirm D147's edge instead of the fade); the full CI caught a font swap in steps on Android (D149, 1ac76ca: one-step swap) and Linux glyph rounding in the test (638e67f); full CI 44878106334 green on 638e67f (617 e2e, 517 unit). **Merged (2026-11-21, the owner):** #55 confirmed, #51 deferred; `.next-base/` deleted. PR #1 `phase-2-services` → `main` merged as a merge commit (65f1bb4; main had two CI commits, already here as 604af4c/187a65c: merged into the branch first, dc90bdb, tree unchanged); PR CI 44880707657 green (617 e2e, 517 unit); tag `v1.0-rc1`. Deleted local branches `audit-fixes` and `copy-rewrite` (every commit in main; never on GitHub). Not deployed. `main` stays PR-only. **Next:** the launch checklist from step 1 (Rand's answers, Hostinger, Turnstile, Resend DNS, legal read, ⚑ lines); code changes reach main by a new PR.

Untracked: `.next-base/` (the 423a732 "before" build for the A/Bs; delete only with the owner's OK). Servers: 3000 = prod build of 1ac76ca; 3100 = review build behind the tunnel https://pink-courtesy-dive-conference.trycloudflare.com.

## Before: the owner's mandate of 2026-11-18 (authoritative; run without waiting)

1. **Audit fixes:** `docs/superpowers/plans/2026-11-17-audit-fixes.md`, Tasks 0–15 (with 6B), subagent-driven, in the worktree `E:/NO Time/nt-audit-fixes` (branch `audit-fixes` from e19404f). Stop points don't stop: take the safer call (rules in the ledger), record the evidence for the final report. One commit per audit item.
2. **Copy rewrite apply:** branch `copy-rewrite` cut after `audit-fixes` merges; apply `docs/review/copy-rewrite/*.json` (D118–D124), the phone field test-first (D124). Unconfirmed ⚑ lines keep today's text or hide (D78); list them in one file. Don't wait for Rand.
3. **Full verification:** unit + e2e green locally and on CI (run number); Lighthouse mobile ab before/after (home, a category page, /links ≥ 95); axe on the nine pages; shots of every page 1440/390 EN/AR in `docs/checkpoints/final/`; the five copy scans; the preview link on a production build of the last commit.
4. **Final report** (Arabic, for the owner): `docs/report/final-report.md`.
5. **Site guide for Rand** (Arabic, for the owner to explain the site to Rand): `docs/report/site-guide-for-rand.md` + an RTL Alexandria PDF with a shot per section.

Deliver: a short message with the preview link, both report paths, and anything not merged with its reason. No push to main. Never delete untracked/gitignored files without asking.

**Progress ledger:** `.superpowers/sdd/2026-11-17-audit-fixes/progress.md` in this repo (gitignored; moved here from the removed worktree `nt-audit-fixes` on 2026-11-19). The helper worktrees `nt-audit-fixes`, `nt-mid` and `nt-before` were removed on 2026-11-19 (only builds and node_modules in them); ports 3200 and 3300 no longer exist.

**Current step (2026-11-19, second session):** the owner's four tasks are done, one commit each: (1) "Plan your event" opens `/contact?category=events-hospitality` with the event fields, e2e in `hero-intro.spec.ts` (D138, 690363e); (2) the 17 singular ⚑ Arabic lines + 4 slips outside the list moved to the plural, facts unchanged, `copy-pending.md` splits address (done) from fact (waits on Rand) (D139, #48, 2ae25bd); (3) axe on the nine pages EN/AR 1440/390: 0 violations as loaded and under reduced motion, nothing to fix (`docs/checkpoints/final/axe/`, 0423bce); (4) worktrees nt-audit-fixes, nt-mid, nt-before removed, ledger kept (4914483). Full CI 44551771340 green (unit 513/513, e2e 531 passed, 0 failed, 0 flaky). Review build of 4914483 on 3100 behind the same tunnel (`docs/review/tunnel.md`). Not merged into main. **Next:** the owner confirms #48 and the rest; Rand answers the 16 questions (then apply the ⚑ proposals); launch (`docs/launch/checklist.md`).

**Before that:** All five phases done (2026-11-19). Final report docs/report/final-report.md; Rand guide docs/report/site-guide-for-rand.md.

Servers: only 3100 = the review build behind the tunnel (link in `docs/review/tunnel.md`). 3000 is free (start a prod build there for e2e/axe; `PW_BASE_URL=http://localhost:3000`).

## Before (2026-11-17)


Branch `phase-2-services`.

| Work | State | Next action |
|---|---|---|
| **Audit fixes** (N03–N22 as chosen) | Design approved (`docs/superpowers/specs/2026-11-17-audit-fixes-design.md`). Plan: `docs/superpowers/plans/2026-11-17-audit-fixes.md`, 16 tasks; branches `audit-fixes`, `audit-n06`, `audit-n17` | **Waiting for the user to confirm the plan.** The withdrawn case (D121) touches some of its tasks: see the summary sent to the user. Then subagent-driven, TDD, one agent at a time (D93) |
| **Copy rewrite** (docs first) | Two rounds of owner decisions applied (D-C1–D-C8, D118–D124). Table `docs/review/copy-rewrite.md` (1,423 strings, 428 proposals, 2 hidden, 47 ⚑, all Rand's). Rand's 16 questions: `docs/review/rand-questions.md` + `.pdf` | **Waiting for Rand's answers.** Apply on a separate branch after `audit-fixes` merges: from the JSONs, the phone function test-first with `libphonenumber-js` (D124), print → `print-ordering` (D123), EN/AR screenshots |
| **Withdrawn case (D121)** | Removed from `src` (Work, Home, About, Software's case study and proof card, photos) and from every doc but DECISIONS.md. Work has 2 cases; the work filter has no Software chip. Screenshots: `docs/review/shots/work-two-cases/` | **Waiting for the user's call on the visual balance** (Software's single proof card, Home's two-up, the one-option market row). Change no design before that |

Rebuild the table after editing a JSON: `node --no-warnings --import ./scripts/lib/alias.mjs scripts/copy-inventory.mjs --render docs/review/copy-rewrite docs/review/copy-rewrite.md --head=docs/review/copy-rewrite/_head.md` (it warns about proposal IDs that no longer exist).

Servers: prod on 3000 and the review build on 3100 (both rebuilt without the withdrawn case), tunnel https://commerce-tension-petersburg-rom.trycloudflare.com/ar. Run e2e with `PW_BASE_URL=http://localhost:3000`.

## The user's message (2026-11-17, authoritative)

#30 #32 #33 approved (Rand reads the Arabic). #31 approved if every story has a static reduced-motion version and doesn't stutter at 4× CPU. #34 `/links` waits for the WhatsApp number; no Instagram row; the WhatsApp row turns on from `contact.ts`. #35 approved + the WhatsApp message names the source (floating button and `/links`). #36 v1.1, except `/links`: no scroll animation, minimal JS, 90+ on phones before launch. Requests: (1) Lighthouse before/after on the same machine, a complete table; (2) does the Events EN layout really move on a slow device (fix the page, not the test); (3) the reviewer's notes moved to v1.1 with their grades; (4) why 369 local tests vs 379 in CI.

| Item | State |
|---|---|
| #31 static versions + 4× CPU | **Done.** `e2e/photo-stories-reduced.spec.ts`; `docs/checkpoints/frames/scroll-4x.md`; the tone stutter fixed (D115), look unchanged (`docs/checkpoints/frames/tone-fix/`). |
| #34 #35 #36 `/links` | **Done** (D113, D114): measured alone 95–100 EN, 97–99 AR (5 runs each). |
| Request 1 (Lighthouse A/B) | **Done:** `docs/checkpoints/lighthouse/ab-2026-11-17/` (performance flat 50–63 → 51–62; D111 corrected). Worktrees removed. |
| Request 2 (Events EN) | **Done** (D112); D112's floor stretched two pins (Software's title 1086 px down, an empty screen before the home process): fixed in D117, test tightened. #20 deep-link flicker verified gone. |
| Requests 3, 4 | **Done:** v1.1 "From the final-pass code review" (graded table); 369 vs 379 = the 10 lab tests (`NEXT_PUBLIC_ENABLE_LAB=1`). |
| Accessibility (D116) | Chip fieldsets are radiogroups; Software's off phase chips 5.7:1. |
| UX audit (the user's brief, `docs/review/ux-audit-brief.md`) | **Done by a fresh agent:** `docs/review/ux-audit.md`, `benchmark.md`, `copy-proposals.md`, `shots/`. Score 6.6/10. Top-10 #1 and #6 were D117 (fixed). #2 is the fail-closed Turnstile without real keys (by design). **The user chooses the rest; implement nothing from it until they do.** |
| e2e (prod build, `NEXT_PUBLIC_ENABLE_LAB=1` + the Turnstile test site key, as CI) | 406 passed, 0 failed, 158 skipped; 1 flaky on a re-run of the form specs (clean on the second). A build without `NEXT_PUBLIC_TURNSTILE_SITE_KEY` fails the form specs by design. |
| CI | Full run 44117716681 (workflow_dispatch) on db71ccc+docs. |

Servers: prod on 3000 (CI-equivalent build); review build on 3100 behind the tunnel https://commerce-tension-petersburg-rom.trycloudflare.com/ar (cloudflared from WinGet's package folder; restarting the review server keeps the link). Playwright's default port is 3100: with the review server up, run e2e with `PW_BASE_URL=http://localhost:3000`.

**Next:** wait for the user's choices from the audit's top 10 and the copy proposals.

## History (before this session's post-M3 pass)

## The user's priority (2026-11-10, latest message, authoritative)

- **Launch work is paused** (Hostinger, domains, DNS, email verification). Keep what's documented in `docs/launch/` and the review notes; spend no more time on it.
- **M1:** finish quickly (green full CI, the review build, the tunnel), send a short Arabic report, and **don't wait** for a reply.
- **Then build everything left at full speed** (at most 2 parallel agents in worktrees; the lead integrates into `phase-2-services`):
  - Events full ‖ Software full (sales page: anonymised case study, event-tech band, Minute Zero and Peak Hour cards, consultation form);
  - Marketing / Creative / Print visual completion;
  - Work index (filters: category × market) + case template + the 3 anonymised cases;
  - About (story from the profile, principles, markets);
  - Products: Minute Zero, Peak Hour (Coming soon + register interest);
  - Contact (form + `info@notimehub.com`), the form pipeline (Task 4.2), legal, credits, 404, sitemap/robots/OG/JSON-LD.
- **Images, without waiting:** curated real profile photos wherever they fit (no identifiable faces, no client branding in anonymised work); otherwise art-directed code visuals in the brand style; designed placeholders only where neither works. Ingest `assets-inbox/` whenever files appear.
- **Copy:** write all remaining EN + native AR copy ourselves (approved voice, banned list, honesty rules); log judgment calls in decisions-to-confirm.
- **M2 is not a stop:** send a one-screen progress note and continue. **The only stop is M3:** the fresh-subagent gate, a green full CI, and screenshots of every page (1440/390, EN/AR).

## Branch

- **`phase-2-services`** (see `git log -1`). Never commit to `main`. Push in batches; if `git push` hangs up, retry with `git -c http.postBuffer=524288000 push origin phase-2-services`.

## Current step

- **M1 closed** (2026-11-10): full CI 42900663990 green on `0bd0043`; screenshots retaken in `docs/checkpoints/m1/`; the review build is served on port 3100 through a Cloudflare quick tunnel (the link changes on every restart; `docs/review/tunnel.md`; current link 2026-11-11: https://voices-cylinder-evolution-vids.trycloudflare.com/ar); the forms contract is frozen (D92, `4593f13`).
- **Final push (2026-11-11, user, authoritative):** §1 hero fit done (D94, `a6945f9`); §2–§3 native Arabic rewrite + sharper copy, page by page, logged in `docs/content/copy-ar-rewrite.md`: **homepage done** (D95, `72edc41`; decisions-to-confirm #21). Then Software → Events → the other categories, menus, footer, forms, FAQ, legal.
- **Step 2 done (2026-11-15):** Software (D96) and Events (D98) merged. **Step 3a done:** Marketing/Creative/Print hooks, Creative's real frame, AR fixes (D99; the 12 photo modules → v1.1).
- **Step 3 done (2026-11-16):** section visuals (D100), Work/About/Products (D101). **Step 4 done:** Contact + the form pipeline (D102, `9e06281`): Turnstile (test keys on dev/review/e2e; fail closed in production without keys), Resend team email + auto-reply (needs `MAIL_FROM` on the verified domain), the brief with `?service=`, quote block + service CTAs public. `e2e/forms.spec.ts` 6/6 green on the prod build. Also fixed: ToneController initial state (a short opening hid the next section on phones), About/Contact light-leak overflow. **Step 5 done (D103):** share images per page/locale on one renderer, layout openGraph/twitter, home Organization + WebSite JSON-LD, the 404 with a Services route; legal already current. **Now (lead): M3** (the only stop): the fresh-subagent gate (design-critique, accessibility-review, copy check; fix High), the full e2e on a prod build, the full CI by `workflow_dispatch`, every-page screenshots 1440/390 EN/AR, the review build + a fresh tunnel, the one-screen Arabic report (decisions #21–#28), and the manual form send to the user's inbox via the review build. Rule (D100): a production build after each merge; e2e at M3 only.
- **M3 (2026-11-16):** the quality gate ran (fresh reviewer; copy check passed); fixes D104 (no self-killing ScrollTriggers: the Software page crashed when opened scrolled) and D105 (the footer no longer hides the last section, Marketing's hook, contrast, forms, Contact in the footer, five polish states; Lows deferred to v1.1.md). e2e: each form test posts as its own client (rate limit). Final screenshots: `docs/checkpoints/m3/<page>/full-{en,ar}-{1440,390}.jpg` (local only, gitignored; 64 shots, no console errors, no overflow). Review build on 3100 + quick tunnel (link in `docs/review/tunnel.md`). **Next:** the user reads the Arabic M3 report and confirms decisions #21–#29; the user sends the brief through the tunnel to confirm the email arrives (Task 4.2 step 4).
- **M3 to-do carried:** run the edited e2e specs (`events-animatic`, `opening`, `category-modules`, `hero-fit`), re-measure module reservations (`scripts/anchor-shift.mjs`), retake the Software proof shots, check the custom cursor in AR for horizontal scroll.
- **Next:** step 3 (Marketing/Creative/Print visual completion ‖ Work index + case template + 3 cases), step 4 (About ‖ Products), step 5 (Contact + the pipeline delivery ‖ legal, credits, 404, SEO), step 6 (the M3 gate, CI, every-page screenshots; the only stop).

## Machine notes

- Stopping a background `next build`/`next start` leaves node running: kill the leftover `next` processes (PowerShell `Get-CimInstance Win32_Process … Stop-Process`) before rebuilding.
- Local Node is 24; the repo pins 22 (`engines`, `.nvmrc`), so npm prints an EBADENGINE warning locally. Harmless; CI runs 22.
- Git Bash mangles `/en` arguments: pass `//en`.
