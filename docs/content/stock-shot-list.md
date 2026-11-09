# Stock shot list: Pexels and Unsplash, by hand (D80)

For the user, who finds and downloads the stock images by hand. **No API, no scraping, no download tools**: search on the site, open the photo's page, use the site's own Download button (largest size).

**Order:** homepage first, then Events, then Software. A slot with no file keeps its designed placeholder; nothing on the site waits for it.

## For every file

1. **Save it with the exact filename** given in its block, into `assets-inbox/` (keep the original extension, `.jpg` is fine).
2. **Add one row** to `assets-inbox/credits.csv`:

   ```
   filename,source,page_url,photographer
   work-sports-league-16x9.jpg,unsplash,https://unsplash.com/photos/…,Jane Doe
   ```

   `source` is `pexels` or `unsplash`; `page_url` is the photo's own page (not the download link); `photographer` is the name shown on that page. Quote a name that contains a comma: `"Doe, Jane"`. A ChatGPT image also gets a row: `ev-open-hall-16x9.png,chatgpt,,`.
3. Run `node scripts/ingest-images.mjs`. It refuses a file with no row, logs its size and hash, and cuts full-size tiles for inspection. After the inspection is recorded as accepted, the install step grades it to the palette, crops it to the slot and records the photographer for the "Image credits" page.

## Rejection rules (every slot)

Reject the photo, don't fix it, if any of these is true:

- **A face in focus**, or anyone recognisable. Backs, silhouettes and hands are fine; blurred far-off figures are fine.
- **Logos, brands, text or signs** anywhere: on screens, shirts, banners, bottles, scoreboards, cars. A small out-of-focus mark you can't read is still a reject.
- **Cool or blue grading**: blue hour skies, cyan shadows, LED-blue stage light, purple neon. The grade warms the image but can't save a blue one.
- **Flags, emblems or national symbols**, and recognisable landmarks (no Burj Khalifa, no named stadiums).
- **Small files**: under 1920 px on the long side for 16:9, under 1080 px wide for 9:16. The ingest never enlarges.
- A heavy filter, HDR look, fisheye or tilt-shift, or a visible watermark.

The look to aim for across all of them: **warm, low-key, luxurious**: one clear warm light source, deep shadows, brass, linen, marble, sand. Gulf through materials and light, never through landmarks.

---

## Homepage

### 1. `work-sports-league-16x9` · Our Work card

- **Save as:** `work-sports-league-16x9.jpg`
- **Search:** `empty stadium night floodlights` · `stadium seats warm light` · `football pitch night empty`
- **Shows:** an empty stadium or pitch at night, under floodlights. Rows of empty seats, or the pitch from the stands. No players, no crowd in focus.
- **Light and angle:** warm floodlight (sodium or tungsten, not white LED), haze in the beams; wide, from high in the stands, slight diagonal.
- **Also reject:** any club crest, sponsor board, scoreboard or seat lettering you can read.

### 2. `work-airline-pavilion-16x9` · Our Work card

- **Save as:** `work-airline-pavilion-16x9.jpg`
- **Search:** `exhibition stand empty hall` · `trade show booth warm lighting` · `pavilion interior wood lighting`
- **Shows:** a built exhibition pavilion or stand in a large hall, before the doors open. Clean architecture: timber, fabric, a lit plinth. Empty or with distant blurred figures.
- **Light and angle:** warm interior light, the hall around it darker; three-quarter view at eye level.
- **Also reject:** any aircraft, airline livery, brand or exhibitor name, even on a far stand.

### 3. `work-sports-federation-16x9` · Our Work card (also the Software case study, see below)

- **Save as:** `work-sports-federation-16x9.jpg`
- **Search:** `running track dusk` · `athletics track lanes golden hour` · `empty running track sunset`
- **Shows:** an empty athletics track: lane lines curving away, no runners (one far-off silhouette at most).
- **Light and angle:** low golden sun or warm dusk, long shadows across the lanes; low camera close to the track surface, lanes leading the eye.
- **Also reject:** lane numbers in focus, sponsor marks on barriers, a blue sky filling the frame.

### 4. `product-restaurant-system-16x9` · Digital, restaurant system

- **Save as:** `product-restaurant-system-16x9.jpg`
- **Search:** `restaurant kitchen pass plates` · `chef plating warm light` · `fine dining service counter`
- **Shows:** a restaurant pass at service time: plates waiting under warm lamps, hands at work, everything in soft focus beyond the first plate.
- **Light and angle:** warm heat-lamp or pendant light, dark kitchen behind; close, at counter height.
- **Also reject:** a chef's face in focus, branded bottles or packaging, a screen with readable text.

### 5. `hero-fallback-16x9` · Hero, when the video can't play

- **Save as:** `hero-fallback-16x9.jpg`
- **Search:** `event hall warm lighting empty` · `stage lights haze warm` · `banquet hall before event`
- **Shows:** a hall or stage just before an event: lights coming up, haze, set but empty. It sits behind the headline, so the centre should be calm.
- **Light and angle:** low-key, warm, one source; wide and symmetrical, from the back of the room.
- **Also reject:** a busy centre (the headline sits there), any screen showing content.

---

## Events

These are the Events opening's plates. Each also has a ChatGPT prompt in `image-prompt-pack.md`; use whichever gives the better image, never both for one slot.

### 6. `ev-open-hall-16x9` and `ev-open-hall-9x16` · Events opening, the empty hall

- **Save as:** `ev-open-hall-16x9.jpg` and `ev-open-hall-9x16.jpg` (the portrait one can be a second photo, or the same photo if it is tall enough to crop 9:16)
- **Search:** `empty banquet hall` · `ballroom empty dark stage` · `event venue empty chandelier`
- **Shows:** a wide, empty banquet hall from the back: bare floor, no tables, no chairs, a faint warm wash on the stage at the far end.
- **Light and angle:** lights mostly off, one warm glow at the stage, soft haze; symmetrical, deep central perspective, eye level.
- **Also reject:** set tables or chairs (the scene adds them as it scrolls), people, a lit screen on stage.

### 7. `ev-majlis-dusk-16x9` and `ev-majlis-dusk-9x16` · Events, the majlis at dusk

- **Save as:** `ev-majlis-dusk-16x9.jpg` and `ev-majlis-dusk-9x16.jpg`
- **Search:** `desert tent dusk lanterns` · `arabic majlis outdoor evening` · `bedouin tent night warm light`
- **Shows:** an open majlis or tent in the desert at dusk: low seating, cushions, rugs, lanterns; sand beyond.
- **Light and angle:** warm lantern and fire light against the last warm light in the sky (amber, not blue); eye level from just outside the tent.
- **Also reject:** a deep blue sky, tourist-camp signs, people facing the camera.

### Optional: cutout layers

The Events opening also has foreground cutouts (`ev-open-table`, `ev-open-florals`, `ev-open-candles`, `ev-open-glasses`). These need transparent PNGs, which stock photos rarely are; they stay ChatGPT or code. **Skip them here** unless you find a photo on a plain dark background that suits; ask first, and I'll add its row and cut-out step.

---

## Software

### 8. `work-sports-federation-16x9` · Software case study

The same file as #3: one download serves both places. No second row.

---

**After you drop the files:** tell me, and I'll run the ingest, show you the contact sheet, and only then put them on the site.
