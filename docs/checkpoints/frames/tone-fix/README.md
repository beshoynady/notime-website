# The tone fix doesn't change the look (D115)

`node scripts/tone-shots.mjs <base> <dir>` on 54b7fa5 (before the fix: the stage tweened `--page-bg`) and eedb8e3 (the fix: it tweens its own `background-color`), production builds on the same machine. Every dark ↔ light turn of Home and About, EN and AR, 1440 and 390: one shot with the turn at 70% of the screen (the old ground still on) and one at 35% (the new ground on), each after the 0.9 s tween settles. 52 pairs.

Each sheet: old build (before turn, after turn) | the fix (before turn, after turn), one row per turn.

`node scripts/tone-shots.mjs --compare`: 44 of 52 pairs are pixel-identical; the other 8 differ only in the live clocks of "Six markets" (the two builds were shot three minutes apart: 18:09 → 18:12), 0.1–0.5% of the frame.
