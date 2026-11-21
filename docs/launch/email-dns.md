# Email DNS for notimehub.com (Resend)

For whoever manages the `notimehub.com` DNS. Decided in D89. Nothing here is bought or created by us; the records are added once Resend shows them for the domain.

## What sends what

| Mail | From | To | Service |
|---|---|---|---|
| Form submissions (quote, consultation, register interest) | `MAIL_FROM` (e.g. `website@notimehub.com`) | `CONTACT_TO_EMAIL` | Resend |
| Auto-reply to the visitor, in the page's language | `MAIL_FROM` | the visitor | Resend |
| The company's own mail | `info@notimehub.com` | anyone | the mailbox provider (Hostinger Email, if that's where the mailbox is) |

Until Resend shows the domain as **Verified**:

- `CONTACT_TO_EMAIL` stays on the developer's inbox.
- `MAIL_FROM` stays unset. The form pipeline (Task 4.2) sends from Resend's shared test sender, and the auto-reply is held back.

After verification, set `CONTACT_TO_EMAIL=info@notimehub.com` and `MAIL_FROM=website@notimehub.com` in hPanel, redeploy, and send one test submission in each language.

## 1. Add the domain in Resend

Resend dashboard → **Domains** → **Add domain** → `notimehub.com`. Keep the region Resend proposes (it shows in the MX value below). Resend then lists the exact records. **Copy the values from the dashboard, not from this file:** the DKIM key is unique to this domain, and the MX host depends on the region.

## 2. The Resend records

In hPanel → **Domains** → `notimehub.com` → **DNS / Nameservers** → **DNS records**. Enter the **Name** without the domain (`send`, not `send.notimehub.com`): Hostinger appends it, and a doubled name is the most common reason verification fails.

| Type | Name | Value | Priority | Purpose |
|---|---|---|---|---|
| MX | `send` | `feedback-smtp.<region>.amazonses.com` (e.g. `feedback-smtp.us-east-1.amazonses.com`) | 10 | Bounces and complaints come back to Resend |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | | SPF for the bounce subdomain |
| TXT | `resend._domainkey` | `p=MIGfMA0…` (the full key from the dashboard, case-sensitive, pasted in one piece) | | DKIM: signs mail as `notimehub.com` |

Then **Verify** in Resend. It usually takes minutes, and can take up to 72 hours. If it fails, check for a doubled name, a key pasted with a line break, or a provider that appended the domain to the MX value, then press **Restart verification**.

## 3. One SPF record per name, never two

The mailbox needs its own SPF on the **root** of the domain. With Hostinger Email, hPanel adds it:

```
@   TXT   v=spf1 include:_spf.mail.hostinger.com ~all
```

Resend's SPF sits on **`send`**, a different name, so the two don't clash. Keep it that way:

- **Never add a second `v=spf1` TXT record on `@`.** Two SPF records on the same name make SPF fail for both senders.
- If another service ever needs to send as `@notimehub.com` from the root, **merge** its `include:` into the one record. For example: `v=spf1 include:_spf.mail.hostinger.com include:other.example ~all`.
- Don't put `include:amazonses.com` on `@`. Resend's SPF belongs on `send` only.
- Leave the mailbox's own records alone (hPanel → **Emails** → **Domain settings** shows them): the root MX (`mx1`/`mx2.hostinger.com`) and the three DKIM CNAMEs `hostingermail-a/b/c._domainkey`. If the mailbox is with another provider, the same rule applies to its SPF.

## 4. DMARC: start with `p=none`

One record, only if `_dmarc` doesn't already exist (hPanel may have added one; if it has, edit it rather than adding a second):

```
_dmarc   TXT   v=DMARC1; p=none; rua=mailto:info@notimehub.com
```

- `p=none` only monitors: nothing is rejected while we check that both senders pass.
- `rua` sends daily aggregate reports to that inbox. Leave it out if they're unwanted.
- Both senders align. Resend signs with DKIM as `notimehub.com`, and its bounce domain `send.notimehub.com` sits under the same domain. Hostinger signs the mailbox with its own DKIM.
- After a few weeks of clean reports, consider `p=quarantine`. That is a separate decision, logged when it's made.

## 5. Check

- Resend shows **Verified** for DKIM, SPF and MX.
- Send a test from the site to an outside inbox (e.g. Gmail). Under **Show original**, SPF, DKIM and DMARC all read **PASS**.
- Send a normal email from `info@notimehub.com`. It still passes too, which proves the root SPF wasn't broken.
