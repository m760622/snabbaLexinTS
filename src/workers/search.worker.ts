// src/workers/search.worker.ts

import { normalizeArabic } from '../utils'; // Will need to ensure utils is pure or duplicate normalizeArabic here if utils has DOM deps.
// To avoid importing utils which might have DOM deps, let's copy normalizeArabic or use a separate file.
// For safety, I'll copy normalizeArabic here.

function normalizeArabicWorker(text: string): string {
    if (!text) return '';
    // Remove Tashkeel (diacritics)
    return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

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

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    if (type === 'INIT_DATA') {
        // Store data globally in worker scope
        (self as any).dictionaryData = payload;
        self.postMessage({ type: 'DATA_LOADED' });
    } else if (type === 'SEARCH') {
        const { options, favIds } = payload;
        const data = (self as any).dictionaryData || [];
        
        if (data.length === 0) {
             // If no data yet, return empty
             self.postMessage({ type: 'SEARCH_RESULT', payload: { results: [], stats: { total: 0, types: {}, categories: {} } } });
             return;
        }

        const results = searchWithStats(data, options, favIds);
        self.postMessage({ type: 'SEARCH_RESULT', payload: results });
    }
};

function searchWithStats(data: any[][], options: any, favIdsList: string[]): SearchResultWithStats {
    const { query, mode, type, sort } = options;
    const normalizedQuery = normalizeArabicWorker(query.trim().toLowerCase());
    
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
        const favSet = new Set(favIdsList);
        candidateData = data.filter(row => favSet.has(row[0].toString()));
    }

    for (const row of candidateData) {
        const rawType = (row[1] || '').toLowerCase();
        
        // 1. Query Match
        let matchesQuery = false;
        if (hasQuery) {
            const swe = row[2].toLowerCase();
            const arb = normalizeArabicWorker(row[3] || '').toLowerCase();
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
        stats.types['all'] = (stats.types['all'] || 0) + 1;

        if (rawType.includes('subst') || rawType === 'noun') stats.types['subst'] = (stats.types['subst'] || 0) + 1;
        if (rawType.includes('verb')) stats.types['verb'] = (stats.types['verb'] || 0) + 1;
        if (rawType.includes('adj')) stats.types['adj'] = (stats.types['adj'] || 0) + 1;
        if (rawType.includes('adv')) stats.types['adv'] = (stats.types['adv'] || 0) + 1;
        if (rawType.includes('prep')) stats.types['prep'] = (stats.types['prep'] || 0) + 1;
        if (rawType.includes('pron')) stats.types['pron'] = (stats.types['pron'] || 0) + 1;
        if (rawType.includes('konj')) stats.types['konj'] = (stats.types['konj'] || 0) + 1;
        if (rawType.includes('fras') || rawType.includes('uttin') || rawType.includes('idiom')) stats.types['fras'] = (stats.types['fras'] || 0) + 1;
        
        if (rawType.includes('juridik')) stats.types['juridik'] = (stats.types['juridik'] || 0) + 1;
        if (rawType.includes('medicin')) stats.types['medicin'] = (stats.types['medicin'] || 0) + 1;
        if (rawType.includes('it') || rawType.includes('teknik') || rawType.includes('data') || rawType.includes('dator')) stats.types['it'] = (stats.types['it'] || 0) + 1;

        // 4. Filter Results
        if (!hasQuery && !isBrowsing) continue;

        let includeInResults = true;
        if (type !== 'all') {
             let matchesType = false;
             
             if (type === 'subst' && (rawType.includes('subst') || rawType === 'noun')) matchesType = true;
             else if (type === 'verb' && rawType.includes('verb')) matchesType = true;
             else if (type === 'adj' && rawType.includes('adj')) matchesType = true;
             else if (type === 'adv' && rawType.includes('adv')) matchesType = true;
             else if (type === 'prep' && rawType.includes('prep')) matchesType = true;
             else if (type === 'pron' && rawType.includes('pron')) matchesType = true;
             else if (type === 'konj' && rawType.includes('konj')) matchesType = true;
             else if (type === 'fras' && (rawType.includes('fras') || rawType.includes('uttin') || rawType.includes('idiom'))) matchesType = true;
             
             else if (type === 'juridik' && rawType.includes('juridik')) matchesType = true;
             else if (type === 'medicin' && rawType.includes('medicin')) matchesType = true;
             else if (type === 'it' && (rawType.includes('it') || rawType.includes('teknik') || rawType.includes('data') || rawType.includes('dator'))) matchesType = true;
             
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
         const aArb = normalizeArabicWorker(a[3] || '').toLowerCase();
         const bArb = normalizeArabicWorker(b[3] || '').toLowerCase();

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

    const MAX_RESULTS = 1000;
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
