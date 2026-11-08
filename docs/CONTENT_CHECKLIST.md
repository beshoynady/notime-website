# Content Checklist — Material needed from Rand

Status values: **Missing** · **Requested** · **Received** · **Approved**

| # | Item | Notes | Status |
|---|---|---|---|
| 1 | Showreel video | Hero/trust section. Needs a web-optimized version plus a poster frame. | Missing |
| 2 | Team photos and bios | Team / founder section. Consistent style preferred. | Missing |
| 3 | Founder story | Rand's story, in her own words (EN; AR written natively). | Missing |
| 4 | Client logos **and permission to use them** | Written permission needed for each logo. | Missing |
| 5 | Testimonials | Real quotes with name, title, company, and consent. | Missing |
| 6 | Past-work details | Per project: Challenge → Idea → Execution → Result, date, location, client (if publishable). Drafts from the 2026 profile: `docs/content/case-studies.md`. Placeholder keys: `work.todo.title`, `work.todo.summary`. | Missing |
| 7 | Contact info and social URLs | Phone, email, WhatsApp number, address, social profiles. | Missing |
| 8 | Dubai trade license details | License number, legal entity name, and issuing authority (footer and legal pages). Placeholder key: `footer.licence`. | Missing |
| 9 | Domain | Domain name plus DNS access for Vercel and Resend (email sending domain). | Missing |
| 10 | Approved list of 30 services | Approved 2026-11-07 (DECISIONS D56): `docs/content/services-list.md`, live in `src/content/services.ts` (status `approved`). | Approved |
| 11 | Final product names | QR event check-in system and restaurant management system; working names in `src/content/products.ts`. OPEN_QUESTIONS #5. | Missing |
| 12 | Contact fields for the site | `src/config/contact.ts`: email, WhatsApp number (or `NEXT_PUBLIC_WHATSAPP_NUMBER`), Instagram URL, Facebook URL. Until filled, the WhatsApp button shows "number pending". | Missing |
| 13 | Images for 18 slots | Slot list in `src/content/images.ts`; prompts in `docs/content/image-prompts.md` (Task 14). Each slot shows a designed placeholder until a file is added. 7 slots use real profile photos (D49). 4 slots carry an AI image until their client approves, then swap to the real photo (`// TODO: swap to real photo after approval`): `cat-production-print-gifts-4x5` (→ UAE Pro League gift photos: `uae-pro-league-5`, and the p24-1 gift box once a clean original arrives, OQ #21), `cat-software-digital-4x5`, `cat-software-digital-16x9`, `cat-marketing-brand-16x9` (OQ #17). | Missing |
| 14 | Logo as SVG (all 4 variants) | The site uses trimmed PNGs exported from `docs/brand/logo-source/` by `scripts/export-logos.mjs` into `public/images/brand/logo/`. Replace them with the designer's SVG/AI files, including a dark-background version with a legible tagline (OPEN_QUESTIONS #12). | Missing |
| 15 | Client-name and logo permission, per client | UAE PL, UAEAF, EgyptAir, Ultimate Power Solution, Smith Gulf, Sandoz, Emirates Driving Institute, ADIB. OPEN_QUESTIONS #17. | Missing |
| 16 | Consent for photos of identifiable people | 19 profile photos (`docs/content/profile-inventory.md`, "Pending rights"). OPEN_QUESTIONS #18. | Missing |
| 17 | Confirmed press coverage | Links or dated scans for each outlet on profile pages 19–20. None shown until then. OPEN_QUESTIONS #19. | Missing |
| 18 | NO TIME's role in the page 12–13 portals and accounts | OPEN_QUESTIONS #20. | Missing |
| 19 | Full-resolution originals | Smith Gulf, EgyptAir, food styling, UAE PL Awards box without the carousel badge. OPEN_QUESTIONS #21. | Missing |
| 20 | Rental equipment inventory | Which cameras, lenses, lights and audio NO TIME rents out (names and key specs, no prices). Feeds the rental catalogue on the Creative Production page (`docs/design/category-pages.md` §6, #12). OPEN_QUESTIONS #22. | Missing |
| 21 | Online print store status | Does the store exist today, or is it planned? If it exists: its link and the item types. OPEN_QUESTIONS #23. | Missing |
| 22 | Category page copy | Per category: intro (2–3 sentences), 4–6 FAQ, and 4–6 "what we deliver" points per service. Placeholders start with `TODO:` in `src/content/categories.ts` and `services.ts` until each category's copy deck (phase-2 plan, Task 3.1 and later). Facts only from the profile; anything else is asked, not guessed. | Missing |
| 23 | Form accounts handover (D66) | Before launch: move the Resend and Cloudflare (Turnstile) accounts to the company email, verify the company domain in Resend (SPF/DKIM) and set `CONTACT_TO_EMAIL` to the company inbox. Until then they run on the user's accounts. | Before launch |
| 24 | Privacy Policy full text | The page is a stub (D66). Needs the company's legal name, address, contact for data requests and retention periods; reviewed for the UAE PDPL. | Missing |
| 25 | Budget ranges for the consultation form | The AED bands the visitor can choose from (plus "Prefer not to say"). Until confirmed the field shows placeholder bands marked TODO. | Missing |
