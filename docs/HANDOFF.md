# Session handoff: Phase 2, Events copy deck in review

Written 2026-11-09, at the end of the session that applied the review decisions (D74) and drafted the Events copy deck (Task 3.1). Read `CLAUDE.md` and `AGENTS.md` first; they hold the permanent rules. Decisions are in `docs/DECISIONS.md` (latest: D72–D74), the plan in `docs/plans/phase-2-services.md`.

## Branches and remote (D72, D74)

- **Working branch: `phase-2-services`.** All Phase 2 work is committed and pushed there. Never commit Phase 2 work to `main`.
- **`main` = the last approved state:** `6d40ede` (the user's own push, with the D67 storyboard decisions) plus the CI tooling cherry-picked on top (`3987ed3` workflow, `0c7d67f` `next typegen` typecheck). CI passed on it.
- **Merging:** `phase-2-services` reaches `main` through a PR at the end of the phase (finishing-a-development-branch). No direct pushes to `main`, and no force pushes. The one force push that restored `main` was approved by the user (D74).
- **Branch protection is not on:** GitHub refuses branch protection and rulesets on a private repo on the free plan (HTTP 403). The user decides: GitHub Pro, a public repo, or a local pre-push guard.
- **GitHub's default branch** is still `phase-1-foundations` (`fee1d73`). Set the PR base to `main` explicitly, or ask the user to change the default.
- **CI** (`.github/workflows/ci.yml`): lint, typecheck, unit, build with the lab flag, full e2e on every push and PR. About 4–8 billable minutes per run.

## State of Task 3.0 (Events animatic): approved with D74

- **P1:** three lines over four shots on desktop (shots 0 → 0.4 → 0.83 → 1.8 → 2.0 vh). Each line holds at least 1.0 s at normal pace.
- **P2:** the majlis pins 0.6 vh on desktop (transform pin), with two beats: pour, then bloom. On mobile it passes.
- **P3:** the index is at 40% during shot 1.
- **P4, P5:** numerals 01–06 in Arabic.
- **P6:** the quote block is hidden on public pages.
- **P7:** focus ring only after keyboard navigation.
- Both scenes are **still lab-only** (`LAB_SCENES`, `LAB_SECTION_SCENES`). They move to `SCENES` / `SECTION_SCENES` when the live build (Task 3.2) is approved.
- **Numbers:** `docs/checkpoints/events-animatic-review/README.md`, section "After the user's decisions".

## Task 3.1 (Events copy): drafted, awaiting the user's review (stop point)

- **Deck:** `docs/content/category-copy-events.md`. It covers:
  - the intro;
  - the three shot lines;
  - 5–6 points per service;
  - 5 FAQ entries;
  - the closing line;
  - questions for the client (CONTENT_CHECKLIST #28).
- **Data files keep their `TODO:` placeholders** until the user approves. On approval:
  - fill `Category.intro`, `Category.faq` and the points in `services.ts`;
  - remove the TODOs;
  - run `npx vitest run src/content src/messages`;
  - commit `content(services): Events & Hospitality copy`.
- The service promises are the approved D56 descriptions, unchanged.

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

1. **Branch protection:** the user's choice (above).
2. **Mobile line dwell:**
   - line 1 is 0.67–0.82 s on the approved D72 ranges;
   - a rebalance (for example 0 → 0.45 → 1.05 → 1.2 vh) is a proposal, not applied.
3. **Majlis frames:** about 4.5% over 18 ms at 4× CPU on desktop (2.0% before the pin). The live build (Task 3.2) should re-measure with real images.
3a. **Anchor-landing flake: fixed** (`6fc15df`, `docs/e2e-flakes.md`). The helpers now wait for the heading's focus (the landing's end) before measuring. A future landing helper should do the same, never rely on scroll stillness alone.
4. **Next:**
   - 3.1 approval → 3.1b images (stop point 3) → 3.2 live build → 3.3–3.9;
   - then **Task 4.2, the form pipeline** (pulled forward, D74);
   - then Software & Digital.
