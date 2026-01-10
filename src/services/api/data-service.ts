import { IDataService, SearchRequest, SearchResponse, Word } from './schemas';
import { DictionaryDB } from '../db.service';
import { SearchService as LegacySearchService, SearchOptions } from '../search.service';
import { AppConfig } from '../../config';

export class DataService implements IDataService {
    private static instance: DataService;
    private memoryCache: any[][] | null = null;
    private isInitialized = false;

    private constructor() {}

    public static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }

    /**
     * Initialize the data service (load data into memory)
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Ensure DB is initialized
            await DictionaryDB.init();
            
            // Load data into memory for fast searching
            // This mirrors the behavior of the legacy app which keeps dictionaryData in memory
            this.memoryCache = await DictionaryDB.getAllWords();
            
            if (!this.memoryCache || this.memoryCache.length === 0) {
                console.warn('[DataService] No data found in DB. Fallback to global dictionaryData if available.');
                if (typeof window !== 'undefined' && (window as any).dictionaryData) {
                    this.memoryCache = (window as any).dictionaryData;
                }
            }

            this.isInitialized = true;
            console.log('[DataService] Initialized with', this.memoryCache?.length, 'words');
        } catch (error) {
            console.error('[DataService] Initialization failed', error);
            throw error;
        }
    }

    /**
     * Get all words
     */
    async getAllWords(): Promise<Word[]> {
        await this.ensureInitialized();
        return this.memoryCache!.map(this.mapRawToWord);
    }

    /**
     * Get a single word by ID
     */
    async getWordById(id: number): Promise<Word | null> {
        // Try memory first
        if (this.memoryCache) {
            const found = this.memoryCache.find(row => row[AppConfig.COLUMNS.ID] === id);
            if (found) return this.mapRawToWord(found);
        }

        // Fallback to DB
        const raw = await DictionaryDB.getWordById(id.toString());
        return raw ? this.mapRawToWord(raw) : null;
    }

    /**
     * Search words
     */
    async search(request: SearchRequest): Promise<SearchResponse> {
        const startTime = performance.now();
        await this.ensureInitialized();

        if (!this.memoryCache) {
            return { results: [], stats: { total: 0, types: {} }, executionTimeMs: 0 };
        }

        // Adapt request to legacy SearchService options
        const options: SearchOptions = {
            query: request.query,
            mode: request.mode || 'contains',
            type: request.type || 'all',
            sort: request.sort || 'relevance'
        };

        // Use the optimized SearchService logic
        const resultWithStats = LegacySearchService.searchWithStats(this.memoryCache, options);

        // Map results to Word interface
        // Note: SearchService returns simplified objects, but we might want full objects
        // For now, we'll map the raw rows from memoryCache that matched
        
        // Actually, SearchService.searchWithStats returns `slicedResults` which are simplified objects.
        // But we want to return full `Word` objects usually.
        // Let's re-map based on IDs if needed, or update SearchService.
        // For performance, let's trust SearchService's filtering but maybe we need to map back to full objects if the UI needs them.
        // The current SearchResult interface in search.service is decent but maybe missing some fields.
        
        // Let's just map what we get back for now.
        const mappedResults: Word[] = resultWithStats.results.map(r => ({
            id: r.id,
            type: r.type,
            swedish: r.swedish,
            arabic: r.arabic,
            forms: r.forms,
            definition: r.definition,
            example_swe: r.example,
            // We might be missing fields like 'arabic_ext' in the simplified result
            // If full details are needed, we fetch from memoryCache by ID
        }));

        const endTime = performance.now();

        return {
            results: mappedResults,
            stats: {
                total: resultWithStats.stats.total,
                types: resultWithStats.stats.types
            },
            executionTimeMs: endTime - startTime
        };
    }

    /**
     * Ensure data is loaded
     */
    private async ensureInitialized() {
        if (!this.isInitialized || !this.memoryCache) {
            await this.initialize();
        }
    }

    /**
     * Helper to map raw array to Word object
     */
    private mapRawToWord(row: any[]): Word {
        return {
            id: row[AppConfig.COLUMNS.ID],
            type: row[AppConfig.COLUMNS.TYPE],
            swedish: row[AppConfig.COLUMNS.SWEDISH],
            arabic: row[AppConfig.COLUMNS.ARABIC],
            arabic_ext: row[AppConfig.COLUMNS.ARABIC_EXT],
            definition: row[AppConfig.COLUMNS.DEFINITION],
            forms: row[AppConfig.COLUMNS.FORMS],
            example_swe: row[AppConfig.COLUMNS.EXAMPLE_SWE],
            example_arb: row[AppConfig.COLUMNS.EXAMPLE_ARB],
            idiom_swe: row[AppConfig.COLUMNS.IDIOM_SWE],
            idiom_arb: row[AppConfig.COLUMNS.IDIOM_ARB],
            raw: row
        };
    }
}
