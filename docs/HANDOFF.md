# Session handoff: v1 for Rand, full speed to M3

Updated 2026-11-11. Read `CLAUDE.md` and `AGENTS.md` first (permanent rules; speed mode D82/D86). Decisions: `docs/DECISIONS.md` (latest D85–D90). Plan: `docs/plans/v1-review.md` (phases C–G) and `docs/plans/phase-2-services.md` (Events 3.2–3.9, Software 4.1–4.5, the form pipeline 4.2). Judgment calls awaiting the user: `docs/review/decisions-to-confirm.md` (#1–#18).

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
- **Now: step 2, sequential (D93):** Software agent finishing in its worktree (`agent-a0db117a116600633`); merge it, then resume the Events agent (`worktree-agent-a8f48549d1aade62f`, paused, 4 uncommitted files) with the copy standard and the hover spec (#19).
- **Next:** step 3 (Marketing/Creative/Print visual completion ‖ Work index + case template + 3 cases), step 4 (About ‖ Products), step 5 (Contact + the pipeline delivery ‖ legal, credits, 404, SEO), step 6 (the M3 gate, CI, every-page screenshots; the only stop).

## Machine notes

- Stopping a background `next build`/`next start` leaves node running: kill the leftover `next` processes (PowerShell `Get-CimInstance Win32_Process … Stop-Process`) before rebuilding.
- Local Node is 24; the repo pins 22 (`engines`, `.nvmrc`), so npm prints an EBADENGINE warning locally. Harmless; CI runs 22.
- Git Bash mangles `/en` arguments: pass `//en`.
