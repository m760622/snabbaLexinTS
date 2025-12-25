import { AppConfig } from './config';
// import { DictionaryEntry } from './types'; // Placeholder for future use

/**
 * SnabbaLexin - IndexedDB Database Module
 * Provides fast local storage for dictionary data with caching
 */

export const DictionaryDB = {
    DB_NAME: AppConfig.DB_NAME,
    DB_VERSION: AppConfig.DB_VERSION,
    STORE_NAME: 'words',
    META_STORE: 'meta',
    NOTES_STORE: 'notes',

    db: null as IDBDatabase | null,
    isReady: false,

    /**
     * Initialize the database
     */
    async init(): Promise<boolean> {
        if (this.db) return true;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = (event: any) => {
                console.error('[DB] Error opening database:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event: any) => {
                this.db = event.target.result;
                this.isReady = true;
                console.log('[DB] Database opened successfully');
                resolve(true);
            };

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;

                // Create words store if not exists
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    const wordStore = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
                    wordStore.createIndex('swedish', 'swe', { unique: false });
                    wordStore.createIndex('arabic', 'arb', { unique: false });
                    wordStore.createIndex('type', 'type', { unique: false });
                    console.log('[DB] Words store created');
                }

                // Create meta store for version tracking
                if (!db.objectStoreNames.contains(this.META_STORE)) {
                    db.createObjectStore(this.META_STORE, { keyPath: 'key' });
                    console.log('[DB] Meta store created');
                }

                // Create notes store for personal markings
                if (!db.objectStoreNames.contains(this.NOTES_STORE)) {
                    db.createObjectStore(this.NOTES_STORE, { keyPath: 'id' });
                    console.log('[DB] Notes store created');
                }
            };
        });
    },

    /**
     * Get cached data version
     */
    async getDataVersion(): Promise<string | null> {
        if (!this.db) await this.init();
        if (!this.db) return null;

        return new Promise((resolve) => {
            try {
                const tx = this.db!.transaction([this.META_STORE], 'readonly');
                const store = tx.objectStore(this.META_STORE);
                const request = store.get('dataVersion');

                request.onsuccess = () => {
                    resolve(request.result?.value || null);
                };
                request.onerror = () => resolve(null);
            } catch (e) {
                resolve(null);
            }
        });
    },

    /**
     * Set data version
     */
    async setDataVersion(version: string): Promise<boolean> {
        if (!this.db) await this.init();
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const tx = this.db!.transaction([this.META_STORE], 'readwrite');
            const store = tx.objectStore(this.META_STORE);
            store.put({ key: 'dataVersion', value: version });

            tx.oncomplete = () => resolve(true);
            tx.onerror = (e) => reject(e);
        });
    },

    /**
     * Get word count in database
     */
    async getWordCount(): Promise<number> {
        if (!this.db) await this.init();
        if (!this.db) return 0;

        return new Promise((resolve) => {
            try {
                const tx = this.db!.transaction([this.STORE_NAME], 'readonly');
                const store = tx.objectStore(this.STORE_NAME);
                const request = store.count();

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(0);
            } catch (e) {
                resolve(0);
            }
        });
    },

    /**
     * Save words to IndexedDB (bulk save with progress)
     */
    async saveWords(words: any[][], onProgress: ((p: number) => void) | null = null): Promise<boolean> {
        if (!this.db) await this.init();

        const BATCH_SIZE = 1000;
        const totalBatches = Math.ceil(words.length / BATCH_SIZE);

        console.log(`[DB] Saving ${words.length} words in ${totalBatches} batches...`);

        for (let batch = 0; batch < totalBatches; batch++) {
            const start = batch * BATCH_SIZE;
            const end = Math.min(start + BATCH_SIZE, words.length);
            const batchWords = words.slice(start, end);

            await this._saveBatch(batchWords);

            if (onProgress) {
                const progress = Math.round(((batch + 1) / totalBatches) * 100);
                onProgress(progress);
            }
        }

        console.log('[DB] All words saved successfully');
        return true;
    },

    /**
     * Save a batch of words
     * @private
     */
    async _saveBatch(words: any[][]): Promise<boolean> {
        if (!this.db) return false;
        return new Promise((resolve, reject) => {
            const tx = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);

            words.forEach(word => {
                const wordObj = {
                    id: word[AppConfig.COLUMNS.ID],
                    type: word[AppConfig.COLUMNS.TYPE],
                    swe: word[AppConfig.COLUMNS.SWEDISH],
                    arb: word[AppConfig.COLUMNS.ARABIC],
                    arbExt: word[AppConfig.COLUMNS.ARABIC_EXT],
                    sweDef: word[AppConfig.COLUMNS.DEFINITION],
                    forms: word[AppConfig.COLUMNS.FORMS],
                    sweEx: word[AppConfig.COLUMNS.EXAMPLE_SWE],
                    arbEx: word[AppConfig.COLUMNS.EXAMPLE_ARB],
                    idiomSwe: word[AppConfig.COLUMNS.IDIOM_SWE],
                    idiomArb: word[AppConfig.COLUMNS.IDIOM_ARB],
                    raw: word
                };
                store.put(wordObj);
            });

            tx.oncomplete = () => resolve(true);
            tx.onerror = (e) => reject(e);
        });
    },

    /**
     * Get all words as original array format
     */
    async getAllWords(onProgress: ((p: number) => void) | null = null): Promise<any[][]> {
        if (!this.db) await this.init();
        if (!this.db) return [];

        return new Promise((resolve, reject) => {
            const tx = this.db!.transaction([this.STORE_NAME], 'readonly');
            const store = tx.objectStore(this.STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const words = request.result.map((w: any) => w.raw);
                if (onProgress) onProgress(100);
                console.log(`[DB] Retrieved ${words.length} words from cache`);
                resolve(words);
            };

            request.onerror = (e) => {
                console.error('[DB] Error getting words:', e);
                reject(e);
            };
        });
    },

    /**
     * Check if database has cached data
     */
    async hasCachedData(): Promise<boolean> {
        const count = await this.getWordCount();
        return count > 0;
    },

    /**
     * Clear all cached data
     */
    async clearCache(): Promise<boolean> {
        if (!this.db) await this.init();
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const tx = this.db!.transaction([this.STORE_NAME, this.META_STORE], 'readwrite');
            tx.objectStore(this.STORE_NAME).clear();
            tx.objectStore(this.META_STORE).clear();

            tx.oncomplete = () => {
                console.log('[DB] Cache cleared');
                resolve(true);
            };
            tx.onerror = (e) => reject(e);
        });
    },

    /**
     * Get a single word by ID
     */
    async getWordById(id: string): Promise<any[] | null> {
        if (!this.db) await this.init();
        if (!this.db) return null;

        return new Promise((resolve) => {
            try {
                const tx = this.db!.transaction([this.STORE_NAME], 'readonly');
                const store = tx.objectStore(this.STORE_NAME);
                const request = store.get(id);

                request.onsuccess = () => {
                    if (request.result && request.result.raw) {
                        resolve(request.result.raw);
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => resolve(null);
            } catch (e) {
                console.error('[DB] getWordById error:', e);
                resolve(null);
            }
        });
    },

    /**
     * Save a single word to IndexedDB
     */
    async saveWord(word: any): Promise<boolean> {
        if (!this.db) await this.init();
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const tx = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);
            store.put(word);

            tx.oncomplete = () => resolve(true);
            tx.onerror = (e) => reject(e);
        });
    },

    /**
     * Delete a word by ID
     */
    async deleteWord(id: string): Promise<boolean> {
        if (!this.db) await this.init();
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const tx = this.db!.transaction([this.STORE_NAME], 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);
            store.delete(id);

            tx.oncomplete = () => resolve(true);
            tx.onerror = (e) => reject(e);
        });
    },

    /**
     * Get personal note for a word
     */
    async getNote(id: string): Promise<string | null> {
        if (!this.db) await this.init();
        if (!this.db) return null;

        return new Promise((resolve) => {
            try {
                const tx = this.db!.transaction([this.NOTES_STORE], 'readonly');
                const store = tx.objectStore(this.NOTES_STORE);
                const request = store.get(id);

                request.onsuccess = () => {
                    resolve(request.result?.text || null);
                };
                request.onerror = () => resolve(null);
            } catch (e) {
                resolve(null);
            }
        });
    },

    /**
     * Save personal note for a word
     */
    async saveNote(id: string, text: string): Promise<boolean> {
        if (!this.db) await this.init();
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const tx = this.db!.transaction([this.NOTES_STORE], 'readwrite');
            const store = tx.objectStore(this.NOTES_STORE);
            store.put({ id, text, updatedAt: Date.now() });

            tx.oncomplete = () => resolve(true);
            tx.onerror = (e) => reject(e);
        });
    }
};

/**
 * Progressive data loader with caching
 */
export const DataLoader = {
    async loadDictionary(onProgress: ((p: number) => void) | null = null, onStatusChange: ((s: string) => void) | null = null): Promise<any[][]> {
        try {
            await DictionaryDB.init();

            const cachedVersion = await DictionaryDB.getDataVersion();
            const hasCached = await DictionaryDB.hasCachedData();

            if (hasCached && cachedVersion === AppConfig.DATA_VERSION) {
                if (onStatusChange) onStatusChange('Laddar från cache... / جاري التحميل من الذاكرة...');
                console.log('[DataLoader] Using cached data (version:', cachedVersion, ')');
                return await DictionaryDB.getAllWords(onProgress);
            }

            if (onStatusChange) onStatusChange('Laddar ordbok... / جاري تحميل القاموس...');
            console.log('[DataLoader] Loading fresh data from data.js');

            const dictionaryData = (window as any).dictionaryData;
            if (typeof dictionaryData === 'undefined' || !dictionaryData.length) {
                throw new Error('dictionaryData not loaded from data.js');
            }

            if (onStatusChange) onStatusChange('Sparar i cache... / جاري الحفظ...');
            await DictionaryDB.saveWords(dictionaryData, onProgress);
            await DictionaryDB.setDataVersion(AppConfig.DATA_VERSION);

            console.log('[DataLoader] Data cached successfully');
            return dictionaryData;

        } catch (error) {
            console.error('[DataLoader] Error:', error);
            const dictionaryData = (window as any).dictionaryData;
            if (typeof dictionaryData !== 'undefined') {
                return dictionaryData;
            }
            throw error;
        }
    },

    async refreshCache(onProgress: ((p: number) => void) | null = null) {
        await DictionaryDB.clearCache();
        return this.loadDictionary(onProgress);
    }
};

// Global exports for legacy support
if (typeof window !== 'undefined') {
    (window as any).DictionaryDB = DictionaryDB;
    (window as any).DataLoader = DataLoader;
    (window as any).DATA_VERSION = AppConfig.DATA_VERSION;
}
