# Batch 3 · Work, About, Products: judgment calls

Branch `batch3-pages`, built on `phase-2-services` 4fb917e (merged up to 15817aa). One line per call, each with a recommendation. The lead moves the confirmed ones into DECISIONS.md and decisions-to-confirm.md. The Arabic log is at the end of `docs/content/copy-ar-rewrite.md` (three new sections).

## Work (F1)

1. **Filter state in the path, not the query:** `/work/filter/<category>/<market>` (e.g. `/work/filter/events-hospitality/uae`), one static page per combination (41 per locale). Under Cache Components a server `searchParams` read streams behind Suspense, so a no-JS visitor would only ever see the fallback; static pages make the chips plain links that work without JS and can be shared. Confirm.
2. **Filtered views are `noindex, follow` with `/work` as canonical** and stay out of the sitemap: they are subsets of one listing. Confirm.
3. **Chips for values no case has are hidden** (Creative Production, and every market but the UAE today), so no chip ever reads "0" and advertises work we don't have; the rows grow as cases are added. A chip ruled out only by the other facet shows 0 and isn't linked. Confirm.
4. **The market row shows today with one market (UAE · 3).** It does nothing yet beyond "All", but it is the D88 filter and fills in with the next case outside the UAE. Alternative: hide a row with fewer than two values. Confirm as built.
5. **All three cases are tagged UAE only.** The airline's shows (Dubai Airshow, ATM) are in Dubai; the profile also lists Egypt for that client without saying what was done there, so Egypt isn't claimed. Confirm; add `eg` once Rand confirms Egyptian work.
6. **Slugs:** `airline-exhibition-pavilion`, `football-league-events-awards`. Anonymous and permanent, so they survive the named switch. Confirm.
7. **Hidden sections:** Challenge and Idea are `{{TODO}}` for both cases in case-studies.md, and neither has a supported Result yet, so those sections are hidden. Confirm.
8. **The case stories are written without names**, so the same text stays true when `WORK_NAMED` flips; only the label, summary and photos switch. Confirm.
9. **The airline's execution lists "The media coverage that follows"** (profile p19's own deliverable). The "made headlines" claim stays off (OQ #19). Confirm, or drop the point until the coverage is confirmed.
10. **The league's Super Cup ceremony is described as "a pre-match ceremony"** (naming the cup would identify the league). Confirm.
11. **The sticky "On this page" menu shows only with 4+ sections** (the plan's rule). No case reaches 4 today, so none shows it. Confirm.
12. **Case CTA:** until `/contact` is live it reads "Explore <home category>", pointing to the category page, whose quote block carries the contact routes; it switches to "Request a quote" with `QUOTE_LINK.live`. Confirm.
13. **Cards:** the title is the link; the media repeats it for pointers only (`tabIndex=-1`, `aria-hidden`), so each case is one tab stop and one name, on the homepage, RelatedWork and the index (where the row is a stretched link). The homepage Work header gains "All work". Confirm.
14. **Index without HoverSweep:** the stretched link sits over the media, so the Motion sheen can't receive the pointer; the duotone → colour fade (CSS) and the arrow nudge carry the hover. Confirm.

## About (F2)

15. **H1 is the profile's own thesis** ("Ideas built where a brand meets its audience."), the story from p3 plus the anonymous examples already on the homepage, and "It's time to start" as the line the name comes with. Only the two verified figures (6 markets, 360°). Confirm.
16. **The principles' Arabic title «تحت سقف واحد» became «بيت واحد»** (the D95 calque; it now matches the menu heading). The English is unchanged and still test-pinned. Confirm.
17. **Markets reuse `MarketsBoard`** with the About page's own section (and its own review ref AB-03), not the homepage `Markets` section, which carries the H-08 ref. Confirm.
18. **The closing reuses the homepage final-CTA copy** ("Have a date in mind? Let's plan every second of it.") with the same fill-or-hide switch, plus "See the work". Confirm.

## Products (F4)

19. **URLs use the forms-contract ids** (`/products/minute-zero`, `/products/peak-hour`), not the data slugs (`qr-check-in`, `restaurant-system`), as the brief asks. Confirm.
20. **The pages use the Software page's Interface theme** and reuse its concept screens (`MinuteZeroScreens`, `PeakHourScreens`) and products copy (problem line, screens), so the page and the Software block can't disagree. Confirm.
21. **Features grow from 3 to 5 (Minute Zero) and 4 (Peak Hour):** "One guest list" (the Guest list screen) and "Arabic and English" (the house standard) were added; each has a one-line description. Drafts for the client (OQ #24). Confirm, or trim to what Rand confirms.
22. **The interest form sits inline on a champagne-washed panel** (not in a disclosure, and on a light ground: the forms are drawn for light grounds), `source` = the product id. Confirm.
23. **Breadcrumb: Home › Software & Digital › <product>** (there is no products index). The mega menu's product links now open the pages. Confirm.
24. **No product JSON-LD** (a SoftwareApplication without offers or ratings earns no rich result and invites warnings); breadcrumbs only. Revisit at launch. Confirm.

## For the lead (shared code, not edited here)

- **Dev-only insight:** `next dev` logs "encountered URL data during prerendering" for `/work/[slug]` and `/work/filter/[...facets]` (the category route uses the same `await params` + `ensureStatic = "navigation"` pattern and logs the same "did not produce a static shell" invariant on an unknown slug). The docs say these insights never block the build; check at M3's `next build`, or set `instant = false` on these routes if they do.
- `src/lib/review.ts` gained `PAGE_REF` (WK/AB/PR) and `src/lib/jsonld.ts` gained `trailJsonLd` and `workCaseJsonLd` (additions only).
- The Software page's products block could link "See the product" to the new pages (not added: that page is the Software batch's).
- E2E written, not run: `e2e/work.spec.ts`, `e2e/products.spec.ts`, and the new routes in `e2e/no-placeholder.spec.ts`.
