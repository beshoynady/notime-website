# NO TIME Creative House — Website

Permanent rules for every session on this project. Read this file in full before doing anything.

@AGENTS.md

Full spec: [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) · Decisions and versions: [docs/DECISIONS.md](docs/DECISIONS.md) · Unresolved items: [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) · Material still needed from the client: [docs/CONTENT_CHECKLIST.md](docs/CONTENT_CHECKLIST.md)

This is Next.js 16. Its APIs differ from older versions. Before using any Next.js API, read the matching guide in `node_modules/next/dist/docs/` (see AGENTS.md).

---

## Workflow

- Work in this order of phases: **planning → assets → section-by-section build → review → commit**. Build one section at a time and finish it before starting the next.
- **Before building any component:** invoke the `frontend-design` skill.
- **Before any architectural choice** (routing, data shape, state, i18n strategy, CMS, form pipeline): invoke `superpowers:brainstorming`.
- **Pure logic** (scroll math, count-up, data transforms, validation schemas): use `superpowers:test-driven-development`.
- **After each section:** run `superpowers:verification-before-completion`, including a live check in the browser (both `/en` and `/ar`, desktop and mobile width).
- **Final pass:** `superpowers:requesting-code-review`.
- If a request is ambiguous or needs material from the client, add it to `docs/OPEN_QUESTIONS.md` instead of guessing.

## Placeholders

- Mark every placeholder (text, image, link, data value) with `// TODO: replace placeholder` (or `{/* TODO: replace placeholder */}` in JSX).
- Placeholders must be obvious and must never look like real claims.

## Content rules

- Use the real client copy from the brand PDF wherever it exists.
- **Never invent claims**: no made-up years in business, project counts, ratings, awards, client logos, or testimonials.
- **nqshmedia.com is a structural reference only.** Never compare the site against it, and never copy its copy, layout details, or assets.
- **No talent or influencer content** anywhere on the site.
- No pricing. No direct comparison with other agencies.
- If the material for a trust element (showreel, team, logos, testimonials) is missing, show a clear placeholder or hide the element. Never fake it.

## AI images

- Allowed for mood imagery and service illustrations.
- When an AI image stands in for a **real past project**, it must carry a visible label: **"Illustrative"** in English, **"صورة توضيحية"** in Arabic.
- Store AI images in `public/images/ai/`, kept apart from real photos (`public/images/work/`).

## Animation rules

- **GSAP** (ScrollTrigger, SplitText) owns everything scroll-driven.
- **Motion** owns hover, click/tap, and layout micro-interactions.
- **Never animate the same element with both** libraries. If you need both, wrap the element and give each library its own layer.
- **Lenis** handles smooth scrolling. Keep it in sync with ScrollTrigger.
- Always respect `prefers-reduced-motion`. The reduced variant should show the final state with no movement.
- On mobile and touch devices, cursor-driven interactions become scroll-driven.
- Use `@gsap/react` (`useGSAP`) so animations are cleaned up when components unmount.

## RTL / i18n

- Locales: `en` (default, `/en`) and `ar` (`/ar`). `dir="rtl"` for Arabic.
- Use **only Tailwind logical properties**: `ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`, `text-start`/`text-end`, `border-s`/`border-e`, `rounded-s`/`rounded-e`. **Never** use `ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`/`text-left`/`text-right` for directional layout.
- Marquees and horizontal scroll sections **must reverse direction in Arabic**.
- Directional icons (arrows, chevrons) must flip in RTL.
- All user-facing strings live in `src/messages/{en,ar}.json` or in the localized fields of `src/content/` data files. Never hardcode them in components.
- Write the English first. The Arabic is written natively, not translated word for word.
- Fonts: Montserrat (EN), Alexandria (AR).

## Centralized config

- Contact info, social links, and the WhatsApp number live in **one** config file in `src/lib/`. Never duplicate them in components.
- Services, work/projects, and products live in data files in `src/content/`. One template per content type, driven by its data.
- Secrets and environment-specific values come from env vars (see `.env.example`). Never commit `.env*` files other than `.env.example`.
- Keep the content layer CMS-ready (a future Sanity migration should only swap the data source, not the components).

## Performance

- Use `next/image` for every image, with AVIF/WebP and lazy loading (only the hero image is eager/priority).
- Load video only when it is in view. Use a poster image and no autoplay download above the fold unless the video is the hero.
- Target a mobile-first Lighthouse score of **90+** in every category.
- Register GSAP plugins once, load heavy animation code client-side only, and keep server components the default.

## Brand palette (reference)

| Token | Hex |
|---|---|
| Deep Espresso | `#2E2017` |
| Cocoa Brown | `#634731` |
| Warm Taupe | `#BB9A79` |
| Champagne Beige | `#EAD4AB` |
| Vanilla Ivory | `#F5E9D3` |

## Project structure

```
src/
  app/[locale]/                 # localized routes (en default, ar)
  components/layout/            # header, footer, nav, language toggle, WhatsApp button
  components/sections/          # homepage and page sections
  components/ui/                # shadcn/ui primitives
  components/motion/            # reusable animation wrappers
  content/                      # services, work, products data files
  lib/                          # utilities, site config
  i18n/                         # next-intl routing/request config
  messages/                     # en.json, ar.json
public/images/{brand,work,services,ai}/
public/video/
docs/
```

## Commands

- `npm run dev`: development server
- `npm run build`: production build (must pass before every commit)
- `npm run lint`: ESLint
