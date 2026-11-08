# Session handoff: Phase 2, Events animatic review

Written 2026-11-08 at the end of a session, for the session that runs the Events animatic review. Read `CLAUDE.md` and `AGENTS.md` first; they hold the permanent rules. Decisions are in `docs/DECISIONS.md` (latest: D68–D71), the plan in `docs/plans/phase-2-services.md`.

## Branch and remote

- **Working branch: `main`.** All Phase 2 work is committed on `main`, locally and on `origin/main` (GitHub, private repo `beshoynady/notime-website`).
- **`phase-1-foundations`** (GitHub's default branch) stays at `fee1d73`, the storyboard docs commit. `main` is a straight fast-forward of it: `fee1d73` is an ancestor of `main`, with no merge commits. The Phase 2 commits after `fee1d73` exist only on `main`.
- **Nothing has been merged, and nothing should be** without the user's say-so. Don't change GitHub's default branch either.
- **Last commits on `main`** (newest first):

| Commit | What |
|---|---|
| this commit | `chore: session handoff; services update (D71)`. Run `git log -1` for its hash |
| `1d39101` | `feat(lab)`: Events & Hospitality animatic (Task 3.0) |
| `12873c6` | `feat(services)`: category sections, FAQ, quote block, theme tokens and grounds (Task 2.5) |
| `ca28d79` | `fix(seo)`: real 404 on the first request for unknown categories and lab pages |
| `1a2c0c0` | `test(services)`: park Task 2.5's unbuilt checks as fixme |
| `510fdab` | `feat(scenes)`: scene image slots and the colour grade export (Task 2.10) |

- **Servers:** none running. Both were stopped at handoff.

## Events animatic (Task 3.0): built, awaiting the user's rhythm review

This is **stop point 2**. Don't start 3.1 until the user has judged the rhythm on the animatic.

- **Where:** `/en/lab/events-animatic` and `/ar/lab/events-animatic`.
  - **Opening:** `EVENTS_OPENING`, four shots on a 2.0 vh pin; on mobile, three shots on 1.2 vh.
  - **Majlis:** `EVENTS_MAJLIS`, a pass scene in section V. It is never pinned and plays over its crossing.
  - Config: `src/content/scenes/events-hospitality.ts`. Shot lines are drafts in `scenes.events.s1`–`s4`.
- **Lab only:** both scenes are in `LAB_SCENES` / `LAB_SECTION_SCENES` (`src/content/scenes/index.ts`). On approval, move them to `SCENES` / `SECTION_SCENES`; the public page then shows them (D70).
- **Shot timings:**

  | Shot | Desktop (vh) | Mobile (vh) |
  |---|---|---|
  | 1 Empty room | 0 → 0.45 | 0 → 0.35 |
  | 2 Lights up | 0.45 → 0.95 | merged into 3 |
  | 3 Dressed | 0.95 → 1.5 | 0.35 → 1.0 |
  | 4 Ready | 1.5 → 2.0 | 1.0 → 1.2 |

  The majlis pour runs over 40–70% of its crossing. One call the user should confirm: on mobile, lights and dressing merge into one shot, and that shot's line is shot 3's (D70 (3)).
- **Review material sent to the user:** 18 screenshots (1440/390, EN/AR, each shot and the majlis) and three animated-WebP recordings (EN 1440, EN 390, AR 1440). They are in the previous session's scratchpad and are not in the repo. To make new ones, see "Recordings" below.
- **Tests:** `e2e/events-animatic.spec.ts` covers shot order on the pin, the majlis crossing, reduced motion, and the public page staying static. `src/lib/scene-math.test.ts` covers pass-scene rules; `src/content/scenes/scenes.test.ts` covers the review gating.

## How to run the lab

The lab route is a 404 unless the build has the flag. It is read at build time.

```bash
NEXT_PUBLIC_ENABLE_LAB=1 npm run build
NEXT_PUBLIC_ENABLE_LAB=1 npm run start -- -p 3100
# open http://localhost:3100/en/lab/events-animatic
```

- **Playwright** reuses a server already on 3100 (`playwright.config.ts`). Lab specs skip themselves when the lab is off.
- **Before rebuilding,** stop whatever holds 3100 (PowerShell): `Get-NetTCPConnection -LocalPort 3100 -State Listen | % { Stop-Process -Id $_.OwningProcess -Force }`.
- **Recordings:** Playwright video needs an ffmpeg download, which the rules forbid. Capture frames with Playwright screenshots while stepping the scroll, then join them with sharp into a **near-lossless** animated WebP. Lossy WebP leaves stale blocks in dark gradients, and GIF's palette breaks the browns (D70 (4)).

## Verification at handoff

| Check | Result |
|---|---|
| `npm run build` (with the lab flag) | pass |
| `npm run lint`, `npm run typecheck` | pass |
| Vitest | 27 files, 190/190 pass |
| Full e2e on `1d39101` (1 worker, retries 1; machine loaded) | **210 passed, 1 flaky, 0 failed**, 103 skipped (width-specific), 11.6 min |
| After D71 (services update): `category-structure`, `category-index`, `category-modules`, `anchor-scroll`, `mega-keyboard`, `mobile-menu` | 110 passed, 0 failed, 0 flaky, 70 skipped |

## Open items

1. **Workshop texture.** Spec §5.4 gives Production, Print & Gifts a paper grain on champagne. That conflicts with the rule the user set: grain on dark grounds only, never on light (D69). The Workshop has no grain now. Ask the user whether it stays that way.
2. **Flaky `mega-keyboard` (ar).** This was its second occurrence (after 2026-11-07), so it was investigated, not retried. Details in `docs/e2e-flakes.md`.
   - Diagnosis: machine load, no code change.
   - Alone, it failed 1 in 10. With traces, it passed 8 of 8 but took 10–41 s per run (normal ~3 s): one key press 2.6 s, context teardown 29 s.
   - Memory: 8.1 of 10.1 GB committed.
   - Next step: rerun it on a quiet machine. If it fails there, debug the menu.
3. **Services update for paid media (D71): applied in the handoff commit.** Points the user still has to answer:
   - Business cards and brochures are small-format items inside "Large-format printing". Should the title and summary widen?
   - "Digital marketing & SEO" still mentions "paid media" in its summary, which now overlaps service 18.
   - Event equipment rental (LED screens, audio, lighting, kiosks) is only added if the client confirms (OPEN_QUESTIONS #22).
4. **Draft copy awaiting approval:**
   - the closing line per category (`Category.closing`, CONTENT_CHECKLIST #27);
   - the Events shot lines (CONTENT_CHECKLIST #26).
5. **Canva:** 2 AI images still pending until credits renew.

## Next tasks (after the animatic is approved)

- **3.1 Events copy.**
  - Write the copy deck `docs/content/category-copy-events.md`: intro, the promise and 4–6 points per service, 5 FAQ entries, the approved shot lines. EN first; AR written natively.
  - Sources: only `profile-copy.md` and `services-proposal.md`. Anything that needs client facts becomes a TODO in CONTENT_CHECKLIST.
- **3.1b Events layer images: stop point 3.**
  - Confirm the Canva credit costs first.
  - Generate `ev-open-hall` and `ev-majlis-dusk` (16:9 and 9:16), cut out the real sources, and grade them with `scripts/grade.mjs evening`.
  - Build a contact sheet, then stop for approval.
- **Then 3.2:** the live Evening theme, opening and majlis (section lights, candle flicker, the pour drawn as an SVG stroke).

## Standing rules this session added

- A spec for unbuilt work is committed as `test.fixme` with a task reference, never red. Remove the fixme as each part is built.
- Report e2e as pass / flaky / fail. A retry-pass counts as flaky. A test's second flake gets debugged, not retried.
- Never download Playwright browsers or ffmpeg (`channel: "chrome"`). Run nothing in parallel with a full e2e run or Lighthouse.
