# Session handoff: the user's decisions on #30–#36 and requests 1–4 (2026-11-17)

Read `CLAUDE.md`, `AGENTS.md` and `PRODUCT.md` first. Decisions: `docs/DECISIONS.md` (latest D117). Judgment calls: `docs/review/decisions-to-confirm.md` (#1–#36 all answered).

## Latest (2026-11-17, end of session): two pieces of work waiting on the user

Branch `phase-2-services`.

| Work | State | Next action |
|---|---|---|
| **Audit fixes** (N03–N22 as chosen) | Design approved (`docs/superpowers/specs/2026-11-17-audit-fixes-design.md`). Plan written: `docs/superpowers/plans/2026-11-17-audit-fixes.md`, 16 tasks; branches `audit-fixes`, `audit-n06`, `audit-n17` | **Waiting for the user to confirm the plan.** Then subagent-driven, TDD, one agent at a time (D93) |
| **Copy rewrite** (the user's task: docs first) | Voice and samples approved, with owner rules 1–8. **Full table done:** `docs/review/copy-rewrite.md`, generated from the code by `scripts/copy-inventory.mjs` (1,470 strings, 430 proposals, 77 ⚑). The proposals are in `docs/review/copy-rewrite/*.json`, the head in `_head.md`. Rule 8 scan: 0 banned words, 0 banned shapes, 0 unmarked promises | **Waiting:** the user reviews everything (decisions D-C1–D-C8 in the doc's head), Rand reviews the Arabic and the ⚑ lines (FC rows + new R1–R9). **No `src/` change until then.** Apply on a separate branch after `audit-fixes` is merged: from the JSONs, with tests and EN/AR screenshots |

Rebuild the table after editing a JSON: `node --no-warnings --import ./scripts/lib/alias.mjs scripts/copy-inventory.mjs --render docs/review/copy-rewrite docs/review/copy-rewrite.md --head=docs/review/copy-rewrite/_head.md` (it warns about proposal IDs that no longer exist).

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
