# Project Brief — NO TIME Creative House Website

## 1. Client & context

- **Client:** NO TIME Creative House, a luxury events, creative, and marketing agency based in Dubai.
- **Owner:** Rand.
- **Markets:** UAE, Saudi Arabia, Egypt, Qatar, Oman, Kuwait.
- **Project type:** a rebuild. The current single landing page becomes a full multi-page corporate site with a new brand identity.

## 2. Brand identity

| Name | Hex |
|---|---|
| Deep Espresso | `#2E2017` |
| Cocoa Brown | `#634731` |
| Warm Taupe | `#BB9A79` |
| Champagne Beige | `#EAD4AB` |
| Vanilla Ivory | `#F5E9D3` |

- **Fonts:** Montserrat (English), Alexandria (Arabic).
- **Logo text:** "NO TIME Creative House".

## 3. Languages

- English is the default, at `/en`. Arabic is at `/ar`, reached through a toggle in the header.
- Content is written in English first. The Arabic is written natively, not translated word for word.
- The Arabic layout is fully RTL (see the RTL rules in `CLAUDE.md`).

## 4. Homepage direction: "Hybrid"

- The first 5 seconds feel **calm, cinematic, and luxurious**.
- The sense of **joy comes from scroll interaction** further down the page.
- **Goal:** the visitor goes on to explore the services.
- A floating **WhatsApp button** is always visible.
- **Motion intensity rises** as the visitor scrolls down.

### Homepage section order

1. **Hero:** cinematic AI imagery with slow parallax / Ken Burns; a giant headline revealed letter by letter; a single "Explore our services" CTA.
2. **About:** one large statement whose words colour in as you scroll.
3. **Five categories:** cards that expand and reveal an image on hover (on scroll for mobile).
4. **Our Work:** real projects first.
5. **Services marquee:** all 30 services (reverses direction in Arabic).
6. **Beyond Events — Digital Solutions:** a visually distinct section showing custom development plus 2 product cards.
7. **How we work:** 4 steps that build up as you scroll.
8. **Six markets.**
9. **Final CTA** and footer.

## 5. Services

- 30 services in 5 categories:
  1. Events & Hospitality
  2. Creative Production
  3. Marketing & Brand (includes PR)
  4. Production, Print & Gifts
  5. Software & Digital Solutions
- One service-page template, driven by a single data file (`src/content/`).
- The full approved list: [docs/content/services-list.md](content/services-list.md). **TODO:** the user will paste it.

## 6. Our Work

- Real photos: about 75 from the old company profile PDF, plus the UAE Athletics Federation case study.
- Each project is presented as **Challenge → Idea → Execution → Result**.
- Real projects that have no photos get AI images with a visible **"Illustrative" / "صورة توضيحية"** label.

## 7. Software & Digital (strategic priority: long-term work)

- **Custom development services:** websites, apps, internal systems, e-commerce.
- **Two products in development**, both marked "Coming Soon":
  - QR event check-in system
  - Restaurant management system
- Product names are TBD (see OPEN_QUESTIONS).
- **Each product page includes:** a problem statement, 4–6 features, concept screens labeled "Preview", and a "Register interest" form.
- **Data field** `status: "comingSoon" | "live"`. When it is set to `live`, the page CTA switches to "Request a demo". No redesign needed.

## 8. Trust & success elements

- Showreel
- Team / founder section
- Client logos and testimonials
- Smart quote-request form
- Any element whose material is missing becomes a clear placeholder or stays hidden until Rand provides it. Nothing is faked.

## 9. Forms (no separate backend, no dashboard)

- **Pipeline:** Next.js Server Actions → Resend sends a branded email (React Email) to Rand and a confirmation email to the client.
- **Optional:** log each submission to a Google Sheet as a lightweight dashboard (deferred).
- **Spam protection:** Cloudflare Turnstile plus a honeypot field.
- **Fallback:** a WhatsApp link with a prefilled message.
- **Quote form fields:** event type, date, guests, budget range, contact details.
- Validation: React Hook Form + Zod, with the same schema shared by client and server.

## 10. Legal pages

- Privacy Policy, Terms of Use, Cookie Policy.
- Written with the **UAE PDPL** (Federal Decree-Law No. 45 of 2021) in mind.
- Must list the third-party processors: Resend, Google, Cloudflare, and the analytics provider.
- **Must be reviewed by a legal professional before launch.**

## 11. SEO

- Bilingual metadata for every page.
- `hreflang` alternate links between `en` and `ar` (plus `x-default`).
- `sitemap.ts` and `robots.ts`.
- JSON-LD: `Organization`, `LocalBusiness`, `Service`.
- OG images (per locale).
- Speed treated as an SEO factor (Lighthouse 90+ on mobile).

## 12. Hosting & analytics

- Hosting on **Vercel**.
- **Vercel Analytics or GA4**, loaded only after consent through a cookie banner (deferred).

## 13. Content storage

- TypeScript data files in `src/content/` for now.
- The architecture stays CMS-ready (Sanity) in case it is needed later (deferred).

## 14. Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next-intl
- GSAP + ScrollTrigger + SplitText, Motion, Lenis
- React Hook Form + Zod, Resend + React Email, Cloudflare Turnstile
- shadcn/ui (Base UI), Lucide icons

Exact versions: see [DECISIONS.md](DECISIONS.md).

## 15. Deferred (documented, not installed)

- Google Sheets integration (submission log)
- Sanity CMS
- Analytics (Vercel Analytics / GA4) plus the consent banner

## 16. Non-goals

- No talent or influencer section.
- No pricing.
- No fake claims or fake reviews.
- No direct comparison with other agencies.
