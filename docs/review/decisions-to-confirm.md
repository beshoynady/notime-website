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
