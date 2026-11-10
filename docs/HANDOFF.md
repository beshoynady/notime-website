# Session handoff: v1 for Rand, speed mode, M1 next

Updated 2026-11-10, after the recovery from an interrupted session. Read `CLAUDE.md` and `AGENTS.md` first (permanent rules, including speed mode and batched testing, D82). Decisions are in `docs/DECISIONS.md` (latest D81–D84), the plan in `docs/plans/v1-review.md`, and the judgment calls awaiting the user in `docs/review/decisions-to-confirm.md`.

## Branches and remote

- **Working branch: `phase-2-services`** (see `git log -1`; Marketing merged at `a47e0ac`). Never commit this work to `main`.

## Current step (M1)

- Done: Marketing merged (`a47e0ac`); merged worktrees and branches deleted (the remote `origin/worktree-agent-ae348246b0fe141aa` kept: the user's call); screenshots in `docs/checkpoints/m1/` (`full-*` stitched, `sec-*` per section); the fresh-subagent gate's High and Medium fixed (D85); anchor landing fixed (pins and modules reserve space; CLS ≤ 0.03 on every anchor, was ~1.0) (D85); the first full CI run (42883051338) was red with 11 failures, repaired in D87; CLAUDE.md workflow updated to the user's speed-mode summary (D86).
- **Now:** full CI re-run on the D87 commit; local production build to confirm the deep-link scroll jump is gone (`node scripts/anchor-shift.mjs`, plus the trace in the M1 notes). Then the review build (`npm run review:build`, `npm run review:start -- 3100`) and the tunnel (`docs/review/tunnel.md`), then the Arabic one-screen M1 report.
- Open decisions: `docs/review/decisions-to-confirm.md` #1–#12 (new at M1: #10–#12).
- Machine note: stopping a background `next start`/`next build` task leaves its node process running; kill the leftover `next` processes before rebuilding.

## Worktrees and branches

No worktrees besides the main checkout. Local branches: `main`, `phase-2-services`. Creative (`a727cf4`), Print (`cd4f190`) and Marketing (`a47e0ac`) are merged into `phase-2-services`.

## Open points

- **Anchor-landing shift:** in production a module slot renders nothing until its module loads, so landing directly on a section (`#printing` …) may shift the content below (reported by the Print agent). Measure it at M1; if it shifts, reserve module space in the shared code (`min-height` or `aspect-ratio` per module).
- **Decisions to confirm:** 9 items in `docs/review/decisions-to-confirm.md`.
- The Events scenes are still lab-only (`LAB_SCENES`) until Phase C.

## Next steps (approved by the user, 2026-11-10)

1. **Merge Marketing** into `phase-2-services`, combining the scene lists in `scenes.test.ts` (or fast-forward to `wip/marketing-merge`, which already has that resolution). Quick check only: it builds, and the page opens in EN and AR with no console errors. The full visual review moves to M2.
2. **Delete the merged worktrees** (Creative, Print), then Marketing's after its merge, then the merged local branches (and `wip/marketing-merge`). Confirm `git worktree list` and the merge status first.
3. **M1, with no parallel agents:**
   1. production build, then screenshots at 1440 and 390, EN and AR;
   2. fresh-subagent quality gate (design critique, accessibility, copy); fix High and Medium;
   3. measure the anchor-landing shift and reserve module space if needed, then re-measure;
   4. trigger the full CI manually (`workflow_dispatch`); it must be green;
   5. the review build and the tunnel (`docs/review/tunnel.md`), with the link and the Arabic guide ready for Rand;
   6. a one-screen M1 report (in Arabic).
