# E2E flake log

Rules (D50):

- `retries: 1`. A test that passes only on its retry is **flaky**, never "passed".
- Before every checkpoint: one full run (`npm run e2e`) with nothing else running. Report pass, flaky and fail separately.
- Every flaky or failed test goes in the table below. The **second** flake of the same test is investigated with `superpowers:systematic-debugging` instead of being retried.
- Machine load is a known cause on this machine (8 GB RAM, paging). A run time well above ~3 min signals it. Rerunning a spec alone is a diagnostic, not a pass.

| Date | Run | Test | Outcome | Notes |
|---|---|---|---|---|
| 2026-11-07 | Full suite, before CP5 (no retries yet) | `cls` (en, ar), `hero-intro` (3 desktop, 1 mobile), `locale-switch` (2), `mega-keyboard` (4) | fail ×11 | Run took 16.3 min (normal ~3). All passed when rerun alone (27 s). Counted as load failures, not passes. |
| 2026-11-07 | Full suite, before CP6 (workers 1, retries 1, quiet machine) | all | pass 39 · flaky 0 · fail 0 · skipped 19 | 3.5 min including the build. The 19 skips are viewport-specific (desktop-only or mobile-only tests). |
| 2026-11-07 | Full suite, after the anchor utility, brand line and approved services (D53–D56; workers 1, retries 1, quiet machine) | all, including the new `anchor-scroll` | pass 53 · flaky 0 · fail 0 · skipped 23 | 4.5 min. The 23 skips are viewport-specific. |
| 2026-11-08 | Unit suite (vitest, full run) | `content.test.ts` › "every slot with a file records the file's real pixel size" | flaky ×1 | Failed once in the full run, right after docs-only changes; passed alone (2.4 s) and in two full reruns (103/103). Error text not captured. Suspected: the 5 s default timeout while 14 workers read image files with sharp. First occurrence; a second one goes to systematic-debugging. |
