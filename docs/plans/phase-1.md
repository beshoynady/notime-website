# Phase 1 — Design System, Shell & Cinematic Hero: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the approved styleguide prototype (`docs/design/notime-styleguide.html`) into the real Next.js 16 stack. That covers brand tokens, bilingual EN/AR routing, the motion infrastructure, the site shell, the cinematic clock hero, a `/[locale]/styleguide` approval page, a typed content layer, and the full homepage copy deck.

**Architecture:** `app/[locale]/layout.tsx` is the root layout. Locales are statically prerendered with `cacheComponents` kept on, and the locale is read through `next/root-params`. Server components render every piece of text, so the page is complete without JS. Thin client "controllers" add GSAP (scroll, intro), Motion (hover/click/menus) and Lenis on top. Content lives in typed `src/content/` files behind small getter functions, which is the CMS swap point.

**Tech Stack:** Next.js 16.4.5 (App Router, Turbopack, `cacheComponents`, `partialPrefetching`), React 19.3, TypeScript 5.9, Tailwind v4 `@theme`, next-intl 4.14.9, gsap 3.15.1 (ScrollTrigger, SplitText) + @gsap/react 2.1.2, motion 14.10.1 (`motion/react`), lenis 1.3.27, shadcn base-nova on Base UI 1.9. New dev dependencies: `vitest` (unit tests) and `@playwright/test` (e2e and screenshots). Playwright drives the installed Chrome via `channel: "chrome"`, so no browser download is needed.

**Spec:** the Phase 1 brief from the user (2026-11-06 session), plus `CLAUDE.md`, `docs/PROJECT_BRIEF.md` and the approved prototype `docs/design/notime-styleguide.html`.

**Approved 2026-11-06:** contact config at `src/config/contact.ts`; Vitest and Playwright as devDependencies only (`channel: "chrome"`, no browser downloads); native execution, with a fresh, unbriefed subagent for the end-of-phase code review; image generation on hold until checkpoint 4.

---

## Decisions taken in the short brainstorm (approve with this plan)

The visual direction is already approved. Only engineering approaches were open. Each row names the option I picked and why the others lose. On approval, every row is logged in `DECISIONS.md` as D11 onward.

| # | Question | Pick | Rejected and why |
|---|---|---|---|
| A | i18n under `cacheComponents` (OPEN_QUESTIONS #9) | **Keep `cacheComponents` and `partialPrefetching` on.** Root layout at `app/[locale]/layout.tsx` with `generateStaticParams` → `en`, `ar`. `i18n/request.ts` reads the locale via `import { locale } from "next/root-params"` (next-intl 4.14 marks `requestLocale`/`setRequestLocale` as deprecated in favour of this). `src/proxy.ts` (Next 16 renamed middleware to proxy) runs next-intl's `createMiddleware`. | Turning `cacheComponents` off loses the static shell and instant navigation. `setRequestLocale` in every page is deprecated. **Fallback:** if Task 2's build spike shows `next/root-params` is not yet wired in next-intl 4.14.9's `getRequestConfig`, use `requestLocale` plus `setRequestLocale` and log it. |
| B | Hero renderer | **Canvas 2D**: a port of the prototype, with pre-rendered radial sprites, DPR ≤ 2, IntersectionObserver pause and `visibilitychange` pause. The anamorphic flare is one more pre-rendered sprite. | WebGL/OGL: about 25–30 KB plus shader cost and a context-loss path, for no visible gain over at most 170 sprites and 4 rays. Revisit only if a mid-range Android profile drops below 50 fps. |
| C | Hero visible at rest | All hero text and the clock are **server-rendered and visible**. A 1-line inline script in `<head>` sets `html[data-js]` before first paint. Shutters, hidden beat words and pre-intro states apply **only** under `html[data-js]:not([data-reduced])`. | Hiding content by default and revealing it with JS would break the "visible if JS fails" rule and risk LCP. |
| D | Animation ownership | **GSAP:** hero intro and scroll, tone controller, RevealWords, MaskReveal, Parallax, ScrubColorWords, and the header fade during the intro (on the outer `[data-header-shell]` wrapper only). **Motion:** mega panel clip-path and item swaps, mobile menu and accordion, Magnetic, cursor, button micro-states. **CSS:** marquee, grain, rec-dot pulse, cue line. | Putting the mega panel on GSAP like the prototype would mean GSAP and Motion share the panel's children. Splitting by element keeps the "never both" rule easy to audit. |
| E | Text splitting | Use GSAP's **SplitText plugin** (`gsap/SplitText`) via `useSplitText(ref, opts)`, with `type: "chars,words"` + `mask` in EN and `type: "words"` + `mask` in AR. Use `autoSplit: true` with `onSplit` returning the tween, so resize and font load re-split and revert cleanly, and `aria: "auto"`. | Hand-rolled spans like the prototype's duplicate what the plugin does, and they get resize and ARIA wrong. |
| F | Tone system | One client `ToneController`. A ScrollTrigger per `[data-tone]` element tweens the `--page-bg` variable on `#stage` at `top 55%`, and sets `data-header-tone` on `<header>` at `top 68px`. The hero sets `data-header-tone="hero"` (transparent). Reduced motion swaps instantly. | Per-section listeners: duplicated logic and racing tweens. |
| G | Menu state | A **pure reducer** `menuReducer(state, event)` with tests, plus a `useMegaMenu()` hook that owns the 90 ms and 240 ms timers. Desktop and mobile share the data getters, not the components. | Ad-hoc booleans like the prototype's are hard to test against the keyboard and focus rules. |
| H | Content shape | `Localized<T> = { en: T; ar: T }`. Categories, services and products sit in typed arrays. Images are referenced by **slot id** into `src/content/images.ts`, so dropping a generated image in means editing one `src` field. | Inline image paths per service would make the "drop in by slot id" workflow brittle. |
| I | Contact config path | **`src/config/contact.ts`**, as this brief says twice. CLAUDE.md's "one config file in `src/lib/`" line is updated to point there. **Needs your OK**: it changes a permanent rule. | Keeping `src/lib/` contradicts the brief. |
| J | Test tooling | Add **Vitest** for pure logic and **@playwright/test** (`channel: "chrome"`) for e2e, overflow checks, keyboard checks, screenshots and the video recording. Run Lighthouse via `npx lighthouse` against `next start`. | No runner is installed today, and TDD for pure logic is a project rule. |

---

## Global Constraints

- Every rule in `CLAUDE.md` applies. In particular: logical Tailwind properties only (never `ml-/mr-/pl-/pr-/left-/right-/text-left/text-right`); no hard-coded user-facing strings; `// TODO: replace placeholder` on every placeholder; no invented claims; no talent/influencer content; no pricing; no agency comparisons.
- Palette tokens: `espresso #2E2017`, `cocoa #634731`, `taupe #BB9A79`, `champagne #EAD4AB`, `ivory #F5E9D3`, `night #0D0805` (letterbox and shutters only). Hairlines: `rgba(234,212,171,.16)` on dark, `rgba(46,32,23,.14)` on light.
- Fonts: Montserrat 200/300/400/500/600 and Alexandria 200/300/400/600, both via `next/font/google` as CSS variables. Arabic is one step larger, with no letter-spacing and no uppercase.
- Radius is 4px by default and 2px for tags. No pills except the WhatsApp button and dots.
- Motion tokens: micro 0.3s expo.out (Motion), base 0.8s power3.out (GSAP), display 1.2–1.5s expo.out (GSAP). Stagger is 0.03s per letter and 0.06s per word. No bounce or overshoot: every Motion transition is a tween with `ease: [0.16, 1, 0.3, 1]`, never a spring.
- Breakpoints: mega menu and desktop nav at ≥ 900px; header CTA at ≥ 1100px; HUD bottom-start hidden at ≤ 600px.
- Approved anchor lines are used verbatim: "IT'S TIME / TO CREATE." ↔ "حان وقت / الإبداع."; the hero lead; "Every second is planned." ↔ "كل ثانية محسوبة."; "One house. Five crafts." ↔ "بيت واحد. خمس حِرَف."
- `skill guardrails` from the brief: skills never override the palette, the fonts, the 4px radius or the reference. `simplify` must not remove reduced-motion handling, RTL logic, TODO comments, ARIA, or the IntersectionObserver/DPR safeguards.
- Every commit needs `npm run build`, `npm run lint`, `npm run typecheck` and `npm test` to pass, with zero warnings in new code.

## Review Focus

1. **JS disabled or failing.** The hero title, lead, CTA, menus (as links) and the second beat stay readable, and no shutter or letterbox covers content. *Test:* `e2e/no-js.spec.ts` (Task 9).
2. **Locale switch mid-scroll inside the pinned hero, or with a menu open.** No duplicate `.pin-spacer`, no stale SplitText spans, the menu closes, and the hero replays only the title. *Test:* `e2e/locale-switch.spec.ts` (Task 11).
3. **Mobile viewport resize (address bar, rotation) during the pin.** The pin end recomputes, nothing jumps, and the canvas re-sizes without re-seeding particles mid-warp. *Test:* `e2e/hero-resize.spec.ts` (Task 11).
4. **Keyboard-only mega menu.** Enter or Space opens it; Tab reaches categories → services → footer links; Shift+Tab out of the panel or Esc closes it and returns focus to the trigger. *Test:* `e2e/mega-keyboard.spec.ts` (Task 6).
5. **360px with long Arabic strings.** No horizontal scroll on `/en` or `/ar`, with or without the mobile menu open, on the home page and the styleguide. *Test:* `e2e/overflow.spec.ts` (Task 8, extended in Task 12).

---

## File Structure

```
src/
  proxy.ts                               next-intl middleware (Next 16 "proxy")
  i18n/routing.ts                        defineRouting({locales:["en","ar"], defaultLocale:"en", localePrefix:"always"})
  i18n/navigation.ts                     createNavigation(routing) → Link, usePathname, useRouter
  i18n/request.ts                        getRequestConfig via next/root-params
  app/globals.css                        @theme tokens, type scale, tone, grain, utilities
  app/[locale]/layout.tsx                <html lang dir>, fonts, providers, shell
  app/[locale]/page.tsx                  homepage: Hero + light stub section
  app/[locale]/styleguide/page.tsx       approval page (noindex)
  app/[locale]/not-found.tsx
  app/robots.ts, app/sitemap.ts          sitemap lists /en, /ar only
  config/contact.ts                      email, whatsapp, instagram, facebook (empty + TODO)
  content/types.ts                       Localized, Category, Service, Product, ImageSlot
  content/categories.ts, services.ts, products.ts, images.ts
  content/index.ts                       getters (CMS swap point)
  lib/motion.ts                          motion tokens (GSAP + Motion forms)
  lib/gsap.ts                            "use client"; registers ScrollTrigger + SplitText once
  lib/time.ts, lib/hero-math.ts, lib/roman.ts, lib/whatsapp.ts    pure logic
  lib/menu-reducer.ts                    pure mega-menu state machine
  hooks/use-reduced-motion.ts, use-split-text.ts, use-mega-menu.ts
  components/providers/{lenis-provider,direction-provider,tone-controller}.tsx
  components/motion/{reveal-words,mask-reveal,parallax,scrub-color-words,magnetic,marquee}.tsx
  components/layout/{site-header,logo,lang-toggle,mega-menu,mobile-menu,whatsapp-button,custom-cursor,site-footer}.tsx
  components/sections/hero/{hero,hero-clock,hero-hud,hero-scene,hero-controller,scene-state}.tsx|ts
  components/ui/{button,badge,field,brand-image,ai-placeholder,section}.tsx
  components/styleguide/*.tsx            styleguide-only blocks
  messages/en.json, ar.json
e2e/*.spec.ts, playwright.config.ts, vitest.config.ts
scripts/shots.mjs                        checkpoint screenshots + hero recording
docs/content/{copy-deck.md,image-prompts.md}
```

`src/app/layout.tsx` and `src/app/page.tsx` (template) are deleted. `public/{file,globe,next,vercel,window}.svg` are deleted.

---

## CHECKPOINT 1: stop here for approval of this plan.

---

### Task 1: Tooling, tokens and fonts

**Files:**
- Modify: `package.json` (scripts `typecheck: "tsc --noEmit"`, `test: "vitest run"`, `e2e: "playwright test"`; devDeps `vitest`, `@playwright/test`), `src/app/globals.css`, `CLAUDE.md` (contact path line, decision I)
- Create: `vitest.config.ts` (alias `@` → `src`, env `node`), `playwright.config.ts` (`webServer: npm run build && npm start`, port 3100, `channel: "chrome"`, projects `desktop` 1440×900 and `mobile` 390×844 `hasTouch`), `src/lib/motion.ts`, `src/lib/motion.test.ts`
- Delete: `public/*.svg` template files

**Interfaces:**
- Produces: `motion` tokens:
  ```ts
  export const ease = { expoOut: [0.16, 1, 0.3, 1], power3Out: [0.215, 0.61, 0.355, 1] } as const;
  export const motionTokens = {
    micro:   { duration: 0.3, gsapEase: "expo.out",   owner: "motion" },
    base:    { duration: 0.8, gsapEase: "power3.out", owner: "gsap" },
    display: { duration: 1.3, min: 1.2, max: 1.5, gsapEase: "expo.out", owner: "gsap" },
  } as const;
  export const stagger = { char: 0.03, word: 0.06 } as const;
  export const microTransition = { duration: 0.3, ease: ease.expoOut }; // Motion tween, never spring
  ```
- Produces CSS tokens for every later task: `--color-{espresso,cocoa,taupe,champagne,ivory,night}`, `--color-line-dark`, `--color-line-light`, `--font-en`, `--font-ar`, `--radius` = 4px, `--radius-tag` = 2px, `--section-pad: clamp(72px,11vw,160px)`, `--frame: 1280px`, `--gutter` (`max(16px, env(safe-area-inset-*))` < 760px, `40px` ≥ 760px), `--header-h: 68px`; utilities `.frame` (max-width and gutters), `.grid-12` (4 cols/16px → 12 cols/24px at ≥ 900px), `.text-display`, `.text-h1`, `.text-h2`, `.text-lead`, `.text-body` (65ch), `.text-eyebrow`, `[data-tone=dark]` grain `::before`.

- [x] **Step 1:** Install the devDeps, add the scripts, and write `motion.test.ts`. It asserts `stagger.char === 0.03`, `stagger.word === 0.06`, `motionTokens.base.duration === 0.8`, and that `microTransition` has no `type: "spring"`.
- [x] **Step 2:** Run `npm test` → FAIL (module missing).
- [x] **Step 3:** Implement `src/lib/motion.ts` as above → `npm test` PASS.
- [x] **Step 4:** Rewrite `globals.css`.
  - Delete the neutral oklch tokens, the `.dark` block, chart/sidebar tokens and Geist.
  - Keep `@import "shadcn/tailwind.css"`.
  - Map the shadcn semantics: `--background: ivory`, `--foreground: espresso`, `--primary: espresso`, `--primary-foreground: ivory`, `--secondary: champagne`, `--secondary-foreground: espresso`, `--muted: #EBDDC4` (ivory/espresso 6%), `--muted-foreground: cocoa`, `--accent: champagne`, `--accent-foreground: espresso`, `--border` and `--input` = line-light, `--ring: taupe`, `--destructive: #9B3B2A`, `--radius: 4px`. Inside `[data-tone=dark]`, remap to espresso/ivory/champagne/line-dark.
  - Type scale per the brief:
    - Display: `clamp(3rem, 10.5vw, 11.5rem)`, lh 0.9; AR lh 1.18.
    - H1: `clamp(2.2rem, 5.2vw, 4.4rem)`.
    - H2: `clamp(1.375rem, 2.4vw, 2rem)`.
    - Lead: `clamp(1.0625rem, 1.4vw, 1.25rem)`.
    - Body: 16px/1.6.
    - Eyebrow: 11.5px, 500, +0.32em, uppercase.
    - AR: `html[lang=ar]` sets body 17px and zeroes letter-spacing and text-transform on every scale class.
    - `text-wrap: balance` on h1–h3.
  - `:focus-visible` is a 2px taupe outline with a 3px offset. `::selection` is champagne on espresso.
- [x] **Step 5:** `npm run build && npm run lint && npm run typecheck` → all pass. (The template page is still in place; it is removed in Task 2.)
- [x] **Step 6:** Commit `feat(tokens): brand design tokens, type scale, motion tokens, test tooling`.

### Task 2: i18n wiring

**Files:**
- Create: `src/i18n/{routing,navigation,request}.ts`, `src/proxy.ts`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` (temporary: an H1 from `messages`), `src/app/[locale]/not-found.tsx`, `src/components/providers/direction-provider.tsx`, `src/messages/messages.test.ts`
- Modify: `next.config.ts` (wrap with `createNextIntlPlugin("./src/i18n/request.ts")`), `src/messages/{en,ar}.json` (namespaces `meta`, `nav`, `header`, `megaMenu`, `mobileMenu`, `whatsapp`, `hero`, `hud`, `common`; shell copy written with `design:ux-copy`)
- Delete: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[locale]/.gitkeep`

**Interfaces:**
- Produces: `routing` (`locales: ["en","ar"] as const`, `defaultLocale: "en"`, `localePrefix: "always"`); `type AppLocale = (typeof routing.locales)[number]`; `isRtl(locale: AppLocale): boolean`; `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`. The layout sets `<html lang={locale} dir={isRtl ? "rtl" : "ltr"}>`, puts both font variables on `<html>`, and wraps children in `NextIntlClientProvider` and `<DirectionProvider direction>` (from `@base-ui/react/direction-provider`). It exports `generateStaticParams` → `[{locale:"en"},{locale:"ar"}]` and `generateMetadata` with `alternates.languages` {en, ar, x-default → /en}.

- [x] **Step 1:** Write `messages.test.ts`. It asserts that the deep key sets of `en.json` and `ar.json` are identical, that no value is an empty string, and that no AR value contains Latin letters other than the allow-list (`NO TIME`, `SEO`, `QR`, `AI`, `TC`, `WhatsApp`, `{{TODO}}`, `N`, `E`, digits). Run → FAIL.
- [x] **Step 2:** Implement routing, navigation, the `next/root-params` request config, proxy (`matcher: "/((?!api|_next|_vercel|.*\\..*).*)"`), the layout, and the shell message namespaces in EN then AR. Run `npm test` → PASS.
- [x] **Step 3 (spike gate for decision A):** run `npm run build`. Expected: `/en` and `/ar` listed as prerendered (○ or ◐), and no "Uncached data accessed outside `<Suspense>`" error. If root-params fails, apply the fallback from decision A and log it.
- [x] **Step 4:** `npm run dev`. `/` redirects to `/en`; `/ar` has `<html lang="ar" dir="rtl">`; `/fr` returns 404.
- [x] **Step 5:** Commit `feat(i18n): next-intl routing via root-params, RTL, direction provider`. Remove OPEN_QUESTIONS #7, #8 and #9 and log the answers in DECISIONS.

### Task 3: Content system and image slots

**Files:**
- Create: `src/content/{types,categories,services,products,images,index}.ts`, `src/content/content.test.ts`, `src/config/contact.ts`, `src/lib/{roman,whatsapp}.ts` + `.test.ts`
- Create: `src/components/ui/{brand-image,ai-placeholder}.tsx`

**Interfaces:**
```ts
type Localized<T> = { en: T; ar: T };
type CategorySlug = "events-hospitality" | "creative-production" | "marketing-brand" | "production-print-gifts" | "software-digital";
type ImageSlotId = string; // e.g. "cat-events-4x5", "hero-fallback-16x9"
interface ImageSlot { id: ImageSlotId; kind: "ai" | "real"; aspect: "4:5" | "16:9" | "9:16" | "1:1";
  src: string | null; /* TODO: replace placeholder when null */ paint: "event"|"table"|"studio"|"print"|"code"|"brand";
  alt: Localized<string>; illustrative: boolean; }
interface Category { slug: CategorySlug; order: 1|2|3|4|5; title: Localized<string>; summary: Localized<string>;
  image: ImageSlotId; imageWide: ImageSlotId; }
interface Service { slug: string; category: CategorySlug; order: number; title: Localized<string>;
  summary: Localized<string>; image: ImageSlotId; imageAlt: Localized<string>; status: "draft" | "approved"; }
interface Product { slug: "qr-check-in" | "restaurant-system"; status: "comingSoon" | "live";
  name: Localized<string>; /* TODO: names TBD */ summary: Localized<string>; image: ImageSlotId; }
// index.ts
getCategories(): Category[]; getCategory(slug): Category | undefined;
getServices(category?: CategorySlug): Service[]; getProducts(): Product[]; getImageSlot(id): ImageSlot;
// lib
toRoman(n: number): string;                       // 1→"I" … 5→"V"; throws outside 1..39
whatsappHref(number: string, text?: string): string | null;  // null when number is empty
```
- `contact` default export: `{ email: "", whatsapp: "", instagram: "", facebook: "" }`. Each field carries `// TODO: replace placeholder`. `whatsapp` falls back to `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""`.
- `<BrandImage slot locale sizes priority?>` renders `next/image` (AVIF/WebP, `placeholder="blur"` when a blurDataURL is known, otherwise lazy). When `src === null`, it renders `<AiPlaceholder paint>` instead: a CSS gradient plus a soft bokeh SVG and the tag `common.aiPlaceholder` ("AI image · placeholder" / "صورة AI · مؤقتة"). If `illustrative`, it also shows the badge `common.illustrative`.

- [x] **Step 1:** Write `content.test.ts`:
  - 5 categories with orders 1–5.
  - Exactly 30 services, 6 per category.
  - Unique slugs; slugs match `/^[a-z0-9-]+$/`.
  - Every `title`/`summary`/`imageAlt` is non-empty in both locales.
  - Every `image` resolves via `getImageSlot`.
  - 2 products, both `comingSoon`.
  - All services are `status: "draft"` while `services-list.md` is TODO.
- [x] **Step 2:** Write `roman.test.ts` (`toRoman(4) === "IV"`, throws on 0) and `whatsapp.test.ts`:
  - `whatsappHref("", "x") === null`
  - `whatsappHref("+971 50 123 4567", "Hi")` → `"https://wa.me/971501234567?text=Hi"`
  - The `+971…` number is a test fixture, not site data.
- [x] **Step 3:** Run → FAIL. Then implement. Service and category copy comes from the prototype's `CATS` draft list (6 × 5), with `// TODO: replace with approved list` at the top of `services.ts`. Categories IV and V map to the `print` and `code` paints. Run → PASS.
- [x] **Step 4:** Add OPEN_QUESTIONS entry #11, "Services list still uses the prototype draft; approve or replace". Add CONTENT_CHECKLIST rows: approved services list, product names, contact fields.
- [x] **Step 5:** Commit `feat(content): typed categories, services, products, image slots, contact config`.

### Task 4: Motion infrastructure and primitives

Invoke `frontend-design` and then `ui-ux-pro-max` before the primitives, and `framer-motion-animator` for `Magnetic`.

**Files:**
- Create: `src/lib/gsap.ts`, `src/hooks/{use-reduced-motion,use-split-text}.ts`, `src/components/providers/{lenis-provider,tone-controller}.tsx`, `src/components/motion/{reveal-words,mask-reveal,parallax,scrub-color-words,magnetic,marquee}.tsx`
- Modify: `src/app/[locale]/layout.tsx` (mount providers; inline head script `document.documentElement.dataset.js=""; if(matchMedia("(prefers-reduced-motion: reduce)").matches) document.documentElement.dataset.reduced=""`)

**Interfaces:**
- `lib/gsap.ts`: `"use client"`. Registers `ScrollTrigger`, `SplitText` and `useGSAP` once, guarded by a module flag. Exports `{ gsap, ScrollTrigger, SplitText, useGSAP }`.
- `useReducedMotion(): boolean`: subscribes to the media query and is SSR-safe (initial `false`, but CSS already shows the final state via `[data-reduced]`).
- `useSplitText(ref: RefObject<HTMLElement>, opts: { locale: AppLocale; onSplit: (s: SplitText) => gsap.core.Animation | void; mask?: boolean }): void`. It uses `type: "chars,words"` for EN and `"words"` for AR, with `autoSplit: true`, `aria: "auto"`, and reverts on unmount and on locale change.
- `LenisProvider` sets up Lenis `{ duration: 1.15, easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)) }`.
  - Driven by `gsap.ticker.add(t => lenis.raf(t * 1000))` with `gsap.ticker.lagSmoothing(0)`, and `lenis.on("scroll", ScrollTrigger.update)`.
  - Not created when reduced motion is on.
  - Exposes `useLenis(): { stop(): void; start(): void; scrollTo(target, opts) } | null`.
  - Honors `data-lenis-prevent`.
- `ToneController` follows decision F. It sets `#stage` background via `--page-bg` and writes `data-header-tone` ∈ `"hero" | "dark" | "light"` on `#site-header`.
- Primitives. All are client components that render their children server-visible. Under `[data-reduced]` or without JS, they show the final state.
  - `RevealWords({ children, as?, delay? })`: words rise from `yPercent: 110` in a mask, 0.8s power3.out, stagger 0.06; triggered at `top 80%`, once.
  - `MaskReveal({ children, from?: "start" | "end" })`: clip-path inset, 1.2s expo.inOut. `start` resolves to `inset(0 100% 0 0)` in LTR and `inset(0 0 0 100%)` in RTL.
  - `Parallax({ children, amount = 12 })`: scrubbed `yPercent: -amount → amount`.
  - `ScrubColorWords({ text })`: words go from `rgba(234,212,171,.3)` to `#F5E9D3`, scrub, `top 80%` → `bottom 45%`.
  - `Magnetic({ children, strength = 0.35 })`: Motion `useMotionValue` + `animate` with `microTransition` (0.5s expo.out per the reference). Pointer-fine only.
  - `Marquee({ items, durationSec = 50 })`: CSS keyframes `mq` and `mq-rtl`; the list is duplicated for the loop and the duplicate is `aria-hidden`; pauses on hover; static under reduced motion.
  - Each primitive exposes `replay()` through a ref, for the styleguide demos.

- [x] **Step 1:** Implement `lib/gsap.ts`, the hooks and the providers. Verify in `npm run dev` that a test page scrolls smoothly, `ScrollTrigger.getAll()` stays stable across a locale toggle (no growth), and with OS reduced motion on, `window.lenis` is undefined.
- [x] **Step 2:** Implement the six primitives. Each is mounted temporarily on the dev page and checked in EN and AR (MaskReveal and Marquee visibly reverse in AR).
- [x] **Step 3:** `npm run build && npm run lint && npm run typecheck` → pass. Commit `feat(motion): lenis+gsap sync, tone controller, split text hook, motion primitives`.

### Task 5: Header, logo, language toggle

Invoke `frontend-design`, then `ui-ux-pro-max` (touch targets ≥ 44px, focus states). Use `framer-motion-animator` for button micro-states.

**Files:** create `src/components/layout/{site-header,logo,lang-toggle}.tsx`, `src/components/ui/button.tsx`.

**Interfaces:**
- `<SiteHeader locale />` (server component): outer `<div data-header-shell>` (GSAP fades it during the intro) > `<header id="site-header" data-header-tone="hero">`, fixed, 68px, below a safe-area top strip.
  - Nav order: Services (mega trigger, from Task 6), Work, Digital Solutions, About, Contact. Links point to `/[locale]/#…` anchors until the pages exist, each marked TODO.
  - CTA "Request a quote" shown only at ≥ 1100px.
  - The burger (Task 7) is shown below 900px.
- Tone styles via `[data-header-tone=light]` (ivory/86% + blur + line-light) and `=dark` (espresso/82% + blur + line-dark). The menu-open state forces espresso.
- `<Logo />`: "NO TIME" in 600 weight with +0.28em tracking, over "CREATIVE HOUSE" in 300 weight with +0.42em tracking at 0.56rem, uppercase, and `aria-label` from messages. The lockup stays Latin in AR (brand name).
- `<LangToggle />` (client): two `Link`s with the current `usePathname()` and `locale="en" | "ar"`, labels "EN" and "ع", `aria-current` on the active one, `hrefLang` and `lang` attributes on each, and a group `aria-label` from messages.
- `<Button variant="primary" | "ghost" | "dark" size="md" | "sm" asChild?>`, built on cva:
  - Hover is an ivory fill `scaleY(0 → 1)` from the bottom, over 0.5s expo.out (CSS).
  - The arrow child slides 5px on hover and is mirrored in RTL via `rtl:-scale-x-100`.

- [x] **Step 1:** Build the components. Check `/en` → toggle → `/ar` at the same path, focus visible on each control, tab order logical in RTL.
- [x] **Step 2:** lint/typecheck/build pass → commit `feat(shell): header, logo lockup, language toggle, button`.

### Task 6: Mega menu

Use `frontend-design`, then `ui-ux-pro-max`, then `framer-motion-animator`. Pure logic goes through TDD.

**Files:** create `src/lib/menu-reducer.ts` + `.test.ts`, `src/hooks/use-mega-menu.ts`, `src/components/layout/mega-menu.tsx`, `e2e/mega-keyboard.spec.ts`.

**Interfaces:**
```ts
type MenuState = { open: boolean; active: CategorySlug; openedAt: number };
type MenuEvent =
  | { type: "INTENT_OPEN"; now: number }      // fired by hook after 90ms hover
  | { type: "CLICK_TRIGGER"; now: number }    // toggles; ignores close within 450ms of an intent open
  | { type: "CLOSE" }                         // 240ms leave timer, Esc, outside click, focus leaving panel, link click
  | { type: "SET_ACTIVE"; slug: CategorySlug };
menuReducer(state: MenuState, e: MenuEvent): MenuState;
useMegaMenu(): { state; triggerProps; panelProps; categoryProps(slug); close(returnFocus?: boolean) };
```
- [x] **Step 1:** Write the reducer tests:
  - `INTENT_OPEN` opens and stores `now`.
  - `CLICK_TRIGGER` at `openedAt + 200` stays open.
  - `CLICK_TRIGGER` at `openedAt + 600` closes.
  - `CLOSE` keeps `active`.
  - `SET_ACTIVE` while closed only changes `active`.
  - Run → FAIL → implement → PASS.
- [x] **Step 2:** Write `use-mega-menu`. Hover open is delayed 90ms (pointer-fine only), and leaving the header closes after 240ms. Also handle:
  - Esc closes and refocuses the trigger.
  - `focusout` closes when `relatedTarget` is outside the header.
  - Backdrop click closes.
  - Resize below 900px closes.
  - Trigger attributes: `aria-expanded`, `aria-controls="mega-panel"`.
- [x] **Step 3:** Build `MegaMenu`, an espresso panel that is full width under the header.
  - Grid `4fr 5fr 3fr`; max-height `calc(100dvh - 68px)`; `data-lenis-prevent`.
  - **Column 1:** eyebrow, "One house. **Five crafts.**", intro, then the category list. Each row shows the `toRoman(order)` numeral, the title, and an arrow that flips in RTL. The active row is indented (`ps-2.5`), weight 500, and `aria-current="true"`. Categories activate on hover or focus.
  - **Column 2:** a count line (`{count} services · {numeral}`) with a "View category" link, then 2 columns of services.
  - **Column 3:** a 4:5 `BrandImage` plus the summary line.
  - **Footer strip:** "In development" with the two products and a `Coming soon` badge each, and "All 30 services →".
  - **Motion:** the panel opens with `clipPath inset(0 0 100% 0) → inset(0 0 0% 0)` over 0.75s `ease.expoOut` and closes over 0.45s. Items stagger at 0.04s. When the category changes, services swap with `AnimatePresence mode="popLayout"`: y 10 → 0, stagger 0.035. The backdrop is `fixed inset-0` with `rgba(30,20,14,.55)` and a 3px blur.
  - Reduced motion: no animation.
  - All data comes from the `@/content` getters.
- [x] **Step 4:** Write `e2e/mega-keyboard.spec.ts` (desktop project). Steps and expected results:
  - Focus the trigger, press Enter → `aria-expanded=true`.
  - Tab → the first category is focused, and the services column shows that category.
  - ArrowDown/Tab to category III → the services update.
  - Esc → the panel is hidden and the trigger is focused.
  - Reopen, then Shift+Tab from the trigger's first focusable → closed.
  - Repeat on `/ar`.
  Run `npm run e2e -- mega-keyboard` → PASS.
- [x] **Step 5:** Commit `feat(shell): data-driven mega menu with intent timing and keyboard support`.

### Task 7: Mobile menu

**Files:** create `src/components/layout/mobile-menu.tsx`. Modify `site-header.tsx` (burger).

**Interfaces:**
- The burger is 44×44 with 2 bars that cross into an X over 0.45s expo.out (CSS on `aria-expanded`), `aria-controls="mobile-nav"`, and a label from messages.
- The overlay is espresso, `fixed`, `inset-block-start: calc(68px + safe-area)`, `inset-inline: 0`, `inset-block-end: 0`, with `data-lenis-prevent` and `overscroll-behavior: contain`.
  - It opens with a Motion clip-path reveal (0.7s); items stagger at 0.045s with y 22 → 0.
  - While it is open, `useLenis()?.stop()` runs and `<html>` gets `overflow: hidden`.
  - Esc closes it and refocuses the burger; a link click closes it; focus stays inside the overlay while open (`inert` on `<main>`/footer).
- Contents, in order:
  - A "Services" eyebrow, then 5 category accordions. Each is a native `<details>`/`<summary>` with the roman numeral and a "+" that rotates 45°; the height is animated by Motion on an inner wrapper.
  - Big links: Work, Digital Solutions, About, Contact.
  - The product strip.
  - The full-width quote CTA.

- [x] **Step 1:** Build it. Check at 390px in EN and AR: all items reachable by keyboard, the background does not scroll, and the accordion works without JS (native details).
- [x] **Step 2:** Commit `feat(shell): mobile menu with accordions and scroll lock`.

### Task 8: WhatsApp button, custom cursor, footer stub, overflow guard

**Files:**
- Create: `src/components/layout/{whatsapp-button,custom-cursor,site-footer}.tsx`, `e2e/overflow.spec.ts`, `scripts/shots.mjs`

**Interfaces:**
- `<WhatsAppButton />`: 56px champagne circle at `inset-inline-end: calc(20px + safe-area)`, `inset-block-end: calc(20px + safe-area-bottom)`, z 55.
  - With `whatsappHref(contact.whatsapp)` it is an `<a target="_blank" rel="noopener">` with a prefilled `whatsapp.prefill` message.
  - When the href is `null`, it is a `<button aria-describedby>` with a tooltip `whatsapp.pending` ("WhatsApp · number pending") shown on hover, focus and tap, marked `// TODO: replace placeholder`.
  - The hover scale (1.06) uses Motion.
- `<CustomCursor />`: mounted only when `matchMedia("(hover: hover) and (pointer: fine)")` matches and reduced motion is off.
  - A 10px champagne dot with `mix-blend-mode: difference`.
  - Position follows the pointer through Motion values with a 0.35s tween.
  - Size grows to 64px over `a, button, [data-cursor], img, video` (detected with `pointerover` delegation).
  - `aria-hidden`.
- `<SiteFooter />`: a dark stub with the logo, `© {year} NO TIME Creative House`, and a `footer.stub` TODO line. The year comes from a server `new Date()` and is cached (cacheComponents safe via `"use cache"`, or rendered statically at build).
- `scripts/shots.mjs [label]`: uses `@playwright/test`'s `chromium.launch({ channel: "chrome" })` against `http://localhost:3100`. It writes `docs/checkpoints/<label>/{en,ar}-{1440,390}[-reduced].png`, and with `--hero` also writes, per locale and width, `hero-{locale}-{width}-intro-end.png`, `-scroll-split.png` and `-scroll-beat.png`, plus `cold-first-visit-en-1440.png` and the recording as `hero.webm` (VP9 via Chrome's MediaRecorder) and `hero.webp` (animated WebP via sharp), both from CDP screencast frames (Playwright's `recordVideo` needs an ffmpeg download, not allowed).

- [x] **Step 1:** Write `e2e/overflow.spec.ts`. For `/en` and `/ar` at 360×780, with the menu closed and then open, assert `document.documentElement.scrollWidth <= innerWidth`. Run → PASS once the shell is complete.
- [x] **Step 2:** Run `superpowers:verification-before-completion`. Then build, lint, typecheck, test and e2e; then `node scripts/shots.mjs checkpoint-2` with reduced motion on and off.
- [x] **Step 3:** Run `/simplify` within its guardrails. Commit `feat(shell): whatsapp button, cursor, footer stub, overflow guard`.

---

## CHECKPOINT 2: send screenshots of the shell at 1440px and 390px, in EN and AR. Stop.

---

### Task 9: Hero, static layers (visible at rest)

Invoke `frontend-design` and `ui-ux-pro-max` first.

**Files:**
- Create: `src/components/sections/hero/{hero,hero-clock,hero-hud}.tsx`, `src/lib/time.ts` + `.test.ts`, `src/lib/hero-math.ts` + `.test.ts`, `e2e/no-js.spec.ts`
- Modify: `src/app/[locale]/page.tsx` (Hero, then a light stub `<section data-tone="light">` of 100svh with `{/* TODO: replace placeholder — About section, Phase 2 */}` and no visible copy)

**Interfaces:**
```ts
formatTimecode(elapsedMs: number, fps = 24): string;  // 0 → "TC 00:00:00:00"; 61_500 → "TC 00:01:01:12"; 3_600_000 → "TC 01:00:00:00"
secondHandAngle(d: Date): number;                    // seconds+ms * 6 → 0..360; 15.5s → 93
tickGeometry(i: number): { x1; y1; x2; y2; major: boolean }; // r1=284, r2=262 major / 274 minor, centre 300, i%5===0 major
particleCount(w: number, h: number): number;          // round(clamp(70, 170, w*h/8500)); 390×844 → 70 (38.7 clamps up); 1440×900 → 152; 2560×1440 → 170
```
- `<Hero locale />` (server component): `<section id="hero" data-tone="dark" data-header="hero">`.
  - Height `100svh`, min 620px.
  - The background uses the static radial espresso-to-night gradient in CSS, so the frame is complete without the canvas.
  - Layer order and z-index follow the brief, layers 1–9, with the HUD content per the brief.
  - The `<h1>` holds two `<span class="line">` lines ("IT'S TIME" at 200 ivory; **TO CREATE.** at 600 champagne) and has a real accessible name.
  - The second beat is a `<p>` that is `aria-hidden` (decorative repeat). Its content is also present for screen readers via `hero.beatSr` in visually hidden text.
  - The timecode element is `dir="ltr"`, using `tabular-nums`.
- `<HeroClock />` (server component): SVG with viewBox 600, `ring` (r284, `pathLength=1`), dotted `ring2` (r252, dasharray `1 7`), 60 ticks via `tickGeometry`, `hand` (300,332 → 300,30), and the hub. Size `min(76vmin, 700px)`.
- CSS for pre-intro states (shutters shown, chars down, beat words hidden) is gated under `html[data-js]:not([data-reduced]) [data-hero-intro]`, so it is removed once the intro runs.

- [x] **Step 1:** Write `time.test.ts` and `hero-math.test.ts` with the exact values above → FAIL → implement → PASS.
- [x] **Step 2:** Build the static hero.
- [x] **Step 3:** Write `e2e/no-js.spec.ts` (`javaScriptEnabled: false`). On `/en` and `/ar`, the `h1` is visible with a non-zero bounding box, the shutters are not visible, and the CTA link is visible and has an `href`. → PASS.
- [x] **Step 4:** Commit `feat(hero): static cinematic frame, clock, HUD, pure time math`.

### Task 10: HeroScene canvas

**Files:** create `src/components/sections/hero/{hero-scene.tsx,scene-state.ts}`.

**Interfaces:**
- `scene-state.ts`: `export type SceneState = { alpha: number; speed: number; spread: number; handIntro: number; pointer: { x: number; y: number } }`, `createSceneState(): SceneState` (alpha 1, speed 1, spread 1, handIntro 1). The state object is created in `Hero`'s client controller and shared by reference with the canvas, the clock hand and GSAP.
- `<HeroScene state={SceneState} handRef timecodeRef />`, loaded with `next/dynamic` (`ssr: false`).
  - **Scene:** a radial background (`#5c412b` → `#2E2017` @0.42 → `#120c07`), 4 rays (prototype maths), and particles from `particleCount`. Particles are in 3 depth bands: dust z < 0.5, mid, and bokeh z > 0.82. They drift upward; the mouse parallax is `8 + z*70` px.
  - **Flare (elevation):** a wide, low-alpha horizontal champagne streak sprite where rays meet the top, alpha ≤ 0.06, sway-synced.
  - **Per frame:** writes the hand transform `rotate(secondHandAngle(now) * handIntro)` and the timecode text (only when changed).
  - **Performance:**
    - DPR is `Math.min(devicePixelRatio, 2)`.
    - Below 900px wide, DPR is capped at 1.5 and the bokeh count halved; this is a measured perf lever, logged in DECISIONS.
    - The IntersectionObserver pauses rAF when off-screen, and `visibilitychange` pauses it when the tab is hidden.
    - Resize is debounced (150 ms). Resize only re-seeds when the particle count changes by more than 10%, otherwise it rescales positions.
  - **Reduced motion:** one draw, then the hand and timecode update once per second through `setInterval`, and nothing else moves.

- [x] **Step 1:** Build it. Profile in Chrome DevTools with the Performance panel, 4× CPU throttle, 390px: hold a steady frame rate (target ≥ 50 fps) and record the result in the plan's notes. On desktop, no long tasks over 50 ms after the intro.
- [x] **Step 2:** Commit `feat(hero): canvas atmosphere with depth particles, rays, flare, perf guards`.

**Notes (Task 10 profile, 2026-11-07, production build, Playwright + installed Chrome, rAF sampling):**
- Pixel 7 (412×839, DPR 2.625 → backing scale 1.5, 618×1259), 4× CPU throttle: EN 60 fps, AR 52 fps. Target ≥ 50 met.
- Desktop 1440×900 on an Intel HD 5500: before the D39 changes 31–38 fps, with long tasks of 50–79 ms (EN); after them 45–53 fps and no long tasks. Hiding the canvas gives 60, so the canvas is the whole cost (fill rate).
- The canvas pauses while the menu is open (0 timecode writes in 1.5 s), resumes on close (36–37 writes), and pauses off-screen (0 writes).
- Numbers are noisy on this shared machine (the user's Chrome was running); calm runs are quoted.
- Found: the line masks clipped the title text-shadow into boxes; fixed (D39).
- Found: `display: optional` falls back on most cold loads; re-decided in Task 11 (D38 amendment).


### Task 11: Hero intro and scroll timelines

**Added 2026-11-07, fonts (D38 amendment):** decide `optional` vs `swap`. Candidate: `swap`, with the first-visit intro revealing the title after `document.fonts.ready` (with a timeout) so the swap happens behind the shutters. Repeat visits have the font cached. Verify with `cls.spec.ts` and with cold-load face checks (`fontcheck`: title width per face) on `/en` and `/ar`.

Use `gsap-framer-scroll-animation` for the ScrollTrigger pin.

**Files:** create `src/components/sections/hero/hero-controller.tsx`, `e2e/locale-switch.spec.ts`, `e2e/hero-resize.spec.ts`.

**Interfaces:**
- `<HeroController locale />` is a client component holding `useGSAP` with `scope = #hero` and `dependencies: [locale]`.
- **Intro** (first page load per session only, via `sessionStorage["nt-intro"]`; total about 3s). The first-load check also requires `history.state` not to be from a client navigation.
  | Time | Step |
  |---|---|
  | 0 | Header shell `autoAlpha` 0 |
  | 0.15 | Shutters top `yPercent -101` and bottom `+101`, 1.7s expo.inOut |
  | 0.30 | `scene.alpha` 0 → 1, 2.6s power2.out |
  | 0.55 | Ring `strokeDashoffset` 1 → 0, 2.4s power3.inOut |
  | 0.80 | Ticks `autoAlpha`, stagger 0.014 |
  | 0.70 | `scene.handIntro` 0 → 1, 2.6s power3.inOut |
  | 1.15 | Title split: chars (EN) or words (AR) from `yPercent 118, rotate 5` → 0, 1.5s expo.out, stagger 0.045 (EN) / 0.11 (AR) |
  | 1.90 | Lead and CTA y 26 → 0, 1.1s, stagger 0.12 |
  | 2.10 | HUD items and header shell fade in |

  On a later locale change, only the title replays (`yPercent 115 → 0`, 1.1s).
- **Scroll** (`pin: true`, `start: "top top"`, `end: "+=140%"`, `scrub: 1`, `anticipatePin: 1`, `invalidateOnRefresh: true`). Let `dir = locale === "ar" ? -1 : 1`.
  | Time | Step |
  |---|---|
  | 0 | Line 1 `xPercent -38*dir`, line 2 `+38*dir`, both fade, power2.in |
  | 0 | **Focus pull (elevation):** `filter: blur(0 → 6px)` on the title wrapper only, last 40% of its tween; skipped below 900px |
  | 0 | Lead and CTA y -50, fade over 0.6 |
  | 0 | Clock `scale 2.9`, fade over 1.25 |
  | 0 | `scene` `spread 2.5`, `speed 8` over 1.2 |
  | 0 | HUD fades over 0.4 |
  | 0.25 | Letterbox top `yPercent -100` and bottom `+100`, 0.8 |
  | 0.95 | Beat words from `yPercent 110` → 0, stagger 0.09 |
  | 1.20 | `scene` `speed 1.4`, `spread 1.7` |
  | 1.80 | Beat `y -30` |
- On release, `ToneController` tweens the page to ivory when the light stub crosses 55%.
- Use `ScrollTrigger.config({ ignoreMobileResize: true })`, height `100svh`, and `ScrollTrigger.refresh()` after `document.fonts.ready`.
- **Reduced motion:** no pin and no intro; the static frame from Task 9 is the final state, and the beat is visible below the title.

- [x] **Step 1:** Implement the intro and verify it visually in EN and AR.
- [x] **Step 2:** Implement the scroll timeline. In AR, line 1 exits to the right and line 2 to the left.
- [x] **Step 3:** Write `e2e/locale-switch.spec.ts`:
  - Scroll to 50% of the pin and toggle the language.
  - Expect `document.querySelectorAll(".pin-spacer").length === 1`, the title to have no leftover split spans from the other locale (SplitText reverted), and the URL to be `/ar`.
  - Open the mega menu, toggle the language, and expect it to be closed.
  Write `e2e/hero-resize.spec.ts`: at 390×844 mid-pin, resize to 390×700 and then 844×390. Expect no page error, the pin spacer height to equal `innerHeight * 2.4 ± 2px`, and the canvas size to match its box. Run → PASS.
- [ ] **Step 4 (LCP rule, approved):** the largest text element must paint at first render and is **never at opacity 0**. Below 900px the title reveal starts at t = 0, with the masked rise only and no opacity fade. The lead is visible from frame one, so the intro animates its `y` only. The shutters sit over the hero during the intro, so identify the actual LCP element in the Lighthouse trace and confirm its paint is not deferred by them. If it is, the mobile shutters become a clip-path on the letterbox and do not cover the text. Run `npx lighthouse http://localhost:3100/{en,ar} --form-factor=mobile` 3× each: LCP < 2.5s and CLS 0. Log the median and the LCP element in DECISIONS.
- [ ] **Step 5:** Run `verification-before-completion`, then `node scripts/shots.mjs checkpoint-3 --hero`, then `/simplify`, then commit `feat(hero): intro and pinned scroll timelines, RTL-mirrored split, focus pull`.

**Status 2026-11-07 (session 2):** Step 4 done. The mobile title is still from first paint (D43); the TBT deferrals are in (D44); Lighthouse medians are in `docs/checkpoints/lighthouse/{baseline,after,final}/summary.json`. Simulated LCP on cold loads is still ~4 s (observed: the still title at ~1.1–1.7 s). The trace findings are handed to Task 16 (see its Step 2). Step 5 follows.

**Status at the session handoff (2026-11-07):** Steps 1-3 done and committed in `chore: session handoff` (intro, scroll timeline, locale-switch, hero-resize and hero-intro specs, ToneController numeric zones D41, late-hydration path). Still to do:
- Step 4: run Lighthouse (`node scripts/lighthouse.mjs http://localhost:3100 docs/checkpoints/lighthouse`) 3x per locale on a quiet machine; log the median, LCP element and CLS in DECISIONS (D38 amendment / new row).
- Step 5: re-capture `node scripts/shots.mjs checkpoint-3 --hero` (the committed beat frames predate the header-tone fix), run `/simplify`, commit `feat(hero): ...polish` if anything changes.
- Then the CHECKPOINT 3 report (in Arabic), including the OPEN_QUESTIONS #14 font decision. The recording exists twice, from the same CDP screencast frames: `hero.webm` (VP9, encoded by Chrome's MediaRecorder) and `hero.webp` (animated WebP via sharp). Playwright's own `recordVideo` is not used, because it needs an ffmpeg download, which is not allowed.

---

## CHECKPOINT 3: send the hero intro end state, the mid-scroll state, and the recording (`hero.webm` + `hero.webp`). Stop.

Added 2026-11-06 for checkpoint 3: intro screenshots at 1440 and 390 in EN and AR, the reduced-motion static frame, measured mobile LCP element and time for `/en` and `/ar`. Extra hero requirements from that message: intro once per session (`sessionStorage`); skippable (scroll, key, click → `tl.progress(1)`); header stays focusable during the intro and tabbing into it finishes the intro; canvas pauses while any menu is open (`html[data-overlay-open]`), off-screen or tab hidden; pin uses `svh` + `invalidateOnRefresh` + `ignoreMobileResize`, tested with a real touch scroll at 390px.

---

### Task 11b (added 2026-11-06): profile extraction and content inventory

Source: `docs/brand/company-profile-2026.pdf` (38 pages), the client's official 2026 profile and the primary content source (replaces the old profile). Runs after the hero, before the copy deck (checkpoint 4). Full instructions are in the user's message of 2026-11-06. Summary:

1. Extract the embedded images at native resolution (image objects, not page screenshots) to `public/images/work/raw/p{page}-{n}.{ext}`. Skip pages 34–36 (influencer network) and page 20 (media logos). Requested tool: Python + PyMuPDF. Check the interpreter first, because the `python` on PATH is the Windows Store stub.
2. `docs/content/profile-inventory.md`: one row per image with page/section, client/project, pixel size + quality, identifiable people, AI-generated (page 14 is "Produced with AI"), stock (the page 3 About photo is stock: never use it), proposed slot. Curate the good, relevant images into `public/images/work/<project-slug>/` as AVIF/WebP.
3. `docs/content/profile-copy.md`: the text verbatim, by page.
4. Real projects for Our Work (Challenge → Idea → Execution → Result, `{{TODO}}` where the profile doesn't support it): UAE Pro League; UAE Athletics Federation (incl. Oregon 26: 487K views, +37.6K followers, 271K reach in the first week); EgyptAir pavilion; Ultimate Power Solution; Smith Gulf; Sandoz; private celebrations & heritage (no client names).
5. Verified figures only: 6 markets; 360° integrated; the Oregon 26 figures. Never "49+ talent network".
6. `docs/content/services-reconciliation.md` (profile vs draft vs `services-list.md`). Do not change `services.ts` until the user confirms.
7. Hero variant with the official line "IT'S TIME TO START." plus an OPEN_QUESTIONS entry (being confirmed with the client).
8. OPEN_QUESTIONS / CONTENT_CHECKLIST: permission for each client name/logo; rights to photos of identifiable people; which page-20 media outlets actually published (show none until confirmed); NO TIME's role in the government portals on the Marketing page.

Report the inventory summary and the reconciliation table at checkpoint 4.

**Status (2026-11-07): done.**

- **Tool:** MuPDF.js instead of PyMuPDF (D47).
- **Skipped pages:** 20, 30 and 34–37. The influencer roster runs to page 37, and pages 30 and 34 are talent booking (D48).
- **Images:** 98 extracted to the gitignored `raw/`; 32 curated by `scripts/curate-profile.mjs`.
- **Docs written:** `profile-inventory.md`, `profile-copy.md`, `services-reconciliation.md`, and `case-studies.md` (step 4).
- **Open questions:** #17–#21 added; checklist rows 15–19.
- **Unchanged:** `services.ts` and `services-list.md`.

---

### Task 12: `/[locale]/styleguide`

**Files:**
- Create: `src/app/[locale]/styleguide/page.tsx`, `src/components/styleguide/{swatches,type-scale,shape-space-grid,motion-demos,category-cards}.tsx`, `src/components/ui/{badge,field}.tsx`
- Modify: `src/messages/*.json` (namespace `styleguide`, ported from the prototype's `T` table and reviewed with `design:ux-copy`), `src/app/sitemap.ts`, `e2e/overflow.spec.ts` (add the styleguide)

**Interfaces:**
- `export const metadata` → `robots: { index: false, follow: false }`. The sitemap does not include `/styleguide`.
- Sections, in order. Tones: light, light, light, dark, light, dark.
  1. **Colour:** 5 swatches with a copy-hex button (`navigator.clipboard`, falling back to selecting the text; toast `role="status"`). The 4 contrast pairs are computed at build time with a `contrastRatio(a,b)` helper in `src/lib/contrast.ts`, tested: espresso/ivory gives 13.1 ± 0.2. My calculation gives about 13.1, not the 13.6 the prototype shows, so the badges display the computed values and never the prototype's numbers.
  2. **Type:** each scale row in EN and AR, plus the font cards.
  3. **Shape, spacing, grid.**
  4. **Motion:** the tokens table plus 4 demos (RevealWords with replay, MaskReveal with replay, Parallax, Magnetic), then ScrubColorWords on the statement, then a Marquee of all 30 services from `getServices()`.
  5. **Components:** buttons (light and dark), badges (Coming soon, Illustrative, Preview), fields with an error state (`aria-invalid`, `aria-describedby`), and the expanding category cards. On desktop, cards expand on hover or focus (CSS flex-grow 0.9s). On mobile, the active card is driven by scroll through a GSAP ScrollTrigger per card (`top 60%`).
  6. **Closing band.**
- [ ] **Step 1:** Write `contrast.test.ts` → FAIL → implement → PASS.
- [ ] **Step 2:** Build the page.
- [ ] **Step 3:** Run e2e overflow for the styleguide in both locales → PASS. Verify the 4 demo replays, RTL mask direction and the marquee direction.
- [ ] **Step 4:** Commit `feat(styleguide): approval page mirroring the reference with real components`.

### Task 13: Homepage copy deck

Invoke `design:ux-copy`.

**Files:** modify `src/messages/{en,ar}.json` (namespaces `about`, `categories`, `work`, `marquee`, `digital`, `process`, `markets`, `cta`, `footer`). Create `docs/content/copy-deck.md`. Modify `docs/CONTENT_CHECKLIST.md`.

- **About:** the scrub statement ("A creative house for events, brands and the ideas in between…" is from the reference), an eyebrow and a short body.
- **Categories:** section heading and CTA labels. Category titles and summaries come from `src/content`.
- **Work:** heading, the Challenge/Idea/Execution/Result labels, the "Illustrative" note, and `{{TODO}}` project slots.
- **Marquee:** an aria label.
- **Digital:** heading, custom-dev intro, 4 capability lines (websites, apps, internal systems, e-commerce), product card labels, "Register interest" and "Request a demo".
- **How we work:** 4 steps, using the verbs plan, build, produce and launch.
- **Markets:** UAE, Saudi Arabia, Egypt, Qatar, Oman and Kuwait, in Arabic country names.
- **CTA:** heading and two buttons.
- **Footer:** columns, legal link labels, and `{{TODO}}` for trade licence details.
- Voice and hard rules as in the brief. The banned phrases list goes into `messages.test.ts`: `elevate`, `cutting-edge`, `one-stop`, `unleash`, and the AR equivalents `الارتقاء بعلامتك`, `متطور جدًا`, `حلول متكاملة شاملة`. Numbers: Western digits in UI and data; Arabic-Indic digits only in editorial lines, consistent within a section.
- `copy-deck.md` has one table per section with the columns key | EN | AR | why this AR phrasing. Every AR line gets a note.

- [ ] **Step 1:** Extend `messages.test.ts` with the banned-phrase check, plus a check that every `{{TODO}}` key is listed in `CONTENT_CHECKLIST.md` (the test reads the file and searches for each key). Run → FAIL.
- [ ] **Step 2:** Write the EN copy, then the AR copy natively, the deck, and the checklist rows. Run → PASS.
- [ ] **Step 3:** Commit `docs(copy): homepage copy deck EN/AR with reviewer notes`.

### Task 14: Image art direction and designed placeholders

**Files:** create `docs/content/image-prompts.md`. Modify `src/content/images.ts` (one slot per prompt entry).

- **Slots, at minimum:**
  - `cat-{slug}-4x5` and `cat-{slug}-16x9` for each of the 5 categories (10 slots).
  - `hero-fallback-16x9` and `hero-fallback-9x16`.
  - `process-{plan,build,produce,launch}-4x5` (4 slots).
  - `product-{qr-check-in,restaurant-system}-16x9` (2 slots).
- **Each entry:** slot id, page and section, aspect ratio, prompt (house style per the brief), the shared negative prompt, alt text in EN and AR, and the delivery spec (2× size, AVIF + WebP, path `public/images/ai/<slot>.{avif,webp}`).
- `public/images/brand/` is empty today, so no real photos are wired. That is noted in the doc and in OPEN_QUESTIONS #3.
- [ ] **Step 1:** Write the doc. Extend `content.test.ts`: every slot id in `images.ts` appears in `image-prompts.md`, and vice versa → PASS.
- [ ] **Step 2:** Verify that every `src: null` slot renders `AiPlaceholder` with its tag on the styleguide and in the mega menu.
- [ ] **Step 3:** Commit `docs(images): AI art-direction prompts per slot, placeholder wiring`.

---

## CHECKPOINT 4: send the copy deck and `image-prompts.md`, before any image generation. Stop.

---

### Task 15: Image generation (only if approved at checkpoint 4)

This session has `Canva generate-image` and `Figma generate_image` MCP tools. If you approve, generate per slot and convert each image to AVIF and WebP at 2× via `sharp` (bundled with Next). Then set `src` and a `blurDataURL` in `images.ts` and confirm that none of them is wired as real project documentation. If you decline, the designed placeholders stay.

### Task 16: Final review

- [ ] **Step 1:** Run `design:accessibility-review`, `wcag-audit-patterns` checks and `design:design-critique` against `/en`, `/ar` and `/en/styleguide`. Fix the findings.
- [ ] **Step 2:** Run mobile Lighthouse for `/en` and `/ar` (3 runs each, median). Targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Save the JSON reports to `docs/checkpoints/lighthouse/`.
  **Input from Checkpoint 3 (trace of a cold mobile load at 4x CPU, 2026-11-07; see D44):** the first frame is painted and committed at ~600 ms but presented only at ~1.4 s. The causes, in order of evidence:
  1. ~~The hero grain's SVG `feTurbulence` image~~ (hiding it moved FCP from ~1.4–1.7 s to ~0.85–1.05 s). **Done after Checkpoint 3 (D45):** the grain is drawn in the hero canvas. The CSS grain on other dark sections (footer, 404) stays: on the home page it made no measurable difference to first paint. The 404 fills the screen with it, so apply the canvas approach there if the 404 ever matters for performance. (Correction: the trace machine composites on its real GPU, ANGLE on the Intel HD 5500, not in software.)
  2. Framework JS evaluated before the frame: `react-dom` + Next app-router client (223 KB raw / 70 KB gz, ~260 ms at 4x) and the RSC client runtime (165 / 45 KB, ~340 ms). Profile hydration and trim client islands.
  3. ~~All three font files are preloaded on both locales.~~ **Done (D45):** one preload per locale.
  4. SEO 92 is the local build only: without `NEXT_PUBLIC_SITE_URL`, the canonical points to `localhost:3000`. Run Step 2 with the variable set.
  5. **AR first-visit TBT (median 2642 ms vs EN 1156 ms at Checkpoint 3).** Checked from the reports: most of the gap is host load (the AR median includes a run at benchmark index 657, TBT 8397). In the quietest pair (index ~1430–1490) AR was 1098 vs EN 996. The remainder is ~30% more style + layout work on AR (median 2866 vs 2166 ms simulated), which points at Arabic text shaping and bidi layout. It is **not** the word split (SplitText is never loaded below 900px, so no split runs in the mobile runs) and was not font bytes (both locales loaded the same three files). Re-check per locale with a trace on the preview build.
  **Measure Step 2 off this machine:** its benchmark index swung from 209 to 1487 between runs, which is too noisy for TBT. Use a Vercel preview with PageSpeed Insights (mobile, 3 runs per locale, median), plus one real-phone check through Chrome remote debugging (cold load, Performance trace, `/en` and `/ar`).
- [ ] **Step 3:** Run every e2e spec in both projects, plus a reduced-motion pass (`reducedMotion: "reduce"`) asserting no `.pin-spacer` and visible beat text.
- [ ] **Step 4:** Grep `src` for `ml-|mr-|pl-|pr-|left-|right-|text-left|text-right` and for raw string literals in JSX. Both must return nothing outside allow-listed geometry (the canvas maths). Grep for `TODO: replace placeholder` and cross-check `CONTENT_CHECKLIST.md`.
- [ ] **Step 5:** Run `superpowers:requesting-code-review` and address the findings. Update `DECISIONS.md` and `OPEN_QUESTIONS.md`. Then run `superpowers:finishing-a-development-branch`.

---

## CHECKPOINT 5: final summary covering what was built, decisions (also in DECISIONS.md), and open questions. Stop.
