# Session handoff: Phase 1

Written 2026-11-07 at the end of a session, for the session that continues the work. Read `CLAUDE.md` and `AGENTS.md` first; they hold the permanent rules.

## Status

- **Branch:** `phase-1-foundations`. Not merged; do not merge. `main` stays at `c2c85b2`.
- **Last commit:** `chore: session handoff`, which contains this file. Run `git log -1` for its hash. The last feature commit before it is `83bd6da` (hero canvas).
- **Working tree:** clean after the handoff commit.
- **Servers:** none running. Production uses port 3100 and the dev server port 3200; both were stopped.

### Verification at handoff

The production build includes the late-hydration fix.

| Check | Result |
|---|---|
| `npm run build` | pass (exit 0). `/en` and `/ar` are prerendered static (○). |
| `npm run lint` | pass, 0 warnings |
| `npm run typecheck` | pass |
| `npm test` (Vitest) | 9 files, 61/61 pass |
| `npx playwright test` (full suite, 1 worker) | 25 passed, 15 skipped, 6 failed in 9.7 min. See below. |
| Rerun of the 6 failing specs alone (`locale-switch`, `mega-keyboard`, desktop) | 6/6 pass |
| `cls` + `hero-intro` (desktop, `--repeat-each=3`) | Intermittent timeouts before the fix below. After the fix, all pass in the full-suite run above. |

**About the 6 full-suite failures.** They are `locale-switch` ×2 and `mega-keyboard` ×4, all with timeouts and "page closed" errors. The run took 9.7 min, against 4.7 min for the run before it on the same code, which means the machine was under heavy load. Every one of those specs passes when run alone.

The earlier intermittent `cls`/`hero-intro` failures had a real cause, now fixed:
- When hydration landed after the 4.5 s intro deadline, the controller took the short-reveal path.
- That path never set `html[data-intro-seen]`, so the specs waiting for it timed out.
- It now records the intro as seen (D40 addendum).
- `hero-intro.spec.ts` "first visit" now skips itself when the late path ran, because no shutters are expected then.

**First action next session:** run the full suite on a quiet machine. If anything still fails, debug it (`superpowers:systematic-debugging`) before Checkpoint 3.

## Done

| Task | Commit | Notes |
|---|---|---|
| Setup and docs | `c2c85b2`, `cc5e85c` | Scaffold (Next 16.4.5), the plan, the approved reference `docs/design/notime-styleguide.html`, D1–D23 |
| **Checkpoint 1** (plan) | approved | Contact config in `src/config/contact.ts`; Vitest/Playwright as devDeps only; Chrome channel; image generation on hold until Checkpoint 4 |
| 1 Tokens and fonts | `c4b17fe` | Brand tokens, type scale, motion tokens, test tooling |
| 2 i18n | `28d000b`, `93347ec` | next-intl via `next/root-params`, RTL, DirectionProvider (D13, D26–D30) |
| 3 Content system | `498ca2c` | Typed categories, services (prototype draft, OQ #11), products, image slots, contact config |
| 4 Motion infrastructure | `57a1113` | Lenis on the GSAP ticker, ToneController, `useSplitText`, 6 primitives |
| 5 Header | `4ddbcd3` | Logo lockup, language toggle (plain `<a>`, D31), Button |
| 6 Mega menu | `e8ecffc` | Data-driven; hover-intent timing and keyboard support; reducer tests |
| 7 Mobile menu | `f40ea1f` | Accordions (native `details`), scroll lock |
| 8 Shell extras | `5d2d6f9` | WhatsApp button, cursor, footer stub, overflow guard (360px) |
| **Checkpoint 2** (shell) | approved | Screenshots in `docs/checkpoints/checkpoint-2/`. The approval added the hero requirements listed under "In progress". |
| Logo integration (from `docs/brand/logo-source/`) | `070b3f6` | **Done.** Real logo with tone variants, `scripts/export-logo` (D37), client-side footer year (D33), zero-CLS fonts (D34, D35, D38). The dark-background logo is still needed (OQ #12). |
| 9 Hero static layers | `2a085f2` | Server-rendered, visible-at-rest frame, clock, HUD, `time.ts`/`hero-math.ts` tests, `no-js.spec.ts` |
| 10 Hero canvas | `83bd6da` | Transparent canvas with `plus-lighter`, pixel budget, IntersectionObserver/visibility/overlay pauses. Mobile at 4× CPU throttle: 52–60 fps (D39). |
| 11 Steps 1–3: intro + scroll timelines | `chore: session handoff` | See below |

### Task 11 and the Checkpoint 2 hero requirements

All of this code is in the handoff commit.

**Code**
- `hero-controller.tsx`: intro timeline, pinned scrubbed scroll timeline (`gsap.matchMedia` with complementary wide/narrow conditions), repeat-visit reveal, skip listeners, focus pull.
- `hero.tsx`/`hero.css`: `.hero-line-inner` wrappers and the repeat-visit CSS mask with a 2.5 s failsafe.
- `use-split-text.ts`: `splitVars()`.
- `tone-controller.tsx`: numeric zones (D41).

**Requirements status**

| # | Requirement | Status |
|---|---|---|
| 1 | Intro once per session | Done. `sessionStorage["nt-intro"]`; the boot script sets `html[data-intro-seen]`. A repeat visit gets a short title reveal. |
| 2 | Skippable intro | Done. Wheel, touch, pointer or key calls `tl.progress(1)`. |
| 3 | Header keyboard access | Done. The header stays focusable (opacity only); focus entering it finishes the intro. |
| 4 | Canvas pause | Done. Pauses on `html[data-overlay-open]`, when off-screen, and when the tab is hidden. |
| 5 | Mobile pin stability | Done. `svh`, `invalidateOnRefresh`, `ignoreMobileResize`. `e2e/hero-resize.spec.ts` uses a real touch swipe through CDP `Input.dispatchTouchEvent` at 390px. |
| 6 | LCP report | **Not done.** See Next steps 2. |
| 7 | Deliverables | Captured in `docs/checkpoints/checkpoint-3/`, but **stale**: the beat frames were captured before the header-tone fix and must be re-captured. |

**Specs:** `e2e/hero-intro.spec.ts`, `e2e/locale-switch.spec.ts`, `e2e/hero-resize.spec.ts`. `e2e/cls.spec.ts` now waits for the intro to end.

**Scripts**
- `scripts/shots.mjs --hero`: warm fonts by reloading in the same tab, plus the intro, split and beat frames at 1440 and 390 in EN and AR, the cold first visit, and the `hero.webp` recording.
- `scripts/lighthouse.mjs`: 3 runs per locale, mobile, medians plus the LCP element.

**Decisions and questions logged:** D38 amendment (font measurements), D40 (controller design), D41 (tone zones), OPEN_QUESTIONS #14 (font display).

## In progress

**Task 11, Step 4 (LCP report) and Step 5 (re-capture, simplify, report).**

- **Already written and committed:**
  - all of the Task 11 code and specs;
  - the docs listed above;
  - `scripts/lighthouse.mjs`.
- **What's left:**
  1. Run Lighthouse.
  2. Log the LCP element and time for `/en` and `/ar`.
  3. Re-capture the screenshots.
  4. Run `/simplify` within its guardrails.
  5. Commit.
  6. Send the Checkpoint 3 report.

No file is half-written.

## Next steps, in order

1. **Re-verify the e2e suite** on a quiet machine (`npm run build`, then `npx playwright test`). Fix any real failure. The 6 load-related failures listed above should pass.
2. **Finish Task 11 Step 4, the LCP report** (the last Checkpoint 2 hero requirement):
   - start production with `node node_modules/next/dist/bin/next start -p 3100`;
   - with nothing else running, run `node scripts/lighthouse.mjs http://localhost:3100 docs/checkpoints/lighthouse`;
   - log the median Performance/A11y/BP/SEO scores, LCP time, LCP element and CLS for `/en` and `/ar` in DECISIONS (new row D42 or the D38 amendment);
   - targets: LCP < 2.5 s and CLS 0.
   - If the shutters defer the LCP paint on mobile, apply the fallback in the plan: the mobile shutters become a clip-path on the letterbox.
3. **Finish Task 11 Step 5 and send Checkpoint 3:**
   - run `node scripts/shots.mjs checkpoint-3 --hero` with the production server up;
   - run `/simplify`; the guardrails are in CLAUDE.md and the plan: keep reduced motion, RTL, TODOs, ARIA, and the IntersectionObserver/DPR safeguards;
   - commit `feat(hero): …`.
   - Then send the **Checkpoint 3 report in Arabic** and stop for approval. The report must cover:
     - the deliverable paths;
     - the LCP numbers;
     - the fps numbers (D39);
     - OQ #14 (recommend `swap`; show `cold-first-visit-en-1440.png`);
     - that the recording is `hero.webp`, because Playwright video needs an ffmpeg download, which is not allowed;
     - that every font file is preloaded on every page (Alexandria on `/en` too);
     - the ToneController fix (D41);
     - the `ignoreMobileResize` semantics (a height-only resize keeps the pin spacer; an orientation change re-measures);
     - OQ #15 and OQ #16.
4. **Task 11b: profile extraction and content inventory** (done 2026-11-07; see the plan's status line, D47 and D48). From `docs/brand/company-profile-2026.pdf` (38 pages). Full spec: `docs/plans/phase-1.md` → Task 11b.
   - Tool: MuPDF.js in %TEMP%, via `scripts/extract-profile.mjs` (D47). Never add it to `package.json`.
   - Extract to `public/images/work/raw/` (gitignored), skipping pages 20, 30 and 34–37. Then run `scripts/curate-profile.mjs`.
   - Write `docs/content/profile-inventory.md`, `profile-copy.md` and `services-reconciliation.md`.
   - Do not change `services.ts` until the user confirms.
   - Case studies use verified figures only.
   - Add the hero variant "IT'S TIME TO START." (OQ #15).
   - Log the permission questions.
   - The inventory summary and the reconciliation table are reported at Checkpoint 4.
5. **Task 12: `/[locale]/styleguide`.** The approval page mirrors the reference, with computed contrast badges (D20).
6. **Task 13: homepage copy deck** (EN first, then AR written natively), with the banned-phrase test.
7. **Task 14: `image-prompts.md`** and the designed placeholders. Then **Checkpoint 4**: send the copy deck, `image-prompts.md`, the profile inventory summary and the reconciliation table. **No image generation before approval.**
8. **Task 15:** image generation, only if approved. Then **Task 16:** the final review by a **fresh subagent** (`superpowers:requesting-code-review`), accessibility review and Lighthouse ≥ 90/95/95/95. Then **Checkpoint 5**.

## Decisions made this session

All of them are in `docs/DECISIONS.md`:

- **D33** footer year;
- **D34, D35** fonts;
- **D36** Montserrat stays the primary face;
- **D37** logo export;
- **D38**: fonts use `display: optional`, plus the Task 11 amendment;
- **D39** canvas performance;
- **D40** hero controller, including the late-hydration addendum;
- **D41** numeric tone zones.

Earlier sessions: D1–D32.

## Open questions

All of them are in `docs/OPEN_QUESTIONS.md`:

- open: #1–#6 and #10–#14;
- added at handoff: **#15** (hero line "TO CREATE" vs the profile's "TO START") and **#16** (the `.gitignore` ` /docs` entry);
- #7–#9 are resolved (D26–D28).

Task 11b added #17–#21: client names and logos, identifiable people, press and media outlets, the government portals, and original files. #14 and #16 are resolved (D45, D46).

## Known issues and gotchas

- **Ports:**
  - production on **3100** (Playwright's `webServer` reuses it; `PW_BASE_URL=http://localhost:3200` points the suite at the dev server instead);
  - dev on **3200**.
  - Dev and production share `.next`, so stop the other one before `npm run build`.
- **Start production** with `node node_modules/next/dist/bin/next start -p 3100`; in a background shell, prefix it with `exec` so stopping the task kills the server.
- **Slow E: drive:** the project lives on `E:`. Next warns that the filesystem is slow, builds take minutes, and Turbopack caches aggressively. After a change, grep `.next/static` to confirm that it reached the bundle.
- **Machine load:** e2e runs with `workers: 1` on purpose; parallel browsers starve this machine. Timing specs (CLS, intro, menu timing) can fail when the machine is busy. Rerun a failing spec alone before you debug it.
- **next-intl + `cacheComponents`:**
  - `app/[locale]/layout.tsx` is the root layout, with `next/root-params`;
  - the request config pins `timeZone: "Asia/Dubai"`;
  - `cacheComponents` and `partialPrefetching` stay on (D13, D28);
  - unknown paths go to the `[...rest]` catch-all (D29);
  - pages left behind by a client navigation stay in the DOM hidden (React Activity), so controllers bind only `checkVisibility()` elements (D32).
- **Next.js 16:** read `node_modules/next/dist/docs/` before using any API (AGENTS.md).
- **Playwright:**
  - `channel: "chrome"` (the installed Chrome); **never download browsers or ffmpeg**;
  - video needs ffmpeg, so `shots.mjs` records with CDP `Page.startScreencast` and builds an animated WebP with sharp;
  - CDP `Input.synthesizeScrollGesture` does not scroll in headless; use `Input.dispatchTouchEvent`.
- **Fonts:**
  - `display: optional` means a cold first visit usually renders the fallback face (OQ #14);
  - for screenshots, warm the fonts by reloading in the same tab after `sessionStorage.clear()`; a separate warm-up tab does not work.
- **Hero gating attributes:**
  - motion mode is `html[data-js]:not([data-reduced])`;
  - the intro gate is `#hero[data-hero-intro]` without `html[data-intro-seen]`;
  - `#hero[data-hero-ready]` means the controller has taken over;
  - CSS failsafes: shutters and header at 5 s, repeat-visit rise at 2.5 s;
  - the intro deadline is 4.5 s.
- **ScrollTrigger:** when the trigger element is itself pinned, ScrollTrigger subtracts the pin length from its positions. Use numeric start and end values (D41), and give pins `refreshPriority`.
- **Windows and Git Bash:**
  - files use CRLF, and `sed -i` rewrites them as LF; use a Node script that keeps the line endings, or the Edit tool;
  - avoid backticks and nested quotes in inline `node -e`; write a script file instead.
- **Session scratchpad:** temporary helper scripts lived in this session's scratchpad and are gone. The ones worth keeping are now `scripts/shots.mjs` and `scripts/lighthouse.mjs`.
- **Repo size:** the handoff commit includes `docs/brand/company-profile-2026.pdf` (15 MB) and `docs/checkpoints/checkpoint-3/` (31 MB), because the user asked to commit everything. Consider Git LFS or moving them out before pushing.

## Skills used and skill rules

**Used:**
- `superpowers:brainstorming`, `superpowers:writing-plans`, `superpowers:test-driven-development`, `superpowers:verification-before-completion`;
- `frontend-design`, `ui-ux-pro-max`, `framer-motion-animator` (the package is `motion`; import from `motion/react`, tweens only);
- `gsap-framer-scroll-animation`, `design:ux-copy`, `simplify`, `find-skills`.

**Still to use:**
- `superpowers:requesting-code-review` (Task 16, with a fresh subagent);
- `design:accessibility-review`, `wcag-audit-patterns`, `design:design-critique`.

**Rules:**
- install every skill or plugin **globally (user scope) only**: `~/.claude/skills/`, `--scope user`, `-g`;
- never install into `.claude/skills/` in this repo, and never commit skill files;
- confirm the location after installing;
- if a skill only installs per project, stop and ask.

## Files to read first, in order

1. `CLAUDE.md` and `AGENTS.md`: permanent rules.
2. `docs/HANDOFF.md`: this file.
3. `docs/plans/phase-1.md`: Global Constraints, then Task 11 to the end (Tasks 11b–16).
4. `docs/DECISIONS.md`: D13, D16, D19, D32, D38–D41.
5. `docs/OPEN_QUESTIONS.md` and `docs/CONTENT_CHECKLIST.md`.
6. `docs/PROJECT_BRIEF.md` and `docs/design/notime-styleguide.html`: the approved reference. Never replace its palette, fonts or 4px radius.
7. `src/components/sections/hero/hero-controller.tsx`, `hero.css` and `hero.tsx`, then `src/components/providers/tone-controller.tsx`.
8. `scripts/shots.mjs`, `scripts/lighthouse.mjs` and `playwright.config.ts`.
