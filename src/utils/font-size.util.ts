/**
 * Dynamic Font Sizing Utility
 * 
 * Provides functions to calculate responsive font sizes based on text length.
 * Useful for maintaining readability and layout integrity for variable-length content.
 */

// Dynamic font sizing based on text length for Swedish/Latin text
export const getSwedishFontSize = (text: string): string => {
    if (!text) return 'clamp(1.8rem, 8vw, 2.5rem)';
    const len = text.length;
    if (len <= 5) return 'clamp(1.8rem, 8vw, 2.5rem)';      // Short words - larger
    if (len <= 8) return 'clamp(1.5rem, 7vw, 2.2rem)';      // Medium words
    if (len <= 12) return 'clamp(1.3rem, 6vw, 1.8rem)';     // Longer words
    if (len <= 16) return 'clamp(1.1rem, 5vw, 1.5rem)';     // Long words
    return 'clamp(0.9rem, 4vw, 1.3rem)';                     // Very long words
};

// Dynamic font sizing for Arabic text
export const getArabicFontSize = (text: string): string => {
    if (!text) return 'clamp(1.6rem, 7vw, 2.2rem)';
    const len = text.length;
    if (len <= 5) return 'clamp(1.6rem, 7vw, 2.2rem)';      // كلمات قصيرة
    if (len <= 10) return 'clamp(1.4rem, 6vw, 1.9rem)';     // كلمات متوسطة
    if (len <= 15) return 'clamp(1.2rem, 5vw, 1.6rem)';     // كلمات طويلة
    if (len <= 25) return 'clamp(1rem, 4vw, 1.4rem)';       // جمل قصيرة
    return 'clamp(0.9rem, 3.5vw, 1.2rem)';                   // جمل طويلة
};

/**
 * Automatically detects language and applies appropriate sizing
 * @param text The text to calculate font size for
 */
export const getSmartFontSize = (text: string): string => {
    // Check if text contains Arabic characters
    const isArabic = /[\u0600-\u06FF]/.test(text);
    return isArabic ? getArabicFontSize(text) : getSwedishFontSize(text);
};
