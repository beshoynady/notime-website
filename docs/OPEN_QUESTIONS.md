# Open Questions

Items that need an answer from Rand or the user before the related work can be built. When one is answered, record the answer in `DECISIONS.md` and remove it from this list.

## Content & CMS
1. **Does Rand need to edit content herself?** The answer decides between TypeScript data files (current plan) and Sanity CMS.
2. **Full list of the 30 services:** to be pasted by the user into `docs/content/services-list.md`.
3. **Location of the brand assets:** the ~75 photos and the logo variants from the old landing project. Where are they?

## Forms
4. **Where should form submissions go:** email, WhatsApp, or both?

## Products
5. **Product names** for the QR event check-in system and the restaurant management system.

## Added during setup
6. **shadcn/ui component base:** `shadcn init --defaults` chose the `base-nova` style, built on **Base UI** (`@base-ui/react`) rather than Radix. Keep Base UI, or switch to Radix before any components are added? (Easy to change now; harder later.)
7. **shadcn RTL provider:** init ran with `--rtl`. shadcn's docs describe a direction provider for Next.js (https://ui.shadcn.com/docs/rtl/next). Wiring it is deferred to the i18n setup session.
8. **shadcn theme variables vs. brand palette:** init wrote neutral theme tokens (and default font variables) into `src/app/globals.css`. They must be remapped to the NO TIME palette and to Montserrat/Alexandria during the design phase. The stock create-next-app Geist font in `layout.tsx` is still in place.
9. **Next.js template defaults:** the Next 16.4 template turns on `cacheComponents` and `partialPrefetching` in `next.config.ts`. These affect how dynamic data and next-intl's request locale are handled. Confirm they should stay on when i18n is wired.
10. **npm audit:** `npm install` reports 12 vulnerabilities (4 low, 8 moderate) in transitive dependencies. Review them before launch. `npm audit fix --force` was **not** run, because it can introduce breaking changes.
