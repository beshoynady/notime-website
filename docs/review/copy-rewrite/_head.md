# Copy rewrite: the site's words, page by page

2026-11-17. Method: `docs/review/copy-voice-reference.md` (the voice, the banned words, the rules per kind of text). Inputs: `copy-proposals.md`, `ux-audit.md`, the company profile's own wording (`docs/content/profile-copy.md`), the open facts (`docs/review/fact-check.md`).

**Status: the owner's decisions are applied (two rounds, 2026-11-17: D-C1 to D-C8, then D121 to D124).** What's still open: Rand's answers to `docs/review/rand-questions.md` (16 questions).

A withdrawn case study was removed from the site itself on 2026-11-17 (D121): its strings no longer exist, so they're not in this table. Apart from that, nothing in `src/` changes until the apply. The changes go in on a separate branch after the audit fixes (`audit-fixes`) are merged, with tests and EN/AR screenshots.

**How Rand reviews.** Rand doesn't read this table. She answers the questions, then reads the Arabic on the preview link after the apply. Before that link reaches her, every ⚑ line she hasn't confirmed goes back to its current text. Where the current text makes the same claim, the line stays as it is today, so she still sees it on the link and can strike it. She reads the legal pages last (there's no separate legal reviewer).

**Generated, not hand-copied.** `scripts/copy-inventory.mjs` reads every string in `src/messages/{en,ar}.json` and the localized fields in `src/content/`, so no string is missed. The proposals are in `docs/review/copy-rewrite/*.json`, one file per page; the same files drive the apply step. To rebuild this page:

```
node --no-warnings --import ./scripts/lib/alias.mjs scripts/copy-inventory.mjs --render docs/review/copy-rewrite docs/review/copy-rewrite.md --head=docs/review/copy-rewrite/_head.md
```

**Count: 1,423 strings. 428 proposals (14 of them new keys), 2 lines hidden, 47 lines marked ⚑ (all Rand's).** A row with an empty Rule column is kept as it is.

**Already decided, not reopened here:** N09 (30 services), N13 (Request a free intro call), N15 (the short privacy line), N16 (the closing blocks), N18 (the Arabic fixes); the N05/N06 copy in the approved audit-fixes design; the three samples (approved 2026-11-17).

## Rules that apply to every page

The voice and choices 1 and 2 were approved with the samples. Owner rules 1 to 8 came with that approval. On D-C1 the owner replaced rule 2 with the button rule below.

| # | Rule | How it's applied in the table |
|---|---|---|
| Choice 1 | "One team" once per page | Kept where it explains something (About, the FAQ "Can one team handle…", category intros); elsewhere replaced by who replies, when and with what |
| Choice 2 | "Request", not "brief", for visitors | Contact page, forms, FAQ answers, success messages. The team's email can keep "Brief" |
| 1 | Arabic: the plural address (أنتم) everywhere, forms, errors and success messages included | Every Arabic string that addresses the visitor, the legal bodies included (D-C4). If Rand prefers the singular, the whole site goes back to it |
| 2 (D-C1) | **Arabic buttons by role.** Form and system buttons use the verbal noun («إرسال الطلب», «التالي», «إعادة المحاولة»). Marketing calls to action use the plural command («اطلبوا عرض سعر», «اطلبوا مكالمة تعارف مجانية», «خطّطوا لفعاليتكم معنا») | **Marketing:** contact, quote, call, WhatsApp, planning, registering interest, seeing the work, discussing a service. **Form or system:** form submits, copy, close, open the menu, play/pause, the module controls, skip links. **Navigation inside the site** (browse the services, show all, product details, read the case study): the verbal noun. Titles and eyebrows aren't buttons («طلب عرض سعر» as the contact page's title). Text links keep the plural command (D-C2). The consultation form's submit is a call to action too, at the owner's request: «اطلبوا مكالمة تعارف مجانية», with no length on the button (N13); the 30 minutes are in the line beside it |
| 3 | "Across the region" / «في المنطقة», not "the Gulf" | The markets reach Egypt. Applied in every meta description and body line |
| 4 | Home lead: "Events, films, campaigns and websites, from the first idea to launch day." | Video production is one of the 30 services, so "films" is accurate |
| 5 | About statement (AR): «نصنع الفكرة في النقطة التي تلتقي فيها العلامة بجمهورها…» | Rand's own sentence (p3), as the owner wrote it |
| 6 | Galas: the keepsake is a promise | Made optional: "…and, if you'd like, prepare a keepsake for every guest." / «…ونعدّ تذكارًا تودّعون به ضيوفكم إن أردتم.» |
| 7 | Errors say what's needed, field by field | Email, phone, contact, URL and length each have their own message; the generic one is only the fallback. `tooLong` shows `{max}` (a small code change at apply time). The blocked state uses the owner's text. The phone field follows D-C3 |
| 8 | Scan for banned words and unmarked promises | Done on the text each string would ship with (the proposal, or the current text where it's kept). Result below |

## How to read the tables

- **ID:** `m:<key>` is a key in `src/messages`; `c:<file>:<path>` is a field in `src/content/<file>.ts`; `new:<key>` is a key to add.
- **Rule** cites the guide (§2 voice, §3 banned, §4 per kind of text, §5 Arabic), an owner rule (1–8), a choice (1–2), an owner decision (D-C1–D-C8) or an approved decision (N05–N18).
- **(keep)** in a proposed column: that language stays as it is. **(hide)**: the line doesn't render.
- **Facts:** the source a line rests on (`p3` = profile page 3). **⚑:** the line states a fact or a promise that must be confirmed before launch. `FC#n` is row n of `fact-check.md`; `R1`–`R9` are promises found in this rewrite (below).

## Rule 8 scan (2026-11-17)

- **Banned words (§3, EN and AR): 0.** One false alarm cleared: «رحلة» inside «مرحلة».
- **Banned shapes (§3: "we don't just X", «لا نكتفي بـ», «ليس مجرد», em-dash asides): 0.**
- **Promises without a ⚑: 0.** The scan matched reply times, durations, "free", "every stage / project / proposal" and their Arabic forms. Seven matches aren't promises (a pricing method, terms set in each proposal, a form option "Within 3 months", a demo label) and stay unmarked. Seven promises that weren't marked are marked now.
- **Singular address left in Arabic (rule 1): 0** outside the legal bodies (D-C4). Eight were found and fixed.

## The owner's decisions (2026-11-17)

| # | Decision | Applied as |
|---|---|---|
| D-C1 | Rejected as proposed; the button rule above replaces it | 36 marketing buttons in the plural command, the six approved ones included; the rest keep the verbal noun |
| D-C2 | Accepted | Text links and headings keep the plural command |
| D-C3 | Accepted, changed: see "The phone field" below | New keys `errorMessages.phoneCode`, `formCopy.fields.phoneHint`, `formCopy.review.contactHint`; `errorMessages.phone` reworded |
| D-C4 | Accepted. There's no legal reviewer: Rand reads the legal pages last | 37 legal rows move to the plural at apply time, with no other change of wording |
| D-C5 | Accepted, then superseded by D-C1 for the button | «أهلًا بكم»; the drawn site's button «احجزوا زيارة» (a call to action) |
| D-C6 | Accepted, EN "In development" | `hero.ui.soon`: "In development" / «قيد التطوير» |
| D-C7 | Accepted | At apply time: delete `common.comingSoon`, `megaMenu.inDevelopment`, `category.modulePending`, `category.quote.contactPending` if nothing public renders them |
| D-C8 | Accepted | The new keys as listed in the tables |
| D121 | A case study is withdrawn (the work was built but never delivered or used) | Removed from the site and the repo: the work case and its campaign figures, the software page's case study and proof card, the mentions on Home and About, the photos and every doc mention (DECISIONS.md keeps the record). Work now has two cases |
| D122 | The software promises (the owner decides them, not Rand) | R1 stays: the call is free and 30 minutes, the length beside the button, not on it. R2 stays. R7 becomes "Regular reports" / «تقارير دورية». R8 becomes "We test the site automatically before every update." / «نختبر الموقع آليًا قبل كل تحديث.» FC#19 stays (an event app was delivered to a client). FC#20, FC#21, FC#24 stay. FC#22: the data-protection line claims no compliance or certificate: "Security and data protection, planned into the build" |
| D123 | The print service is "Print ordering" / «طلب المطبوعات» everywhere | The title feeds the card, the menus and the meta. The four order steps mention no payment, cart or shipment tracking; the first service point says "Tell us the item and the quantity" (not "Choose"). Our calls: the summary and the module's button describe the request that works (the contact form) instead of staying hidden; the FAQ "Can I order prints online?" stays hidden. At apply time the anchor `print-store` and the service slug become `print-ordering` |
| D124 | The phone field (replaces D-C3's spec) | See below |

### The phone field (D124, for the apply step)

Built test-first in `src/lib/forms/` with **`libphonenumber-js`** (no hand-written length rules). Forms and validation are high-risk logic (D82).

- **Clean** the input: remove spaces, dashes and brackets.
- **Accept** a number that starts with `+` or `00` (a leading `00` becomes `+`) when `libphonenumber-js` parses it as a valid number.
- **Accept without `+`** a number that starts with one of the six markets' codes (971, 966, 974, 968, 965, 20) and is valid for that country by `libphonenumber-js`: add the `+`.
- **Reject with `phoneCode`** ("Include the country code, e.g. +971." / «أضيفوا رمز الدولة، مثل ‎+971.») a number that starts with `0`, or that matches no country code.
- **Reject with `phone`** ("Use digits only, e.g. +971 50 123 4567.") anything else that doesn't parse as a valid number.
- **Store and send** the number in E.164 (`+971501234567`): the team's email and the WhatsApp reply use it.
- **Show the example** under the field from the start (`phoneHint`), before any error. The review form's "Email or WhatsApp" field shows both shapes (`contactHint`) and applies the same rules when the value isn't an email.

## For Rand

The questions are in `docs/review/rand-questions.md` (a PDF beside it for sending): 16 short questions in Arabic, the most important first. They cover FC#1, FC#3 (the lowest budget band), FC#4–FC#17, FC#22 (the legal pages), FC#23, and R3, R4, R5 and R9.

---
