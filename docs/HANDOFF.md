# Session handoff: final quality & growth pass (§1–§8), then the Arabic report

Updated 2026-11-16 (session 2 of the post-M3 pass). Read `CLAUDE.md`, `AGENTS.md` and `PRODUCT.md` first. Decisions: `docs/DECISIONS.md` (latest D109). Open judgment calls: `docs/review/decisions-to-confirm.md` (#30–#33 open).

## The user's brief for this pass (authoritative; "no stops" until the end, then one Arabic report)

§1 settled decisions · §2 AI mentions out · §3 native Arabic · §4 design polish · §5 photographic scroll storytelling · §6 growth (links page, lead source, private-client path, v1.1 SEO pages, launch checklist) · §7 speed (Task 16) · §8 fresh-subagent code review + green full CI · final report: what changed, Lighthouse before/after, screenshots of the most changed pages (1440/390 EN/AR) + 3 frame sequences of photo scenes, CI, a fresh tunnel link, decisions to confirm.

| Part | State |
|---|---|
| §1 decisions; impeccable hooks | **Done.** #21–#29 logged; the impeccable hooks (SessionStart/PostToolUse/Stop) removed from the gitignored `.claude/settings.local.json`; `.github/hooks` is gone. |
| §2 AI mentions (D106) · §3 Arabic (D107) · §4 polish (D108) | **Done** in the previous session. |
| §5 photo scenes (D109, `b03a1d8`) | **Done.** Events opening 2.5D + wipe, home Work strip, About split screen, private stack, Print gift cutout, service-photo wipes. Tools: `scripts/frames.mjs` (frame sheets), `scripts/grade-stories.mjs`. Not yet eyeballed after the last move: the Print gift's final place (`gift` rig). |
| §6 growth | **Next.** |
| §7 speed | Inline CSS committed, unmeasured (see "Part 5" below for the order). |
| §8 review, CI, report | Not started. |

Review server: `npm run review:start -- 3100` on the review build; the quick tunnel from the last session still runs (https://arrival-kingdom-justify-plastics.trycloudflare.com/ar); restarting the review server keeps the link, restarting cloudflared changes it.
Machine: Python 3.14 has no OpenCV wheel (pip compiles for ages): use Pillow/numpy/scipy; `rembg` works with `python -P` (not `-I`, which hides user site-packages).

### Part 5: where it stands

- **Before** (mobile, simulated throttling, 1 run each, `docs/checkpoints/lighthouse/post-m3/before.json`, script `scripts/lighthouse-pages.mjs`): perf 46–58 everywhere; home EN/AR 46/46 (LCP 4.9/4.8 s, TBT 2.2/3.3 s); categories 48–58; CLS 0 on all; LCP is text except Print (a scene layer). JS 319 KB (home) / 381 KB (categories) transferred; fonts 66 KB EN / 60–95 KB AR. SEO 92 = only the canonical check (it points at notimehub.com from localhost; passes in production).
- **Diagnosis (home EN):** simulated LCP 5.0 s = TTFB 0.2 s + **render delay 2.7 s**; 14 render-blocking CSS files (83 KB raw, ~15 KB gz). Main thread: script eval 3.7 s, style & layout 3.1 s. Chunks: react-dom/Next runtime ~390 KB raw (fixed cost), GSAP+ScrollTrigger 112 KB, **Motion 144 KB (41 KB unused at load)**. Forced reflow only ~225 ms.
- **Committed, NOT yet measured:** `experimental.inlineCss: true` in `next.config.ts` (builds clean). **Next action:** start the prod server (`TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA MAIL_SINK=file MAIL_FROM=website@example.com npx next start -p 3000` after a build with `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA`), run `node scripts/lighthouse-pages.mjs http://localhost:3000 docs/checkpoints/lighthouse/post-m3/after-inline.json` with **nothing else running**, compare; keep it only if LCP/perf improve (revert otherwise).
- **Then, in order:** (1) Alexandria subset: `python scripts/subset-alexandria.py` writes `alexandria-arabic.v2.woff2` (Arabic block + joiners only, all features and the weight axis kept; fontTools is installed); point `src/app/fonts.css` and `src/lib/fonts.ts` at v2; check harakat (حِرَف) and digits render. (2) Motion: `LazyMotion` + `m` with `domAnimation` loaded async (check for `layout`/drag use first; never touch GSAP-owned elements). (3) Defer non-critical client islands (custom cursor, magnetic, WhatsApp FAB, mega-menu panel) to idle or first interaction, without changing behaviour. (4) Print's LCP is a scene layer: make it text. Measure after each; LCP must stay text and CLS ~0.
- Target (user): mobile ≥ 90 on home + categories EN/AR. Likely not fully reachable with this motion design under 4× CPU throttling; report honestly with before/after.


## History (before this session's post-M3 pass)

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
- **Step 2 done (2026-11-15):** Software (D96) and Events (D98) merged. **Step 3a done:** Marketing/Creative/Print hooks, Creative's real frame, AR fixes (D99; the 12 photo modules → v1.1).
- **Step 3 done (2026-11-16):** section visuals (D100), Work/About/Products (D101). **Step 4 done:** Contact + the form pipeline (D102, `9e06281`): Turnstile (test keys on dev/review/e2e; fail closed in production without keys), Resend team email + auto-reply (needs `MAIL_FROM` on the verified domain), the brief with `?service=`, quote block + service CTAs public. `e2e/forms.spec.ts` 6/6 green on the prod build. Also fixed: ToneController initial state (a short opening hid the next section on phones), About/Contact light-leak overflow. **Step 5 done (D103):** share images per page/locale on one renderer, layout openGraph/twitter, home Organization + WebSite JSON-LD, the 404 with a Services route; legal already current. **Now (lead): M3** (the only stop): the fresh-subagent gate (design-critique, accessibility-review, copy check; fix High), the full e2e on a prod build, the full CI by `workflow_dispatch`, every-page screenshots 1440/390 EN/AR, the review build + a fresh tunnel, the one-screen Arabic report (decisions #21–#28), and the manual form send to the user's inbox via the review build. Rule (D100): a production build after each merge; e2e at M3 only.
- **M3 (2026-11-16):** the quality gate ran (fresh reviewer; copy check passed); fixes D104 (no self-killing ScrollTriggers: the Software page crashed when opened scrolled) and D105 (the footer no longer hides the last section, Marketing's hook, contrast, forms, Contact in the footer, five polish states; Lows deferred to v1.1.md). e2e: each form test posts as its own client (rate limit). Final screenshots: `docs/checkpoints/m3/<page>/full-{en,ar}-{1440,390}.jpg` (local only, gitignored; 64 shots, no console errors, no overflow). Review build on 3100 + quick tunnel (link in `docs/review/tunnel.md`). **Next:** the user reads the Arabic M3 report and confirms decisions #21–#29; the user sends the brief through the tunnel to confirm the email arrives (Task 4.2 step 4).
- **M3 to-do carried:** run the edited e2e specs (`events-animatic`, `opening`, `category-modules`, `hero-fit`), re-measure module reservations (`scripts/anchor-shift.mjs`), retake the Software proof shots, check the custom cursor in AR for horizontal scroll.
- **Next:** step 3 (Marketing/Creative/Print visual completion ‖ Work index + case template + 3 cases), step 4 (About ‖ Products), step 5 (Contact + the pipeline delivery ‖ legal, credits, 404, SEO), step 6 (the M3 gate, CI, every-page screenshots; the only stop).

## Machine notes

- Stopping a background `next build`/`next start` leaves node running: kill the leftover `next` processes (PowerShell `Get-CimInstance Win32_Process … Stop-Process`) before rebuilding.
- Local Node is 24; the repo pins 22 (`engines`, `.nvmrc`), so npm prints an EBADENGINE warning locally. Harmless; CI runs 22.
- Git Bash mangles `/en` arguments: pass `//en`.
