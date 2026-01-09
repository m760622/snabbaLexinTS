// src/workers/search.worker.ts

function normalizeArabicWorker(text: string): string {
    if (!text) return '';
    let normalized = text.replace(/[\u064B-\u065F\u0670]/g, '');
    normalized = normalized.replace(/[أإآ]/g, 'ا');
    normalized = normalized.replace(/ة/g, 'ه');
    normalized = normalized.replace(/ى/g, 'ي');
    return normalized;
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

// Optimization: Pre-calculated index
let searchIndex: { swe: string, arb: string }[] = [];

self.onmessage = (e: MessageEvent) => {
    try {
        const { type, payload } = e.data;

        if (type === 'INIT_DATA') {
            const data = payload as any[][];
            (self as any).dictionaryData = data;
            
            // Build Index
            searchIndex = data.map(row => ({
                swe: (row[2] || '').toLowerCase(),
                arb: normalizeArabicWorker(row[3] || '').toLowerCase()
            }));

            self.postMessage({ type: 'DATA_LOADED' });
        } else if (type === 'SEARCH') {
            const { options, favIds } = payload;
            const data = (self as any).dictionaryData || [];
            
            if (data.length === 0) {
                 self.postMessage({ type: 'SEARCH_RESULT', payload: { results: [], stats: { total: 0, types: {}, categories: {} } } });
                 return;
            }

            console.log(`Worker searching for: "${options.query}" in ${data.length} words...`);
            const results = searchWithStats(data, options, favIds);
            console.log(`Worker found ${results.results.length} matches.`);
            self.postMessage({ type: 'SEARCH_RESULT', payload: results });
        }
    } catch (error: any) {
        console.error('Worker Search Error:', error);
        self.postMessage({ type: 'ERROR', payload: error.message });
    }
};

function searchWithStats(data: any[][], options: any, favIdsList: string[]): SearchResultWithStats {
    const { query, mode, type, sort } = options;
    const normalizedQuery = normalizeArabicWorker(query.trim().toLowerCase());
    
    const stats: SearchStats = {
        total: 0,
        types: {},
        categories: {}
    };
    
    const isBrowsing = mode === 'favorites' || type !== 'all';
    const hasQuery = !!normalizedQuery;
    const favSet = mode === 'favorites' ? new Set(favIdsList) : null;

    let allMatches: any[][] = [];

    // Use loop with index access for performance
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        
        // 1. Favorites Filter (Fastest check)
        if (favSet && !favSet.has(row[0].toString())) continue;

        // 2. Query Match (Using Index)
        let matchesQuery = false;
        if (hasQuery) {
            const idx = searchIndex[i];
            if (!idx) continue; // Safety

            const q = normalizedQuery;
            
            if (mode === 'start') matchesQuery = idx.swe.startsWith(q) || idx.arb.startsWith(q);
            else if (mode === 'end') matchesQuery = idx.swe.endsWith(q) || idx.arb.endsWith(q);
            else if (mode === 'exact') matchesQuery = idx.swe === q || idx.arb === q;
            else matchesQuery = idx.swe.includes(q) || idx.arb.includes(q);
        } else {
            matchesQuery = true;
        }

        if (!matchesQuery) continue;

        const rawType = (row[1] || '').toLowerCase();

        // 3. Type Stats
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

        // 4. Type Filter
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

    const MAX_RESULTS = 1000;

    // Sort
    allMatches.sort((a, b) => {
         // Using the original data (a and b are rows)
         // We can recreate the index access if we had indices, but here we have the rows.
         // Optimization: We could store the normalized values in the row or use the index if we passed indices.
         // For now, re-normalizing for sort is acceptable as result set is small (max 1000).
         
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

    const slicedResults = allMatches.slice(0, MAX_RESULTS).map(row => ({
        id: row[0],
        type: row[1],
        swedish: row[2],
        arabic: row[3],
        forms: row[6],
        definition: row[5],
        example: row[7],
        gender: row[13]
    }));

    return { results: slicedResults, stats };
}
