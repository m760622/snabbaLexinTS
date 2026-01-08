import ordsprakData from './data/ordsprak.json';

export interface DailyContent {
    type: 'word' | 'proverb' | 'idiom';
    id: number | string;
    swedish: string;
    translation: string; // Arabic
    explanation?: string; // Swedish or Arabic extra info
    literal?: string; // For proverbs
    example?: string;
    tags?: string[];
    rawType?: string;
}

export class DailyContentService {
    private static STORAGE_KEY = 'snabbaLexin_daily_cache_v2';

    static getDailyContent(dictionary: any[][]): DailyContent | null {
        // Return a random content every time to satisfy "change automatically on every refresh"
        return this.getRandomContent(dictionary);
    }

    static getRandomContent(dictionary: any[][]): DailyContent | null {
        if (!dictionary || dictionary.length === 0) return null;

        // Rotation: Randomly pick between Rich Word (0), Proverb (1), Idiom (2)
        const mode = Math.floor(Math.random() * 3);

        if (mode === 1) {
            // --- PROVERB ---
            const count = ordsprakData.length;
            if (count > 0) {
                const index = Math.floor(Math.random() * count);
                const item = ordsprakData[index];
                return {
                    type: 'proverb',
                    id: `prov_${item.id}`,
                    swedish: item.swedishProverb,
                    translation: item.arabicEquivalent,
                    literal: item.literalMeaning,
                    explanation: `Verb: ${item.verb} (${item.verbTranslation})`,
                    tags: ['Ordspråk', 'مثل']
                };
            }
        }

        if (mode === 2) {
            // --- IDIOM ---
            const idioms = dictionary.filter(row => {
                const type = (row[1] || '').toLowerCase();
                return type.includes('fras') || type.includes('idiom') || type.includes('uttryck');
            });

            if (idioms.length > 0) {
                const index = Math.floor(Math.random() * idioms.length);
                const item = idioms[index];
                return {
                    type: 'idiom',
                    id: item[0],
                    swedish: item[2],
                    translation: item[3],
                    example: item[5] || item[9],
                    tags: ['Idiom', 'تعبير']
                };
            }
        }

        // --- RICH WORD (Default) ---
        // Strict Filter: Must have a real example (col 5) with length > 10 chars
        const richWords = dictionary.filter(row => {
            const ex1 = (row[5] || '').trim();
            // Ensure example exists and is meaningful
            return ex1.length > 10;
        });

        // Fallback safety if no rich words found (unlikely)
        const targetList = richWords.length > 0 ? richWords : dictionary;
        
        // Pick random
        const index = Math.floor(Math.random() * targetList.length);
        const item = targetList[index];

        return {
            type: 'word',
            id: item[0],
            swedish: item[2],
            translation: item[3],
            example: item[5],
            explanation: item[4],
            tags: ['Dagens Ord', 'كلمة اليوم'],
            // Pass raw type for display
            rawType: item[1] 
        };
    }

    // Deprecated: Old method with caching if needed later
    static getCachedDailyContent(dictionary: any[][]): DailyContent | null {
        try {
            const today = new Date().toISOString().slice(0, 10);
            const cache = localStorage.getItem(this.STORAGE_KEY);
            if (cache) {
                const parsed = JSON.parse(cache);
                if (parsed.date === today) return parsed.content;
            }
            const content = this.getRandomContent(dictionary);
            if (content) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ date: today, content }));
            }
            return content;
        } catch (e) {
            return null;
        }
    }

    private static generateContent(dictionary: any[][]): DailyContent | null {
        return this.getRandomContent(dictionary);
    }
}
