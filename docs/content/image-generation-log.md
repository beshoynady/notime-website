# AI image generation log (D76, D79)

Every image is a row: since D79 the images are made by hand in ChatGPT (free tier) and `scripts/ingest-images.mjs` writes the rows (received, verdict, installed), with the size and SHA-256 of the original. Inspection verdicts are rows too. Strategy: **real photos and code first, AI last.** AI fills only layers and slots with no real source (layers.md, image-prompts.md).

Approved budget: none. No paid image API is used (D79); the Replicate plan below is kept for the record only. The Est. USD column stays 0.00, and the Model column names the tool.

## Plan (approved 2026-11-09, D77; provider superseded by D79, the slot list stands)

- **Provider and model:** Replicate, `black-forest-labs/flux-1.1-pro-ultra`, raw mode, one model for every slot. **USD 0.06 per image** (replicate.com model page, 2026-11-09). Output up to 4 MP; each file is cropped to its aspect and downscaled to the approved delivery size (1680 × 944, 944 × 1680, 1136 × 1408), never upscaled (D51).
- **Prompt:** the house style + the slot's prompt + the shared negative prompt as an "Avoid:" list (the model takes no negative prompt). All from image-prompts.md and layers.md.

| # | Slot | Aspect | Delivery size | Why AI |
|---|---|---|---|---|
| 1 | `hero-fallback-16x9` | 16:9 | 1680 × 944 | Canva result rejected (see-through pillar); no real source |
| 2 | `product-restaurant-system-16x9` | 16:9 | 1680 × 944 | Not generated (Canva quota); no real source |
| 3 | `ev-open-hall` | 16:9 | 1680 × 944 | Opening L0 plate; no real empty-hall photo |
| 4 | `ev-open-hall` | 9:16 | 944 × 1680 | Same plate, mobile |
| 5 | `ev-majlis-dusk` | 16:9 | 1680 × 944 | Majlis L0 sky; no real source |
| 6 | `ev-majlis-dusk` | 9:16 | 944 × 1680 | Same plate, mobile |
| (7) | `ev-open-candles` | 4:5 cutout | trimmed | **Only if** the real cutout (`private-celebrations-4`) fails |
| (8) | `ev-majlis-cup` | 4:5 cutout | trimmed | **Only if** the real cutout (`heritage-2`, grade C) fails |

- **Estimate:** 6 images = USD 0.36; with the 2 conditional fallbacks, USD 0.48. **With retries** (up to 2 regenerations per image): at most 24 images = **USD 1.44**. Proposed budget: **USD 1.50**.
- **Order:** 1 (`hero-fallback-16x9`, next to its approved Canva sibling `hero-fallback-9x16`) and 3 (`ev-open-hall` 16:9) first, then stop with a contact sheet beside the 7 approved Canva images.
- **Later, each after its category's animatic is approved (D64):** Production, Print & Gifts 4, Marketing & Brand 4, Creative Production 3: 11 images, USD 0.66, at most USD 1.98 with retries. Not part of this budget.

## Requests

| Date | Slot | Aspect | Model | Output | Seed | Est. USD | Prediction | Status |
|---|---|---|---|---|---|---|---|---|
