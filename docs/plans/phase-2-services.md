# Phase 2 · Category pages: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:** approved by the user on 2026-11-08, with adjustments:
- CP7 is the user's approval (Rand has delegated).
- The rental and print-store modules are made honest (`rental-categories`, `print-order`).
- Part 1 is built first.

**Stop before Tasks 3.3–3.8:** the user confirms the Events module specs first. The user may still send module changes after reviewing `docs/design/category-pages.md`.

**Goal:** Build `/[locale]/services` and five designed category pages, where each of the 30 approved services is an anchored section with one signature module. Build Events & Hospitality first as the prototype for the user's approval (CP7).

**Architecture:**
- **Pages:** static App Router pages (`generateStaticParams`, 5 categories × 2 locales), driven by typed content in `src/content/`.
- **Themes:** CSS custom properties on `<main data-theme>`.
- **Modules:** client islands loaded with `next/dynamic` when their section nears the viewport. Until then, a server-rendered static fallback shows the reduced-motion state and reserves the module's box.
- **Navigation:** the anchor utility from D53 handles anchors, menu links and `?service=` quote links.

**Tech stack:** Next.js 16.4.5 (cacheComponents, Turbopack), next-intl 4, GSAP and ScrollTrigger via `@/lib/gsap`, Motion, Lenis, Tailwind (logical properties only), Vitest, Playwright (`channel: "chrome"`).

**Spec:** [docs/design/category-pages.md](../design/category-pages.md). Read it alongside this plan: the module specs (§6) and theme specs (§5) are not repeated here.

## Final approved services list (D56)

The canonical list is [docs/content/services-list.md](../content/services-list.md). It carries slugs and anchors, and a unit test keeps it in step with `src/content/services.ts`.

| Category | Services (anchor) |
|---|---|
| I Events & Hospitality | Conferences & summits (`conferences`) · Exhibitions & booths (`exhibitions`) · Product launches & brand activations (`launches`) · Galas & private celebrations (`celebrations`) · Catering & heritage hospitality (`hospitality`) · Stage & technical production (`stage`) |
| II Creative Production | Photography (`photography`) · Video production (`video`) · Motion graphics (`motion`) · AI content creation (`ai-content`) · Set & stage design (`set-design`) · Equipment & camera rental (`rental`) |
| III Marketing & Brand | Branding & identity (`branding`) · Social media management (`social`) · Digital marketing & SEO (`digital-marketing`) · Content strategy (`content-strategy`) · Public relations (`pr`) · Media planning (`media-planning`) |
| IV Production, Print & Gifts | Large-format printing (`large-format`) · Stand fabrication & signage (`fabrication`) · Packaging design (`packaging`) · Corporate gifts (`gifts`) · Online print store (`print-store`) · Branded merchandise (`merchandise`) |
| V Software & Digital | Websites (`websites`) · Mobile apps (`apps`) · Custom systems (`systems`) · E-commerce (`e-commerce`) · UI/UX design (`ux`) · AI consulting (`ai-consulting`) |

## Global Constraints

- CLAUDE.md applies in full. In particular:
  - GSAP for scroll-driven motion, Motion for interaction, never both on one element.
  - Reduced motion shows the final state.
  - Logical properties only; RTL mirrors.
  - Strings live in messages or content files.
  - `// TODO: replace placeholder` on every placeholder.
  - No invented claims, no pricing, no talent content.
  - AI stand-ins labelled "Illustrative" / «صورة توضيحية».
- Demo data is rendered with the label **"Example" / «مثال»**, driven by `example: true` in its data file. AI content samples are labelled **"AI-generated example" / «مثال مولَّد بالذكاء الاصطناعي»**.
- Anchors: kebab-case, unique site-wide, identical in EN and AR, never renamed after launch.
- Western digits everywhere (D50).
- Landing on an anchor: the target's top at the bottom of the lowest `[data-anchor-offset]` element (header, plus the chip bar on mobile category pages), within **±4px**, then focus on the section's H2.
- No pin longer than 1 viewport; no pin on mobile.
- Anything moving on its own for more than 5s has a pause control and stops off-screen, on focus, with the tab hidden and under reduced motion.
- No new runtime dependency. Modules use SVG, CSS, GSAP and Motion only.
- Images go through `BrandImage` with native `width`/`height` and the srcset capped (D51); AI files are native Canva size, never upscaled.
- Lighthouse mobile 90+ in every category, on each category page.
- Every commit passes the pre-commit hook (simple-git-hooks: `npm run lint && npm run typecheck && npm test`, no e2e; D58). Never bypass it with `--no-verify`.
- E2E policy:
  - `workers: 1`, `retries: 1`; a pass on retry counts as flaky.
  - Before each checkpoint, a full run on a quiet machine, reported as pass / flaky / fail.
  - Nothing else runs in parallel with Lighthouse or the full e2e.
- Checkpoint reports go to the user in Arabic; commits end with the Co-Authored-By line.

## Review Focus

1. **A deep link on mobile to a service anchor on a category page** must land under the chip bar, not under it by the header height alone. Test in Task 2.3.
2. **`?service=` with an anchor from another category, an unknown value or a script string** should leave the form on the page's category with no service selected, no error and no echo of the raw value. Test in Task 2.6.
3. **A module that never mounts** (JS blocked, chunk error, reduced motion) must leave the static fallback complete, in the same box, with no layout shift when the module does mount. Test in Task 2.4.
4. **Arabic:** timelines start at inline-start, before/after splits mirror, prev/next buttons flip, and arrow keys move in the visual direction. Test in Task 3.2, and per module in its own test.
5. **Rapid repeated input** (toggles, filters, configurator options, sorter buttons) must end in the state of the last input, with no half-finished animation. Test in each interactive module's spec (one shared helper, Task 2.4).

---

## File structure

```
src/app/[locale]/services/page.tsx                     overview (/services)
src/app/[locale]/services/[category]/page.tsx          category page (generateStaticParams, metadata)
src/app/[locale]/services/[category]/opengraph-image.tsx
src/content/types.ts                                    + CategoryTheme, ModuleKey, QuoteType, Category/Service fields
src/content/categories.ts, services.ts                  + theme, intro, faq / anchor, signatureModule, points, relatedWork, quoteType
src/content/links.ts                                    categoryHref, serviceHref, quoteHref (pure)
src/content/modules/<key>.ts                            per-module data (localized; example flag)
src/lib/scrollspy.ts (+ .test.ts)                       activeIndex (pure)
src/lib/service-param.ts (+ .test.ts)                   parseServiceParam (pure)
src/lib/jsonld.ts (+ .test.ts)                          categoryJsonLd, overviewJsonLd (pure)
src/components/category/                                hero, service-index, service-section, faq, quote-block, theme.css
src/components/modules/registry.ts                      ModuleKey → dynamic import
src/components/modules/module-slot.tsx                  near-viewport loader around the static fallback
src/components/modules/<key>/{static.tsx,<key>.tsx,<key>.css}
src/components/providers/anchor-scroll.tsx              + [data-anchor-offset], search-param re-run, same-page quote links
src/components/layout/menu-data.ts, nav-links.ts, mobile-menu.tsx   links to the new routes
src/app/sitemap.ts                                      + /services and 5 categories
e2e/category-*.spec.ts, e2e/modules/<key>.spec.ts
```

---

## Part 1: Shared infrastructure

### Task 2.1: Data model, links and content tests

**Files:** modify `src/content/types.ts`, `categories.ts`, `services.ts`, `index.ts`, `content.test.ts`; create `src/content/links.ts`, `src/content/links.test.ts`.

**Interfaces (produces):**
- Types `CategoryTheme`, `ModuleKey`, `QuoteType` exactly as in spec §3.
- `Category.theme`, `.intro`, `.faq`.
- `Service.anchor`, `.signatureModule`, `.points`, `.relatedWork`, `.quoteType`.
- `categoryHref(slug: CategorySlug): string` → `/services/<slug>`.
- `serviceHref(s: Service): string` → `/services/<category>#<anchor>`.
- `quoteHref(s: Service): string` → `/services/<category>?service=<anchor>#quote`.
- `getServiceByAnchor(anchor: string): Service | undefined`.
- These hrefs are locale-less and go through next-intl `Link`.

- [ ] **Step 1:** Write the failing tests in `content.test.ts`.
  - Anchors match the `Anchor` column of `services-list.md` (extend the existing list test's regex to capture group 3).
  - Anchors are unique and match `/^[a-z0-9]+(-[a-z0-9]+)*$/`.
  - Every service has 4–6 `points` in both locales, with the same count in each.
  - Every category has 4–6 FAQ entries and a non-empty `intro`.
  - `theme` per category: events → `evening`, creative → `studio`, marketing → `editorial`, print → `workshop`, software → `interface`.
  - `signatureModule` matches the spec §6 mapping (a 30-entry table in the test).

  In `links.test.ts`:
  - `serviceHref(conferences)` is `"/services/events-hospitality#conferences"`.
  - `quoteHref(gifts)` is `"/services/production-print-gifts?service=gifts#quote"`.
- [ ] **Step 2:** Run `npx vitest run src/content`. Expected: FAIL (missing fields).
- [ ] **Step 3:** Add the fields.
  - Points, intros and FAQs for **Events & Hospitality** come from Task 3.1. For the other categories, add `TODO:`-prefixed placeholders listed in CONTENT_CHECKLIST, so the counts pass while the text is clearly unfinished.
  - `relatedWork: []` everywhere (OQ #17).
- [ ] **Step 4:** Run `npx vitest run`. Expected: PASS.
- [ ] **Step 5:** Commit `feat(content): category page data model, anchors and links (D57)`.

### Task 2.2: Routes, overview page, metadata, sitemap, JSON-LD

> Done 2026-11-08 (D60). Under Cache Components `dynamicParams` does not exist: unknown slugs get a 404 from the proxy. Arabic OG text is pre-shaped for satori.

**Files:**
- Create: `src/app/[locale]/services/page.tsx`, `src/app/[locale]/services/[category]/page.tsx`, `.../opengraph-image.tsx`, `src/lib/jsonld.ts` and its test.
- Modify: `src/app/sitemap.ts`, `e2e/overflow.spec.ts` (add the 6 pages).

**Interfaces:**
- `categoryJsonLd(c: Category, services: Service[], locale: Locale, siteUrl: string): object[]` returns `[ItemList, FAQPage, BreadcrumbList]`.
- `overviewJsonLd(categories: Category[], locale: Locale, siteUrl: string): object[]`.

- [x] **Step 1:** Write failing tests in `jsonld.test.ts`:
  - `ItemList.itemListElement` has 6 entries for events.
  - Entry 1's `item["@id"]` is `"https://x.test/en/services/events-hospitality#conferences"`, and its `provider["@id"]` is `"https://x.test/#organization"`.
  - FAQPage `mainEntity` length equals `faq.length`.
  - Breadcrumb names are `["Home","Services","Events & Hospitality"]` in EN and `["الرئيسية","الخدمات","الفعاليات والضيافة"]` in AR.
  - There is no `aggregateRating` and no `areaServed` key anywhere.
- [x] **Step 2:** Run it. Expected: FAIL.
- [x] **Step 3:** Implement `jsonld.ts`.
  - The routes use `generateStaticParams` over the categories; an unknown category calls `notFound()`.
  - `generateMetadata` sets title, description, canonical, and `alternates.languages` (en, ar, x-default).
  - The OG image comes from `ImageResponse` (espresso ground, champagne numeral, ivory title; Alexandria for AR).
  - The overview lists the categories with all services linked by `serviceHref`.
  - Add `"/services"` and the 5 category paths to `PAGES` in `sitemap.ts`.
  - Run `npx next typegen` after adding the routes (`PageProps<"/[locale]/services/[category]">`).
- [x] **Step 4:** Check the build and tests.
  - `npm run build`: the 12 new pages prerender static (○).
  - `npx vitest run`: PASS.
  - `/sitemap.xml` has 14 URLs (home plus 6 pages, × 2 locales).
- [x] **Step 5:** Commit `feat(services): overview and category routes, metadata, JSON-LD, sitemap`.

### Task 2.3: Anchor offsets, the service index and scrollspy

**Files:**
- Create: `src/lib/scrollspy.ts` and its test, `src/components/category/service-index.tsx`.
- Modify: `src/components/providers/anchor-scroll.tsx`, `src/components/layout/site-header.tsx` (add `data-anchor-offset`).
- Test: `e2e/category-index.spec.ts`.

**Interfaces:**
- `activeIndex(tops: number[], line: number): number` returns the index of the last section whose top is ≤ the line, or −1 above the first.
- In `anchor-scroll.tsx`, `landingTop` uses `max(bottom of every visible [data-anchor-offset])` instead of `#site-header` alone.

- [ ] **Step 1:** Write unit tests:
  - `activeIndex([0,800,1600], 700)` is `0`;
  - `activeIndex([0,800,1600], 800)` is `1`;
  - `activeIndex([100,800], 50)` is `-1`;
  - `activeIndex([], 10)` is `-1`.

  Write e2e tests (the mobile project):
  - `/en/services/events-hospitality#exhibitions` on load lands with `#exhibitions` top − chip bar bottom within ±4px, and `#exhibitions h2` is focused.
  - The same in AR.
  - Clicking chip III lands `#launches` within ±4px, and chip III gets `aria-current="location"`.

  Desktop:
  - Rail link IV lands within ±4px of the header bottom.
  - After scrolling into section V by wheel, rail item V is `aria-current`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
  - **Index:** a rail at ≥ 900px; a chip bar below that, with `data-anchor-offset` on the chip bar.
  - **Scrollspy:** a ScrollTrigger refresh reads the section tops, and `activeIndex` with the line at the offset bottom + 1 picks the item.
  - **Indicator:** Motion `layoutId`.
  - **Chip bar:** active chips scroll into view via `container.scrollTo`.
  - **Markup:** `<nav aria-label>` from messages, `category.indexLabel`.
  - **Anchor utility:** also re-run the deep-link effect when `useSearchParams()` changes.
- [ ] **Step 4:** Run `npx vitest run` and `PW_BASE_URL=http://localhost:3100 npx playwright test category-index anchor-scroll`. Expected: PASS. The existing `anchor-scroll` spec must still pass.
- [ ] **Step 5:** Commit `feat(services): service index with scrollspy; anchor offset includes sticky bars`.

### Task 2.4: Module slot, registry, static fallbacks and shared module test helpers

**Files:**
- Create: `src/components/modules/registry.ts`, `module-slot.tsx`, `example-label.tsx`, `e2e/modules/helpers.ts`, `e2e/category-modules.spec.ts`.

**Interfaces:**
- `ModuleProps = { service: Service; locale: Locale }`.
- `MODULES: Record<ModuleKey, ComponentType<ModuleProps>>`, built with `next/dynamic(() => import(...), { ssr: false })`.
- `<ModuleSlot moduleKey service locale>{staticFallback}</ModuleSlot>` renders the fallback.
  - It mounts the module when the slot is within 1 viewport (IntersectionObserver `rootMargin: "100% 0px"`).
  - It keeps the fallback if the import fails, using an error boundary that renders `children`.
  - It sets `data-module-ready` on mount.
  - The module renders inside the same box (`min-block-size` taken from the fallback's measured height).
- `<ExampleLabel kind="example" | "ai" | "illustrative" />` reads its strings from messages.
- E2E helpers:
  - `spamThenSettle(page, locator, n)` clicks n times quickly, then returns the final state attribute.
  - `expectNoShift(page, selector)` records a CLS PerformanceObserver over the slot while scrolling.

- [ ] **Step 1:** Write e2e tests for a stub module (`agenda-timeline`, registered first with a trivial client body):
  - Before scrolling, the slot shows the static fallback and has no `data-module-ready`.
  - After scrolling near it, `data-module-ready` is present and layout-shift entries inside the slot sum to < 0.01.
  - With JS disabled (`javaScriptEnabled: false`), the fallback's text is fully present.
  - With the module chunk request aborted (`page.route('**/*agenda*', r => r.abort())`), the fallback stays and there are no console errors other than the aborted request.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement the slot, the registry and the label.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit `feat(modules): lazy module slot with static fallback and failure safety`.

### Task 2.5: Category page sections and themes

**Files:**
- Create: `src/components/category/{category-hero,service-section,category-faq,quote-block}.tsx`, `src/components/category/theme.css`.
- Modify: `messages/{en,ar}.json` (namespace `category`).

**Interfaces:**
- `<ServiceSection service numeral>` renders `section#<anchor>[aria-labelledby]` with: the H2, the intro (`summary`), the "What we deliver" list, `<ModuleSlot>`, the related-work row (only when `relatedWork.length > 0`) and the quote ButtonLink (`quoteHref`).
- Theme tokens on `main[data-theme]`: `--theme-ground`, `--theme-ink`, `--theme-accent`, `--theme-line`, `--theme-reveal-dur`. Values from spec §5.
- The FAQ uses `<details>`.

- [ ] **Step 1:** Write e2e tests (`category-structure.spec.ts`, every category in EN and AR):
  - Exactly one `h1`.
  - 6 `section[id] > h2`, in data order.
  - No horizontal overflow at 1440, 390 and 360.
  - The FAQ opens with Enter.
  - `script[type="application/ld+json"]` parses and has the 3 types.
  - The header tone is never dark-on-dark, checked by sampling `data-header-tone` at each section's top.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement the sections and the 5 theme blocks. Heroes are static here; the theme hero motion comes per category (Task 3.2 and later).
- [ ] **Step 4:** Run them. Expected: PASS. Run `npm run lint` too.
- [ ] **Step 5:** Commit `feat(services): category page sections, FAQ and theme tokens`.

### Task 2.6: Menus, links and the quote preset

**Files:**
- Modify: `src/components/layout/{menu-data.ts,nav-links.ts,mobile-menu.tsx}`, `src/components/sections/categories/{categories,category-cards}.tsx`, `e2e/mega-keyboard.spec.ts`.
- Create: `src/lib/service-param.ts` and its test, `e2e/category-links.spec.ts`.

**Interfaces:**
- `parseServiceParam(value: string | null, category: CategorySlug): string | null` returns the anchor only if it belongs to `category`.
- `menu-data.ts`:
  - `MenuCategory.href` → `categoryHref(slug)`;
  - each service `href` → `serviceHref(s)`;
  - `allServicesHref` → `"/services"`.
- `SERVICES_HREF` stays `"/#services"` for the hero CTA. Remove its TODO.
- `QuoteBlock` reads `?service` with `useSearchParams` under Suspense. On the same page, a quote link click calls `history.replaceState` and the anchor utility (no navigation).

- [ ] **Step 1:** Write unit tests:
  - `parseServiceParam("conferences","events-hospitality")` is `"conferences"`;
  - `("gifts","events-hospitality")` is `null`;
  - `("<script>","events-hospitality")` is `null`;
  - `(null, …)` is `null`.

  Write e2e tests:
  - Mega menu: service "Exhibitions & booths" on `/en` navigates to `/en/services/events-hospitality#exhibitions`, which lands within ±4px with the H2 focused.
  - Mega menu: the category title goes to the category page top.
  - Mobile menu: the same flow.
  - Homepage card III goes to `/en/services/marketing-brand`.
  - On the category page, the quote button in `#launches` updates the URL to `?service=launches#quote` with no navigation (the `performance.getEntriesByType("navigation")` count is unchanged), and the form's service field equals "launches".
  - `/en/services/events-hospitality?service=gifts#quote` leaves the service field empty.
  - The existing `mega-keyboard` steps still pass.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the full suite on a quiet machine. Expected: no failures.
- [ ] **Step 5:** Commit `feat(nav): menus and cards link to category pages; quote links carry ?service`.

---

## Part 2: Events & Hospitality prototype ("The Evening")

### Task 3.1: Events copy (EN first, AR written natively)

**Files:** modify `src/content/categories.ts`, `services.ts` (events entries); create `docs/content/category-copy-events.md` (a copy deck in the established format: key, EN, AR, a note on the AR phrasing); modify `docs/CONTENT_CHECKLIST.md`.

- [ ] **Step 1:** Write the category intro (2–3 sentences), 4–6 points per service and 5 FAQ entries.
  - Use the 2026 profile (`profile-copy.md`) and `services-proposal.md` only.
  - Questions needing client facts (lead times, coverage area, minimum guest counts) become `TODO:` keys in CONTENT_CHECKLIST, not answers.
- [ ] **Step 2:** Run `npx vitest run src/content src/messages`. Expected: PASS (counts, banned phrases, Arabic punctuation, Western digits).
- [ ] **Step 3:** Commit `content(services): Events & Hospitality copy deck`.

### Task 3.2: The Evening theme and hero

**Files:** `src/components/category/themes/evening-hero.tsx` (client, GSAP), `theme.css` (evening block), `e2e/category-events.spec.ts`.

- [ ] **Step 1:** Write tests:
  - Reduced motion: the hero overlay opacity is the final value (0.25), and no ScrollTrigger is created.
  - Motion: after scrolling 60vh, the overlay opacity is ≤ 0.3.
  - Below 900px, the H1 is the LCP element and is never masked or split (as in the hero test).
  - AR: the glow origin mirrors (inline-start).
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement as spec §5.1 (transform and opacity only).
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit `feat(services): The Evening theme and hero`.

### Tasks 3.3–3.8: Events modules (one task each, in this order)

| Task | Module | Effort | Owner | Perf risk |
|---|---|---|---|---|
| 3.3 | `agenda-timeline` (#conferences) | M | GSAP | |
| 3.4 | `stage-lights` (#stage) | M | Motion | |
| 3.5 | `menu-majlis` (#hospitality) | M | GSAP | |
| 3.6 | `launch-reveal` (#launches) | M | Motion | |
| 3.7 | `candle-moodboard` (#celebrations) | M | Motion + GSAP (separate layers) | ⚠ images |
| 3.8 | `stand-assembly` (#exhibitions) | **L** | GSAP | ⚠ SVG paths and pin |

Every module task follows the same five steps. The specifics (what it shows, controls, live-region text, data) are in spec §6.

- [ ] **Step 1:** Write `e2e/modules/<key>.spec.ts`, which asserts:
  - reduced motion shows the complete final state (every item or label from the data file visible), with interactive controls still working;
  - keyboard: every control can be reached with Tab and operated with Enter, Space or the arrow keys, with visible focus;
  - the `aria-live` text after one interaction equals the spec's example string, e.g. "Spots on, 2 of 4 groups";
  - `spamThenSettle` ends in the last input's state;
  - AR: the direction mirrors (the first timeline item sits at inline-start, i.e. its `getBoundingClientRect().right` is the largest in RTL);
  - the "Example" label is present when the data file has `example: true`;
  - any loop is paused when scrolled off-screen (`document.getAnimations()` on the module root are all paused, or the GSAP ticker callback count stays the same).
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement `src/content/modules/<key>.ts` (data), `static.tsx` (server fallback, same box) and `<key>.tsx` (client), and register it in `registry.ts`.
- [ ] **Step 4:** Run the module spec and `category-modules`. Expected: PASS.
- [ ] **Step 5:** Commit `feat(modules): <key> for <service>`.

### Task 3.9: Prototype verification

- [ ] **Step 1:** Run `superpowers:verification-before-completion` with a live check of `/en` and `/ar` at 1440, 390 and 360: overflow 0, no console errors, reduced motion, keyboard-only pass.
- [ ] **Step 2:** Run the Lighthouse script (mobile) on `/en/services/events-hospitality` and `/ar/...`, with nothing else running. Expected: 90+ in every category. If below, profile and fix before the checkpoint (a reduced-quality result is not acceptable).
- [ ] **Step 3:** Run the full e2e suite on a quiet machine and report pass / flaky / fail. Log it in `docs/e2e-flakes.md`.
- [ ] **Step 4:** Take screenshots (`scripts/shots.mjs` extended with `--category=events-hospitality`): the hero at rest and mid-scroll, each module in its key state, the index rail and the chip bar, EN and AR, 1440 and 390.

## CHECKPOINT 7: Events & Hospitality prototype, for the user's approval

Rand has delegated design, content-structure and naming decisions to the user, so CP7 is the user's approval. The user may show the prototype to Rand as a courtesy.

Send in Arabic:

- screenshots;
- a short recording of the hero and two modules;
- Lighthouse scores;
- the e2e table;
- the copy deck;
- open items.

**Stop.** The other four categories start only after approval. Any feedback on the theme system or the skeleton is applied to Part 1's components first.

---

## Part 3: The other four categories (after CP7)

Each category repeats Part 2's pattern:

- **Copy task:** the copy deck and data, as in Task 3.1.
- **Theme and hero task:** as in Task 3.2, with spec §5.x.
- **One task per module:** the five steps above, with the specs from spec §6.
- **Verification task:** as in Task 3.9.
- **A checkpoint.**

| Order | Category | Modules (effort) | Checkpoint | Waits on |
|---|---|---|---|---|
| 4 | Production, Print & Gifts (The Workshop) | human-scale S, print-order S, merch-placement S, build-layers M, gift-configurator M, unboxing M ⚠ | CP8 | Online print store status (new OQ) |
| 5 | Software & Digital (The Interface) | fidelity-slider S, ai-sorter S, responsive-frames M, app-screens M, data-flow M, checkout-flow M | CP9 | — |
| 6 | Marketing & Brand (The Editorial) | mark-build M, content-calendar M, press-release M, flighting-chart M, example-dashboard M, phone-feed M ⚠ | CP10 | Logo SVG (CONTENT_CHECKLIST #14) for the full mark build |
| 7 | Creative Production (The Studio) | motion-playground S, idea-to-image M, set-model M, rental-categories S, aperture-gallery M ⚠, scrub-reel M ⚠ | CP11 | Showreel (#1), equipment inventory (new OQ), photo consent (OQ #18) |

**Effort:** 7 S, 22 M, 1 L across the 30 modules, plus about 6–8 days of Part 1 infrastructure. See spec §7.

---

## Out of scope (noted only)

- **Standalone SEO pages** for the top 3–4 search services (event management, exhibition stand design, corporate gifts in Dubai). The data model allows them (spec §2: a stable `slug`, a future `src/content/landings.ts`). They are not built in this phase.
- **The quote form pipeline** (Server Actions, Resend, Turnstile; brief §9). Its own phase. Until then `QuoteBlock` shows the WhatsApp and email fallback from `src/config/contact.ts`, whose values are still placeholders.
- **Real related work:** shown only after client approval (OQ #17). Until then the related-work rows are hidden.
