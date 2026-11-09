# Benchmarks: patterns from 8 agency websites (2026-11-09)

**Internal research only.** These sites are never named, compared or quoted on the NO TIME site, and no text, images or claims are taken from them (CLAUDE.md). Patterns only. nqshmedia.com was excluded.

**Method:**
- For each site I fetched the homepage plus a services page, a case study and a contact page (2026-11-09).
- The fetch returns text, not rendered pages, so motion notes are inferred from markup and Awwwards write-ups, and need a browser check before we rely on any of them.

**Couldn't use:**
- No response: sledge.ae, done-events.com, momentum-me.com, flash-entertainment.com, eventumpremo.com.
- Wrong kind of site: prism.ae (parked), identity.ae (a magazine).
- Wouldn't render: Collins (refused), Active Theory (WebGL shell, no text).

## Regional (UAE / KSA)

### 1. DXB Live (dxblive.com): the Dubai World Trade Centre's event agency

**Structure (homepage, in order):**
1. Header: enquiry button, Arabic toggle, WhatsApp float.
2. Text hero.
3. 3 service panels, each with its own enquiry link.
4. Award banner.
5. Intro.
6. Expertise tiles.
7. 3 cases.
8. Capabilities.
9. Logos.
10. 2 testimonials.
11. News.
12. CTA band.
13. Footer.

**Work:**
- **Index:** category filter chips; cards show image, title + year and a one-line summary.
- **Case:** key-facts row (client, venue, scale) → hero → overview → scope blocks (one per service) → gallery → challenges → solution → results → CTA.

**Contact:** an enquiry form with an **inquiry-type dropdown matching the service list**, plus country and a time slot.

**Adopt:**
- A per-service enquiry link that preselects the service.
- A key-facts strip on top of each case.
- A scope block inside the case that links back to the services.

**Avoid:**
- Two overlapping service taxonomies.
- About six identical "enquire" buttons per page.
- A careers form in every footer.

### 2. PurpleGlo (purpleglo.co): immersive brand activations, Dubai

**Structure (homepage, in order):**
1. Sticky header with "Get in touch".
2. Hero with a "Watch showreel" link and an image-sequence visual.
3. Statement.
4. Client logo marquee.
5. 3 pillars.
6. 4 service cards with tags.
7. 4 cases.
8. Point of view.
9. Insights.
10. Contact band.

**Service page:** hero + breadcrumb → overview → what we do (5) → narrative → how we work → partners → **3 related cases** → contact.

**Case:** brief → solution → credits → video → pillars → quote → 3 metrics → impact → gallery.

**Adopt:**
- Related work on every service page.
- Discipline filters on the work index.
- The brief / solution / impact case structure.

**Avoid:**
- English only in an Arabic market.
- No "next project".
- Decorative shapes competing with the photography.

### 3. Sela (sela.sa): large-scale events and entertainment, KSA

**Structure (homepage, in order):**
1. Header with search and an Arabic toggle.
2. Muted video hero with an unmute control.
3. Who we are.
4. Principles and leadership.
5. 3 service groups.
6. Achievements slider.
7. Partner logos.
8. Testimonials (name and title).
9. News.
10. CTA.
11. Newsletter.

**Services:** tabs on one page, with no per-service pages and no related work.

**Arabic:** a full `/ar/` mirror with the same section order.

**Adopt:**
- Muted video with a visible sound control.
- Testimonials only with full attribution.
- The same order in both languages.

**Avoid:**
- Tabs that hide services (bad for deep links and SEO).
- Project cards that open nothing.
- A logo-only portfolio.
- Generic stock imagery.

### 4. The Hanging House (thehanginghouse.com): experiential agency, Dubai, Abu Dhabi and Riyadh

**Structure (homepage, in order):**
1. Header with "Talk to us" and a sound toggle.
2. Reel hero with a manifesto.
3. **Featured work straight after the hero.**
4. Who we are, with 3 pillars.
5. Associated-with logos.
6. 4 service cards.
7. Owned IP.
8. Logo wall.
9. Press.
10. CTA.
11. Footer listing the office cities.

**Services:** 4 numbered pillars, each with a slogan and 4 sub-services.

**Case:** 4 stat callouts first, then unlabelled challenge, idea and result blocks, then a gallery.

**Adopt:**
- Work early on the page.
- Pillars with short sub-service lists.
- Office cities as a reach signal in the footer.

**Avoid:**
- Unlabelled case sections.
- A services page that never links to work.
- No Arabic while selling into KSA.

## Global

### 5. Balich Wonder Studio (balichwonderstudio.com): ceremonies and brand experiences, with offices in Riyadh and Abu Dhabi

**Structure:**
- A thin homepage: 5 line-of-business tiles, a short about block, and footer CTAs (contact, careers, reel).
- Each line of business has its own page: text hero → intro → bullet list → a large project grid.

**Work:**
- **Two-axis filters** on the grid: producing office or region, and type (15 types). The filters have an empty state.
- Cards show type · year · city · title.
- Case pages are thin: breadcrumb, meta, 3–4 paragraphs, gallery. No outcome, no next step.

**Contact:** emails split by purpose, plus office cards.

**Adopt:**
- Filters by service × city.
- A meta line on each card.
- Breadcrumbs on case pages.

**Avoid:**
- The main CTA only in the footer.
- A reel link pointing at "#".
- Case pages with no outcome.

### 6. Jack Morton (jackmorton.com): global brand experience, with offices in Dubai, Doha and Riyadh

**Structure (homepage, in order):**
1. Hero headline with "Watch reel" (off-site, so the hero carries no video weight).
2. Positioning.
3. One award badge.
4. Recent-work carousel with a skip link.
5. Capabilities + CTAs.
6. News.
7. An office directory by region.

**Services:** 7 image tiles, each linking to its own service page.

**Case:**
- Client above the title.
- Industry and service tags.
- Narrative.
- Captioned gallery.
- A qualitative **Impact** section.
- Ends with "Let's chat".

**Footer:** dark-mode and high-contrast toggles.

**Adopt:**
- An Impact block even when it's qualitative.
- A CTA at the end of each case.
- An accessible carousel (skip link).

**Avoid:**
- Service tiles with no one-line description.
- A work index with no filters.
- A contact page that is only an email.

### 7. Koto (koto.com): brand agency, 5+ studios

**Structure (homepage, in order):**
1. Statement.
2. 5 cases (one featured).
3. News.
4. Contact block.
5. City switcher ("Say hello" per city).
6. Footer.

**Services:**
- "Jump to" anchor navigation, then 4 groups.
- Each group: a one-word title, **a one-sentence outcome line**, and 7–8 named sub-capabilities.
- Then logo walls, testimonials (each linked to its case), "Start a project", and offices.

**Case:**
- Hero meta.
- A **sticky in-page section menu.**
- Repeated blocks (heading, tagline, paragraphs, images).
- Result stat cards at the end.
- Back to work.

**Contact:** named people with a **copy-email** button.

**Adopt:**
- An outcome line plus a sub-capability list (our category pages already do this).
- A sticky menu on long cases.
- Copy email.

**Avoid:**
- Repeated news blocks.
- Video in every section on mobile.

### 8. Locomotive (locomotive.ca): digital studio, Montreal, maker of Locomotive Scroll (v5 built on Lenis)

**Structure (homepage, in order):**
1. Header with a **persistent "Let's talk"** and a language toggle.
2. A staggered type-reveal hero.
3. 5 featured projects plus an "All work" card.
4. Philosophy.
5. Hiring.
6. Services summary.
7. Articles.
8. Store.

**Work:**
- **Index:** a stacked list with **filter chips that show counts.**
- **Cards:** client, industry, city, description, tags, year.
- **Case:** meta → about → mandate → approach → galleries → role-by-role credits → visit → **next-project card.**

**Adopt:**
- Chips with counts.
- The mandate → approach → credits → next case structure.
- A persistent header CTA.

**Avoid:**
- Award-count badges (we have none to show).
- Store, culture or careers sections that dilute a services business.

Side notes (fetched, not studied in full): FiveCurrents (fivecurrents.com) uses portrait featured cards, a category filter on the homepage, "watch highlights" on cases, and a related-work row.

## What the eight have in common

1. **The reel is the first proof,** reached from a link in or near the hero and opened in a player or modal. It never autoplays heavily in the hero. When there's no reel, the link is hidden.
2. **Work carries the site.** Cards show client (or a descriptor) · title · type · year · city. Filters run by service and location, sometimes with counts.
3. **Case studies:**
   - Order: key facts → brief/mandate → approach/execution → impact (numbers only when real, otherwise qualitative) → scope/credits → **next project + CTA**.
   - The next step is missing on most regional sites; it's an easy win.
4. **Services:** an outcome line plus a short list of sub-capabilities, with anchor navigation. The stronger sites link related work from each service.
5. **Trust sits next to the proof:**
   - client names on cards, logos after the hero or the services, testimonials with full attribution;
   - office cities in the footer;
   - nobody shows a fake stat.
6. **CTAs:**
   - one persistent header CTA, a closing CTA band on every page, and a per-service enquiry link;
   - in the UAE: an enquiry form with an inquiry-type dropdown plus a WhatsApp float.
7. **Motion is restrained:**
   - smooth scroll, staggered type reveals, marquees, carousels, occasionally an image-sequence hero;
   - WebGL-only content hurts readability and crawling.
8. **Gaps we can own:**
   - **native Arabic** (only the 2 government-linked sites have it; the private Dubai agencies are English-only);
   - **an FAQ** (none of the 8 has one, so with FAQPage schema it's unmet demand);
   - **a qualifying brief form** in place of a bare email directory.

## Gap list for NO TIME (feeds docs/plans/v1-review.md)

### Pages

| Gap | Where in the plan |
|---|---|
| Work index with filters by category × city and chips with counts; empty state | F1 |
| Case template: key facts → brief → approach → execution → impact (qualitative unless verified) → scope block linking the service anchors → next case + CTA; sticky section menu from about 4 sections; breadcrumb | F1 |
| Contact as a qualifying brief: service dropdown (preset from the page that sent the visitor), city/country, timing, budget band; WhatsApp; email lines by purpose only once they exist in config; copy-email button | F3 |
| A related-work block on each category page (anonymised cases of that category; hidden when there are none) | Phases C and E |

### Homepage

| Gap | Where in the plan |
|---|---|
| A "Watch the reel" link in the Work section header opening the code-driven reel (A5) in a dialog; no autoplay video in the hero | B1 + B6 |
| Work early: our order already puts Work right after Categories (brief §4), which keeps the brief and matches the strongest pattern | B1 |
| Trust (review mode only): an example logo row after Categories, example testimonials before the final CTA | B8 |
| Office cities / markets as a reach signal in the footer (the six markets from the profile) | B5 + B7 |

### UX

| Gap | Where in the plan |
|---|---|
| A persistent header CTA. Check that the existing header quote button reaches `/contact` once it exists | A2 |
| One CTA per block, never stacks of identical buttons | all pages |
| Accessible carousels (skip link), or none: we use grids and marquees instead | B1, F1 |
| No tabs hiding services: our anchors and sections already avoid this | (kept) |

### FAQ topics clients actually ask

Synthesised from the enquiry forms and service copy across the 8 sites, answered on our side as **process, never numbers**:
1. Do you work outside the UAE (KSA, the GCC, further)?
2. What do you make in-house and what through partners (fabrication, print, AV, content)?
3. How quickly can you respond to a brief, and can you handle tight timelines?
4. Can you work from our existing concept or brand, or do you start from scratch?
5. Do you handle the logistics end to end (venue, permits and approvals, staffing, transport)?
6. Can one partner cover strategy through production?
7. Permanent installations or only temporary ones?
8. What do you need from us to prepare a proposal, and how does quoting work?
9. Who owns the footage, designs or code after delivery?
10. Do you produce in Arabic and English?
11. What happens after the event or launch (reporting, deliverables, support)?
12. Do you sign NDAs and keep projects confidential?

**Placement:**
- General FAQ on `/contact`: 1, 3, 6, 8, 10, 12.
- Category FAQs pick the rest where they fit, alongside the questions already approved for Events.
- Every answer that needs a fact Rand hasn't given goes on `docs/review/fact-check.md`.

### Motion and images: confirmed by the patterns, with our rules applied

| Pattern | Our version |
|---|---|
| Staggered type reveals, marquees, smooth scroll | Already ours: GSAP for scroll, Lenis |
| Image-sequence hero | Only where a story needs it (the category openings, D64), never as the homepage LCP |
| Grading | Real event photography in large frames beats stock that looks like real work. Stock stays for mood and category imagery and is never presented as a project |

## Sources

DXB Live:
- https://dxblive.com
- https://dxblive.com/case-study
- https://dxblive.com/key-expertise/live-events

PurpleGlo:
- https://www.purpleglo.co/
- https://www.purpleglo.co/work/
- https://www.purpleglo.co/services/brand-activations/

Sela:
- https://sela.sa
- https://sela.sa/ar/
- https://sela.sa/what-we-do/

The Hanging House:
- https://www.thehanginghouse.com
- https://www.thehanginghouse.com/services.html

Balich Wonder Studio:
- https://www.balichwonderstudio.com
- https://www.balichwonderstudio.com/brand-experiences
- https://www.balichwonderstudio.com/contacts/

Jack Morton:
- https://www.jackmorton.com
- https://jackmorton.com/services/
- https://jackmorton.com/work/

Koto:
- https://koto.com/
- https://koto.com/services
- https://www.awwwards.com/studiokoto/

Locomotive:
- https://locomotive.ca/en
- https://locomotive.ca/en/work
- https://scroll.locomotive.ca/docs/

FiveCurrents:
- https://fivecurrents.com
