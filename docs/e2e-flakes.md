# E2E flake log

Rules (D50):

- `retries: 1`. A test that passes only on its retry is **flaky**, never "passed".
- Before every checkpoint: one full run (`npm run e2e`) with nothing else running. Report pass, flaky and fail separately.
- Every flaky or failed test goes in the table below. The **second** flake of the same test is investigated with `superpowers:systematic-debugging` instead of being retried.
- Machine load is a known cause on this machine (8 GB RAM, paging). A run time well above ~3 min signals it. Rerunning a spec alone is a diagnostic, not a pass.

| Date | Run | Test | Outcome | Notes |
|---|---|---|---|---|
| 2026-11-07 | Full suite, before CP5 (no retries yet) | `cls` (en, ar), `hero-intro` (3 desktop, 1 mobile), `locale-switch` (2), `mega-keyboard` (4) | fail ×11 | Run took 16.3 min (normal ~3). All passed when rerun alone (27 s). Counted as load failures, not passes. |
