# دليل روابط الحملات (UTM) لمنشورات NO TIME

**لمن:** راند، ولكل من ينشر روابط الموقع على السوشال ميديا أو في الرسائل.
**الهدف:** أن نعرف من أي منشور أو إعلان أو رابط جاء كل طلب عرض سعر.

## كيف يعمل

حين يفتح الزائر رابطًا فيه وسوم حملة، يحفظ الموقع ثلاث معلومات طوال الجلسة (حتى يغلق التبويب، ودون ملفات تعريف ارتباط):

1. وسوم الحملة الموجودة في الرابط؛
2. الموقع الذي جاء منه (إنستغرام، لينكدإن، Google…)؛
3. أول صفحة فتحها.

وإذا أرسل أي نموذج (طلب عرض سعر، مكالمة تعريفية، مراجعة موقع، تسجيل اهتمام بمنتج)، تصل هذه المعلومات في آخر البريد الذي يصل إلى الفريق:

```
Source: instagram / social
Campaign: eid-2027
Referrer: l.instagram.com
Landing page: /ar/services/events-hospitality
```

بلا وسوم، يظهر الموقع الذي جاء منه الزائر فقط، أو «Direct» إن فتح الرابط مباشرة (من واتساب مثلًا، فهو لا يرسل اسم الموقع).

## القواعد

- حروف إنجليزية صغيرة فقط، وشَرطة بين الكلمات: `eid-2027` وليس `Eid 2027`.
- ثلاثة وسوم تكفي غالبًا: `utm_source` (المنصّة) و`utm_medium` (نوع الرابط) و`utm_campaign` (اسم الحملة أو المناسبة).
- `utm_content` اختياري، للتفريق بين نسختين من المنشور نفسه (`video` / `carousel`).
- لا تضع في الرابط اسم عميل أو رقم هاتف أو بريدًا إلكترونيًا.
- الرابط العربي يبدأ بـ `/ar`، والإنجليزي بـ `/en`.

## القيم المعتمدة

| المكان | `utm_source` | `utm_medium` |
|---|---|---|
| رابط البايو في إنستغرام | `instagram` | `bio` |
| ستوري إنستغرام | `instagram` | `story` |
| منشور أو ريلز إنستغرام (رابط في التعليق أو الرسائل) | `instagram` | `social` |
| إعلان ممول على Meta | `meta` | `paid` |
| منشور لينكدإن | `linkedin` | `social` |
| حالة واتساب أو رسالة جماعية | `whatsapp` | `message` |
| توقيع البريد الإلكتروني | `email` | `signature` |
| ملف Google التجاري | `google` | `business-profile` |
| رمز QR مطبوع (بروفايل، بطاقة، ستاند) | `print` | `qr` |

## أمثلة جاهزة

**البايو في إنستغرام** (صفحة الروابط السريعة):

```
https://notimehub.com/ar/links?utm_source=instagram&utm_medium=bio
```

**ستوري عن حفل خاص** (يفتح قسم الحفلات مباشرة):

```
https://notimehub.com/ar/services/events-hospitality?utm_source=instagram&utm_medium=story&utm_campaign=wedding-season#celebrations
```

**منشور لينكدإن عن جناح معرض**:

```
https://notimehub.com/en/services/production-print-gifts?utm_source=linkedin&utm_medium=social&utm_campaign=exhibitions-2027#fabrication
```

**إعلان Meta عن تطوير المواقع**:

```
https://notimehub.com/ar/services/software-digital?utm_source=meta&utm_medium=paid&utm_campaign=websites-q1&utm_content=video
```

**رمز QR على البروفايل المطبوع**:

```
https://notimehub.com/ar?utm_source=print&utm_medium=qr&utm_campaign=profile-2026
```

انتبه: الجزء الذي يبدأ بـ `#` يأتي دائمًا **في آخر** الرابط، بعد الوسوم.

## قبل النشر

1. افتح الرابط في نافذة خاصة وتأكّد أنه يفتح الصفحة الصحيحة.
2. لا تختصر الرابط بخدمة تحذف الوسوم.
3. سجّل اسم الحملة في جدول بسيط (التاريخ، المنصّة، الحملة، الرابط)، لتربط الطلبات بالمنشورات لاحقًا.
