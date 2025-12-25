/**
 * SnabbaLexin - Unified Configuration
 * Central place for all shared settings and constants
 */

export const AppConfig = {
    // Debug mode - set to false for production to disable console logs
    DEBUG_MODE: false,

    // Data versioning - increment when data.json changes
    DATA_VERSION: '2025.12.22.1',

    // Database settings
    DB_NAME: 'snabba-lexin-db',
    DB_VERSION: 2,

    // Data paths
    DATA_PATH: {
        root: '/data/data.json',
        games: '/data/data.json'
    },

    // Column indices for dictionaryData array
    COLUMNS: {
        ID: 0,
        TYPE: 1,
        SWEDISH: 2,
        ARABIC: 3,
        ARABIC_EXT: 4,
        DEFINITION: 5,
        FORMS: 6,
        EXAMPLE_SWE: 7,
        EXAMPLE_ARB: 8,
        IDIOM_SWE: 9,
        IDIOM_ARB: 10
    },

    // Splash screen settings
    SPLASH: {
        MIN_DISPLAY_TIME: 2000,  // ms
        TIP_ROTATION_INTERVAL: 3000  // ms
    },

    // Storage keys
    STORAGE_KEYS: {
        THEME: 'theme',
        MOBILE_VIEW: 'mobileView',
        FAVORITES: 'favorites',
        WORD_ASSESSMENTS: 'wordAssessments',
        SEARCH_HISTORY: 'searchHistory'
    },

    // Tips displayed during loading
    LOADING_TIPS: [
        '💡 Visste du? Du kan söka på både svenska och arabiska!',
        '🎮 Prova våra lärandespel för att öva ordförrådet!',
        '⭐ Spara dina favoritord för snabb åtkomst!',
        '🔊 Tryck på högtalarikonen för att höra uttalet!',
        '📱 Installera appen för offline-användning!',
        '🌙 تبديل الوضع الليلي متاح في الإعدادات!',
        '📝 يمكنك إضافة كلماتك الخاصة!'
    ]
} as const;

/**
 * Production-safe Logger
 * Only logs when DEBUG_MODE is true
 */
export const Logger = {
    log: (...args: any[]) => AppConfig.DEBUG_MODE && console.log(...args),
    warn: (...args: any[]) => AppConfig.DEBUG_MODE && console.warn(...args),
    error: (...args: any[]) => console.error(...args), // Always show errors
    info: (...args: any[]) => AppConfig.DEBUG_MODE && console.info(...args)
};

// Make available globally for legacy scripts
if (typeof window !== 'undefined') {
    (window as any).AppConfig = AppConfig;
    (window as any).Logger = Logger;
}
