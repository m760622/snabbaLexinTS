/**
 * Performance Utilities
 * Optimization helpers for better app performance
 */

/**
 * Debounce function - delays execution until after wait ms have elapsed
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function - limits execution to once per wait ms
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return function (...args: Parameters<T>) {
        const now = Date.now();
        if (now - lastCall >= wait) {
            lastCall = now;
            func(...args);
        }
    };
}

/**
 * Lazy load an image
 */
export function lazyLoadImage(img: HTMLImageElement): Promise<void> {
    return new Promise((resolve, reject) => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => resolve();
            img.onerror = reject;
        } else {
            resolve();
        }
    });
}

/**
 * Initialize lazy loading for images with data-src
 */
export function initLazyImages(): void {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    lazyLoadImage(img);
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    } else {
        // Fallback: load all images immediately
        document.querySelectorAll<HTMLImageElement>('img[data-src]').forEach(lazyLoadImage);
    }
}

/**
 * Prefetch a page for faster navigation
 */
export function prefetchPage(url: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
}

/**
 * Cache frequently used data in memory
 */
class MemoryCache<T> {
    private cache = new Map<string, { data: T; expiry: number }>();
    private defaultTTL: number;

    constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
        this.defaultTTL = defaultTTL;
    }

    set(key: string, data: T, ttl = this.defaultTTL): void {
        this.cache.set(key, {
            data,
            expiry: Date.now() + ttl
        });
    }

    get(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }

    clear(): void {
        this.cache.clear();
    }
}

export const memoryCache = new MemoryCache();

/**
 * Request idle callback polyfill
 */
export function requestIdleCallback(callback: () => void): void {
    if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(callback);
    } else {
        setTimeout(callback, 1);
    }
}

/**
 * Defer non-critical work
 */
export function deferWork(callback: () => void): void {
    requestIdleCallback(() => {
        requestAnimationFrame(callback);
    });
}

/**
 * Measure performance of a function
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
}

// Export for global use
(window as any).debounce = debounce;
(window as any).throttle = throttle;
(window as any).prefetchPage = prefetchPage;
