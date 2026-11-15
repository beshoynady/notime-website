# Batch 2 · Events & Hospitality: judgment calls

Branch `worktree-agent-a8f48549d1aade62f`, built on `phase-2-services` 4593f13 and merged with it (f37bd34). One line per call, each with a recommendation. The lead moves the confirmed ones into DECISIONS.md and decisions-to-confirm.md. The Arabic log is already in docs/content/copy-ar-rewrite.md, section "Events & Hospitality".

## Judgment calls (recommendation: confirm all unless noted)

1. **The opening is a drawn hall plus a real NO TIME room photo, not cutouts.** With no paid generation, the hall is an architect's line drawing (CSS SVG) sharing its vanishing point with `private-celebrations-1`, which fades in at shot 2 (graded, 199 KB desktop and 78 KB mobile). The table, florals, candles and glasses layers are dropped; the light (haze, stage glow, beams, candle points) carries the motion. Confirm; swap in AI plates later if the budget appears.
2. **The majlis is drawn in code.** Dusk and tent are CSS SVG layers; the dallah, cup, pour and steam are one SVG (`MajlisArt`) in the overlay, so the pour always meets the cup at any width. It runs on its own ScrollTrigger with the same start and end as SceneDirector (frozen, opacity and scale keys only). Reduced motion and no-JS show the poured, steaming end frame. Confirm.
3. **`MajlisArt` imports `anchorOffset` from the frozen `providers/anchor-scroll` (read only)** to match the pin's start under the header. No change to shared code. Confirm.
4. **Stand assembly scrubs without a pin** (`top 85%` to `bottom 55%`), to avoid a second pin's anchor and CLS risk on a page that already pins twice. Confirm.
5. **The agenda and the menu have no controls, so no live region.** The agenda lights slot by slot on scroll; the menu draws once. A live region would announce nothing the reader didn't trigger. Confirm.
6. **Static fallbacks go through a new server map** (`components/modules/static-fallbacks.tsx`), which `ServiceSection` renders inside the slot instead of the empty placeholder. Other categories can add theirs there. Confirm; the lead may want to fold it into the registry later.
7. **Hooks live in a generic map** (`content/service-hooks.ts`, by service slug), rendered under the H2 on any category that adds entries. Six Events hooks, each with its source. Confirm.
8. **Related work sits after the services and before the FAQ**, in Act 3's tone (ivory on the Evening), and is hidden when a category has no cases. Reusable by all categories: `CategoryView` renders it for each. Confirm; it changes the other categories' pages too once they have cases (today it shows only where `work.ts` lists the category).
9. **Hover spec #19 on the Evening:** the section's light swells (the visual), a champagne line sweeps along the deliverables from inline-start (the light sweep), and the deliverables rise in. Same triggers as Software: hover, focus-within, or crossing the viewport's middle; desktop with a pointer only; touch, below 900 px, no-JS and reduced motion keep every deliverable shown and still. Confirm.
10. **The launch reveal shows a drawn product with "Example", not an AI image**, so it needs no "Illustrative" label (it stands in for no real project). Confirm.
11. **The moodboard and the menu use real NO TIME photos** (private-celebrations, catering, heritage; no faces in focus, no branding), shown as the company's work, never as a named project. The moods themselves are labelled "Example". Confirm.
12. **The menu module is not labelled "Example"**: it lists the real offering from the profile (p.26–32) with no dishes or prices, and ends "Composed for each occasion." Confirm.
13. **Module height reservations are estimates** (category.css, kept below the expected height so a slot grows rather than leaves a gap). The static fallbacks render in the same box server-side, so the risk is small. **Re-measure at M3** with scripts/anchor-shift.mjs and replace them.
14. **The lab Events route now shows the public scenes** (`LAB_SCENES` and `LAB_SECTION_SCENES` are empty). The e2e specs that assumed lab-only scenes and empty fallbacks (`events-animatic`, `opening`, `category-modules`) now target the public page; not run (reduced test policy), so they run first at M3.
15. **Arabic copy:** the approved deck is kept where it already read natively; 16 lines changed (calques such as «إطلاقات», «محطات الطهي الحية», «قبل كم من الوقت»; «تحت سقف واحد» retired as on the homepage). docs/content/category-copy-events.md still shows the 2026-11-09 text; the log is the record. Confirm, and the lead may want to refresh the deck file.
16. **Moodboard swatch names in Arabic** are everyday colour words («بنّي داكن», «رملي», «عاجي», «شمبانيا», «كاكاو») rather than the brand token names (Deep Espresso, Warm Taupe…). Confirm.

## For the lead (shared code; not changed here)

- `category.css` gained additive rules only: `.svc-hook`, the six Events reservations. `ServiceSection` and `CategoryView` gained the `hook` / `light` props, the static fallback, `MajlisArt`, `RelatedWork` and `EveningDirector`.
- `turbopack.root` is a local, uncommitted edit in `next.config.ts` (the worktree's node_modules junction); never merge it.
