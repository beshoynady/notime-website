# Copy rewrite: the site's words, page by page

2026-11-17. Method: `docs/review/copy-voice-reference.md` (the voice, the banned words, the rules per kind of text). Inputs: `copy-proposals.md`, `ux-audit.md`, the company profile's own wording (`docs/content/profile-copy.md`), the open facts (`docs/review/fact-check.md`).

**Status: full table, waiting for review.** Beshoy reviews everything; Rand reviews the Arabic and every line marked ⚑. Nothing in `src/` changes until both reviews are done. The changes go in on a separate branch after the audit fixes (`audit-fixes`) are merged, with tests and EN/AR screenshots.

**Generated, not hand-copied.** `scripts/copy-inventory.mjs` reads every string in `src/messages/{en,ar}.json` and the localized fields in `src/content/`, so no string is missed. The proposals are in `docs/review/copy-rewrite/*.json`, one file per page; the same files drive the apply step. To rebuild this page:

```
node --no-warnings --import ./scripts/lib/alias.mjs scripts/copy-inventory.mjs --render docs/review/copy-rewrite docs/review/copy-rewrite.md --head=docs/review/copy-rewrite/_head.md
```

**Count: 1,470 strings. 430 proposals, 11 of them new keys. 77 lines marked ⚑.** A row with an empty Rule column is kept as it is.

**Already decided, not reopened here:** N09 (30 services), N13 (Request a free intro call), N15 (the short privacy line), N16 (the closing blocks), N18 (the Arabic fixes); the N05/N06 copy in the approved audit-fixes design; the three samples (approved 2026-11-17).

## Rules that apply to every page

The voice and choices 1 and 2 were approved with the samples. Owner rules 1 to 8 came with that approval.

| # | Rule | How it's applied in the table |
|---|---|---|
| Choice 1 | "One team" once per page | Kept where it explains something (About, the FAQ "Can one team handle…", category intros); elsewhere replaced by who replies, when and with what |
| Choice 2 | "Request", not "brief", for visitors | Contact page, forms, FAQ answers, success messages. The team's email can keep "Brief" |
| 1 | Arabic: the plural address (أنتم) everywhere, forms, errors and success messages included | Every Arabic string that addresses the visitor. Legal bodies: see D-C4. If Rand prefers the singular, the whole site goes back to it |
| 2 | Arabic buttons: the neutral verbal noun («إرسال الطلب», not «أرسل طلبي») | Buttons and controls only. Text links and headings keep the plural command («اكتشفوا…», «أخبرونا…»): see D-C2 |
| 3 | "Across the region" / «في المنطقة», not "the Gulf" | The markets reach Egypt. Applied in every meta description and body line |
| 4 | Home lead: "Events, films, campaigns and websites, from the first idea to launch day." | Video production is one of the 30 services, so "films" is accurate |
| 5 | About statement (AR): «نصنع الفكرة في النقطة التي تلتقي فيها العلامة بجمهورها…» | Rand's own sentence (p3), as the owner wrote it |
| 6 | Galas: the keepsake is a promise | Made optional: "…and, if you'd like, prepare a keepsake for every guest." / «…ونعدّ تذكارًا تودّعون به ضيوفكم إن أردتم.» |
| 7 | Errors say what's needed, field by field | Email, phone, contact, URL and length each have their own message; the generic one is only the fallback. `tooLong` shows `{max}` (a small code change at apply time). The blocked state uses the owner's text |
| 8 | Scan for banned words and unmarked promises | Done on the text each string would ship with (the proposal, or the current text where it's kept). Result below |

## How to read the tables

- **ID:** `m:<key>` is a key in `src/messages`; `c:<file>:<path>` is a field in `src/content/<file>.ts`; `new:<key>` is a key to add.
- **Rule** cites the guide (§2 voice, §3 banned, §4 per kind of text, §5 Arabic), an owner rule (1–8), a choice (1–2) or an approved decision (N05–N18).
- **(keep)** in a proposed column: that language stays as it is.
- **Facts:** the source a line rests on (`p3` = profile page 3). **⚑ needs Rand:** the line states a fact or a promise Rand must confirm before launch. `FC#n` is row n of `fact-check.md`; `R1`–`R9` are new rows (below). A ⚑ line that isn't confirmed goes back to the current text or is hidden (fill or hide, D78).

## Rule 8 scan (2026-11-17)

- **Banned words (§3, EN and AR): 0.** One false alarm cleared: «رحلة» inside «مرحلة».
- **Banned shapes (§3: "we don't just X", «لا نكتفي بـ», «ليس مجرد», em-dash asides): 0.**
- **Promises without a ⚑: 0.** The scan matched reply times, durations, "free", "every stage / project / proposal" and their Arabic forms. Seven matches aren't promises (a pricing method, terms set in each proposal, a form option "Within 3 months", a demo label) and stay unmarked. It also found seven promises that weren't marked yet; they're marked now (R1, R2, R8, FC#23, FC#24).
- **Singular address left in Arabic (rule 1): 0** outside the legal bodies (D-C4). The scan found and fixed eight: the two forms' success titles, the software page's closing lines, an SEO service point, a Creative FAQ, and the drawn interface on the software hero.

## Decisions to confirm (Beshoy)

| # | Decision | Recommendation |
|---|---|---|
| D-C1 | Rule 2 changes six approved Arabic button labels: `header.quote` «طلب عرض سعر», `hero.cta` «تخطيط فعاليتكم معنا», `hero.ctaWork` «مشاهدة أعمالنا», software `cta.book` «طلب مكالمة تعارف مجانية», `sticky.book` «طلب مكالمة مجانية», `consultation.submit` «طلب مكالمة تعارف مجانية (30 دقيقة)». Rule 1 changes `workCase.ctaTitle` to «تخطّطون لمشروع كهذا؟» | Accept: one rule for every button, with no exceptions to remember |
| D-C2 | Rule 2 covers buttons and controls only; text links and headings keep the plural command («اكتشفوا ما ستقدّمه…», «كونوا أول من يعرف…») | Accept: a verbal noun reads like a label, which suits a button but not a sentence |
| D-C3 | The phone error says "Include the country code, e.g. +971", but today's check accepts a local number (`050 123 4567`). Either (a) the check requires the leading `+`, or (b) the message says "Use digits, e.g. +971 50 123 4567" | (a): the team replies on WhatsApp across six countries, and a number without its code is ambiguous. One schema line plus a test at apply time |
| D-C4 | Legal bodies (36 rows) move to the plural mechanically at apply time, with no other change of wording. The legal reviewer (FC#22) reads the result | Accept: the legal text keeps its meaning, and the site keeps one voice |
| D-C5 | The drawn interface on the software hero (an example client site) follows rules 1 and 2 too: «أهلًا بكم», «حجز زيارة» | Accept |
| D-C6 | The "Coming soon" badge on both product cards (`hero.ui.soon`) becomes "In development" / «قيد التطوير», like the section's eyebrow | Accept: the fixed principle bans "coming soon" |
| D-C7 | Four labels that shouldn't render in public: `common.comingSoon`, `megaMenu.inDevelopment`, `category.modulePending`, `category.quote.contactPending`. At apply time, check where each renders, and delete it if nothing public uses it | Accept |
| D-C8 | New keys: `meta.homeTitle` (the home title; `meta.title` is also the title template), `hero.ctaWork`, the Events `metaTitle` / `metaDescription` (the card summary stays the card's), `workIndex.closing.*` (N16), and five N10 form labels | Accept: each one is needed by an approved change |

## For Rand: the facts and promises (⚑)

Rows of `fact-check.md` used in this table: FC#1 (six markets, 9 lines), FC#4 (the anonymous projects), FC#5–FC#21 (one service each), FC#22 (legal review), FC#23 (a reply within one working day, 12 lines), FC#24 (support after launch; progress at every stage, 7 lines).

New rows, to add to `fact-check.md` when Rand reviews:

| # | The promise | Where |
|---|---|---|
| R1 | The intro call is free and lasts 30 minutes | Software page, Software & Digital FAQ, the consultation form |
| R2 | The website review is free, comes within 3 working days, and lists 5 improvements | Software page, the review form |
| R3 | A concept (Events) or a treatment (Creative) comes with every proposal | Category FAQs |
| R4 | The client reviews the work at every stage | Home, process |
| R5 | Every project ends with a report (otherwise: "…and we stay with you after it.") | Home, process |
| R6 | The online print store is live at launch (today ordering is by request) | Print & gifts |
| R7 | Every support plan includes a monthly report | Software page |
| R8 | The quality checks run on every build | Software page |
| R9 | The three projects in the home About block are recent (otherwise: "Some of our work:") | Home |

---
