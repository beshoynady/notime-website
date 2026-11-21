/**
 * /[locale]/links as plain HTML (decision #36: 90+ on phones). The link-in-bio page is one
 * column of links, so it ships no framework: no React runtime, no hydration, no smooth scroll or
 * scroll animation. The route handler (app/[locale]/links/route.ts) gathers the localized data;
 * this builds the document. Every text and attribute is escaped here.
 */

export type LinksRow = { href: string; title: string; note: string; primary?: boolean; external?: boolean; icon?: "whatsapp" };

export interface LinksPageData {
  locale: "en" | "ar";
  dir: "ltr" | "rtl";
  title: string;
  description: string;
  alternates: Record<"en" | "ar", string>;
  fontPreloads: readonly string[];
  /** The @font-face rules for this locale's faces (src/app/fonts.css). */
  fontFaces: string;
  logo: { src: string; alt: string; homeHref: string; homeLabel: string };
  lang: { href: string; locale: string; label: string; name: string };
  eyebrow: string;
  heading: string;
  lead: string;
  listLabel: string;
  rows: readonly LinksRow[];
  email: { label: string; address: string } | null;
  legal: { label: string; links: readonly { href: string; label: string }[] };
  /** The visit's lead source, serialized (src/lib/lead-source.ts), and whether it carries tags. */
  leadSource: { json: string; tagged: boolean } | null;
  /** The review build's banner text, or null. */
  review: string | null;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const ICON =
  'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
const ARROW = `<svg class="lk-arrow" ${ICON} stroke-width="1.25"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const WHATSAPP = `<svg class="lk-icon" ${ICON} stroke-width="1.5"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;

// Same tokens and rhythm as the site (globals.css), logical properties only.
const CSS = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;color-scheme:dark}
body{margin:0;background:#2e2017;color:#f5e9d3;font-family:"Montserrat","Montserrat Fallback","Montserrat Fallback Android",system-ui,sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased}
html[lang="ar"] body{font-family:"Alexandria","Alexandria Fallback","Alexandria Fallback Android",system-ui,sans-serif}
a{color:inherit}
:focus-visible{outline:2px solid #ead4ab;outline-offset:3px}
.lk{min-block-size:100svh;padding-block:20px 40px;padding-inline:max(20px,env(safe-area-inset-left)) max(20px,env(safe-area-inset-right))}
.lk-col{display:grid;gap:32px;max-inline-size:520px;margin-inline:auto}
.lk-bar{display:flex;align-items:center;justify-content:space-between;min-block-size:48px}
.lk-bar img{display:block;inline-size:128px;block-size:auto}
.lk-lang{display:grid;place-items:center;min-inline-size:44px;min-block-size:44px;border:1px solid rgba(234,212,171,.16);border-radius:4px;font-size:.9rem;text-decoration:none}
.lk-lang:hover{border-color:#bb9a79}
.lk-head{display:grid;gap:12px}
.lk-eyebrow{margin:0;font-size:.75rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#ead4ab}
html[lang="ar"] .lk-eyebrow{letter-spacing:0;font-size:.85rem}
.lk-title{margin:0;font-size:clamp(2.2rem,9vw,3.4rem);font-weight:200;line-height:1.05;letter-spacing:-.02em}
html[lang="ar"] .lk-title{font-weight:300;line-height:1.4;letter-spacing:0}
.lk-lead{margin:0;line-height:1.6;color:rgba(245,233,211,.78)}
.lk-list{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.lk-row{display:flex;align-items:center;gap:14px;min-block-size:68px;padding:14px 18px;border:1px solid rgba(234,212,171,.16);border-radius:4px;color:#f5e9d3;text-decoration:none;transition:background-color .3s ease,border-color .3s ease}
.lk-row:hover,.lk-row:focus-visible{border-color:#bb9a79;background:rgba(234,212,171,.06)}
.lk-row[data-primary]{border-color:#ead4ab;background:#ead4ab;color:#2e2017}
.lk-row[data-primary]:hover,.lk-row[data-primary]:focus-visible{background:#f5e9d3}
.lk-text{display:grid;gap:2px;flex:1 1 auto;min-inline-size:0}
.lk-row-title{font-size:1.05rem;font-weight:500}
.lk-row-note{font-size:.85rem;opacity:.72}
.lk-icon,.lk-arrow{inline-size:20px;block-size:20px;flex-shrink:0}
.lk-arrow{transition:transform .4s cubic-bezier(.16,1,.3,1)}
[dir="rtl"] .lk-arrow{transform:scaleX(-1)}
.lk-row:hover .lk-arrow{transform:translateX(4px)}
[dir="rtl"] .lk-row:hover .lk-arrow{transform:translateX(-4px) scaleX(-1)}
.lk-email{margin:0;font-size:.9rem;color:rgba(245,233,211,.72)}
.lk-email a{color:#ead4ab;text-underline-offset:4px}
.lk-legal{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:.8rem}
.lk-legal a{color:rgba(245,233,211,.72)}
.review-banner{position:fixed;inset-inline:0;inset-block-end:0;z-index:60;padding:6px 12px;background:#ead4ab;color:#2e2017;font-size:12px;font-weight:600;text-align:center}
@media (prefers-reduced-motion:reduce){.lk-row,.lk-arrow{transition:none}}
`;

function row(r: LinksRow): string {
  const attrs = `href="${esc(r.href)}" class="lk-row"${r.primary ? " data-primary" : ""}${r.external ? ' target="_blank" rel="noopener noreferrer"' : ""}`;
  const icon = r.icon === "whatsapp" ? WHATSAPP : "";
  return `<li><a ${attrs}>${icon}<span class="lk-text"><span class="lk-row-title">${esc(r.title)}</span><span class="lk-row-note">${esc(r.note)}</span></span>${ARROW}</a></li>`;
}

/**
 * The lead source, stored as on every other page (LeadSourceCapture): the first touch of the
 * session, replaced by a tagged visit. `<` is escaped so a value can't close the script.
 */
function leadScript(lead: NonNullable<LinksPageData["leadSource"]>): string {
  const value = JSON.stringify(lead.json).replace(/</g, "\\u003c");
  return `<script>try{var s=sessionStorage,k="nt-lead";if(!s.getItem(k)||${lead.tagged ? "true" : "false"})s.setItem(k,${value})}catch(e){}</script>`;
}

export function renderLinksPage(d: LinksPageData): string {
  const alt = (["en", "ar"] as const).map((l) => `<link rel="alternate" hreflang="${l}" href="${esc(d.alternates[l])}">`).join("");
  const preloads = d.fontPreloads.map((href) => `<link rel="preload" href="${esc(href)}" as="font" type="font/woff2" crossorigin>`).join("");
  const email = d.email
    ? `<p class="lk-email">${esc(d.email.label)} <a href="mailto:${esc(d.email.address)}" dir="ltr">${esc(d.email.address)}</a></p>`
    : "";
  const legal = d.legal.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join("");
  return `<!doctype html>
<html lang="${d.locale}" dir="${d.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(d.title)}</title>
<meta name="description" content="${esc(d.description)}">
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="#2e2017">
<link rel="canonical" href="${esc(d.alternates[d.locale])}">${alt}
<link rel="icon" href="/favicon.ico" sizes="any">${preloads}
<style>${d.fontFaces}${CSS}</style>
${d.leadSource ? leadScript(d.leadSource) : ""}
</head>
<body>
<main id="main" class="lk">
<div class="lk-col">
<div class="lk-bar"><a href="${esc(d.logo.homeHref)}" aria-label="${esc(d.logo.homeLabel)}"><img src="${esc(d.logo.src)}" alt="${esc(d.logo.alt)}" width="150" height="40"></a><a href="${esc(d.lang.href)}" hreflang="${esc(d.lang.locale)}" lang="${esc(d.lang.locale)}" class="lk-lang" aria-label="${esc(d.lang.name)}">${esc(d.lang.label)}</a></div>
<header class="lk-head"><p class="lk-eyebrow">${esc(d.eyebrow)}</p><h1 id="lk-title" class="lk-title">${esc(d.heading)}</h1><p class="lk-lead">${esc(d.lead)}</p></header>
<nav aria-label="${esc(d.listLabel)}"><ul class="lk-list">${d.rows.map(row).join("")}</ul></nav>
${email}
<nav aria-label="${esc(d.legal.label)}" class="lk-legal">${legal}</nav>
</div>
</main>
${d.review ? `<div class="review-banner" role="note">${esc(d.review)}</div>` : ""}
</body>
</html>
`;
}
