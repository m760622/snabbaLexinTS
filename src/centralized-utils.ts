/**
 * Centralized theme and utility management
 */

export class ThemeManager {
    private static readonly THEME_KEY = 'theme';
    
    /**
     * Initialize theme system
     */
    static init(): void {
        const savedTheme = this.getSavedTheme();
        this.applyTheme(savedTheme);
        this.setupThemeToggle();
    }
    
    /**
     * Get saved theme from localStorage
     */
    static getSavedTheme(): 'light' | 'dark' {
        return (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';
    }
    
    /**
     * Apply theme to document
     */
    static applyTheme(theme: 'light' | 'dark'): void {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.documentElement.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.classList.remove('dark-mode');
        }
        
        localStorage.setItem(this.THEME_KEY, theme);
        this.updateThemeIcon(theme);
    }
    
    /**
     * Toggle between light and dark themes
     */
    static toggle(): void {
        const currentTheme = this.getSavedTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Show toast notification
        if (typeof window !== 'undefined' && (window as any).showToast) {
            const message = newTheme === 'dark' 
                ? '🌙 الوضع الليلي / Mörkt läge' 
                : '☀️ الوضع النهاري / Ljust läge';
            (window as any).showToast(message, 'success');
        }
    }
    
    /**
     * Update theme toggle icon
     */
    private static updateThemeIcon(theme: 'light' | 'dark'): void {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    /**
     * Setup theme toggle event listener
     */
    private static setupThemeToggle(): void {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggle());
        }
    }
}

/**
 * Centralized mobile view management
 */
export class MobileViewManager {
    private static readonly MOBILE_KEY = 'mobileView';
    
    /**
     * Initialize mobile view system
     */
    static init(): void {
        this.setupGlobalHandlers();
    }
    
    /**
     * Toggle mobile view
     */
    static toggle(): void {
        const isMobile = document.body.classList.toggle('mobile-view');
        localStorage.setItem(this.MOBILE_KEY, isMobile.toString());
        
        // Show toast notification
        if (typeof window !== 'undefined' && (window as any).showToast) {
            const message = isMobile 
                ? '📱 الوضع المحمول / Mobil läge' 
                : '🖥️ الوضع المكتبي / Desktop läge';
            (window as any).showToast(message, 'info');
        }
    }
    
    /**
     * Restore saved mobile view state
     */
    static restoreState(): void {
        const savedMobileView = localStorage.getItem(this.MOBILE_KEY) === 'true';
        if (savedMobileView) {
            document.body.classList.add('mobile-view');
        }
    }
    
    /**
     * Setup global handlers for mobile view
     */
    private static setupGlobalHandlers(): void {
        // Make toggleMobileView available globally
        if (typeof window !== 'undefined') {
            (window as any).toggleMobileView = () => this.toggle();
        }
        
        // Restore state on load
        this.restoreState();
    }
}

/**
 * Centralized localStorage utilities
 */
export class StorageManager {
    /**
     * Safe set item with error handling
     */
    static setItem(key: string, value: string): boolean {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn(`Failed to save to localStorage: ${key}`, error);
            return false;
        }
    }
    
    /**
     * Safe get item with error handling
     */
    static getItem(key: string, defaultValue: string = ''): string {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch (error) {
            console.warn(`Failed to read from localStorage: ${key}`, error);
            return defaultValue;
        }
    }
    
    /**
     * Safe remove item with error handling
     */
    static removeItem(key: string): boolean {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Failed to remove from localStorage: ${key}`, error);
            return false;
        }
    }
    
    /**
     * Safe get JSON item with error handling
     */
    static getJSON<T>(key: string, defaultValue: T): T {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Failed to parse JSON from localStorage: ${key}`, error);
            return defaultValue;
        }
    }
    
    /**
     * Safe set JSON item with error handling
     */
    static setJSON(key: string, value: any): boolean {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Failed to save JSON to localStorage: ${key}`, error);
            return false;
        }
    }
}

/**
 * Constants for the application
 */
export const APP_CONSTANTS = {
    BATCH_SIZE: 20,
    SEARCH_DELAY: 300,
    SCROLL_THRESHOLD: 300,
    MAX_RETRIES: 5,
    ANIMATION_DURATION: 500,
    DAILY_GOAL_DEFAULT: 10,
    COIN_REWARD: {
        WORD_FOUND: 5,
        BONUS_WORD: 3,
        LEVEL_COMPLETE: 20,
        HINT_COST: 10
    }
} as const;

/**
 * Application constants type
 */
export type AppConstants = typeof APP_CONSTANTS;