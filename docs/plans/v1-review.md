# v1 for Rand: review-ready site, implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A complete, bilingual, review-ready site that Rand opens on a protected preview, reviews by section number, and approves, while the production build stays as honest as D78 requires.

**Architecture:** Everything builds on what exists (Next.js 16, next-intl, typed content in `src/content/`, GSAP/Motion/Lenis, the category-page system of phase 2). Three things are new:
- **Review mode:** a build flag that loads example content from modules production never imports.
- **A stock-image intake:** Pexels, sharing the grading and crop code of `ingest-images.mjs`.
- **A small ornament and image-treatment kit,** documented in the styleguide.

The pages follow the user's order, each page ending in a checkpoint.

**Tech stack:** as in DECISIONS (Next.js 16, Tailwind v4 logical utilities, next-intl, GSAP + ScrollTrigger + SplitText, Motion, Lenis, React Hook Form + Zod, Resend + React Email, Turnstile, sharp, Vitest, Playwright).

**Spec:** [docs/superpowers/specs/2026-11-09-v1-review-design.md](../superpowers/specs/2026-11-09-v1-review-design.md), with the user's brief "Goal: a complete, review-ready site for the client" (2026-11-09) and the existing [phase-2-services.md](phase-2-services.md), whose open tasks (3.1b–3.9, 4.0–4.7, Part 4) are folded in below unchanged.

## Global Constraints

- CLAUDE.md applies in full: logical properties only; strings in messages or content files; GSAP for scroll, Motion for interaction, never both on one element; reduced motion shows the final state; RTL mirrors, marquees and horizontal scroll reverse.
- **LCP is always text, CLS 0, mobile Lighthouse 90+.** Per-page budgets are unchanged (scene ≤ 600 KB mobile, D64).
- **Production (flag off) shows no example content,** no `Example – to be replaced`, no review banner, no reference numbers, no `TODO` (D78).
- **Review-mode strings, exactly:**
  - badge "Example – to be replaced" / «مثال – يُستبدل»;
  - banner "Review version – not public" / «نسخة مراجعة – غير منشورة»;
  - people "Client name" / «اسم العميل» and "Role, Company" / «المنصب، الشركة».
- **No invented claims:** no numbers, durations, prices, guarantees, certifications, client names or awards that the profile and DECISIONS don't support. A needed fact is phrased as a process ("we confirm it in the proposal") and listed in `docs/review/fact-check.md`.
- **No competitor named or compared** anywhere on the site. Nothing copied from the benchmark sites.
- **Images:**
  - Priority: real → Pexels stock → the user's ChatGPT images (D79) → designed placeholder.
  - Graded, cropped at native size, never upscaled (D51).
  - Stock never presented as NO TIME's work; on a Work card it carries "Illustrative" / «صورة توضيحية».
  - Every stock file has a row in `docs/content/image-licences.md` (source, photographer, URL, licence, date, sha256).
  - Never scraped.
- **Copy rules:**
  - `src/lib/copy-rules.ts` (banned list) passes on every new string.
  - Write the EN first, then native AR, in the voice of the approved decks.
- Approved earlier and still owed (fold in, don't drop): the D78 data moves, A5 showreel, A7 rental, A8 print store, C content-status, Task 4.2.
- **Commits:**
  - Every commit passes the pre-commit hook.
  - A spec for unbuilt work is `test.fixme` with a task reference.
  - No force-push, no `--no-verify` without the user's approval.
  - Reports to the user in Arabic.

## Review Focus

1. **Production leak:** a production build (`NEXT_PUBLIC_REVIEW_MODE` unset) whose HTML or JS contains "Example – to be replaced", «مثال – يُستبدل», the banner text or a `data-ref` attribute. The expected result is none at all (Task A1: a build-output scan, plus e2e in both modes).
2. **A stock file with no licence row,** or a row whose sha256 doesn't match the file. The expected result is a failing unit test (Task A3).
3. **Hover treatments on touch:** the light sweep or duotone gets stuck after a tap on a phone. The expected result: treatments apply only under `(hover: hover) and (pointer: fine)`, and touch gets the scroll-driven version (Task A4, e2e on the mobile project).
4. **An Arabic page with a review badge, reference tag or ornament on the wrong side,** or a marquee divider running the English direction. The expected result is a mirror image (Tasks A1 and A4, e2e at `/ar`).
5. **The form with JS disabled, or Turnstile failing:** the user sees a clear error and the WhatsApp fallback, never a silent success (Task F3).

---

## Phase 0: Research and plan (this stop)

- [x] `docs/research/benchmarks.md`: 8 sites, adopt and avoid per site, a gap list.
- [x] This plan and its design doc.
- [ ] **STOP:** the user approves the plan and answers the 4 decisions in the design doc.

## Phase A: Foundations (unblock every page)

### Task A1: Review mode: flag, banner, reference numbers, example blocks

**Files:**
- Create: `src/lib/review.ts`, `src/lib/review.test.ts`
- Create: `src/components/review/{review-banner,section-ref,example-badge,example-block}.tsx`, `review.css`
- Create: `src/content/review/{testimonials,logos,team,press,stats}.ts`
- Modify: `src/app/[locale]/layout.tsx` (banner), `src/messages/{en,ar}.json` (`review.*`)
- Test: `e2e/review-mode.spec.ts`, `scripts/check-no-review-leak.mjs` (run in CI after `next build`)

**Interfaces:**
- Produces:
  - `isReviewMode(): boolean` (reads `process.env.NEXT_PUBLIC_REVIEW_MODE === "1"`);
  - `<SectionRef id="EV-05" />` (renders `null` unless review mode; otherwise a small tag with `data-ref`);
  - `<ExampleBlock kind="testimonials" />` (lazy-imports `src/content/review/<kind>.ts` only when `isReviewMode()`, else renders `null`);
  - `<ExampleBadge />`;
  - `type SectionRefId = \`${"H"|"EV"|"SW"|"PG"|"MB"|"CP"|"WK"|"AB"|"PR"|"CT"|"LG"|"ER"}-${number}\``.

- [ ] Step 1: unit tests. `isReviewMode` is false for unset, "0" and "true", and true only for "1". Every `SectionRefId` used in `src/` is unique: the test greps the `id="XX-NN"` literals and fails on duplicates.
- [ ] Step 2: run, expect FAIL (module missing). Then implement and run, expect PASS.
- [ ] Step 3: `e2e/review-mode.spec.ts`:
  - **Production project:** no `[data-ref]`, no banner text and no badge text on `/en`, `/ar` and every category page.
  - **A `review` Playwright project** (on its own port, built with the flag): the banner is visible and fixed, adds no CLS and doesn't cover the header's skip link; refs are visible; every example block has its badge; at `/ar` the badges sit at the inline start.
  - The review project is `test.fixme` until Task A1 lands, per the e2e policy.
- [ ] Step 4: `scripts/check-no-review-leak.mjs` scans `.next/server` and `.next/static` of a production build for the three strings and `data-ref`, and exits 1 on any hit. Add it to CI after the build.
- [ ] Step 5: Commit.

### Task A2: Content status (D78 C) and the no-TODO guarantee

**Files:**
- Create: `src/lib/content-status.ts` + test
- Modify: `whatsapp-button.tsx`, `nav-links.ts`, `site-footer.tsx`
- Test: `e2e/no-placeholder.spec.ts`

**Interfaces:**
- Produces:
  - `contactStatus(c: ContactConfig): { email: boolean; whatsapp: boolean; socials: { instagram: boolean; facebook: boolean } }`;
  - `isFilled(v: string | Localized<string> | null | undefined): boolean` (false for empty, whitespace or a value containing "TODO").

- [ ] Step 1: unit tests for the hide rules:
  - empty or whitespace is hidden;
  - a localized value with one empty locale is hidden;
  - the WhatsApp button returns `null` with no number;
  - footer contact lines hide individually.
- [ ] Step 2: red, then green.
- [ ] Step 3: `e2e/no-placeholder.spec.ts` visits every public route in both locales (from the sitemap plus legal and 404) and asserts:
  - the visible text has no "TODO", "placeholder", "Lorem", `{token}`, or the "number pending" stub;
  - no `href="#"` or empty `href`.
- [ ] Step 4: fix the nav links that point at missing anchors (`NAV_LINKS` work, digital and contact; `QUOTE_HREF`): they point at real routes once those exist, and are hidden until then.
- [ ] Step 5: Commit.

### Task A3: Stock-image intake (Pexels) and the licence log

**Files:**
- Create: `scripts/stock.mjs`, `docs/content/image-licences.md`
- Create: `src/content/credits.ts`, `src/app/[locale]/credits/page.tsx`
- Modify: `src/lib/image-gen.ts` (extract the crop, grade and encode shared with `ingest-images.mjs`), `src/content/images.ts` (`source: { kind: "stock", id }`)
- Test: `src/lib/licences.test.ts`

**Interfaces:**
- Consumes: `centreCrop`, `inboxTarget`-style slot lookup, `grade.mjs`.
- Produces:
  - `node scripts/stock.mjs search <slot> "<query>" [--orientation landscape|portrait]`: Pexels search; writes a candidates contact sheet to `raw/stock/<slot>/sheet.png` and a JSON with ids. Never downloads more than the candidates' previews.
  - `node scripts/stock.mjs pick <slot> <pexelsId>`: downloads the original, records the licence row, crops, grades and encodes into the slot, and prints the size and blur.
  - `parseLicences(md: string): LicenceRow[]`, with `LicenceRow = { file, source: "Pexels"|"Unsplash (manual)", photographer, url, licence, date, sha256 }`.

- [ ] Step 1:
  - failing test: every file under `public/images/stock/` has exactly one row in `image-licences.md`, and the row's sha256 matches the committed original's hash recorded at pick time;
  - every row's file exists;
  - the `/credits` data lists every row.
- [ ] Step 2: red, then implement `parseLicences` and the script. Run green.
- [ ] Step 3: the key check reports `PEXELS_API_KEY` present or absent by **name only**. With no key, the script stops and tells the user.
- [ ] Step 4: a selection checklist printed with every sheet: no faces in focus, no brands, logos or text, Gulf/luxury fit, grades to espresso/champagne. I look at every candidate at full size before `pick`.
- [ ] Step 5: Commit.

### Task A4: Ornament and image-treatment kit, documented in the styleguide

**Files:**
- Create in `src/components/ornaments/`: `hairline.tsx`, `frame-corners.tsx`, `geometric-pattern.tsx` (an 8-fold tile as inline SVG `<pattern>`), `light-leak.tsx`, `tick-marker.tsx` (clock ticks in eyebrows), `marquee-divider.tsx`
- Create in `src/components/motion/`: `ken-burns.tsx` (GSAP, scroll-scrubbed or time-based when in view), `hover-sweep.tsx` (Motion, fine pointer only), `duotone.css`
- Modify: `src/app/[locale]/styleguide/page.tsx` (a "Patterns" section per new element, with do and don't), `docs/design/notime-styleguide.html`
- Test: `e2e/ornaments.spec.ts`, unit tests for any math (`ken-burns` progress → transform)

**Interfaces:**
- Produces:
  - `<FrameCorners tone="champagne" inset="sm|md" />`
  - `<GeometricPattern opacity={0.04} />` (dark sections only)
  - `<LightLeak position="start-top" />`
  - `<TickMarker />` (inside `.eyebrow`; 12 ticks, one advancing per section in view, static under reduced motion)
  - `<KenBurns from={1} to={1.08} />` wrapping a `BrandImage`
  - `<HoverSweep>` around a card media
  - class `duotone` on Work card media

- [ ] Step 1: unit-test the Ken Burns math. Scale stays within [from, to], and the transform origin mirrors in RTL.
- [ ] Step 2: e2e:
  - at `/ar`, `FrameCorners` and `LightLeak` positions mirror;
  - under `reducedMotion: "reduce"`, Ken Burns, tick and sweep produce no transform change over 2 s;
  - on the mobile project, hover treatments aren't attached;
  - CLS stays 0 on the styleguide.
- [ ] Step 3: build, then document each element in the styleguide.
- [ ] Step 4: `design:design-critique` on the styleguide patterns. Fix, then commit.

### Task A5: D78 data moves (approved, still owed)

**Files:**
- `src/content/{faq,forms,principles,work,products}.ts`
- `site-footer.tsx`
- messages
- `docs/content/category-copy-software.md` (s1)
- `docs/content/review-fill-or-hide.md` (status)
- `docs/content/legal/*.md` (a pointer to `src/content/legal.ts`)

- [ ] Footer:
  - legal links;
  - the disclosure line "Some images on this site are AI-generated illustrations." / «بعض الصور في هذا الموقع توضيحية ومولّدة بالذكاء الاصطناعي.»;
  - the licence line from config, hidden when empty;
  - "Image credits";
  - the stub removed.
- [ ] Events FAQ to 8:
  - add «قبل كم من الوقت ينبغي أن أحجز؟» and «كم ضيفًا يمكنكم استقبالُه؟»;
  - extend "Where do you work?" with "For other locations, ask us." / «ولأي مكان آخر، اسألنا.»;
  - raise the content test's FAQ cap to 8 (red first).
- [ ] Products:
  - Minute Zero / «الدقيقة صفر» and Peak Hour / «ساعة الذروة»;
  - lockups in titles, metadata and schema;
  - short names inside the pages.
- [ ] Forms data:
  - the approved budget bands;
  - principles (4, unnumbered);
  - work: anonymised entries ("A national airline" / «شركة طيران وطنية»; Arabian Travel Market kept), a `named` flag, and no branded photo on an anonymised case (a unit test checks against a deny-list of the audited files).
- [ ] Verify EN and AR at 1440 and 390. Commit and push.

## Phase B: Homepage, remaining sections (checkpoint B)

One task per section. Each one:
- invokes `frontend-design`, `ui-ux-pro-max` and `design:ux-copy` before building, and `framer-motion-animator` for its interactions;
- adds its messages in EN and AR;
- gets a `SectionRef` (H-04 …);
- gets an e2e smoke test (renders, RTL direction, reduced motion static);
- folds in the gap list from benchmarks.md where it applies.

| Task | Section | Ref | Notes |
|---|---|---|---|
| B1 | Our Work (featured) | H-04 | Real projects first. Anonymised by default (D67). Card meta: descriptor · type · year · city. Duotone to full colour on hover. Stock or AI marked "Illustrative". Links to `/work`. A "Watch the reel" link in the header opens B6 in a dialog (benchmarks: reel as first proof, never autoplay in the hero). |
| B2 | Services marquee | H-05 | All 30 services from `services.ts`; reverses in AR; pauses on hover; static row under reduced motion. Existing `motion/marquee.tsx`. |
| B3 | Beyond events: Digital Solutions | H-06 | Visually distinct (The Interface tokens). 4 capabilities plus 2 product cards (Minute Zero, Peak Hour, "Coming soon"). Phase-2 Task 4.5. |
| B4 | How we work | H-07 | 4 steps built by scroll. Pinned on desktop ≤ 1 vh, stacked on mobile. Existing `process.*` messages. |
| B5 | Six markets | H-08 | Markets from the profile only; a typographic or line map (no map tiles). |
| B6 | Showreel (A5) | H-09 | Code-driven from curated real photos with no faces: Ken Burns, crossfades and grain, about 20–30 s, lazy, poster, reduced-motion still. Opens in an accessible dialog from B1 (focus trap, Esc, close button, pause). |
| B7 | Final CTA and full footer | H-10, H-11 | Quote CTA to `/contact`; WhatsApp only when the number exists. |
| B8 | Trust blocks (review-only) | H-12 … | `ExampleBlock` testimonials, logos and stats where the benchmark puts them. `null` in production. |

- [ ] **Checkpoint B:**
  - screenshots at 1440 and 390, EN and AR, in `docs/checkpoints/v1-home/`;
  - `design:design-critique` and `design:accessibility-review`;
  - Lighthouse mobile on `/en` and `/ar` (nothing else running);
  - the user reviews.

## Phase C: Events & Hospitality, full build (checkpoint C = phase-2 Checkpoint 7)

Phase-2 Tasks 3.1b → 3.9, as written there. Differences:
- images: real cutouts → Pexels plates where no real source exists → the user's ChatGPT plates (D79);
- FAQ at 8;
- `SectionRef` EV-01 … on every section;
- ornaments from A4 where the storyboard allows;
- a **related-work block** before the quote block: anonymised cases of the category from `work.ts`, hidden when there are none (benchmarks gap). It becomes `RelatedWork({ category })`, reused in Phases D and E.

## Phase D: Software & Digital (checkpoint D = phase-2 Checkpoint 8)

- Phase-2 Tasks 4.0 → 4.7.
- **Task 4.2** (the form pipeline) is finished here:
  - Zod schemas with the approved fields and budget bands, shared by client and server;
  - the Server Action with Turnstile, honeypot and rate limit (both built);
  - Resend team notification **now**, with the auto-reply deferred until the domain is verified (not counted as a failure);
  - React Email templates (`react-email`, `email-best-practices`);
  - privacy notice under the form;
  - e2e with the mailer mocked.
- The deck s1 line is "Every platform starts with a cursor." / «كل منصّة تبدأ بمؤشّر.».

## Phase R: Review deployment (after B, C, D)

> **Superseded (D89):** review runs on the Cloudflare tunnel (`docs/review/tunnel.md`), and production on Hostinger (`docs/launch/hostinger-deploy.md`). There is no Vercel; R1–R2 below are kept as history.

- [ ] R1 (the user):
  - Vercel Pro account;
  - import the private GitHub repo;
  - set the env vars in Vercel: `NEXT_PUBLIC_REVIEW_MODE=1` on Preview only, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, the Turnstile keys, `PEXELS_API_KEY` not needed at runtime;
  - Deployment Protection: Standard Protection on;
  - create one Shareable Link on the `review` branch.
- [ ] R2 (me):
  - `review` branch tracking `phase-2-services`;
  - a review build that sends `X-Robots-Tag: noindex` and `robots.txt` Disallow when the flag is on (test);
  - the preview builds green;
  - smoke e2e against the preview URL using the bypass header (never committed).
- [ ] R3: `docs/review/rand-guide-ar.md`:
  - the link and how to open it;
  - giving feedback as "EV-05: …";
  - what the badges mean;
  - the `FACT CHECK` list;
  - the questions only Rand can answer (from OPEN_QUESTIONS and CONTENT_CHECKLIST).
- [ ] R4: `superpowers:requesting-code-review` (fresh reviewer) before sending the link.

## Phase E: The other three categories (phase-2 Part 4, one checkpoint each)

- Production, Print & Gifts, with **A8**: "Order your print online" through the quote form, no cart, no prices.
- Marketing & Brand.
- Creative Production, with **A7**: rental as categories only, "Ask for availability" through the quote form.

Each one:
- moves its copy deck into data (subject to decision 3);
- FAQ up to 8;
- refs PG, MB and CP;
- stock or AI plates through A3 or D79.

## Phase F: The remaining pages (checkpoints batched)

| Task | Page | Key points |
|---|---|---|
| F1 | Work index `/work` + case template `/work/[slug]` | **Index:** filter chips by service category × market (D88), with counts and an empty state (filter state in the URL, so it can be shared and works without JS as links). **Case:** key facts → Challenge → Idea → Execution → Result (qualitative unless verified) → scope block linking the service anchors → next case + CTA; breadcrumb; sticky section menu from 4 sections. Anonymised by default; "Illustrative" on stock or AI; JSON-LD `CreativeWork`; refs WK. |
| F2 | About `/about` | Story drafted from the profile (facts listed for Rand); the 4 principles; markets; team as `ExampleBlock` in review only. |
| F3 | Contact `/contact` | A qualifying brief (Task 4.2): service dropdown preset from `?service=<anchor>` (every category quote block and service section links with it), city/country, timing, budget band, contact details. General FAQ (benchmark topics 1, 3, 6, 8, 10, 12, up to 8). Contact lines from config, hidden when empty; copy-email button; WhatsApp fallback. |
| F4 | Products `/products/minute-zero`, `/products/peak-hour` | Problem, 4–6 features, concept screens labelled "Preview", "Register interest" form (same pipeline, `intent: "interest"`); `status: "comingSoon"`. |
| F5 | Legal + 404 + credits | Legal pages already built (polish only); 404 with a route back to services; `/credits` from A3. |
| F6 | SEO | Sitemap with every new route (legal only once `legal.reviewed`); metadata, hreflang and JSON-LD per page; OG images per locale (`opengraph-image.tsx`, text-only on brand ground). |

- [ ] **Checkpoint F1 + F2,** then **F3 + F4,** then **F5 + F6:** screenshots, critique and accessibility review per batch.

## Phase G: Final pass

- [ ] `/simplify` on the branch diff, then `superpowers:verification-before-completion`: lint, typecheck, unit, e2e (both modes), build, the leak check, Lighthouse mobile on 6 representative pages.
- [ ] `superpowers:requesting-code-review` with a fresh reviewer, then updates to the same preview.

## Content work that runs through every phase

- Per page: a copy deck in `docs/content/` (EN, native AR, notes), then the data files. Each fact is checked against the profile and DECISIONS; the rest goes to `docs/review/fact-check.md` with a page and section ref.
- FAQ: up to 8 per category plus up to 8 general ones on `/contact`. The topics come from benchmarks.md §FAQ. Answers explain the process, with no numbers.
