/**
 * Centralized constants and configuration
 */

// Environment and Configuration
export const ENV = {
    isDevelopment: window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.includes('dev'),
    isProduction: !window.location.hostname.includes('localhost') && 
                   !window.location.hostname.includes('127.0.0.1') &&
                   !window.location.hostname.includes('dev')
};

// Application Configuration
export const APP_CONFIG = {
    name: 'SnabbaLexin',
    version: '3.0.1',
    author: 'M760622',
    repository: 'https://github.com/m760622/snabbaLexin-web'
};

// Performance Constants
export const PERFORMANCE = {
    batchSize: 20,
    searchDebounceMs: 300,
    throttleMs: 100,
    scrollThreshold: 300,
    maxRetries: 5,
    animationDuration: 500,
    maxLogEntries: 1000,
    cacheSize: 100,
    virtualScrollThreshold: 1000
};

// Game Configuration
export const GAME_CONFIG = {
    coins: {
        wordFound: 5,
        bonusWord: 3,
        levelComplete: 20,
        hintCost: 10,
        streakBonus: 2
    },
    timing: {
        levelCountdown: 5,
        comboTimeoutMs: 2500,
        celebrationDuration: 1200,
        shakeDuration: 500,
        vibrateShort: 50,
        vibrateLong: 200
    },
    attempts: {
        randomWordAttempts: 500,
        shuffleAttempts: 10,
        hitRadius: 50
    },
    grid: {
        wheelSize: 286,
        letterSize: 48,
        letterHalf: 24,
        wheelRadius: 109,
        containerSize: 286
    }
};

// UI Configuration
export const UI_CONFIG = {
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    sizes: {
        maxTextLength: 50,
        maxLines: 2,
        minFontSize: 12,
        maxFontSize: 24,
        iconSize: 20
    },
    animations: {
        quick: 150,
        normal: 300,
        slow: 500,
        pageTransition: 400
    }
};

// Storage Keys
export const STORAGE_KEYS = {
    theme: 'theme',
    mobileView: 'mobileView',
    favorites: 'favorites',
    searchHistory: 'searchHistory',
    lastVisitDate: 'lastVisitDate',
    dailyStreak: 'dailyStreak',
    wcProgress: 'wcProgress',
    dailyGoal: 'dailyGoal',
    ttsVoicePreference: 'ttsVoicePreference',
    textSize: 'textSize',
    lastSearch: 'snabbaLexin_lastSearch'
};

// Color Palette
export const COLORS = {
    primary: {
        red: '#dc2626',
        blue: '#3b82f6',
        green: '#22c55e',
        yellow: '#f59e0b',
        purple: '#8b5cf6'
    },
    semantic: {
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    },
    grammar: {
        en: '#22c55e',
        ett: '#3b82f6',
        verb: '#dc2626',
        adjective: '#f59e0b',
        adverb: '#0ea5e9',
        preposition: '#8b5cf6',
        conjunction: '#ec4899',
        pronoun: '#06b6d4'
    }
};

// Message Templates
export const MESSAGES = {
    theme: {
        dark: '🌙 الوضع الليلي / Mörkt läge',
        light: '☀️ الوضع النهاري / Ljust läge'
    },
    mobile: {
        enabled: '📱 الوضع المحمول / Mobil läge',
        disabled: '🖥️ الوضع المكتبي / Desktop läge'
    },
    common: {
        copied: '📋 Kopierat / تم النسخ',
        saved: '💾 Sparat / تم الحفظ',
        deleted: '🗑️ Borttagen / تم الحذف',
        loading: '⏳ Laddar... / جاري التحميل...',
        error: '❌ Fel / خطأ',
        success: '✅ Klart / تم بنجاح'
    }
};

// Validation Patterns
export const PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^https?:\/\/.+/,
    arabic: /[\u0600-\u06FF]/,
    swedish: /[åäöÅÄÖ]/,
    word: /^[a-zA-ZåäöÅÄÖ\-]+$/,
    number: /^\d+$/,
    phoneNumber: /^[\d\s\-\+\(\)]+$/
};

// Animation Configuration
export const ANIMATIONS = {
    particles: {
        count: 15,
        minOpacity: 0.3,
        maxOpacity: 0.7,
        minDelay: 0,
        maxDelay: 20000
    },
    celebration: {
        starCount: 12,
        minDistance: 100,
        maxDistance: 200,
        duration: 1200
    },
    confetti: {
        count: 50,
        spread: 360,
        gravity: 0.5,
        drift: 0
    }
};

// Accessibility Configuration
export const A11Y_CONFIG = {
    skipLinks: [
        { href: '#main-content', text: 'Skip to main content' },
        { href: '#search', text: 'Skip to search' }
    ],
    liveRegions: {
        status: 'status-region',
        alerts: 'alert-region',
        progress: 'progress-region'
    },
    announcements: {
        searchComplete: 'Search complete, found {count} results',
        levelComplete: 'Level {level} complete! Score: {score}',
        error: 'Error: {message}',
        loading: 'Loading {item}...'
    }
};

// Error Messages
export const ERROR_MESSAGES = {
    network: 'Network connection failed. Please check your internet connection.',
    storage: 'Storage quota exceeded. Please clear some data.',
    permission: 'Permission denied. Please check your browser settings.',
    notFound: 'The requested resource was not found.',
    timeout: 'The request timed out. Please try again.',
    generic: 'An unexpected error occurred. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    saved: 'Data saved successfully!',
    updated: 'Data updated successfully!',
    deleted: 'Data deleted successfully!',
    loaded: 'Data loaded successfully!',
    completed: 'Task completed successfully!'
};

// Export all constants as a single object for easy importing
export const CONSTANTS = {
    ENV,
    APP_CONFIG,
    PERFORMANCE,
    GAME_CONFIG,
    UI_CONFIG,
    STORAGE_KEYS,
    COLORS,
    MESSAGES,
    PATTERNS,
    ANIMATIONS,
    A11Y_CONFIG,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};

// Type definitions for better TypeScript support
export type EnvironmentType = typeof ENV;
export type AppConfigType = typeof APP_CONFIG;
export type PerformanceConfigType = typeof PERFORMANCE;
export type GameConfigType = typeof GAME_CONFIG;
export type UIConfigType = typeof UI_CONFIG;
export type ColorsType = typeof COLORS;
export type MessagesType = typeof MESSAGES;