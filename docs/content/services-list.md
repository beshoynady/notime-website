# Services: approved list (30 services, 5 categories)

**Status:** approved on 7 November 2026 (DECISIONS D56). Rand delegated naming and content-structure decisions to the user, who approved [services-proposal.md](services-proposal.md) as written. The five profile services (catering, heritage hospitality, private celebrations, brand activations, fabrication) are folded into four renamed entries. The list stays at 30.

This file and `src/content/services.ts` must match: `src/content/content.test.ts` compares the slug and both titles of every row. Descriptions live in `services.ts`.

- **Slug:** the service's permanent id and its future standalone page address (D57). Keep it stable after launch.
- **Anchor:** the section id on its category page (`/[locale]/services/<category>#<anchor>`). It is the same in EN and AR. Anchors are added to the data in Phase 2 (`docs/plans/phase-2-services.md`).

## 1. Events & Hospitality · الفعاليات والضيافة (`events-hospitality`)

| # | Slug | Anchor | EN | AR |
|---|---|---|---|---|
| 1 | conferences-summits | conferences | Conferences & summits | المؤتمرات والقمم |
| 2 | exhibitions-booths | exhibitions | Exhibitions & booths | المعارض والأجنحة |
| 3 | product-launches-activations | launches | Product launches & brand activations | إطلاق المنتجات وتفعيل العلامات |
| 4 | galas-private-celebrations | celebrations | Galas & private celebrations | الحفلات والاحتفالات الخاصة |
| 5 | catering-heritage-hospitality | hospitality | Catering & heritage hospitality | الضيافة والمجالس التراثية |
| 6 | stage-technical-production | stage | Stage & technical production | الإنتاج الفني والتقني للمسرح |

## 2. Creative Production · الإنتاج الإبداعي (`creative-production`)

| # | Slug | Anchor | EN | AR |
|---|---|---|---|---|
| 7 | photography | photography | Photography | التصوير الفوتوغرافي |
| 8 | video-production | video | Video production | إنتاج الفيديو |
| 9 | motion-graphics | motion | Motion graphics | الموشن جرافيك |
| 10 | ai-content-creation | ai-content | AI content creation | صناعة المحتوى بالذكاء الاصطناعي |
| 11 | set-stage-design | set-design | Set & stage design | تصميم الديكور والمسرح |
| 12 | equipment-camera-rental | rental | Equipment & camera rental | تأجير المعدّات والكاميرات |

## 3. Marketing & Brand · التسويق والعلامة التجارية (`marketing-brand`)

| # | Slug | Anchor | EN | AR |
|---|---|---|---|---|
| 13 | branding-identity | branding | Branding & identity | الهوية التجارية |
| 14 | social-media-management | social | Social media management | إدارة وسائل التواصل الاجتماعي |
| 15 | digital-marketing-seo | digital-marketing | Digital marketing & SEO | التسويق الرقمي وSEO |
| 16 | content-strategy | content-strategy | Content strategy | استراتيجية المحتوى |
| 17 | public-relations | pr | Public relations | العلاقات العامة |
| 18 | paid-media-planning | paid-media | Paid media & media planning (Google & Meta ads) | الإعلانات المدفوعة وتخطيط الإعلام (Google وMeta) |

## 4. Production, Print & Gifts · الإنتاج والطباعة والهدايا (`production-print-gifts`)

| # | Slug | Anchor | EN | AR |
|---|---|---|---|---|
| 19 | commercial-large-format-printing | printing | Commercial & large-format printing | الطباعة التجارية وكبيرة الحجم |
| 20 | stand-fabrication-signage | fabrication | Stand fabrication & signage | تصنيع الأجنحة واللافتات |
| 21 | packaging-design | packaging | Packaging design | تصميم التغليف |
| 22 | corporate-gifts | gifts | Corporate gifts | هدايا الشركات |
| 23 | online-print-store | print-store | Online print store | متجر الطباعة الإلكتروني |
| 24 | branded-merchandise | merchandise | Branded merchandise | منتجات بهوية العلامة |

## 5. Software & Digital · البرمجيات والحلول الرقمية (`software-digital`)

| # | Slug | Anchor | EN | AR |
|---|---|---|---|---|
| 25 | websites | websites | Websites | المواقع الإلكترونية |
| 26 | mobile-apps | apps | Mobile apps | تطبيقات الجوّال |
| 27 | custom-systems | systems | Custom systems | أنظمة مخصّصة |
| 28 | e-commerce | e-commerce | E-commerce | المتاجر الإلكترونية |
| 29 | ui-ux-design | ux | UI/UX design | تصميم الواجهات وتجربة المستخدم |
| 30 | ai-consulting | ai-consulting | AI consulting | استشارات الذكاء الاصطناعي |
