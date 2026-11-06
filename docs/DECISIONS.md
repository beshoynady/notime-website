# Decisions Log

Each entry gives the decision and the reason for it. Add new entries at the bottom, with a date.

## Installed versions (setup — 2026-11-06)

Versions were checked with `npm view <pkg> version` on 2026-11-06, then installed. The installed versions below come from `npm ls --depth=0`.

Environment: Node v24.21.0, npm 11.19.0, Windows 10.

### Framework (from `create-next-app@16.4.5`)
| Package | Installed | Latest stable at setup | Note |
|---|---|---|---|
| next | 16.4.5 | 16.4.5 | Next.js 16 confirmed |
| react / react-dom | 19.3.0 | 19.3.1 | Pinned by the create-next-app template; patch bump is safe later |
| typescript | 5.9.3 | 7.0.2 | Template range `^5`; kept for compatibility with Next/ESLint tooling |
| tailwindcss | 4.3.5 | 4.3.5 | |
| @tailwindcss/turbopack | 4.3.5 | — | Template's Tailwind integration for Turbopack |
| eslint | 9.39.5 | 10.14.0 | Template range `^9`; matches `eslint-config-next` |
| eslint-config-next | 16.4.5 | — | |
| @types/node | 20.19.43 | — | Template range `^20` |
| @types/react / @types/react-dom | 19.3.0 | — | |

### Animation
| Package | Installed |
|---|---|
| gsap | 3.15.1 (includes ScrollTrigger and SplitText) |
| @gsap/react | 2.1.2 |
| motion | 14.10.1 |
| lenis | 1.3.27 |

### i18n
| Package | Installed |
|---|---|
| next-intl | 4.14.9 |

### Forms & email
| Package | Installed |
|---|---|
| react-hook-form | 7.91.0 |
| zod | 4.6.7 |
| @hookform/resolvers | 7.0.3 |
| resend | 6.37.0 |
| @react-email/components | 1.0.12 |
| @marsidev/react-turnstile | 1.6.3 |

### UI utilities & components
| Package | Installed | Note |
|---|---|---|
| lucide-react | 1.70.0 | |
| clsx | 2.1.1 | |
| tailwind-merge | 3.7.0 | |
| shadcn | 4.23.0 | Added as a dependency by `shadcn init` |
| @base-ui/react | 1.9.0 | Added by `shadcn init` (base-nova style) |
| class-variance-authority | 0.7.1 | Added by `shadcn init` |
| cn | 0.5.2 | Added by `shadcn init`; `src/lib/utils.ts` re-exports `cn` from it |
| tw-animate-css | 1.4.0 | Added by `shadcn init` |

---

## Setup decisions

| # | Decision | Reason |
|---|---|---|
| D1 | Scaffold with `create-next-app@16.4.5` in the project root: TypeScript, App Router, Tailwind, ESLint, `src/`, alias `@/*`, npm | Matches the required stack. A single repo root keeps Vercel deploys simple. |
| D2 | Keep the template's TypeScript 5 / ESLint 9 / React 19.3.0 instead of forcing the latest majors | The template's ranges are what Next 16.4 is tested with. Jumping to TS 7 / ESLint 10 risks tooling breakage for no benefit at this stage. Revisit later. |
| D3 | `shadcn init --defaults --rtl` (style `base-nova`, Base UI, neutral base colour, CSS variables) | The init was required. `--rtl` because the site is bilingual EN/AR. Defaults avoid design decisions in a setup-only session. Base UI vs. Radix is logged in OPEN_QUESTIONS. |
| D4 | Deleted `src/components/ui/button.tsx` created by `shadcn init` | Session scope: no components yet. It can be re-added with `npx shadcn add button`. |
| D5 | Kept `src/lib/utils.ts` (`cn` helper) and shadcn's `globals.css` theme variables | Part of the init configuration that future shadcn components depend on. Mapping the brand palette into these tokens happens in the design phase. |
| D6 | Kept the template's `next.config.ts` (`cacheComponents`, `partialPrefetching`, Turbopack Tailwind loader) unchanged | Config-only session. Their effect on next-intl is logged in OPEN_QUESTIONS. |
| D7 | Kept the generated `AGENTS.md` (Next.js-managed) and imported it from `CLAUDE.md` | `next dev` rewrites the managed block. Importing it keeps the Next 16 "read the bundled docs" rule in every session. |
| D8 | `.gitignore`: `.env*` ignored, with `!.env.example` re-included | Secrets never committed; the key template is shared. |
| D9 | Empty folders tracked with `.gitkeep`; `src/messages/en.json` and `ar.json` are `{}` | Fixes the structure without writing code. |
| D10 | Did not run `npm audit fix --force` | It can apply breaking major upgrades. The audit is logged in OPEN_QUESTIONS for review. |

## Product & architecture decisions (from the brief)

| # | Decision | Reason |
|---|---|---|
| P1 | Rebuild as a full multi-page corporate site (not a single landing page) | The new brand identity and a 30-service catalogue need dedicated pages and SEO surface. |
| P2 | Locales: `en` default at `/en`, `ar` at `/ar`, with a header toggle; next-intl | Primary markets are bilingual GCC + Egypt. Prefixed routes give clean hreflang/SEO. |
| P3 | Arabic is written natively, not translated literally | A luxury tone needs natural Arabic copy. |
| P4 | Homepage "Hybrid" direction: calm cinematic opening, with motion intensity rising on scroll | Luxury first impression, with the delight further down. Goal: service exploration. |
| P5 | GSAP owns scroll-driven animation; Motion owns hover/click/layout; never both on one element | Prevents conflicting transforms and gives a clear ownership rule. |
| P6 | Lenis for smooth scroll | A smooth, luxurious feel; integrates with ScrollTrigger. |
| P7 | Respect `prefers-reduced-motion`; on mobile, cursor interactions become scroll-driven | Accessibility, and touch devices have no hover. |
| P8 | Tailwind logical properties only; marquees/horizontal scroll reverse in Arabic | Correct RTL without a duplicate stylesheet. |
| P9 | Brand palette (Deep Espresso #2E2017, Cocoa Brown #634731, Warm Taupe #BB9A79, Champagne Beige #EAD4AB, Vanilla Ivory #F5E9D3); Montserrat EN / Alexandria AR | The new brand identity. |
| P10 | 30 services in 5 categories, one data-driven service template | Consistency; adding or editing services needs no new code. |
| P11 | Our Work: real photos first; Challenge → Idea → Execution → Result; AI images for real projects carry an "Illustrative / صورة توضيحية" label | Honesty: never present AI imagery as documentation of real work. |
| P12 | Software & Digital is a strategic priority; 2 "Coming Soon" products with `status: "comingSoon" \| "live"` | Long-term business line. The status flag switches the CTA to "Request a demo" without a redesign. |
| P13 | Missing trust material becomes a placeholder or stays hidden; never faked | No fake claims or reviews. |
| P14 | Forms: Server Actions → Resend (branded email to Rand + confirmation to the client); Turnstile + honeypot; WhatsApp prefilled fallback; no backend/dashboard | Minimal infrastructure and cost with solid spam protection. |
| P15 | Google Sheets submission log: optional, **deferred** (not installed) | A lightweight dashboard if Rand wants one. Not needed for launch. |
| P16 | Legal pages (Privacy, Terms, Cookies) written with the UAE PDPL in mind, listing the processors (Resend, Google, Cloudflare, analytics); legal review before launch | Compliance in the primary jurisdiction. |
| P17 | SEO: bilingual metadata, hreflang, `sitemap.ts`, `robots.ts`, JSON-LD (Organization, LocalBusiness, Service), OG images; speed as an SEO factor | Organic discovery in six markets. |
| P18 | Hosting on Vercel; Vercel Analytics or GA4 behind a cookie consent banner, **deferred** | Native Next.js hosting; consent required before tracking. |
| P19 | Content in TypeScript data files now; CMS-ready architecture, Sanity **deferred** | Fast to build. Migrating to a CMS later only swaps the data source. Depends on OPEN_QUESTIONS #1. |
| P20 | Centralized config for contact, social links, and WhatsApp; content in `src/content/` | Single source of truth. |
| P21 | Performance: `next/image` AVIF/WebP + lazy loading, video loaded in view, mobile Lighthouse 90+ | Luxury visuals without hurting speed or SEO. |
| P22 | Non-goals: no talent/influencer section, no pricing, no fake claims, no agency comparisons; nqshmedia.com is a structural reference only | Brand positioning and honesty. |

## Phase 1 decisions (approved with `docs/plans/phase-1.md` — 2026-11-06)

| # | Decision | Reason |
|---|---|---|
| D11 | Contact, social, and WhatsApp config lives in `src/config/contact.ts` (CLAUDE.md rule updated from `src/lib/`) | The Phase 1 brief names this path; one single source of truth either way. |
| D12 | Vitest (unit) and @playwright/test (e2e, screenshots, recording) added as devDependencies only; Playwright uses the installed Chrome (`channel: "chrome"`), no browser downloads | No test runner existed; TDD for pure logic is a project rule. |
| D13 | i18n: keep `cacheComponents` + `partialPrefetching` on; root layout at `app/[locale]/layout.tsx` with `generateStaticParams`; locale read via `next/root-params` in `i18n/request.ts`; `src/proxy.ts` runs next-intl middleware. Fallback (if root-params fails in next-intl 4.14.9): `requestLocale` + `setRequestLocale`, logged here | next-intl 4.14 deprecates `requestLocale`/`setRequestLocale` in favour of root-params; keeps the static shell. Resolves OPEN_QUESTIONS #9 once Task 2's build passes. |
| D14 | Hero atmosphere uses Canvas 2D (not WebGL/OGL) | ≤170 sprites + 4 rays are cheap in 2D; WebGL adds weight and a context-loss path for no visible gain. Revisit only if mid-range Android < 50 fps. |
| D15 | Hero text and clock are server-rendered and visible at rest; intro-only states apply under `html[data-js]:not([data-reduced])` | Content must survive JS failure; protects LCP. |
| D16 | Animation ownership by element: GSAP = scroll, hero, tone, reveal primitives, header-shell intro fade; Motion = mega/mobile menus, magnetic, cursor, button micro-states; CSS = marquee, grain, pulses | Makes "never both on one element" easy to audit. |
| D17 | Text splitting via the GSAP SplitText plugin (`autoSplit`, `aria: "auto"`): chars in EN, words in AR | Arabic letters must stay joined; plugin handles resize and ARIA. |
| D18 | Content shape: `Localized<T>`, typed arrays behind getters in `src/content/index.ts`; images referenced by slot id in `src/content/images.ts` | CMS swap point; generated images drop in by slot id. |
| D19 | LCP rule: the largest text element paints at first render and is never at opacity 0; on mobile the title reveal starts at t=0 (mask rise only) and the lead is visible from frame one. Result is measured and logged here | Approved at checkpoint 1; LCP < 2.5s on mobile. |
| D20 | Styleguide contrast badges show computed WCAG ratios (e.g. espresso/ivory ≈ 13.1:1), not the prototype's labels (13.6) | The prototype's numbers were not computed. |
| D21 | Execution is native (this session); the end-of-phase code review is done by a fresh subagent that has not seen the build | Tasks share interfaces tightly; an independent reviewer avoids self-review. |
| D22 | Skills and plugins are installed globally (user scope) only; never committed to the repo (rule in CLAUDE.md) | User's permanent rule. |
| D23 | AI image generation is on hold until checkpoint 4 | User instruction. |
| D24 | `@types/node` raised from `^20` to `^24` (24.19.2) | Vitest 5.1 requires `@types/node` ≥ 22 as a peer; the runtime is Node v24.21.0, so the types now match it. Avoided `--legacy-peer-deps`. |
| D25 | Test tooling installed: vitest 5.1.0, @playwright/test 1.65.0 (no browsers downloaded; `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`). npm 11 reports blocked install scripts for `@parcel/watcher` and `@swc/core` (pre-existing transitive deps); left blocked | Nothing in Phase 1 needs those native builds. Revisit if a build step fails because of them. |
