---
description: جعل عنوان الصفحة مرئياً على الموبايل (إصلاح display:none)
---

# Mobile Visible Title

هذه القاعدة تُستخدم لإظهار عنوان الصفحة (`header h1`) على الشاشات الصغيرة (أقل من 600px) بدلاً من إخفائه.

## الحالة الشائعة للمشكلة

عادةً يتم إخفاء العنوان على الموبايل لتوفير مساحة للأزرار:

```css
@media (max-width: 600px) {
    header h1 {
        display: none;
    }
}
```

## الحل (Mobile Visible Title)

استبدل القاعدة أعلاه بالتالي:

```css
@media (max-width: 600px) {
    header h1 {
        /* Mobile Visible Title - يُظهر العنوان بتنسيق مناسب */
        font-size: 0.9rem;
        flex: 1;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
```

## شرح الخصائص

| الخاصية | الوظيفة |
|---------|---------|
| `font-size: 0.9rem` | حجم أصغر مناسب للموبايل |
| `flex: 1` | يأخذ المساحة المتاحة بين الأزرار |
| `text-align: center` | توسيط النص |
| `white-space: nowrap` | يبقى في سطر واحد |
| `overflow: hidden` | إخفاء النص الزائد |
| `text-overflow: ellipsis` | يظهر (...) إذا كان النص طويلاً |

## متى تستخدمها

استخدم `/mobile-visible-title` عندما:

- العنوان مختفي على الموبايل
- تريد إظهار عنوان الصفحة بشكل أنيق على الشاشات الصغيرة
- تحتاج لإصلاح مشكلة `display: none` في media query
