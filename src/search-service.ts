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

export interface SearchStats {
    total: number;
    types: Record<string, number>;
    categories: Record<string, number>;
}

export interface SearchResultWithStats {
    results: SearchResult[];
    stats: SearchStats;
}

export interface SearchOptions {
    query: string;
    mode: string;
    type: string;
    sort: string;
}

export class SearchService {
    // Legacy init method (No-op)
    static init(_data: any[][]) {}

    static searchWithStats(data: any[][], options: SearchOptions): SearchResultWithStats {
        const { query, mode, type, sort } = options;
        const normalizedQuery = normalizeArabic(query.trim().toLowerCase());
        
        // Stats containers
        const stats: SearchStats = {
            total: 0,
            types: {},
            categories: {}
        };
        
        const isBrowsing = mode === 'favorites' || type !== 'all';
        const hasQuery = !!normalizedQuery;

        let allMatches: any[][] = [];
        let candidateData = data;
        
        if (mode === 'favorites') {
            const favIds = new Set(FavoritesManager.getAll());
            candidateData = data.filter(row => favIds.has(row[0].toString()));
        }

        for (const row of candidateData) {
            const rawType = (row[1] || '').toLowerCase();
            
            // 1. Query Match
            let matchesQuery = false;
            if (hasQuery) {
                const swe = row[2].toLowerCase();
                const arb = normalizeArabic(row[3] || '').toLowerCase();
                const q = normalizedQuery;
                
                if (mode === 'start') matchesQuery = swe.startsWith(q) || arb.startsWith(q);
                else if (mode === 'end') matchesQuery = swe.endsWith(q) || arb.endsWith(q);
                else if (mode === 'exact') matchesQuery = swe === q || arb === q;
                else matchesQuery = swe.includes(q) || arb.includes(q);
            } else {
                matchesQuery = true;
            }

            if (!matchesQuery) continue;

            // 2. Type Stats
            let typeKey = 'other';
            if (rawType.includes('subst') || rawType === 'noun') typeKey = 'subst';
            else if (rawType.includes('verb')) typeKey = 'verb';
            else if (rawType.includes('adj')) typeKey = 'adj';
            else if (rawType.includes('adv')) typeKey = 'adv';
            else if (rawType.includes('prep')) typeKey = 'prep';
            else if (rawType.includes('pron')) typeKey = 'pron';
            else if (rawType.includes('konj')) typeKey = 'konj';
            else if (rawType.includes('fras') || rawType.includes('uttin') || rawType.includes('idiom')) typeKey = 'fras';
            else if (rawType.includes('juridik')) typeKey = 'juridik';
            else if (rawType.includes('medicin')) typeKey = 'medicin';
            else if (rawType.includes('it') || rawType.includes('teknik') || rawType.includes('data')) typeKey = 'it';

            stats.types[typeKey] = (stats.types[typeKey] || 0) + 1;

            // 4. Filter Results
            if (!hasQuery && !isBrowsing) continue;

            let includeInResults = true;
            if (type !== 'all') {
                 let matchesType = false;
                 if (type === 'subst' && typeKey === 'subst') matchesType = true;
                 else if (type === 'verb' && typeKey === 'verb') matchesType = true;
                 else if (type === 'adj' && typeKey === 'adj') matchesType = true;
                 else if (type === 'adv' && typeKey === 'adv') matchesType = true;
                 else if (type === 'prep' && typeKey === 'prep') matchesType = true;
                 else if (type === 'pron' && typeKey === 'pron') matchesType = true;
                 else if (type === 'konj' && typeKey === 'konj') matchesType = true;
                 else if (type === 'fras' && typeKey === 'fras') matchesType = true;
                 else if (type === 'juridik' && typeKey === 'juridik') matchesType = true;
                 else if (type === 'medicin' && typeKey === 'medicin') matchesType = true;
                 else if (type === 'it' && typeKey === 'it') matchesType = true;
                 else if (type === 'politik' && (rawType.includes('politik') || rawType.includes('samhäll'))) matchesType = true;
                 else if (type === 'religion' && (rawType.includes('religion') || rawType.includes('islam'))) matchesType = true;

                 if (!matchesType) includeInResults = false;
            }

            if (includeInResults) {
                allMatches.push(row);
            }
        }
        
        stats.total = allMatches.length;

        // Sort
        allMatches.sort((a, b) => {
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
 
             const q = normalizedQuery;
             const aArb = normalizeArabic(a[3] || '').toLowerCase();
             const bArb = normalizeArabic(b[3] || '').toLowerCase();
 
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

        // Limit results
        const MAX_RESULTS = 200;
        const slicedResults = allMatches.slice(0, MAX_RESULTS).map(row => ({
            id: row[0],
            type: row[1],
            swedish: row[2],
            arabic: row[3],
            forms: row[6],
            gender: row[13]
        }));

        return { results: slicedResults, stats };
    }

    static search(data: any[][], options: SearchOptions): SearchResult[] {
        return this.searchWithStats(data, options).results;
    }
}