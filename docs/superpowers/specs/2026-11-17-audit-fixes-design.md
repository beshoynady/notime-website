# Audit fixes before launch: design

2026-11-17. Source: the independent UX audit (`docs/review/ux-audit.md`, notes N01–N22; benchmark in `docs/review/benchmark.md`; shots in `docs/review/shots/`). The owner chose what to build (message of 2026-11-17) and approved the approaches below with six changes, all folded in here.

## Intent

NO TIME wins clients through relationships today; the site has to win new ones from search and from Instagram, mostly on phones. The audit found the site premium and honest but slow to show real work, hard to act on from a phone, and thin on trust. These fixes make the first screen say more, put a way to ask for a quote under the thumb on every page, and remove the small defects that read as neglect, without losing the identity or adding a fabricated claim.

**Goals:** the decided items before launch, each with an acceptance test; no regression in LCP, CLS, accessibility or the reduced-motion versions; the review link updated.
**Non-goals:** anything the owner kept for v1.1 or for their own review (the rest of `copy-proposals.md`); new content (team, logos, testimonials, WhatsApp number).
**Anti-goals (a failure even if it works):** a disabled or "coming soon" control; any invented number, client or claim; any mention of AI or generated imagery; a stock or AI photo on Work; a layout shift; the photo stories losing their static versions under reduced motion (decision #31); LCP getting worse.

## Fixed rules (unchanged project rules apply: CLAUDE.md)

Logical properties only; EN + native AR strings in `src/messages` or content files; GSAP owns scroll, Motion owns hover, never both on one element; reduced motion = the final state with no movement; contact data only from `src/config/contact.ts`; missing content hidden (fill or hide).

## Approaches (chosen by the owner)

| Item | Considered | Chosen | Why |
|---|---|---|---|
| N05 home hero | B1 keep the clock hero, shorten its pin, beat → eyebrow, two CTAs, photo strip right after; B2 no hero pin at all; B3 photos slide inside the hero | **B1** | No real photo is ≥ 2000 px (widest 1600 × 1066), so the owner's condition sends N05 to option (B). B1 keeps the approved clock exit and LCP stays text; B2 drops the exit; B3 is the heaviest and needs large photos. |
| N06 category openings | A the scene's final still as an unpinned hero + CTA, the pinned build after it on desktop with motion only; B one plain photo as the hero; C start the scene at its end and rewind | **A** | Uniform across the four scene categories (only Events has a real photo plate; Creative, Marketing, Print finals are compositions). C confuses. |
| N04 mobile CTA bar | A one shared bar in the site shell, generalized from Software's; B a bar per page | **A** | One behaviour, no drift; Software keeps its own labels. |
| N12 main menu | A add Events after Services; hide it where it doesn't fit; B tighter gaps | **A** | Measured: AR fits at every width ≥ 900; EN is tight at 900–1023. |

## The design, item by item

### N03 · Turnstile keys (owner sets them)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public; must be present **at build time**, it is inlined) and `TURNSTILE_SECRET_KEY` (server, runtime). Locally in `.env.local`; on the host in the app's environment variables. In Cloudflare, the widget's hostnames include `notimehub.com` and `www.notimehub.com`. Without them a production build refuses every form by design (D102).
- **Not part of this plan's "done"** (it needs the keys, the Resend domain and the deployed site): it goes into the launch checklist (`docs/launch/`) as written below.
- **Real-send test plan** (after the keys and the Resend domain are live), on the production domain: iPhone Safari, Android Chrome, desktop Chrome and Safari; each of Contact (with `?service=` preset), Software consultation, website review, product interest; EN and AR. Pass = the team email arrives with the lead-source rows, the auto-reply arrives in the page's language, the success state shows. Then one failure case: block `challenges.cloudflare.com` and check the email fallback. Result logged in `docs/launch/`.

### N04 · Mobile CTA bar (all pages except `/contact` and `/links`)
- One client component in the site shell (`src/components/layout/`), generalized from `src/components/software/sticky-bar.tsx`: below 900 px only; hidden on desktop.
- **Content:** "Request a quote" / «اطلب عرض سعر» (the header's string) full width. When `contactStatus(contact).whatsapp` is true it becomes two equal halves, the second "WhatsApp" / «واتساب» through `WhatsAppLink` (the source-naming message, D114). The quote link carries no preset (builder's call, below: the brief presets one of the 30 services, never a category, and adding category values would change the schema for little gain). Software keeps its two actions ("Request a free intro call" per N13, and the free website review).
- **When:** appears once the page's opening has scrolled away (each page marks its opening with one attribute; pages without one use the first section); hides while any form is in view and while a text field has focus (the on-screen keyboard), exactly as Software's does today.
- **Height 56 px** plus the safe area; its height is reserved at the page's end so it never covers the footer; `scroll-padding-block-end` while it shows.
- **WhatsApp button:** on phones the floating button hides whenever the bar exists (the bar carries WhatsApp); on desktop it stays.
- **Events › private celebrations stack (390):** the sticky cards reserve the bar's height at their bottom so the last card isn't covered.
- `/links` is outside the site shell (plain HTML), so it never gets the bar; `/contact` opts out.

### Mobile header that hides on scroll (category pages only, owner's change 2)
- On the five category pages below 900 px (Software included, my call: it has no pin at phone width and keeps its own sticky bar), the header slides up when the visitor scrolls down and returns on any scroll up; the service chip bar and the CTA bar stay.
- **No CLS:** both the header and the chip bar move with `transform` only (the chip bar translates up by the header's height in step with it). Nothing changes `top`, height or layout; transforms don't count as layout shift. Checked by a CLS assertion in e2e.
- **No pin conflict:** after N06 there is no pinned scene on category pages at phone width (the opening pin goes; it was the only one at 390).
- **Two small side effects, accepted unless the owner says otherwise:** (1) the private-celebrations cards stick at their usual offset, so with the header hidden there is a 68 px gap above them; (2) an in-page jump downwards (the chip bar, "Go to the services") lands with the header's 68 px of extra space above the heading, since the header hides as the page moves down.
- The header returns when anything in it gets keyboard focus, when a menu opens, and at the top of the page. Reduced motion: it shows and hides without a transition.

### N05 (B1) · Home hero
- Keep the clock hero, its intro and the title/clock exit; remove the second-beat screen. The hero pin shortens to what the exit needs (the builder measures it; today 140 svh, the beat takes part of it); the CSS reservation (`.hero-pin`, D112/D117) changes with it.
- "Every second is planned." / «كل ثانية محسوبة.» becomes an eyebrow above the H1 (real text, read once; the sr-only duplicate goes).
- Two CTAs: primary "Plan your event" / «خطّط لفعاليتك معنا» → `/contact`; secondary "See our work" / «شاهد أعمالنا» → `/work`. The lead line is unchanged.
- The photo strip ("Rooms we dressed, tables we set.") moves from the end of Work to right after the hero, keeping its desktop horizontal hold and its phone swipe row. LCP stays the H1.
```
┌──────── header ────────┐
│  ◯ clock (translucent)   │
│  EVERY SECOND IS PLANNED │
│  IT'S TIME               │
│  TO START.               │
│  lead line               │
│ [Plan your event] [See our work] │
└──────────────────────────┘
 ▸ photo strip → About → …
```

### N06 (A) · Category openings (Events, Creative, Marketing, Print)
- **Hero:** the LayeredScene rendered in its final still (the state reduced motion shows today), unpinned, one screen high: breadcrumbs, eyebrow, H1, the last shot line as the lead, "Request a quote" (no preset, as the bar) and "Go to the services ↓".
- **Events hero image:** the room photo is 1600 px wide; a dark gradient from the text side plus a light overall dim so its softness doesn't show at 1440. Screenshots at 1440 EN and AR go to the owner **before merging** (owner's change 3).
- **Build scene:** the existing pinned LayeredScene follows the hero on desktop with motion only (same scene, its shots, its reservation); not rendered on phones or under reduced motion.
- **LCP:** the hero image is loaded with priority. Before/after Lighthouse on the same machine (ab method) on Events and one other category; **if LCP regresses, stop and report before merging** (owner's change 4).
- Reduced-motion spec (`e2e/photo-stories-reduced.spec.ts`) keeps passing: no pin, no clip.
```
desktop: [hero: finished scene + H1 + Request a quote] → [pinned build scene] → services
phone:   [hero: finished scene + H1 + Request a quote] → services
```

### N07 · "How we work" back on the grid
- Its content starts at the page grid (120 px at 1440, like the logo); today it's at 40 px. (The empty screen before it was D117, fixed.)

### N08 · Work
- Filters hidden while there are fewer than 6 projects (a constant, tested); a closing block at the end of `/work` (copy N16, reusing `workCase.ctaTitle`).
- Real project photos only where the project's own photos exist (`public/images/work/`), cropped to hide the client where the case is anonymous. No stand-ins (CLAUDE.md).

### N09 · "360°" → "30 services"
- The second stat on the home About block and on `/about` (copy §2.4/§8.1). The number comes from the services data (count of services), not typed.

### N10 · Event date and guests (Contact brief)
- Two optional fields, shown only when the chosen service is in Events & Hospitality or is "not sure yet": "Event date (approximate)" (month precision is enough; a month input or month + year selects) and "Number of guests" in bands (Up to 50 · 50–150 · 150–500 · Over 500 · Not sure yet). The current "When is it?" stays for other services. Labels from copy §9.1 (needed by the decided item; owner may adjust).
- Schema, server re-parse and the team email rows extended; tests for the show/hide rule and validation.

### N11 · Clipped text in "Choose the mood" (Events, 390)
- The text and the card get the 16 px side gutter back; only the photo row scrolls horizontally.

### N12 (A) · Main menu
- Services ▾ · Events · Digital Solutions · Work · About, then the language toggle and "Request a quote". Events links to `/services/events-hospitality`, `aria-current` on that page. EN hides the Events item between 900 and 1023 px (it stays first in the Services menu); AR shows it at every desktop width. Mobile menu unchanged.

### N13 (A) · Software's call CTA
- "Request a free intro call" / «اطلب مكالمة تعارف مجانية» wherever "Book a free 30-min intro call" appears (hero, sticky bar, the form's submit) (copy §6.1).

### N15 · Privacy line under forms
- The shorter line from copy §1.3; the providers stay named in the Privacy policy.

### N16 · Closing CTAs
- `/services` and `/work` end with the closing block (copy §4.1, §7.1).

### N17 · Photo grade
- A light, uniform warm grade on the event photos the audit names (and the strip), via the existing grading script. Before/after per photo goes to the owner **before adoption**.

### N18 · Arabic fixes
- «تعرّفوا على ما ستقدّمه الدقيقة صفر / ساعة الذروة» (verb agreement), the Google / Meta service title spacing (copy §4.2), and a space between the number and the title in the mobile menu.

### N19 · Accessibility (three items)
- The language toggle's accessible name starts with its visible text (2.5.3). `aria-required` only where allowed (done for the chip groups in D116; any left are fixed). Form fields' focus underline 2 px.

### N21 · Case studies
- Compress the large empty spaces between facts and results; layout only.

### N22 · 404 tab title
- "Page not found · NO TIME Creative House" / «الصفحة غير موجودة · NO TIME Creative House».

## Added to v1.1 (not built now)
N13 (B) Cal.com booking after the form; N14 page length; N20 the services marquee becomes one small line (not removed); the rest of N19 (24 px targets, etc.); the photo stories set up only when they near the screen, with TBT re-measured on the category pages; a real photo in the home hero on phones (today's resolution is enough there), or at every size once ≥ 2000 px photos arrive.

## Done means
- Unit + e2e green locally and on CI (run number in the report); new tests for the CTA bar, the conditional fields, the filter threshold, the menu order and visibility, the heroes showing at once, the hiding header (no CLS).
- Lighthouse mobile, ab method, before/after on this machine: home, one category, `/links`; no regression in LCP or CLS; `/links` ≥ 95.
- axe-core: no serious or critical violation on the audit's nine pages.
- Screenshots of every page at 1440 and 390, EN and AR, in `docs/checkpoints/audit-fixes/`, with before/after for the visual items.
- The review link on a production build of HEAD; DECISIONS D118+.

## Calls made while writing (owner can overrule)
- No category preset on the CTA bar and the category hero button (see N04).
- The hiding header also applies to Software's page.
- The N03 real-send test is a launch-checklist item, not part of this plan's "done".
- N10: "not sure yet" is the empty default, so the event fields show on a plain `/contact`; "When is it?" hides while they show.
- N13 wording drops "30-min" ("Request a free intro call"), as the owner wrote it.
- The owner-gated items (the Events hero image, the photo grade) are built on their own branches so the rest can merge without waiting.

## Left to the builder
The exact shortened hero pin length (measured, so the clock exit still completes); the gradient values on the Events hero (judged on the 1440 shots); the month input's form (native `month` input where supported, select pair otherwise); how each page marks its opening for the CTA bar.
