# Software & Digital: the v1 brief (the user's, 2026-11-10)

The user's brief and addendum, trimmed to the v1 scope frozen in D91. The parts moved out are in `docs/plans/v1.1.md`: the scoping wizard, the live bilingual demo, the before/after slider, the comparison table, solutions by sector, the atmosphere images and the tracking events. The user's wording is kept.

## Goal

This page drives ongoing technology work. It should be the most persuasive, creative and conversion-focused page on the site, with no fabricated facts.

## Skills

Use these:

- `copywriting`, `marketing-psychology`, `cro` (installed globally);
- `frontend-design`, `ui-ux-pro-max` (layout and UX);
- `design:ux-copy` (every line);
- `framer-motion-animator` (interactions);
- `nextjs-seo`, `searchfit-seo:schema-markup` (on-page and schema).

The lead runs the design critique and accessibility review through a fresh subagent at M3.

## Marketing frameworks

- **Outcome over features:** every heading states what the client gets ("A site your clients actually use, in Arabic and English"). The tech comes second.
- **PAS:** name the real pains of Gulf businesses before the solution:
  - English-only sites selling to Arabic speakers;
  - slow mobile sites;
  - no way to update content without the agency;
  - agencies that hand over and disappear;
  - event tech split across separate vendors.
- **Proof before promise:** real evidence placed high on the page.
- **Specificity:** concrete deliverables, the process, and what the client receives at each step. No vague adjectives.
- **Objection handling:** the FAQ and microcopy address cost uncertainty, timelines, ownership, support, language and "will I be able to update it?". Answer with the process; no invented numbers.
- **Risk reversal:** the free 30-min intro call, no obligation.
- **One primary CTA,** repeated at decision points. WhatsApp is secondary, once it's configured.
- **Scannability:** short paragraphs, clear hierarchy, every section readable in 5 seconds.
- **Arabic:** written natively for Gulf business readers, not translated. It's a selling point: only 2 of the 8 benchmarks have Arabic.

## Page structure (v1)

Keep the approved "Interface" opening story.

1. **Hero.**
   - An outcome headline and a subline: the team behind your events builds your platform.
   - The primary CTA "Book a free 30-min intro call", and a secondary "See our work".
   - The opening story plays: the blinking cursor → wireframe → UI → device.
2. **Proof strip,** right after the hero:
   - "A national sports federation: bilingual website, mobile app and CMS, live".
   - "This website": a device-framed real screenshot. The Lighthouse metric shows only when it's ≥ 90 (a flag, off in v1).
   - **Then the free-website-review secondary CTA** (see A below).
3. **The problem (PAS):** 4–5 pains as short, punchy cards, each answered by a one-line "how we solve it".
4. **What we build:** the 6 services as **mini landing blocks** (see C below).
5. **Event technology (our specialty):** registration and check-in, event apps and microsites, live results and screens. It includes "Minute Zero by NO TIME · Coming soon". This is where NO TIME's two worlds meet, so make it visually distinct. Link to the Events page.
6. **Case study (anonymised):** Challenge → Approach → What we built → Result (verified facts only).
   - Visuals: stylised brand-palette UI redraws (abstract layout blocks), never the federation's real screens or logos.
   - A config flag switches it to the named version.
7. **How we work:** Discover → Design → Build → Launch → Support, a scroll-built timeline. Each step shows what happens and **what you receive** (e.g. a clickable prototype, a staging link, a launch checklist).
8. **Engagement levels, no prices:** three tiers, presented as scope rather than packages for sale.
   - **Launch:** a focused bilingual website.
   - **Grow:** website + CMS + SEO + integrations.
   - **Platform:** a custom system or app, dashboards, ongoing development.
   - Each tier: ideal for; what's included (5–6 points); what you receive; and a CTA "Talk about Launch / Grow / Platform" that pre-fills the form.
   - A note: "Every project is scoped and quoted individually."
9. **Two ways to work with us:** "Fixed-scope project" and "Monthly support & growth" (maintenance, improvements, content updates, reporting). Present the second as the natural next step after launch.
10. **Why NO TIME** (4–5 differentiators, all true):
    - one team for events and digital;
    - native Arabic and English;
    - performance and SEO built in;
    - support and maintenance after launch;
    - you see progress at every stage.
11. **Products, Coming soon:** Minute Zero and Peak Hour cards: the problem, 3 key features, "Preview" concept screens, and "Register interest".
12. **Quality strip** (quiet): bilingual RTL/LTR, accessibility, a performance budget, security and data protection (PDPL-aware), and the stack named lightly (no logo wall).
13. **FAQ:** 7 entries, with FAQPage schema.
14. **Final CTA with risk reversal:** "Book a free 30-min intro call. No obligation. We reply within one working day." / «احجز مكالمة تعارف مجانية (30 دقيقة). دون أي التزام. نرد خلال يوم عمل.»
    - Then the consultation form, with qualifying fields: what you want to build, timeline, budget band, current website URL.
    - The website-review CTA also sits here.

## A. Free website review (ON, the user's decision)

- A secondary CTA in three places: after the proof strip, in the final CTA area, and as a second option in the sticky mobile bar.
- Form fields:
  - current website URL\*;
  - name\*;
  - email or WhatsApp\*;
  - "what's the main goal?" (more enquiries / Arabic version / speed / easier updates / other);
  - an optional message.
- The same pipeline: Turnstile, honeypot, rate limit.
- Email subject prefix `[Website review]`, with its own template.
- Promise copy: "Send us your site. Within 3 working days we'll reply with 5 concrete improvements, free." / «أرسل لنا موقعك، وخلال 3 أيام عمل نرد عليك بخمسة تحسينات عملية، مجانًا.»
- No scarcity claims ("limited slots").

## C. The six services as mini landing blocks

Each of the 6 services is a mini landing block, not a plain card:

- a code-drawn visual for the service (a device frame, a flow diagram, a storefront, a UI panel), animated on scroll;
- an **outcome headline** (benefit first), then a one-line description;
- **Ideal for:** 2–3 kinds of client;
- **You receive:** 3 deliverables (D65);
- **phase tags:** which of Discover / Design / Build / Launch / Support apply;
- **CTA:** "Discuss this", which pre-fills the form.

Layout:

- alternating start/end on desktop (mirrored in RTL), stacked on mobile;
- one featured service, Event tech, gets a wider, darker block;
- hover or focus plays the visual's state change, and nothing moves under reduced motion (the addendum was cut off here; decisions-to-confirm #19).

## Images: professional and honest

- **Real proof visuals:** real screenshots of this website (the homepage hero, a category page, mobile views, EN and AR) in polished laptop and phone frames drawn in code or SVG. A subtle tilt and parallax, plus a light sweep on hover. These are the page's hero proof.
- **Product concept screens:** clean UI mockups drawn in code in the brand palette, labelled "Preview": realistic, but clearly concepts, with the example data labelled.
  - Minute Zero: a check-in dashboard, a QR scan screen, a guest list.
  - Peak Hour: a tables view, a kitchen queue, a daily summary.
- **The case study:** stylised redraws (abstract layout blocks in brand colours), never the federation's real screens or logos.
- **Atmosphere:** code-drawn (gradients, grid, glow). The photo slots are v1.1.
- **Motion on visuals:** device frames assemble on scroll, UI states animate (a check-in counting up with example data), and the light follows the cursor. GSAP for scroll, Motion for interaction. Reduced-motion stills for all.

## SEO

- Metadata and the H1/H2s target real intents, with native AR equivalents:
  - "website development Dubai";
  - "mobile app development UAE";
  - "event registration system";
  - "bilingual Arabic English website";
  - "custom business systems UAE".
- JSON-LD: Service items, FAQPage, BreadcrumbList.
- Internal links to the Events page (event tech) and the Work index.

## Honesty (non-negotiable)

- Nothing invented: no clients, figures, testimonials, awards, team sizes or certifications, and no response-time promise beyond the two approved ones ("one working day", "3 working days" for the review).
- Example data is labelled "Example"; concept screens are labelled "Preview".
