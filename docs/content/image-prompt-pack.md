# Image prompt pack: ChatGPT (free tier), D79

For the user, who generates the six AI-gap images by hand in ChatGPT: one tool for all, for a consistent style. Each block is self-contained: copy the prompt, generate, check, then save the file **with the exact filename** into `assets-inbox/` (gitignored), and add its row to `assets-inbox/credits.csv`: `<filename>,chatgpt,,` (the ingest refuses a file with no row, D80). `node scripts/ingest-images.mjs` does the rest (D79). Stock photos from Pexels or Unsplash have their own list: `stock-shot-list.md`.

**Priority order:** 1 → 6. The first two go to the contact sheet before the rest.

**Before you start:**
- **Use one chat for all six,** so the look stays the same, and paste each prompt in full (don't say "same as before").
- **Download the original:** use ChatGPT's download button, not a screenshot. The file keeps its full size and its Content Credentials, which the ingest step records.
- **Sizes:** ChatGPT returns 1536 × 1024 for landscape and 1024 × 1536 for portrait. The ingest step crops 16:9 or 9:16 from the centre and never enlarges (D51), so the delivered files are 1536 × 864 and 864 × 1536. **Keep the important parts away from the top and bottom edges** (landscape) or the left and right edges (portrait).
- **Reject, don't fix:** if an image has a visible watermark, text or a logo, generate again. Nothing is cropped or painted out.

**Check every image at full size before saving:**
- no text, letters, numbers or signs of any kind;
- no logos, brand marks, flags or emblems;
- no faces in focus, and no recognisable people;
- no extra or melted fingers, if hands appear;
- no warped lines, smeared areas, doubled objects or melted edges;
- no visible watermark.

---

## 1. `ev-open-hall`, landscape · save as `ev-open-hall-16x9.png`

The opening's back plate on desktop: the empty hall before anything is set.

```
Create a wide 16:9 landscape photograph. A wide, empty banquet hall seen from the back of the room, with the lights off except for a faint warm wash on the stage at the far end. Soft haze hangs in the air. The floor is bare: no tables, no chairs, no people. The composition is symmetrical, with deep perspective toward the stage, and the shadows hold very little detail. Style: a cinematic still photograph taken on a full-frame camera with a 35 mm lens, shallow depth of field, low-key warm light from one clear source, subtle film grain, deep rich shadows and gentle highlights. The palette stays within deep espresso brown, cocoa, warm taupe, champagne beige and vanilla ivory. The mood is quiet, unhurried and luxurious, set in the Gulf through materials and light (brass, linen, marble), never through landmarks. The image contains no text, letters, numbers or signage of any kind, no logos or brand names, no flags or emblems, and no people. There is no neon, no blue or purple light, no lens-flare stars, no HDR look and no fisheye distortion. It must look like a real photograph, not a 3D render, illustration or CGI.
```

## 2. `ev-open-hall`, portrait · save as `ev-open-hall-9x16.png`

The same plate for phones. Generate it in the same chat, right after #1.

```
Create a tall 9:16 portrait photograph of the same empty banquet hall as before, seen from the back of the room. The lights are off except for a faint warm wash on the stage at the far end, which sits in the upper middle of the frame. Soft haze hangs in the air. The floor is bare: no tables, no chairs, no people. Deep central perspective; the shadows hold very little detail. Style: a cinematic still photograph taken on a full-frame camera with a 35 mm lens, shallow depth of field, low-key warm light from one clear source, subtle film grain, deep rich shadows and gentle highlights. The palette stays within deep espresso brown, cocoa, warm taupe, champagne beige and vanilla ivory. Quiet, unhurried and luxurious. The image contains no text, letters, numbers or signage, no logos, no flags or emblems, and no people. No neon, no blue or purple light, no lens-flare stars, no HDR look. It must look like a real photograph, not a 3D render, illustration or CGI.
```

## 3. `ev-majlis-dusk`, landscape · save as `ev-majlis-dusk-16x9.png`

The majlis scene's sky and sand, behind the real tent, dallah and cup.

```
Create a wide 16:9 landscape photograph of open desert sand at dusk. Low, gentle dunes sit in the lower third of the frame under a deep sky that fades from espresso brown at the top to soft champagne near the horizon. There is no sun disc, no structures, no tents, no vehicles and no people. Everything is very soft and calm, with large empty areas of sky. Style: a cinematic still photograph on a full-frame camera with a 50 mm lens, low-key warm light, soft atmospheric haze, subtle film grain, deep rich shadows and gentle highlights. The palette stays within deep espresso brown, cocoa, warm taupe, champagne beige and vanilla ivory. Quiet, unhurried and luxurious. The image contains no text, letters, numbers or signs, no logos, no flags or emblems, and no people. No saturated orange or purple sunset, no blue light, no lens-flare stars, no HDR look. It must look like a real photograph, not a 3D render, illustration or CGI.
```

## 4. `ev-majlis-dusk`, portrait · save as `ev-majlis-dusk-9x16.png`

The same plate for phones. Generate it right after #3.

```
Create a tall 9:16 portrait photograph of the same desert at dusk as before. Low, gentle dunes fill the lower quarter of the frame; above them a deep sky fades from espresso brown at the top to soft champagne near the horizon. There is no sun disc, no structures, no tents, no vehicles and no people. Very soft and calm, with a large empty sky. Style: a cinematic still photograph on a full-frame camera with a 50 mm lens, low-key warm light, soft atmospheric haze, subtle film grain, deep rich shadows and gentle highlights. The palette stays within deep espresso brown, cocoa, warm taupe, champagne beige and vanilla ivory. The image contains no text, letters, numbers or signs, no logos, no flags or emblems, and no people. No saturated orange or purple sunset, no blue light, no lens-flare stars, no HDR look. It must look like a real photograph, not a 3D render, illustration or CGI.
```

## 5. `hero-fallback-16x9`, landscape · save as `hero-fallback-16x9.png`

The homepage hero image when the video doesn't play, next to the approved portrait version (`hero-fallback-9x16`). The title sits over the centre.

```
Create a wide 16:9 landscape photograph. Stage light beams cut down through thick warm haze over an empty venue, seen from the floor looking up. The surroundings are dark espresso brown; the beams are champagne-gold, and dust motes are visible in the light. Leave strong empty space in the centre of the frame for a title to sit on. Every pillar, truss and stage structure is solid and complete, never see-through or melted. Style: a cinematic still photograph on a full-frame camera with a 35 mm lens, shallow depth of field, low-key warm light, subtle film grain, deep rich shadows and gentle highlights. The palette stays within deep espresso brown, cocoa, warm taupe, champagne beige and vanilla ivory. Quiet and luxurious. The image contains no text, letters, numbers or signage, no logos, no flags or emblems, and no people or crowds. No neon, no blue or purple light, no lens-flare stars, no HDR look. It must look like a real photograph, not a 3D render, illustration or CGI.
```

- The Canva version was rejected for a see-through pillar: check the structures closely.

## 6. `product-restaurant-system-16x9`, landscape · save as `product-restaurant-system-16x9.png`

The card image for the restaurant system ("Peak Hour by NO TIME").

```
Create a wide 16:9 landscape photograph of a restaurant pass at service time, in soft focus: plated dishes under warm heat lamps, a brass service bell, and a ticket rail holding blank paper tickets with nothing written on them. The kitchen glows warmly behind. Movement is suggested only by gentle blur; any cooks are far in the background, out of focus, with no faces visible. Style: a cinematic still photograph on a full-frame camera with a 50 mm lens, shallow depth of field, low-key warm light from one clear source, subtle film grain, deep rich shadows and gentle highlights. The palette stays within deep espresso brown, cocoa, warm taupe, champagne beige and vanilla ivory, with brass and marble details. The image contains no text, letters, numbers or handwriting (the tickets are blank), no logos or brand names, no screens with writing, and no faces in focus. No neon, no blue or purple light, no HDR look. It must look like a real photograph, not a 3D render, illustration or CGI.
```

- Check the tickets closely: they must be blank, with no scribbles that read as letters.
