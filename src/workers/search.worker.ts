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
}

export interface SearchResultWithStats {
    results: SearchResult[];
    stats: SearchStats;
}

// Optimization: Pre-calculated index
// We store simplified objects to avoid property access overhead in tight loops
let optimizedIndex: { s: string, a: string }[] = []; 

self.onmessage = (e: MessageEvent) => {
    try {
        const { type, payload } = e.data;

        if (type === 'INIT_DATA') {
            const data = payload as any[][];
            (self as any).dictionaryData = data;
            
            // Build Index - Optimized
            console.log('[SearchWorker] Building optimized index for ' + data.length + ' words');
            optimizedIndex = new Array(data.length);
            for (let i = 0; i < data.length; i++) {
                optimizedIndex[i] = {
                    s: (data[i][2] || '').toLowerCase(),
                    a: normalizeArabicWorker(data[i][3] || '').toLowerCase()
                };
            }

            self.postMessage({ type: 'DATA_LOADED' });
        } else if (type === 'SEARCH') {
            const { options, favIds } = payload;
            const data = (self as any).dictionaryData || [];
            
            if (data.length === 0) {
                 self.postMessage({ type: 'SEARCH_RESULT', payload: { results: [], stats: { total: 0, types: {} } } });
                 return;
            }

            // SELF-HEALING: Ensure index is ready and matches data
            if (!optimizedIndex || optimizedIndex.length !== data.length) {
                console.warn('[SearchWorker] Index mismatch (Data: ' + data.length + ', Index: ' + (optimizedIndex ? optimizedIndex.length : 0) + '). Rebuilding...');
                optimizedIndex = new Array(data.length);
                for (let i = 0; i < data.length; i++) {
                    optimizedIndex[i] = {
                        s: (data[i][2] || '').toLowerCase(),
                        a: normalizeArabicWorker(data[i][3] || '').toLowerCase()
                    };
                }
            }

            const results = searchWithStats(data, options, favIds);
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
        types: {}
    };
    
    const isBrowsing = mode === 'favorites' || type !== 'all';
    const hasQuery = !!normalizedQuery;
    const favSet = mode === 'favorites' ? new Set(favIdsList) : null;

    let allMatches: any[][] = [];

    // Use loop with index access for performance
    const len = data.length;
    for (let i = 0; i < len; i++) {
        const row = data[i];
        
        // 1. Favorites Filter (Fastest check)
        if (favSet && !favSet.has(row[0].toString())) continue;

        // 2. Query Match (Using Optimized Index)
        let matchesQuery = false;
        if (hasQuery) {
            const idx = optimizedIndex[i];
            
            // Safety fallback if index is still corrupted for this specific row
            if (!idx) {
                 const safeS = (row[2] || '').toLowerCase();
                 const safeA = normalizeArabicWorker(row[3] || '').toLowerCase();
                 if (safeS.includes(normalizedQuery) || safeA.includes(normalizedQuery)) matchesQuery = true;
            } else {
                // Optimized check
                const q = normalizedQuery;
                
                if (mode === 'start') {
                     if (idx.s.startsWith(q) || idx.a.startsWith(q)) matchesQuery = true;
                } else if (mode === 'end') {
                     if (idx.s.endsWith(q) || idx.a.endsWith(q)) matchesQuery = true;
                } else if (mode === 'exact') {
                     if (idx.s === q || idx.a === q) matchesQuery = true;
                } else {
                     // Default to contains for 'contains', 'favorites', undefined, etc.
                     if (idx.s.includes(q) || idx.a.includes(q)) matchesQuery = true;
                }
            }
        } else {
            matchesQuery = true;
        }

        if (!matchesQuery) continue;

        const rawType = (row[1] || '').toLowerCase();

        // 3. Type Stats - Optimized with specific checks
        stats.types['all'] = (stats.types['all'] || 0) + 1;

        const isSubst = rawType.includes('subst') || rawType === 'noun';
        if (isSubst) stats.types['subst'] = (stats.types['subst'] || 0) + 1;
        
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
             if (type === 'subst' && isSubst) matchesType = true;
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

    const MAX_RESULTS = 1000; // Restore standard limit

    // Sort
    allMatches.sort((a, b) => {
         const aSwe = a[2].toLowerCase();
         const bSwe = b[2].toLowerCase();
         
         // Exact match priority
         if (aSwe === normalizedQuery && bSwe !== normalizedQuery) return -1;
         if (bSwe === normalizedQuery && aSwe !== normalizedQuery) return 1;

         if (sort === 'alpha_asc' || sort === 'az') return aSwe.localeCompare(bSwe, 'sv');
         if (sort === 'alpha_desc' || sort === 'za') return bSwe.localeCompare(aSwe, 'sv');
         if (sort === 'last_char') return aSwe.slice(-1).localeCompare(bSwe.slice(-1), 'sv');
         if (sort === 'richness') {
             const aLen = (a[5] || '').length + (a[7] || '').length + (a[9] || '').length;
             const bLen = (b[5] || '').length + (b[7] || '').length + (b[9] || '').length;
             return bLen - aLen;
         }
         
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