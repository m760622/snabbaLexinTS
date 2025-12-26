/**
 * ============================================================
 * SNABBALEXIN i18n - نظام الترجمة الموحد
 * Internationalization System
 * ============================================================
 */

export type Language = 'sv' | 'ar' | 'both';

export interface TranslationEntry {
    sv: string;
    ar: string;
}

// All translations for the app
const translations: Record<string, TranslationEntry> = {
    // Navigation
    'nav.home': { sv: 'Hem', ar: 'الرئيسية' },
    'nav.games': { sv: 'Spel', ar: 'ألعاب' },
    'nav.learn': { sv: 'Lär dig', ar: 'تعلم' },
    'nav.profile': { sv: 'Profil', ar: 'الملف الشخصي' },
    'nav.settings': { sv: 'Inställningar', ar: 'الإعدادات' },
    'nav.add': { sv: 'Lägg till', ar: 'إضافة' },
    'nav.back': { sv: 'Tillbaka', ar: 'رجوع' },

    // Search
    'search.placeholder': { sv: 'Sök ord...', ar: 'ابحث عن كلمة...' },
    'search.noResults': { sv: 'Inga resultat hittades', ar: 'لا توجد نتائج' },
    'search.loading': { sv: 'Laddar...', ar: 'جاري التحميل...' },

    // Common buttons
    'btn.save': { sv: 'Spara', ar: 'حفظ' },
    'btn.cancel': { sv: 'Avbryt', ar: 'إلغاء' },
    'btn.confirm': { sv: 'Bekräfta', ar: 'تأكيد' },
    'btn.close': { sv: 'Stäng', ar: 'إغلاق' },
    'btn.reset': { sv: 'Återställ', ar: 'إعادة تعيين' },
    'btn.export': { sv: 'Exportera', ar: 'تصدير' },
    'btn.import': { sv: 'Importera', ar: 'استيراد' },
    'btn.test': { sv: 'Testa', ar: 'اختبار' },

    // Settings page
    'settings.title': { sv: 'Inställningar', ar: 'الإعدادات' },
    'settings.appearance': { sv: 'Utseende', ar: 'المظهر' },
    'settings.appearanceDesc': { sv: 'Anpassa din upplevelse', ar: 'تخصيص التجربة' },
    'settings.darkMode': { sv: 'Mörkt läge', ar: 'الوضع الداكن' },
    'settings.lightMode': { sv: 'Ljust läge', ar: 'الوضع الفاتح' },
    'settings.mobileView': { sv: 'Mobilvy', ar: 'عرض الجوال' },
    'settings.colorTheme': { sv: 'Färgtema', ar: 'لون الثيم' },
    'settings.fontSize': { sv: 'Textstorlek', ar: 'حجم الخط' },
    'settings.animations': { sv: 'Animationer', ar: 'الحركات' },

    // Language settings
    'settings.language': { sv: 'Språk', ar: 'اللغة' },
    'settings.languageDesc': { sv: 'Välj appspråk', ar: 'اختر لغة التطبيق' },
    'settings.langSv': { sv: 'Svenska', ar: 'السويدية' },
    'settings.langAr': { sv: 'العربية', ar: 'العربية' },
    'settings.langBoth': { sv: 'Båda språken', ar: 'كلتا اللغتين' },

    // Sound & notifications
    'settings.sound': { sv: 'Ljud & Notiser', ar: 'الصوت والإشعارات' },
    'settings.soundDesc': { sv: 'Ljud och påminnelser', ar: 'الأصوات والتذكيرات' },
    'settings.soundEffects': { sv: 'Ljudeffekter', ar: 'المؤثرات الصوتية' },
    'settings.ttsSpeed': { sv: 'Uttalshastighet', ar: 'سرعة النطق' },
    'settings.reminder': { sv: 'Daglig påminnelse', ar: 'تذكير يومي' },
    'settings.reminderTime': { sv: 'Påminnelsetid', ar: 'وقت التذكير' },

    // Learning tools
    'settings.learning': { sv: 'Lärverktyg', ar: 'أدوات التعلم' },
    'settings.learningDesc': { sv: 'Anpassa lärupplevelsen', ar: 'تخصيص تجربة التعلم' },
    'settings.dailyGoal': { sv: 'Dagligt mål', ar: 'الهدف اليومي' },
    'settings.autoPlay': { sv: 'Auto-spela ljud', ar: 'تشغيل الصوت تلقائياً' },
    'settings.showExamples': { sv: 'Visa exempel', ar: 'عرض الأمثلة' },
    'settings.focusMode': { sv: 'Fokusläge', ar: 'وضع التركيز' },
    'settings.eyeCare': { sv: 'Ögonvård', ar: 'حماية العين' },

    // Navigation section
    'settings.navigation': { sv: 'Snabbnavigering', ar: 'التنقل السريع' },
    'settings.navigationDesc': { sv: 'Genvägar till sektioner', ar: 'اختصارات للأقسام' },

    // Data & privacy
    'settings.data': { sv: 'Data & Sekretess', ar: 'البيانات والخصوصية' },
    'settings.dataDesc': { sv: 'Hantera din data', ar: 'إدارة بياناتك' },
    'settings.exportData': { sv: 'Exportera data', ar: 'تصدير البيانات' },
    'settings.importData': { sv: 'Importera data', ar: 'استيراد البيانات' },
    'settings.clearFavorites': { sv: 'Rensa favoriter', ar: 'مسح المفضلة' },
    'settings.clearAll': { sv: 'Rensa all data', ar: 'مسح جميع البيانات' },
    'settings.storage': { sv: 'Använt lagringsutrymme', ar: 'مساحة التخزين المستخدمة' },

    // About section
    'settings.about': { sv: 'Om SnabbaLexin', ar: 'حول التطبيق' },
    'settings.aboutDesc': { sv: 'Information om appen', ar: 'معلومات التطبيق' },
    'settings.version': { sv: 'Version', ar: 'الإصدار' },
    'settings.changelog': { sv: 'Ändringslogg', ar: 'سجل التغييرات' },
    'settings.deviceInfo': { sv: 'Enhetsinformation', ar: 'معلومات الجهاز' },
    'settings.vocabulary': { sv: 'Ordförråd', ar: 'حجم القاموس' },

    // Profile
    'profile.guest': { sv: 'Gäst', ar: 'زائر' },
    'profile.level': { sv: 'Nivå', ar: 'المستوى' },
    'profile.words': { sv: 'Ord', ar: 'كلمات' },
    'profile.streak': { sv: 'Streak', ar: 'سلسلة' },
    'profile.games': { sv: 'Spel', ar: 'ألعاب' },
    'profile.progress': { sv: 'Framsteg till nivå', ar: 'التقدم نحو المستوى' },
    'profile.settingsComplete': { sv: 'Inställningar klara', ar: 'الإعدادات مكتملة' },

    // Recommendations
    'rec.title': { sv: 'Rekommenderade inställningar', ar: 'الإعدادات الموصى بها' },

    // Motivation messages
    'motivation.1': { sv: 'Du gör fantastiska framsteg!', ar: 'أنت تحقق تقدماً رائعاً!' },
    'motivation.2': { sv: 'Fortsätt lära dig!', ar: 'استمر في التعلم!' },
    'motivation.3': { sv: 'Varje ord räknas!', ar: 'كل كلمة تُحسب!' },
    'motivation.4': { sv: 'Bra jobbat!', ar: 'أحسنت!' },

    // Toast messages
    'toast.darkModeOn': { sv: 'Mörkt läge aktiverat', ar: 'تم تفعيل الوضع الداكن' },
    'toast.darkModeOff': { sv: 'Ljust läge aktiverat', ar: 'تم تفعيل الوضع الفاتح' },
    'toast.mobileOn': { sv: 'Mobilvy aktiverad', ar: 'تم تفعيل عرض الجوال' },
    'toast.mobileOff': { sv: 'Skrivbordsvy aktiverad', ar: 'تم تفعيل عرض سطح المكتب' },
    'toast.langChanged': { sv: 'Språk ändrat', ar: 'تم تغيير اللغة' },
    'toast.saved': { sv: 'Sparad', ar: 'تم الحفظ' },
    'toast.copied': { sv: 'Kopierad', ar: 'تم النسخ' },
    'toast.error': { sv: 'Ett fel uppstod', ar: 'حدث خطأ' },
    'toast.animationsOn': { sv: 'Animationer på', ar: 'الحركات مفعّلة' },
    'toast.animationsOff': { sv: 'Animationer av', ar: 'الحركات متوقفة' },
    'toast.themeChanged': { sv: 'Tema ändrat', ar: 'تم تغيير الثيم' },
    'toast.fontChanged': { sv: 'Textstorlek ändrad', ar: 'تم تغيير حجم الخط' },
    'toast.dataExported': { sv: 'Data exporterad', ar: 'تم تصدير البيانات' },
    'toast.dataImported': { sv: 'Data importerad', ar: 'تم استيراد البيانات' },
    'toast.favoritesCleared': { sv: 'Favoriter rensade', ar: 'تم مسح المفضلة' },
    'toast.dataCleared': { sv: 'Alla data rensade', ar: 'تم مسح جميع البيانات' },
    'toast.avatarChanged': { sv: 'Avatar ändrad', ar: 'تم تغيير الصورة الرمزية' },
    'toast.testTTS': { sv: 'Testar uttal', ar: 'اختبار النطق' },
    'toast.favAdded': { sv: 'Sparad i favoriter', ar: 'تم الحفظ في المفضلة' },
    'toast.favRemoved': { sv: 'Borttagen från favoriter', ar: 'تم الحذف من المفضلة' },
    'toast.soundOn': { sv: 'Ljud på', ar: 'الصوت مفعّل' },
    'toast.soundOff': { sv: 'Ljud av', ar: 'الصوت متوقف' },
    'toast.goalChanged': { sv: 'Mål ändrat', ar: 'تم تغيير الهدف' },
    'toast.reminderOn': { sv: 'Påminnelse aktiverad', ar: 'التذكير مفعّل' },
    'toast.reminderOff': { sv: 'Påminnelse avstängd', ar: 'التذكير متوقف' },
    'toast.langSv': { sv: 'Svenska aktiverat', ar: 'تم تفعيل السويدية' },
    'toast.langAr': { sv: 'العربية aktiverat', ar: 'العربية مفعّلة' },
    'toast.langBoth': { sv: 'Båda språken', ar: 'كلتا اللغتين' },

    // Games
    'games.title': { sv: 'Spel', ar: 'الألعاب' },
    'games.start': { sv: 'Starta', ar: 'ابدأ' },
    'games.pause': { sv: 'Pausa', ar: 'إيقاف مؤقت' },
    'games.resume': { sv: 'Fortsätt', ar: 'استمر' },
    'games.restart': { sv: 'Börja om', ar: 'ابدأ من جديد' },
    'games.score': { sv: 'Poäng', ar: 'النقاط' },
    'games.highScore': { sv: 'Rekord', ar: 'أعلى نتيجة' },
    'games.correct': { sv: 'Rätt!', ar: 'صحيح!' },
    'games.wrong': { sv: 'Fel!', ar: 'خطأ!' },
    'games.timeUp': { sv: 'Tiden är ute!', ar: 'انتهى الوقت!' },
    'games.next': { sv: 'Nästa', ar: 'التالي' },
    'games.hint': { sv: 'Ledtråd', ar: 'تلميح' },

    // Learn section
    'learn.title': { sv: 'Lär dig', ar: 'تعلم' },
    'learn.grammar': { sv: 'Grammatik', ar: 'القواعد' },
    'learn.vocabulary': { sv: 'Ordförråd', ar: 'المفردات' },
    'learn.phrases': { sv: 'Fraser', ar: 'العبارات' },
    'learn.quiz': { sv: 'Quiz', ar: 'اختبار' },
    'learn.examples': { sv: 'Exempel', ar: 'أمثلة' },
    'learn.searchPlaceholder': { sv: 'Sök lektioner...', ar: 'ابحث عن درس...' },
    'learn.question': { sv: 'Fråga', ar: 'سؤال' },
    'learn.correct': { sv: 'rätt', ar: 'صحيح' },
    'learn.complete': { sv: 'klar', ar: 'مكتمل' },
    'learn.noExamples': { sv: 'Inte tillräckligt med exempel för quiz!', ar: 'لا توجد أمثلة كافية للاختبار!' },
    'learn.noLessons': { sv: 'Inga lektioner tillgängliga', ar: 'لا توجد دروس متاحة' },
    'learn.testYourself': { sv: 'Testa dig', ar: 'اختبر نفسك' },
    'learn.congrats': { sv: 'Grattis!', ar: 'مبروك!' },
    'learn.keepPracticing': { sv: 'Fortsätt öva!', ar: 'واصل التمرين!' },
    'learn.continue': { sv: 'Fortsätt', ar: 'متابعة' },
    'learn.tryAgain': { sv: 'Försök igen', ar: 'حاول مرة أخرى' },
    'learn.days': { sv: 'Dagar', ar: 'أيام' },
    'learn.completed': { sv: 'Klara', ar: 'مكتمل' },
    'learn.reviewTime': { sv: 'Dags för repetition!', ar: 'وقت المراجعة!' },
    'learn.wordsToReview': { sv: 'ord att repetera', ar: 'كلمات للمراجعة' },
    'learn.all': { sv: 'Alla', ar: 'الكل' },
    'learn.beginner': { sv: 'Nybörjare', ar: 'مبتدئ' },
    'learn.intermediate': { sv: 'Medel', ar: 'متوسط' },
    'learn.advanced': { sv: 'Avancerad', ar: 'متقدم' },
    'learn.quickAccess': { sv: 'Snabbspår', ar: 'الوصول السريع' },
    'learn.similarWords': { sv: 'Liknande Ord', ar: 'المتشابهات' },
    'learn.quranWords': { sv: 'Koranord', ar: 'كلمات القرآن' },
    'learn.randomQuiz': { sv: 'Slumpmässig Quiz', ar: 'اختبار عشوائي' },
    'learn.lessons': { sv: 'Lektioner', ar: 'الدروس' },
    'learn.learnSwedish': { sv: 'Lär dig Svenska', ar: 'تعلم السويدية' },

    // Common
    'common.yes': { sv: 'Ja', ar: 'نعم' },
    'common.no': { sv: 'Nej', ar: 'لا' },
    'common.ok': { sv: 'OK', ar: 'حسناً' },
    'common.loading': { sv: 'Laddar...', ar: 'جاري التحميل...' },
    'common.error': { sv: 'Fel', ar: 'خطأ' },
    'common.success': { sv: 'Klart!', ar: 'تم!' },
    'common.warning': { sv: 'Varning', ar: 'تحذير' },
    'common.info': { sv: 'Information', ar: 'معلومات' },

    // Settings-specific messages
    'settings.themeChanged': { sv: 'Tema ändrat till', ar: 'تم تغيير الثيم إلى' },
    'settings.reminderOn': { sv: 'Påminnelse aktiverad', ar: 'تم تفعيل التذكير' },
    'settings.reminderOff': { sv: 'Påminnelse avaktiverad', ar: 'تم إيقاف التذكير' },
    'settings.reminderTimeSet': { sv: 'Påminnelsetid:', ar: 'وقت التذكير:' },
    'settings.dailyGoalSet': { sv: 'Dagligt mål:', ar: 'الهدف اليومي:' },
    'settings.words': { sv: 'ord', ar: 'كلمة' },
    'settings.autoPlayOn': { sv: 'Auto-spela på', ar: 'التشغيل التلقائي مفعّل' },
    'settings.autoPlayOff': { sv: 'Auto-spela av', ar: 'التشغيل التلقائي متوقف' },
    'settings.examplesOn': { sv: 'Exempel visas', ar: 'عرض الأمثلة مفعّل' },
    'settings.examplesOff': { sv: 'Exempel döljs', ar: 'عرض الأمثلة متوقف' },
    'settings.focusOn': { sv: 'Fokusläge aktiverat', ar: 'وضع التركيز مفعّل' },
    'settings.focusOff': { sv: 'Fokusläge avaktiverat', ar: 'وضع التركيز متوقف' },
    'settings.eyeCareOn': { sv: 'Ögonvård aktiverad', ar: 'حماية العين مفعّلة' },
    'settings.eyeCareOff': { sv: 'Ögonvård avaktiverad', ar: 'حماية العين متوقفة' },
    'settings.avatarChanged': { sv: 'Avatar ändrad!', ar: 'تم تغيير الصورة!' },
    'settings.resetTitle': { sv: 'Återställ inställningar?', ar: 'إعادة تعيين الإعدادات؟' },
    'settings.resetMsg': { sv: 'Alla inställningar kommer återställas till standard.', ar: 'سيتم إعادة جميع الإعدادات إلى الوضع الافتراضي.' },
    'settings.dataImported': { sv: 'Data importerad!', ar: 'تم استيراد البيانات!' },
    'settings.importError': { sv: 'Fel vid import', ar: 'خطأ في الاستيراد' },
    'settings.dataExported': { sv: 'Data exporterad!', ar: 'تم تصدير البيانات!' },
    'settings.clearFavTitle': { sv: 'Rensa favoriter?', ar: 'مسح المفضلة؟' },
    'settings.clearFavMsg': { sv: 'Alla sparade favoriter kommer tas bort.', ar: 'سيتم حذف جميع المفضلات المحفوظة.' },
    'settings.favoritesCleared': { sv: 'Favoriter rensade', ar: 'تم مسح المفضلة' },
    'settings.clearAllTitle': { sv: 'Rensa ALL data?', ar: 'مسح جميع البيانات؟' },
    'settings.clearAllMsg': { sv: 'Detta går inte att ångra! Alla favoriter, framsteg och inställningar kommer raderas.', ar: 'لا يمكن التراجع! سيتم حذف جميع المفضلات والتقدم والإعدادات.' },
    'settings.allDataCleared': { sv: 'All data rensad', ar: 'تم مسح جميع البيانات' },
    'settings.areYouSure': { sv: 'Är du säker?', ar: 'هل أنت متأكد؟' },

    // Quran
    'quran.searchPlaceholder': { sv: 'Sök ord, surah...', ar: 'ابحث عن كلمة، سورة...' },
    'quran.allSurahs': { sv: 'Alla Suror', ar: 'كل السور' },
    'quran.allTypes': { sv: 'Alla Typer', ar: 'كل الأنواع' },
    'quran.verb': { sv: 'Verb', ar: 'أفعال' },
    'quran.noun': { sv: 'Substantiv', ar: 'أسماء' },
    'quran.particle': { sv: 'Partikel', ar: 'حروف' },
    'quran.phrase': { sv: 'Fras', ar: 'عبارات' },
    'quran.word': { sv: 'Ord', ar: 'كلمات' },
    'quran.noResults': { sv: 'Inga resultat hittades', ar: 'لا توجد نتائج' },
    'quran.loadingMore': { sv: 'Laddar {0} till...', ar: 'جاري تحميل {0} إضافية...' },
    'quran.wordsDisplayed': { sv: '{0} ord visas', ar: 'يتم عرض {0} كلمات' },
    'quran.correctFeedback': { sv: 'Rätt! الله يفتح عليك!', ar: 'صحيح! فتح الله عليك!' },
    'quran.wrongFeedback': { sv: 'Fel. Rätt svar: ', ar: 'خطأ. الإجابة الصحيحة: ' },

    // Details Screen
    'details.loading': { sv: 'Laddar...', ar: 'جاري التحميل...' },
    'details.noWordFound': { sv: 'Ordet hittades inte', ar: 'الكلمة غير موجودة' },
    'details.savedLocally': { sv: 'Sparad lokalt', ar: 'محفوظ محلياً' },
    'details.notesPlaceholder': { sv: 'Skriv anteckningar här...', ar: 'اكتب ملاحظاتك هنا...' },
    'details.confirmDelete': { sv: 'Är du säker på att du vill ta bort ordet?', ar: 'هل أنت متأكد من حذف الكلمة؟' },
    'details.saving': { sv: 'Sparar...', ar: 'جاري الحفظ...' },
    'details.saved': { sv: 'Sparat!', ar: 'تم الحفظ!' },
    'details.timeUp': { sv: 'Tiden är slut!', ar: 'انتهى الوقت!' },
    'details.retry': { sv: 'Testa igen', ar: 'حاول مرة أخرى' },
    'details.correct': { sv: 'Rätt! Bra jobbat!', ar: 'صحيح! أحسنت!' },
    'details.wrong': { sv: 'Fel. Rätt svar: ', ar: 'خطأ. الإجابة الصحيحة: ' },
};

// Language Manager
export const LanguageManager = {
    currentLang: 'both' as Language,
    listeners: [] as Array<(lang: Language) => void>,

    /**
     * Initialize language from localStorage or device language
     */
    init(): void {
        const saved = localStorage.getItem('appLanguage') as Language | null;

        if (saved) {
            this.currentLang = saved;
        } else {
            // Detect device language
            const deviceLang = navigator.language || (navigator as any).userLanguage || 'sv';
            const langCode = deviceLang.toLowerCase().split('-')[0];

            if (langCode === 'ar') {
                this.currentLang = 'ar';
            } else if (langCode === 'sv') {
                this.currentLang = 'sv';
            } else {
                this.currentLang = 'both'; // Default for other languages
            }
        }

        this.applyLanguage();
    },

    /**
     * Get current language
     */
    getLanguage(): Language {
        return this.currentLang;
    },

    /**
     * Set language and update UI
     */
    setLanguage(lang: Language): void {
        this.currentLang = lang;
        localStorage.setItem('appLanguage', lang);
        this.applyLanguage();
        this.notifyListeners();
    },

    /**
     * Apply language to document
     */
    applyLanguage(): void {
        const lang = this.currentLang;

        // Set document direction and language class
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
            document.body.classList.add('rtl', 'lang-ar');
            document.body.classList.remove('ltr', 'lang-sv', 'lang-both');
        } else if (lang === 'sv') {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'sv');
            document.body.classList.add('ltr', 'lang-sv');
            document.body.classList.remove('rtl', 'lang-ar', 'lang-both');
        } else {
            // Both - default to LTR
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'sv');
            document.body.classList.add('lang-both');
            document.body.classList.remove('rtl', 'ltr', 'lang-ar', 'lang-sv');
        }

        // Update all elements with data-i18n attribute
        this.updateTranslations();
    },

    /**
     * Update all translations in DOM
     */
    updateTranslations(): void {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                const text = t(key);
                if (text) {
                    el.textContent = text;
                }
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                const text = t(key);
                if (text) {
                    (el as HTMLInputElement).placeholder = text;
                }
            }
        });

        // Update titles/aria-labels
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key) {
                const text = t(key);
                if (text) {
                    el.setAttribute('title', text);
                    el.setAttribute('aria-label', text);
                }
            }
        });

        // Convert bilingual tooltips to custom tooltips
        this.convertTooltips();
    },

    /**
     * Convert bilingual title attributes to custom CSS tooltips
     * Finds elements with "Swedish / العربية" format and creates data-tooltip-sv/ar
     */
    convertTooltips(): void {
        document.querySelectorAll('[title]').forEach(el => {
            const title = el.getAttribute('title');
            if (title && title.includes(' / ')) {
                const parts = title.split(' / ');
                if (parts.length === 2) {
                    const [svText, arText] = parts;
                    // Set custom tooltip attributes
                    el.setAttribute('data-tooltip-sv', svText.trim());
                    el.setAttribute('data-tooltip-ar', arText.trim());
                    // Remove native tooltip
                    el.removeAttribute('title');
                }
            }
        });
    },

    /**
     * Add listener for language changes
     */
    onLanguageChange(callback: (lang: Language) => void): void {
        this.listeners.push(callback);
    },

    /**
     * Notify all listeners of language change
     */
    notifyListeners(): void {
        this.listeners.forEach(cb => cb(this.currentLang));
    },

    /**
     * Toggle between languages cyclically
     */
    toggle(): Language {
        const cycle: Language[] = ['sv', 'ar', 'both'];
        const currentIndex = cycle.indexOf(this.currentLang);
        const nextLang = cycle[(currentIndex + 1) % cycle.length];
        this.setLanguage(nextLang);
        return nextLang;
    }
};

/**
 * Translation function
 * @param key Translation key
 * @returns Translated string based on current language
 */
export function t(key: string): string {
    const entry = translations[key];
    if (!entry) {
        console.warn(`Missing translation: ${key}`);
        return key;
    }

    const lang = LanguageManager.currentLang;

    if (lang === 'sv') {
        return entry.sv;
    } else if (lang === 'ar') {
        return entry.ar;
    } else {
        // Both languages
        return `${entry.sv} / ${entry.ar}`;
    }
}

/**
 * Get translation for specific language (ignoring current setting)
 */
export function tLang(key: string, lang: 'sv' | 'ar'): string {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang];
}

/**
 * Check if RTL is active
 */
export function isRTL(): boolean {
    return LanguageManager.currentLang === 'ar';
}

/**
 * Get all available translations (for debugging)
 */
export function getAllTranslations(): Record<string, TranslationEntry> {
    return { ...translations };
}

// Global export for legacy scripts
if (typeof window !== 'undefined') {
    (window as any).LanguageManager = LanguageManager;
    (window as any).t = t;
    (window as any).tLang = tLang;
    (window as any).isRTL = isRTL;
}

// Auto-init on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LanguageManager.init());
    } else {
        LanguageManager.init();
    }
}

export default LanguageManager;
