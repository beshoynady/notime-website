# Session handoff: v1 for Rand, speed mode, M1 next

Updated 2026-11-10, after the recovery from an interrupted session. Read `CLAUDE.md` and `AGENTS.md` first (permanent rules, including speed mode and batched testing, D82). Decisions are in `docs/DECISIONS.md` (latest D81–D84), the plan in `docs/plans/v1-review.md`, and the judgment calls awaiting the user in `docs/review/decisions-to-confirm.md`.

## Branches and remote

- **Working branch: `phase-2-services`** at `1394b36`, pushed. Never commit this work to `main`.
- **`main`** is the last approved state; it changes only through a PR at the end of a phase. The `pre-push` guard refuses pushes to `main` (D74). No force-pushes.
- **Usage rules (user, 2026-11-10):** at most 2 parallel agents, and native work for anything touching shared code. Commit at the end of every step, push in batches, and keep this file current.

## What changed since the last handoff (three stale points fixed)

1. **CI (D82):** a push runs only lint, typecheck and unit tests. The build, the review-leak scan and the full e2e run only on a manual `workflow_dispatch` (at each milestone) and on PRs to `main`. Pre-commit is lint-staged (ESLint on staged files, one typecheck when TypeScript is staged); unit tests are no longer in the hook.
2. **Images:** the Replicate plan (D76, D77 §1) is superseded. AI images are made by hand in ChatGPT's free tier (D79); stock comes from Pexels and Unsplash, downloaded by hand, with an Image credits page (D80). There is no paid image API and no budget line.
3. **The four copy decks** (Creative, Marketing, Print, Software) are in the data as drafts for Rand's review (commit `051eefb`), with the user's decisions applied (D81).

## Done in the last sessions (all on `phase-2-services`)

- D81: the ten deck decisions and the Arabic calque review of the D56 promises.
- D82: speed mode and batched testing (CLAUDE.md updated).
- D83: the scaffold for the parallel category builds (theme files, scene stubs, six module stubs).
- D84: every Phase B homepage section: Work with the showreel dialog, the services marquee, Digital, How we work, the Six markets clocks, the final CTA, the footer columns, and the review-only trust blocks. **None of it has been seen in a browser yet** (memory was short while the agents ran).
- Creative Production and Production, Print & Gifts built from the template and merged (opening scene, theme, two modules each).
- Review docs: `docs/review/tunnel.md`, `hosting-note-ar.md`, `rand-guide-ar.md`. `cloudflared` 2026.10.7 is installed (user scope, winget).
- Unit tests: 341 passing with Marketing merged (328 without).

## Recovery table (worktrees and branches)

| Worktree / branch | Task | Last commit | Uncommitted | Merged into `phase-2-services` | Pushed |
|---|---|---|---|---|---|
| `.claude/worktrees/agent-ad26390d43b6f8788` · `worktree-agent-ad26390d43b6f8788` | Creative Production | `7e2aa88` | none | yes (`a727cf4`) | no (merged, so `phase-2-services` carries it) |
| `.claude/worktrees/agent-a83e066404d21af9f` · `worktree-agent-a83e066404d21af9f` | Production, Print & Gifts | `b1119d4` | none | yes (`cd4f190`) | no (merged, as above) |
| `.claude/worktrees/agent-ae348246b0fe141aa` · `worktree-agent-ae348246b0fe141aa` | Marketing & Brand | `59fe8e2` (WIP: the opening, theme and two modules; the agent stopped before its render check; lint, typecheck and unit tests pass) | none | **no** | **yes** |
| `wip/marketing-merge` (local only) | A trial merge of Marketing made before the user said not to merge (`a906c88`, with the `scenes.test.ts` conflict already resolved). Kept so nothing is lost; `phase-2-services` was moved back to `1394b36`. | `a906c88` | — | no | no |

No worktree or branch has been deleted.

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
