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
- **After each section:** run `superpowers:verification-before-completion` with the local checks below; the browser check in both locales at both widths happens at the milestone.
- **Speed mode (D82, 2026-11-10):**
  - **Decide, log, continue.** Make judgment calls on the established criteria (technical, marketing, UI/UX, the company's nature, honesty), log each in `docs/DECISIONS.md` with a one-line reason and in `docs/review/decisions-to-confirm.md`.
  - **Stop only at the milestones:** M1 homepage complete (then start the tunnel review build), M2 all five category pages, M3 the full v1. Stop earlier only for anything irreversible, anything that costs money, new accounts or keys, a security issue, or a change to an approved concept.
  - **Parallel work:** independent pages run as subagents in git worktrees, at most 3 at once. Shared code (tokens, primitives, LayeredScene, content-status, ornaments) is frozen during a batch; agents report needed changes to the lead, who applies them once and integrates the branches into `phase-2-services`.
- **Testing in batches (D82):**
  - **Pre-commit:** lint-staged (ESLint on the staged files, one typecheck when TypeScript is staged). No unit tests in the hook.
  - **Locally while working:** lint, typecheck, unit tests when logic changed. No e2e, except one spec when changing exactly that behaviour.
  - **Commit freely, push in batches** (every few completed steps or at the end of a work block).
  - **CI:** a push runs lint, typecheck and unit tests. The build, the leak scan and the full e2e run on a manual `workflow_dispatch` (at each milestone) and on PRs to `main`. A red run blocks the milestone report.
  - **New tests only for high-risk logic:** forms and validation, navigation and anchors, the content-status hide rules, RTL mirroring, numerals. None for purely visual tweaks.
  - **Milestones only:** the full e2e in CI, screenshots (1440/390, EN/AR), measurements (CLS, frames, dwell), and a fresh-subagent quality gate (`design:design-critique`, `design:accessibility-review`, a copy check). Fix High and Medium findings before reporting.
  - **Milestone report:** one screen: done, screenshot links, CI status, numbered decisions to confirm with a recommendation, next.
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

- Contact info, social links, and the WhatsApp number live in **one** config file: `src/config/contact.ts`. Never duplicate them in components. (Changed from `src/lib/` on 2026-11-06, see DECISIONS D11.)
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
  config/                       # contact.ts (email, WhatsApp, socials)
  lib/                          # utilities, pure logic, motion tokens
  i18n/                         # next-intl routing/request config
  messages/                     # en.json, ar.json
public/images/{brand,work,services,ai}/
public/video/
docs/
```

## Skill and plugin installation

- Install every skill or plugin **globally (user scope)**, never project scope.
  - Skills go in `~/.claude/skills/`, never `.claude/skills/` inside this repo.
  - Plugins: use the user scope (`/plugin install <name>` with `--scope user` where the command supports it).
  - CLI installers (e.g. `npx skills add ...`): use the global flag (`-g` / `--global`).
- After installing, confirm the location with `/find-skills` or by listing `~/.claude/skills/`, and report it.
- If a skill can only be installed per project, stop and ask before installing it.
- Never commit skill files into this repo.

## Commands

- `npm run dev`: development server
- `npm run build`: production build (runs in the full CI job, and locally before each milestone's screenshots; D82)
- `npm run lint`: ESLint
