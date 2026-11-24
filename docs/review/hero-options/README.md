# Home hero: three options (the record of the choice)

**Chosen (2026-11-24): A, with C's dial engraving (D173).** It is now the Home hero; the lab route and options B and C are removed from the code. The files below stay as the record of what was compared.

When it was live, `/ar/hero-lab/a`, `/b` and `/c` (and `/en/...`) each showed one option over the home page's photo strip. All three keep the approved copy, both actions, the clock idea, the brand tokens and RTL. Title, lead and actions are on screen at first paint (LCP stays text), and reduced motion shows the end state.

| Option | Idea | Source and licence | Weight |
|---|---|---|---|
| **A · Countdown to zero** | One photo for each of the five services travels in from outside the frame and settles around the dial, one per second, while the timecode counts 05 → 00. Events lands last, on 12, at zero. Desktop: scrubbed by the scroll (220vh, sticky stage, no pin spacer). Phones: one short gathering on load. | The owner's brief; code written for this site. In the prototype the photos are the category cards' (stock and Rand's); the final build gets five photos of its own (D169). | 5 × ~10 KB thumbnails, eager at low priority |
| **B · Cinematic loop** | A slow loop under a hall chandelier, graded espresso. The title is set low and to the start like a film's opening card, with a small live dial on Dubai time in the corner. | Layout after openhero.art (MIT, github.com/CristianOlivera1/openhero). Its own videos have text and brand logos burned in, so none is used. Video: Pexels, "Elegant Crystal Chandeliers in Banquet Hall" by Sini Ko (Pexels License: free commercial use, no attribution required), re-encoded to WebM with the grade baked in. | WebM 464 KB (desktop only) + poster 91 KB. Phones, Save-Data, 2G/3G and reduced motion get the poster only |
| **C · The dial** | No photo. A watch face larger than the screen sits half outside it. A warm light follows the cursor and lights its gold sunray engraving; on phones the light follows the scroll. The second hand sweeps to 12 on load and stops: zero. | Idea after 21st.dev "Minimalist Spotlight Hero with Kinetic Typography" (themeocean, MIT). Its code needs a 21st.dev login, so none was taken; written from scratch. | SVG only, no image |

Not used:
- **motionsites.ai:** its prompts are behind paid plans and an account, and no free hero could be verified.
- **21st.dev code:** every component needs an account and API key to download.

Files: `a-ar.webp`, `b-ar.webp` and `c-ar.webp` (1440 and 390, Arabic); `a-1440-ar-start|end.webp` and `*-en*.webp`; GIFs `a-1440-ar.gif` (scroll), `a-390-ar.gif` (phone load), `b-1440-ar.gif`, `c-1440-ar.gif` (cursor).
