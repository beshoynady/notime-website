# Open Questions

Items that need an answer from Rand or the user before the related work can be built. When one is answered, record the answer in `DECISIONS.md` and remove it from this list.

## Content & CMS
1. **Does Rand need to edit content herself?** The answer decides between TypeScript data files (current plan) and Sanity CMS.
2. **Full list of the 30 services:** to be pasted by the user into `docs/content/services-list.md`.
3. **Location of the brand assets:** the ~75 photos and the logo variants from the old landing project. Where are they? *Partly answered (2026-11-07):* the 2026 profile holds 98 images, 32 of them usable now (`docs/content/profile-inventory.md`). Originals at full resolution are still wanted (#21).

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
<!-- #14 (font loading) was resolved after Checkpoint 3: `swap`, see DECISIONS D45. -->
15. **Hero line: "IT'S TIME TO CREATE." or the profile's "IT'S TIME TO START."?** The 2026 company profile uses "IT'S TIME TO START." as its official line; the site uses the approved reference's "IT'S TIME / TO CREATE." until the client confirms. Both are ready: switching is `HERO_LINE` in `src/config/hero.ts` (copy in `hero.title.{create,start}`). The Arabic of the "start" variant, «حان وقت / الانطلاق.», is written natively by us; if the profile has an official Arabic line, use that instead.
<!-- #16 (.gitignore ` /docs`) was resolved after Checkpoint 3: removed, `docs/` stays tracked; see DECISIONS D46. -->

## Added with the 2026 profile (Task 11b)
17. **Permission to name each client and show its logo.** Our Work and the curated images (`public/images/work/<slug>/`) stay unwired until each one is confirmed:
    - UAE Pro League
    - UAE Athletics Federation
    - EgyptAir
    - Ultimate Power Solution
    - Smith Gulf
    - Sandoz (A Novartis Division)
    - Emirates Driving Institute (T-shirt mock-up, p23)
    - ADIB (sponsor, p5)

    Private celebrations and heritage work are shown without client names in any case.
18. **Rights to photos of identifiable people.** 19 profile photos show identifiable faces: UAE PL winners and prize presentation, UAEAF ceremonies, the athletes in the Oregon 26 key visuals, Ultimate Power Solution stand guests and performers, heritage hosts. Does NO TIME (or the client) hold consent for web use? Until then none is used (`profile-inventory.md`, "Pending rights").
19. **Press and media outlets.** Which outlets actually published NO TIME work? This covers the 41 outlet logos on page 20 ("Media network") and the four headline clippings on page 19 (Aviation Daily, Gulf Media, Travel Weekly, Exhibition News). For each confirmed item we need the link or a scan with its date. Until then the site shows none.
20. **NO TIME's role in the portals and accounts on pages 12–13.** These are the UAE Pro League site, the "Expo 2020 Game" portal, a government portal and the Dubai e-services portal, plus a Dubai government investment social account. Did NO TIME design, build, run or market them? They are not shown until that is stated.
21. **Original files.** Some profile images are too small for the site or are not NO TIME's own work.
    - **Too small:** Smith Gulf (all four images ≤ 497 px), EgyptAir (largest 751 px), food styling (482 px).
    - **Baked-in UI:** the UAE PL Awards gift box (p24) has a carousel badge in the image.
    - **Not NO TIME's work:** the two notebook sheets on p22 look like supplier catalogue pages. Are they?
    - **Possibly stock:** the sound-and-lighting photos on p33 look like stock or renders. Are any of them real NO TIME setups?
