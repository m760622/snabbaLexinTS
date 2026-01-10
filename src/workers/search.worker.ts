// src/workers/search.worker.ts

function normalizeArabicWorker(text: string): string {
    if (!text) return '';
    // 1. Remove Tashkeel (diacritics)
    let normalized = text.replace(/[\u064B-\u065F\u0670]/g, '');
    // 2. Normalize Alef forms (أ, إ, آ -> ا)
    normalized = normalized.replace(/[أإآ]/g, 'ا');
    // 3. Normalize Hamza on Waw/Ya (ؤ, ئ -> و, ي)
    normalized = normalized.replace(/ؤ/g, 'و');
    normalized = normalized.replace(/ئ/g, 'ي');
    // 4. Normalize Taa Marbuta (ة -> ه)
    normalized = normalized.replace(/ة/g, 'ه');
    // 5. Normalize Yaa (ى -> ي)
    normalized = normalized.replace(/ى/g, 'ي');
    return normalized;
}

/**
 * Prefix Trie for fast Swedish autocomplete
 */
class TrieNode {
    children: Record<string, TrieNode> = {};
    wordIds: number[] = [];
}

class SwedishTrie {
    root = new TrieNode();

    insert(word: string, id: number) {
        let node = this.root;
        const clean = word.toLowerCase();
        for (const char of clean) {
            if (!node.children[char]) node.children[char] = new TrieNode();
            node = node.children[char];
            // Store IDs at each node for prefix matching
            if (node.wordIds.length < 50) node.wordIds.push(id); 
        }
    }

    search(prefix: string): number[] {
        let node = this.root;
        const clean = prefix.toLowerCase();
        for (const char of clean) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        return node.wordIds;
    }
}

const swedishTrie = new SwedishTrie();

/**
 * Simple Arabic Root Extractor
 * Returns the likely 3-letter root by removing common prefixes/suffixes
 */
function extractArabicRoot(word: string): string {
    if (!word || word.length < 3) return word;
    // Remove common non-root letters (very simplified)
    let root = word.replace(/[ال|بال|وال|لل|ي|ت|ا|م|ون|ين|ات|ه|ة]/g, '');
    if (root.length > 3) root = root.substring(0, 3);
    if (root.length < 3) return word.substring(0, 3);
    return root;
}

/**
 * Simplified Swedish Phonetic Algorithm
 */
function getSwedishPhonetic(word: string): string {
    if (!word) return '';
    let p = word.toLowerCase();

    // 1. Sj-sounds -> X
    p = p.replace(/(sj|stj|skj|sch|sh|ch)/g, 'X');
    // sk before soft vowels (e, i, y, ä, ö)
    p = p.replace(/sk(?=[eiyäö])/g, 'X');

    // 2. J-sounds -> J
    p = p.replace(/(dj|gj|hj|lj|j)/g, 'J');
    // g before soft vowels
    p = p.replace(/g(?=[eiyäö])/g, 'J');

    // 3. Common clusters
    p = p.replace(/ck/g, 'K');
    p = p.replace(/ph/g, 'F');
    p = p.replace(/th/g, 'T');
    p = p.replace(/wr/g, 'R');

    // 4. Double consonants
    p = p.replace(/(.)\1+/g, '$1');

    return p;
}

/**
 * Basic Swedish Stemmer for Query Expansion
 */
function stemSwedish(word: string): string[] {
    const stems = [word];
    const clean = word.toLowerCase();

    // Common verb endings
    if (clean.endsWith('er') || clean.endsWith('ar')) stems.push(clean.slice(0, -2));
    else if (clean.endsWith('ade') || clean.endsWith('ede')) stems.push(clean.slice(0, -3));
    else if (clean.endsWith('te') || clean.endsWith('de')) stems.push(clean.slice(0, -2));
    
    // Common noun/adj endings
    if (clean.endsWith('arna') || clean.endsWith('erna')) stems.push(clean.slice(0, -4));
    else if (clean.endsWith('en') || clean.endsWith('et')) stems.push(clean.slice(0, -2));

    // Handle infinitives (ending in a)
    const expanded = [...stems];
    stems.forEach(s => {
        if (s.length > 2 && !s.endsWith('a')) expanded.push(s + 'a');
    });

    return Array.from(new Set(expanded));
}

/**
 * Fast Levenshtein distance implementation
 */
function levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

export interface SearchResult {
    id: number;
    type: string;
    swedish: string;
    arabic: string;
    forms?: string;
    gender?: string;
    score?: number; // Added for relevance
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
let optimizedIndex: { s: string, a: string, ps: string, ar: string }[] = []; 

self.onmessage = (e: MessageEvent) => {
    try {
        const { type, payload } = e.data;

        if (type === 'INIT_DATA') {
            const data = payload as any[][];
            (self as any).dictionaryData = data;
            
            console.log('[SearchWorker] Building optimized index and Trie for ' + data.length + ' words');
            optimizedIndex = new Array(data.length);
            for (let i = 0; i < data.length; i++) {
                const swe = (data[i][2] || '').toLowerCase();
                const arb = normalizeArabicWorker(data[i][3] || '').toLowerCase();
                optimizedIndex[i] = {
                    s: swe,
                    a: arb,
                    ps: getSwedishPhonetic(swe),
                    ar: extractArabicRoot(arb)
                };
                // Populate Trie
                if (swe) swedishTrie.insert(swe, i);
            }

            self.postMessage({ type: 'DATA_LOADED' });
        } else if (type === 'SEARCH') {
            const { options, favIds } = payload;
            const data = (self as any).dictionaryData || [];
            
            if (data.length === 0) {
                 self.postMessage({ type: 'SEARCH_RESULT', payload: { results: [], stats: { total: 0, types: {} } } });
                 return;
            }

            if (!optimizedIndex || optimizedIndex.length !== data.length) {
                optimizedIndex = new Array(data.length);
                for (let i = 0; i < data.length; i++) {
                    const swe = (data[i][2] || '').toLowerCase();
                    const arb = normalizeArabicWorker(data[i][3] || '').toLowerCase();
                    optimizedIndex[i] = {
                        s: swe,
                        a: arb,
                        ps: getSwedishPhonetic(swe),
                        ar: extractArabicRoot(arb)
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

function calculateScore(query: string, item: { s: string, a: string, ps: string, ar: string }): number {
    let score = 0;
    const q = query;
    const s = item.s;
    const a = item.a;
    const ps = item.ps;
    const ar = item.ar;

    // 1. Exact match (highest priority)
    if (s === q || a === q) score += 1000;
    
    // 2. Starts with
    else if (s.startsWith(q) || a.startsWith(q)) score += 500;
    
    // 3. Word boundary match
    else if (s.includes(' ' + q) || a.includes(' ' + q)) score += 300;
    
    // 4. Arabic Root Match
    else if (q.match(/[أ-ي]/) && q.length === 3 && ar === q) score += 200;

    // 5. Contains
    else if (s.includes(q) || a.includes(q)) score += 100;

    // Phonetic match (Fallback for Swedish)
    if (score < 300 && !q.match(/[أ-ي]/)) {
        const queryPhonetic = getSwedishPhonetic(q);
        if (ps === queryPhonetic) score = Math.max(score, 250);
        else if (ps.startsWith(queryPhonetic)) score = Math.max(score, 150);
    }

    // Length penalty
    score -= (s.length * 2);

    return score;
}

function searchWithStats(data: any[][], options: any, favIdsList: string[]): SearchResultWithStats {
    const { query, mode, type, sort } = options;
    const normalizedQuery = normalizeArabicWorker(query.trim().toLowerCase());
    
    // Query Expansion
    const stems = normalizedQuery ? stemSwedish(normalizedQuery) : [];
    
    const stats: SearchStats = {
        total: 0,
        types: {}
    };
    
    const isBrowsing = mode === 'favorites' || type !== 'all';
    const hasQuery = !!normalizedQuery;
    const favSet = mode === 'favorites' ? new Set(favIdsList) : null;

    let allMatches: { row: any[], score: number }[] = [];

    const len = data.length;
    for (let i = 0; i < len; i++) {
        const row = data[i];
        const idx = optimizedIndex[i];
        
        if (favSet && !favSet.has(row[0].toString())) continue;

        let matchScore = 0;
        if (hasQuery) {
            matchScore = calculateScore(normalizedQuery, idx);
            
            // Query Expansion Match (if no direct match or low score)
            if (matchScore < 500) {
                for (const stem of stems) {
                    if (idx.s === stem || idx.s.startsWith(stem)) {
                        matchScore = Math.max(matchScore, 400); 
                        break;
                    }
                }
            }

            if (matchScore <= 0 && normalizedQuery.length > 3) {
                // Typo tolerance
                const dist = levenshtein(normalizedQuery, idx.s);
                if (dist <= 1) matchScore = 50; 
            }
        } else {
            matchScore = 1;
        }

        if (matchScore <= 0) continue;

        const rawType = (row[1] || '').toLowerCase();

        // Faceted Stats
        const isSubst = rawType.includes('subst') || rawType === 'noun';
        const isVerb = rawType.includes('verb');
        const isAdj = rawType.includes('adj');
        
        if (isSubst) stats.types['subst'] = (stats.types['subst'] || 0) + 1;
        if (isVerb) stats.types['verb'] = (stats.types['verb'] || 0) + 1;
        if (isAdj) stats.types['adj'] = (stats.types['adj'] || 0) + 1;
        
        if (rawType.includes('fras') || rawType.includes('uttin') || rawType.includes('idiom')) 
            stats.types['fras'] = (stats.types['fras'] || 0) + 1;

        if (!hasQuery && !isBrowsing) continue;

        // Filter by Type (Multi-select support)
        if (type !== 'all') {
             const types = Array.isArray(type) ? type : [type];
             let matchesType = false;
             
             for (const t of types) {
                 if (t === 'subst' && isSubst) { matchesType = true; break; }
                 if (t === 'verb' && isVerb) { matchesType = true; break; }
                 if (t === 'adj' && isAdj) { matchesType = true; break; }
                 if (t === 'fras' && (rawType.includes('fras') || rawType.includes('uttin') || rawType.includes('idiom'))) { matchesType = true; break; }
             }
             
             if (!matchesType) continue;
        }

        allMatches.push({ row, score: matchScore });
    }
    
    stats.total = allMatches.length;

    // Sort by Score (Relevance)
    allMatches.sort((a, b) => b.score - a.score);

    const MAX_RESULTS = 500;
    const slicedResults = allMatches.slice(0, MAX_RESULTS).map(m => ({
        id: m.row[0],
        type: m.row[1],
        swedish: m.row[2],
        arabic: m.row[3],
        forms: m.row[6],
        definition: m.row[5],
        example: m.row[7],
        gender: m.row[13],
        score: m.score
    }));

    return { results: slicedResults, stats };
}