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
    category: string;
    sort: string;
}

export class SearchService {
    static init(data: any[][]) {}

    /**
     * Optimized search with stats - uses strict tag checking for maximum performance.
     */
    static searchWithStats(data: any[][], options: SearchOptions): SearchResultWithStats {
        const { query, mode, type, category, sort } = options;
        const normalizedQuery = normalizeArabic(query.trim().toLowerCase());
        
        const stats: SearchStats = {
            total: 0,
            types: {},
            categories: {}
        };
        
        const isBrowsing = mode === 'favorites' || type !== 'all' || category !== 'all';
        const hasQuery = !!normalizedQuery;

        // If simple view (no query/filters), return empty or calculate global stats if needed
        // For performance, caller can handle global stats logic
        
        let allMatches: any[][] = [];
        let candidateData = data;
        
        if (mode === 'favorites') {
            const favIds = new Set(FavoritesManager.getAll());
            candidateData = data.filter(row => favIds.has(row[0].toString()));
        }

        // Single Pass Loop (O(N))
        for (const row of candidateData) {
            const rawType = (row[1] || '').toLowerCase();
            const tags = (row[11] || '').toLowerCase();
            
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

            // 2. Count Stats (Accumulate for ALL matching query)
            // Type Stats
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

            // Category Stats (Fast Tag Check)
            // We verify if the specific tag exists in the string
            if (tags.includes('mat')) stats.categories['food'] = (stats.categories['food'] || 0) + 1;
            if (tags.includes('arbete') || tags.includes('yrke')) stats.categories['work'] = (stats.categories['work'] || 0) + 1;
            if (tags.includes('kropp') || tags.includes('hälsa')) stats.categories['health'] = (stats.categories['health'] || 0) + 1;
            if (tags.includes('familj')) stats.categories['family'] = (stats.categories['family'] || 0) + 1;
            if (tags.includes('resa')) stats.categories['travel'] = (stats.categories['travel'] || 0) + 1;
            if (tags.includes('skola') || tags.includes('utbildning')) stats.categories['school'] = (stats.categories['school'] || 0) + 1;
            if (tags.includes('hem') || tags.includes('bostad')) stats.categories['home'] = (stats.categories['home'] || 0) + 1;
            if (tags.includes('natur') || tags.includes('djur')) stats.categories['nature'] = (stats.categories['nature'] || 0) + 1;
            stats.categories['all'] = (stats.categories['all'] || 0) + 1;

            // 3. Apply Filters for Result List
            if (!hasQuery && !isBrowsing) continue; // Don't build list if just idle stats

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
                 
                 if (!matchesType) includeInResults = false;
            }

            if (includeInResults && category !== 'all') {
                // Map category select value back to tag check
                let matchesCat = false;
                if (category === 'food' && tags.includes('mat')) matchesCat = true;
                else if (category === 'work' && (tags.includes('arbete') || tags.includes('yrke'))) matchesCat = true;
                else if (category === 'health' && (tags.includes('kropp') || tags.includes('hälsa'))) matchesCat = true;
                else if (category === 'family' && tags.includes('familj')) matchesCat = true;
                else if (category === 'travel' && tags.includes('resa')) matchesCat = true;
                else if (category === 'school' && (tags.includes('skola') || tags.includes('utbildning'))) matchesCat = true;
                else if (category === 'home' && (tags.includes('hem') || tags.includes('bostad'))) matchesCat = true;
                else if (category === 'nature' && (tags.includes('natur') || tags.includes('djur'))) matchesCat = true;
                
                if (!matchesCat) includeInResults = false;
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