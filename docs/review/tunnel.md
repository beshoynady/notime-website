# Review link: Cloudflare quick tunnel

Rand reviews the **review build** (`NEXT_PUBLIC_REVIEW_MODE=1`) through a free Cloudflare quick tunnel from this machine. It needs no Cloudflare account and no credentials, so there is nothing to commit or keep secret.

**The link works only while this machine, the review server and the tunnel are all running.** Each new tunnel gets a new random `*.trycloudflare.com` address, so send Rand the new link after every restart.

## What the review build adds

- The banner "Review version – not public" / «نسخة مراجعة – غير منشورة».
- The section numbers (H-04, EV-05 …) and the badged example blocks.
- `X-Robots-Tag: noindex, nofollow` on every response, and `robots.txt` disallows everything, so search engines don't index the link.
- It is built into `.next-review`, so the production build in `.next` stays untouched.

## Steps

1. **Install cloudflared (once, user scope):**
   ```powershell
   winget install --id Cloudflare.cloudflared --scope user
   ```
   Check it: `cloudflared --version`. (Without winget: download `cloudflared-windows-amd64.exe` from the Cloudflare GitHub releases into `%USERPROFILE%\bin\cloudflared.exe` and add that folder to the user PATH.)
2. **Build the review version** (after each change Rand should see):
   ```powershell
   npm run review:build
   ```
3. **Start the review server on port 3100:**
   ```powershell
   npm run review:start -- 3100
   ```
   Open http://localhost:3100/ar and check that the banner shows.
4. **Start the tunnel** in a second terminal:
   ```powershell
   cloudflared tunnel --url http://localhost:3100
   ```
5. **Copy the link:** cloudflared prints a line like `https://<random-words>.trycloudflare.com`. Send Rand that address with `/ar` at the end, together with [rand-guide-ar.md](rand-guide-ar.md).
6. **Stop:** `Ctrl+C` in both terminals. The link stops working at once.

## Notes

- Run nothing heavy (a second Next server, e2e, Lighthouse) while Rand is reviewing: the review server shares this machine's memory.
- Quick tunnels are for testing: no uptime guarantee, and a limit on concurrent requests. That's fine for one reviewer. The launch goes to Vercel on NO TIME's own account ([hosting-note-ar.md](hosting-note-ar.md)); nothing is deployed to Vercel until that account exists.
- The production build never contains review content (`npm run check:no-review-leak` in CI).
