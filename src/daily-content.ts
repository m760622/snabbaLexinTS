import ordsprakData from './data/ordsprak.json';
import { quranData } from './data/quranData';
import { ASMA_UL_HUSNA } from './data/asmaUlHusna';
import { cognatesData } from './data/cognatesData';
import { JOKES, FACTS, GRAMMAR_TIPS, SLANG } from './data/extraDailyData';

export interface DailyContent {
    type: 'word' | 'proverb' | 'idiom' | 'quran' | 'asma' | 'cognate' | 'joke' | 'fact' | 'grammar' | 'slang';
    id: number | string;
    swedish: string;
    translation: string; // Arabic
    explanation?: string; // Swedish or Arabic extra info
    literal?: string; // For proverbs
    example?: string;
    tags?: string[];
    rawType?: string;
    // Quran specific
    surah?: string;
    ayah?: string;
    root?: string;
    // Asma specific
    meaningSv?: string;
    // Cognate specific
    category?: string;
}

export interface DailyContentConfig {
    words?: boolean;
    proverbs?: boolean;
    idioms?: boolean;
    quran?: boolean;
    asma?: boolean;
    cognates?: boolean;
    jokes?: boolean;
    facts?: boolean;
    grammar?: boolean;
    slang?: boolean;
}

export class DailyContentService {
    private static STORAGE_KEY = 'snabbaLexin_daily_cache_v2';

    static getDailyContent(dictionary: any[][], config?: DailyContentConfig): DailyContent | null {
        return this.getRandomContent(dictionary, config);
    }

    static getRandomContent(dictionary: any[][], config: DailyContentConfig = { 
        words: true, proverbs: true, idioms: true, quran: true, asma: true, cognates: true,
        jokes: true, facts: true, grammar: true, slang: true
    }): DailyContent | null {
        if (!dictionary || dictionary.length === 0) return null;

        // Build pool of enabled sources
        const sources: string[] = [];
        if (config.words) sources.push('word');
        if (config.proverbs) sources.push('proverb');
        if (config.idioms) sources.push('idiom');
        if (config.quran) sources.push('quran');
        if (config.asma) sources.push('asma');
        if (config.cognates) sources.push('cognate');
        if (config.jokes) sources.push('joke');
        if (config.facts) sources.push('fact');
        if (config.grammar) sources.push('grammar');
        if (config.slang) sources.push('slang');

        // Fallback if nothing enabled
        if (sources.length === 0) sources.push('word');

        // Pick a random source type
        const type = sources[Math.floor(Math.random() * sources.length)];

        if (type === 'joke') {
            const item = JOKES[Math.floor(Math.random() * JOKES.length)];
            return {
                type: 'joke',
                id: `joke_${item.id}`,
                swedish: item.swedish,
                translation: item.translation,
                explanation: item.punchline, // Punchline as explanation
                tags: ['Skämt', 'نكتة'],
                rawType: 'Skämt'
            };
        }

        if (type === 'fact') {
            const item = FACTS[Math.floor(Math.random() * FACTS.length)];
            return {
                type: 'fact',
                id: `fact_${item.id}`,
                swedish: item.swedish,
                translation: item.translation,
                explanation: item.details,
                tags: ['Fakta', 'هل تعلم'],
                rawType: 'Fakta'
            };
        }

        if (type === 'grammar') {
            const item = GRAMMAR_TIPS[Math.floor(Math.random() * GRAMMAR_TIPS.length)];
            return {
                type: 'grammar',
                id: `gram_${item.id}`,
                swedish: item.title, // Title as "Word"
                translation: item.rule, // Rule as "Translation"
                explanation: item.example,
                tags: ['Grammatik', 'قواعد'],
                rawType: 'Tips'
            };
        }

        if (type === 'slang') {
            const item = SLANG[Math.floor(Math.random() * SLANG.length)];
            return {
                type: 'slang',
                id: `slang_${item.id}`,
                swedish: item.word,
                translation: item.translation,
                explanation: `${item.definition}. Ex: ${item.example}`,
                tags: ['Slang', 'عامية'],
                rawType: 'Slang'
            };
        }

        if (type === 'quran') {
            const item = quranData[Math.floor(Math.random() * quranData.length)];
            return {
                type: 'quran',
                id: item.id,
                swedish: item.word_sv,
                translation: item.meaning_ar, // Meaning of the word
                explanation: item.word, // The Arabic word itself
                example: item.ayah_sv, // Swedish Ayah
                tags: ['Koran', item.surah],
                surah: item.surah,
                ayah: item.ayah_full // Arabic Ayah
            };
        }

        if (type === 'asma') {
            const item = ASMA_UL_HUSNA[Math.floor(Math.random() * ASMA_UL_HUSNA.length)];
            return {
                type: 'asma',
                id: `asma_${item.nr}`,
                swedish: item.nameSv,
                translation: item.nameAr,
                explanation: item.meaningAr,
                meaningSv: item.meaningSv,
                example: item.verseSv,
                tags: ['Guds Namn', 'أسماء الله'],
                ayah: item.verseAr
            };
        }

        if (type === 'cognate') {
            const item = cognatesData[Math.floor(Math.random() * cognatesData.length)];
            return {
                type: 'cognate',
                id: `cog_${Math.random()}`, // Cognates don't have stable IDs in current data
                swedish: item.swe,
                translation: item.arb,
                explanation: 'Ord som låter likadant / كلمات متشابهة النطق',
                tags: ['Kognat', item.category || 'Övrigt'],
                category: item.category,
                rawType: item.type
            };
        }

        if (type === 'proverb') {
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

        if (type === 'idiom') {
            const idioms = dictionary.filter(row => {
                const t = (row[1] || '').toLowerCase();
                return t.includes('fras') || t.includes('idiom') || t.includes('uttryck');
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
        const richWords = dictionary.filter(row => {
            const ex1 = (row[5] || '').trim();
            return ex1.length > 10;
        });

        const targetList = richWords.length > 0 ? richWords : dictionary;
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
            rawType: item[1] 
        };
    }
}
