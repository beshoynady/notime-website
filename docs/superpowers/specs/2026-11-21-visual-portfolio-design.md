# Visual portfolio: real photo scenes in place of drawings (design, 2026-11-21)

The owner's mandate of 2026-11-21 (authoritative, written in Arabic in the session): turn the site into a portfolio that sells NO TIME. Visitors want to watch more than read; the picture and the motion tell it, the text is a short caption. Not waiting for approval: decide, log (D150 onwards), continue.

Inventories this builds on: `docs/content/profile-inventory.md` (Task A), `docs/review/graphics-inventory.md` (Task B). Stories per section: `docs/content/visual-stories.md`.

## 1. Intent

- **Who it's for:** a procurement lead or a marketing manager at a Gulf company or government entity, sent a link by Rand or arriving from search; then a family planning a wedding from Instagram.
- **What it must do:** in five seconds, say who NO TIME is, what it does and why it; then show real work before any claim; then make asking for a quote one tap away on every screen.
- **The feeling:** a quiet, expensive room. Restraint, space, image quality; few effects, each one deliberate.

## 2. Goals, non-goals, anti-goals

**Goals.**
1. Every drawing and demo-style interactive scene (29 sections, graphics inventory) is replaced by a scene built from real photographs.
2. Rand's real work (the profile) appears wherever it fits, flagged where a client is visible.
3. One image registry: replacing a picture is one file and one line.
4. Home's first screen is complete at first paint; Software is under half its phone length; Work shows real photographs and every item has its own link.

**Non-goals.** New copy beyond short captions; new pages in the menu; a CMS; video production (motion examples wait for Rand's files); changing the brand (colours, fonts, logo, «حان وقت البداية»).

**Anti-goals** (failure even if it works): a collage that looks pasted (mismatched light or perspective between layers); stock passed off as NO TIME's work; a scene that delays the headline or the CTA; motion that stutters on a mid-range Android; an empty screen while a pin plays (W02 stays green).

## 3. Constraints

Honesty (D78; no client named in text unless the site already names it; ⚑ lines unchanged); performance (LCP never worse per page, Lighthouse A/B same machine; CLS 0; /links ≥ 95; everything below the first screen lazy; AVIF/WebP, responsive sizes); GSAP for scroll, Motion for interaction, never both on one element; reduced motion = the final still; seven sizes without a cut or empty screen; axe clean, AA contrast, alt in both languages for every picture that carries meaning; RTL mirrored; one agent at a time on an 8 GB machine.

## 4. Approaches considered

| | Approach | Trade-off | Verdict |
|---|---|---|---|
| A | **Composite collage:** a stock background and cutouts from other photos (tables, people, lights) placed over it, each on its own layer | Most freedom to "build" a scene beat by beat; but perspective, light and grain never match across sources, and the result reads as a montage, the opposite of premium. Needs many clean cutouts the profile can't give | Rejected |
| B | **Photo beats with true depth (chosen):** each scene is 2–4 beats; each beat is one real photograph split into depth layers cut from *that same photo* (plate, midground, foreground) with rembg and hand masks; beats change by a mask wipe or a cross-fade, the layers drift at their own depth (2.5D) | The depth is real because it comes from the photo; the story comes from the sequence (empty → set → lit → arrival). Builds on the existing `LayeredScene` (data-driven layers, pin/pass, wipe keys, reduced-motion still, reservations), which already ships the Events opening this way (D109) | **Chosen** |
| C | **Video loops** per section | The most cinematic; but no footage exists (motion examples wait for Rand), stock video is heavy on phones and hurts LCP and data | Later, when Rand sends footage: a beat can become a muted loop in the same slot |

Why B: it's the only one that stays credible with the photos available, it reuses tested machinery, and it degrades to a single excellent photograph (reduced motion, no JS, slow device).

## 5. The scene system (how it's built)

**Data, not components.** A scene stays a `SceneConfig` (`src/content/scenes/`): shots (beats) on a scroll timeline and layers L0–L3. New for this work:
- **Beats as photo groups.** A beat's layers share one source photo; the next beat's plate opens over it with the existing `wipe` key (curtains from the centre, reads the same in RTL) or a cross-fade (`opacity` key).
- **Image ids, not paths.** Every layer's `slot` names an entry of the central registry (§6).
- **Breakpoints.** The pin plays at **≥ 1024px** (the owner's "laptop"); below that the scene **passes** (no pin, a calm parallax while it crosses the screen); the 9:16 art-directed crops still switch at 900px. Reduced motion: the end frame, no movement. (D151)
- **Captions.** One short line per beat at most (the existing `copyKey`), new lines only where a section needs one, written to `copy-voice-reference.md`, humanizer for EN, native AR in the plural, marked for Rand in `copy-pending.md`.
- **Budget.** At most 4 image layers per scene on desktop, 2 on phones; each layer's `sizes` from its box (B10's `layerSizes`); AVIF + WebP at 640/1080/1600/2400 widths; plates ≥ 2000px wide where the source allows, never upscaled; nothing eager below the first screen.

**Where scenes go.**
- **Category openings** keep their current still hero (D129: headline and CTA at first paint) with a real photo plate; the build scene after the hero (desktop) is the photo-beat scene.
- **Service sections:** the module or drawing column becomes a **section scene**: a photo-beat scene in the section's visual column on desktop (pinned under the bars only for the page's one or two peak scenes, Events V and VI; the rest pass), and a parallax photo on phones. Real-work galleries (a short strip of the profile's photos) sit under the services that have them.

**Removed** as each page is rebuilt: the interactive modules and their tests, `service-drawings.tsx`, `majlis-art.tsx`, the drawn `fx-*` classes, `case-visual.tsx`, Software's drawn service visuals (the list: graphics inventory, "Count"). `print-order` stays (it explains how ordering works).

## 6. The image registry (`src/content/media.ts`)

One record per picture the site shows (D152):

```ts
{
  id: "ev-hall-empty",                 // stable, used by scenes, cards, galleries
  file: "/images/stock/ev-hall-empty", // stem: .avif/.webp and width variants beside it
  width: 2400, height: 1350,           // native
  source: "rand-profile" | "stock" | "ai" | "rand",
  credit?: { by: "…", url: "…", license: "Unsplash License" },
  from?: "p9-2",                       // profile image or stock id
  replace: true,                       // a stand-in until a real NO TIME photo exists
  randApproval?: "client-visible" | "faces",
  hidden?: true,                       // one line hides it everywhere: its slot falls back (§8)
  alt: { en, ar } | null,              // null = decorative layer
  spec: "16:9 plate · empty hall, stage end centred, warm house light, no people" // what to shoot or crop
}
```

- A component asks `media(id)`; a hidden or missing entry returns its declared fallback (the next beat's plate, or the section without that layer), never a broken box.
- Existing registries (`images.ts` slots, `scenes/images.ts`, `service-visuals.ts`, `event-photos.ts`, `photo-stories.ts`, work media) are migrated into it page by page as each page is rebuilt; at the end they are thin views over `media.ts` or gone. A unit test enforces: every id used exists; every non-`rand` source has a credit or `from`; Work and case pages use only `rand-profile`/`rand`; every visible (non-decorative) picture has EN and AR alt.
- `docs/content/images-for-rand.md` is generated from the registry (`scripts/images-for-rand.mjs`): every `replace` or `randApproval` entry with a thumbnail and where it shows.

## 7. Image sources and pipeline

1. Rand's profile photos (native size; `public/images/work/` already curated, new ones to `public/images/profile/`).
2. Unsplash (Pexels has no key: the value in `.env.local` is a placeholder), searched with `scripts/stock-search.mjs`; the download endpoint is called as the API guidelines ask. Rules: no logos, no recognisable people or places; people only from behind, hands, or too far to identify, dressed for a Gulf corporate setting.
3. AI: no image-generation key in the environment. Gulf scenes stock lacks (majlis, coffee, tents, carts) are covered by Rand's real heritage photos; anything still missing is listed in the report with options and costs, not generated.

Pipeline (`scripts/scene-layers.mjs`): source → crop to the slot's aspect → grade (the category's grade, `scripts/grade.mjs`) → rembg mask for a foreground layer (feathered, hand-fixed where needed) → AVIF + WebP with alpha at the width set → registry entry.

## 8. Fill or hide

A slot whose picture is hidden or missing shows the beat before it (a scene ends one beat earlier) or, for a gallery tile, closes the gap. Never a placeholder box on the public site.

## 9. Page by page (order of work)

1. **Events** (the model): opening → I–VI per `visual-stories.md`; galleries of Rand's galas, catering and heritage photos.
2. **Home:** first screen (Task C1): the headline, header and both CTAs visible at first paint over a real photo; the clock a small touch, the intro no longer a gate. "Five crafts" cards each with a photo; "Real projects" with the projects' own photos.
3. **Creative, Marketing, Print** (scenes and galleries per the stories; the UAE Pro League social posts as real social work, flagged).
4. **About** (photo-up only), **Software** (Task C2: tabs for the six services, every panel's text in the HTML, the drawn visuals replaced by device photos; target under half of 23,063px on a phone), **products** (screens on a device photo, "Preview" kept).
5. **Work** (Task C3): real photos only; the two cases plus collections of Rand's own work (galas, heritage hospitality, catering, gifts) as items with their own URLs and a copy-link button, so Rand can send any one; the filter row returns at six items (D133).
6. The import cycle between `categories.tsx` and `category-cards.tsx` is fixed when home's cards are touched (Task C4).

## 10. Verification per page

Typecheck, lint, unit (the registry test, scene tests), the page's e2e specs (empty screens, reduced-motion stills, anchors), Lighthouse A/B on that page against the commit before it (mobile, 5 runs, medians), axe on the page EN/AR; shots 1440/390 EN/AR before and after into `docs/checkpoints/visual/`. Commit, HANDOFF, graph update for the changed files.

## 11. Left to the builder

Exact crops, layer counts, depths, timings, beat order inside a section, captions' placement, hover and progress details: decided per section and logged, within §2–§5.
