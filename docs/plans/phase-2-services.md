# Phase 2 · Category pages: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:**
- **First approved on 2026-11-08** (CP7 is the user's approval; honest rental and print-store modules; Part 1 first).
- **Revised on 2026-11-08** for the user's two briefs, "cinematic storyboard, layered imagery & build plan" and "Software & Digital is a strategic page" (DECISIONS D64–D66). **This revision is awaiting the user's review** (stop point 1).
- **Done:** Tasks 2.1–2.4 (commits 92da396, de3f4ea, 7661a42, 4718aaf).
- **In progress:** Task 2.5. Its e2e spec (`e2e/category-structure.spec.ts`) is written; nothing is implemented. It is paused, because the storyboards change the hero and the quote block.

**Stop points (the user's):**
1. After the storyboards, `layers.md` and this plan: the user's review. **← now**
2. After the Events & Hospitality animatic: the user's approval of rhythm and layout.
3. After the Events images (a contact sheet, with cutouts on a checkerboard): the user's approval.
4. After the full Events build: Checkpoint 7.

The same pattern then repeats for Software & Digital (CP8) and each later category. **Also still in force:** the module specs of Tasks 3.3–3.8 are confirmed by the user before they're built.

**Goal:** Build `/[locale]/services` and five category pages. Each opens with a short cinematic story, while every one of the 30 approved services stays findable in under 5 seconds and quotable in one click. Events & Hospitality is the first prototype, Software & Digital (a sales page with real lead capture) the second.

**Architecture:**
- **Pages:** static App Router pages (5 categories × 2 locales), driven by typed content in `src/content/`. The page layout is a per-category list of blocks, so Software & Digital can add its sales blocks without a second template.
- **Openings:**
  - `<LayeredScene>` composes L0–L3 layers from a typed scene config (`src/content/scenes/<category>.ts`).
  - One GSAP timeline scrubs the pinned shots. Layer motion comes from pure functions (`src/lib/scene-math.ts`).
  - The same component renders grey boxes in **animatic** mode and the reduced-motion **still**.
- **Themes:** CSS custom properties on `<main data-theme>`. Each section's ground is a CSS token (`--tone-ground`) that ToneController reads, so night (Studio) and champagne (Workshop) grounds work.
- **Modules:** lazy islands in a reserved box with a static fallback (Task 2.4, D63).
- **Forms (D66):** Server Actions with Zod, Turnstile, a honeypot, a per-IP rate limit, Resend, and React Email templates. They're built inside the Software prototype and reused for the category quote form.
- **Navigation:** the anchor utility (D53) for anchors, the index, the skip control and `?service=` links.

**Tech stack:** Next.js 16.4.5 (cacheComponents, Turbopack), next-intl 4, GSAP and ScrollTrigger via `@/lib/gsap`, Motion, Lenis, Tailwind (logical properties only), Zod, Resend, @react-email/components, @marsidev/react-turnstile, react-hook-form (all already in `package.json`), Vitest, Playwright (`channel: "chrome"`).

**Specs:**
- [docs/design/category-pages.md](../design/category-pages.md): themes §5, modules §6, SEO §8.
- [docs/design/storyboards/](../design/storyboards/README.md): the openings, the service scenes, the rhythm and the closings, which override §4's hero and pin rule (D64).
- [layers.md](../design/storyboards/layers.md): every image layer.

## Final approved services list (D56)

The canonical list is [docs/content/services-list.md](../content/services-list.md). It carries slugs and anchors, and a unit test keeps it in step with `src/content/services.ts`. It stays at 30: CMS and dashboards fold into Websites and Custom systems; event technology is a band on the Software page, not a service (D65).

| Category | Services (anchor) |
|---|---|
| I Events & Hospitality | Conferences & summits (`conferences`) · Exhibitions & booths (`exhibitions`) · Product launches & brand activations (`launches`) · Galas & private celebrations (`celebrations`) · Catering & heritage hospitality (`hospitality`) · Stage & technical production (`stage`) |
| II Creative Production | Photography (`photography`) · Video production (`video`) · Motion graphics (`motion`) · AI content creation (`ai-content`) · Set & stage design (`set-design`) · Equipment & camera rental (`rental`) |
| III Marketing & Brand | Branding & identity (`branding`) · Social media management (`social`) · Digital marketing & SEO (`digital-marketing`) · Content strategy (`content-strategy`) · Public relations (`pr`) · Media planning (`media-planning`) |
| IV Production, Print & Gifts | Large-format printing (`large-format`) · Stand fabrication & signage (`fabrication`) · Packaging design (`packaging`) · Corporate gifts (`gifts`) · Online print store (`print-store`) · Branded merchandise (`merchandise`) |
| V Software & Digital | Websites (`websites`) · Mobile apps (`apps`) · Custom systems (`systems`) · E-commerce (`e-commerce`) · UI/UX design (`ux`) · AI consulting (`ai-consulting`) |

## Build order

| Order | Part | Ends in |
|---|---|---|
| 1 | Shared infrastructure (Tasks 2.1–2.10) | — |
| 2 | Events & Hospitality: animatic → **approval** → images and cutouts → **approval** → full build | **CP7** |
| 3 | Software & Digital: animatic → **approval** → forms pipeline and page → modules → **performance work (phase-1 Task 16)** → production Lighthouse | **CP8**, then publish |
| 4 | Production, Print & Gifts: animatic → approval → images → build | CP9 |
| 5 | Marketing & Brand: the same | CP10 |
| 6 | Creative Production: the same (waits on the showreel, the inventory, photo consent) | CP11 |

## Global Constraints

- CLAUDE.md applies in full. In particular:
  - GSAP for scroll-driven motion, Motion for interaction, never both on one element.
  - Reduced motion shows the final state.
  - Logical properties only; RTL mirrors.
  - Strings live in messages or content files.
  - `// TODO: replace placeholder` on every placeholder.
  - No invented claims, no pricing, no talent content.
  - AI stand-ins for a real project are labelled "Illustrative" / «صورة توضيحية».
- Demo data is rendered with the label **"Example" / «مثال»**, driven by `example: true` in its data file. AI content samples are labelled **"AI-generated example" / «مثال مولَّد بالذكاء الاصطناعي»**. Product concept screens are labelled **"Preview" / «معاينة»**.
- Anchors: kebab-case, unique site-wide (guarded by `src/content/anchors.test.ts`), identical in EN and AR, never renamed after launch.
- Western digits everywhere (D50).
- Landing on an anchor: the target's top at the bottom of the lowest `[data-anchor-offset]` element, within **±4px**, then focus on the section's H2.
- **Pins (D64):** the opening pins at most **2.0 vh on desktop and 1.2 vh on mobile**. Any other pin is at most 1 vh, desktop only. Scroll is never hijacked.
- **Findability (D64):**
  - The service index is visible and usable from the first frame.
  - "Skip to services" / «انتقل إلى الخدمات» is in the opening.
  - Choosing a service skips the story.
- **LCP is text:** the H1. No image is preloaded or `priority` in an opening. On mobile the H1 never moves, masks or splits (D43).
- **Images:**
  - Opening budget ≤ 5 image layers and ≤ ~600 KB on mobile. Shot-1 layers are eager only within budget; the rest load one viewport ahead.
  - Every image goes through `BrandImage` with native `width`/`height` and a capped srcset (D51); AI files are native Canva size, never upscaled.
  - One colour grade per scene, baked at export.
- **Loops:** anything moving on its own stops off-screen and on a hidden tab. Anything moving longer than 5 s has a pause control.
- **Dependencies:** only those already in `package.json` (D66 lists the form packages). No new runtime dependency.
- **Forms (D66):**
  - The keys come only from env.
  - Never log, print or commit a key, a submitted email or a message body.
  - E2E uses Turnstile's test keys and a file sink, never real email.
- **Performance:** Lighthouse mobile 90+ in every category on each category page. The Software & Digital page isn't published before phase-1 Task 16 and a production-domain run (D65).
- Every commit passes the pre-commit hook (D58). Never `--no-verify`.
- **E2E policy:**
  - `workers: 1`, `retries: 1`; a pass on retry counts as flaky.
  - A full run on a quiet machine before each checkpoint, reported as pass / flaky / fail.
  - Nothing runs in parallel with Lighthouse or the full e2e.
- Checkpoint reports go to the user in Arabic; commits end with the Co-Authored-By line.

## Review Focus

1. **A deep link or index click into a service while the opening is pinned** (`/en/services/events-hospitality#stage` on load, or rail VI clicked at 0.5 vh) must land on the H2 within ±4px, with the opening in its end state and no pin spacer left at the wrong height. Test in Task 2.8.
2. **A double submit, a Turnstile failure or token expiry, or a rate-limit hit** must end in one clear message near the button, with the visitor's input kept and no duplicate email sent. Test in Task 4.2.
3. **The sticky mobile CTA bar must never cover the focused field or the last line of the page,** and it must hide while the on-screen keyboard is up. Test in Task 4.3.
4. **`?service=` with an anchor from another category, an unknown value or a script string** should leave the form on the page's category with no service selected, no error and no echo of the raw value. Test in Tasks 2.6 and 4.2.
5. **Arabic:** parallax drift, wipes, the timeline and sliders mirror; the skip control and index arrows flip. Test in Tasks 2.7 and 2.8, and per module.

(Done and tested: deep links under the chip bar, Task 2.3; a module that never mounts, Task 2.4.)

---

## File structure

```
src/app/[locale]/services/page.tsx                     overview (/services)
src/app/[locale]/services/[category]/page.tsx          category page (blocks per category)
src/app/[locale]/services/[category]/opengraph-image.tsx
src/app/[locale]/lab/[animatic]/page.tsx               animatics (noindex, not in the sitemap, gated by env)
src/app/[locale]/privacy/page.tsx                      Privacy Policy stub (D66)
src/content/types.ts                                   + SceneConfig, SceneLayer, PageBlock, CaseStudy
src/content/scenes/<category>.ts                       shots, layers, copy keys (one file per category)
src/content/case-studies.ts                            UAEAF case study (enabled: false)
src/content/modules/<key>.ts                           per-module data (localized; example flag)
src/lib/scene-math.ts (+ test)                         layerTransform, shotAt, pinLength (pure)
src/lib/scrollspy.ts, service-param.ts, jsonld.ts, seo.ts (+ tests)
src/lib/forms/{schemas,rate-limit,turnstile,mailer}.ts (+ tests)
src/lib/lighthouse-summary.ts (+ test)                 reads the latest production summary at build time
src/app/[locale]/services/[category]/actions.ts        Server Actions: consultation, interest, quote
src/emails/{consultation,interest,quote,auto-reply}.tsx  React Email templates
src/components/category/                               opening, service-index, service-section, faq, quote-block, theme.css
src/components/scenes/layered-scene.tsx (+ .css)       <LayeredScene> (client; GSAP)
src/components/scenes/atmosphere.tsx                   L3: glows, haze, beams, grain
src/components/forms/                                  consultation-form, interest-form, privacy-notice, form-status
src/components/software/                               case-study, cta-band, event-tech, process, products, our-work, stack-strip, sticky-cta
src/components/modules/…                               (Task 2.4)
scripts/grade.mjs                                      bakes a scene's colour grade into its layer files (sharp)
public/images/scenes/<category>/                       graded layer files
e2e/category-*.spec.ts, e2e/opening.spec.ts, e2e/forms.spec.ts, e2e/software-page.spec.ts, e2e/modules/<key>.spec.ts
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

- [x] **Step 1:** Write the failing tests in `content.test.ts`.
  - Anchors match the `Anchor` column of `services-list.md` (extend the existing list test's regex to capture group 3).
  - Anchors are unique and match `/^[a-z0-9]+(-[a-z0-9]+)*$/`.
  - Every service has 4–6 `points` in both locales, with the same count in each.
  - Every category has 4–6 FAQ entries and a non-empty `intro`.
  - `theme` per category: events → `evening`, creative → `studio`, marketing → `editorial`, print → `workshop`, software → `interface`.
  - `signatureModule` matches the spec §6 mapping (a 30-entry table in the test).

  In `links.test.ts`:
  - `serviceHref(conferences)` is `"/services/events-hospitality#conferences"`.
  - `quoteHref(gifts)` is `"/services/production-print-gifts?service=gifts#quote"`.
- [x] **Step 2:** Run `npx vitest run src/content`. Expected: FAIL (missing fields).
- [x] **Step 3:** Add the fields.
  - Points, intros and FAQs for **Events & Hospitality** come from Task 3.1. For the other categories, add `TODO:`-prefixed placeholders listed in CONTENT_CHECKLIST, so the counts pass while the text is clearly unfinished.
  - `relatedWork: []` everywhere (OQ #17).
- [x] **Step 4:** Run `npx vitest run`. Expected: PASS.
- [x] **Step 5:** Commit `feat(content): category page data model, anchors and links (D57)`.

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

> Done 2026-11-08 (D61). The layout wrapper id `#stage` collided with the `stage` anchor; it is now `#page-stage`, with a guard test.

**Files:**
- Create: `src/lib/scrollspy.ts` and its test, `src/components/category/service-index.tsx`.
- Modify: `src/components/providers/anchor-scroll.tsx`, `src/components/layout/site-header.tsx` (add `data-anchor-offset`).
- Test: `e2e/category-index.spec.ts`.

**Interfaces:**
- `activeIndex(tops: number[], line: number): number` returns the index of the last section whose top is ≤ the line, or −1 above the first.
- In `anchor-scroll.tsx`, `landingTop` uses `max(bottom of every visible [data-anchor-offset])` instead of `#site-header` alone.

- [x] **Step 1:** Write unit tests:
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
- [x] **Step 2:** Run them. Expected: FAIL.
- [x] **Step 3:** Implement.
  - **Index:** a rail at ≥ 900px; a chip bar below that, with `data-anchor-offset` on the chip bar.
  - **Scrollspy:** a ScrollTrigger refresh reads the section tops, and `activeIndex` with the line at the offset bottom + 1 picks the item.
  - **Indicator:** Motion `layoutId`.
  - **Chip bar:** active chips scroll into view via `container.scrollTo`.
  - **Markup:** `<nav aria-label>` from messages, `category.indexLabel`.
  - **Anchor utility:** also re-run the deep-link effect when `useSearchParams()` changes.
- [x] **Step 4:** Run `npx vitest run` and `PW_BASE_URL=http://localhost:3100 npx playwright test category-index anchor-scroll`. Expected: PASS. The existing `anchor-scroll` spec must still pass.
- [x] **Step 5:** Commit `feat(services): service index with scrollspy; anchor offset includes sticky bars`.

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

- [x] **Step 1:** Write e2e tests for a stub module (`agenda-timeline`, registered first with a trivial client body):
  - Before scrolling, the slot shows the static fallback and has no `data-module-ready`.
  - After scrolling near it, `data-module-ready` is present and layout-shift entries inside the slot sum to < 0.01.
  - With JS disabled (`javaScriptEnabled: false`), the fallback's text is fully present.
  - With the module chunk request aborted (`page.route('**/*agenda*', r => r.abort())`), the fallback stays and there are no console errors other than the aborted request.
- [x] **Step 2:** Run them. Expected: FAIL.
- [x] **Step 3:** Implement the slot, the registry and the label.
- [x] **Step 4:** Run the tests. Expected: PASS.
- [x] **Step 5:** Commit `feat(modules): lazy module slot with static fallback and failure safety`.

### Task 2.5: Category sections, FAQ, quote block, themes and grounds

Done (D69). As built: `category-faq.tsx`, `category-quote.tsx` and `quote-actions.tsx` (client, reads `?service=`); theme tokens live in `category.css` (no separate `theme.css`); the closing line is `Category.closing`; the index track releases early when Act 3's tone differs. The service select arrives with the form (Task 4.2); related work stays hidden until real work exists (OQ #17).

**Files:**
- Create: `src/components/category/{category-faq,quote-block}.tsx`, `src/components/category/theme.css`.
- Modify: `src/app/[locale]/services/[category]/page.tsx`, `src/components/providers/tone-controller.tsx`, `src/app/globals.css` (the tone grounds), `messages/{en,ar}.json` (namespace `category`).
- Test: `e2e/category-structure.spec.ts` (written).

**Interfaces:**
- Theme tokens on `main[data-theme]`: `--theme-ground`, `--theme-ink`, `--theme-accent`, `--theme-line`, `--theme-reveal-dur`. Values from spec §5. A light band inside a dark theme (the Evening's FAQ and quote) redefines them on `[data-tone="light"]`.
- **Grounds:**
  - `section[data-tone]` paints `background-color: var(--tone-ground)`.
  - Defaults: espresso for dark, ivory for light. Themes override: Studio night, Workshop champagne.
  - ToneController tweens `--page-bg` to the section's computed `--tone-ground`, falling back to the tone's default.
- **End band:** `END_TONE: Record<CategoryTheme, Tone>` (Evening light, Studio dark, others light) for the FAQ and quote sections.
- **FAQ:** `<details>`/`<summary>`.
- **Quote block (`#quote`):** heading, body, the service select (pre-set in Task 2.6), and WhatsApp and email actions from `src/config/contact.ts`, shown only when set. Otherwise it shows `contactPending`. The real form replaces the actions in Task 4.2 (D66).
- **Related work:** rendered only when `relatedWork.length > 0` (all empty now, OQ #17).

- [x] **Step 1:** Write `e2e/category-structure.spec.ts`, every category in EN and AR:
  - one `h1`;
  - the 6 `.cat-sections > section[id]` in data order, each with its H2;
  - the FAQ and `#quote` are present;
  - no overflow at 1440 and 390 (360 is covered by `overflow.spec.ts`);
  - the FAQ opens and closes with Enter;
  - JSON-LD has ItemList and BreadcrumbList, and FAQPage only once the FAQ is written;
  - `data-header-tone` equals each section's tone at the header line;
  - `#page-stage`'s background equals the theme's ground mid-section.
- [x] **Step 2:** Run it. Expected: FAIL.
- [x] **Step 3:** Implement the sections, the 5 theme blocks and the grounds.
- [x] **Step 4:** Run it, plus `npm run lint`. Expected: PASS.
- [x] **Step 5:** Commit `feat(services): category sections, FAQ, quote block, theme tokens and grounds`.

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
- `SERVICES_HREF` stays `"/#services"` for the hero CTA; remove its TODO.
- `quoteHref(s)` targets `#quote`, or `#consult` on Software & Digital (`QUOTE_TARGET` per category).
- `QuoteBlock` reads `?service` with `useSearchParams` under Suspense. On the same page, a quote link click calls `history.replaceState` and the anchor utility (no navigation).

- [ ] **Step 1:** Write unit tests:
  - `parseServiceParam("conferences","events-hospitality")` is `"conferences"`;
  - `("gifts","events-hospitality")` is `null`;
  - `("<script>","events-hospitality")` is `null`;
  - `(null, …)` is `null`.

  Write e2e tests:
  - Mega menu: "Exhibitions & booths" on `/en` lands on `/en/services/events-hospitality#exhibitions` within ±4px, with the H2 focused.
  - Mega menu: the category title goes to the category page top.
  - Mobile menu: the same flow.
  - Homepage card III goes to `/en/services/marketing-brand`.
  - On the category page, the quote button in `#launches` sets the URL to `?service=launches#quote` with no navigation (the `performance.getEntriesByType("navigation")` count is unchanged), and the service select equals "launches".
  - `?service=gifts#quote` on the Events page leaves the select empty.
  - The `mega-keyboard` steps still pass.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the affected specs. Expected: PASS.
- [ ] **Step 5:** Commit `feat(nav): menus and cards link to category pages; quote links carry ?service`.

### Task 2.7: `<LayeredScene>` and the scene math

**Done (D68).** As built: `src/lib/scene-math.ts` exports `pinLength`, `shotAt`, `layerDrift(depth, push, progress)`, `enterFrom(from, dir)`, `stillState(layer)` and `sceneProblems(scene)` (the limits are checked as data, so a config test lists every problem instead of throwing). `<LayeredScene scene lines variant="live" | "animatic">` with `SceneDirector` (client, GSAP); the still is not a variant: it is the CSS state without JS or under reduced motion. L3 atmosphere is CSS (`fx-shade`, `fx-glow`, `fx-beam`), so there is no `atmosphere.tsx`. The e2e runs on the lab route (Task 2.9), not a styleguide fixture. Shot indexes are 0-based (`data-shot-active="2"` is the third shot).

**Files:**
- Create: `src/lib/scene-math.ts` (+ test), `src/content/scenes/types.ts`, `src/components/scenes/{layered-scene.tsx,layered-scene.css,atmosphere.tsx}`.
- Test: `e2e/layered-scene.spec.ts`, run on a styleguide fixture (`/[locale]/styleguide#scene`).

**Interfaces:**
- `SceneLayer = { id: string; level: 0|1|2|3; depth: number; push?: number; slot?: string; mobile: boolean; enter?: { shot: number; from: { x?: number; y?: number; opacity?: number; scale?: number } }; box?: { inset: string } }`. `slot` is the image slot id; `box` places the animatic box.
- `SceneConfig = { id: string; shots: { id: string; copyKey: string; desktop: [number, number]; mobile: [number, number] }[]; layers: SceneLayer[]; still: number }`. The shot ranges are in vh of pin scroll.
- `layerTransform(depth: number, progress: number, dir: 1 | -1): { x: number; y: number; scale: number }`, with progress in 0–1 over the whole scene. Values:
  - y = −depth × 14 × progress (vh);
  - scale = 1 + push × progress, where `push` is set per layer in the config (the README §3 ranges: L0 0.06, L1 0.10, L2 0 unless a shot says otherwise);
  - x = 0 unless the layer's `enter.from.x` is set, then x × dir.
- `shotAt(progress: number, shots, viewport: "desktop" | "mobile"): number` gives the active shot index.
- `pinLength(shots, viewport): number` gives vh, and throws if desktop > 2.0 or mobile > 1.2.
- `<LayeredScene config variant="live" | "animatic" | "still">`:
  - **live:** one GSAP timeline, pinned, scrubbed, built in `gsap.matchMedia` (desktop and mobile conditions; reduced motion → still).
  - **animatic:** each layer is a flat box in a level tone, labelled with its slot id and depth, with the same motion.
  - **still:** the `still` shot composed, no ScrollTrigger.
  - Shot copy renders as one `<p>` per shot in DOM order. Only the active one is visible, except in the still, which shows them all.
  - Images go through `BrandImage`. `loading` is eager only for shot-1 layers flagged within budget; there's never a `priority`.

- [x] **Step 1:** Write the unit tests:
  - `layerTransform(0, 1, 1)` is `{x:0, y:0, scale:1}`;
  - `layerTransform(1, 0.5, 1).y` is −7;
  - an `enter.from.x` of 30 gives +30 in EN and −30 in AR;
  - `shotAt(0.5, events.shots, "desktop")` is the index of the shot whose range contains 1.0 vh;
  - `pinLength` throws for a desktop total of 2.1;
  - every config in `src/content/scenes/` passes `pinLength` and has ≤ 5 image layers (≤ 3 with `mobile: true`).

  Write the e2e tests on the fixture:
  - reduced motion: no `.pin-spacer` and every shot line visible;
  - motion: after scrolling to the shot-3 range, `[data-shot-active]` is 3;
  - AR: a layer entering from inline-start starts with a positive `translateX` in RTL;
  - the H1 is the LCP element (PerformanceObserver `largest-contentful-paint` entry's element is the `h1`) at 390 and 1440.
- [x] **Step 2:** Run. Expected: FAIL.
- [x] **Step 3:** Implement.
- [x] **Step 4:** Run. Expected: PASS.
- [x] **Step 5:** Commit `feat(scenes): LayeredScene with depth parallax, animatic and still variants`.

### Task 2.8: The opening shell: index from the first frame, skip control, curtain

**Done (D68).** As built: `CategoryView` (shared by the public page and the lab) renders the opening, then the index on a track over the whole page (`.cat-index-track`, anchor scope on `.cat-page`), then the services. The skip control is a hash link (no JS needed); below 900px it sits at inline-start, clear of the WhatsApp button. Tab order is breadcrumbs → skip → index (the test asserts that sequence rather than "3 stops", since the two breadcrumb links come first). Grain moved to the page box. `Category.imageWide`, the hero and the two cancelled slots are gone.

**Files:**
- Create: `src/components/category/category-opening.tsx`.
- Modify: `category-hero.tsx` (retired into the opening), `service-index.tsx`, `category.css`, `messages` (`category.skip`), `src/content/{types,categories,images}.ts`: `Category.imageWide` and the cancelled slots `cat-marketing-brand-16x9` and `cat-software-digital-16x9` are removed (D67); the real 16:9 photos stay as slots, since they're used elsewhere or are scene sources.
- Test: `e2e/opening.spec.ts`.

**Interfaces:**
- `<CategoryOpening category scene>` renders: breadcrumbs, the eyebrow, the H1 (text, LCP), the skip control (a button calling the anchor utility on the first service's anchor), then `<LayeredScene>`.
- **Desktop rail:** sticky from the page top, over the opening, on a theme scrim (`--theme-scrim`).
- **Mobile chip bar:** under the header from the first frame.
- **The skip control hides** (`inert` plus opacity) once the opening has scrolled past.

- [x] **Step 1:** Write the e2e tests, Events page, EN and AR, desktop and mobile:
  - At load, the rail (desktop) or the chip bar (mobile) is visible and its first link is reachable with Tab within 3 stops after the header.
  - "Skip to services" with Enter lands `#conferences` within ±4px, H2 focused.
  - Rail VI clicked at 0.5 vh into the opening lands `#stage` within ±4px.
  - A deep link `/en/services/events-hospitality#stage` lands within ±4px.
  - The measured pin length (pin spacer height minus the viewport) is ≤ 2.0 vh desktop and ≤ 1.2 vh mobile.
  - No horizontal overflow at 360 in the opening.
  - Reduced motion: no pin spacer, the skip control still works.
- [x] **Step 2:** Run. Expected: FAIL.
- [x] **Step 3:** Implement.
- [x] **Step 4:** Run, plus `category-index`, `anchor-scroll`, `category-structure`. Expected: PASS.
- [x] **Step 5:** Commit `feat(services): category opening with index from the first frame and skip control`.

### Task 2.9: Lab route for animatics

**Done (D68).** As built: the proxy answers 404 for the lab while it is off and for unknown ids (`closedLabLocale`, unit-tested); the page keeps `notFound()` as a second guard. The lab also shows the draft scene for a category with no scene yet.

**Files:**
- Create: `src/app/[locale]/lab/[animatic]/page.tsx`.
- Modify: `src/app/sitemap.ts` (asserted absent), `.env.example` (`NEXT_PUBLIC_ENABLE_LAB`).

**Interfaces:**
- `/[locale]/lab/<category>-animatic` renders the category page with `variant="animatic"` for every scene and flat boxes for module slots, labelled with their module key.
- `robots: { index: false, follow: false }`.
- `notFound()` unless `NEXT_PUBLIC_ENABLE_LAB === "1"` at build time.
- Not in the sitemap, not linked.

- [x] **Step 1:** Write the tests:
  - unit: the sitemap has no `/lab/` URL;
  - e2e (built with the flag): the page has `<meta name="robots" content="noindex, nofollow">`, the boxes carry their slot ids, and the index and skip control work.
- [x] **Step 2–4:** Fail, implement, pass.
- [x] **Step 5:** Commit `feat(lab): hidden animatic route`.

### Task 2.10: Scene images: slots, grade and export

**Done.** As built: the grades and their category map live in `src/lib/grade.ts` (erasable TypeScript, unit-tested, imported by the script; Software has none). The matrices are starting values, marked TODO, to be tuned on the graded/ungraded contact sheet (stop point 3). `src/content/scenes/images.ts` holds the 23 slots of layers.md (tested one to one), each with its grade and source; plates carry a 9:16 file (`<slot>-9x16`). The script prints per-file sizes and batch totals; the per-scene mobile budget is enforced by the content test, which reads the files a scene's mobile layers use. LayeredScene's live variant draws slots through `SceneImage` (decorative `alt=""`, art-directed plates, srcset capped); BrandImage's `eager` prop went with it. `image-native.spec.ts` is unchanged: no scene image renders yet, and the unit test checks native sizes.

**Files:**
- Create: `scripts/grade.mjs`, `src/content/scenes/images.ts` (scene layer slots, the same `ImageSlot` type plus `source: { kind: "real" | "ai"; from?: string }` and `grade`).
- Modify: `src/content/content.test.ts`, `image-native.spec.ts`.

**Interfaces:**
- `node scripts/grade.mjs <category> <in> <out>` applies the category's colour matrix (`GRADES` in the script: Evening, Workshop, Editorial, Studio) and writes AVIF and WebP (alpha kept) at native size.
- It refuses to upscale, and prints each file's bytes and the scene's mobile total.

- [x] **Step 1:** Write the unit tests:
  - every scene layer slot with a `src` has `width`/`height` equal to the file's real size;
  - real-source layers name their source photo;
  - a scene's mobile layers total ≤ 600 KB on disk (read with `fs.stat`).
- [x] **Step 2–4:** Fail, implement, pass. The slots have `src: null` until images exist, so the size tests are skipped per slot until then.
- [x] **Step 5:** Commit `feat(scenes): scene image slots and the colour grade export`.

---

## Part 2: Events & Hospitality prototype ("The Evening")

Storyboard: [events-hospitality.md](../design/storyboards/events-hospitality.md). Layers: [layers.md](../design/storyboards/layers.md) §I.

### Task 3.0: Events animatic → STOP (stop point 2)

**Files:** create `src/content/scenes/events-hospitality.ts` (opening and majlis configs, from the storyboard's shot table); add the storyboard's shot lines to the messages as drafts (marked in the copy deck as pending approval).

- [ ] **Step 1:** Run `npx vitest run src/lib/scene-math src/content`. Expected: PASS (the config passes `pinLength` and the layer limits).
- [ ] **Step 2:** Build with `NEXT_PUBLIC_ENABLE_LAB=1`. Run `opening.spec.ts` against `/[locale]/lab/events-animatic`. Expected: PASS.
- [ ] **Step 3:** Record a short screen capture (Playwright video, desktop and mobile) and take screenshots at 1440 and 390, EN and AR: shot by shot, the majlis scene, the index and the skip control.
- [ ] **Step 4:** Commit `feat(lab): Events & Hospitality animatic`.
- [ ] **Step 5:** Report to the user in Arabic with the recording, the screenshots and the timings table. **Stop** for approval of rhythm and layout.

### Task 3.1: Events copy (EN first, AR written natively)

**Files:**
- Modify: `src/content/categories.ts`, `services.ts` (events entries), `messages` (shot lines).
- Create: `docs/content/category-copy-events.md` (a copy deck in the established format: key, EN, AR, a note on the AR phrasing).
- Modify: `docs/CONTENT_CHECKLIST.md`.

- [ ] **Step 1:** Write the category intro (2–3 sentences), the one-line promise and 4–6 points per service, 5 FAQ entries, and the approved shot lines.
  - Use the 2026 profile (`profile-copy.md`) and `services-proposal.md` only.
  - Questions needing client facts (lead times, coverage area, minimum guest counts) become `TODO:` keys in CONTENT_CHECKLIST, not answers.
- [ ] **Step 2:** Run `npx vitest run src/content src/messages`. Expected: PASS (counts, banned phrases, Arabic punctuation, Western digits).
- [ ] **Step 3:** Commit `content(services): Events & Hospitality copy deck`.

### Task 3.1b: Events images and cutouts → STOP (stop point 3)

Only after the animatic is approved.

- [ ] **Step 1:** Confirm the credit cost per Canva generation and per background removal on the account. Report it.
- [ ] **Step 2:** Generate the AI layers (`ev-open-hall`, `ev-majlis-dusk`, 16:9 and 9:16) with the prompts in layers.md.
- [ ] **Step 3:** Upload the real sources and cut them out (Canva remove-background; manual SVG masks for simple edges).
- [ ] **Step 4:** Grade and export them with `scripts/grade.mjs evening`.
- [ ] **Step 5:** Inspect every file at full size.
- [ ] **Step 6:** Build a contact sheet: every layer, cutouts on a checkerboard, graded and ungraded versions side by side, bytes per file and the mobile total per scene.
- [ ] **Step 7:** Run `npx vitest run src/content`. Expected: PASS (native sizes, budget).
- [ ] **Step 8:** Commit `assets(scenes): Events & Hospitality layers`.
- [ ] **Step 9:** Report to the user in Arabic with the contact sheet. **Stop** for approval.

### Task 3.2: The Evening theme, opening and majlis scene

**Files:** `src/components/category/theme.css` (evening block), `src/content/scenes/events-hospitality.ts` (slots filled), `src/components/category/section-light.tsx` (each section's light source, GSAP), `e2e/category-events.spec.ts`.

- [ ] **Step 1:** Write the tests:
  - Reduced motion: the opening shows the still (overlay opacity 0.25, all lines visible), no ScrollTrigger.
  - Motion: at the end of the pin, the overlay opacity is ≤ 0.3.
  - Below 900px, the H1 is the LCP element and is never masked or split.
  - AR: the florals layer enters from inline-start (positive x in RTL).
  - The majlis pour path's `stroke-dashoffset` reaches 0 by the time the scene's centre passes the viewport's centre.
  - The opening's mobile image bytes (from the Resource Timing API) are ≤ 600 KB.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement as storyboard and spec §5.1 (transform and opacity only).
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5:** Commit `feat(services): The Evening theme, opening and majlis scene`.

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
- [ ] **Step 3:** Implement `src/content/modules/<key>.ts` (data), `static.tsx` (server fallback, same box) and `<key>.tsx` (client), and register it in `registry.tsx`.
- [ ] **Step 4:** Run the module spec and `category-modules`. Expected: PASS.
- [ ] **Step 5:** Commit `feat(modules): <key> for <service>`.

### Task 3.9: Prototype verification

- [ ] **Step 1:** Run `superpowers:verification-before-completion` with a live check of `/en` and `/ar` at 1440, 390 and 360: overflow 0, no console errors, reduced motion, a keyboard-only pass (the index, the skip control, the modules, the CTAs).
- [ ] **Step 2:** Run the Lighthouse script (mobile) on `/en/services/events-hospitality` and `/ar/...`, with nothing else running. Expected: 90+ in every category. If below, profile and fix before the checkpoint (a reduced-quality result is not acceptable). Report the opening's measured image weight.
- [ ] **Step 3:** Run the full e2e suite on a quiet machine and report pass / flaky / fail. Log it in `docs/e2e-flakes.md`.
- [ ] **Step 4:** Take screenshots (`scripts/shots.mjs --category=events-hospitality`) of:
  - each opening shot, the majlis scene, each module in its key state, the index rail and the chip bar;
  - EN and AR, at 1440 and 390.

## CHECKPOINT 7: Events & Hospitality prototype, for the user's approval

Send in Arabic:

- screenshots;
- a short recording of the opening, the majlis scene and two modules;
- Lighthouse scores and the measured image weight;
- the e2e table;
- the copy deck;
- open items.

**Stop.** Any feedback on the theme system, the opening shell or the skeleton is applied to Part 1's components before Part 3.

---

## Part 3: Software & Digital prototype ("The Interface", a sales page)

Storyboard: [software-digital.md](../design/storyboards/software-digital.md). Decisions: D65, D66.

### Task 4.0: Software animatic → STOP

**Files:**
- `src/content/scenes/software-digital.ts`.
- The page blocks rendered as labelled boxes on `/[locale]/lab/software-animatic`: case study, CTA band, services, event tech, process, products, our-work, stack, FAQ, consult.

- [ ] **Steps:** as Task 3.0 (tests, a recording, screenshots at 1440/390 EN/AR, a commit). Also show the mobile sticky bar's appear and hide points. **Stop** for approval.

### Task 4.1: Software copy, SEO metadata

**Files:** `docs/content/category-copy-software.md`; `src/content/services.ts` (software entries: promise and **3** deliverables, D65); `src/content/case-studies.ts` (anonymised and named variants); `src/content/products.ts` (problem statement, features as `TODO` until confirmed, OQ #24); messages; `generateMetadata` titles and descriptions per the storyboard's SEO section.

- [ ] **Step 1:** Update `content.test.ts`:
  - software services have exactly 3 points, the others 4–6;
  - banned words ("cutting-edge", "innovative solutions", "digital transformation" and their AR equivalents) appear in no message or content string;
  - every case-study sentence carries a `source` page or is a `{{TODO}}`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Write the copy (EN, then native AR).
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `content(services): Software & Digital copy deck and metadata`.

### Task 4.2: Form pipeline (D66)

**Files:**
- Create:
  - `src/lib/forms/{schemas,rate-limit,turnstile,mailer}.ts` (+ tests);
  - `src/app/[locale]/services/[category]/actions.ts`;
  - `src/emails/{consultation,interest,quote,auto-reply}.tsx`;
  - `src/components/forms/{consultation-form,interest-form,privacy-notice,form-status,error-summary}.tsx`;
  - `src/app/[locale]/privacy/page.tsx` (stub, `robots: noindex` until the full text, CONTENT_CHECKLIST #24);
  - `e2e/forms.spec.ts`.
- Modify: `.env.example` (the four keys plus `MAIL_SINK`), messages (`forms.*`, written with the `design:ux-copy` skill), the footer's privacy link.

**Interfaces:**
- `consultationSchema`, `interestSchema`, `quoteSchema` (Zod):
  - trimmed strings with max lengths;
  - email **or** WhatsApp required for consultation;
  - `service` passes through `parseServiceParam`;
  - the honeypot field `website` must be empty.
- `rateLimit(key: string, now: number): { ok: boolean; retryAfter: number }`: 5 submissions per IP per 10 minutes, in-memory per instance (best effort; noted in D66).
- `verifyTurnstile(token: string, ip: string): Promise<boolean>`: server-side `siteverify` with `TURNSTILE_SECRET_KEY`.
- **Turnstile keys (2026-11-08):** `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set in `.env.local` (checked: set; values never read out). The Turnstile keys aren't yet. Until they are, development and e2e use Cloudflare's published test keys (site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`). A production build with either Turnstile key missing **fails** (a check in `next.config.ts`), so the test keys can never ship.
- `sendMail(kind, locale, data)`:
  - Resend in production: one email to `CONTACT_TO_EMAIL` and one auto-reply to the sender in their locale.
  - In tests: `MAIL_SINK=file` writes JSON to `test-results/mail/`. The sink refuses to run when `NODE_ENV=production` and `VERCEL_ENV=production`.
- Actions return `{ status: "ok" } | { status: "invalid", fields } | { status: "limited", retryAfter } | { status: "failed" }`.
  - **Honeypot hits** return `ok` without sending anything.
  - **Nothing logs** a key, an email address or a message body.
- **Subjects:**
  - "Intro call request: {service or 'General'}";
  - "Register interest: {product}";
  - "Quote request: {service}".

- [ ] **Step 1:** Write the unit tests:
  - the schemas (valid, missing contact, a 10 000-char message, a script string in `service`);
  - `rateLimit` (the 6th within 10 min is limited; allowed again after the window);
  - `verifyTurnstile` (mocked fetch: success, failure, network error → false).

  Write the e2e tests (Turnstile test site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`, `MAIL_SINK=file`):
  - the happy path in EN and AR: success message, two mails in the sink, the auto-reply in the page's locale;
  - an empty submit: inline errors under each field (`aria-describedby`), and the error summary takes focus;
  - a double click on submit sends one mail;
  - a rate-limit hit shows the friendly message and keeps the input;
  - the always-fail Turnstile test key (`2x00000000000000000000AB`) shows its message;
  - the honeypot filled: no mail;
  - `?service=apps#consult` pre-selects Mobile apps; `?service=gifts` leaves it empty;
  - the privacy notice links to `/[locale]/privacy`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Ask the user to add the four keys to `.env.local` for a manual production-mode check; never read or print them.
- [ ] **Step 4:** Run. Expected: PASS. Then one manual send to the user's inbox (the user confirms receipt).
- [ ] **Step 5:** Commit `feat(forms): consultation and register-interest pipeline (Server Actions, Zod, Turnstile, Resend)`.

### Task 4.3: Software page blocks

**Files:** `src/components/software/{case-study,cta-band,event-tech,process,products,our-work,stack-strip,sticky-cta}.tsx`, `src/lib/lighthouse-summary.ts` (+ test), `src/content/categories.ts` (`blocks` for software-digital), `e2e/software-page.spec.ts`.

**Interfaces:**
- `Category.blocks?: PageBlock[]` (default: the shared skeleton).
- `caseStudies.uaeaf.named` (false): the anonymised variant renders by default (D67). One flag switches every text and visual to the named variant.
- `readLighthouseSummary(path): { date, url, perf, a11y, bp, seo } | null`. It returns null unless the summary is a **production-domain** run.
- `OUR_WORK_ENABLED` is true only when that run is ≥ 90 in every category (D65).

- [ ] **Step 1:** Write the tests.

  Unit, `readLighthouseSummary`:
  - a localhost summary → null;
  - a production summary with perf 89 → the module is off;
  - one with all categories ≥ 90 → on.

  E2E:
  - The case study renders **anonymised** by default: the title "A national sports federation", stylised HTML mockups, and no image, no client name and no URL anywhere in the section (a text search for "Athletics" and "uaeathletics" finds nothing).
  - With `named: true` (a test-only build env), the name, the URL and both real screens render, with their alt text.
  - The CTA band's button lands `#consult`.
  - The microcopy is present in EN and AR.
  - The sticky bar (mobile) appears after the opening and hides when `#consult` is in view.
  - With an input focused, the sticky bar is hidden, and its reserved space keeps the last footer line visible.
  - The floating WhatsApp button is hidden while the bar shows.
  - The process timeline mirrors in AR (first step at inline-start).
  - The products show "Preview" and "Coming soon" and their interest forms.
  - `#our-work` is absent (flag off).
  - No overflow at 360/390/1440.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement as the storyboard.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat(services): Software & Digital sales blocks`.

### Task 4.4: Software modules

One task each, the five steps of Tasks 3.3–3.8, in this order:

1. `responsive-frames`
2. `app-screens`
3. `data-flow`
4. `checkout-flow`
5. `fidelity-slider`
6. `ai-sorter`

Specs are in category-pages.md §6. **The user confirms the specs first.**

### Task 4.5: Homepage "Beyond events" band

**Files:** `src/components/sections/digital/*`, messages (`digital.*`).

- [ ] **Step 1:** Write the tests:
  - the band has `data-tone="dark"` and the core message as its heading;
  - its capability links go to `/services/software-digital#websites` (etc.);
  - the case-study teaser is anonymised by default and named only with the switch;
  - the product cards keep "Coming soon";
  - `cls.spec` stays at 0.
- [ ] **Step 2–4:** Fail, implement, pass.
- [ ] **Step 5:** Commit `feat(home): Software & Digital band`.

### Task 4.6: Performance work (phase-1 Task 16, moved here, D65)

Before the Software & Digital page is published.

- [ ] **Step 1:** Run phase-1 Task 16 Step 2 in full:
  - hydration and client-island trims;
  - the Alexandria subset;
  - measurement on a Vercel preview with PageSpeed Insights (mobile, 3 runs per locale, median) and one real-phone trace.
  - Pages: `/en`, `/ar`, `/en/services/software-digital`, `/ar/services/software-digital`, `/en/services/events-hospitality`.
- [ ] **Step 2:** Target: Performance ≥ 90, the others ≥ 95, on every page measured. Save the production summary to `docs/checkpoints/lighthouse/production/summary.json` (the source for `#our-work`).
- [ ] **Step 3:** Commit `perf: Task 16 before the Software & Digital launch`.

### Task 4.7: Verification and CHECKPOINT 8

- [ ] **Steps:** as Task 3.9, plus a real test submission of each form to the user's inbox.
- [ ] **Report in Arabic:**
  - screenshots and a recording;
  - Lighthouse (production);
  - the e2e table;
  - the copy deck;
  - the switches' state (case study, our-work);
  - open items.
- [ ] **Stop.** The page is published only after approval **and** Task 4.6's targets.

---

## Part 4: The other three categories (one checkpoint each)

Each category repeats the Events pattern:

1. animatic (Task 3.0) → **approval**;
2. copy (Task 3.1);
3. images (Task 3.1b) → **approval**;
4. theme and opening (Task 3.2);
5. one task per module;
6. verification (Task 3.9) and a checkpoint.

Its quote block switches from the WhatsApp/email actions to the real quote form (`quoteSchema`, Task 4.2).

| Order | Category | Storyboard | Modules (effort) | Checkpoint | Waits on |
|---|---|---|---|---|---|
| 4 | Production, Print & Gifts (The Workshop) | [production-print-gifts.md](../design/storyboards/production-print-gifts.md) | human-scale S, print-order S, merch-placement S, build-layers M, gift-configurator M, unboxing M ⚠ | CP9 | OQ #23 (print store) for its section V |
| 5 | Marketing & Brand (The Editorial) | [marketing-brand.md](../design/storyboards/marketing-brand.md) | mark-build M, content-calendar M, press-release M, flighting-chart M, example-dashboard M, phone-feed M ⚠ | CP10 | Logo SVG (CONTENT_CHECKLIST #14) for the full mark build |
| 6 | Creative Production (The Studio) | [creative-production.md](../design/storyboards/creative-production.md) | motion-playground S, idea-to-image M, set-model M, rental-categories S, aperture-gallery M ⚠, scrub-reel M ⚠ | CP11 | Showreel (#1), equipment inventory (OQ #22), photo consent (OQ #18) |

**Effort:**
- Modules: 7 S, 22 M, 1 L across 30 (spec §7).
- Added by the revision:
  - about 3–4 days of opening infrastructure (Tasks 2.7–2.10);
  - about 1 day per animatic;
  - 1–2 days per category for images and cutouts;
  - about 3–4 days for the form pipeline;
  - about 3 days for the Software sales blocks.

---

## Out of scope (noted only)

- **Analytics** (`consultation_submit`, `interest_submit`, `whatsapp_click`, `case_study_view`; see the Software storyboard). Implemented later with the analytics setup and the consent banner.
- **Standalone SEO pages** (D57): candidates "website development Dubai", "mobile app development UAE", "event registration system", "bilingual Arabic English website", plus the earlier event-management, exhibition-stand and corporate-gifts candidates. The data model allows them (a stable `slug`). They are not built in this phase.
- **Real related work:** shown only after client approval (OQ #17). Until then the related-work rows are hidden.
- **A persistent rate-limit store** (an edge KV): only if the in-memory limit proves insufficient after launch.
