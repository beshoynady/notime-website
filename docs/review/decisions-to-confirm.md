# Decisions to confirm

Judgment calls made in speed mode (D82). Each one is already applied and logged in `docs/DECISIONS.md`; confirm it, or name the change. The milestone reports list the new ones.

| # | Decision | Ref | Recommendation |
|---|---|---|---|
| 1 | Pre-commit typechecks the whole project once (not per file) when any TypeScript is staged: tsc can't check single files against the path aliases and Next's route types. | D82 (4) | Keep. |
| 2 | The local production build runs before each milestone instead of before every commit; CI's full job builds on every manual run and PR to `main`. | D82 (6) | Keep. |
| 3 | Creative s1 EN stays "A black box. Nothing in frame yet.": a black box is the studio's own word for the space, and it pairs with «مساحة سوداء». | D81 (6) | Keep. |
| 4 | The three template-built categories (Creative, Marketing, Print) ship in v1 with their opening scene, theme and two no-photo modules each; their other 12 modules follow after v1 and stay hidden meanwhile. | D83 | Keep: the pages are complete without them, and they need photographs we don't have yet. |
| 5 | Module copy lives in `src/content/modules/<key>.ts` (localized fields) instead of the messages JSON. | D83 (3) | Keep: CMS-ready and conflict-free in parallel work. |
