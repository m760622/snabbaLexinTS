export interface ChangeItem {
    type: 'feature' | 'improvement' | 'fix' | 'security' | 'performance' | 'bugfix' | 'test';
    sv: string;
    ar: string;
    detailSv?: string;
    detailAr?: string;
}

export interface VersionEntry {
    version: string;
    date: string;
    titleSv: string;
    titleAr: string;
    changes: ChangeItem[];
}

export const CHANGELOG_DATA: VersionEntry[] = [
    {
        version: 'v3.0.1',
        date: '6 Jan 2026',
        titleSv: 'Security & Performance Update',
        titleAr: 'تحديث الأمان والأداء',
        changes: [
            { type: 'security', sv: 'Security Fixes:', ar: 'إصلاحات أمنية:', detailSv: 'Implemented safe HTML handling to prevent XSS attacks', detailAr: 'تنفيذ معالجة HTML آمنة لمنع هجمات XSS' },
            { type: 'performance', sv: 'Search Performance:', ar: 'أداء البحث:', detailSv: 'Added debouncing and optimized DOM operations', detailAr: 'إضافة Debouncing وتحسين عمليات DOM' },
            { type: 'bugfix', sv: 'Bug Fixes:', ar: 'إصلاح الأخطاء:', detailSv: 'Fixed gender detection priority in TypeColorSystem', detailAr: 'إصلاح أولوية تحديد الجنس في TypeColorSystem' },
            { type: 'improvement', sv: 'Code Organization:', ar: 'تنظيم الكود:', detailSv: 'Centralized theme management and utilities', detailAr: 'مركزية إدارة الثيمات والأدوات المساعدة' }
        ]
    },
    {
        version: 'v3.0.0',
        date: '25 Dec 2025',
        titleSv: 'Holiday Update - UX-förbättringar',
        titleAr: 'تحديث العطلة - تحسينات تجربة المستخدم',
        changes: [
            { type: 'feature', sv: 'Förbättrad Onboarding:', ar: 'جولة تعريفية محسنة:', detailSv: '6 bildspel som täcker sök, spel, favoriter, sviter och prestationer', detailAr: '6 شرائح تغطي البحث، الألعاب، المفضلة، السلاسل والإنجازات' },
            { type: 'feature', sv: 'Konfetti-firande:', ar: 'احتفالات الكنفيتي:', detailSv: 'Vackra partikelanimationer när du låser upp prestationer 🎉', detailAr: 'رسوم متحركة جذابة عند فتح الإنجازات 🎉' }
        ]
    }
    // ... Simplified for now, can add more later
];
