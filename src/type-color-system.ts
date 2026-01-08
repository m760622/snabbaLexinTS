/**
 * TypeColorSystem - Unified Word Type Detection & Color System
 * 
 * This module provides a centralized system for:
 * 1. Detecting word types (verb, noun, adjective, etc.)
 * 2. Assigning consistent colors across the application
 * 3. Generating CSS classes and inline styles
 * 
 * Used by: Search Results (app.ts), Details Page (details.ts), Flashcards, etc.
 */

// ============================================
// COLOR DEFINITIONS - Single Source of Truth
// ============================================

export interface ColorDefinition {
    /** Primary color for borders and text */
    primary: string;
    /** Lighter version for backgrounds */
    background: string;
    /** CSS class suffix (e.g., 'verb' for 'type-verb') */
    classToken: string;
    /** Human-readable labels */
    label: { sv: string; ar: string; en: string };
}

export const TypeColors: Record<string, ColorDefinition> = {
    // === NOUNS ===
    en: {
        primary: '#0d9488',      // Turquoise/Teal
        background: 'rgba(13, 148, 136, 0.15)',
        classToken: 'en',
        label: { sv: 'En-ord', ar: 'اسم مذكر', en: 'En-word' }
    },
    ett: {
        primary: '#16a34a',      // Green
        background: 'rgba(22, 163, 74, 0.15)',
        classToken: 'ett',
        label: { sv: 'Ett-ord', ar: 'اسم محايد', en: 'Ett-word' }
    },
    noun: {
        primary: '#0d9488',      // Turquoise (same as EN)
        background: 'rgba(13, 148, 136, 0.15)',
        classToken: 'noun',
        label: { sv: 'Substantiv', ar: 'اسم', en: 'Noun' }
    },

    // === VERBS (with group gradients) ===
    verb: {
        primary: '#dc2626',      // Red (default)
        background: 'rgba(220, 38, 38, 0.15)',
        classToken: 'verb',
        label: { sv: 'Verb', ar: 'فعل', en: 'Verb' }
    },
    // Verb Group 1 - Lightest red (regular verbs: -ar, -ade, -at)
    verb1: {
        primary: '#f87171',      // Light Red (red-400)
        background: 'rgba(248, 113, 113, 0.15)',
        classToken: 'verb-gr1',
        label: { sv: 'Verb Gr.1', ar: 'فعل م.1', en: 'Verb Gr.1' }
    },
    // Verb Group 2 - Medium red (verbs: -er, -de/-te, -t)
    verb2: {
        primary: '#ef4444',      // Red (red-500)
        background: 'rgba(239, 68, 68, 0.15)',
        classToken: 'verb-gr2',
        label: { sv: 'Verb Gr.2', ar: 'فعل م.2', en: 'Verb Gr.2' }
    },
    // Verb Group 3 - Darker red (short verbs: -r, -dde, -tt)
    verb3: {
        primary: '#dc2626',      // Red (red-600)
        background: 'rgba(220, 38, 38, 0.15)',
        classToken: 'verb-gr3',
        label: { sv: 'Verb Gr.3', ar: 'فعل م.3', en: 'Verb Gr.3' }
    },
    // Verb Group 4 - Darkest red (irregular verbs)
    verb4: {
        primary: '#b91c1c',      // Dark Red (red-700)
        background: 'rgba(185, 28, 28, 0.15)',
        classToken: 'verb-gr4',
        label: { sv: 'Verb Gr.4', ar: 'فعل م.4', en: 'Verb Gr.4' }
    },

    // === ADJECTIVES ===
    adjective: {
        primary: '#3b82f6',      // Blue
        background: 'rgba(59, 130, 246, 0.15)',
        classToken: 'adjective',
        label: { sv: 'Adjektiv', ar: 'صفة', en: 'Adjective' }
    },
    adj: {
        primary: '#3b82f6',
        background: 'rgba(59, 130, 246, 0.15)',
        classToken: 'adj',
        label: { sv: 'Adjektiv', ar: 'صفة', en: 'Adjective' }
    },

    // === ADVERBS ===
    // === ADVERBS ===
    adverb: {
        primary: '#0ea5e9',      // Sky Blue (formerly Orange #ea580c)
        background: 'rgba(14, 165, 233, 0.15)',
        classToken: 'adverb',
        label: { sv: 'Adverb', ar: 'ظرف', en: 'Adverb' }
    },
    adv: {
        primary: '#0ea5e9',
        background: 'rgba(14, 165, 233, 0.15)',
        classToken: 'adv',
        label: { sv: 'Adverb', ar: 'ظرف', en: 'Adverb' }
    },

    // === SPECIALIZED CATEGORIES ===
    medical: {
        primary: '#06b6d4',      // Cyan
        background: 'rgba(6, 182, 212, 0.15)',
        classToken: 'medical',
        label: { sv: 'Medicinsk', ar: 'طبي', en: 'Medical' }
    },
    legal: {
        primary: '#92400e',      // Brown (amber-800)
        background: 'rgba(146, 64, 14, 0.15)',
        classToken: 'legal',
        label: { sv: 'Juridisk', ar: 'قانوني', en: 'Legal' }
    },
    construction: {
        primary: '#d97706',      // Gold (amber-600)
        background: 'rgba(217, 119, 6, 0.15)',
        classToken: 'construction',
        label: { sv: 'Bygg', ar: 'بناء', en: 'Construction' }
    },
    tech: {
        primary: '#0891b2',      // Teal
        background: 'rgba(8, 145, 178, 0.15)',
        classToken: 'tech',
        label: { sv: 'Teknik', ar: 'تقني', en: 'Tech' }
    },
    science: {
        primary: '#15803d',      // Dark Green
        background: 'rgba(21, 128, 61, 0.15)',
        classToken: 'science',
        label: { sv: 'Vetenskap', ar: 'علوم', en: 'Science' }
    },
    religion: {
        primary: '#3b82f6',      // Blue
        background: 'rgba(124, 58, 237, 0.15)',
        classToken: 'religion',
        label: { sv: 'Religion', ar: 'دين', en: 'Religion' }
    },
    politics: {
        primary: '#dc2626',      // Red
        background: 'rgba(220, 38, 38, 0.15)',
        classToken: 'politics',
        label: { sv: 'Politik', ar: 'سياسة', en: 'Politics' }
    },
    economy: {
        primary: '#ca8a04',      // Gold
        background: 'rgba(202, 138, 4, 0.15)',
        classToken: 'economy',
        label: { sv: 'Ekonomi', ar: 'اقتصاد', en: 'Economy' }
    },
    military: {
        primary: '#44403c',      // Dark Stone
        background: 'rgba(68, 64, 60, 0.15)',
        classToken: 'military',
        label: { sv: 'Militär', ar: 'عسكري', en: 'Military' }
    },

    // === OTHER GRAMMAR TYPES ===
    preposition: {
        primary: '#facc15',      // Yellow
        background: 'rgba(250, 204, 21, 0.15)',
        classToken: 'preposition',
        label: { sv: 'Preposition', ar: 'حرف جر', en: 'Preposition' }
    },
    pronoun: {
        primary: '#2563eb',      // Indigo
        background: 'rgba(37, 99, 235, 0.15)',
        classToken: 'pronoun',
        label: { sv: 'Pronomen', ar: 'ضمير', en: 'Pronoun' }
    },
    conjunction: {
        primary: '#fde047',      // Light Yellow (yellow-300)
        background: 'rgba(253, 224, 71, 0.15)',
        classToken: 'conjunction',
        label: { sv: 'Konjunktion', ar: 'حرف عطف', en: 'Conjunction' }
    },
    interjection: {
        primary: '#fdba74',      // Pale Orange
        background: 'rgba(253, 186, 116, 0.15)',
        classToken: 'interjection',
        label: { sv: 'Interjektion', ar: 'تعجب', en: 'Interjection' }
    },
    phrasal: {
        primary: '#06b6d4',      // Cyan (same as medical)
        background: 'rgba(6, 182, 212, 0.15)',
        classToken: 'phrasal',
        label: { sv: 'Fras', ar: 'عبارة', en: 'Phrasal' }
    },

    // === DEFAULT ===
    default: {
        primary: '#64748b',      // Slate Gray
        background: 'rgba(100, 116, 139, 0.15)',
        classToken: 'default',
        label: { sv: 'Annat', ar: 'أخرى', en: 'Other' }
    }
};

// Alias mappings for different naming conventions
const TYPE_ALIASES: Record<string, string> = {
    // Swedish abbreviations
    'subst': 'noun',
    'subst.': 'noun',
    'substantiv': 'noun',
    'substantivr': 'noun',
    'substantivmn': 'noun',
    'adj': 'adjective',
    'adj.': 'adjective',
    'adjektiv': 'adjective',
    'adv': 'adverb',
    'adv.': 'adverb',
    'adverb': 'adverb',
    'prep': 'preposition',
    'prep.': 'preposition',
    'preposition': 'preposition',
    'konj': 'conjunction',
    'konj.': 'conjunction',
    'konjunktion': 'conjunction',
    'pron': 'pronoun',
    'pron.': 'pronoun',
    'pronomen': 'pronoun',
    'interj': 'interjection',
    'interj.': 'interjection',
    'interjektion': 'interjection',
    'verbmn': 'phrasal',
    'förled': 'phrasal',
    'efterled': 'phrasal',
    'förkortning': 'noun',
    'namn': 'noun',
    'räkning': 'numeral',

    // Specialized abbreviations
    'med': 'medical',
    'medicin': 'medical',
    'medicinr': 'medical',
    'medicinmr': 'medical',
    'medicinmn': 'medical',
    'medicintb': 'medical',
    'tandvård': 'medical',
    'jur': 'legal',
    'juridik': 'legal',
    'juridikr': 'legal',
    'juridiks': 'legal',
    'juridiktb': 'legal',
    'juridikmn': 'legal',
    'bygg': 'construction',
    'tekn': 'tech',
    'teknik': 'tech',
    'teknikmn': 'tech',
    'nat': 'science',
    'natur': 'science',
    'rel': 'religion',
    'religion': 'religion',
    'pol': 'politics',
    'politik': 'politics',
    'ekon': 'economy',
    'ekonomi': 'economy',
    'ekobrott': 'economy',
    'mil': 'military',
    'militär': 'military',
    'hbtq': 'medical',
    'hbtqi': 'medical',
    'hbtqs': 'medical',
    'samhälle': 'politics',
    'samhälletb': 'politics',
    'samhäller': 'politics',
    'samhällemn': 'politics',
    'migration': 'politics',
    'migrationtb': 'politics',
    'arbetsmarknad': 'economy',
    'arbetsmarknadr': 'economy',
    'arbetsmarknadmn': 'economy',
    'försäkring': 'economy',
    'försäkringr': 'economy',
    'försäkringskassan': 'economy',
    'utbildning': 'politics',
    'utbildningmn': 'politics',
    'körkorttb': 'legal',
    'körkortmn': 'legal',
    'ministeriet': 'politics',
    'multikulturella': 'politics',
    'övrega': 'default',
    'övregatb': 'default',
    'se': 'default'
};

// ============================================
// TYPE DETECTION SYSTEM
// ============================================

export interface WordTypeResult {
    /** Detected grammatical type (verb, en, ett, adjective...) */
    type: string;
    /** Color definition based on grammatical type */
    color: ColorDefinition;
    /** Verb group number (1-4) */
    verbGroup?: number;
    /** Noun gender (en/ett) */
    gender?: 'en' | 'ett';
    /** Specialized label tag (e.g. 'Med', 'Jur', 'Tekn') */
    specializedLabel?: string;
}

const detectionCache = new Map<string, WordTypeResult>();

/**
 * TypeColorSystem - Main API for detecting word types and getting colors
 * 
 * IMPORTANT: This system relies PRIMARILY on forms analysis, NOT the type field
 * from dictionary data which is often inaccurate.
 */
export const TypeColorSystem = {
    /**
     * Detect the word type and get associated color information
     * 
     * Detection Logic:
     * 1. Determine Grammatical Type (Verb, Noun, Adj) -> Determines COLOR
     * 2. Determine Specialized Category (Med, Jur, etc.) -> Determines LABEL TAG
     * 
     * @param type - The grammatical type string from dictionary (OFTEN UNRELIABLE)
     * @param word - The Swedish word itself
     * @param forms - The grammatical forms string (e.g., 'arbetar, arbetade, arbetat')
     * @param gender - Optional explicit gender from dictionary ('en' or 'ett')
     * @returns WordTypeResult with detected type and color
     */
    detect(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): WordTypeResult {
        const cacheKey = `${type}|${word}|${forms}|${gender}|${arabic}`;
        if (detectionCache.has(cacheKey)) return detectionCache.get(cacheKey)!;

        const result = this._detectRaw(type, word, forms, gender, arabic);
        
        // Simple cache size limit
        if (detectionCache.size > 2000) {
            const firstKey = detectionCache.keys().next().value;
            if (firstKey) detectionCache.delete(firstKey);
        }
        
        detectionCache.set(cacheKey, result);
        return result;
    },

    _detectRaw(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): WordTypeResult {
        const wordLower = (word || '').trim().toLowerCase();
        const formsLower = (forms || '').toLowerCase();
        const normalizedType = (type || '').toLowerCase().replace(/[.()]/g, '').trim();
        const genderLower = (gender || '').toLowerCase().trim();

        // Used to determine if we should look for a specialized label from the type string
        let specializedLabel: string | undefined;

        // Extract specialized label if present in type aliases
        // e.g., 'adj. med.' -> 'med' alias -> 'medical' -> Label: 'Medicinsk'
        const possibleSpecType = TYPE_ALIASES[normalizedType] || TYPE_ALIASES[normalizedType.split(' ').pop() || ''];
        if (possibleSpecType && TypeColors[possibleSpecType] &&
            !['noun', 'verb', 'adjective', 'adverb', 'en', 'ett'].includes(possibleSpecType)) {
            // Map simplified labels for badges: medical -> Med, legal -> Jur
            const labelMap: Record<string, string> = {
                'medical': 'Med', 'legal': 'Jur', 'construction': 'Bygg',
                'tech': 'Tekn', 'science': 'Nat', 'religion': 'Rel',
                'politics': 'Pol', 'economy': 'Ekon', 'military': 'Mil'
            };
            specializedLabel = labelMap[possibleSpecType];
        }


        // ============================================
        // STEP 0.1: USER FORCED VERBS (Manual Overrides)
        // Words strictly identified by user as verbs despite dictionary type
        // ============================================
        const USER_FORCED_VERBS = new Set([
            "toppmatad", "ifatt", "jämfota", "poste restante", "tillkänna",
            "få förkylning", "få rätt till ersättning", "leda till fängelse",
            "motsvarar en förtidspension i pengar",
            "och kopplat ett grepp på mig",
            "avlyssning", "bereda ett ärende", "framställa yrkande", "föredra ett ärende",
            "begära omprövning", "bevilja permission", "göra gällande", "leva på existensminimum",
            "avskiljes - avskiljning", "avsöndrar - avsöndring", "brista - bristning",
            "komma smygande", "upprätthålla kroppens balans",
            "dämpar sköldkörtelns hormonproduktion", "irriterar mig", "kläcks i sötvatten",
            "led av depression", "lider av färgblindhet", "tar hela kuren",
            "återfår normal funktion", "mäta barnets viktutveckling", "leda till blindhet",
            "tillåter mig", "rörande", "skrattar åt mig",
            "upprätta bouppteckning", "upprätta åtgärdsprogram", "höja sin kompetens",
            "upprätta en handling", "ökar lusten till lärande",
            "ankar", "avvägar", "blåsa", "flimmer", "jade", "ranka", "skäll", "styr"
        ]);

        if (USER_FORCED_VERBS.has(wordLower)) {
            return { type: 'verb', color: TypeColors.verb, specializedLabel };
        }


        // ============================================
        // STEP 0.5: RESPECT DICTIONARY TYPE IF KNOWN (HIGHEST PRIORITY)
        // ============================================
        // If dictionary explicitly says Adjektiv, believe it! 
        // This MUST come before closed classes and suffix rules.
        if (normalizedType.includes('adjektiv') || normalizedType === 'adj') {
            return { type: 'adjective', color: TypeColors.adjective, specializedLabel };
        }
        // Protect Adverbs, Prepositions, Conjunctions from being misclassified as verbs
        if (normalizedType.includes('adverb') || normalizedType === 'adv') {
            return { type: 'adverb', color: TypeColors.adverb, specializedLabel };
        }
        if (normalizedType.includes('preposition') || normalizedType === 'prep') {
            return { type: 'preposition', color: TypeColors.preposition, specializedLabel };
        }
        if (normalizedType.includes('konjunktion') || normalizedType === 'konj') {
            return { type: 'conjunction', color: TypeColors.conjunction, specializedLabel };
        }
        if (normalizedType.includes('interjektion') || normalizedType === 'interj') {
            return { type: 'interjection', color: TypeColors.interjection, specializedLabel };
        }

        // CRITICAL FIX: Prioritize Explicit Nouns to prevent false positives in heuristic steps
        // e.g. "Signatur" (ends in r, Arabic starts with Ta) -> Misclassified as Verb without this
        if (normalizedType.includes('subst') || normalizedType === 'noun' ||
            normalizedType === 'en' || normalizedType === 'ett') {
            // We will refine gender later, but for now we know it is NOT a verb
            // Fall through to gender detection BUT skip verb heuristics?
            // Better to return early if we can deterministically find gender, 
            // otherwise let it fall through but we need a flag? 
            // Actually, we can just return a temporary "noun" type and let the caller/color system handle it, 
            // or better yet, do the gender detection HERE.

            // Priority: 1. Explicit gender parameter, 2. Type-based gender, 3. Forms-based detection
            let genderFromType: 'en' | 'ett' | null = null;
            if (genderLower === 'ett' || normalizedType === 'ett') {
                genderFromType = 'ett';
            } else if (genderLower === 'en' || normalizedType === 'en') {
                genderFromType = 'en';
            }
            const genderFromForms = this.detectNounGender(formsLower, wordLower);
            
            // Explicit gender parameter should have highest priority
            const finalGender = (genderLower as 'en' | 'ett') || genderFromType || genderFromForms || 'en';
            return { type: finalGender, color: TypeColors[finalGender], gender: finalGender, specializedLabel };
        }

        if (normalizedType.includes('verb') || normalizedType === 'v') {
            // Try to get verb group, but ensure it's returned as verb
            const group = this.detectVerbGroup(formsLower, wordLower);
            return {
                type: 'verb',
                color: TypeColors.verb,
                verbGroup: group || undefined,
                specializedLabel
            };
        }

        // ============================================
        // STEP 0: CLOSED CLASSES CHECK (Fast Path - Gate 0)
        // User-provided optimization for O(1) lookup of common closed-class words.
        // ============================================
        const CLOSED_CLASSES = {
            pronouns: new Set([
                "jag", "du", "han", "hon", "den", "det", "vi", "ni", "de", "honom", "henne",
                "oss", "er", "dem", "min", "din", "sin", "vår", "er", "deras", "någon", "ingen", "alla", "man", "själv"
            ]),
            prepositions: new Set([
                "i", "på", "till", "från", "med", "utan", "av", "under", "över", "vid", "för", "om", "mellan", "hos", "genom", "mot"
            ]),
            conjunctions: new Set([
                "och", "men", "eller", "att", "om", "eftersom", "när", "då", "medan", "fast", "samt"
            ])
        };

        if (CLOSED_CLASSES.pronouns.has(wordLower)) return { type: 'pronoun', color: TypeColors.pronoun, specializedLabel, gender: 'en' as 'en' | 'ett' };
        if (CLOSED_CLASSES.prepositions.has(wordLower)) return { type: 'preposition', color: TypeColors.preposition, specializedLabel };
        if (CLOSED_CLASSES.conjunctions.has(wordLower)) return { type: 'conjunction', color: TypeColors.conjunction, specializedLabel };





        // ============================================
        // STEP 0.7: SMART MORPHOLOGICAL ANALYSIS (The "Intelligence" Layer)
        // Infer gender based on Swedish grammar rules and common suffixes.
        // MOVED UP: To catch suffix-based nouns (e.g. -ning, -else) before Arabic heuristic (Step 0.8)
        // this fixes cases like "Signaturförfalskning" (starts with Ta in Arabic) being seen as a verb.
        // ============================================

        // 1. Specific Word Endings (Compounds & Helper List)
        const specificSuffixes: Record<string, 'en' | 'ett'> = {
            'stajl': 'en', // User Request
            'vitamin': 'ett', 'kassett': 'en', 'station': 'en', 'blomma': 'en', 'skola': 'en',
            'hus': 'ett', 'ljus': 'ett', 'bord': 'ett', 'stol': 'en', 'boll': 'en', 'bok': 'en',
            'tidning': 'en', 'bil': 'en', 'båt': 'en', 'tåg': 'ett', 'flyg': 'ett', 'jobb': 'ett',
            'system': 'ett', 'program': 'ett', 'problem': 'ett', 'rum': 'ett', 'vatten': 'ett',
            'land': 'ett', 'språk': 'ett', 'fond': 'en', 'fonden': 'en', 'dator': 'en',
            'skiva': 'en', 'pengar': 'en', 'konto': 'ett', 'kort': 'ett',
            'trakasserier': 'ett', 'kuren': 'en', 'lån': 'ett',
            'risk': 'en', // risk matches 'isk' otherwise
            'disk': 'en', // disk matches 'isk' otherwise (Medicinsk term: Disk)
            'mäktig': 'en' // fullmäktig matches 'ig' otherwise (Juridisk term)
        };

        for (const suffix in specificSuffixes) {
            if (wordLower.endsWith(suffix)) {
                const g = specificSuffixes[suffix];
                return { type: g, color: TypeColors[g], gender: g, specializedLabel };
            }
        }

        // 2. Grammatical Suffixes (Noun Morphology Rules)
        const nounMorphologyRules: { endsWith: string, gender: 'en' | 'ett' }[] = [
            // EN words
            { endsWith: 'het', gender: 'en' },    // nyhet, frihet (User suggestion)
            { endsWith: 'ing', gender: 'en' },    // tidning, parkering (User suggestion)
            { endsWith: 'ning', gender: 'en' },   // d:o
            { endsWith: 'tion', gender: 'en' },   // station, lektion (User suggestion)
            { endsWith: 'ssion', gender: 'en' },  // diskussion
            { endsWith: 'sion', gender: 'en' },   // vision
            { endsWith: 'else', gender: 'en' },   // händelse (User suggestion)
            { endsWith: 'nad', gender: 'en' },    // skillnad
            { endsWith: 'ism', gender: 'en' },    // realism
            { endsWith: 'ist', gender: 'en' },    // artist
            { endsWith: 'lek', gender: 'en' },    // storlek (User suggestion)

            { endsWith: 'logi', gender: 'en' },   // biologi
            { endsWith: 'grafi', gender: 'en' },  // geografi
            { endsWith: 'ans', gender: 'en' },    // balans, ambulans
            { endsWith: 'ens', gender: 'en' },    // konferens

            // ETT words
            { endsWith: 'ande', gender: 'ett' },  // meddelande (verb nouns)
            { endsWith: 'ende', gender: 'ett' },  // utseende
            { endsWith: 'um', gender: 'ett' },    // museum, datum
            { endsWith: 'em', gender: 'ett' },    // problem, system
            { endsWith: 'eri', gender: 'ett' },   // bageri
            { endsWith: 'tek', gender: 'ett' },   // bibliotek, apotek
            { endsWith: 'ment', gender: 'ett' }   // instrument, dokument
        ];

        for (const rule of nounMorphologyRules) {
            if (wordLower.endsWith(rule.endsWith)) {
                return { type: rule.gender, color: TypeColors[rule.gender], gender: rule.gender, specializedLabel };
            }
        }

        // 3. Adjective Suffixes (User suggestion)
        const adjectiveSuffixes = ['lig', 'ig', 'isk', 'sam', 'bar']; // e.g. trevlig, rolig, typisk, långsam, underbar
        if (adjectiveSuffixes.some(s => wordLower.endsWith(s))) {
            // EXCEPTION: 'sig' ends in 'ig' but causes reflexive verbs to be seen as adjectives
            if (wordLower.endsWith('sig')) {
                // Ignore, let it fall through to verb detection or default
            } else {
                return { type: 'adjective', color: TypeColors.adjective, specializedLabel };
            }
        }


        // If Swedish type is ambiguous (e.g. 'Medicin', 'Tekn') AND Arabic starts with 'Ya' (ي) or 'Ta' (ت),
        // it is highly likely a Verb (Present tense).
        // This MUST be checked early to override ambiguous/incorrect metadata types.
        if (arabic && arabic.trim().length > 0) {
            // Remove common control characters (LTRM, RTLM, etc) and whitespace
            const cleanArabic = arabic.replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim();

            // Check if it starts with 'ي' (Ya) - Typical present tense verb marker in Arabic
            if (cleanArabic.startsWith('ي')) {
                // GENERALIZED RULE (User Request):
                // If it starts with 'Ya' and wasn't caught by the explicit Noun check above, 
                // we treat it as a Verb. This catches cases like "Bryta", "Berättigad till" (which might be adjectives/participles behaving as verbs or verb-like), etc.

                // Optional: We can still check for 'sig' to prevent some issues, but the user asked for a broad rule.
                // We trust the "Explicit Noun" block (step 0.5) to filter out actual nouns like "Januari", "Jubileum", etc.

                return { type: 'verb', color: TypeColors.verb, specializedLabel };
            }
        }

        // ============================================
        // STEP 1: USE EXPLICIT GENDER IF PROVIDED (from column 13)
        // ============================================
        if (genderLower === 'ett') {
            return { type: 'ett', color: TypeColors.ett, gender: 'ett', specializedLabel };
        }
        if (genderLower === 'en') {
            return { type: 'en', color: TypeColors.en, gender: 'en', specializedLabel };
        }

        // ============================================
        // STEP 1.5: SMART MORPHOLOGICAL ANALYSIS (The "Intelligence" Layer)
        // MOVED TO STEP 0.7
        // ============================================

        // ============================================
        // STEP 2: VERB DETECTION BY FORMS
        // ============================================
        const verbGroup = this.detectVerbGroup(formsLower, wordLower);
        if (verbGroup) {
            return {
                type: 'verb',
                color: TypeColors.verb,
                verbGroup,
                specializedLabel
            };
        }


        // ============================================
        // STEP 2: USE EXPLICIT GENDER IF PROVIDED (from column 13)
        // This is more reliable than inference from forms
        // ============================================
        if (genderLower === 'ett') {
            return { type: 'ett', color: TypeColors.ett, gender: 'ett', specializedLabel };
        }
        if (genderLower === 'en') {
            return { type: 'en', color: TypeColors.en, gender: 'en', specializedLabel };
        }

        // ============================================
        // STEP 3: NOUN GENDER DETECTION BY FORMS (fallback)
        // Check definite singular endings: -en/-an = En, -et = Ett
        // ============================================
        const nounGender = this.detectNounGender(formsLower, wordLower);
        if (nounGender) {
            if (nounGender === 'ett') {
                return { type: 'ett', color: TypeColors.ett, gender: 'ett', specializedLabel };
            }
            return { type: 'en', color: TypeColors.en, gender: 'en', specializedLabel };
        }

        // ============================================
        // STEP 3: ADJECTIVE DETECTION BY FORMS
        // Adjectives typically have: grundform, -t form, -a form
        // e.g., "stor, stort, stora" or "vacker, vackert, vackra"
        // ============================================
        if (this.detectAdjective(formsLower, wordLower)) {
            return { type: 'adjective', color: TypeColors.adjective, specializedLabel };
        }

        // ============================================
        // STEP 4: WORD SUFFIX HEURISTICS
        // Common Swedish word endings
        // ============================================

        // Common adverb endings
        if (wordLower.endsWith('ligen') || wordLower.endsWith('vis') ||
            wordLower.endsWith('ledes') || wordLower.endsWith('lunda')) {
            return { type: 'adverb', color: TypeColors.adverb, specializedLabel };
        }

        // Common noun suffixes indicating Ett-words
        const ettSuffixes = [
            'rum', 'hus', 'tak', 'golv', 'bord', 'berg', 'land', 'ljus',
            'block', 'kort', 'slag', 'spel', 'verk', 'djur', 'krig', 'skap',
            'vatten', 'fönster', 'papper', 'system', 'arbete', 'centrum',
            'museum', 'program', 'dokument', 'brott', 'mord', 'äktenskap'
        ];
        if (ettSuffixes.some(s => wordLower.endsWith(s))) {
            return { type: 'ett', color: TypeColors.ett, gender: 'ett', specializedLabel };
        }

        // Common noun suffixes indicating En-words
        const enSuffixes = [
            'ning', 'tion', 'sion', 'het', 'else', 'ande', 'ende',
            'itet', 'dom', 'ism', 'ist', 'are', 'ler', 'rer', 'nad',
            'gård', 'väg', 'gata', 'plats', 'dörr', 'bil', 'maskin',
            'station', 'motor', 'pump', 'dag', 'natt', 'stad', 'feber'
        ];
        if (enSuffixes.some(s => wordLower.endsWith(s))) {
            return { type: 'en', color: TypeColors.en, gender: 'en', specializedLabel };
        }




        // ============================================
        // STEP 5: FALLBACK TO TYPE FIELD (LAST RESORT)
        // Only use if all forms-based detection failed
        // ============================================


        // Phrasal verbs
        if (normalizedType.includes('verbmn') || (normalizedType.includes('verb') && word.includes(' '))) {
            return { type: 'phrasal', color: TypeColors.phrasal, specializedLabel };
        }

        // Basic type matching (unreliable but better than nothing)
        if (normalizedType === 'adv' || normalizedType.includes('adverb')) {
            return { type: 'adverb', color: TypeColors.adverb, specializedLabel };
        }

        // Basic type matching (unreliable but better than nothing)
        if (normalizedType === 'verb' || normalizedType.includes('verb')) {
            return { type: 'verb', color: TypeColors.verb, specializedLabel };
        }
        if (normalizedType.includes('subst')) {
            // Default to En if we couldn't determine gender
            return { type: 'en', color: TypeColors.en, gender: 'en', specializedLabel };
        }
        if (normalizedType === 'adj' || normalizedType.startsWith('adj ') || normalizedType.includes('adjektiv')) {
            return { type: 'adjective', color: TypeColors.adjective, specializedLabel };
        }
        if (normalizedType.includes('prep')) {
            return { type: 'preposition', color: TypeColors.preposition, specializedLabel };
        }
        if (normalizedType.includes('konj')) {
            return { type: 'conjunction', color: TypeColors.conjunction, specializedLabel };
        }
        if (normalizedType.includes('pron')) {
            return { type: 'pronoun', color: TypeColors.pronoun, specializedLabel };
        }
        if (normalizedType.includes('interj')) {
            return { type: 'interjection', color: TypeColors.interjection, specializedLabel };
        }

        // If we have a specialized label but couldn't detect grammatical type, 
        // try to guess grammatical type from the label or default to Noun (safest bet)
        if (specializedLabel) {
            // Most specialized terms are nouns or adjectives. 
            // If it wasn't detected as Adj above, default to Noun.
            return { type: 'en', color: TypeColors.en, gender: 'en', specializedLabel };
        }

        // ============================================
        // STEP 6: TYPE_ALIASES FALLBACK
        // Use TYPE_ALIASES to detect uncommon types like phrasal, numeral, etc.
        // ============================================
        const aliasType = TYPE_ALIASES[normalizedType];
        if (aliasType && TypeColors[aliasType]) {
            return { type: aliasType, color: TypeColors[aliasType], specializedLabel };
        }
        // Handle alias types that map to standard types with different names
        const aliasTypeMap: Record<string, string> = {
            'noun': 'en',
            'numeral': 'numeral'
        };
        if (aliasType && aliasTypeMap[aliasType] && TypeColors[aliasTypeMap[aliasType]]) {
            return { type: aliasTypeMap[aliasType], color: TypeColors[aliasTypeMap[aliasType]], specializedLabel };
        }
        // If alias exists but no color, at least return the alias type  
        if (aliasType) {
            return { type: aliasType, color: TypeColors.default, specializedLabel };
        }

        // ============================================
        // DEFAULT: Unknown type
        // ============================================
        return { type: 'default', color: TypeColors.default };
    },

    /**
     * Detect verb group from forms (1-4)
     */
    /**
     * Detect verb group from forms (1-4)
     * Checks form positions to distinguish from nouns
     * Noun forms: sg.indef, sg.def, pl.indef (often -ar/-er), pl.def
     * Verb forms: pres (often -ar/-er), pret, sup, imp
     */
    detectVerbGroup(formsLower: string, wordLower: string): number | null {
        const parts = formsLower.split(',').map(f => f.trim());

        // CRITICAL: Forms must contain at least 2 comma-separated parts to be valid verb forms
        // Descriptive text like "Juridisk term: Brottsplats" has no commas and should not be detected as verb
        if (parts.length < 2) return null;

        // Also skip if forms contain "term:" or similar descriptive patterns
        if (formsLower.includes('term:') || formsLower.includes('term ')) return null;

        const firstForm = parts[0];

        // Group 1: -ar, -ade (e.g., arbetar, arbetade)
        // CRITICAL FIX: Ensure -ar is in the FIRST form (present tense), not 3rd (plural noun)
        if (firstForm.endsWith('ar') && formsLower.match(/\w+ade[,\s]/)) {
            return 1;
        }

        // Group 2: -er, -de/-te (e.g., stänger, stängde or köper, köpte)
        // CRITICAL FIX: Ensure -er is in the FIRST form
        if (firstForm.endsWith('er') && (formsLower.match(/\w+de[,\s]/) || formsLower.match(/\w+te[,\s]/))) {
            // Verify it's not a noun like 'saker' (sak, saken, saker)
            // If the word itself doesn't end in 'er' but the first form does, it's likely a verb
            // If the word is 'stänger' and forms start with 'stänger', it's a verb
            return 2;
        }

        // Group 3: -dde (e.g., bodde from bo)
        if (formsLower.match(/\w+dde[,\s]/)) {
            return 3;
        }

        // Group 4: -it/-its/-ats/-ett strong/irregular verbs
        if (formsLower.match(/\w+(it|its|ats|ett)[,\s]/) || formsLower.match(/\w+(it|its|ats|ett)$/)) {
            // Ensure not a noun ending in -et (huset)
            // Also ensure not a noun ending in -it (Bronkit, Bandit, Merit) - Lemmas ending in -it are rarely verbs
            if (!firstForm.endsWith('et') && !wordLower.endsWith('it')) {
                return 4;
            }
        }

        // Passive verbs ending in -as
        if (wordLower.endsWith('as') && formsLower.match(/\w+ades[,\s]|\w+des[,\s]/)) {
            return 4;
        }

        return null;
    },

    /**
     * Detect adjective from forms
     * Swedish adjectives typically have 3 forms: grundform, -t form, -a form
     * e.g., "stor, stort, stora" or "vacker, vackert, vackra"
     */
    detectAdjective(formsLower: string, wordLower: string): boolean {
        const parts = formsLower.split(',').map(f => f.trim());

        if (parts.length >= 3) {
            const base = parts[0];
            const tForm = parts[1];
            const aForm = parts[2];

            // Check for typical adjective pattern: base, base+t, base+a
            // Or: base, base+rt, base+ra (for adjectives like "vacker")
            if (tForm.endsWith('t') && aForm.endsWith('a')) {
                // Verify it's not a noun pattern
                // Nouns typically have: singular, definite, plural, def.plural
                // Adjectives have: grund, neuter, plural/definite

                // Additional check: adjective -t form should be similar to base
                // Skip if this looks like a noun (hus, huset, hus, husen)
                if (base === aForm.slice(0, -1) ||
                    (base.endsWith('er') && tForm.endsWith('ert')) ||
                    (base.endsWith('el') && tForm.endsWith('elt')) ||
                    (base.endsWith('en') && tForm.endsWith('et'))) {
                    return true;
                }

                // Check if tForm is base + 't'
                if (tForm === base + 't') {
                    return true;
                }
            }
        }

        // Common adjective endings
        if (wordLower.endsWith('lig') || wordLower.endsWith('ig') ||
            wordLower.endsWith('sam') || wordLower.endsWith('full') ||
            wordLower.endsWith('lös') || wordLower.endsWith('bar') ||
            wordLower.endsWith('aktig') || wordLower.endsWith('mässig')) {

            // EXCEPTION: 'sig' ends in 'ig' but is reflexive verb marker
            if (wordLower.endsWith('sig')) return false;

            return true;
        }

        return false;
    },

    /**
     * Detect noun gender (en/ett) from forms
     */
    detectNounGender(formsLower: string, wordLower: string): 'en' | 'ett' | null {
        const formParts = formsLower.split(',').map(f => f.trim());

        if (formParts.length >= 2) {
            const definiteSingular = formParts[1];
            // Ett-words end in -et (e.g., huset, barnet)
            if (definiteSingular.endsWith('et')) {
                return 'ett';
            }
            // En-words end in -en or -an (e.g., bilen, flickan)
            if ((definiteSingular.endsWith('en') || definiteSingular.endsWith('an')) && !definiteSingular.endsWith('et')) {
                return 'en';
            }
        }

        // Check for explicit "en " or "ett " in forms
        if (formsLower.startsWith('en ') || formsLower.match(/\ben\s+/)) {
            return 'en';
        }
        if (formsLower.startsWith('ett ') || formsLower.match(/\bett\s+/)) {
            return 'ett';
        }

        // Suffix heuristics for unknown nouns
        const ettSuffixes = ['rum', 'kar', 'hus', 'tak', 'golv', 'bord', 'berg', 'land', 'ljus', 'block', 'kort', 'slag', 'spel', 'verk', 'djur', 'krig', 'skap'];
        if (ettSuffixes.some(s => wordLower.endsWith(s))) {
            return 'ett';
        }

        return null; // Unknown
    },

    // ============================================
    // CSS CLASS GENERATORS
    // ============================================

    /**
     * Get CSS class for grammar badge (e.g., 'grammar-verb', 'grammar-en')
     */
    getGrammarClass(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);
        return `grammar-${result.color.classToken}`;
    },

    /**
     * Get CSS class for data-type attribute (used in search cards)
     */
    getTypeClass(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);
        return `type-${result.color.classToken}`;
    },

    /**
     * Get CSS glow class for hero sections (e.g., 'glow-verb', 'glow-noun')
     */
    getGlowClass(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);

        // Map to glow classes - PRIORITIZE GRAMMAR
        const glowMap: Record<string, string> = {
            'verb': 'glow-verb',
            'en': 'glow-en', // Use Turquoise glow for en
            'ett': 'glow-ett', // Use explicit Green glow for ett
            'noun': 'glow-en', // Noun defaults to glow-en (Turquoise)
            'adjective': 'glow-adjective',
            'adj': 'glow-adjective',
            'adverb': 'glow-adverb',
            'adv': 'glow-adverb',
            'preposition': 'glow-preposition',
            'conjunction': 'glow-conjunction',
            'interjection': 'glow-interjection',
            'phrasal': 'glow-phrasal',
            'pronoun': 'glow-pronoun',
        };

        if (glowMap[result.type]) {
            return glowMap[result.type];
        }

        // Fallback: Specialized Types
        if (result.specializedLabel) {
            const labelMap: Record<string, string> = {
                'Med': 'glow-medical',
                'Jur': 'glow-legal',
                'Bygg': 'glow-construction',
                'Tekn': 'glow-tech',
                'Nat': 'glow-science',
                'Rel': 'glow-religion',
                'Pol': 'glow-politics',
                'Ekon': 'glow-economy',
                'Mil': 'glow-military'
            };
            if (labelMap[result.specializedLabel]) {
                return labelMap[result.specializedLabel];
            }
        }
        return 'glow-default';
    },

    /**
     * Get CSS type class for hero sections (e.g., 'type-verb', 'type-noun')
     */
    getHeroTypeClass(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);

        // Priority 1: Grammar Types
        if (['verb', 'en', 'ett', 'noun', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'phrasal', 'pronoun'].includes(result.type)) {
            return `type-${result.type}`;
        }

        // Priority 2: Specialized Types
        if (result.specializedLabel) {
            const labelMap: Record<string, string> = {
                'Med': 'type-medical',
                'Jur': 'type-legal',
                'Bygg': 'type-construction',
                'Tekn': 'type-tech',
                'Nat': 'type-science',
                'Rel': 'type-religion',
                'Pol': 'type-politics',
                'Ekon': 'type-economy',
                'Mil': 'type-military'
            };
            if (labelMap[result.specializedLabel]) {
                return labelMap[result.specializedLabel];
            }
        }
        return `type-${result.type}`;
    },

    /**
         * Get category string for filtering (e.g., 'verb', 'noun', 'adj')
         * Note: This combines en/ett into 'subst' for filtering purposes (Substantiv)
         * Specialized labels (Jur, Med) are ignored - only grammatical type matters for filtering
         */
    getCategory(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);

        // Map detected types to filter values (matches index.html typeSelect)
        const categoryMap: Record<string, string> = {
            // Basic grammatical types - ALWAYS use these for filtering
            'en': 'subst',
            'ett': 'subst',
            'noun': 'subst',
            'adjective': 'adj',
            'adverb': 'adv',
            'preposition': 'prep',
            'conjunction': 'konj',
            'pronoun': 'pron',
            'interjection': 'interj',
            'numeral': 'num',
            'phrasal': 'fras',
            'verb': 'verb',
        };

        // Always return grammatical type, ignore specialized labels for filtering
        return categoryMap[result.type] || result.type;
    },

    /**
     * Get data-type string for CSS styling (keeps en/ett distinct)
     * Use this for card borders and visual styling
     */
    getDataType(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);

        // Priority 1: Standard Grammar Types - Map to CSS-friendly values
        // If we identified a specific valid grammar type, use it.
        const typeMap: Record<string, string> = {
            'adjective': 'adj',
            'adverb': 'adv',
            'preposition': 'prep',
            'conjunction': 'conj',
            'interjection': 'interj',
            'phrasal': 'phrasal',
            'number': 'num',
            'pronoun': 'pronoun',
            // En/Ett are distinct types in CSS
            'en': 'en',
            'ett': 'ett',
            'verb': 'verb'
        };

        if (typeMap[result.type]) {
            return typeMap[result.type];
        }

        // Priority 2: Specialized Label (Medical, Legal, etc.) - Fallback if grammar is generic or unknown
        if (result.specializedLabel) {
            const labelMap: Record<string, string> = {
                'Med': 'medical',
                'Jur': 'legal',
                'Bygg': 'construction',
                'Tekn': 'tech',
                'Nat': 'science',
                'Rel': 'religion',
                'Pol': 'politics',
                'Ekon': 'economy',
                'Mil': 'military'
            };
            if (labelMap[result.specializedLabel]) {
                return labelMap[result.specializedLabel];
            }
        }

        return result.type;
    },

    // ============================================
    // INLINE STYLE GENERATORS
    // ============================================

    /**
     * Get inline CSS for border color
     */
    getBorderStyle(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);
        return `border-color: ${result.color.primary}`;
    },

    /**
     * Get inline CSS for text color
     */
    getTextStyle(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);
        return `color: ${result.color.primary}`;
    },

    /**
     * Get CSS custom property for glow color
     */
    getGlowColorVar(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);
        return `--glow-color: ${result.color.primary}`;
    },

    /**
     * Get full color definition for custom styling
     */
    getColor(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): ColorDefinition {
        const result = this.detect(type, word, forms, gender, arabic);
        return result.color;
    },

    // ============================================
    // HTML GENERATORS
    // ============================================

    /**
     * Generate HTML badge for search cards
     */
    generateBadge(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = ''): string {
        const result = this.detect(type, word, forms, gender, arabic);
        let color = result.color;

        let label = color.label.sv;

        // Customize label and color based on detailed detection
        if (result.type === 'verb' && result.verbGroup) {
            label = `Gr. ${result.verbGroup}`;
            // Use verb group specific color
            const verbGroupKey = `verb${result.verbGroup}` as keyof typeof TypeColors;
            if (TypeColors[verbGroupKey]) {
                color = TypeColors[verbGroupKey];
            }
        } else if (result.type === 'en') {
            label = 'En';
        } else if (result.type === 'ett') {
            label = 'Ett';
        } else if (result.type === 'adjective') {
            label = 'Adj';
        } else if (result.type === 'adverb') {
            label = 'Adv';
        }

        // Append specialized label if present (e.g., "En Med", "Adj Jur")
        if (result.specializedLabel) {
            label += ` ${result.specializedLabel}`;
        }

        // Use classToken from color definition
        const cssClass = `grammar-badge grammar-${color.classToken}`;

        // Inline style fallback using primary color
        const style = `border-color: ${color.primary}; color: ${color.primary};`;

        return `<span class="${cssClass}" style="${style}">${label}</span>`;
    },

    /**
     * Generate badge for Details page (usually larger)
     */
    generateTypeBadge(type: string, word: string = '', forms: string = '', gender: string = '', arabic: string = '', isLarge = false): string {
        const result = this.detect(type, word, forms, gender, arabic);
        const color = result.color;

        let label = isLarge ? (color.label.sv) : (color.label.sv.substring(0, 3).toUpperCase());

        if (result.type === 'verb' && result.verbGroup) {
            label = isLarge ? `Verb (Grupp ${result.verbGroup})` : `Gr. ${result.verbGroup}`;
        } else if (result.type === 'en') {
            label = isLarge ? 'En-ord (Substantiv)' : 'En';
        } else if (result.type === 'ett') {
            label = isLarge ? 'Ett-ord (Substantiv)' : 'Ett';
        }

        // Append specialized label
        if (result.specializedLabel) {
            if (isLarge) {
                label += ` (${result.specializedLabel})`;
            } else {
                label += ` ${result.specializedLabel}`;
            }
        }

        const sizeClass = isLarge ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5';

        return `
            <span class="inline-flex items-center rounded-full border font-medium ${sizeClass}"
                  style="border-color: ${color.primary}; color: ${color.primary}; background-color: ${color.background}">
                ${label}
            </span>
        `;
    }
};

// ============================================
// GLOBAL EXPORTS
// ============================================

if (typeof window !== 'undefined') {
    (window as any).TypeColorSystem = TypeColorSystem;
    (window as any).TypeColors = TypeColors;
}
