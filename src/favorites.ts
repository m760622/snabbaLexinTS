import { showToast } from './utils';

/**
 * FavoritesManager - Centralized favorites management
 * Singleton pattern to ensure consistent state across the app
 */
class FavoritesManagerClass {
    private _favorites = new Set<string>();
    private _listeners: Array<(id: string, isFav: boolean) => void> = [];
    private readonly STORAGE_KEY = 'favorites';

    constructor() {
        this.load();
    }

    private load(): void {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const arr = JSON.parse(saved) as string[];
                this._favorites = new Set(arr);
                console.log(`[FavoritesManager] Loaded ${this._favorites.size} favorites`);
            }
        } catch (e) {
            console.error('[FavoritesManager] Failed to load favorites:', e);
        }
    }

    private save(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this._favorites)));
        } catch (e) {
            console.error('[FavoritesManager] Failed to save favorites:', e);
        }
    }

    public has(id: string): boolean {
        return this._favorites.has(id);
    }

    public add(id: string): void {
        if (!this._favorites.has(id)) {
            this._favorites.add(id);
            this.save();
            this.notify(id, true);
            showToast('Sparad i favoriter / تم الحفظ في المفضلة ⭐');
        }
    }

    public remove(id: string): void {
        if (this._favorites.has(id)) {
            this._favorites.delete(id);
            this.save();
            this.notify(id, false);
            showToast('Borttagen från favoriter / تم الحذف من المفضلة 🗑️');
        }
    }

    public toggle(id: string): boolean {
        if (this.has(id)) {
            this.remove(id);
            return false;
        } else {
            this.add(id);
            return true;
        }
    }

    public getAll(): string[] {
        return Array.from(this._favorites);
    }

    public count(): number {
        return this._favorites.size;
    }

    public filter(ids: string[]): string[] {
        return ids.filter(id => this._favorites.has(id));
    }

    /**
     * Subscribe to favorite changes
     */
    public onChange(callback: (id: string, isFav: boolean) => void): () => void {
        this._listeners.push(callback);
        return () => {
            this._listeners = this._listeners.filter(cb => cb !== callback);
        };
    }

    private notify(id: string, isFav: boolean): void {
        this._listeners.forEach(cb => cb(id, isFav));
    }

    /**
     * Update a button's visual state
     */
    public updateButtonIcon(btn: HTMLElement, isFav: boolean): void {
        const svg = isFav 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        btn.innerHTML = svg;
        btn.classList.toggle('active', isFav);
    }
}

// Singleton export
export const FavoritesManager = new FavoritesManagerClass();

// Global export for legacy support
if (typeof window !== 'undefined') {
    (window as any).FavoritesManager = FavoritesManager;
}
