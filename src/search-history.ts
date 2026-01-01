
import { AppConfig } from './config';

export class SearchHistoryManager {
    private static readonly MAX_ITEMS = 10;
    private static readonly STORAGE_KEY = AppConfig.STORAGE_KEYS.SEARCH_HISTORY || 'searchHistory';

    /**
     * Add a query to history
     * Moves to top if already exists. Limits to MAX_ITEMS.
     */
    static add(query: string): void {
        const trimmed = query.trim();
        if (!trimmed) return;

        const history = this.get();

        // Remove existing to avoid duplicates (and move to top)
        const filtered = history.filter(q => q.toLowerCase() !== trimmed.toLowerCase());

        // Add to front
        filtered.unshift(trimmed);

        // Limit
        const final = filtered.slice(0, this.MAX_ITEMS);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(final));
    }

    /**
     * Get recent searches
     */
    static get(): string[] {
        try {
            const json = localStorage.getItem(this.STORAGE_KEY);
            return json ? JSON.parse(json) : [];
        } catch (e) {
            console.error('Failed to load search history', e);
            return [];
        }
    }

    /**
     * Clear history
     */
    static clear(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
