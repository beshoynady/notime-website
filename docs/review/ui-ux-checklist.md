# Per-page UI/UX checklist (ui-ux-pro-max 2.15.0)

Source: the `ui-ux-pro-max` plugin from `nextlevelbuilder/ui-ux-pro-max-skill` (user scope, installed 2026-11-21). Its `references/quick-reference.md` §1–§3, §5, §7 and §9 (the web rules) plus its landing patterns `trust-authority-conversion` and `portfolio-grid`. Its native-app rules (`pro-rules.md`: safe areas, haptics, Dynamic Type) are left out because this site is a website.

**Brand stays fixed.** The skill's colour, font and style advice is never applied. The palette (Espresso, Cocoa, Taupe, Champagne, Ivory) and the fonts (Montserrat, Alexandria) don't change. Any suggestion it makes on those goes to the "Proposals" list in `docs/report/visual-report.md` and nowhere else.

Run it on every page before its commit. Record the result in the ledger as `UX checklist <page>: pass | <failing ids>`.

## Accessibility (CRITICAL)

- [ ] `color-contrast`: text over photos holds 4.5:1 (large text 3:1). Checked on the actual frame (first frame and still), not on the token.
- [ ] `focus-states` / `focus-not-obscured`: every control shows a focus ring, and the fixed header, CTA bar and rail don't cover the focused control.
- [ ] `alt-text`: meaningful photos have EN and AR alt text from the registry; decorative layers are `aria-hidden`.
- [ ] `heading-hierarchy`: one H1, then H2 → H3 with no skipped level.
- [ ] `keyboard-nav` / `skip-links`: Tab order follows the visual order (RTL too), and the skip control lands where it says.
- [ ] `reduced-motion` / `auto-rotation-controls`: reduced motion shows the final still; nothing moves without a pause; nothing auto-rotates.
- [ ] `web-target-size`: pointer targets are at least 24×24 CSS px (44 on touch for primary actions).

## Interaction (CRITICAL)

- [ ] `hover-vs-tap`: nothing important depends on hover alone; on touch, cursor-driven effects become scroll-driven.
- [ ] `gesture-conflicts`: no horizontal swipe hijacks the page's vertical scroll.

## Performance (HIGH)

- [ ] `image-optimization` / `lazy-load-below-fold`: images go through `next/image` (AVIF/WebP, `sizes`); only the hero is eager.
- [ ] `image-dimension` / `content-jumping`: every image and pin reserves its space (CLS 0).
- [ ] `main-thread-budget`: scrubbed layers use transform/opacity/clip only, with `will-change` only while live.

## Layout and responsive (HIGH)

- [ ] `horizontal-scroll`: no horizontal scroll at 390, and no cut or empty screen at the 7 sizes (W02).
- [ ] `readable-font-size` / `line-length-control`: body text ≥ 16px on phones, 35–60 characters per line on phones and 60–75 on desktop.
- [ ] `viewport-units`: full-screen blocks use `svh`/`dvh`, not `vh`, on phones.
- [ ] `orientation-support`: a landscape phone (844×390) still shows the H1 and the CTA.

## Animation (MEDIUM)

- [ ] `excessive-motion`: one or two moving things per view; one story beat per screen.
- [ ] `motion-meaning`: each beat tells part of the story (`visual-stories.md`); nothing moves for decoration.
- [ ] `parallax-subtle`: phone parallax stays calm; nothing pins below 1024px.
- [ ] `no-blocking-animation` / `interruptible`: scrolling back or jumping to an anchor mid-pin works.
- [ ] `opacity-threshold`: no layer lingers half-visible below 0.2.

## Navigation (HIGH)

- [ ] `deep-linking`: every section has an anchor that lands correctly, including inside a pinned scene.
- [ ] `nav-state-active`: the rail and the header show where the visitor is.
- [ ] `navigation-consistency`: header, CTA bar and WhatsApp sit in the same place on every page.

## Marketing and conversion (landing patterns)

- [ ] **Five-second test:** the first screen says who, what and the next step without scrolling.
- [ ] **One primary CTA per screen** (`primary-action`), and a way to request a quote on every screen.
- [ ] **Proof before claims** (`trust-authority-conversion`): a real photo or work comes before the sentence that claims it. No invented numbers (D78).
- [ ] **Visuals first** (`portfolio-grid`): work reads as images first, then text; images load fast.
- [ ] **Services as outcomes:** each service says what the client gets, not just what we do.
