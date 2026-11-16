# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: corporate and government buyers in the Gulf.** Marketing, events and communications managers at companies and government entities in the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Egypt. They brief an agency for a launch, a conference, an exhibition, an award night or a campaign. They often arrive from a referral and need to forward the site to a manager who decides.
- **Secondary: private clients.** Families and individuals planning weddings, galas and private celebrations, mostly arriving from Instagram on a phone. They get their own warm, visual path.

## Product Purpose

The website of NO TIME Creative House, a Dubai creative house for events, creative production, marketing, print and gifts, and software. It has two jobs:

1. **Confirm trust for referrals:** real work, real markets, and pages easy to forward to a manager.
2. **Win new clients from search and social media:** mobile-first, with fast paths to WhatsApp and the quote form.

Success: a qualified brief or WhatsApp conversation, and a visitor who goes on to explore the services.

## Positioning

One senior team you deal with directly, from the first sketch to the day it goes live: events, production, marketing, print and software under one roof, in Arabic and English natively (each language written as itself, not translated). Fewer vendors, less overhead, the same premium standard.

## Operating Context

- Visitors read on phones first (search, Instagram, WhatsApp links), and forward pages to decision makers on desktop.
- Two locales: English at `/en` (default) and Arabic at `/ar`, fully RTL.
- Contact paths: the quote form (Contact page and each category's quote block), WhatsApp with a prefilled message, email. Forms are emailed (Resend) behind Cloudflare Turnstile and a honeypot; there is no dashboard.
- Based in Dubai; works across six markets.

## Capabilities and Constraints

- 30 services in five categories, each category a designed page with its own theme: Events & Hospitality, Creative Production, Marketing & Brand (with PR), Production, Print & Gifts, Software & Digital. Approved list: `docs/content/services-list.md`.
- Software & Digital is a strategic, long-term line: custom websites, apps, internal systems and e-commerce, plus two products in development, both "Coming soon": Minute Zero (QR event check-in) and Peak Hour (restaurant management).
- Work is presented as Challenge → Idea → Execution → Result. Clients stay anonymous until each one approves being named.
- No pricing. No direct comparison with other agencies. No talent or influencer content.
- Next.js 16, content in typed data files (`src/content/`), CMS-ready. Hosting: Hostinger (Node.js app).
- Undecided: the client logos, testimonials, team section and showreel (hidden until real material arrives); the NDA FAQ (hidden until the owner answers).

## Brand Commitments

- Name: "NO TIME Creative House". Line: "It's time to start." / «حان وقت البداية».
- Palette, fonts (Montserrat EN, Alexandria AR) and the approved styleguide: `docs/design/notime-styleguide.html` and `CLAUDE.md`.
- Voice: calm, confident, premium; Gulf-native Arabic, never a word-for-word translation (`docs/content/copy-ar-rewrite.md`).
- The site never mentions AI (D106).

## Evidence on Hand

- About 75 real photos from the company profile (`public/images/work/`) and the profile PDF's copy.
- Three anonymised cases with verified facts (`src/content/work.ts`): an airline's pavilion at the Dubai Airshow, a national football league's award nights, a national sports federation's website, app and channels (with first-week campaign figures).
- This website itself, as proof of the software team's work.
- **Absent, never to be fabricated:** client logos, testimonials, ratings, awards, years in business, project counts, team photos, a showreel. Missing material is hidden or shown as an honest placeholder (fill-or-hide, D78).

## Product Principles

1. **Proof over promise:** every claim is backed by real work or stays off the page.
2. **One team, felt everywhere:** each page shows that the crafts connect, not five separate vendors.
3. **Phone first, forward-ready:** fast to a WhatsApp or a brief on a phone, clear enough to forward to a manager.
4. **Two native languages:** Arabic and English are equal; neither reads as a translation.
5. **Premium restraint:** calm first, delight on scroll; nothing loud, nothing fake.

## Accessibility & Inclusion

WCAG 2.1 AA (checked at each milestone's quality gate), full RTL, `prefers-reduced-motion` honoured everywhere (the reduced variant shows the final state).
