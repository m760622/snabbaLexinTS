/**
 * Security utilities for safe HTML manipulation
 */

/**
 * Safely sets HTML content, sanitizing dangerous content
 */
export function safeHTML(element: HTMLElement, html: string): void {
    // Basic sanitization - remove script tags and dangerous attributes
    const sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .replace(/javascript:/gi, '') // Remove javascript: protocols
        .replace(/data:/gi, ''); // Remove data: protocols
    
    element.innerHTML = sanitized;
}

/**
 * Safely sets text content (preferred when no HTML is needed)
 */
export function safeText(element: HTMLElement, text: string): void {
    element.textContent = text;
}

/**
 * Creates a safe element with attributes
 */
export function safeElement(tag: string, attributes: Record<string, string> = {}, textContent?: string): HTMLElement {
    const element = document.createElement(tag);
    
    // Set attributes safely
    Object.entries(attributes).forEach(([key, value]) => {
        // Skip dangerous attributes
        if (!key.startsWith('on') && !value.includes('javascript:') && !value.includes('data:')) {
            element.setAttribute(key, value);
        }
    });
    
    if (textContent !== undefined) {
        safeText(element, textContent);
    }
    
    return element;
}

/**
 * Debounce utility function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: number;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle utility function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}