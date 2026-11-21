# The five text checks (2026-11-18, on the shipped text)

Method: `scripts/copy-inventory.mjs --dump` of every string in `src/messages` and `src/content` after the copy apply (744a47e), scanned as it ships (a ⚑ line is scanned with its current text). Scripts: the rule-8 scan, the singular scan, the store scan from the copy rewrite; the federation pattern by `git grep --untracked` (DECISIONS.md excluded, it keeps the record).

| Check | Result | Reading |
|---|---|---|
| 1. Banned words and shapes (EN + AR) | **0** words, **0** shapes | Clean |
| 2. Promises | **22** matches, **0** unmarked promises | 13 are the software promises the owner decided (D122: the free 30-minute intro call, the free website review in 3 working days with 5 improvements, progress at every stage on the staging link). 5 aren't promises ("set in each proposal", "We price each project…", the "Within 3 months" option, the demo's "Free" label, "every project" in a heading). 2 are "reply within one working day" on the `/services` and `/work` closings: FC#23, listed in `docs/review/copy-pending.md` for Rand. 2 are the free call on the form button and the Software FAQ (D122) |
| 3. Singular address left in Arabic (owner rule 1) | **10** real, **10** false matches | The 10 real ones are all ⚑ lines that keep their current text until Rand confirms the fact (FC#23 reply time, FC#8 equipment, FC#10–FC#12…); each is in `copy-pending.md`, and its plural proposal goes in with her answer. The false matches are nouns or first-person past forms («خطط» plans, «خطّط» planned, «اخترنا», «سجّلنا», «تواصل سريع», legal nouns) |
| 4. The withdrawn federation case (D121) | **0** | No mention in src, e2e, scripts, public or docs |
| 5. Online store claims for print (D120, D123) | **0** print-linked | 19 matches elsewhere are correct: the e-commerce web service ("online stores", "checkout"), the demo press release about a coffee shop, two photo alts ("heritage cart"), and «مُرسلة» matching «سلة» in the privacy page |
