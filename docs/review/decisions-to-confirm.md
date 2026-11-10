# Decisions to confirm

Judgment calls made in speed mode (D82). Each one is already applied and logged in `docs/DECISIONS.md`; confirm it, or name the change. The milestone reports list the new ones.

| # | Decision | Ref | Recommendation |
|---|---|---|---|
| 1 | Pre-commit typechecks the whole project once (not per file) when any TypeScript is staged: tsc can't check single files against the path aliases and Next's route types. | D82 (4) | Keep. |
| 2 | The local production build runs before each milestone instead of before every commit; CI's full job builds on every manual run and PR to `main`. | D82 (6) | Keep. |
| 3 | Creative s1 EN stays "A black box. Nothing in frame yet.": a black box is the studio's own word for the space, and it pairs with «مساحة سوداء». | D81 (6) | Keep. |
| 4 | The three template-built categories (Creative, Marketing, Print) ship in v1 with their opening scene, theme and two no-photo modules each; their other 12 modules follow after v1 and stay hidden meanwhile. | D83 | Keep: the pages are complete without them, and they need photographs we don't have yet. |
| 5 | Module copy lives in `src/content/modules/<key>.ts` (localized fields) instead of the messages JSON. | D83 (3) | Keep: CMS-ready and conflict-free in parallel work. |
| 6 | How we work on the homepage is the brief's four steps (Plan, Build, Produce, Launch); the four principles go to the About page. | D84 (1) | Keep: the brief asks for the steps; the principles suit About. |
| 7 | Six markets shows each market's live local time, Dubai marked as the base. | D84 (2) | Keep: it is the homepage's signature, ties to the brand's name, and states only facts. |
| 8 | Until the contact page exists, the final CTA's one button is "Explore our services". | D84 (5) | Keep: no dead end; it switches by itself when the page is live. |
| 9 | The showreel is built in code from 10 real event photos with no people, until a real video arrives. | D84 (4) | Keep, and send a real reel when one exists (CONTENT_CHECKLIST #1). |
| 10 | A section on the other tone's ground fades out at each dark/light switch, and the header follows the ground. | D85 (2) | Keep: it is the only way the tone turn stays legible; the turn itself is unchanged. |
| 11 | While no contact route exists, the final CTA's body says "Start with what you need…" instead of promising a reply. | D85 (3) | Keep: we don't promise a reply nobody can send; the original returns with the contact page or WhatsApp. |
| 12 | Four AR wording proposals from the gate on approved copy: About «بيت إبداعي يجمع الفعاليات والعلامات التجارية وكل ما بينهما من أفكار…»; Digital «تواصل عملها بعد الإطلاق»; CTA «وسنتواصل معك لنتّفق على الخطوات التالية»; «خمس حِرَف» → «خمسة مجالات» (حرفة reads as handicraft for Software and Marketing). Not applied. | D85 (3) | Apply all four: each reads more natively; the meaning is unchanged. Rand reviews the result. |
| 13 | The sample content calendar in the Marketing page keeps "Newsletter" and "Blog" as a client's example channels; only site features for them are out of v1 (none existed). | D88 (3) | Keep: it shows the service, not a feature of our site. |
| 14 | The legal pages carry both texts for analytics, and the analytics one turns on by itself when the service's name is set at launch. | D88 (1) | Keep: one config line at launch, no forgotten policy update. |
| 15 | `www` → apex is also enforced in the app (`next.config.ts`), not only at the host; Node is pinned to 22 (Hostinger's default). | D90 (3), D89 (2) | Keep: it holds even if the host setting is missed. |
| 16 | The old domain redirects through a small site on the same plan with one `.htaccess` rule, not hPanel's domain forwarding, which drops the path. | D90 (2) | Keep: old links land on the same page, not the homepage. |
| 17 | The trademark search for "Minute Zero" / "Peak Hour" (CONTENT_CHECKLIST #33) was tagged a launch blocker earlier; your list has three blockers, so it's now listed as needed before the product pages go public, not before launch. | D89 (6) | Confirm: the product pages register interest only, but the names are public once live. |
| 18 | Logo: the supplied PNGs vectorised as-is (two colours each, outlines within one source pixel of the PNG). On every dark ground (the header on dark and the footer), the wordmark without "CREATIVE HOUSE": that line is #68462D on espresso, too faint at 150px. The wordmark keeps the lockup's box, so a tone switch never moves the letters. The full lockup stays on light grounds. | D88 (6) | Keep until the designer's SVGs arrive (OQ #12). |
