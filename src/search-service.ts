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
        
        // Return empty if no query and not in a "browsing" mode
        const isBrowsing = mode === 'favorites' || (type !== 'all' && !query) || (category !== 'all' && !query);
        
        if (!normalizedQuery && !isBrowsing) return [];

        let results: any[][] = [];
        const MAX_RESULTS = 200; // Limit results for performance

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
                else if (type === 'juridik' && rawType.includes('juridik')) matchesType = true;
                else if (type === 'medicin' && rawType.includes('medicin')) matchesType = true;
                else if (type === 'it' && (rawType.includes('data') || rawType.includes('it') || rawType.includes('teknik'))) matchesType = true;

                if (!matchesType) continue;
            }

            // B. Category Filter (Tags)
            if (category !== 'all') {
                const tags = (row[11] || '').toLowerCase();
                if (!tags.includes(category)) continue;
            }

            // C. Query Matching
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
                    matchesQuery = swe.includes(q) || arb.includes(q);
                }

                if (!matchesQuery) continue;
            }

            results.push(row);
        }

        // Sorting
        results.sort((a, b) => {
            const aSwe = a[2].toLowerCase();
            const bSwe = b[2].toLowerCase();
            
            if (sort === 'alpha_asc' || sort === 'az') return aSwe.localeCompare(bSwe, 'sv');
            if (sort === 'alpha_desc' || sort === 'za') return bSwe.localeCompare(aSwe, 'sv');
            if (sort === 'last_char') return aSwe.slice(-1).localeCompare(bSwe.slice(-1), 'sv');
            if (sort === 'richness') {
                const aLen = (a[5] || '').length + (a[7] || '').length + (a[9] || '').length;
                const bLen = (b[5] || '').length + (b[7] || '').length + (b[9] || '').length;
                return bLen - aLen;
            }

            // Relevance
            const aArb = normalizeArabic(a[3] || '').toLowerCase();
            const bArb = normalizeArabic(b[3] || '').toLowerCase();
            const q = normalizedQuery;

            const aExact = (aSwe === q || aArb === q);
            const bExact = (bSwe === q || bArb === q);
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            const aStarts = (aSwe.startsWith(q) || aArb.startsWith(q));
            const bStarts = (bSwe.startsWith(q) || bArb.startsWith(q));
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            return aSwe.length - bSwe.length;
        });

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