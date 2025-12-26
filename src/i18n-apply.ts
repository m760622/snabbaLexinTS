/**
 * ============================================================
 * i18n Auto-Apply Script
 * Applies translations to common elements across all pages
 * ============================================================
 */

import { LanguageManager, t, isRTL } from './i18n';

// Common elements that need translation across all pages
const commonTranslations: Record<string, { selector: string; type: 'text' | 'placeholder' | 'title' | 'aria' }[]> = {
    // Navigation
    'nav.settings': [
        { selector: '#settingsBtn', type: 'aria' },
        { selector: '[aria-label*="Inställningar"]', type: 'aria' }
    ],
    'nav.home': [
        { selector: '[data-nav="home"]', type: 'text' }
    ],
    'nav.games': [
        { selector: '[data-nav="games"]', type: 'text' },
        { selector: '#gamesBtn', type: 'aria' }
    ],
    'nav.learn': [
        { selector: '[data-nav="learn"]', type: 'text' },
        { selector: '#learnBtn', type: 'aria' }
    ],
    'search.placeholder': [
        { selector: '#searchInput', type: 'placeholder' }
    ]
};

/**
 * Apply translations to page based on current language
 */
export function applyPageTranslations(): void {
    const lang = LanguageManager.getLanguage();

    // Update page title
    updatePageTitle(lang);

    // Apply translations to elements with data-i18n
    LanguageManager.updateTranslations();

    // Update search placeholder
    updateSearchPlaceholder(lang);

    // Update navigation labels
    updateNavLabels(lang);

    // Update toast messages dynamically
    setupTranslatedToasts();
}

/**
 * Update page title based on language
 */
function updatePageTitle(lang: string): void {
    const currentPath = window.location.pathname;
    const titles: Record<string, { sv: string; ar: string }> = {
        '/index.html': { sv: 'Svensk-Arabiskt Lexikon | SnabbaLexin', ar: 'القاموس السويدي العربي | سنابا لكسين' },
        '/settings.html': { sv: 'Inställningar - SnabbaLexin', ar: 'الإعدادات - سنابا لكسين' },
        '/learn.html': { sv: 'Lär dig - SnabbaLexin', ar: 'تعلم - سنابا لكسين' },
        '/games/games.html': { sv: 'Spel - SnabbaLexin', ar: 'الألعاب - سنابا لكسين' },
        '/': { sv: 'Svensk-Arabiskt Lexikon | SnabbaLexin', ar: 'القاموس السويدي العربي | سنابا لكسين' }
    };

    const pathKey = Object.keys(titles).find(key => currentPath.endsWith(key)) || '/';
    const titleData = titles[pathKey] || titles['/'];

    if (lang === 'sv') {
        document.title = titleData.sv;
    } else if (lang === 'ar') {
        document.title = titleData.ar;
    } else {
        document.title = `${titleData.sv} - ${titleData.ar}`;
    }
}

/**
 * Update search input placeholder
 */
function updateSearchPlaceholder(lang: string): void {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
        const placeholders = {
            sv: 'Sök ord...',
            ar: 'ابحث عن كلمة...',
            both: 'Sök / بحث...'
        };
        searchInput.placeholder = placeholders[lang as keyof typeof placeholders] || placeholders.both;
    }
}

/**
 * Update bottom navigation labels
 */
function updateNavLabels(lang: string): void {
    const navLabels: Record<string, { el: string | null; sv: string; ar: string }> = {
        home: { el: '.nav-link[href*="index"] .nav-text', sv: 'Hem', ar: 'الرئيسية' },
        games: { el: '.nav-link[href*="games"] .nav-text', sv: 'Spel', ar: 'ألعاب' },
        learn: { el: '.nav-link[href*="learn"] .nav-text', sv: 'Lär dig', ar: 'تعلم' },
        settings: { el: '.nav-link[href*="settings"] .nav-text', sv: 'Mer', ar: 'المزيد' }
    };

    Object.values(navLabels).forEach(item => {
        if (item.el) {
            const el = document.querySelector(item.el);
            if (el) {
                if (lang === 'sv') el.textContent = item.sv;
                else if (lang === 'ar') el.textContent = item.ar;
                else el.textContent = `${item.sv}`;
            }
        }
    });
}

/**
 * Translated toast helper
 */
export function showTranslatedToast(key: string, fallback?: string): void {
    const message = t(key) || fallback || key;
    (window as any).showToast?.(message);
}

/**
 * Setup translated toast system
 */
function setupTranslatedToasts(): void {
    // Override showToast to use translations when key is provided
    const originalShowToast = (window as any).showToast;
    if (originalShowToast) {
        (window as any).showToastTranslated = (key: string, type?: string) => {
            const message = t(key);
            originalShowToast(message, { type: type || 'success' });
        };
    }
}

/**
 * Get translated text for dynamic content
 */
export function getTranslatedText(svText: string, arText: string): string {
    const lang = LanguageManager.getLanguage();
    if (lang === 'sv') return svText;
    if (lang === 'ar') return arText;
    return `${svText} / ${arText}`;
}

// Auto-apply on DOM ready
if (typeof document !== 'undefined') {
    const init = () => {
        applyPageTranslations();

        // Listen for language changes
        LanguageManager.onLanguageChange(() => {
            applyPageTranslations();
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

// Global exports
if (typeof window !== 'undefined') {
    (window as any).applyPageTranslations = applyPageTranslations;
    (window as any).showTranslatedToast = showTranslatedToast;
    (window as any).getTranslatedText = getTranslatedText;
}

export default { applyPageTranslations, showTranslatedToast, getTranslatedText };
