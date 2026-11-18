# Launch checklist: the forms (N03)

For the owner, at launch. It needs the real Turnstile keys, the verified Resend domain and the deployed site, so it isn't part of the audit fixes' "done" (spec `docs/superpowers/specs/2026-11-17-audit-fixes-design.md`, N03). Deploy steps: `hostinger-deploy.md`. Email DNS: `email-dns.md`. Log each result in the tables below, with the date.

## 1. Turnstile keys

Cloudflare dashboard → **Turnstile** → add a widget. Its hostnames:

- [ ] `notimehub.com`
- [ ] `www.notimehub.com`

Then set the two keys. Locally they go in `.env.local`; on the host, in the app's environment variables (hPanel → the app → **Environment variables**). They're never sent in chat or committed.

| Variable | Where it's read | Note |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | in the browser; inlined **at build time** | Set it before the build that should carry it. A key added later only works after a rebuild (on Hostinger, saving a variable redeploys). |
| `TURNSTILE_SECRET_KEY` | on the server, at runtime | Secret. It must be the pair of the site key above. |

- [ ] Both are set on the host, and the site was rebuilt after the site key was added.
- [ ] On a live form, the widget is the real one, not Cloudflare's test badge.

Without real keys a production build still builds, but it shows no widget and refuses every submission with the email fallback (fail closed, D102). A missing key therefore looks like "every form fails", not like a failed build.

## 2. Resend, before the real-send test

Steps in `email-dns.md`; the variables in `hostinger-deploy.md` §2.

- [ ] Resend shows `notimehub.com` as **Verified** (DKIM, SPF and MX).
- [ ] `MAIL_FROM=website@notimehub.com`, on the verified domain. Until it's set there, the auto-reply is held back, so the test below can't pass.
- [ ] `CONTACT_TO_EMAIL=info@notimehub.com` and `RESEND_API_KEY` are set.
- [ ] `MAIL_SINK` is **not** set on the host (it's for tests only).

## 3. Real-send test

On the production domain, `https://notimehub.com`, after sections 1 and 2. Open each form in a fresh private window from a tagged link (for example `?utm_source=launch-test`), so the lead-source rows carry a value.

The four forms:

| # | Form | Where |
|---|---|---|
| F1 | Contact brief, with a `?service=` preset | `/en/contact?service=conferences`, `/ar/contact?service=conferences` |
| F2 | Software consultation (intro call) | `/en/services/software-digital#consult`, and `/ar/…` |
| F3 | Free website review | `/en/services/software-digital#website-review`, and `/ar/…` |
| F4 | Product interest | `/en/products/qr-check-in`, and `/ar/…` |

**Pass**, for every send: (1) the team email arrives at `CONTACT_TO_EMAIL` with the lead-source rows; (2) the auto-reply arrives in the page's language; (3) the success state shows on the page.

Four forms × EN/AR × four browsers = 32 sends. Mark each cell ✓, or ✗ with a note.

| Form | Locale | iPhone Safari | Android Chrome | Desktop Chrome | Desktop Safari |
|---|---|---|---|---|---|
| F1 Contact | EN | | | | |
| F1 Contact | AR | | | | |
| F2 Consultation | EN | | | | |
| F2 Consultation | AR | | | | |
| F3 Website review | EN | | | | |
| F3 Website review | AR | | | | |
| F4 Product interest | EN | | | | |
| F4 Product interest | AR | | | | |

## 4. The blocked-Turnstile fallback

One failure case. On desktop Chrome, block `challenges.cloudflare.com` (DevTools → **Network** → right-click a request → **Block request domain**, or the **Network request blocking** panel), reload the page, fill a form and send it.

**Pass:** the form doesn't send and doesn't fail silently. The notice shows with the email address as a link: "We couldn't confirm the request came from a person. Try again, or email us at info@notimehub.com." (in Arabic: «لم نتمكّن من التأكد من أن الطلب مُرسَل من شخص…»).

| Date | Browser | Form | Locale | Result |
|---|---|---|---|---|
| | Desktop Chrome | | | |

## 5. After the test

- [ ] Tell the team which emails in the inbox were tests.
- [ ] Log the results here, then mark launch blocker #4 (the Turnstile keys, D102) as done in `docs/review/launch-blockers-ar.md`.
