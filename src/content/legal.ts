// The Privacy Policy, Terms of Use and Cookie Policy (D78), from the drafts approved on 2026-11-09
// (docs/content/legal/). Not legal advice: no lawyer for now; the owner accepts the drafts and gives
// them a final read before launch (D89; CONTENT_CHECKLIST #24; `legal.reviewed` in src/config/legal.ts). Lines that need a config value
// (`needs`) stay hidden until it's set. The company is "NO TIME Creative House" in Latin in both
// languages (brand-name rule); the registered legal name comes only from config.
// Facts checked on the production build, 2026-11-09 (host changed to Hostinger, D89): processors Hostinger, Cloudflare Turnstile and
// Resend; no analytics; no database for form submissions; one cookie (NEXT_LOCALE). Analytics at
// launch is cookieless only (D88): the lines naming it show once `legal.analytics` is set.
import type { LegalDoc } from "@/lib/legal";

const UPDATED = "2026-11-09";

const privacy: LegalDoc = {
  slug: "privacy",
  title: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  updated: UPDATED,
  sections: [
    {
      heading: { en: "Who we are", ar: "من نحن" },
      blocks: [
        {
          p: {
            en: "This website is run by NO TIME Creative House, based in Dubai, United Arab Emirates. In this policy, “we” and “us” mean NO TIME Creative House.",
            ar: "يدير هذا الموقعَ NO TIME Creative House، ومقرّه دبي، الإمارات العربية المتحدة. ويُقصد بكلمة «نحن» في هذه السياسة NO TIME Creative House.",
          },
        },
        { p: { en: "Our registered legal entity is {legalName}, {address}.", ar: "كياننا القانوني المسجّل: {legalName}، {address}." }, needs: ["legalName", "address"] },
        { p: { en: "For any question about your personal data, contact us at {dataRequestContact}.", ar: "لأي سؤال عن بياناتك الشخصية، تواصل معنا عبر {dataRequestContact}." }, needs: ["dataRequestContact"] },
      ],
    },
    {
      heading: { en: "What this policy covers", ar: "نطاق هذه السياسة" },
      blocks: [
        {
          p: {
            en: "This policy explains what personal data we collect through this website, why, who processes it for us, how long we keep it, and the rights you have. It doesn't cover other websites we link to.",
            ar: "توضّح هذه السياسة البيانات الشخصية التي نجمعها عبر هذا الموقع، وسبب جمعها، ومن يعالجها نيابةً عنّا، ومدة احتفاظنا بها، والحقوق التي تملكها. ولا تشمل المواقع الأخرى التي نضع روابطها.",
          },
        },
      ],
    },
    {
      heading: { en: "What we collect", ar: "البيانات التي نجمعها" },
      blocks: [
        {
          p: {
            en: "What you send us. When you use a form on this site (a consultation request, a quote request, or registering interest in a product), we receive what you enter: your name, your email address and/or WhatsApp number, your company if you give it, the service or product you're asking about, a budget range if you choose one, your message, and the details the form asks for (for example an event date, a city, a guest count, items and quantities, or rental dates).",
            ar: "ما ترسله إلينا. عند استخدامك أحد نماذج الموقع (طلب استشارة، أو طلب عرض سعر، أو تسجيل اهتمامك بأحد منتجاتنا)، يصلنا ما تكتبه: اسمك، وبريدك الإلكتروني و/أو رقم واتساب، واسم شركتك إن ذكرته، والخدمة أو المنتج الذي تسأل عنه، ونطاق الميزانية إن اخترته، ورسالتك، والتفاصيل التي يطلبها النموذج (مثل موعد المناسبة، أو المدينة، أو عدد الضيوف، أو المنتجات والكميات، أو مواعيد الاستئجار).",
          },
        },
        {
          p: {
            en: "Technical data. Like any website, our hosting provider processes your IP address and basic browser information to deliver pages and keep the site secure. When you submit a form, Cloudflare Turnstile checks that the request comes from a person and not an automated program, and we use your IP address for a short time to limit repeated submissions.",
            ar: "البيانات التقنية. كأي موقع إلكتروني، يعالج مزوّد الاستضافة عنوان IP الخاص بك ومعلومات أساسية عن متصفحك، لعرض الصفحات والحفاظ على أمن الموقع. وعند إرسال أي نموذج، تتحقّق خدمة Cloudflare Turnstile من أن الطلب صادر عن شخص لا عن برنامج آلي، ونستخدم عنوان IP لفترة قصيرة للحدّ من تكرار الإرسال.",
          },
        },
        {
          p: {
            en: "Your language choice. One cookie remembers whether you're reading in English or Arabic. See the [Cookie Policy](/cookies).",
            ar: "اختيار اللغة. ملف تعريف ارتباط واحد يتذكّر هل تتصفّح بالعربية أم بالإنجليزية. راجع [سياسة ملفات تعريف الارتباط](/cookies).",
          },
        },
        {
          p: {
            en: "Visit statistics. We count visits with {analytics}, a service that uses no cookies. It records totals such as pages viewed, the site a visit came from, the country and the type of device, without building a profile of you or following you to other sites, so we don't ask for consent.",
            ar: "إحصاءات الزيارات. نحصي الزيارات عبر {analytics}، وهي خدمة لا تستخدم ملفات تعريف الارتباط. تسجّل أرقامًا إجمالية مثل الصفحات التي شوهدت، والموقع الذي جاءت منه الزيارة، والبلد، ونوع الجهاز، دون أن تكوّن ملفًا عنك أو تتبعك إلى مواقع أخرى، لذلك لا نطلب موافقتك.",
          },
          needs: ["analytics"],
        },
        {
          p: {
            en: "What we don't do. We don't use analytics or advertising trackers, and we don't sell or rent your data. If we ever add analytics, we'll update this policy first.",
            ar: "ما لا نفعله. لا نستخدم أدوات تحليل أو تتبّع إعلاني، ولا نبيع بياناتك ولا نؤجّرها. وإذا أضفنا أدوات تحليل يومًا ما، فسنحدّث هذه السياسة أولًا.",
          },
          absent: ["analytics"],
        },
        {
          p: {
            en: "What we don't do. We don't use advertising trackers, and we don't sell or rent your data.",
            ar: "ما لا نفعله. لا نستخدم أدوات تتبّع إعلاني، ولا نبيع بياناتك ولا نؤجّرها.",
          },
          needs: ["analytics"],
        },
      ],
    },
    {
      heading: { en: "Why we use it", ar: "لماذا نستخدم بياناتك" },
      blocks: [
        {
          list: [
            {
              text: {
                en: "To answer your request: to reply, to understand what you need, and to prepare a proposal. We use your data because you asked us to, as a step before a possible agreement with you.",
                ar: "للردّ على طلبك: لنتواصل معك، ونفهم ما تحتاجه، ونعدّ لك عرضًا. نستخدم بياناتك لأنك طلبت منّا ذلك، تمهيدًا لاتفاق محتمل بيننا.",
              },
            },
            { text: { en: "To keep the site and its forms safe: to block spam and abuse.", ar: "لحماية الموقع ونماذجه: لمنع الرسائل المزعجة وإساءة الاستخدام." } },
          ],
        },
        {
          p: {
            en: "We don't use your data for marketing, and we don't make decisions about you by automated means alone.",
            ar: "لا نستخدم بياناتك لأغراض تسويقية، ولا نتّخذ بشأنك قرارات تعتمد على المعالجة الآلية وحدها.",
          },
        },
      ],
    },
    {
      heading: { en: "Who processes it for us", ar: "من يعالج بياناتك نيابةً عنّا" },
      blocks: [
        {
          p: {
            en: "We use a small number of service providers, who process data only to provide their service to us:",
            ar: "نستعين بعدد محدود من مزوّدي الخدمات، ولا يعالج أيٌّ منهم البيانات إلا لتقديم خدمته لنا:",
          },
        },
        {
          list: [
            { text: { en: "Hostinger hosts the website.", ar: "Hostinger لاستضافة الموقع." } },
            { text: { en: "{analytics} counts visits in totals, without cookies.", ar: "{analytics} لإحصاء الزيارات إجمالًا، دون ملفات تعريف ارتباط." }, needs: ["analytics"] },
            { text: { en: "Cloudflare (Turnstile) checks form submissions for automated abuse.", ar: "Cloudflare (خدمة Turnstile) لفحص النماذج المُرسلة والتصدّي لإساءة الاستخدام الآلية." } },
            { text: { en: "Resend delivers form submissions to our inbox and, where it applies, a confirmation to you.", ar: "Resend لإيصال النماذج المُرسلة إلى بريدنا، وإرسال رسالة تأكيد إليك حين ينطبق ذلك." } },
            // D78: listed before the WhatsApp button can render (both gate on contact.whatsapp).
            {
              text: {
                en: "WhatsApp (Meta): if you message us on WhatsApp, your number and messages are handled by WhatsApp, under Meta's own terms and privacy policy.",
                ar: "واتساب (Meta): إذا راسلتنا عبر واتساب، فإن رقمك ورسائلك تعالجها خدمة واتساب وفق شروط Meta وسياسة الخصوصية الخاصة بها.",
              },
              needs: ["whatsapp"],
            },
          ],
        },
        { p: { en: "We may also disclose data where the law requires it.", ar: "وقد نُفصح عن البيانات حين يُلزمنا القانون بذلك." } },
      ],
    },
    {
      heading: { en: "Data outside the UAE", ar: "معالجة البيانات خارج الإمارات" },
      blocks: [
        {
          p: {
            en: "These providers may process data outside the United Arab Emirates, including in the United States. We rely on their contractual and technical safeguards for personal data, and we use only what each service needs.",
            ar: "قد يعالج هؤلاء المزوّدون البيانات خارج دولة الإمارات العربية المتحدة، ومن ذلك الولايات المتحدة. ونعتمد على ضماناتهم التعاقدية والتقنية لحماية البيانات الشخصية، ولا نستخدم إلا ما تحتاجه كل خدمة.",
          },
        },
      ],
    },
    {
      heading: { en: "How long we keep it", ar: "مدة الاحتفاظ بالبيانات" },
      blocks: [
        {
          p: {
            en: "We don't keep a database of form submissions on this website: a submission reaches us as an email. If an enquiry doesn't become a project, we delete it within 12 months of our last contact with you. If it does, we keep the records of our agreement for as long as the applicable law requires.",
            ar: "لا نحتفظ في هذا الموقع بقاعدة بيانات للنماذج المُرسلة، فكل نموذج يصلنا رسالةً بالبريد الإلكتروني. وإذا لم يتحوّل الاستفسار إلى مشروع، نحذفه خلال 12 شهرًا من آخر تواصل بيننا. وإذا تحوّل إلى مشروع، نحتفظ بسجلات الاتفاق للمدة التي يفرضها القانون المعمول به.",
          },
        },
      ],
    },
    {
      heading: { en: "Your rights", ar: "حقوقك" },
      blocks: [
        { p: { en: "Under the UAE Personal Data Protection Law, you can ask us to:", ar: "بموجب قانون حماية البيانات الشخصية في دولة الإمارات، يحقّ لك أن تطلب منّا:" } },
        {
          list: [
            { text: { en: "tell you what personal data we hold about you and give you a copy;", ar: "إطلاعك على البيانات الشخصية التي نحتفظ بها عنك وتزويدك بنسخة منها؛" } },
            { text: { en: "correct data that is inaccurate or incomplete;", ar: "تصحيح البيانات غير الدقيقة أو غير المكتملة؛" } },
            { text: { en: "delete your data, or restrict how we use it;", ar: "حذف بياناتك، أو تقييد استخدامنا لها؛" } },
            { text: { en: "stop using your data, where the law allows you to object;", ar: "التوقّف عن استخدام بياناتك، حيث يجيز لك القانون الاعتراض؛" } },
            { text: { en: "withdraw your consent, where we rely on it.", ar: "سحب موافقتك، حين نعتمد عليها." } },
          ],
        },
        {
          p: {
            en: "To make a request, contact {dataRequestContact}. We may ask you to confirm your identity first.",
            ar: "لتقديم طلب، تواصل معنا عبر {dataRequestContact}، وقد نطلب منك تأكيد هويتك أولًا.",
          },
          needs: ["dataRequestContact"],
        },
        {
          p: {
            en: "If you're not satisfied with our answer, you can complain to the UAE Data Office.",
            ar: "وإن لم يُرضِك ردّنا، يمكنك تقديم شكوى إلى مكتب الإمارات للبيانات.",
          },
        },
      ],
    },
    {
      heading: { en: "Security", ar: "أمن البيانات" },
      blocks: [
        {
          p: {
            en: "We protect your data with reasonable technical and organisational measures: encrypted connections (HTTPS), limited access, and providers that secure the data they process. No method of transmission over the internet is completely secure.",
            ar: "نحمي بياناتك بإجراءات تقنية وتنظيمية معقولة: اتصال مشفّر (HTTPS)، وصلاحيات وصول محدودة، ومزوّدون يؤمّنون البيانات التي يعالجونها. ولا توجد وسيلة نقل عبر الإنترنت آمنة تمامًا.",
          },
        },
      ],
    },
    {
      heading: { en: "Children", ar: "الأطفال" },
      blocks: [
        {
          p: {
            en: "This website is meant for businesses and adults. We don't knowingly collect data from anyone under 18.",
            ar: "هذا الموقع موجّه إلى الشركات والبالغين، ولا نجمع عن علمٍ بيانات أي شخص دون 18 عامًا.",
          },
        },
      ],
    },
    {
      heading: { en: "Changes", ar: "التعديلات" },
      blocks: [{ p: { en: "We may update this policy. The date at the top shows the latest version.", ar: "قد نحدّث هذه السياسة، ويوضّح التاريخ في أعلاها أحدث نسخة." } }],
    },
  ],
};

const terms: LegalDoc = {
  slug: "terms",
  title: { en: "Terms of Use", ar: "شروط الاستخدام" },
  updated: UPDATED,
  sections: [
    {
      heading: { en: "About these terms", ar: "عن هذه الشروط" },
      blocks: [
        {
          p: {
            en: "These terms apply to your use of this website, run by NO TIME Creative House, Dubai, United Arab Emirates. By using the site, you accept them. If you don't, please don't use the site.",
            ar: "تسري هذه الشروط على استخدامك لهذا الموقع، الذي يديره NO TIME Creative House في دبي، الإمارات العربية المتحدة. وباستخدامك الموقع فإنك توافق عليها، وإن لم توافق عليها فنرجو ألّا تستخدمه.",
          },
        },
        { p: { en: "Our registered legal entity is {legalName}, {address}.", ar: "كياننا القانوني المسجّل: {legalName}، {address}." }, needs: ["legalName", "address"] },
      ],
    },
    {
      heading: { en: "What the site is for", ar: "الغرض من الموقع" },
      blocks: [
        {
          p: {
            en: "The site describes our services and lets you contact us. Its content is general information, not an offer. The scope, timing and terms of any work are set only in a written proposal or agreement between you and us.",
            ar: "يعرّف الموقع بخدماتنا ويتيح لك التواصل معنا. ومحتواه معلومات عامة، لا عرضٌ ملزِم. أمّا نطاق أي عمل وموعده وشروطه، فلا تُحدَّد إلا في عرض أو اتفاق مكتوب بيننا وبينك.",
          },
        },
      ],
    },
    {
      heading: { en: "Images, examples and previews", ar: "الصور والأمثلة والمعاينات" },
      blocks: [
        // D77: the visible AI-image disclosure (also in the footer), in place of embedded C2PA.
        { p: { en: "Some images on this site are AI-generated illustrations.", ar: "بعض الصور في هذا الموقع توضيحية ومولّدة بالذكاء الاصطناعي." } },
        {
          list: [
            { text: { en: "Where an image stands in for a real project, it is labelled “Illustrative”.", ar: "حين تأتي صورة بدلًا من مشروع حقيقي، نضع عليها عبارة «صورة توضيحية»." } },
            { text: { en: "Sample content created with AI is labelled “AI-generated example”.", ar: "المحتوى النموذجي المُنشأ بالذكاء الاصطناعي يحمل عبارة «مثال مولَّد بالذكاء الاصطناعي»." } },
            { text: { en: "Demonstration data is labelled “Example”, and early product screens are labelled “Preview”.", ar: "بيانات العرض التوضيحي تحمل عبارة «مثال»، وشاشات المنتجات الأولية تحمل عبارة «معاينة»." } },
          ],
        },
        { p: { en: "None of these shows a real result, a real client or a real event.", ar: "لا يعرض أيٌّ منها نتيجة حقيقية، ولا عميلًا حقيقيًا، ولا حدثًا حقيقيًا." } },
      ],
    },
    {
      heading: { en: "Intellectual property", ar: "الملكية الفكرية" },
      blocks: [
        {
          p: {
            en: "The site's text, design, graphics, code and the NO TIME name and logo belong to us or to those who licensed them to us. Other names, logos and marks that appear on the site belong to their owners. You may view and share links to our pages, but you may not copy, reproduce or reuse the content for commercial purposes without our written permission.",
            ar: "نصوص الموقع وتصميمه ورسومه وبرمجته، واسم NO TIME وشعارها، ملكٌ لنا أو لمن رخّصها لنا. وتعود الأسماء والشعارات والعلامات الأخرى الظاهرة على صفحات الموقع إلى أصحابها. يمكنك تصفّح صفحاتنا ومشاركة روابطها، لكن لا يجوز نسخ المحتوى أو إعادة إنتاجه أو استخدامه لأغراض تجارية دون إذن مكتوب منّا.",
          },
        },
      ],
    },
    {
      heading: { en: "Using the forms", ar: "استخدام النماذج" },
      blocks: [
        {
          p: {
            en: "When you use a form, please give accurate information and only your own contact details, or those you're authorised to share. Don't send anything unlawful, harmful or unrelated to your request. We use what you send as our [Privacy Policy](/privacy) describes.",
            ar: "عند استخدامك أي نموذج، نرجو أن تقدّم معلومات صحيحة، وألّا تذكر إلا بيانات الاتصال الخاصة بك أو تلك التي يحقّ لك مشاركتها. ولا ترسل ما هو مخالف للقانون، أو ضار، أو لا يتعلّق بطلبك. ونستخدم ما ترسله وفق ما توضّحه [سياسة الخصوصية](/privacy).",
          },
        },
      ],
    },
    {
      heading: { en: "Acceptable use", ar: "الاستخدام المقبول" },
      blocks: [
        {
          p: {
            en: "Don't misuse the site: don't try to break into it, overload it, scrape it in bulk, send automated submissions, or interfere with how it works for others.",
            ar: "لا تُسئ استخدام الموقع: لا تحاول اختراقه أو إثقاله بالطلبات، ولا تنسخ محتواه آليًا بكميات كبيرة، ولا ترسل نماذج آلية، ولا تعطّل عمله على الآخرين.",
          },
        },
      ],
    },
    {
      heading: { en: "Links to other sites", ar: "روابط المواقع الأخرى" },
      blocks: [
        {
          p: {
            en: "Links to other websites are there for convenience. We don't control those sites and aren't responsible for their content or their privacy practices.",
            ar: "نضع روابط بعض المواقع الأخرى تسهيلًا عليك، لكننا لا نتحكّم فيها، ولا نتحمّل مسؤولية محتواها أو ممارساتها في الخصوصية.",
          },
        },
      ],
    },
    {
      heading: { en: "Liability", ar: "المسؤولية" },
      blocks: [
        {
          p: {
            en: "We work to keep the site accurate and available, but we provide it “as is”, without guarantees that it is complete, error-free or always available. To the extent the law allows, we are not liable for any loss that results from using the site or relying on its content. Nothing in these terms limits liability that the law does not allow us to limit.",
            ar: "نحرص على دقّة الموقع وإتاحته، لكننا نقدّمه «كما هو»، دون ضمان اكتماله أو خلوّه من الأخطاء أو إتاحته في كل وقت. وفي الحدود التي يسمح بها القانون، لا نتحمّل المسؤولية عن أي خسارة تنتج عن استخدام الموقع أو الاعتماد على محتواه. ولا يحدّ أي بند في هذه الشروط من مسؤولية لا يجيز القانون الحدّ منها.",
          },
        },
      ],
    },
    {
      heading: { en: "Governing law and language", ar: "القانون الحاكم واللغة" },
      blocks: [
        {
          p: {
            en: "These terms are governed by the laws of the United Arab Emirates. {courts} have jurisdiction over any dispute arising from them.",
            ar: "تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة، وتختصّ {courts} بالنظر في أي نزاع ينشأ عنها.",
          },
        },
        {
          p: {
            en: "If the Arabic and English versions of these terms differ, the {prevailingLanguage} version prevails.",
            ar: "إذا اختلفت النسختان العربية والإنجليزية من هذه الشروط، تُعتمد النسخة {prevailingLanguage}.",
          },
        },
      ],
    },
    {
      heading: { en: "Changes", ar: "التعديلات" },
      blocks: [{ p: { en: "We may update these terms. The date at the top shows the latest version.", ar: "قد نحدّث هذه الشروط، ويوضّح التاريخ في أعلاها أحدث نسخة." } }],
    },
    {
      heading: { en: "Contact", ar: "التواصل" },
      blocks: [{ p: { en: "Questions about these terms: {dataRequestContact}.", ar: "للأسئلة عن هذه الشروط: {dataRequestContact}." }, needs: ["dataRequestContact"] }],
    },
  ],
};

const cookies: LegalDoc = {
  slug: "cookies",
  title: { en: "Cookie Policy", ar: "سياسة ملفات تعريف الارتباط" },
  updated: UPDATED,
  sections: [
    {
      heading: { en: "What cookies are", ar: "ما ملفات تعريف الارتباط" },
      blocks: [
        {
          p: {
            en: "Cookies are small text files a website stores in your browser. Similar technologies, such as your browser's session storage, keep small pieces of information on your device in the same way.",
            ar: "ملفات تعريف الارتباط (الكوكيز) ملفات نصية صغيرة يحفظها الموقع في متصفحك. وتعمل تقنيات مشابهة، مثل تخزين الجلسة في متصفحك، بالطريقة نفسها، فتحفظ معلومات صغيرة على جهازك.",
          },
        },
      ],
    },
    {
      heading: { en: "What we use", ar: "ما نستخدمه" },
      blocks: [
        {
          p: {
            en: "We use only what the site needs to work. We don't use analytics, advertising or social media cookies.",
            ar: "لا نستخدم إلا ما يحتاجه الموقع ليعمل، ولا نستخدم ملفات تعريف ارتباط للتحليل أو الإعلانات أو وسائل التواصل الاجتماعي.",
          },
          absent: ["analytics"],
        },
        {
          p: {
            en: "We use only what the site needs to work, and no analytics, advertising or social media cookies. Our visit statistics ({analytics}) use no cookies at all.",
            ar: "لا نستخدم إلا ما يحتاجه الموقع ليعمل، ولا نستخدم ملفات تعريف ارتباط للتحليل أو الإعلانات أو وسائل التواصل الاجتماعي. أما إحصاءات الزيارات لدينا ({analytics}) فلا تستخدم أي ملفات تعريف ارتباط.",
          },
          needs: ["analytics"],
        },
        {
          table: {
            head: { en: ["Name", "Type", "What it does", "How long"], ar: ["الاسم", "النوع", "وظيفته", "مدته"] },
            rows: [
              {
                en: ["NEXT_LOCALE", "Cookie, set by this site", "Remembers whether you're reading in English or Arabic.", "Until you close your browser"],
                ar: ["NEXT_LOCALE", "ملف تعريف ارتباط يضعه هذا الموقع", "يتذكّر هل تتصفّح بالعربية أم بالإنجليزية.", "حتى تغلق المتصفح"],
              },
              {
                en: ["nt-intro", "Session storage (not a cookie)", "Remembers that you've seen the home page's opening animation, so it plays only once.", "Until you close the tab"],
                ar: ["nt-intro", "تخزين الجلسة (ليس ملف تعريف ارتباط)", "يتذكّر أنك شاهدت الحركة الافتتاحية في الصفحة الرئيسية، فلا تُعرض إلا مرة واحدة.", "حتى تغلق التبويب"],
              },
            ],
          },
        },
        {
          p: {
            en: "On our forms, Cloudflare Turnstile runs a check in your browser to tell people from automated programs. How Cloudflare processes that data is described in Cloudflare's privacy policy.",
            ar: "في نماذج الموقع، تُجري خدمة Cloudflare Turnstile فحصًا في متصفحك للتمييز بين الأشخاص والبرامج الآلية. وتوضّح سياسة الخصوصية لدى Cloudflare كيفية معالجتها لهذه البيانات.",
          },
        },
      ],
    },
    {
      heading: { en: "Your choices", ar: "خياراتك" },
      blocks: [
        {
          p: {
            en: "These items are needed for the site to work as designed, so we don't ask for consent to use them. You can block or delete cookies in your browser settings. The site still works without them, but it may not remember your language.",
            ar: "هذه العناصر لازمة ليعمل الموقع كما صُمّم، لذلك لا نطلب موافقتك على استخدامها. ويمكنك حظر ملفات تعريف الارتباط أو حذفها من إعدادات متصفحك. سيظل الموقع يعمل دونها، لكنه قد لا يتذكّر لغتك.",
          },
        },
        {
          p: {
            en: "If we ever add optional cookies, we'll ask for your consent first and update this policy.",
            ar: "وإذا أضفنا يومًا ملفات تعريف ارتباط اختيارية، فسنطلب موافقتك أولًا ونحدّث هذه السياسة.",
          },
        },
      ],
    },
    {
      heading: { en: "More information", ar: "لمزيد من المعلومات" },
      blocks: [
        {
          p: {
            en: "See our [Privacy Policy](/privacy) for how we handle personal data.",
            ar: "راجع [سياسة الخصوصية](/privacy) لمعرفة كيفية تعاملنا مع البيانات الشخصية.",
          },
        },
      ],
    },
  ],
};

export const legalDocs: LegalDoc[] = [privacy, terms, cookies];
export const getLegalDoc = (slug: LegalDoc["slug"]) => legalDocs.find((d) => d.slug === slug)!;
