# Copy rewrite: the site's words, page by page

2026-11-17. Method: `docs/review/copy-voice-reference.md` (the voice, the banned words, the rules per kind of text). Inputs: `copy-proposals.md`, `ux-audit.md`, the company profile's own wording (`docs/content/profile-copy.md`), the open facts (`docs/review/fact-check.md`).

**Status: the owner's decisions on D-C1 to D-C8 are applied (2026-11-17).** What's still open:
- the owner's answers on the software promises (list below);
- Rand's answers to `docs/review/rand-questions.md`.

Nothing in `src/` changes until then. The changes go in on a separate branch after the audit fixes (`audit-fixes`) are merged, with tests and EN/AR screenshots.

**How Rand reviews.** Rand doesn't read this table. She answers the questions, then reads the Arabic on the preview link after the apply. Before that link reaches her, every ⚑ line she hasn't confirmed goes back to its current text. Where the current text makes the same claim, the line stays as it is today, so she still sees it on the link and can strike it. She reads the legal pages last (there's no separate legal reviewer).

**Generated, not hand-copied.** `scripts/copy-inventory.mjs` reads every string in `src/messages/{en,ar}.json` and the localized fields in `src/content/`, so no string is missed. The proposals are in `docs/review/copy-rewrite/*.json`, one file per page; the same files drive the apply step. To rebuild this page:

```
node --no-warnings --import ./scripts/lib/alias.mjs scripts/copy-inventory.mjs --render docs/review/copy-rewrite docs/review/copy-rewrite.md --head=docs/review/copy-rewrite/_head.md
```

**Count: 1,470 strings. 433 proposals (14 of them new keys), 4 lines hidden, 74 lines marked ⚑.** A row with an empty Rule column is kept as it is.

**Already decided, not reopened here:** N09 (30 services), N13 (Request a free intro call), N15 (the short privacy line), N16 (the closing blocks), N18 (the Arabic fixes); the N05/N06 copy in the approved audit-fixes design; the three samples (approved 2026-11-17).

## Rules that apply to every page

The voice and choices 1 and 2 were approved with the samples. Owner rules 1 to 8 came with that approval. On D-C1 the owner replaced rule 2 with the button rule below.

| # | Rule | How it's applied in the table |
|---|---|---|
| Choice 1 | "One team" once per page | Kept where it explains something (About, the FAQ "Can one team handle…", category intros); elsewhere replaced by who replies, when and with what |
| Choice 2 | "Request", not "brief", for visitors | Contact page, forms, FAQ answers, success messages. The team's email can keep "Brief" |
| 1 | Arabic: the plural address (أنتم) everywhere, forms, errors and success messages included | Every Arabic string that addresses the visitor, the legal bodies included (D-C4). If Rand prefers the singular, the whole site goes back to it |
| 2 (D-C1) | **Arabic buttons by role.** Form and system buttons use the verbal noun («إرسال الطلب», «التالي», «إعادة المحاولة»). Marketing calls to action use the plural command («اطلبوا عرض سعر», «اطلبوا مكالمة تعارف مجانية», «خطّطوا لفعاليتكم معنا») | **Marketing:** contact, quote, call, WhatsApp, planning, registering interest, seeing the work, discussing a service. **Form or system:** form submits, copy, close, open the menu, play/pause, the module controls, skip links. **Navigation inside the site** (browse the services, show all, product details, read the case study): the verbal noun. Titles and eyebrows aren't buttons («طلب عرض سعر» as the contact page's title). Text links keep the plural command (D-C2). One exception, at the owner's request: the consultation form's submit is one of the six approved buttons, so it reads «اطلبوا مكالمة تعارف مجانية (30 دقيقة)» |
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
| R6 | The online print store isn't built, so its lines are hidden | The "Order your print online" button only links to the contact form (`/contact?service=print-store`): there's no catalogue, cart or checkout. Hidden: the Print FAQ "Can I order prints online?" (question and answer), the service's summary, and the module's button. The module's four steps stay: they describe a request that does work |

### The phone field (D-C3, for the apply step)

A pure function in `src/lib/forms/`, test-first (forms and validation are high-risk logic, D82):

- **Accept** a number that starts with `+` or `00`. Remove spaces, dashes and brackets, then turn a leading `00` into `+`.
- **Reject with `phoneCode`** ("Include the country code, e.g. +971.") a number that starts with `0` and isn't `00`, or that starts with a digit with no `+`. A number like `971501234567` is ambiguous, so it's treated as missing its code (our call).
- **Reject with `phone`** ("Use digits only, e.g. +971 50 123 4567.") anything else that isn't 8 to 15 digits after the `+`, with a first digit of 1–9 (E.164).
- **Store and send** the number in E.164 (`+971501234567`): the team's email and the WhatsApp reply use it.
- **Show the example** under the field from the start (`phoneHint`), before any error. The review form's "Email or WhatsApp" field shows both shapes (`contactHint`) and applies the same rules when the value isn't an email.

## Software promises: the owner decides (not Rand)

The owner asked for R1, R2 and R7 here. Our call: R8 and the software rows of `fact-check.md` belong here too, since the owner answers for the software side. Say if any of them should go to Rand.

| # | The promise | Lines |
|---|---|---|
| R1 | The intro call is free and lasts 30 minutes | 5: the software page's call to action, closing line and sticky bar; the Software & Digital FAQ; the consultation form's button |
| R2 | The website review is free, comes within 3 working days, and lists 5 improvements | 5: the software page (4), the review form's success message |
| R7 | Every support plan includes a monthly report | 1: the software page, "Ways to work with us" |
| R8 | The quality checks run on every build | 1: the software page's quality title |
| FC#18 | NO TIME is the federation's official digital and media partner, and everything listed is live at launch | 2: the software page's case study |
| FC#19 | Event apps, live results and screens built for clients other than the federation | 1: the software page |
| FC#20 | Online stores and AI consulting are services we sell, and which payment gateways | 2: the Software & Digital services |
| FC#21 | The stack shown: Next.js, React, TypeScript, Node.js, iOS and Android | 1: the software page |
| FC#22 | "Security and data protection, with the UAE personal data law in mind" | 1: the software page's quality list |
| FC#24 | Support after launch; the client sees progress at every stage | 7: the software page, the Software & Digital FAQ |

## For Rand

The questions are in `docs/review/rand-questions.md`: 15 short questions in Arabic, the most important first. They cover FC#1, FC#4–FC#17, FC#22 (the legal pages), FC#23, and R3, R4, R5 and R9.

---
