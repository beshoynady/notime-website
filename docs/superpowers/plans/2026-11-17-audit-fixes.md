# Audit fixes before launch: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the owner's chosen audit items (N04–N13, N15–N19, N21, N22 and the hiding header) on the live site without an LCP, CLS, accessibility or reduced-motion regression.

**Architecture:** Next.js 16 App Router, next-intl (`en`, `ar`), server components by default. Shared behaviour (the CTA bar, the hiding header) lives in the site shell (`src/components/layout/`), with its pure logic in `src/lib/` under unit tests. Forms keep the Zod contract in `src/lib/forms/schemas.ts`, re-parsed on the server. Scroll motion stays GSAP; the header and the sticky bars move by `transform` / `translate` only.

**Tech Stack:** Next.js 16 (Turbopack, cacheComponents), React 19, next-intl, GSAP + ScrollTrigger, Motion, Lenis, Zod, react-hook-form, Vitest, Playwright, Lighthouse 13.5.0 (`scripts/lighthouse-ab.mjs`), axe-core.

**Spec:** `docs/superpowers/specs/2026-11-17-audit-fixes-design.md` (approved 2026-11-17). Read it with this plan. Copy comes from `docs/review/copy-proposals.md` (only the sections named here).

**Amended 2026-11-18 (owner-approved; where this plan and the spec differ, this plan wins):**
1. The branch starts at `e19404f` (the withdrawn case is already gone, D121).
2. Every Arabic call to action is in the plural command (owner rule 1, D118): «اطلبوا مكالمة تعارف مجانية», «اطلبوا عرض سعر», «خطّطوا لفعاليتكم معنا», «شاهدوا أعمالنا». The wording is the copy rewrite's (`docs/review/copy-rewrite/*.json`), so the later apply doesn't change these strings again.
3. The "30-min" test covers button labels only; the 30 minutes may appear in the line beside the button (R1, D122).
4. Tasks 0, 5 and 15 use the football league case (`/work/football-league-events-awards`) where they named the sports case.
5. Task 6B (new, after Task 6): Home's work grid and Software's proof card adapt to the number of cards.
6. Task 8's month select without the "A month is enough" hint is confirmed.

## Branches and order

- `audit-fixes`, cut from `phase-2-services` at `e19404f`: Tasks 1–11 (with 6B) and 14–15. Merges into `phase-2-services` after the review and the checks, without waiting for the owner-gated branches.
- `audit-n06`, cut from `audit-fixes` after Task 11: Task 12. It merges only after the owner sees the Events 1440 EN/AR shots, and only if LCP doesn't regress (otherwise stop and report).
- `audit-n17`, cut from `audit-fixes`: Task 13. It merges only after the owner approves the before/after pairs.
- One agent at a time (D93). Each task ends with a commit; update `docs/HANDOFF.md` after each task.
- Local checks per task: `npm run lint`, `npm run typecheck`, `npx vitest run <touched tests>`, and only the e2e spec the task names (`PW_BASE_URL=http://localhost:3000 npx playwright test <spec>`, against a `next build && next start -p 3000` built with the CI env: `NEXT_PUBLIC_ENABLE_LAB=1 NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA`; start with `TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA MAIL_SINK=file MAIL_FROM=website@example.com`). Port 3100 belongs to the review server: never use it for tests.

## Global Constraints

- No mention of AI or generated images anywhere. No invented number, client or claim. No disabled or "coming soon" control. Missing client content is hidden, or a `[placeholder]` in code only, marked `// TODO: replace placeholder`.
- Logical properties only (`ms-/me-/ps-/pe-/start-/end-`, `inset-inline`, `margin-inline`); never `left/right` for direction. Directional icons flip in RTL.
- Every user-facing string in `src/messages/{en,ar}.json` or a localized content field; the Arabic is native.
- Contact data only from `src/config/contact.ts`; WhatsApp shows only when `contactStatus(contact).whatsapp` is true (D78), and its link goes through `WhatsAppLink` (the source-naming prefill, D114).
- GSAP owns scroll, Motion owns hover; never both on one element. Reduced motion shows the final state with no movement; the reduced specs (`e2e/photo-stories-reduced.spec.ts`, `e2e/no-js.spec.ts`) keep passing.
- LCP stays text on the home page and the category pages. No layout shift: moving things move by `transform`/`translate`, never `top`, height or margin.
- Copy in scope: copy-proposals §1.1, §1.3, §1.4, §2.2, §2.3, §2.4, §2.5, §4.1, §4.2, §7.1, §8.1, §9.1, §10.1, and §6.1 with the owner's wording: EN "Request a free intro call", AR «اطلبوا مكالمة تعارف مجانية» (no "30-min" / «(30 دقيقة)» on the button). Nothing else from copy-proposals.
- Arabic buttons by role (D118): marketing calls to action in the plural command (the four above, and any new one), form and system buttons in the verbal noun. Every Arabic string that addresses the visitor uses the plural (owner rule 1). Where copy-proposals gives a singular form, use the plural from `docs/review/copy-rewrite/*.json`.
- Real photos only on Work and anything presented as a NO TIME project; the anonymous cases keep their drawings.

## Review Focus

1. **The CTA bar and the keyboard on phones:** while a text field has focus, the bar must hide so it never covers the field or the keyboard's suggestion row. Test in Task 9 (the email field of the quote block on `/services/marketing-brand`).
2. **A stale event field after the service changes:** a visitor picks a wedding service, fills guests, then switches to a Marketing service. The fields hide, and the hidden values must not be sent or emailed. Test in Task 7 (server drops them) and Task 8 (the UI clears them).
3. **`?category=` junk:** `?category=<script>`, an unknown slug, a 300-char value or `?category=events-hospitality&service=<marketing anchor>`. Junk is ignored silently and never echoed; an explicit `service` wins over `category`. Test in Task 7 (`parseCategoryParam`) and Task 8 (the service param wins).
4. **The hiding header and focus:** a keyboard user tabbing into the header (skip link, logo, burger) while it is hidden must see it. Test in Task 10.
5. **The hiding header near the top and on short scrolls:** jitter (a 3 px trackpad bounce) must not flicker it; at `scrollY < header height` it always shows. Test in Task 10 (`nextHeaderHidden` unit cases).

---

### Task 0: Baseline (before) captures

**Files:** none in `src/`. Output: `docs/checkpoints/audit-fixes/before/`.

- [ ] **Step 1:** Keep a production build of `e19404f` for the before side of every comparison: `git worktree add ../nt-before e19404f`, build it there with the CI env (local `turbopack.root` edit in that worktree only, never committed), and start it on port 3200.
- [ ] **Step 2:** Capture the before shots of the visual items at 1440 and 390, EN and AR, into `docs/checkpoints/audit-fixes/before/`: home (hero, the strip, How we work), each category opening, Events › "Choose the mood" at 390, `/work`, `/services` end, the football league and airline case studies, the Contact brief, the header at 900–1023 (EN, AR), the 404 tab title (a text file). Use `scripts/shots.mjs` (read its arguments first); webp, as in `docs/review/shots/`.
- [ ] **Step 3:** Commit: `docs(checkpoints): audit fixes before shots`.

### Task 1: Copy fixes (N13, N15, N18)

**Files:**
- Modify: `src/content/form-copy.ts` (`privacy.text`, `consultation.submit`), `src/content/software/page.ts` (`cta.book`, `sticky.book`, `productsCopy.more`, line ~478 sentence), `src/messages/{en,ar}.json` (`header.quote` AR → «اطلبوا عرض سعر»), `src/content/categories.ts:240` (the FAQ answer), the product-link strings («تعرّف على ما سيقدّمه …»; find with `grep -rn "سيقدّمه" src`), the Google/Meta service title in `src/content/services.ts`, the mobile-menu numeral spacing in `src/components/layout/mobile-menu.tsx`.
- Test: `src/content/form-copy.test.ts`, `src/content/content.test.ts`.

- [ ] **Step 1: Write the failing tests**
  - `form-copy.test.ts › privacy line is the short one`: `formCopy.privacy.text.en === "We use your details only to reply to you."` and `.ar === "نستخدم بياناتكم للرد عليكم فقط."`.
  - `content.test.ts › no call button carries a duration`: the button labels `softwarePage.cta.book`, `softwarePage.sticky.book` and `formCopy.consultation.submit` (EN and AR) don't match `/30|٣٠|min|دقيقة/`. The test doesn't check other strings: the line beside the button may say the call lasts 30 minutes (R1). Exact values: `cta.book` and `consultation.submit` = `"Request a free intro call"` / `"اطلبوا مكالمة تعارف مجانية"`; `sticky.book` = `"Request a free call"` / `"اطلبوا مكالمة مجانية"`.
  - `content.test.ts › the quote button is in the plural`: `header.quote` in `ar.json` equals `"اطلبوا عرض سعر"`.
  - `content.test.ts › Arabic product links agree in gender`: the rendered strings equal `اكتشفوا ما ستقدّمه «الدقيقة صفر»` and `اكتشفوا ما ستقدّمه «ساعة الذروة»` (template `productsCopy.more` = `اكتشفوا ما ستقدّمه «{product}»`).
  - `content.test.ts › Google/Meta title`: the AR title is `الإعلانات المدفوعة وتخطيط الإعلام (Google وMeta)`.
- [ ] **Step 2:** Run `npx vitest run src/content`. Expected: the four tests FAIL.
- [ ] **Step 3:** Change the strings. The sticky-bar short label is EN "Request a free call" / AR «اطلبوا مكالمة مجانية». In the mobile menu, put a real space (or `gap` on the flex row) between the numeral and the title so AR reads «الفعاليات والضيافة 01»; it's a layout gap, not a typed space, if the numeral is its own element.
- [ ] **Step 4:** Run `npx vitest run src/content`. Expected: PASS.
- [ ] **Step 5:** Commit: `fix(copy): N13 intro call, N15 privacy line, N18 Arabic fixes`.

### Task 2: N09 "30 services" stat from the data

**Files:**
- Modify: `src/messages/{en,ar}.json` (`about.stats.integrated.*` → the label "Services" / «خدمة»; the value key removed), `src/components/sections/about/about.tsx`, `src/components/pages/about/about-page.tsx`.
- Create: `src/lib/service-count.ts`. Test: `src/lib/service-count.test.ts`.

**Interfaces:** Produces `serviceCount(): number` (the count of `services` in `src/content/services.ts`, all categories).

- [ ] **Step 1: Write the failing test** `service-count.test.ts › counts every service`: `serviceCount() === services.length` and `serviceCount() === 30` (the second line pins today's catalogue; it fails loudly if a service is added without updating the copy check).
- [ ] **Step 2:** Run it. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement `serviceCount`. Both FIGURES lists render the number through `<Numeral>` with `serviceCount()`; the key `integrated` becomes `services` (rename in both message files and both components).
- [ ] **Step 4:** Run it, plus `npm run typecheck`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(about): N09 the second stat counts the services`.

### Task 3: N22 404 title and N19 accessibility

**Files:**
- Modify: `src/app/[locale]/(site)/not-found.tsx` and `[...rest]` (metadata title), `src/messages/{en,ar}.json` (`notFound.metaTitle`, `langToggle.enName/arName`), `src/components/layout/lang-toggle.tsx`, `src/components/forms/forms.css` (focus underline), any remaining `aria-required` on a non-input/non-radiogroup (find with `grep -rn "aria-required" src`).
- Test: `e2e/not-found.spec.ts`, `e2e/locale-switch.spec.ts`, `e2e/forms.spec.ts`.

- [ ] **Step 1: Write the failing tests**
  - `not-found.spec.ts › the tab names the page`: `/en/no-such-page` → `await expect(page).toHaveTitle("Page not found · NO TIME Creative House")`; `/ar/no-such-page` → `"الصفحة غير موجودة · NO TIME Creative House"`.
  - `locale-switch.spec.ts › the toggle's names start with its visible text`: the EN button's accessible name is `"EN, English"`, the AR button's is `"ع، العربية"` (`getByRole("link"|"button", { name })` per the current element).
  - `forms.spec.ts › a focused brief field shows a 2 px line`: focus `#brief-name` on `/en/contact`; its computed `border-block-end-width` (or the focus ring property the CSS uses) is `"2px"`.
- [ ] **Step 2:** Run the three specs. Expected: those tests FAIL.
- [ ] **Step 3:** Implement: the title through `generateMetadata` returning `{ title: { absolute: t("metaTitle") } }` (read `node_modules/next/dist/docs/` on `not-found` metadata first: a `not-found.tsx` can't export metadata in every version; if it can't, set it in the `[...rest]` page that calls `notFound()`). The toggle's `aria-label` = `${visible}, ${name}` from messages. The focus line goes to 2 px with no layout change (an inset `box-shadow` or the existing border with the same box height).
- [ ] **Step 4:** Run the three specs. Expected: PASS. Run axe on `/en/contact` and `/en/services/software-digital` (`node scripts/axe.mjs` if present, else the one-off in Task 15 Step 3): no `label-content-name-mismatch`, no `aria-allowed-attr`.
- [ ] **Step 5:** Commit: `fix(a11y): N19 toggle names and field focus, N22 404 title`.

### Task 4: N12 Events in the main menu

**Files:**
- Modify: `src/components/layout/nav-links.ts`, `src/components/layout/site-header.tsx`, `src/messages/{en,ar}.json` (`nav.events`: "Events" / «الفعاليات»).
- Test: `e2e/navigation.spec.ts`.

**Interfaces:** Produces `HEADER_LINKS` (header only): `[events, digital, work, about]`, each `{ key, href, live }`; `events.href = categoryHref("events-hospitality")`. `NAV_LINKS` (mobile menu, footer) is unchanged, so the mobile menu doesn't change.

- [ ] **Step 1: Write the failing tests** in `navigation.spec.ts` (desktop project):
  - `the main menu reads Services, Events, Digital Solutions, Work, About`: at 1440, the header nav's link/button texts in order equal those five (EN) and «الخدمات، الفعاليات، الحلول الرقمية، أعمالنا، من نحن» (AR, the current message values).
  - `Events is current on its page`: on `/en/services/events-hospitality` the Events link has `aria-current="page"`.
  - `EN hides Events between 900 and 1023, AR keeps it`: viewport 960×800: EN Events link `toBeHidden()`, AR `toBeVisible()`; at 1024, EN visible. The header row never wraps: the nav's height equals `--header-h` at 900, 960, 1024 in both locales.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. The EN hide is CSS on the item (`lang-en` variant + `min-[900px]:max-[1023.98px]:hidden`), never JS. `aria-current` from the current pathname (the header is a server component: compare in the existing client nav-link if one exists, else a tiny client `NavLink`).
- [ ] **Step 4:** Run. Expected: PASS. Run `e2e/mega-keyboard.spec.ts` too (Tab order through the header). Expected: PASS.
- [ ] **Step 5:** Commit: `feat(nav): N12 Events in the main menu`.

### Task 5: Layout fixes (N07, N11, N21)

**Files:**
- Modify: the process section (`src/components/sections/process/*` and its CSS), the Events "Choose the mood" block (the `#celebrations` photo stack: `src/components/sections/photo-story/photo-stack.css`/`.tsx`, or the mood module; locate from `docs/review/shots/events-ar-390-12.webp`), `src/components/pages/work/work.css` / `work-case.tsx` (the gaps between facts and result).
- Test: `e2e/overflow.spec.ts` (add), `e2e/pin-build-scroll.spec.ts` (must still pass).

- [ ] **Step 1: Write the failing tests** in `overflow.spec.ts`:
  - `How we work starts on the page grid` (desktop, `/en` and `/ar`): the inline-start edge of `#how-we-work h2` equals the inline-start edge of the header logo within 2 px (EN: compare `left`; AR: compare `right`).
  - `Choose the mood keeps its gutter at 390` (mobile, `/en` and `/ar` Events): every text element in `#celebrations` other than the scrolling photo row has `rect.left >= 16 - 1` and `rect.right <= innerWidth - 16 + 1`.
- [ ] **Step 2:** Run. Expected: FAIL (40 px vs 120 px; the clipped lead).
- [ ] **Step 3:** Implement: the process content inside the page `.frame` (the pin wrapper stays as is; D117's `align-self: start` stays). The mood text and card get the gutter (`padding-inline: var(--gutter-start) var(--gutter-end)`); only the photo row scrolls. N21: shrink the vertical gaps between the facts and the result block on the case template (all cases, layout only; target: no empty band taller than ~40% of the viewport at 1440).
- [ ] **Step 4:** Run `overflow.spec.ts` and `pin-build-scroll.spec.ts`. Expected: PASS. Take N21 after-shots (the football league case, 1440 and 390, EN/AR) into `docs/checkpoints/audit-fixes/after/`.
- [ ] **Step 5:** Commit: `fix(layout): N07 process on the grid, N11 mood gutter, N21 case spacing`.

### Task 6: N08 Work filters threshold, N16 closing blocks

**Files:**
- Create: `src/components/sections/closing-cta/closing-cta.tsx` (+ `.css`).
- Modify: `src/lib/work-filter.ts` (constant + predicate), `src/components/pages/work/work-index.tsx`, `src/app/[locale]/(site)/services/page.tsx`, `src/messages/{en,ar}.json` (`servicesIndex.closing.{title,body}`, `workIndex.closing.body`; the work title reuses `workCase.ctaTitle`, the button reuses `header.quote`).
- Test: `src/lib/work-filter.test.ts` (exists or create), `e2e/work.spec.ts`.

**Interfaces:**
- Produces `FILTERS_MIN_PROJECTS = 6` and `showWorkFilters(projectCount: number): boolean` in `src/lib/work-filter.ts`.
- Produces `<ClosingCta id: string; title: string; body: string; href: string; label: string; tone?: "dark" | "light" />` (server component; a section with `aria-labelledby`, one primary `ButtonLink`).

- [ ] **Step 1: Write the failing tests**
  - `work-filter.test.ts › filters show from six projects`: `showWorkFilters(5) === false`, `showWorkFilters(6) === true`, `showWorkFilters(0) === false`.
  - `work.spec.ts › with fewer than six projects there is no filter bar`: `/en/work` has no `nav#filters` (today's data has 2); the filtered URLs (`/en/work?category=…` or the static filter routes) still render their cases (a filtered view stays reachable from category pages; the chips just don't show).
  - `work.spec.ts › /work and /services end with the closing block`: the last section before the footer has the heading `"Planning something like this?"` (`/en/work`) / `"Not sure which service you need?"` (`/en/services`) and a link named "Request a quote" to `/en/contact`; AR equivalents from §7.1/§4.1.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Copy exactly from §4.1 and §7.1.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(work): N08 filters from six projects, N16 closing blocks`.

### Task 6B: Grids that follow the number of cards (Home's work, Software's proof)

Owner-approved 2026-11-18. At 1440 today, Home's work grid was drawn for three cards (`7fr 5fr`, the lead spans two rows), so with two the second column ends early. Software's proof grid is two columns with one card, so half the row is empty. Both layouts must follow the card count from CSS alone: add a card and the designed layout returns with no code change.

**Files:**
- Modify: `src/components/sections/work/work.css` (the `@media (min-width: 900px)` block, lines ~110–118), `src/components/software/software.css` (`.sw-proof-grid`, `.sw-proof-card`, lines ~725–745). Markup changes only if a selector needs a hook (none expected).
- Test: `e2e/grid-count.spec.ts` (new, desktop project).

**Interfaces:** CSS quantity queries on the container, e.g. `.work-grid:has(> :nth-child(3))` / `.sw-proof-grid:has(> :only-child)`. No count is passed from React, so nothing in TSX changes when a case or a proof card is added.

- [ ] **Step 1: Write the failing tests** in `grid-count.spec.ts` (1440×900, `/en` and `/ar`, reduced motion so reveals are final):
  - `two work cards sit side by side at equal width`: in `#work .work-grid`, the two `.work-card` boxes have widths within 2 px of each other and the same top within 2 px; neither spans two rows (computed `grid-row-end` is not `span 2`).
  - `a third work card brings back the designed grid`: clone the second `.work-card` into the list with `page.evaluate`, then: the first card's width is greater than the second's by at least 20%, and the second and third cards share the same inline column (left within 2 px EN, right within 2 px AR) and stack (third top > second bottom).
  - `one proof card takes the full row, image beside text`: on `/en/services/software-digital` and `/ar/...`, `.sw-proof-card`'s width is within 2 px of `.sw-proof-grid`'s; `.sw-proof-visual` and `.sw-proof-label` share a row (their vertical ranges overlap), the visual on the inline-start side (EN: visual.left < label.left; AR: visual.right > label.right).
  - `a second proof card brings back two columns`: clone the card in place → two cards of equal width (± 2 px) side by side, and in each the visual sits above the label (visual.bottom ≤ label.top).
  - At 390 (mobile project, one test): Home's work cards and the proof card stack in one column as today (each card's width within 2 px of its grid's).
- [ ] **Step 2:** Run. Expected: FAIL (2 work cards are `7fr`/`5fr`; the proof card is half width).
- [ ] **Step 3:** Implement. Work, ≥ 900 px: the default is `repeat(2, minmax(0, 1fr))` with no row span and `aspect-ratio` the same on both media; `.work-grid:has(> :nth-child(3))` restores today's `7fr 5fr`, `[data-lead] { grid-row: span 2 }` and the lead's `4 / 3`. Proof, ≥ 900 px: `.sw-proof-grid:has(> :only-child) > .sw-proof-card` becomes a two-column card (`grid-template-columns: minmax(0, 7fr) minmax(0, 5fr)`, the visual in the first column spanning the text rows, the text aligned to the visual's centre, `margin-block-end: 0` on the visual); with two or more cards today's rules apply unchanged. Logical properties only; RTL mirrors through the grid. The reveal (`data-sw-reveal`) and the hover rules stay as they are.
- [ ] **Step 4:** Run `grid-count.spec.ts`, `software.spec.ts` (if it exists) and `cls.spec.ts`. Expected: PASS. Take after-shots: Home's work section and Software's proof, 1440 and 390, EN and AR, into `docs/checkpoints/audit-fixes/after/` (no owner gate: approved as described).
- [ ] **Step 5:** Commit: `fix(layout): Home's work and Software's proof follow the card count`.

### Task 7: N10 event fields and the category hint: schema, rules, email

**Files:**
- Modify: `src/lib/forms/schemas.ts` (`contactSchema`), `src/lib/forms/handle.ts` (contact branch), `src/lib/forms/mailer.ts:74-79`.
- Create: `src/lib/forms/event-fields.ts`; extend `src/lib/forms/service-param.ts`.
- Test: `src/lib/forms/schemas.test.ts`, `src/lib/forms/event-fields.test.ts`, `src/lib/forms/service-param.test.ts`, `src/lib/forms/mailer.test.ts`, `src/lib/forms/handle.test.ts`.

**Interfaces:**
- Produces in `schemas.ts`: `GUEST_BANDS = ["up-to-50", "50-150", "150-500", "over-500", "not-sure"] as const`; `contactSchema` gains `eventMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).or(z.literal("")).optional().default("")` refined to lie between the previous month and 36 months ahead of the server date (else `"invalid"`), and `guests: z.enum(GUEST_BANDS).or(z.literal("")).optional().default("")`.
- Produces in `event-fields.ts`: `isEventsService(anchor: string): boolean` (true when `getServiceByAnchor(anchor)?.category === "events-hospitality"`); `showEventFields({ service, category }: { service: string; category: string }): boolean` = `isEventsService(service) || (service === "" && category === "events-hospitality")`; `keepEventFields(service: string): boolean` = `service === "" || isEventsService(service)` (server side: the category hint never reaches the server); `monthOptions(now: Date, locale: Locale, count = 24): { value: string; label: string }[]` (from the current month; labels via `Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-GB", { month: "long", year: "numeric" })`).
- Produces in `service-param.ts`: `parseCategoryParam(value: string | null | undefined): CategorySlug | ""` (same guards as `parseServiceParam`: ≤ 60 chars, `^[a-z0-9-]+$`, a known category slug, else `""`).

- [ ] **Step 1: Write the failing tests**
  - `event-fields.test.ts`: `showEventFields({ service: <an events anchor>, category: "" }) === true`; `({ service: "", category: "events-hospitality" }) === true`; `({ service: "", category: "" }) === false`; `({ service: <a marketing anchor>, category: "events-hospitality" }) === false` (the service wins); `keepEventFields(<marketing anchor>) === false`; `keepEventFields("") === true`. `monthOptions(new Date("2026-11-17"), "en")[0]` equals `{ value: "2026-11", label: "November 2026" }`, length 24; the AR label of the first option contains `2026` in Latin digits and «نوفمبر».
  - `service-param.test.ts › parseCategoryParam`: `"events-hospitality"` → itself; `"<script>"`, `"nope"`, `"a".repeat(61)`, `null` → `""`.
  - `schemas.test.ts › event fields`: with `vi.setSystemTime(new Date("2026-11-17"))`: `eventMonth: "2026-10"` OK, `"2026-09"` → `invalid`, `"2029-12"` OK, `"2030-01"` → `invalid`, `"2026-13"` → `invalid`; `guests: "150-500"` OK, `"lots"` → `invalid`; both default to `""`.
  - `handle.test.ts › stale event fields are dropped`: a contact submission with a marketing service plus `eventMonth`/`guests` → the parsed data handed to the mailer has both `""`.
  - `mailer.test.ts › event rows`: an events-service brief with `eventMonth: "2027-03"`, `guests: "50-150"` → rows include `["Event date", "March 2027"]` and `["Guests", "50–150"]`, placed after "Service"; empty values add no rows.
- [ ] **Step 2:** Run `npx vitest run src/lib/forms`. Expected: the new tests FAIL.
- [ ] **Step 3:** Implement. The guest labels for the email come from one map beside `GUEST_BANDS` (EN only; the team reads English).
- [ ] **Step 4:** Run `npx vitest run src/lib/forms`. Expected: PASS, and the existing form tests still pass.
- [ ] **Step 5:** Commit: `feat(forms): N10 event date and guests, the category hint parser`.

### Task 8: N10 the brief's UI and the `?category=` hint

**Files:**
- Modify: `src/components/forms/contact-form.tsx`, `src/components/pages/contact/contact-page.tsx` (services with their category and the category titles), `src/content/form-copy.ts` (`contact.eventMonth`, `contact.eventMonthNone`, `contact.guests`, `contact.guestOptions`), `src/components/forms/form-parts.tsx` (`SelectField` accepts groups).
- Test: `e2e/forms.spec.ts`.

**Interfaces:**
- Consumes Task 7: `showEventFields`, `monthOptions`, `parseCategoryParam`, `GUEST_BANDS`.
- `BriefService` gains `category: CategorySlug`. `SelectField` gains an optional `groups?: { label: string; options: { value: string; label: string }[] }[]` (rendered as `<optgroup>`; `options` stays for flat lists).

- [ ] **Step 1: Write the failing tests** in `forms.spec.ts`:
  - `no service: the general timing shows`: `/en/contact` → the "When is it?" group visible; "Event date (approximate)" and "Number of guests" absent.
  - `an events service shows the event fields`: choose an Events & Hospitality service → both event fields visible, "When is it?" hidden; switch to a Marketing service → event fields hidden, "When is it?" back, and the guests value cleared (`form.getValues` is internal: assert by switching back, the select shows its placeholder).
  - `?category=events-hospitality opens the events group`: `/en/contact?category=events-hospitality` → the event fields show with no service chosen; the service select's first `<optgroup>` label is the Events category title. `/ar/contact?category=marketing-brand` → the first optgroup is that category; no event fields.
  - `?service= wins over ?category=`: `/en/contact?category=events-hospitality&service=<a marketing anchor>` → that service is selected, no event fields.
  - `junk is ignored`: `/en/contact?category=%3Cscript%3E` → the page renders, the default group order, the value isn't in the DOM (`page.content()` doesn't contain `<script>` from the param).
  - `the brief sends the event rows`: fill an events brief with a month and a guest band, submit (test keys), success shows; the file sink's last email (`MAIL_SINK=file`, read as the existing form specs do) has "Event date" and "Guests" rows.
- [ ] **Step 2:** Run `forms.spec.ts`. Expected: the new tests FAIL.
- [ ] **Step 3:** Implement. The service select is grouped by category (category titles as optgroup labels, the existing category order); a valid `category` param moves that group first. Fields: "Event date (approximate)" is a select of `monthOptions(...)` (the builder's call in the spec, settled here: one month select works the same in every browser and in RTL; the copy's hint "A month is enough…" is dropped because a month is all it asks), "Number of guests" a select of the five bands (§9.1 labels). When `showEventFields` turns false, `setValue("eventMonth", "")` and `setValue("guests", "")`. The category param is read once after hydration, as `?service=` is; it is never written to a form field.
- [ ] **Step 4:** Run `forms.spec.ts` (desktop and mobile projects). Expected: PASS.
- [ ] **Step 5:** Commit: `feat(contact): N10 event fields and the category hint in the brief`.

### Task 9: N04 the shared mobile CTA bar

**Files:**
- Create: `src/lib/cta-bar.ts`, `src/lib/cta-bar.test.ts`, `src/components/layout/mobile-cta-bar.tsx`, `src/components/layout/mobile-cta-bar.css`.
- Modify: `src/components/layout/site-shell.tsx` (render it), `src/app/globals.css` (`.wa-fab` rules), `src/components/software/software.css:2630-2639` (the WhatsApp button moves above Software's bar instead of hiding), the opening section of each page (one `data-cta-opening` attribute: home `#hero`, `.cat-opening`, the `pg-open` sections, Software's `.sw-opening`).
- Test: `e2e/cta-bar.spec.ts` (new).

**Interfaces:**
- Produces `ctaBarFor(pathname: string): { quoteHref: string } | null` in `src/lib/cta-bar.ts` (`pathname` without the locale, as next-intl's `usePathname` returns it): `null` for `/contact` and `/services/software-digital` (Software keeps its own bar); `{ quoteHref: "/contact?category=<slug>" }` for `/services/<slug>` when `<slug>` is a known category; `{ quoteHref: "/contact" }` otherwise.
- Produces `<MobileCtaBar />` (client; reads `usePathname` from `@/i18n/navigation`, `useTranslations("header")` for "Request a quote", `useTranslations("whatsapp")` for the second half's label).
- Visibility logic is Software's (`src/components/software/sticky-bar.tsx`): past the `[data-cta-opening]` element (or the first `main section` when none), not while any `form` is intersecting, not while a text field has focus. Extract the shared part into `useStickyBarVisible(openingSelector: string, formSelector: string): boolean` in `src/components/layout/use-sticky-bar-visible.ts` and use it in both bars.

- [ ] **Step 1: Write the failing tests**
  - `cta-bar.test.ts`: `ctaBarFor("/contact") === null`; `ctaBarFor("/services/software-digital") === null`; `ctaBarFor("/services/events-hospitality")` → `{ quoteHref: "/contact?category=events-hospitality" }`; `ctaBarFor("/services/nope")` → `{ quoteHref: "/contact" }`; `ctaBarFor("/")`, `ctaBarFor("/work")` → `{ quoteHref: "/contact" }`.
  - `cta-bar.spec.ts` (mobile project):
    - `hidden at first, shown after the opening`: `/en` → the bar region (`getByRole("region", { name: <label> })`) not visible; scroll past the hero → visible; its link "Request a quote" goes to `/en/contact`.
    - `category pages carry the hint`: `/ar/services/creative-production` after the opening → the link's href ends `/ar/contact?category=creative-production`.
    - `not on contact, not on Software's page, never on /links`: `/en/contact` and `/en/links` have no shared bar; `/en/services/software-digital` has Software's bar only (one `region` with its label).
    - `hides for the keyboard` (Review Focus 1): on `/en/services/marketing-brand`, scroll to the quote block's email field and focus it → the bar not visible; blur → visible again when no form is in view.
    - `hides while a form is in view`: scroll the category quote block into view → hidden.
    - `never covers the footer`: scroll to the end → the footer's last link's bottom ≤ the bar's top.
    - `no layout shift`: the page's CLS (the `cls.spec.ts` helper) stays < 0.01 while the bar shows and hides.
    - `desktop: none` (desktop project): the bar is not rendered visible at 1440.
    - `WhatsApp half only with a number`: with today's `contact.ts` (no number) the bar has one link. The two-halves case is covered by a unit render test if `contact` can be mocked; otherwise state it in the report as untested until the number exists.
- [ ] **Step 2:** Run both. Expected: FAIL.
- [ ] **Step 3:** Implement. Height 56 px plus `env(safe-area-inset-bottom)`; the page end reserves it (`body:has(.cta-bar)` padding, as Software's); `scroll-padding-block-end` while shown; z-index 54; hidden ≥ 900 px. Below 900 px the floating WhatsApp button is hidden while the shared bar exists (`body:has(.cta-bar) .wa-fab { display: none }`); on Software it stays and sits above its bar while the bar shows (`inset-block-end: calc(72px + 12px + env(safe-area-inset-bottom))`, transition on `translate`, not `bottom`, so no layout shift). The Events private-celebrations cards reserve the bar's height at their bottom (the last card's `margin-block-end` or the stack's `padding-block-end`, below 900 px).
- [ ] **Step 4:** Run `cta-bar.test.ts`, `cta-bar.spec.ts`, `cls.spec.ts`, `links.spec.ts`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(layout): N04 shared mobile CTA bar`.

### Task 10: The hiding header on category pages (phones)

**Files:**
- Create: `src/lib/header-hide.ts`, `src/lib/header-hide.test.ts`, `src/components/layout/header-autohide.tsx`.
- Modify: `src/components/layout/site-shell.tsx` (render it), `src/app/globals.css` (header translate), `src/components/category/category.css` (`.svc-index`), `src/components/sections/photo-story/photo-stack.css` (`.pstack-card`), `src/components/software/software.css` if Software has its own sticky elements under the header.
- Test: `e2e/header-autohide.spec.ts` (new).

**Interfaces:**
- Produces `nextHeaderHidden(prev: { y: number; hidden: boolean }, y: number, opts: { headerH: number; delta: number }): boolean` in `src/lib/header-hide.ts`: shown when `y < opts.headerH`; otherwise hides when `y - prev.y > opts.delta`, shows when `prev.y - y > opts.delta`, else keeps `prev.hidden`. `delta = 8`.
- Produces `<HeaderAutohide />` (client): active only when the pathname matches `/services/<category slug>` (the five, Software included) and `matchMedia("(max-width: 899.98px)")`; sets `document.documentElement.dataset.headerHidden` ("" or removed). It shows the header on `focusin` inside `#site-header`, while `html[data-overlay-open]` (a menu) is set, and at the top. Listens to Lenis's scroll (`lenis.on("scroll")` through the existing provider) or `scroll` when Lenis is off.
- CSS contract: `html[data-header-hidden]` sets `--header-shift: calc(-1 * (var(--header-h) + env(safe-area-inset-top, 0px)))`, default `0px`. `#site-header`, `.svc-index` and `.pstack-card` get `translate: 0 var(--header-shift)` with `transition: translate 0.35s var(--ease-expo-out)` (none under reduced motion). The `translate` property composes with GSAP's `transform` on the cards' figures, so the two never fight (the cards' figure is GSAP's; the card is CSS's).

- [ ] **Step 1: Write the failing tests**
  - `header-hide.test.ts` (Review Focus 5): `nextHeaderHidden({ y: 400, hidden: false }, 420, o) === true`; `({ y: 420, hidden: true }, 405, o) === true` (< delta: keeps); `({ y: 420, hidden: true }, 400, o) === false`; `({ y: 500, hidden: true }, 30, o) === false` (top); `({ y: 400, hidden: false }, 403, o) === false` (jitter).
  - `header-autohide.spec.ts` (mobile project, `/en/services/events-hospitality` and `/ar/services/software-digital`):
    - `hides on the way down, returns on the way up`: scroll down 600 px in steps → `#site-header` bounding top ≤ `-headerH + 1`; scroll up 50 px → top ≥ 0 - 1.
    - `the chip bar follows`: while hidden, `.svc-index` top equals the safe-area top within 2 px (no gap); while shown, it equals the header's bottom within 2 px.
    - `the celebration cards follow` (Events): with the header hidden and a card stuck, the gap between the chip bar's bottom and the stuck card's top is the same (± 2 px) as with the header shown.
    - `no layout shift`: a `PerformanceObserver` for `layout-shift` (without `hadRecentInput` filtering) records a sum < 0.01 over a down-up-down sequence.
    - `focus brings it back` (Review Focus 4): hidden, then `Tab` from the top of the document (focus the skip link) → the header top ≥ -1.
    - `only on category pages`: `/en` and `/en/work` at 390: the header never hides after a 600 px scroll.
    - `desktop unchanged` (desktop project): `/en/services/events-hospitality` at 1440, the header never hides.
    - `reduced motion`: with `reducedMotion: "reduce"` the header still hides and shows, with `transition-duration` computed `0s`.
- [ ] **Step 2:** Run both. Expected: FAIL.
- [ ] **Step 3:** Implement. If the cards can't follow cleanly (a stuck card jumps, or a translated sticky card overlaps the next), **stop**: take a 390 screenshot of the stack with the header hidden and send it to the owner before choosing (spec).
- [ ] **Step 4:** Run `header-hide.test.ts`, `header-autohide.spec.ts`, `anchor-scroll.spec.ts` (in-page jumps still land; the extra 68 px when the header hides on the way down is accepted), `category-index.spec.ts`, `cls.spec.ts`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(layout): the header hides on scroll down on category pages (phones)`.

### Task 11: N05 (B1) the home hero and the strip

**Files:**
- Modify: `src/components/sections/hero/hero.tsx`, `hero-controller.tsx` (drop the beat's tweens; shorten `end: "+=140%"`), `hero.css` (remove `.hero-beat`; add the eyebrow and the two CTAs), `src/app/globals.css:534` (`.hero-pin` reservation in step with the new end), `src/messages/{en,ar}.json` (`hero.eyebrow` = "Every second is planned." / «كل ثانية محسوبة.»; `hero.cta` = "Plan your event" / «خطّطوا لفعاليتكم معنا»; `hero.ctaWork` = "See our work" / «شاهدوا أعمالنا»; remove `beatLead`, `beatKey`), `src/app/[locale]/(site)/page.tsx` (the strip after `<Hero />`), `src/components/sections/work/work.tsx` (the strip leaves).
- Test: `e2e/hero-intro.spec.ts`, `e2e/hero-fit.spec.ts`, `e2e/pin-build-scroll.spec.ts`, `e2e/no-js.spec.ts`, `e2e/photo-stories-reduced.spec.ts`.

**Interfaces:** Consumes `PhotoStrip` and `STRIP` as `work.tsx` uses them today (same `id="work-strip"`; rename to `home-strip` and update every reference, including `scripts/scroll-jank.mjs` defaults and specs, found with `grep -rn "work-strip"`).

- [ ] **Step 1: Write the failing tests** in `hero-intro.spec.ts`:
  - `the hero says it in one screen`: `/en` and `/ar`, desktop and mobile: the eyebrow text above the H1 is "Every second is planned." / «كل ثانية محسوبة.» and visible without scrolling; `.hero-beat` and the sr-only duplicate don't exist; the eyebrow is read once (`getByText` count 1).
  - `two actions`: a link "Plan your event" → `/en/contact`, a link "See our work" → `/en/work` (AR «خطّطوا لفعاليتكم معنا» and «شاهدوا أعمالنا»), both inside the first viewport at 390×844 and 1440×900.
  - `the strip comes right after the hero`: `main`'s second top-level block is `#home-strip`; `#work` no longer contains it.
  - `the exit still completes`: scroll to the hero pin's end → the title/clock exit's end state (the existing exit assertion in this spec, re-pointed at the new end).
  - `pin-build-scroll.spec.ts` keeps its floor tests (they read the reservation, so they catch a mismatched `.hero-pin` value).
- [ ] **Step 2:** Run the five specs. Expected: the new tests FAIL; the rest pass.
- [ ] **Step 3:** Implement. Measure the shortest `end` that still lets the exit finish (spec: builder's call) and set the CSS reservation to the same value. LCP stays the H1: the eyebrow is a `<p>` above it, the CTAs use `ButtonLink` (primary, then `variant="ghost"` or the existing secondary style).
- [ ] **Step 4:** Run the five specs plus `cls.spec.ts`. Expected: PASS. Lighthouse A/B for `/en` and `/ar` mobile only (`node scripts/lighthouse-ab.mjs http://localhost:3200 http://localhost:3000 docs/checkpoints/lighthouse/audit-fixes/home.json --runs=3 --paths=/en,/ar`): LCP and CLS not worse than before beyond the run-to-run spread recorded in `docs/checkpoints/lighthouse/ab-2026-11-17/README.md`. If worse, stop and report.
- [ ] **Step 5:** Commit: `feat(home): N05 one-screen hero, two CTAs, the strip after it`.

### Task 12 (branch `audit-n06`): N06 category openings, final still first

**Files:**
- Modify: `src/components/category/category-opening.tsx`, `src/components/scenes/layered-scene*` (a `still` render path, the one reduced motion uses today), `src/components/category/category.css`, `src/messages/{en,ar}.json` (`category.quote` = the header's "Request a quote" reused; `category.skip` stays "Go to the services"), the Events hero's CSS (gradient + dim).
- Test: `e2e/opening.spec.ts`, `e2e/layered-scene.spec.ts`, `e2e/photo-stories-reduced.spec.ts`, `e2e/pin-build-scroll.spec.ts`, `e2e/category-structure.spec.ts`.

**Interfaces:**
- `LayeredScene` gains `mode?: "build" | "still"`: `still` renders the final state with no pin and no ScrollTrigger. `CategoryOpening` renders: hero = `<LayeredScene mode="still">` with the head (breadcrumbs, eyebrow, H1, the last shot line as the lead, "Request a quote" → `/contact?category=<slug>`, "Go to the services ↓"), then, on desktop with motion only, the existing `<LayeredScene mode="build">` (not rendered on phones or under reduced motion: gate with CSS `display: none` plus the controller's `matchMedia` so no ScrollTrigger is created; never render it server-side twice for the LCP image).
- The hero section keeps `data-cta-opening` (Task 9).
- The hero image loads with `priority`; the build scene's images stay lazy.

- [ ] **Step 1: Write the failing tests** in `opening.spec.ts`:
  - `the hero shows the finished scene at once` (all four scene categories, desktop and mobile): on load, without scrolling, the H1, the lead (the last shot line), and the link "Request a quote" (href `/<locale>/contact?category=<slug>`) are visible; the scene's final layers are visible (the reduced spec's final-state selectors).
  - `phones have no pin`: at 390 there is no `.pin-spacer` inside `.cat-opening`.
  - `desktop keeps the build`: at 1440 the build scene follows the hero and pins (`.scene-pin.pin-spacer` exists after the hero).
  - The reduced spec passes unchanged (no pin, no clip).
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Events hero: a dark gradient from the text side (inline-start; mirrored in AR) plus a light overall dim; tune on the 1440 shots.
- [ ] **Step 4:** Run the five specs plus `cls.spec.ts`. Expected: PASS. Then:
  - Lighthouse A/B mobile, `/en/services/events-hospitality` and `/ar/services/creative-production`, before = port 3200: **if LCP regresses beyond the recorded spread, stop and report to the owner before merging.**
  - Shots of the Events hero at 1440 EN and AR into `docs/checkpoints/audit-fixes/after/` and send them to the owner. **Don't merge before the owner approves.**
- [ ] **Step 5:** Commit on `audit-n06`: `feat(category): N06 the opening starts with the finished scene`. Merge into `audit-fixes` (or `phase-2-services`, whichever is current) only after both gates.

### Task 13 (branch `audit-n17`): N17 photo grade

**Files:** Modify `scripts/grade-stories.mjs` (a light uniform warm grade option) and the graded outputs in `public/images/stories/` for the strip's six photos and the event photos the audit names (`about-en-1440-03`: the heritage cart; `home-en-1440-07`: the strip). Output pairs: `docs/checkpoints/audit-fixes/grade/<id>-before.webp`, `<id>-after.webp`.

- [ ] **Step 1:** Add the grade as a named preset in the script (one matrix, applied to all the listed photos; crop only where the audit names an untrimmed edge).
- [ ] **Step 2:** Generate the before/after pairs and a contact sheet; check that file sizes don't grow more than 10% per photo.
- [ ] **Step 3:** Send the pairs to the owner. **Don't adopt (merge) before approval.**
- [ ] **Step 4:** Commit on `audit-n17`: `feat(images): N17 a uniform warm grade (pending approval)`.

### Task 14: Docs: launch checklist, v1.1, decisions

**Files:** Create `docs/launch/checklist.md` (or extend the existing launch doc in `docs/launch/`); modify `docs/plans/v1.1.md`, `docs/DECISIONS.md` (D125+), `docs/review/decisions-to-confirm.md`, `docs/HANDOFF.md`.

- [ ] **Step 1:** Launch checklist, N03: the two Turnstile env vars (public one at build time), the hostnames (`notimehub.com`, `www.notimehub.com`), the real-send matrix from the spec (four forms × EN/AR × iPhone Safari, Android Chrome, desktop Chrome and Safari), and the blocked-Turnstile fallback test (block `challenges.cloudflare.com`, the email fallback shows). Pass criteria as in the spec.
- [ ] **Step 2:** v1.1: N13 (B) Cal.com; N14 page length; N20 marquee → one small line (not removed); the rest of N19 (24 px targets etc.); lazy setup of the photo stories with TBT re-measured; a real photo in the home hero on phones, or at every size once ≥ 2000 px photos arrive.
- [ ] **Step 3:** DECISIONS D125+ (one line each, with the reason): the CTA bar (N04) and its exclusions; the category hint (UI only); the hiding header and its `translate` contract; N05 B1 and the measured pin end; N06 A (when merged); N10's month select and dropped hint; N12's EN hide range; `HEADER_LINKS` vs `NAV_LINKS`; the Work filter threshold; Task 6B's card-count grids. Mirror the calls in `decisions-to-confirm.md` with a recommendation each.
- [ ] **Step 4:** Commit: `docs: audit fixes decisions, launch checklist, v1.1`.

### Task 15: Review, verification and the done checks

- [ ] **Step 1:** `superpowers:requesting-code-review` by a fresh agent on `phase-2-services..audit-fixes` (and each gated branch when it's ready). Fix Critical/Important, then re-run the touched tests.
- [ ] **Step 2:** Full local run: `npm run lint && npm run typecheck && npm test`, then `npx playwright test` against port 3000 (CI-equivalent build). Report pass / flaky / fail separately (retry-pass = flaky).
- [ ] **Step 3:** axe-core (WCAG 2.0/2.1 A and AA) on the nine pages, EN and AR, 390 and 1440: `/`, `/services`, `/services/events-hospitality`, `/services/software-digital`, `/work`, the football league case study (`/work/football-league-events-awards`), `/about`, `/contact`, `/links`. Pass: no serious or critical violation.
- [ ] **Step 4:** Lighthouse mobile, ab method, before (port 3200) vs after (port 3000), same machine, nothing else running: `/en`, `/en/services/events-hospitality` (after N06 merges; until then the current category page), `/en/links`. Pass: no LCP or CLS regression; `/links` ≥ 95. Write `docs/checkpoints/lighthouse/audit-fixes/README.md`.
- [ ] **Step 5:** Screenshots of every page at 1440 and 390, EN and AR, into `docs/checkpoints/audit-fixes/after/` (`scripts/m3-shots.mjs`), and the before/after pairs for the visual items (N05, N06, N07, N11, N12, N21, the CTA bar, the hiding header).
- [ ] **Step 6:** `superpowers:verification-before-completion`, then push and run the CI `workflow_dispatch`; record the run number. Red blocks the report.
- [ ] **Step 7:** Rebuild the review server on port 3100 from HEAD (production: `next build` + `npm run review:start -- 3100`), keep the same tunnel, and say whether the link changed (`docs/review/tunnel.md`).
- [ ] **Step 8:** Final report in Arabic, one screen: per item what was done and what differed from the spec, the numbers (Lighthouse, axe, CI run), what waits for the client (Turnstile keys, the WhatsApp number, photos ≥ 2000 px, client approvals), and the decisions with a recommendation each.
