# Deploying to Hostinger (Node.js web app)

Decided in D89 and D90. Hostinger documents this in [docs.hostinger.com](https://docs.hostinger.com) (Node.js web apps; pages last updated Oct–Nov 2026). Re-check the labels against hPanel on the day, since screens move. **Nothing here is bought or created by us.** The company owns the plan, the account and the domains, and adds us with access to manage the site.

## 0. Before the first deploy

- **Plan:** a Hostinger plan that runs **Node.js web apps**: Business Web Hosting, or Cloud Startup, Professional, Enterprise or Enterprise Plus. Not a VPS (that is the fallback, §8). Plain web hosting with static files only won't run this site: forms, locale routing (the proxy) and image optimisation run on the server.
- **Branch:** deploy from **`main` only**, after the phase PR (`phase-2-services` → `main`) is merged. Never deploy a phase branch. The local `pre-push` guard keeps `main` PR-only (D74).
- **Node:** **22**. Hostinger offers 18, 20, 22 (the default) and 24. Next 16 needs at least 20.9. The repo pins it: `package.json` `"engines": { "node": ">=22 <23" }` and `.nvmrc` = `22`; CI reads `.nvmrc`.
- **Green CI:** the full CI run on `main` (lint, typecheck, unit tests, build, the leak scan, e2e) is green.
- **Email:** Resend verified for `notimehub.com` ([email-dns.md](email-dns.md)), or the inbox stays on the developer's until it is.

## 1. Create the app and connect GitHub

1. hPanel → **Websites** → **Add website** → **Node.js web app** (wording may differ) → attach `notimehub.com`.
2. **Import from GitHub:** install Hostinger's GitHub App on the repository only (it's private and stays private, D74). Pick branch **`main`** and turn on automatic deploys for it.
3. Build settings. Hostinger detects Next.js; confirm:

| Setting | Value |
|---|---|
| Framework / app type | Next.js |
| Node version | 22 |
| Install | `npm ci` (or Hostinger's default, `npm install`) |
| Build command | `npm run build` (script `build` → `next build`) |
| Output directory | `.next` |
| Start | Hostinger's own (it ignores the entry file for Next.js) |

Hostinger turns on `output: "standalone"` by wrapping `next.config`. That works because ours exports a plain object (`next.config.ts`). **Keep it an object:** a function config isn't merged, and the deploy breaks.

## 2. Environment variables

hPanel → the app → **Environment variables**. Hostinger injects them at build and at runtime, and saving them redeploys. **Every `NEXT_PUBLIC_*` value is baked in at build time**, so set it before the build that should carry it. Values are typed by the owner or pasted from the providers' dashboards. They are never sent in chat or committed (only `.env.example` lives in the repo).

| Variable | Value at launch | Notes |
|---|---|---|
| `RESEND_API_KEY` | Resend → API Keys, a key limited to sending | Secret |
| `CONTACT_TO_EMAIL` | developer's inbox → `info@notimehub.com` once Resend verifies | [email-dns.md](email-dns.md) |
| `MAIL_FROM` | `website@notimehub.com` (after verification) | Sender of the notifications and the auto-reply |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | the **real** site key (Cloudflare → Turnstile, widget for `notimehub.com`) | Build time. Task 4.2 adds a guard that **fails a production build** when a Turnstile key is missing, so Cloudflare's test keys can't ship |
| `TURNSTILE_SECRET_KEY` | the matching real secret | Secret, runtime |
| `NEXT_PUBLIC_SITE_URL` | leave **empty** | Empty = `https://notimehub.com` in production (`src/config/site.ts`): canonical, sitemap, OG, hreflang |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | the business number, digits only, when the client gives it | Build time. Empty = WhatsApp hidden (fill-or-hide, D78) |
| `NEXT_PUBLIC_REVIEW_MODE` | **unset** | Review builds only (the tunnel). The leak scan fails if review code ships |
| `NEXT_PUBLIC_ENABLE_LAB` | **unset** | The lab routes 404 in production |
| `REPLICATE_API_TOKEN` | **never set here** | Local image scripts only |

## 3. Custom domain and SSL

1. hPanel → the app → **Domains**: `notimehub.com` is the primary domain. Add `www.notimehub.com` too.
2. DNS (hPanel → Domains → `notimehub.com` → DNS records), if the domain isn't already on Hostinger's nameservers: the apex `A`/`AAAA` and `www` `CNAME` exactly as hPanel lists them for the app.
3. **SSL:** hPanel → **Security** → **SSL** → install the free certificate for both `notimehub.com` and `www.notimehub.com`. Turn on **Force HTTPS** if offered for the app.
4. **`www` → apex (D90):** the apex is canonical. If hPanel offers a "www redirect" for the app, set it to the non-www version. Behind it, the app redirects too: `next.config.ts` sends any request on `www.notimehub.com` to `https://notimehub.com/<same path and query>` with a 308 (permanent; search engines treat it like a 301).

## 4. The old domain: notime-hub.com → notimehub.com (D90)

The previous landing site's domain must send **every** path to the same path on the new domain, with a permanent redirect. Old links and search rankings follow. **Keep notime-hub.com renewed** (CONTENT_CHECKLIST).

**Preferred: a website on the same plan with one `.htaccess` rule.** Hostinger's Apache/LiteSpeed reads it, and it keeps the path and query:

1. hPanel → **Websites** → **Add website** → **Empty PHP/HTML website** → domain `notime-hub.com` (replaces the old landing site).
2. File Manager → `public_html/.htaccess`, the whole file:

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(www\.)?notime-hub\.com$ [NC]
RewriteRule ^(.*)$ https://notimehub.com/$1 [R=301,L]
```

3. SSL for `notime-hub.com` and `www.notime-hub.com` (§3, step 3), so `https://` links on the old domain redirect without a certificate warning.
4. Check that hPanel's own redirect tools don't rewrite this file later. If anyone uses hPanel → **Redirects** for this domain, re-check the file afterwards.

**Not preferred:** hPanel **Domains → Forward domain** (for a domain without hosting). It has no path option, so every old link would land on the homepage. Use it only if a test shows it keeps paths.

**Fallback: Cloudflare,** if the old domain's DNS is on Cloudflare. Rules → Redirect Rules → hostname is `notime-hub.com` or `www.notime-hub.com` → dynamic redirect to `concat("https://notimehub.com", http.request.uri.path)`, status 301, **preserve query string** on.

**Check:**

```sh
curl -sI https://notime-hub.com/some/old/path?x=1        # 301, Location: https://notimehub.com/some/old/path?x=1
curl -sI http://www.notime-hub.com/                      # 301, Location: https://notimehub.com/
curl -sI https://www.notimehub.com/en/services           # 308, Location: https://notimehub.com/en/services
```

No code or content in the repo points to the old domain. `src/lib/old-domain.test.ts` fails if any file other than this guide and the decision records mentions it.

## 5. Post-deploy smoke checklist

On `https://notimehub.com`, in a private window, at desktop and phone width:

- [ ] `/` redirects to `/en` (or `/ar` for an Arabic browser). `/en` and `/ar` load. The Arabic page is `dir="rtl"` in Alexandria, and the language toggle keeps the page.
- [ ] Each category page in both locales: `/en/services/<slug>` and `/ar/services/<slug>`.
- [ ] Anchors: open `/en/services/<slug>#<section>` directly. It lands on the heading without jumping. The header menu links land too.
- [ ] Images load (AVIF/WebP from `/_next/image`), and the fonts load. Under `standalone`, `public/` and `.next/static` must be copied next to the server; Hostinger does this, and a missing image or font here means it didn't.
- [ ] A missing page shows the branded 404 in both locales (`/en/nope`, `/ar/nope`) with status 404.
- [ ] Forms (after Task 4.2): one submission per form in each language. It arrives at `CONTACT_TO_EMAIL`, the auto-reply arrives in the page's language, and Turnstile shows the real widget (not the test badge).
- [ ] `https://notimehub.com/sitemap.xml` and `/robots.txt` use `https://notimehub.com` URLs only. The page source shows the canonical and hreflang on the apex. The legal pages stay `noindex` until the owner's final read (`legal.reviewed`).
- [ ] The redirects in §3 and §4 answer as in the `curl` checks.
- [ ] No review UI (no review bar, no lab routes: `/en/lab/…` is 404).
- [ ] Cloudflare Web Analytics (at launch, D88/D89): the beacon loads and the dashboard counts the visit, and no cookie is set. Then set `legal.analytics` so the privacy and cookie pages say so.

## 6. Redeploys and rollback

- A merge to `main` deploys automatically. Changing an environment variable redeploys too.
- Rollback: hPanel → the app → **Deployments** → redeploy the previous build if offered. Otherwise revert on `main` with a PR, which redeploys.

## 7. Limits and how we handle them

| Limit | Effect | What we do |
|---|---|---|
| The app **idles** after a quiet period | The first visit after a pause is slower (cold start) | Accept for now. Pages stay static-first, so only the server start is slow. If it hurts, an uptime ping on `/en` every few minutes keeps it awake |
| ISR / data-cache persistence across restarts is undocumented | Revalidated pages may rebuild after a restart | Acceptable: the content is in the repo and changes only by deploy |
| `next.config` must stay an object | A function config isn't merged with Hostinger's `standalone` | Keep `next.config.ts` an object (it is) |
| Hostinger may regenerate `.htaccess` for the Node app's domain | Hand edits on `notimehub.com` could be lost | No `.htaccess` edits on the app's domain. Redirects live in `next.config.ts` and on the old domain's own site (§4) |
| Custom domain, SSL and redirects aren't in the Node.js docs | Screens may differ from §3 and §4 | Follow hPanel, then prove it with the §4 `curl` checks |
| `public/` and `.next/static` copying under `standalone` | Missing images or fonts if they weren't copied | Covered by the smoke checklist |

## 8. Fallback: Hostinger VPS

If the plan can't run the app (or a limit above turns out to block it), the fallback is a Hostinger VPS:

- Node 22 with a process manager (e.g. `pm2 start npm -- start`) behind Nginx;
- Let's Encrypt for SSL;
- the same env vars in the server's environment;
- a deploy step of `git pull && npm ci && npm run build` then a restart;
- the redirects in Nginx (`return 301 https://notimehub.com$request_uri;` for `www` and the old domain).

It means more upkeep on our side, and it's a decision for the owner (it may cost money): we stop and ask before choosing it.

## 9. Until then

Review stays on the temporary tunnel from the developer's machine ([../review/tunnel.md](../review/tunnel.md), [../review/rand-guide-ar.md](../review/rand-guide-ar.md)). Nothing is deployed to Hostinger before the phase PR is merged.
