# Open Questions

Items that need an answer from Rand or the user before the related work can be built. When one is answered, record the answer in `DECISIONS.md` and remove it from this list.

## Content & CMS
1. **Does Rand need to edit content herself?** The answer decides between TypeScript data files (current plan) and Sanity CMS.
2. **Full list of the 30 services:** to be pasted by the user into `docs/content/services-list.md`.
3. **Location of the brand assets:** the ~75 photos and the logo variants from the old landing project. Where are they?

## Forms
4. **Where should form submissions go:** email, WhatsApp, or both?

## Products
5. **Product names** for the QR event check-in system and the restaurant management system.

## Added during setup
6. **shadcn/ui component base:** `shadcn init --defaults` chose the `base-nova` style, built on **Base UI** (`@base-ui/react`) rather than Radix. Keep Base UI, or switch to Radix before any components are added? (Easy to change now; harder later.)
<!-- #7, #8 and #9 were resolved in Phase 1: see DECISIONS D26–D28. -->
10. **npm audit:** `npm install` reports 12 vulnerabilities (4 low, 8 moderate) in transitive dependencies. Review them before launch. `npm audit fix --force` was **not** run, because it can introduce breaking changes.

## Added in Phase 1
11. **Services list still uses the prototype draft.** `src/content/services.ts` holds the 30 services (6 per category) from `docs/design/notime-styleguide.html`, all marked `status: "draft"`. Approve this list or paste the final one into `docs/content/services-list.md`; slugs become URLs, so they should be fixed before service pages are built.
12. **Dark-background logo.** Need a dark-background logo version from the designer (tagline in taupe or champagne) plus SVG/AI files for all variants. In the supplied dark-bg PNGs (`logo-4`, `logo-2`) the cocoa parts sit on espresso at about 1.9:1: the "CREATIVE HOUSE" tagline in both, plus the "NO" mark in `logo-4` and "TIME" in `logo-2`. The tagline is hard to read at header size. The site uses the files as supplied (never recoloured) until the designer sends a fixed version.
13. **Gotham web licence.** The brand guide lists Gotham as primary and Montserrat as secondary. Will the client buy a Gotham web licence? If yes, swap it in for display and headings. Until then Montserrat stays the site's primary face (DECISIONS D36).
14. **Font loading: brand face on first visits, or zero layout shift?** (technical decision for you, not the client) With `display: optional` (current, D38) CLS is 0, but on a cold first visit the hero title and nav usually render in the fallback face for that page view (see `docs/checkpoints/checkpoint-3/cold-first-visit-en-1440.png`); the brand faces appear from the next page load. With `display: swap` the brand faces appear within the first second on every visit, at a measured CLS of 0.020 on desktop first visits only (0 on mobile and on repeat visits; Google's "good" threshold is 0.1). Recommendation: `swap`. It is a one-line change in `src/lib/fonts.ts`, plus loosening `e2e/cls.spec.ts` to < 0.05 on desktop first visits.
15. **Hero line: "IT'S TIME TO CREATE." or the profile's "IT'S TIME TO START."?** The 2026 company profile uses "IT'S TIME TO START." as its official line; the site currently uses the approved reference's "IT'S TIME / TO CREATE.". Being confirmed with the client. Task 11b adds the alternate as a hero variant.
16. **`.gitignore` entry ` /docs`.** Someone added `# docs` and ` /docs` (with a leading space) to `.gitignore`. Because of the leading space, the pattern matches nothing and `docs/` is still tracked. Should `docs/` really be ignored? Committed as found in `chore: session handoff`; no files were untracked.
