import { normalizeArabic } from './utils';
import { FavoritesManager } from './favorites';

export interface SearchResult {
    id: number;
    type: string;
    swedish: string;
    arabic: string;
    forms?: string;
    gender?: string;
}

export interface SearchOptions {
    query: string;
    mode: string; // 'all', 'start', 'end', 'exact', 'favorites'
    type: string; // 'all', 'subst', 'verb', 'juridik', etc.
    category: string; // 'all', 'food', 'work', etc.
    sort: string; // 'relevance', 'richness', 'alpha_asc', 'alpha_desc', 'last_char'
}

export class SearchService {
    /**
     * Performs a comprehensive search on the dictionary data.
     */
    static search(data: any[][], options: SearchOptions): SearchResult[] {
        const { query, mode, type, category, sort } = options;
        const normalizedQuery = normalizeArabic(query.trim().toLowerCase());
        
        // Return empty if no query and not in a "browsing" mode (like favorites or a specific category)
        // If user selects "Favorites" mode, we should show them even without query.
        const isBrowsing = mode === 'favorites' || (type !== 'all' && !query) || (category !== 'all' && !query);
        
        if (!normalizedQuery && !isBrowsing) return [];

        let results: any[][] = [];
        const MAX_RESULTS = 200; // Increased limit for browsing

        // 1. Initial Filtering (Pre-filter by broad category/type/mode if possible to reduce set)
        // For performance, we iterate once and check all conditions
        
        // Optimization: If browsing favorites, get IDs first
        let candidateData = data;
        if (mode === 'favorites') {
            const favIds = new Set(FavoritesManager.getAll());
            candidateData = data.filter(row => favIds.has(row[0].toString()));
        }

        for (const row of candidateData) {
            if (results.length >= MAX_RESULTS) break;

            // A. Type Filter
            if (type !== 'all') {
                const rawType = (row[1] || '').toLowerCase();
                let matchesType = false;

                // Grammar
                if (type === 'subst' && (rawType.includes('subst') || rawType === 'noun')) matchesType = true;
                else if (type === 'verb' && rawType.includes('verb')) matchesType = true;
                else if (type === 'adj' && rawType.includes('adj')) matchesType = true;
                else if (type === 'adv' && rawType.includes('adv')) matchesType = true;
                else if (type === 'prep' && rawType.includes('prep')) matchesType = true;
                else if (type === 'pron' && rawType.includes('pron')) matchesType = true;
                else if (type === 'konj' && rawType.includes('konj')) matchesType = true;
                else if (type === 'interj' && rawType.includes('interj')) matchesType = true;
                else if (type === 'num' && (rawType.includes('num') || rawType.includes('räkne'))) matchesType = true;
                else if (type === 'fras' && (rawType.includes('fras') || rawType.includes('uttin'))) matchesType = true;
                
                // Special Topics (juridik, it, medicin, etc.)
                else if (type === 'juridik' && rawType.includes('juridik')) matchesType = true;
                else if (type === 'medicin' && rawType.includes('medicin')) matchesType = true;
                else if (type === 'it' && (rawType.includes('data') || rawType.includes('it') || rawType.includes('teknik'))) matchesType = true;
                else if (type === 'politik' && (rawType.includes('politik') || rawType.includes('samhäll'))) matchesType = true;
                else if (type === 'religion' && (rawType.includes('religion') || rawType.includes('islam') || rawType.includes('krist'))) matchesType = true;

                if (!matchesType) continue;
            }

            // B. Category Filter (Topics)
            if (category !== 'all') {
                const tags = (row[11] || '').toLowerCase(); // Assuming col 11 contains tags
                if (!tags.includes(category)) continue;
            }

            // C. Query Matching (Skip if empty and browsing)
            if (normalizedQuery) {
                const swe = row[2].toLowerCase();
                const arb = normalizeArabic(row[3] || '').toLowerCase();
                const q = normalizedQuery;
                
                let matchesQuery = false;

                if (mode === 'start') {
                    matchesQuery = swe.startsWith(q) || arb.startsWith(q);
                } else if (mode === 'end') {
                    matchesQuery = swe.endsWith(q) || arb.endsWith(q);
                } else if (mode === 'exact') {
                    matchesQuery = swe === q || arb === q;
                } else {
                    // Default / All / Favorites (with query)
                    matchesQuery = swe.includes(q) || arb.includes(q);
                }

                if (!matchesQuery) continue;
            }

            results.push(row);
        }

        // 2. Sorting
        results.sort((a, b) => {
            const aSwe = a[2].toLowerCase();
            const bSwe = b[2].toLowerCase();
            
            // Custom Sorting
            if (sort === 'alpha_asc' || sort === 'az') {
                return aSwe.localeCompare(bSwe, 'sv');
            }
            if (sort === 'alpha_desc' || sort === 'za') {
                return bSwe.localeCompare(aSwe, 'sv');
            }
            if (sort === 'last_char') {
                const aLast = aSwe.slice(-1);
                const bLast = bSwe.slice(-1);
                return aLast.localeCompare(bLast, 'sv');
            }
            if (sort === 'richness') {
                const aLen = (a[5] || '').length + (a[7] || '').length + (a[9] || '').length;
                const bLen = (b[5] || '').length + (b[7] || '').length + (b[9] || '').length;
                return bLen - aLen; // Descending richness
            }

            // Default: Relevance
            const aArb = normalizeArabic(a[3] || '').toLowerCase();
            const bArb = normalizeArabic(b[3] || '').toLowerCase();
            const q = normalizedQuery;

            // 1. Exact match
            const aExact = (aSwe === q || aArb === q);
            const bExact = (bSwe === q || bArb === q);
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            // 2. Starts with
            const aStarts = (aSwe.startsWith(q) || aArb.startsWith(q));
            const bStarts = (bSwe.startsWith(q) || bArb.startsWith(q));
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            // 3. Length (Shortest first often more relevant)
            return aSwe.length - bSwe.length;
        });

        // 3. Map to Interface
        return results.map(row => ({
            id: row[0],
            type: row[1],
            swedish: row[2],
            arabic: row[3],
            forms: row[6],
            gender: row[13]
        }));
    }
}
