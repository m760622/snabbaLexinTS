/**
 * Memoization utilities for performance optimization
 */

export interface MemoizedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>;
    clear(): void;
    cache: Map<string, ReturnType<T>>;
}

/**
 * Simple memoization function with size limit
 */
export function memoize<T extends (...args: any[]) => any>(
    fn: T,
    maxSize: number = 100
): MemoizedFunction<T> {
    const cache = new Map<string, ReturnType<T>>();
    
    const memoized = (...args: Parameters<T>): ReturnType<T> => {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        
        const result = fn(...args);
        
        // Limit cache size
        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            if (firstKey) cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
    
    memoized.clear = () => cache.clear();
    memoized.cache = cache;
    
    return memoized;
}

/**
 * Weak memoization for object arguments
 */
export function weakMemoize<T extends (...args: any[]) => any>(
    fn: T
): MemoizedFunction<T> {
    const cache = new WeakMap<object, ReturnType<T>>();
    
    const memoized = (...args: Parameters<T>): ReturnType<T> => {
        const key = args[0] as object;
        
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
    
    memoized.clear = () => {
        // WeakMap clears automatically when objects are garbage collected
    };
    memoized.cache = cache as any;
    
    return memoized;
}

/**
 * Memoize async functions
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    maxSize: number = 100
): MemoizedFunction<T> & { cache: Map<string, any> } {
    const cache = new Map<string, any>();
    const pending = new Map<string, Promise<any>>();
    
    const memoized = async (...args: Parameters<T>): Promise<any> => {
        const key = JSON.stringify(args);
        
        // Return existing cached result
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        
        // Return existing pending promise
        if (pending.has(key)) {
            return pending.get(key)!;
        }
        
        // Create new promise
        const promise = fn(...args).then(result => {
            pending.delete(key);
            
            // Limit cache size
            if (cache.size >= maxSize) {
                const firstKey = cache.keys().next().value;
                if (firstKey) cache.delete(firstKey);
            }
            
            cache.set(key, result);
            return result;
        }).catch(error => {
            pending.delete(key);
            throw error;
        });
        
        pending.set(key, promise);
        return promise;
    };
    
    memoized.clear = () => {
        cache.clear();
        pending.clear();
    };
    memoized.cache = cache;
    
    return memoized as any;
}

/**
 * Debounced memoization
 */
export function debounceMemoize<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 300,
    maxSize: number = 100
): MemoizedFunction<T> {
    const cache = new Map<string, ReturnType<T>>();
    const timeouts = new Map<string, number>();
    
    const memoized = (...args: Parameters<T>): ReturnType<T> => {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        
        // Clear existing timeout
        if (timeouts.has(key)) {
            clearTimeout(timeouts.get(key)!);
        }
        
        return new Promise<ReturnType<T>>((resolve) => {
            const timeout = setTimeout(() => {
                timeouts.delete(key);
                const result = fn(...args);
                
        // Limit cache size
        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            if (firstKey) cache.delete(firstKey);
        }
                
                cache.set(key, result);
                resolve(result);
            }, delay);
            
            timeouts.set(key, timeout as any);
        }) as ReturnType<T>;
    };
    
    memoized.clear = () => {
        cache.clear();
        timeouts.forEach(timeout => clearTimeout(timeout));
        timeouts.clear();
    };
    memoized.cache = cache;
    
    return memoized;
}

/**
 * Performance monitor for memoized functions
 */
export function createMemoizationMonitor() {
    const stats = {
        hits: 0,
        misses: 0,
        operations: new Map<string, { hits: number; misses: number; totalTime: number }>()
    };
    
    return {
        recordHit(operation: string, time: number = 0) {
            stats.hits++;
            const op = stats.operations.get(operation) || { hits: 0, misses: 0, totalTime: 0 };
            op.hits++;
            op.totalTime += time;
            stats.operations.set(operation, op);
        },
        
        recordMiss(operation: string, time: number = 0) {
            stats.misses++;
            const op = stats.operations.get(operation) || { hits: 0, misses: 0, totalTime: 0 };
            op.misses++;
            op.totalTime += time;
            stats.operations.set(operation, op);
        },
        
        getStats() {
            return {
                ...stats,
                hitRate: stats.hits / (stats.hits + stats.misses) * 100,
                operations: Object.fromEntries(stats.operations)
            };
        },
        
        reset() {
            stats.hits = 0;
            stats.misses = 0;
            stats.operations.clear();
        }
    };
}

// Global memoization monitor
export const memoMonitor = createMemoizationMonitor();

/**
 * Create a memoized function with monitoring
 */
export function memoizeWithStats<T extends (...args: any[]) => any>(
    fn: T,
    operationName: string,
    maxSize: number = 100
): MemoizedFunction<T> {
    const memoized = memoize(fn, maxSize);
    
    const wrapper = (...args: Parameters<T>): ReturnType<T> => {
        const startTime = performance.now();
        const key = JSON.stringify(args);
        
        if (memoized.cache.has(key)) {
            memoMonitor.recordHit(operationName, performance.now() - startTime);
        } else {
            memoMonitor.recordMiss(operationName);
        }
        
        return memoized(...args);
    };
    
    wrapper.clear = memoized.clear;
    wrapper.cache = memoized.cache;
    
    return wrapper;
}

// Common memoized functions for the app
export const memoizedFunctions = {
    // Memoize expensive type color calculations
    getTypeColor: memoize((_type: string, _word: string, _forms: string, _gender: string, _arabic: string) => {
        // This would be actual TypeColorSystem.detect method
        // Return null here to be replaced with actual implementation
        return null;
    }, 500),
    
    // Memoize Arabic normalization
    normalizeArabic: memoize((text: string) => {
        return text.normalize('NFD')
                   .replace(/[\u064B-\u0652]/g, '') // Remove diacritics
                   .replace(/أ/g, 'ا')
                   .replace(/إ/g, 'ا')
                   .replace(/آ/g, 'ا');
    }, 1000),
    
    // Memoize text size calculations
    calculateTextSize: memoize((text: string, fontSize: number, maxWidth: number) => {
        // Create a temporary element to measure text
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.visibility = 'hidden';
        element.style.fontSize = `${fontSize}px`;
        element.style.maxWidth = `${maxWidth}px`;
        element.style.whiteSpace = 'pre-wrap';
        element.textContent = text;
        
        document.body.appendChild(element);
        const { width, height } = element.getBoundingClientRect();
        document.body.removeChild(element);
        
        return { width, height };
    }, 500),
    
    // Memoize search result filtering
    filterResults: memoize((results: any[], _query: string, _filters: any) => {
        // This would contain the actual filtering logic
        return results;
    }, 100)
};