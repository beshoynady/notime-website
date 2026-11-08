# V · Software & Digital: "The Interface", a sales page

**Story in one line:** a blinking cursor becomes a live product, built by the team that also runs events.
**Core message (the thread of the page):** "The team that runs your event also builds your platform." / «الفريق الذي يدير فعاليتك يبني منصّتك أيضًا.»
**Conversion goal:** a booked intro call. **Secondary:** WhatsApp; register interest in a product.
**Theme:** category-pages.md §5.5: ivory ground, 8px grid, espresso device frames, champagne active states.
**Prototype:** second (CP8), after Events. Animatic: `/[locale]/lab/software-animatic`. **Not published before** the performance work (phase-1 Task 16) and a production Lighthouse run (D65).
**Decisions:** D65 (page), D66 (forms). Banned words: "cutting-edge", "innovative solutions", "digital transformation".

---

## Page order

The skeleton's six parts (README §1) stay, with sales blocks between them. Anchors are unique site-wide (checked against the existing ids: none collide).

```
 1  Opening (pinned)                         → H1, core message
 2  #case-study    Proof: UAE Athletics Federation   (switch: off until approved, OQ #17)
 3  CTA band       Book a free 30-min intro call · WhatsApp
 4  #websites … #ai-consulting   six service scenes (compact)
 5  #event-tech    where the two worlds meet (band)
 6  #how-we-work   Discover → Design → Build → Launch → Support
 7  #products      QR event check-in · Restaurant management (Coming soon)
 8  #our-work      "You're looking at our work"       (flag: off until production ≥ 90, D65)
 9  stack strip + one line on data protection
10  FAQ
11  #consult       final CTA and the consultation form (bookend)
```

**Mobile sticky bar:**
- It appears after the opening's curtain: "Book a free 30-min intro call", with a WhatsApp icon button beside it. The floating WhatsApp button hides while the bar shows (D65).
- It hides when `#consult` is in view, and while a form field has focus (the on-screen keyboard is up).
- It reserves its height at the page bottom (safe-area aware), so it never covers content or the focused element.

---

## Act 1 · Opening (pinned: desktop 2.0 vh, mobile 1.2 vh)

**Shot strip (desktop; owner: GSAP, one scrubbed timeline):**

```
 1 CURSOR                2 WIREFRAME             3 UI FILLS              4 LIVE
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│rail  · · · grid · · │ │rail ┌─HEADER──────┐ │ │rail ┌█████████████┐ │ │rail  ┌────────┐ ┌─┐ │
│                     │ │     │  HERO       │ │ │     │ Welcome أهلًا │ │ │     │ laptop │ │▯│ │
│ SOFTWARE & DIGITAL  │ │     ├──┬──┬──CARDS┤ │ │     │[btn] DEFAULT│ │ │      └────────┘ └─┘ │
│ It starts with a    │ │     └──┴──┴───────┘ │ │     └─────────────┘ │ │ SOFTWARE & DIGITAL  │
│ blinking cursor.▌   │ │ Lines become a …    │ │ The layout becomes …│ │ From idea to a live…│
│              skip ↓ │ │              skip ↓ │ │              skip ↓ │ │ ● Live       skip ↓ │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
   L0 grid, caret          L1 SVG strokes          L2 HTML UI              L2 frames, L3 glow
```
Mobile: the cursor, then the wireframe filling in, then the phone alone.

**No image layers.** The whole scene is drawn in code (grid, SVG, HTML, CSS device frames), so it costs almost nothing to load. On a page that sells development, that's part of the pitch.

### Shot 1 · The cursor

| | |
|---|---|
| **Scroll** | Desktop 0 → 0.45 vh · mobile 0 → 0.35 vh |
| **Frame** | The ivory ground with the 8px grid (taupe at 10%). The H1 is large at inline-start. A text caret after the shot line blinks three times, then holds. |
| **Layers** | L0 grid (CSS) · L3 the caret (one element; three blinks, then steady) |
| **Copy** | H1 **Software & Digital** / **البرمجيات والحلول الرقمية** · line: "It starts with a blinking cursor." / «كل شيء يبدأ بمؤشّر يومض.» |
| **Understands** | A product is about to be built, from nothing, in front of me. |
| **Transition** | Match cut: the caret stretches sideways into the first wireframe line. |

### Shot 2 · Wireframe

| | |
|---|---|
| **Scroll** | Desktop 0.45 → 0.95 vh · mobile merged into shot 2 (below) |
| **Frame** | Thin espresso lines draw the outline of a page: a nav bar, a hero block and three cards, with small-caps labels `HEADER · HERO · CARDS`. |
| **Layers** | L1 wireframe (one SVG; strokes drawn by scroll) · L0 grid |
| **Copy** | "Lines become a layout." / «تتحوّل الخطوط إلى تصميم.» |
| **Understands** | They design before they build. |
| **Transition** | Match cut: each outlined block fills in place. |

### Shot 3 · The UI fills in

| | |
|---|---|
| **Scroll** | Desktop 0.95 → 1.5 vh · mobile 0.35 → 0.8 vh (wireframe and fill merged) |
| **Frame** | The blocks fill with the brand palette: an espresso hero, champagne buttons, real text in English and Arabic. State labels appear beside one button: `DEFAULT · HOVER · ACTIVE`. |
| **Layers** | L2 UI (real HTML, `aria-hidden`; it's a picture of a site, so the text isn't read twice) · L1 wireframe fades to 0.2 |
| **Copy** | "The layout becomes a working product." / «ويتحوّل التصميم إلى منتج يعمل.» |
| **Understands** | Bilingual, on-brand and interactive from the start. |
| **Transition** | Push-in, reversed: the UI shrinks into a screen. |

### Shot 4 · Live

| | |
|---|---|
| **Scroll** | Desktop 1.5 → 2.0 vh · mobile 0.8 → 1.2 vh |
| **Frame** | The UI sits inside a laptop frame; a phone slides in at inline-end showing the same UI in its mobile layout. A small "Live" dot pulses once. |
| **Layers** | L2 device frames (CSS) · L2 UI (scaled) · L3 a soft champagne glow under the devices |
| **Copy** | **"From idea to a live product."** / **«من الفكرة إلى منتج يعمل فعلًا.»** On release, the core message line appears under the H1. |
| **Understands** | They ship real products. And the same team runs events. |
| **Transition** | Curtain into the proof section. |

**Mobile:** three shots (the cursor; the wireframe filling in; the phone, without the laptop).

**Reduced-motion still:** the shot-4 frame (laptop and phone, the UI filled, no pulse), with the four lines and the core message as one short paragraph.

**Budget:** 0 KB of images; one GSAP timeline; the UI is ~40 DOM nodes.

---

## 2 · Proof: a national sports federation (`#case-study`, the peak)

**Two variants, one switch (D67):** `caseStudies.uaeaf.named` (false).
- **Anonymised (default, shown now):** "A national sports federation" / «اتحاد رياضي وطني».
  - No name, no logo, no real screenshots, no URL.
  - The devices show **stylised mockups** redrawn in the brand palette: an abstract layout of a header, a results table and athlete cards as grey bars, in HTML/CSS. Nothing of the client's branding.
- **Named (after the client approves, OQ #17):** "UAE Athletics Federation", the real p18 screens in the device frames (`uae-athletics-federation-1`, 1544 × 965 in the laptop; `-2`, 459 × 1048 in the phone), and the live URL. Flipping the one flag switches every text and visual.

**Facts (both variants):** only from the profile (p16, p18; `docs/content/case-studies.md` §2). Anything else is `{{TODO}}`. The federation's own statistics seen in the screenshots are never quoted as ours.

| Part | Anonymised (default; EN draft, AR written natively with the copy deck) | Named variant adds |
|---|---|---|
| Eyebrow | Case study · A national sports federation | · UAE Athletics Federation |
| Title | "A national federation's platform, rebuilt and live." | — |
| Challenge | "A full rebuild of the federation's digital platform." (p18) · `{{TODO}}`: the starting point and what had to change. | — |
| Solution | "A modern bilingual website with a complete CMS and a connected mobile application." (p18) NO TIME is the federation's official digital and media partner (p16). | — |
| What we built | Bilingual website · mobile app · CMS · admin dashboard and analytics (p18). The module list (athletes, clubs, coaches, referees; championships, results and records; news and live coverage) stays: it describes the build, not the client. | — |
| Result | All live: website, admin panel and mobile app (p18) · `{{TODO}}`: platform results (no numbers until supplied). | the URL uaeathletics.ae |

**Visuals:**
- Both variants use the same CSS laptop and phone frames as the opening (a visual rhyme).
- Anonymised: the stylised mockups described above. Named: the profile screens. Fresh screenshots of the live site only with the client's approval.

**Motion (GSAP, the page's one big scene after the opening):**
- The devices slide in on entry, then the four parts reveal in sequence (no pin).
- "What we built" draws as a checklist, one line per 80 ms.

**Reduced:** everything visible.
**Analytics (later):** `case_study_view` once when the section is 50% visible.

---

## 3 · CTA band

- **Button:** "Book a free 30-min intro call" / «احجز مكالمة تعارف مجانية (30 دقيقة)» → `#consult`.
- **Microcopy under the button:** "No obligation. We'll reply within one working day." / «دون أي التزام. نرد خلال يوم عمل.»
- **Secondary:** "Chat on WhatsApp", a link from `src/config/contact.ts`. It's hidden while the number is missing.

## 4 · What we build (six compact service scenes)

- **Section contents:** each section keeps README §6, with 3 deliverables (D65). The module sits beside the text on desktop and below it on mobile.
- **Quote CTA:** "Book a free 30-min intro call" pre-filled with the service (`?service=<anchor>#consult`).
- **Folded services (D65):** CMS work lives in Websites; dashboards live in Custom systems.

| # | Service | Outcome line (proposal) | 3 deliverables (proposal; copy deck confirms) | Module |
|---|---|---|---|---|
| I | Websites | A bilingual site your team can update itself. | Arabic and English with full RTL · a CMS your team runs · SEO and performance from day one | `responsive-frames` |
| II | Mobile apps | iOS and Android apps, connected to your website. | iOS and Android · one content source with your site · release and updates | `app-screens` |
| III | Custom systems | Dashboards, admin panels and integrations, built around how you work. | Admin dashboards and analytics · roles and permissions · integrations with your tools | `data-flow` |
| IV | E-commerce | An online store, from the catalogue to the checkout. | Catalogue management · checkout and payment integration · an orders dashboard | `checkout-flow` |
| V | UI/UX design | Interfaces people understand on first use. | User flows and wireframes · clickable prototypes · a design system | `fidelity-slider` |
| VI | AI consulting | Where AI helps your team, where it doesn't, and how to start. | A review of your processes · a pilot plan · team onboarding | `ai-sorter` |

**Entrance (each):** one hero motion. The section's state label (`DEFAULT` → `ACTIVE`) switches as it arrives, then the stagger. That's the theme's signature: visible state labels.

## 5 · Event technology (`#event-tech`, a dark interface band)

- **Eyebrow:** "Event technology".
- **Heading:** "Built by people who run events." / «تبنيها فرقٌ تدير الفعاليات بنفسها.»
- **Three items:**
  1. **Registration and check-in.** Links to the QR check-in product (Coming soon).
  2. **Event apps and websites.** Agenda, speakers, live updates.
  3. **Live results and screens.** The federation platform's championships, results and live coverage are the real reference (anonymised unless the case study is named, D67).
- **Motion:** the band's grid lines draw on entry (GSAP).
- **Why a band:** this is the page's second high point, where NO TIME's two worlds meet.

## 6 · How we work (`#how-we-work`)

- **Steps:** Discover → Design → Build → Launch → Support, as a horizontal timeline on desktop (vertical on mobile) that builds with scroll (GSAP, no pin). It starts at inline-start and mirrors in AR.
- **Notes under the steps:** "Bilingual by default" · "Performance and SEO built in" · "Support after launch". The last one opens the door to recurring work.

## 7 · Products (`#products`, Coming soon)

Two cards: QR event check-in and Restaurant management. Their names are placeholders until confirmed (OQ #5). Each card has:

- **A concept screen** in HTML in a device frame, labelled **"Preview" / «معاينة»**.
- **A problem statement:** one sentence. Proposals: QR, "Queues at the door, and no clear picture of who has arrived." Restaurant, "Orders, tables and the kitchen, out of step at the busiest hour."
- **4–6 features:** drafts, which **the client must confirm** (new OPEN_QUESTIONS #24, since an unreleased product's features are claims):
  - QR: QR invitations · check-in at the door from a phone · live arrivals for the team · guest list import · bilingual
  - Restaurant: table and order management · kitchen display · menu management · end-of-day summary · bilingual
- **Register interest form:** name, company, email, and event type (QR) or restaurant type (restaurant), plus the privacy notice and Turnstile (D66).
  - Proposed options. Event type: Conference, Exhibition, Gala or wedding, Sports event, Other. Restaurant type: Café, Casual dining, Fine dining, Cloud kitchen, Other.
- **When `status` becomes `live`,** the card's form becomes "Request a demo" (the data model already has `comingSoon | live`).

## 8 · "You're looking at our work" (`#our-work`, flag off, D65)

- **Shows:** this site's measured mobile Lighthouse scores, read at build time from the latest production summary (the date and URL measured are shown with them). Plus:
  - "Arabic and English, with full right-to-left layout";
  - the performance budget the page meets (measured page weight);
  - accessibility (the measured score).
- **Toggle:** "Show the layers" / «اعرض الطبقات». Motion explodes the opening's own layers (grid, wireframe, UI, devices) into a tilted stack, labelled L0–L3. That's honest and costs no images.
- **Ownership:** the toggle animates a wrapper; the layers inside keep their GSAP ownership. Two elements, two owners.
- **Switch-on rule:** the production domain measures 90+ on mobile in every category. The numbers come only from the summary file and are never typed in.

## 9 · Stack and data protection (a quiet strip)

- **Stack:** "Next.js · React · TypeScript · Node.js · iOS and Android". Text only, no logos, no versions.
- **One line:** "Data protection is part of the build, designed with the UAE's data protection law (PDPL) in mind." Needs a legal check before launch: CONTENT_CHECKLIST #24 covers the policy.

## 10 · FAQ

Written with the copy deck. Proposed topics: how long a typical website takes (process only, no promised dates), who owns the code and content, support after launch, Arabic quality, hosting. Answers needing client facts are `TODO` keys.

## 11 · Final CTA and the consultation form (`#consult`, the bookend)

- **Bookend:** the opening's blinking caret returns in the form's first field, "What do you want to build?", which has focus styling but no autofocus. The line above the form: "Your idea is the next blinking cursor." / «فكرتك هي المؤشّر الذي يومض الآن.»
- **Fields (D66):**
  - name\*;
  - company;
  - email or WhatsApp\* (at least one);
  - what you want to build\* (a textarea, plus a service select pre-filled from `?service`);
  - timeline (ASAP · 1–3 months · 3–6 months · just exploring);
  - budget range (AED bands to be confirmed, CONTENT_CHECKLIST #25, plus "Prefer not to say");
  - the privacy notice and Turnstile.
- **Submit:** "Book a free 30-min intro call", with the microcopy under it.
- **Success:** "Thanks, {name}. We'll reply within one working day to set a time." (the request is received; no time slot is booked).
- **Errors:** inline under each field (`aria-describedby`), plus an error summary that takes focus after a failed submit.

---

## SEO

- **Title:** EN "Website and App Development in Dubai | NO TIME" / AR «تطوير المواقع والتطبيقات في دبي | NO TIME».
- **Description (EN, ~150 chars):** "Bilingual Arabic–English websites, mobile apps, event registration systems and custom platforms, built in Dubai by the team that also runs events."
- **H1 stays "Software & Digital".** The search intents live in the title, the description, the H2s and the copy.
- **Candidates for future standalone SEO pages** (D57, out of scope now):
  - "website development Dubai";
  - "mobile app development UAE";
  - "event registration system";
  - "bilingual Arabic English website".

## Analytics (planned; implemented later with the analytics setup and the consent banner)

| Event | When | Properties |
|---|---|---|
| `consultation_submit` | server-confirmed success | `service`, `locale`, `source` (cta band, service card, final) |
| `interest_submit` | server-confirmed success | `product`, `locale` |
| `whatsapp_click` | any WhatsApp link | `placement` (cta band, sticky bar, floating, final) |
| `case_study_view` | `#case-study` 50% visible, once per visit | `case` (`uaeaf`) |

## Homepage tie-in

The "Beyond events: Digital solutions" section becomes a dark interface band:

- espresso ground with the 8px grid in champagne at 6%;
- the core message as its heading;
- the case-study teaser (anonymised by default, named once the switch is on, D67);
- the two product cards (existing);
- the CTA "Explore Software & Digital" → `/services/software-digital`.

Its four capability cards link to the matching sections (`#websites`, `#apps`, `#systems`, `#e-commerce`).

---

## Beat sheet

| Beat | Where | Intensity | Note |
|---|---|---|---|
| Arrival | Shot 1 | 1 | Cursor, H1 |
| Build | Shots 2–3 | 3 | Wireframe, then the UI fills |
| First peak | Shot 4 | 4 | Live devices, core message |
| **Peak** | **Case study** | **5** | Real, live work for a national federation |
| Ask | CTA band | 3 | First conversion point |
| Scan | Services I–VI | 2–3 | Compact, fast to read |
| Second peak | Event tech | 4 | The two worlds meet |
| Build | How we work | 3 | Timeline builds |
| Calm | Products | 2 | "Coming soon", honest |
| Calm | Our work (when on) · stack · FAQ | 1–2 | Quiet credibility |
| CTA | Consult, bookend | 3 | The cursor returns |

## Open items for this page

- OQ #17: UAEAF name and logo approval (the `named` switch; the anonymised case study shows until then, D67).
- OQ #5: product names.
- New OQ #24: product feature lists.
- CONTENT_CHECKLIST #25: budget bands.
- CONTENT_CHECKLIST #7: contact details (WhatsApp).
- The PDPL line: legal check (CONTENT_CHECKLIST #24).
