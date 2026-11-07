# Services reconciliation: 2026 profile vs site draft vs approved list

Three sources:

- **Profile:** `docs/brand/company-profile-2026.pdf`, sections 02–13 (text in `profile-copy.md`). This is the client's own 2026 description of what NO TIME sells.
- **Draft:** `src/content/services.ts`. These are 30 services in 5 categories, taken from the reference prototype, all `status: "draft"` (OPEN_QUESTIONS #11).
- **Approved list:** `docs/content/services-list.md`. It is still empty (TODO, OPEN_QUESTIONS #2), so the right-hand side of every comparison is the draft, not an approved list.

**Nothing in `services.ts` or `categories.ts` has changed.** This document proposes; the user confirms. Slugs become URLs, so the list should be settled before service pages are built.

## 1. Draft service by draft service

Key:

- **✓ Profile** — the profile names it.
- **≈ Profile** — the profile covers it under another name.
- **✗ Not in profile** — the draft has it and the profile is silent.

| Draft category | Draft service | Profile evidence (section) | Status | Proposal |
|---|---|---|---|---|
| Events & Hospitality | Conferences & summits | "Corporate & government" events (02); Sandoz stand at a paediatric conference (02, p8) | ≈ | Keep. Title could be "Corporate & government events" |
| | Exhibitions & booths | "Exhibitions", "Mall & exhibition stands" (02); EgyptAir at ATM and the Dubai Airshow (08); Smith Gulf "exhibition stands & fabrication" (09) | ✓ | Keep. It is the best-evidenced service in the profile |
| | Product launches | none | ✗ | Ask the client. "Brand activations" (02) is the nearest profile term |
| | Galas & private events | "Gala & wedding décor" (02); "Private & luxury celebrations": baby receptions, showers, intimate gatherings (03) | ✓ | Keep. The profile gives private celebrations a whole section; consider making it its own service |
| | Hospitality & guest management | "Guest experience" (02); "Catering": private service, majlis, corporate hospitality, desserts, beverages, table styling, buffet styling, boardroom hospitality (12) | ≈ | Keep, but the profile's offer is **catering**. Rename or split (see §2) |
| | Stage & technical production | "Technical setup" (02); "Sound & lighting": stage design, rigging, DJ & live sound (13) | ✓ | Keep |
| Creative Production | Photography | "Photography & videography": food styling, product, event coverage (11); "On-ground coverage & photography" (UAEAF, 17) | ✓ | Keep |
| | Video production | "Cinematic product & brand films"; "Editing, sound design & post-production" (06); videography (11) | ✓ | Keep |
| | Motion graphics | "Motion graphics & logo animation" (06) | ✓ | Keep |
| | AI content creation | Section 06: AI video ads & reels, AI imagery & campaign key visuals; UAEAF Oregon 26 "Produced with AI" | ✓ | Keep. Strong evidence |
| | Set & stage design | "Stage design" (13); "Décor", "Floral design · styling" (02); "Décor & floral direction" (03) | ≈ | Keep. Consider "Décor, floral & set design": décor and florals appear on 4 profile pages, more than stages |
| | Equipment & camera rental | none | ✗ | Ask the client. The profile never offers rental |
| Marketing & Brand | Branding & identity | "Tournament branding" (UAE PL, 05); "Brand & campaign strategy" (04) | ≈ | Keep. The profile has no stand-alone identity work. Ask whether NO TIME sells logo and identity design |
| | Social media management | Section 05 (content systems, design, community, growth); UAEAF case (17) | ✓ | Keep. Strong evidence |
| | Digital marketing & SEO | "Performance & paid media", "Analytics & reporting" (04); "Paid campaigns & community growth" (17); "SEO & performance" (07) | ✓ | Keep. Title could be "Performance & paid media" |
| | Content strategy | "Content strategy & monthly calendar" (17); "Content systems" (05) | ✓ | Keep |
| | Public relations | Section 08: on-site PR management and media coverage | ✓ | Keep. Press claims stay off the site until confirmed (OQ #19) |
| | Media planning | none by that name; "paid media" (04) | ≈ | Merge into "Performance & paid media", or ask |
| Production, Print & Gifts | Large-format printing | Screen printing and UV are listed for gifts only (10) | ✗ | Ask the client |
| | Event signage | none by name; "Tournament branding and on-ground production" (05) | ≈ | Keep only if confirmed |
| | Packaging design | "Custom packaging" (UAE Pro League Awards, 10) | ✓ | Keep |
| | Corporate gifts | Section 10: "Curated corporate gifts produced to brand standard — screen printing, UV, foiling, debossing and laser engraving" | ✓ | Keep. Strong evidence |
| | Online print store | none | ✗ | Ask. It reads like a product, not a service; it may belong with the two products (OQ #5) |
| | Branded merchandise | T-shirt and jersey mock-ups (10, pp. 23–24) | ≈ | Keep, or merge into Corporate gifts |
| Software & Digital | Websites | Section 07; uaeathletics.ae, live (18) | ✓ | Keep. Strong evidence |
| | Mobile apps | "Mobile applications: iOS & Android, connected to the web" (07); UAEAF app (18) | ✓ | Keep |
| | Custom systems | "CMS & dashboards: admin panels, publishing & analytics"; "Integrations & APIs" (07) | ✓ | Keep. Title could be "CMS, dashboards & integrations" |
| | E-commerce | none | ✗ | Ask the client |
| | UI/UX design | "UX / UI design: research, flows & design systems" (07) | ✓ | Keep |
| | AI consulting | none: section 06 is AI **content**, not consulting | ✗ | Ask. Drop if NO TIME does not sell it |

**Count:**

- **✓ 17:** in the profile under the same or a near-same name.
- **≈ 7:** covered under another name.
- **✗ 6:** not in the profile.
  - Product launches
  - Equipment & camera rental
  - Large-format printing
  - Online print store
  - E-commerce
  - AI consulting

## 2. In the profile, missing from the draft

| Profile offer (section) | Evidence | Proposal |
|---|---|---|
| **Catering** (12) | Four pages: private service, majlis, corporate hospitality, signature desserts, beverages, table styling, buffet styling, boardroom hospitality | Add as a service (Events & Hospitality), or rename "Hospitality & guest management" to "Catering & hospitality" |
| **Private & luxury celebrations** (03) | Baby receptions, showers, intimate gatherings; concept decks, décor, giveaways, photobooths, on-day production | Split from "Galas & private events", or make that service clearly about private celebrations |
| **Heritage & traditional hospitality** (13) | Majlis setups, desert tents, Arabic coffee service, heritage carts, live stations, welcome ceremonies | Add (Events & Hospitality). It is distinctive for the Gulf market and well photographed |
| **Brand activations** (02) | "Brand activations · mall & exhibition stands"; Ultimate Power Solution stands with robotics (p7–8) | Add, possibly replacing "Product launches" |
| **Technology & robotics experiences** (02) | "Exhibitions · technology & robotics experiences" (p7) | Fold into Brand activations or Exhibitions; ask |
| **Fabrication** (09) | Smith Gulf: "design, fabrication and installation of exhibition stands, activations and branded environments" | Add to "Exhibitions & booths" (as one service: design, build, install) or to Production, Print & Gifts |
| **Ceremonies & award nights** (02) | "Ceremonies · award nights · corporate & government"; UAEAF recognition ceremony; UAE PL award ceremonies | Add, or fold into "Conferences & summits" renamed "Corporate, government & award events" |
| **Sports events** | UAE Pro League: "full event delivery … tournament branding … award ceremonies and sponsor activation" (05); UAEAF | Not a separate service in the profile; best shown through Our Work |
| **Photobooths & guest moments** (03) | Listed under private celebrations | Part of private celebrations; no separate service |
| ~~Entertainment: Arabic singers, oud players~~ (13) | Talent booking | **Excluded** (project rule: no talent content) |
| ~~Celebrity & influencer network~~ (14) | Named roster | **Excluded** (project rule) |

## 3. Categories

The profile is organised in 13 sections, not 5 categories. The draft's five categories still hold most of it:

| Draft category | Profile sections it holds | Fit |
|---|---|---|
| Events & Hospitality | 02 Events, 03 Private & luxury celebrations, 12 Catering, 13 Traditional food & decoration, 13 Sound & lighting | Good. This is the profile's heaviest area (about half its pages) |
| Creative Production | 06 AI content & motion, 11 Photography & videography | Good |
| Marketing & Brand | 04 Marketing, 05 Social media, 08 PR | Good. The profile's cover line is "Events · Marketing · PR · Production" |
| Production, Print & Gifts | 09 Production (fabrication), 10 Gift items | Good. "Print" has the least evidence |
| Software & Digital | 07 Digital platforms | Good. Strongest single case (UAEAF platform, live) |

No category change is proposed. One question for the client: whether **PR** should be named in a category title, as the profile's cover line does ("Marketing, PR & Brand").

## 4. Questions for the client (to OPEN_QUESTIONS #11)

1. Confirm or drop the six services with no evidence in the profile: product launches, equipment & camera rental, large-format printing, online print store, e-commerce, AI consulting.
2. Add catering, heritage hospitality, private celebrations, brand activations and fabrication as services?
3. Each category has 6 services in the draft. Is a fixed 30 (6 × 5) still required, or can the count follow the offer?
4. Is "Online print store" a service or a product (alongside the QR check-in and restaurant systems)?
