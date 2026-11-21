# v1 for Rand: a complete, review-ready site (design)

**Status:** awaiting the user's approval (stop 1 of the brief "Goal: a complete, review-ready site for the client").
**Plan:** [docs/plans/v1-review.md](../../plans/v1-review.md) · **Research:** [docs/research/benchmarks.md](../../research/benchmarks.md)

## Intent

Rand gets one link to a protected preview of the **whole** site. She can read every page, see every section that is still waiting for her material (as clearly badged examples), and reply in the form "change EV-05". Speed matters, quality doesn't drop, and nothing invented reaches production: review mode is a build flag, and the production build is unchanged by it (D78 stands).

## Goals

- Every v1 page exists, in EN and native AR, at 1440 and 390: the homepage (all 9 sections), the 5 category pages, the Work index and the case-study template, About, Products (2), Contact with the working form, the legal pages, 404, and the sitemap, SEO and OG images.
- Professional draft copy everywhere, with a `FACT CHECK` list for Rand. No invented numbers, durations, prices, guarantees, certifications or clients.
- Images in this order per slot: real profile photo → licensed stock → the user's ChatGPT images → a designed placeholder.
- A visible craft upgrade (image treatments, quiet ornaments), documented in the styleguide, within the existing budgets.
- A protected review deployment, plus an Arabic guide for Rand.

## Non-goals and anti-goals

- No competitor is named, compared or copied, in text, images or claims; nqshmedia.com is excluded from the research too.
- No example content in production: no badge, banner, reference number or example block may reach a production build. A leak is a failure even if everything else works.
- No new motion that breaks the rules: GSAP owns scroll, Motion owns interaction, reduced motion means a complete static design, LCP stays text, CLS stays 0, and the per-page budgets don't change.
- No scraped images: Google, competitor sites, social media and news sites are all off limits.

## Approaches considered

**Review mode**
1. **A build flag, `NEXT_PUBLIC_REVIEW_MODE=1` (chosen, the user's spec).** Example content lives in its own modules, loaded only behind the flag, so the production bundle doesn't contain it, and a test proves that.
2. A runtime cookie or query toggle on one deployment: rejected. The example content would then ship in the production bundle.
3. A separate branch for review: rejected. Two copies of the site would drift apart.

**Stock images** (the terms differ by source, so this changes the pipeline)
1. **Pexels API only, with local grading (recommended).** The Pexels licence allows modification. Its API guidelines ask for a prominent link to Pexels and a photographer credit "when possible", so we add an **Image credits** page linked from the footer. Every image is graded and cropped through our pipeline.
2. Unsplash API: its API terms require **hotlinking** Unsplash's own image URLs, calling the download endpoint, and attributing with UTM links. Hotlinked files can't be graded, cropped or optimised by our pipeline, so they would break the palette and the performance budget. Use Unsplash only if the user downloads a specific photo by hand from unsplash.com, under the Unsplash licence, outside the API. That photo then gets the same licence-log row.
3. Both APIs: no gain over 1 that is worth breaking Unsplash's API terms.

**Review deployment**
1. **Vercel Pro (recommended).** Vercel's fair-use policy limits Hobby to **non-commercial personal use**, and a client site is commercial, so Pro is needed (one member, about USD 20 a month; the user to confirm on vercel.com/pricing). Preview deployments get **Standard Protection** (Vercel Authentication), and Rand gets a **Shareable Link** to the review branch, which works without a Vercel account. The paid Password Protection add-on isn't needed.
2. Hobby plus a password check in our own `proxy.ts`: technically free, but it still breaks Hobby's non-commercial rule.
3. Another host: rejected. Next.js 16 with Cache Components is built and tested for Vercel, and the brief names Vercel.

## Decisions taken in this design (the builder's calls, open to correction)

- **Reference numbers:**
  - A page prefix plus two digits, in page order: `H` home, `EV` Events, `SW` Software, `PG` Print & Gifts, `MB` Marketing & Brand, `CP` Creative, `WK` Work, `AB` About, `PR` Products, `CT` Contact, `LG` legal, `ER` 404.
  - They are stable ids in the data or the component, not computed from position, so inserting a section doesn't renumber the rest.
  - Visible only in review mode.
- **Example content:**
  - Lives in `src/content/review/*.ts`, imported only through `src/lib/review.ts` behind the flag.
  - Every block carries `ExampleBadge` ("Example – to be replaced" / «مثال – يُستبدل»).
  - Logos are neutral geometric shapes; people are "Client name" and "Role, Company".
- **Draft copy:**
  - Every page gets a copy deck in `docs/content/` (EN, native AR, notes), drafted with `design:ux-copy`.
  - Facts come only from the profile and approved decisions; everything else goes on `docs/review/fact-check.md`.
- **Ornaments:**
  - Hairline, frame corners, an 8-fold Gulf geometric tile (an SVG pattern, dark sections only, ≤ 6 % opacity), light leak and glow (CSS gradients, no images), a clock-tick marker in eyebrows, and a marquee divider.
  - All CSS or SVG, no image requests.
- **Image treatments:**
  - Mask reveal and parallax (existing wrappers), a slow Ken Burns on large frames.
  - Hover: scale plus a light sweep on desktop pointers only. Work cards get a duotone that turns to full colour on hover.
  - No WebGL in v1: displacement would only fit the budget on desktop, and the gain doesn't justify a second render path. The user can ask for it later.
- **Stock credit:** an `/credits` page per locale (photographer, source and link per image), linked from the footer.

## Decisions for the user (in the stop message)

1. Stock source: Pexels only (recommended), or Unsplash hotlinked and ungraded.
2. Hosting: Vercel Pro for the client project (recommended), and who owns the account (the user, or NO TIME).
3. The four non-Events copy decks: until now they waited for the user's own review. Under this brief they would go into the data files now as drafts, with Rand reviewing them on the site. Move them now, or keep waiting?
4. Execution: native (recommended) or subagent-driven.

## Left to the builder

- Section-level layouts, motion choreography and copy wording, within the rules and checkpoints.
- Which stock photo fills which slot (candidates go on a contact sheet at each page's checkpoint).
