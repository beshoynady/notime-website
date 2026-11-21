# Privacy Policy: draft (EN + AR)

**Live text:** the site renders this policy from `src/content/legal.ts`; this file is the review draft. Change both together.

Status: **draft, not legal advice.** Written with the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021, "PDPL") in mind; **no lawyer for now: the owner gives the pages a final read before launch** (D89, CONTENT_CHECKLIST #24). The notes for a reviewer stay in this file, never on the public page. Facts checked against the site on 2026-11-09, host updated 2026-11-10 (D89): the processors in use, no analytics yet, no database for form submissions, one cookie (`NEXT_LOCALE`).

**Config values** (`src/config/legal.ts`): `legalName`, `address`, `dataRequestContact`. A line that needs one of them is **hidden** until it's set (D78). In the text: `{{legalName}}`, `{{address}}`, `{{dataRequestContact}}`.

**Open for the owner's final read (and a lawyer, if one is engaged later):**
1. **Retention:** 12 months after the last contact for an enquiry that doesn't become a project (the default, D89); agreement records as long as the law requires.
2. **Lawful basis:** the PDPL's grounds are narrower than the GDPR's; the reviewer confirms the wording in §4.
3. **Cross-border transfers (§6):** the reviewer confirms the wording against the PDPL's transfer rules and the providers' terms.
4. **Analytics:** none today. At launch, Cloudflare Web Analytics only: cookieless, no consent banner (D88, D89). The page text switches when `legal.analytics` is set.

---

## English

**Privacy Policy**
Last updated: {{date of publication}}

### 1. Who we are
This website is run by NO TIME Creative House{{, legalName}}, based in Dubai, United Arab Emirates{{, address}}. In this policy, "we" and "us" mean NO TIME. For any question about your personal data, contact us at {{dataRequestContact}}.

### 2. What this policy covers
This policy explains what personal data we collect through this website, why, who processes it for us, how long we keep it, and the rights you have. It doesn't cover other websites we link to.

### 3. What we collect
**What you send us.** When you use a form on this site (a consultation request, a quote request, or registering interest in a product), we receive what you enter: your name, your email address and/or WhatsApp number, your company if you give it, the service or product you're asking about, a budget range if you choose one, your message, and the details the form asks for (for example an event date, a city, a guest count, items and quantities, or rental dates).

**Technical data.** Like any website, our hosting provider processes your IP address and basic browser information to deliver pages and keep the site secure. When you submit a form, Cloudflare Turnstile checks that the request comes from a person and not an automated program, and we use your IP address for a short time to limit repeated submissions.

**Your language choice.** One cookie remembers whether you're reading in English or Arabic. See the [Cookie Policy](/cookies).

**What we don't do.** We don't use analytics or advertising trackers, and we don't sell or rent your data. If we ever add analytics, we'll update this policy first.

> **At launch (D88):** analytics is cookieless only (Cloudflare Web Analytics, D89), no GA4, no consent banner. When `legal.analytics` is set, the line above becomes "What we don't do. We don't use advertising trackers, and we don't sell or rent your data.", the processor list gains "{analytics} counts visits in totals, without cookies.", and this paragraph is added:
>
> **Visit statistics.** We count visits with {analytics}, a service that uses no cookies. It records totals such as pages viewed, the site a visit came from, the country and the type of device, without building a profile of you or following you to other sites, so we don't ask for consent. *(Note for a reviewer, not on the page: cookieless analytics is treated as needing no consent; confirm if a lawyer is engaged.)*

### 4. Why we use it
- **To answer your request:** to reply, to understand what you need, and to prepare a proposal. We use your data because you asked us to, as a step before a possible agreement with you.
- **To keep the site and its forms safe:** to block spam and abuse.

We don't use your data for marketing, and we don't make decisions about you by automated means alone.

### 5. Who processes it for us
We use a small number of service providers, who process data only to provide their service to us:
- **Hostinger** hosts the website.
- **Cloudflare** (Turnstile) checks form submissions for automated abuse.
- **Resend** delivers form submissions to our inbox and, where it applies, a confirmation to you.

We may also disclose data where the law requires it.

### 6. Data outside the UAE
These providers may process data outside the United Arab Emirates, including in the United States. We rely on their contractual and technical safeguards for personal data, and we use only what each service needs.

### 7. How long we keep it
We don't keep a database of form submissions on this website: a submission reaches us as an email. If an enquiry doesn't become a project, we delete it within **12 months of our last contact with you**. If it does, we keep the records of our agreement for as long as the applicable law requires.

### 8. Your rights
Under the PDPL you can ask us to:
- tell you what personal data we hold about you and give you a copy;
- correct data that is inaccurate or incomplete;
- delete your data, or restrict how we use it;
- stop using your data, where the law allows you to object;
- withdraw your consent, where we rely on it.

To make a request, contact {{dataRequestContact}}. We may ask you to confirm your identity first. If you're not satisfied with our answer, you can complain to the UAE Data Office.

### 9. Security
We protect your data with reasonable technical and organisational measures: encrypted connections (HTTPS), limited access, and providers that secure the data they process. No method of transmission over the internet is completely secure.

### 10. Children
This website is meant for businesses and adults. We don't knowingly collect data from anyone under 18.

### 11. Changes
We may update this policy. The date at the top shows the latest version.

---

## العربية

**سياسة الخصوصية**
آخر تحديث: {{تاريخ النشر}}

### 1. من نحن
يدير هذا الموقع نو تايم كرييتيف هاوس{{، legalName}}، ومقرّه دبي، الإمارات العربية المتحدة{{، address}}. ويُقصد بكلمة «نحن» في هذه السياسة شركة NO TIME. لأي سؤال عن بياناتك الشخصية، تواصل معنا عبر {{dataRequestContact}}.

### 2. نطاق هذه السياسة
توضّح هذه السياسة البيانات الشخصية التي نجمعها عبر هذا الموقع، وسبب جمعها، ومن يعالجها نيابةً عنّا، ومدة احتفاظنا بها، والحقوق التي تملكها. ولا تشمل المواقع الأخرى التي نضع روابطها.

### 3. البيانات التي نجمعها
**ما ترسله إلينا.** عند استخدامك أحد نماذج الموقع (طلب استشارة، أو طلب عرض سعر، أو تسجيل اهتمامك بأحد منتجاتنا)، يصلنا ما تكتبه: اسمك، وبريدك الإلكتروني و/أو رقم واتساب، واسم شركتك إن ذكرته، والخدمة أو المنتج الذي تسأل عنه، ونطاق الميزانية إن اخترته، ورسالتك، والتفاصيل التي يطلبها النموذج (مثل موعد المناسبة، أو المدينة، أو عدد الضيوف، أو المنتجات والكميات، أو مواعيد الاستئجار).

**البيانات التقنية.** كأي موقع إلكتروني، يعالج مزوّد الاستضافة عنوان IP الخاص بك ومعلومات أساسية عن متصفحك، لعرض الصفحات والحفاظ على أمن الموقع. وعند إرسال أي نموذج، تتحقّق خدمة Cloudflare Turnstile من أن الطلب صادر عن شخص لا عن برنامج آلي، ونستخدم عنوان IP لفترة قصيرة للحدّ من تكرار الإرسال.

**اختيار اللغة.** ملف تعريف ارتباط واحد يتذكّر هل تتصفّح بالعربية أم بالإنجليزية. راجع [سياسة ملفات تعريف الارتباط](/cookies).

**ما لا نفعله.** لا نستخدم أدوات تحليل أو تتبّع إعلاني، ولا نبيع بياناتك ولا نؤجّرها. وإذا أضفنا أدوات تحليل يومًا ما، فسنحدّث هذه السياسة أولًا، ونطلب موافقتك قبل بدء أي تتبّع.

### 4. لماذا نستخدم بياناتك
- **للردّ على طلبك:** لنتواصل معك، ونفهم ما تحتاجه، ونعدّ لك عرضًا. نستخدم بياناتك لأنك طلبت منّا ذلك، تمهيدًا لاتفاق محتمل بيننا.
- **لحماية الموقع ونماذجه:** لمنع الرسائل المزعجة وإساءة الاستخدام.

لا نستخدم بياناتك لأغراض تسويقية، ولا نتّخذ بشأنك قرارات تعتمد على المعالجة الآلية وحدها.

### 5. من يعالج بياناتك نيابةً عنّا
نستعين بعدد محدود من مزوّدي الخدمات، ولا يعالج أيٌّ منهم البيانات إلا لتقديم خدمته لنا:
- **Hostinger** لاستضافة الموقع.
- **Cloudflare** (خدمة Turnstile) لفحص النماذج المُرسلة والتصدّي لإساءة الاستخدام الآلية.
- **Resend** لإيصال النماذج المُرسلة إلى بريدنا، وإرسال رسالة تأكيد إليك حين ينطبق ذلك.

وقد نُفصح عن البيانات حين يُلزمنا القانون بذلك.

### 6. معالجة البيانات خارج الإمارات
قد يعالج هؤلاء المزوّدون البيانات خارج دولة الإمارات العربية المتحدة، ومن ذلك الولايات المتحدة. ونعتمد على ضماناتهم التعاقدية والتقنية لحماية البيانات الشخصية، ولا نستخدم إلا ما تحتاجه كل خدمة.

### 7. مدة الاحتفاظ بالبيانات
لا نحتفظ في هذا الموقع بقاعدة بيانات للنماذج المُرسلة، فكل نموذج يصلنا رسالةً بالبريد الإلكتروني. وإذا لم يتحوّل الاستفسار إلى مشروع، نحذفه خلال **12 شهرًا من آخر تواصل بيننا**. وإذا تحوّل إلى مشروع، نحتفظ بسجلات الاتفاق للمدة التي يفرضها القانون المعمول به.

### 8. حقوقك
بموجب قانون حماية البيانات الشخصية، يحقّ لك أن تطلب منّا:
- إطلاعك على البيانات الشخصية التي نحتفظ بها عنك وتزويدك بنسخة منها؛
- تصحيح البيانات غير الدقيقة أو غير المكتملة؛
- حذف بياناتك، أو تقييد استخدامنا لها؛
- التوقّف عن استخدام بياناتك، حيث يجيز لك القانون الاعتراض؛
- سحب موافقتك، حين نعتمد عليها.

لتقديم طلب، تواصل معنا عبر {{dataRequestContact}}، وقد نطلب منك تأكيد هويتك أولًا. وإن لم يُرضِك ردّنا، يمكنك تقديم شكوى إلى مكتب الإمارات للبيانات.

### 9. أمن البيانات
نحمي بياناتك بإجراءات تقنية وتنظيمية معقولة: اتصال مشفّر (HTTPS)، وصلاحيات وصول محدودة، ومزوّدون يؤمّنون البيانات التي يعالجونها. ولا توجد وسيلة نقل عبر الإنترنت آمنة تمامًا.

### 10. الأطفال
هذا الموقع موجّه إلى الشركات والبالغين، ولا نجمع عن علمٍ بيانات أي شخص دون 18 عامًا.

### 11. التعديلات
قد نحدّث هذه السياسة، ويوضّح التاريخ في أعلاها أحدث نسخة.
