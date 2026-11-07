# Company profile 2026: image inventory

Source: `docs/brand/company-profile-2026.pdf`. Every embedded image object at its native resolution (not page renders), extracted by `scripts/extract-profile.mjs` (DECISIONS D47) into `public/images/work/raw/`. That folder is **gitignored and never deployed**, because it contains stock, AI and unapproved photos of people (D48). The images below marked **→ curated** are copied by `scripts/curate-profile.mjs` into `public/images/work/<slug>/` as AVIF + WebP. None of them is wired to a page yet: each client must first approve the use of its name (OPEN_QUESTIONS #17).

**Not extracted:** pages 20 (41 media-outlet logos), 30 (2, Arabic singers), 34 (2, oud players), 35–37 (49, influencer roster). Two 2×2 spacer pixels (pages 1, 38) are skipped too.

## Summary

Each image is counted once, in the first group that applies.

| Group | Images |
|---|---|
| **→ curated** (real work, no identifiable person, usable size) | **32** across 8 slugs |
| Real work, **identifiable people**: pending photo rights (OQ #18) | 19 |
| Real work, good **alternates**, not curated (kept in raw) | 12 |
| Real work, **too small** for any slot: originals needed (OQ #21) | 10 (one of them also shows people) |
| Real work with baked-in UI: clean original needed (OQ #21) | 1 |
| Client web and social work, NO TIME's role unconfirmed (OQ #20) | 5 |
| **AI-generated** | 5 (4 client deliverables on page 14, 1 AI visual on page 7) |
| **Stock or render**, never shown as work | 4 |
| Supplier catalogue sheets, not NO TIME photography | 2 |
| Empty device-frame masks (no picture content) | 6 |
| Talent performers, not used | 1 |
| Brand logo | 1 |
| **Total extracted** (pages 1–19, 21–29, 31–33) | **98** |

**Gaps that matter for Our Work:**

- **Smith Gulf** has no usable image: all four are 228–373 px tall.
- **EgyptAir** has one: 751 px wide.
- **Ultimate Power Solution** has none without identifiable people.

These three need originals from the client before their project pages can carry photography.

**Quality key** (long edge): **A** ≥ 1200 px · **B** 800–1199 px · **C** < 800 px (small card at most) · **X** too small for any slot.

**People key:** **none** · **distant** (people present, not identifiable at any size the site would show) · **yes** (identifiable faces: needs the person's consent or the client's confirmation that it holds the rights).

## Inventory

| File | Page · section | Client / project | Size · quality | People | AI / stock | Decision / slot |
|---|---|---|---|---|---|---|
| p1-1.png | 1 · cover | NO TIME logo (wordmark + "CREATIVE HOUSE") | 3035×819 · A | none | — | Not used: the logo comes from `docs/brand/logo-source/` (OQ #12) |
| p3-1.jpg | 3 · About us | none: laptop and documents, business hands | 1500×1000 · A | hands | **stock** | **Never use** |
| p4-1.jpg | 4 · Events | unnamed: long dining table, crystal and florals | 1247×703 · A | none | — | → **catering-2** |
| p4-2.jpg | 4 · Events | unnamed: tiered savoury and dessert display | 1247×702 · A | none | — | Alternate (raw) |
| p4-3.jpg | 4 · Events | unnamed: floral and dessert table | 1247×702 · A | none | — | → **catering-3** |
| p5-1.jpg | 5 · Events | **UAE Pro League**: Sponsor's Tournament identity on fabric | 1224×664 · A | none | — | → **uae-pro-league-1** |
| p5-2.jpg | 5 · Events | UAE Pro League: Sponsor's Tournament winners, confetti | 1224×664 · A | yes | — | Pending rights |
| p5-3.jpg | 5 · Events | UAE Pro League: Super Cup pre-match ceremony (Al Ain v Sharjah) | 1060×575 · B | distant | — | → **uae-pro-league-2** |
| p5-4.jpg | 5 · Events | UAE Pro League: ADIB grand-prize presentation on the pitch | 1224×665 · A | yes | — | Pending rights; ADIB is a sponsor brand (OQ #17) |
| p6-1.jpg | 6 · Ceremonies | **UAE Athletics Federation**: award ceremony, athlete on screen | 1273×619 · A | yes | — | Pending rights |
| p6-2.jpg | 6 · Ceremonies | UAEAF: National Athletics Team Recognition Ceremony, group on stage | 1284×619 · A | yes | — | Pending rights |
| p6-3.jpg | 6 · Ceremonies | unnamed ceremony: harpist and performer on stage | 1281×622 · A | yes | — | **Not used** (talent performers) |
| p6-4.jpg | 6 · Ceremonies | UAEAF event backdrop, Ultimate Power Solution as sponsor | 1281×622 · A | none | — | → **uae-athletics-federation-3** |
| p7-1.jpg | 7 · Exhibitions | **Ultimate Power Solution**: stand with robot-costume performers and guests | 931×620 · B | yes | — | Pending rights |
| p7-2.jpg | 7 · Exhibitions | Ultimate Power Solution: stand, humanoid robots, performers, meeting | 931×620 · B | yes | — | Pending rights |
| p7-3.jpg | 7 · Exhibitions | Ultimate Power Solution: stand, musicians with robots | 931×620 · B | yes | — | Pending rights |
| p7-4.jpg | 7 · Exhibitions | none: tech gallery with portraits of the UAE President | 931×621 · B | head of state | **AI** (generator watermark) | **Never use**: not a real project; head-of-state image |
| p8-1.jpg | 8 · Activations & stands | **Sandoz** (A Novartis Division): Linex Baby stand at a paediatric conference | 577×1280 · A (portrait, 577 wide) | none | — | → **sandoz-1**. GSK and Sanofi appear only on the venue's backdrop; they are not NO TIME clients |
| p8-2.jpg | 8 · Activations & stands | Ultimate Power Solution: stand aisle with costume performers | 905×603 · B | yes | — | Pending rights |
| p8-3.jpg | 8 · Activations & stands | Ultimate Power Solution: meeting beside the generator display | 905×603 · B | yes | — | Pending rights |
| p8-4.jpg | 8 · Activations & stands | Ultimate Power Solution: generator display, staff and visitors | 957×638 · B | yes | — | Pending rights |
| p8-5.jpg | 8 · Activations & stands | unnamed: terrace with white floral installation, palms | 850×638 · B | none | — | → **private-celebrations-7** |
| p9-1.jpg | 9 · Gala & wedding décor | unnamed: white and blue florals, candles | 859×1290 · A | none | — | → **private-celebrations-2** |
| p9-2.jpg | 9 · Gala & wedding décor | unnamed: conservatory hall, red lanterns, long tables | 1600×1066 · A | none | — | → **private-celebrations-1** |
| p9-3.jpg | 9 · Gala & wedding décor | unnamed: tuxedo-wrapped bouquet keepsake | 859×1290 · A | none | — | → **private-celebrations-6** |
| p10-1.jpg | 10 · Floral & styling | unnamed: entrance arrangement, candles, marble floor | 537×716 · C | none | — | → **private-celebrations-3** |
| p10-2.jpg | 10 · Technical setup | unnamed: ballroom with truss and scaffold, crew | 953×715 · B | distant | — | → **private-celebrations-8** |
| p10-3.jpg | 10 · Floral & styling | unnamed: red and orange centrepiece in glass | 537×716 · C | none | — | Alternate (raw) |
| p10-4.jpg | 10 · Floral & styling | unnamed: tuxedo-wrapped keepsakes, pile | 811×541 · B | none | — | Alternate (raw) |
| p10-5.jpg | 10 · Floral & styling | unnamed: candles and hydrangeas on a table runner | 811×541 · B | none | — | → **private-celebrations-4** |
| p10-6.jpg | 10 · Floral & styling | unnamed: florist placing a bouquet | 405×541 · X | hand | — | Too small |
| p11-1.jpg | 11 · Private celebrations | unnamed: baby-reception dessert table, candelabra | 949×534 · B | none | — | → **private-celebrations-5** |
| p12-1.jpg | 12 · Marketing | UAE Pro League website (screenshot) | 1018×571 · B | yes (players) | — | Hold: role unconfirmed (OQ #20) |
| p12-2.jpg | 12 · Marketing | "Expo 2020 Game" government portal (screenshot) | 1025×579 · B | none | — | Hold (OQ #20) |
| p12-3.jpg | 12 · Marketing | government portal with portraits of UAE rulers (screenshot) | 1014×573 · B | rulers | — | Hold (OQ #20); never crop the portraits for marketing |
| p12-4.jpg | 12 · Marketing | Dubai e-services portal (screenshot) | 1026×576 · B | none | — | Hold (OQ #20) |
| p13-1.jpg | 13 · Social media | UAE Pro League: social grid (results, registration posts) | 680×685 · C | distant | — | Alternate (raw) |
| p13-2.jpg | 13 · Social media | unnamed Dubai government account: investment posts incl. a ruler's portrait | 683×686 · C | ruler | — | Hold (OQ #20) |
| p13-3.jpg | 13 · Social media | UAE Pro League: "Fan Zone" post | 643×738 · C | distant | — | → **uae-pro-league-3** |
| p13-4.jpg | 13 · Social media | UAE Pro League: "Dawri Al Jamaheer" round-result post (club crests) | 643×738 · C | none | — | → **uae-pro-league-4** |
| p14-1.jpg | 14 · AI content | UAEAF Oregon 26: three athletes, flags | 547×980 · B | AI likenesses | **AI deliverable** | Hold: AI-content case only, labelled "Produced with AI" as in the profile; client OK needed |
| p14-2.jpg | 14 · AI content | UAEAF Oregon 26: federation banner, empty stadium | 547×980 · B | none | **AI deliverable** | Hold (same) |
| p14-3.jpg | 14 · AI content | UAEAF Oregon 26: championship banner, athlete | 547×980 · B | AI likeness | **AI deliverable** | Hold (same) |
| p14-4.jpg | 14 · AI content | UAEAF Oregon 26: sprinter at dusk | 547×980 · B | AI likeness | **AI deliverable** | Hold (same) |
| p16-1.jpg | 16 · Case study | UAEAF Oregon 26 key visual: named athlete, "The final awaits" | 659×879 · B | yes | — | Pending rights |
| p16-2.jpg | 16 · Case study | UAEAF Oregon 26 key visual: named athlete | 659×879 · B | yes | — | Pending rights |
| p16-3.jpg | 16 · Case study | UAEAF Oregon 26 key visual: named athlete, 400 m | 659×879 · B | yes | — | Pending rights |
| p17-1.jpg | 17 · Case study | UAEAF Oregon 26 post: athlete warming up | 659×879 · B | yes | — | Pending rights |
| p17-2.jpg | 17 · Case study | UAEAF Oregon 26 post: athlete on the track | 659×879 · B | yes | — | Pending rights |
| p17-3.jpg | 17 · Case study | UAEAF Oregon 26 post: two officials in the stands | 659×879 · B | yes | — | Pending rights |
| p18-1.png | 18 · Case study | none: grey device-frame mask | 594×421 | — | — | Empty, not a picture |
| p18-2.jpg | 18 · Case study | UAEAF: uaeathletics.ae home page, desktop (screenshot) | 1544×965 · A | illustrated athlete (site artwork) | — | → **uae-athletics-federation-1** |
| p18-3.png | 18 · Case study | none: device-frame mask | 358×699 | — | — | Empty |
| p18-4.png | 18 · Case study | UAEAF: uaeathletics.ae on mobile (screenshot) | 459×1048 · B | as above | — | → **uae-athletics-federation-2**. The federation's own figures appear on screen; never quoted as NO TIME's |
| p19-1.png | 19 · PR | none: device-frame mask | 511×490 | — | — | Empty |
| p19-2.jpg | 19 · PR | **EgyptAir**: pavilion, wide view with aircraft model | 751×501 · C | distant | — | → **egyptair-pavilion-1** (originals wanted, OQ #21) |
| p19-3.png | 19 · PR | none: mask | 1029×243 | — | — | Empty |
| p19-4.jpg | 19 · PR | EgyptAir: pavilion lounge seating | 259×173 · X | none | — | Too small (OQ #21) |
| p19-5.png | 19 · PR | none: mask | 541×462 | — | — | Empty |
| p19-6.jpg | 19 · PR | EgyptAir: pavilion with aircraft model | 354×236 · X | distant | — | Too small (OQ #21) |
| p19-7.png | 19 · PR | none: mask | 685×365 | — | — | Empty |
| p19-8.jpg | 19 · PR | EgyptAir: reception desk with staff | 354×236 · X | yes | — | Too small (OQ #21); pending rights |
| p21-1.jpg | 21 · Production | **Smith Gulf**: stand, orange frames | 497×373 · X | distant | — | Too small (OQ #21) |
| p21-2.jpg | 21 · Production | Smith Gulf: stand, second angle | 304×228 · X | distant | — | Too small |
| p21-3.jpg | 21 · Production | Smith Gulf: stand, third angle | 304×228 · X | distant | — | Too small |
| p21-4.jpg | 21 · Production | Smith Gulf: glass meeting box, orange frame | 341×228 · X | none | — | Too small |
| p22-1.jpg | 22 · Gift items | none: notebook product sheet "LXNB-04" with SKU and print options | 903×1280 · A | none | supplier catalogue | Not NO TIME photography; not used as work |
| p22-2.jpg | 22 · Gift items | none: "AZURE NB-14" notebook product sheet | 866×1280 · A | none | supplier catalogue | Same |
| p23-1.jpg | 23 · Gift items | unnamed: framed folded T-shirts (mock-up sheet) | 1024×724 · B | none | mock-up | Alternate (raw) |
| p23-2.jpg | 23 · Gift items | **Emirates Driving Institute**: sports T-shirt design (mock-up) | 905×1019 · B | none | mock-up | → **gifts-2** (client name: OQ #17) |
| p23-3.jpg | 23 · Gift items | unnamed: gold Dubai-skyline bookmark | 1280×719 · A | none | — | → **gifts-1** |
| p23-4.jpg | 23 · Gift items | UAE Pro League: corporate gift set (notebook, pen, flask) | 1280×882 · A | none | — | → **uae-pro-league-5** |
| p24-1.jpg | 24 · Gift items | UAE Pro League Awards 2020–2021: PU gift box | 1280×866 · A | none | — | Not curated: a carousel badge ("2 of 3") and a "PU BOX" label are baked into the image; clean original wanted (OQ #21) |
| p24-2.jpg | 24 · Gift items | three people in printed jerseys holding a ball | 1024×683 · B | yes | — | Pending rights; may be talent (not used until confirmed) |
| p25-1.jpg | 25 · Photography | unnamed: dessert glasses, grapes (food styling) | 482×322 · X | none | — | Too small |
| p25-2.jpg | 25 · Photography | unnamed: dessert glass on bark (food styling) | 482×321 · X | none | — | Too small |
| p25-3.jpg | 25 · Photography | unnamed: dessert boards (food styling) | 1187×668 · B | none | — | → **catering-4** |
| p25-4.jpg | 25 · Photography | unnamed: dessert boards, second set | 1186×668 · B | none | — | Alternate (raw) |
| p26-1.jpg | 26 · Catering | unnamed: tiered silver stand carried by a server (torso) | 718×759 · C | torso | — | → **catering-5** |
| p26-2.jpg | 26 · Catering | unnamed: canapé tray carried by a server | 718×759 · C | torso | — | Alternate (raw) |
| p26-3.jpg | 26 · Catering | unnamed: tray of glasses carried by a server | 718×759 · C | torso | — | Alternate (raw) |
| p26-4.jpg | 26 · Catering | unnamed: pastry tray carried by a server | 718×759 · C | torso | — | Alternate (raw) |
| p27-1.jpg | 27 · Catering | unnamed: green mocktails with florals | 1188×1196 · B | torso | — | → **catering-6** |
| p27-2.jpg | 27 · Catering | unnamed: dessert cups, lilac décor | 927×1156 · B | none | — | Alternate (raw) |
| p27-3.jpg | 27 · Catering | unnamed: canapés on moss | 938×1171 · B | none | — | Alternate (raw) |
| p28-1.jpg | 28 · Catering | unnamed: buffet styling, crystal and gold service | 1408×794 · A | none | — | → **catering-1** |
| p29-1.jpg | 29 · Catering | unnamed: executive boardroom hospitality | 939×529 · B | none | — | → **catering-7** |
| p31-1.jpg | 31 · Heritage | unnamed: desert tent at night, carpets | 891×668 · B | none | — | → **heritage-5** |
| p31-2.jpg | 31 · Heritage | unnamed: heritage carts with brass dallahs, night | 1050×788 · B | distant | — | → **heritage-1** |
| p31-3.jpg | 31 · Heritage | unnamed: Arabic coffee service on a carpet | 688×516 · C | none | — | → **heritage-2** |
| p31-4.jpg | 31 · Heritage | unnamed: coffee service beside a fire | 688×516 · C | none | — | Alternate (raw) |
| p31-5.jpg | 31 · Heritage | unnamed: beach majlis with cushions | 688×516 · C | distant | — | → **heritage-3** |
| p32-1.jpg | 32 · Heritage | unnamed: heritage cart with brass vessels | 956×1275 · A | none | — | → **heritage-4** |
| p32-2.jpg | 32 · Heritage | unnamed: host in traditional dress at a live station | 956×1275 · A | yes | — | Pending rights |
| p32-3.jpg | 32 · Heritage | unnamed: coffee server in traditional dress with guests | 956×1275 · A | yes | — | Pending rights |
| p33-1.jpg | 33 · Sound & lighting | none: stage with purple beams | 736×978 · B | none | **render / stock** | **Never as work** |
| p33-2.jpg | 33 · Sound & lighting | none: LED par cans close-up | 736×1108 · B | none | likely stock | Never as work (confirm, OQ #21) |
| p33-3.jpg | 33 · Sound & lighting | none: DJ mixer close-up | 736×981 · B | none | likely stock | Never as work (confirm, OQ #21) |

## Curated set

`public/images/work/<slug>/<slug>-<n>.{avif,webp}`, native size, long edge capped at 1600 px, never upscaled. 32 images, 5.1 MB for both formats together (a browser downloads one).

| Slug | Images | Best size | Notes |
|---|---|---|---|
| `uae-pro-league` | 5 | 1280×882 | Tournament identity, Super Cup ceremony, two social posts, gift set |
| `uae-athletics-federation` | 3 | 1544×965 | Website desktop and mobile, sponsor backdrop. The Oregon 26 key visuals all show named athletes (pending rights) |
| `egyptair-pavilion` | 1 | 751×501 | Small: card use only until originals arrive |
| `sandoz` | 1 | 577×1280 | Portrait |
| `private-celebrations` | 8 | 1600×1066 | No client names (Task 11b rule 4) |
| `catering` | 7 | 1408×794 | Includes one food-styling photo from section 11 |
| `heritage` | 5 | 1050×788 | Majlis, tents, coffee service, carts |
| `gifts` | 2 | 1280×719 | Bookmark; EDI T-shirt mock-up |

No curated image is an AI image or a stock photo, so none needs the "Illustrative" label. If the page-14 AI deliverables are ever shown, they carry the profile's own "Produced with AI" line. They are real client work, not stand-ins for it.
