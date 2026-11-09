# Session handoff: Phase 2, Events copy live, images next (Task 3.1b)

Written 2026-11-09, after the review decisions (D74), their Git follow-up and the approved Events copy (D75). Read `CLAUDE.md` and `AGENTS.md` first; they hold the permanent rules. Decisions are in `docs/DECISIONS.md` (latest: D72–D75), the plan in `docs/plans/phase-2-services.md`.

## Branches and remote (D72, D74, D75)

- **Working branch: `phase-2-services`.** All Phase 2 work is committed and pushed there. Never commit Phase 2 work to `main`.
- **`main` = the last approved state:** `6d40ede` (the user's own push, with the D67 storyboard decisions) plus the CI tooling cherry-picked on top (`3987ed3` workflow, `0c7d67f` `next typegen` typecheck). CI passed on it.
- **Merging:** `phase-2-services` reaches `main` through a PR at the end of the phase (finishing-a-development-branch). No direct pushes to `main`, and no force pushes. The one force push that restored `main` was approved by the user (D74).
- **`pre-push` guard** (`scripts/pre-push.mjs`, simple-git-hooks): refuses any push or deletion of `main`. The repo stays private, with no GitHub Pro, so there is no server-side protection. Bypass with `git push --no-verify` **only** for an end-of-phase merge the user has approved.
- **GitHub's default branch is `main`.** `phase-1-foundations` was deleted from the remote; it was fully contained in `main`.
- **CI** (`.github/workflows/ci.yml`): lint, typecheck, unit, build with the lab flag, full e2e on every push and PR, about 4–8 billable minutes per run. Docs-only pushes are skipped, except the four docs the unit tests read; `src/lib/ci-paths.test.ts` keeps that list honest. A newer push on the same branch cancels the older run.

## State of Task 3.0 (Events animatic): approved with D74

- **P1:** three lines over four shots on desktop (shots 0 → 0.4 → 0.83 → 1.8 → 2.0 vh). Each line holds at least 1.0 s at normal pace.
- **P2:** the majlis pins 0.6 vh on desktop (transform pin), with two beats: pour, then bloom. On mobile it passes.
- **P3:** the index is at 40% during shot 1.
- **P4, P5:** numerals 01–06 in Arabic.
- **P6:** the quote block is hidden on public pages.
- **P7:** focus ring only after keyboard navigation.
- Both scenes are **still lab-only** (`LAB_SCENES`, `LAB_SECTION_SCENES`). They move to `SCENES` / `SECTION_SCENES` when the live build (Task 3.2) is approved.
- **Numbers:** `docs/checkpoints/events-animatic-review/README.md`, section "After the user's decisions".

## Task 3.1 (Events copy): approved and live (D75)

- **Deck:** `docs/content/category-copy-events.md` (approved, with the user's changes listed at the top).
- **Live in:**
  - `categories.ts`: intro and 6 FAQ entries;
  - `services.ts`: the six services' points, and the Conferences promise without «متكاملة»;
  - `ar.json`: s1.
- **Copy rules** (`src/lib/copy-rules.ts`, tested on messages and content):
  - the banned phrases, now including «متكامل»;
  - no «في الموقع» for on-site; write «في المكان» or «في أرض الحدث». Two styleguide keys mean the website and are allowed.
- **Client questions** for more FAQ entries: CONTENT_CHECKLIST #28.

## Task 3.1b (Events images): next, stop point

- **Step 1 is the credit count.** Report it to the user and **stop before spending any credit**.

## How to run the lab

```bash
NEXT_PUBLIC_ENABLE_LAB=1 npm run build
NEXT_PUBLIC_ENABLE_LAB=1 npm run start -- -p 3100
# http://localhost:3100/en/lab/events-animatic
```

- **Before rebuilding,** stop whatever holds 3100. Stopping the background shell does not always stop the node child:
  `Get-NetTCPConnection -LocalPort 3100 -State Listen | % { Stop-Process -Id $_.OwningProcess -Force }`
- **Measurement scripts** (dwell, next service, CLS, LCP, frames) live outside the repo, in the session scratchpad. They are not needed to continue.

## Open items

1. **Branch protection:** decided (local pre-push guard, D74).
2. **Mobile line dwell:** rebalanced to 0 → 0.45 → 1.05 → 1.2 vh (D75). Line 1 now holds 0.92–1.20 s, and ≥ 1.0 s in 3 of 6 runs.
3. **Majlis frames:** 4.5% over 18 ms at 4× CPU on desktop, accepted for now. Task 3.2 re-measures with the real images; the target is **≤ 3%** (D75).
3a. **Anchor-landing flake: fixed** (`6fc15df`, `docs/e2e-flakes.md`). The helpers now wait for the heading's focus (the landing's end) before measuring. A future landing helper should do the same, never rely on scroll stillness alone.
4. **Next:**
   - 3.1b images (credit count first, stop point 3) → 3.2 live build → 3.3–3.9;
   - then **Task 4.2, the form pipeline** (pulled forward, D74);
   - then Software & Digital.
